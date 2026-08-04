import 'server-only';

import {randomUUID} from 'node:crypto';

import {
  getGoogleWorkspaceAccessToken,
  GOOGLE_CALENDAR_EVENTS_SCOPE,
} from '@/lib/dream-applications/google-drive';

import type {ConnectMeeting, ConnectProfile} from './types';

const CALENDAR_EVENTS_URL =
  'https://www.googleapis.com/calendar/v3/calendars/primary/events';

interface GoogleCalendarEvent {
  id?: string;
  htmlLink?: string;
  hangoutLink?: string;
  conferenceData?: {
    entryPoints?: Array<{
      entryPointType?: string;
      uri?: string;
    }>;
    createRequest?: {
      status?: {
        statusCode?: string;
      };
    };
  };
  error?: {
    message?: string;
  };
}

function meetingUrl(event: GoogleCalendarEvent): string | undefined {
  return event.hangoutLink || event.conferenceData?.entryPoints?.find(
    (entry) => entry.entryPointType === 'video',
  )?.uri;
}

async function readEventResponse(
  response: Response,
  fallback: string,
): Promise<GoogleCalendarEvent> {
  const payload = await response.json().catch(() => ({})) as GoogleCalendarEvent;
  if (!response.ok) {
    throw new Error(payload.error?.message || fallback);
  }
  return payload;
}

async function getCreatedEvent(
  accessToken: string,
  eventId: string,
): Promise<GoogleCalendarEvent> {
  const response = await fetch(
    `${CALENDAR_EVENTS_URL}/${encodeURIComponent(eventId)}?conferenceDataVersion=1`,
    {
      headers: {Authorization: `Bearer ${accessToken}`},
      cache: 'no-store',
      signal: AbortSignal.timeout(15_000),
    },
  );
  return readEventResponse(response, 'Unable to read the scheduled TCW Connect event.');
}

export async function createConnectMeeting(input: {
  survivor: ConnectProfile;
  warrior: ConnectProfile;
  startsAt: string;
  endsAt: string;
}): Promise<ConnectMeeting> {
  const accessToken = await getGoogleWorkspaceAccessToken(
    GOOGLE_CALENDAR_EVENTS_SCOPE,
  );
  const url = new URL(CALENDAR_EVENTS_URL);
  url.searchParams.set('conferenceDataVersion', '1');
  url.searchParams.set('sendUpdates', 'all');

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      summary: 'TCW Connect conversation',
      description:
        'Private peer-support conversation arranged through TCW Connect. Please do not forward this invitation. No recording or transcription is authorised by TCW.',
      start: {dateTime: input.startsAt},
      end: {dateTime: input.endsAt},
      attendees: [
        {email: input.survivor.email},
        {email: input.warrior.email},
      ],
      conferenceData: {
        createRequest: {
          requestId: randomUUID(),
          conferenceSolutionKey: {type: 'hangoutsMeet'},
        },
      },
      guestsCanInviteOthers: false,
      guestsCanModify: false,
      guestsCanSeeOtherGuests: true,
      visibility: 'private',
      reminders: {
        useDefault: false,
        overrides: [
          {method: 'email', minutes: 24 * 60},
          {method: 'popup', minutes: 30},
        ],
      },
      extendedProperties: {
        private: {
          tcwProgram: 'connect',
          tcwSurvivorId: input.survivor.id,
          tcwWarriorId: input.warrior.id,
        },
      },
    }),
    cache: 'no-store',
    signal: AbortSignal.timeout(20_000),
  });

  let event = await readEventResponse(
    response,
    'Google Calendar could not create the TCW Connect meeting.',
  );
  if (!event.id) throw new Error('Google Calendar did not return an event ID.');
  const eventId = event.id;

  if (!meetingUrl(event)) {
    event = await getCreatedEvent(accessToken, eventId);
  }

  const meetUrl = meetingUrl(event);
  if (!meetUrl) {
    throw new Error('Google Calendar created the event without a Google Meet link.');
  }

  return {
    eventId,
    startsAt: input.startsAt,
    endsAt: input.endsAt,
    meetUrl,
    calendarUrl: event.htmlLink,
    createdAt: new Date().toISOString(),
  };
}


export async function cancelConnectMeeting(eventId: string): Promise<void> {
  const accessToken = await getGoogleWorkspaceAccessToken(
    GOOGLE_CALENDAR_EVENTS_SCOPE,
  );
  const url = new URL(
    `${CALENDAR_EVENTS_URL}/${encodeURIComponent(eventId)}`,
  );
  url.searchParams.set('sendUpdates', 'all');
  const response = await fetch(url, {
    method: 'DELETE',
    headers: {Authorization: `Bearer ${accessToken}`},
    cache: 'no-store',
    signal: AbortSignal.timeout(15_000),
  });
  if (response.status === 404 || response.status === 410) return;
  if (!response.ok) {
    throw new Error(`Google Calendar could not cancel event ${eventId}.`);
  }
}
