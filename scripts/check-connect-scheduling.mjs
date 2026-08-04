import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';

function source(path) {
  return readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');
}

function loadTypeScriptModule(path) {
  const output = ts.transpileModule(source(path), {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
    },
    fileName: path,
  }).outputText;
  const sandboxModule = {exports: {}};
  vm.runInNewContext(output, {
    module: sandboxModule,
    exports: sandboxModule.exports,
    require(specifier) {
      throw new Error(`Unexpected runtime import in ${path}: ${specifier}`);
    },
    console,
  });
  return sandboxModule.exports;
}

function requireText(path, text, explanation) {
  if (!source(path).includes(text)) {
    throw new Error(`${path}: ${explanation}`);
  }
}

const matching = loadTypeScriptModule('lib/connect/matching.ts');
const scheduling = loadTypeScriptModule('lib/connect/scheduling.ts');

assert.equal(
  scheduling.schedulingSlotsOverlap(
    {
      startsAt: '2026-08-10T09:00:00.000Z',
      endsAt: '2026-08-10T09:45:00.000Z',
    },
    {
      startsAt: '2026-08-10T09:30:00.000Z',
      endsAt: '2026-08-10T10:15:00.000Z',
    },
  ),
  true,
  'overlapping meetings must be detected',
);
assert.equal(
  scheduling.schedulingSlotsOverlap(
    {
      startsAt: '2026-08-10T09:00:00.000Z',
      endsAt: '2026-08-10T09:45:00.000Z',
    },
    {
      startsAt: '2026-08-10T09:45:00.000Z',
      endsAt: '2026-08-10T10:30:00.000Z',
    },
  ),
  false,
  'back-to-back meetings must not be treated as overlapping',
);

function profile(role, timezone, availability) {
  return {
    id: role,
    role,
    status: 'active',
    timezone,
    availability,
  };
}

const now = new Date('2026-08-07T00:00:00.000Z');
const mondayOnly = matching.findNextCommonMeetingSlots(
  profile('survivor', 'UTC', ['mon-morning']),
  profile('warrior', 'UTC', ['mon-morning']),
  now,
  3,
);
assert.equal(mondayOnly.length, 3, 'three shared options should be returned');
for (const slot of mondayOnly) {
  assert.equal(
    new Date(slot.endsAt).getTime() - new Date(slot.startsAt).getTime(),
    45 * 60 * 1000,
    'each option should last 45 minutes',
  );
}
assert.ok(
  mondayOnly.every((slot, index) => (
    index === 0 ||
    new Date(slot.startsAt).getTime() -
      new Date(mondayOnly[index - 1].startsAt).getTime() >= 12 * 60 * 60 * 1000
  )),
  'options should be meaningfully separated',
);

const weekdayEvenings = ['mon', 'tue', 'wed', 'thu', 'fri'].map(
  (day) => `${day}-evening`,
);
const weekdayMornings = ['mon', 'tue', 'wed', 'thu', 'fri'].map(
  (day) => `${day}-morning`,
);
const crossTimezone = matching.findNextCommonMeetingSlots(
  profile('survivor', 'Europe/Bucharest', weekdayEvenings),
  profile('warrior', 'America/New_York', weekdayMornings),
  now,
  3,
);
assert.equal(
  crossTimezone.length,
  3,
  'time-zone conversion should still return three mutually valid options',
);
assert.equal(
  matching.findNextCommonMeetingSlots(
    profile('survivor', 'UTC', ['mon-morning']),
    profile('warrior', 'UTC', ['tue-evening']),
    now,
    3,
  ).length,
  0,
  'incompatible availability should return no options',
);

const options = [
  {
    id: 'option-a',
    startsAt: '2026-08-10T09:00:00.000Z',
    endsAt: '2026-08-10T09:45:00.000Z',
  },
  {
    id: 'option-b',
    startsAt: '2026-08-11T09:00:00.000Z',
    endsAt: '2026-08-11T09:45:00.000Z',
  },
  {
    id: 'option-c',
    startsAt: '2026-08-12T09:00:00.000Z',
    endsAt: '2026-08-12T09:45:00.000Z',
  },
];
const connection = {
  id: 'connection',
  proposalId: 'proposal',
  survivorId: 'survivor',
  warriorId: 'warrior',
  status: 'needs-scheduling',
  schedulingOptions: options,
  createdAt: now.toISOString(),
  updatedAt: now.toISOString(),
};

let result = scheduling.selectSchedulingOption(
  connection,
  'survivor',
  'option-a',
  'claim-one',
  now,
);
assert.equal(result.shouldCreateMeeting, false);
result = scheduling.selectSchedulingOption(
  connection,
  'warrior',
  'option-b',
  'claim-two',
  now,
);
assert.equal(result.shouldCreateMeeting, false);
result = scheduling.selectSchedulingOption(
  connection,
  'survivor',
  'option-b',
  'claim-three',
  now,
);
assert.equal(result.shouldCreateMeeting, true);
assert.equal(connection.schedulingClaim.id, 'claim-three');

const duplicate = scheduling.selectSchedulingOption(
  connection,
  'warrior',
  'option-b',
  'claim-four',
  now,
);
assert.equal(
  duplicate.shouldCreateMeeting,
  false,
  'a second concurrent confirmation must not create another Meet',
);
assert.equal(connection.schedulingClaim.id, 'claim-three');

connection.schedulingClaim.claimedAt = new Date(
  now.getTime() - 11 * 60 * 1000,
).toISOString();
const recovered = scheduling.selectSchedulingOption(
  connection,
  'warrior',
  'option-b',
  'claim-five',
  now,
);
assert.equal(recovered.shouldCreateMeeting, true);
assert.equal(
  connection.schedulingClaim.id,
  'claim-five',
  'a stale scheduling claim should be recoverable',
);

const ended = {
  ...connection,
  status: 'ended',
  schedulingClaim: undefined,
  schedulingSelections: undefined,
};
assert.throws(
  () => scheduling.selectSchedulingOption(
    ended,
    'survivor',
    'option-a',
    'claim-six',
    now,
  ),
  /CONNECTION_NOT_SCHEDULABLE/,
  'an ended connection must reject scheduling',
);
assert.throws(
  () => scheduling.selectSchedulingOption(
    {...connection, schedulingClaim: undefined},
    'survivor',
    'missing-option',
    'claim-seven',
    now,
  ),
  /SCHEDULING_OPTION_UNAVAILABLE/,
  'an unknown option must be rejected',
);

requireText(
  'lib/connect/service.ts',
  "record.schedulingClaim?.id !== claim.id",
  'calendar creation must be finalized only by the winning scheduling claim',
);
requireText(
  'lib/connect/service.ts',
  'reserveMeetingForParticipants(connection, claim.id, option)',
  'participant reservations must prevent cross-connection double booking',
);
requireText(
  'lib/connect/service.ts',
  'await storedMeetingConflicts(connection, option)',
  'legacy scheduled meetings must be checked before a new reservation',
);
requireText(
  'lib/connect/service.ts',
  'await cancelConnectMeeting(meeting.eventId)',
  'an orphaned Meet must be cancelled if connection finalization loses its claim',
);
requireText(
  'app/api/connect/portal/route.ts',
  "'select-meeting-time'",
  'the private portal must expose the confirmed-time action',
);
requireText(
  'components/connect/ConnectPortal.tsx',
  'aria-pressed={mine}',
  'meeting options must expose their selected state accessibly',
);
requireText(
  'components/connect/ConnectApplication.tsx',
  'three shared 45-minute options',
  'the application must explain the confirmed scheduling flow',
);

console.log('TCW Connect confirmed scheduling checks passed.');
