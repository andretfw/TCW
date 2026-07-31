import type {
  AvailabilityKey,
  ConnectProfile,
  DayPeriod,
  MatchProposal,
  Weekday,
} from './types';

const MIN_MATCH_SCORE = 60;
const MEETING_DURATION_MINUTES = 45;
const EARLIEST_MEETING_HOURS = 48;
const LATEST_MEETING_DAYS = 30;

const WEEKDAY_BY_SHORT_NAME: Record<string, Weekday> = {
  Mon: 'mon',
  Tue: 'tue',
  Wed: 'wed',
  Thu: 'thu',
  Fri: 'fri',
  Sat: 'sat',
  Sun: 'sun',
};

const PERIOD_LIMITS: Record<DayPeriod, [number, number]> = {
  morning: [9 * 60, 12 * 60],
  afternoon: [13 * 60, 17 * 60],
  evening: [18 * 60, 21 * 60],
};

function normalized(value: string | undefined): string {
  return (value || '').trim().toLowerCase();
}

function intersect(left: string[], right: string[]): string[] {
  const rightValues = new Set(right.map(normalized));
  return left.filter((value) => rightValues.has(normalized(value)));
}

function uniqueNormalized(values: string[]): string[] {
  return [...new Set(values.map(normalized).filter(Boolean))];
}

export interface MatchScore {
  score: number;
  reasons: string[];
}

export function calculateMatchScore(
  survivor: ConnectProfile,
  warrior: ConnectProfile,
): MatchScore | null {
  if (survivor.role !== 'survivor' || warrior.role !== 'warrior') return null;
  if (survivor.status !== 'active' || warrior.status !== 'active') return null;
  if (survivor.activeConnections >= survivor.maxConnections) return null;

  const sharedLanguages = intersect(survivor.languages, warrior.languages);
  if (sharedLanguages.length === 0) return null;

  const sharedCommunication = intersect(
    survivor.communicationMethods,
    warrior.communicationMethods,
  );
  if (sharedCommunication.length === 0) return null;

  const preference = warrior.mentorGenderPreference || 'no-preference';
  if (preference !== 'no-preference' && preference !== survivor.gender) return null;

  let score = 0;
  const reasons: string[] = [];

  if (normalized(survivor.cancerType) === normalized(warrior.cancerType)) {
    score += 35;
    reasons.push('same-cancer-type');
  }

  if (
    survivor.cancerSubtype &&
    warrior.cancerSubtype &&
    normalized(survivor.cancerSubtype) === normalized(warrior.cancerSubtype)
  ) {
    score += 10;
    reasons.push('same-cancer-subtype');
  }

  const sharedTreatments = uniqueNormalized(
    intersect(survivor.treatments, warrior.treatments),
  );
  if (sharedTreatments.length > 0) {
    score += Math.min(15, sharedTreatments.length * 5);
    reasons.push('shared-treatment-experience');
  }

  if (survivor.phase === warrior.phase) {
    score += 8;
    reasons.push('similar-cancer-phase');
  }

  const sharedTopics = uniqueNormalized(intersect(survivor.topics, warrior.topics));
  if (sharedTopics.length > 0) {
    score += Math.min(12, sharedTopics.length * 4);
    reasons.push('shared-support-topics');
  }

  score += 10;
  reasons.push('shared-language');

  score += 5;
  reasons.push('compatible-communication');

  if (survivor.timezone === warrior.timezone) {
    score += 3;
    reasons.push('same-timezone');
  }

  if (preference === 'no-preference' || preference === survivor.gender) {
    score += 2;
    reasons.push('gender-preference-compatible');
  }

  if (survivor.ageRange === warrior.ageRange) {
    score += 3;
    reasons.push('similar-age-range');
  }

  const boundedScore = Math.min(100, score);
  return boundedScore >= MIN_MATCH_SCORE
    ? {score: boundedScore, reasons}
    : null;
}

export function rankSurvivors(
  warrior: ConnectProfile,
  survivors: ConnectProfile[],
  proposals: MatchProposal[],
): Array<{survivor: ConnectProfile; score: MatchScore}> {
  const unavailablePairs = new Set(
    proposals
      .filter((proposal) => !['declined', 'expired'].includes(proposal.status))
      .map((proposal) => `${proposal.survivorId}:${proposal.warriorId}`),
  );

  return survivors
    .filter((survivor) => !unavailablePairs.has(`${survivor.id}:${warrior.id}`))
    .map((survivor) => ({
      survivor,
      score: calculateMatchScore(survivor, warrior),
    }))
    .filter(
      (candidate): candidate is {survivor: ConnectProfile; score: MatchScore} =>
        Boolean(candidate.score),
    )
    .sort((a, b) => (
      b.score.score - a.score.score ||
      a.survivor.activeConnections - b.survivor.activeConnections ||
      a.survivor.createdAt.localeCompare(b.survivor.createdAt)
    ));
}

function zonedParts(date: Date, timezone: string): {
  weekday: Weekday;
  minutes: number;
} | null {
  try {
    const parts = new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      weekday: 'short',
      hour: '2-digit',
      minute: '2-digit',
      hourCycle: 'h23',
    }).formatToParts(date);
    const weekdayName = parts.find((part) => part.type === 'weekday')?.value;
    const hour = Number(parts.find((part) => part.type === 'hour')?.value);
    const minute = Number(parts.find((part) => part.type === 'minute')?.value);
    const weekday = weekdayName ? WEEKDAY_BY_SHORT_NAME[weekdayName] : undefined;
    if (!weekday || !Number.isInteger(hour) || !Number.isInteger(minute)) return null;
    return {weekday, minutes: hour * 60 + minute};
  } catch {
    return null;
  }
}

function periodForMinutes(minutes: number): DayPeriod | null {
  for (const period of Object.keys(PERIOD_LIMITS) as DayPeriod[]) {
    const [start, end] = PERIOD_LIMITS[period];
    if (minutes >= start && minutes < end) return period;
  }
  return null;
}

function profileAvailable(
  profile: ConnectProfile,
  start: Date,
  end: Date,
): boolean {
  const localStart = zonedParts(start, profile.timezone);
  const localEnd = zonedParts(end, profile.timezone);
  if (!localStart || !localEnd || localStart.weekday !== localEnd.weekday) return false;

  const period = periodForMinutes(localStart.minutes);
  if (!period) return false;
  const [, periodEnd] = PERIOD_LIMITS[period];
  if (localEnd.minutes > periodEnd) return false;

  const key: AvailabilityKey = `${localStart.weekday}-${period}`;
  return profile.availability.includes(key);
}

function nextHalfHour(date: Date): Date {
  const next = new Date(date);
  next.setUTCSeconds(0, 0);
  const minutes = next.getUTCMinutes();
  next.setUTCMinutes(minutes < 30 ? 30 : 60);
  return next;
}

export function findNextCommonMeetingSlot(
  survivor: ConnectProfile,
  warrior: ConnectProfile,
  now = new Date(),
): {startsAt: string; endsAt: string} | null {
  const earliest = nextHalfHour(
    new Date(now.getTime() + EARLIEST_MEETING_HOURS * 60 * 60 * 1000),
  );
  const latest = new Date(now.getTime() + LATEST_MEETING_DAYS * 24 * 60 * 60 * 1000);

  for (
    let cursor = earliest;
    cursor <= latest;
    cursor = new Date(cursor.getTime() + 30 * 60 * 1000)
  ) {
    const end = new Date(cursor.getTime() + MEETING_DURATION_MINUTES * 60 * 1000);
    if (profileAvailable(survivor, cursor, end) && profileAvailable(warrior, cursor, end)) {
      return {startsAt: cursor.toISOString(), endsAt: end.toISOString()};
    }
  }

  return null;
}
