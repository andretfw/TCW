import 'server-only';

import {getStore} from '@netlify/blobs';

import {decryptJson, encryptJson, hashRateLimitIdentifier} from '@/lib/dream-applications/crypto';

import {hashPortalToken, portalTokensMatch} from './security';
import type {
  ConnectConnection,
  ConnectProfile,
  MatchProposal,
} from './types';

const STORE_NAME = 'tcw-connect';
const PROFILE_PREFIX = 'profiles/';
const PROPOSAL_PREFIX = 'proposals/';
const CONNECTION_PREFIX = 'connections/';
const TOKEN_PREFIX = 'token-index/';
const RATE_PREFIX = 'rate/';
const CONDITIONAL_WRITE_ATTEMPTS = 5;

interface TokenIndexRecord {
  profileId: string;
  tokenHash: string;
  createdAt: string;
}

interface RateWindow {
  count: number;
  resetsAt: string;
}

function connectStore() {
  return getStore({name: STORE_NAME, consistency: 'strong'});
}

function profileKey(id: string) {
  return `${PROFILE_PREFIX}${id}.json`;
}

function proposalKey(id: string) {
  return `${PROPOSAL_PREFIX}${id}.json`;
}

function connectionKey(id: string) {
  return `${CONNECTION_PREFIX}${id}.json`;
}

function tokenIndexKey(tokenHash: string) {
  return `${TOKEN_PREFIX}${tokenHash}.json`;
}

async function readEncrypted<T>(key: string): Promise<T | null> {
  const payload = await connectStore().get(key, {
    type: 'text',
    consistency: 'strong',
  });
  return payload ? decryptJson<T>(payload) : null;
}

async function listEncrypted<T>(prefix: string): Promise<T[]> {
  const listed = await connectStore().list({prefix});
  const records = await Promise.all(
    listed.blobs
      .filter((blob) => blob.key.endsWith('.json'))
      .map((blob) => readEncrypted<T>(blob.key)),
  );
  return records.filter((record): record is T => Boolean(record));
}

async function mutateEncrypted<TRecord, TResult>(
  key: string,
  mutate: (record: TRecord) => TResult | Promise<TResult>,
  metadata: (record: TRecord) => Record<string, string | number | boolean>,
): Promise<{record: TRecord; result: TResult} | null> {
  const store = connectStore();
  for (let attempt = 0; attempt < CONDITIONAL_WRITE_ATTEMPTS; attempt += 1) {
    const current = await store.getWithMetadata(key, {
      type: 'text',
      consistency: 'strong',
    });
    if (!current?.data) return null;
    if (!current.etag) continue;

    const record = decryptJson<TRecord>(current.data);
    const result = await mutate(record);
    const write = await store.set(key, encryptJson(record), {
      metadata: metadata(record),
      onlyIfMatch: current.etag,
    });
    if (write.modified) return {record, result};
  }
  throw new Error('CONNECT_WRITE_CONFLICT');
}

function profileMetadata(profile: ConnectProfile) {
  return {
    kind: 'connect-profile',
    role: profile.role,
    status: profile.status,
    updatedAt: profile.updatedAt,
  };
}

function proposalMetadata(proposal: MatchProposal) {
  return {
    kind: 'connect-proposal',
    status: proposal.status,
    updatedAt: proposal.updatedAt,
    expiresAt: proposal.expiresAt,
  };
}

function connectionMetadata(connection: ConnectConnection) {
  return {
    kind: 'connect-connection',
    status: connection.status,
    updatedAt: connection.updatedAt,
  };
}

export async function saveConnectProfile(profile: ConnectProfile): Promise<void> {
  const store = connectStore();
  const tokenHash = hashPortalToken(profile.portalToken);
  const index: TokenIndexRecord = {
    profileId: profile.id,
    tokenHash,
    createdAt: profile.createdAt,
  };

  await store.set(profileKey(profile.id), encryptJson(profile), {
    metadata: profileMetadata(profile),
  });
  await store.set(tokenIndexKey(tokenHash), JSON.stringify(index), {
    metadata: {kind: 'connect-token-index', profileId: profile.id},
  });
}

export async function getConnectProfile(id: string): Promise<ConnectProfile | null> {
  return readEncrypted<ConnectProfile>(profileKey(id));
}

export async function getConnectProfileByToken(
  token: string,
): Promise<ConnectProfile | null> {
  const tokenHash = hashPortalToken(token);
  const payload = await connectStore().get(tokenIndexKey(tokenHash), {
    type: 'text',
    consistency: 'strong',
  });
  if (!payload) return null;

  const index = JSON.parse(payload) as TokenIndexRecord;
  if (!portalTokensMatch(token, index.tokenHash)) return null;
  const profile = await getConnectProfile(index.profileId);
  if (!profile || !portalTokensMatch(token, hashPortalToken(profile.portalToken))) {
    return null;
  }
  return profile;
}

export async function listConnectProfiles(): Promise<ConnectProfile[]> {
  return listEncrypted<ConnectProfile>(PROFILE_PREFIX);
}

export async function mutateConnectProfile<TResult>(
  id: string,
  mutate: (profile: ConnectProfile) => TResult | Promise<TResult>,
) {
  return mutateEncrypted(profileKey(id), mutate, profileMetadata);
}

export async function saveMatchProposal(proposal: MatchProposal): Promise<void> {
  await connectStore().set(proposalKey(proposal.id), encryptJson(proposal), {
    metadata: proposalMetadata(proposal),
  });
}

export async function getMatchProposal(id: string): Promise<MatchProposal | null> {
  return readEncrypted<MatchProposal>(proposalKey(id));
}

export async function listMatchProposals(): Promise<MatchProposal[]> {
  return listEncrypted<MatchProposal>(PROPOSAL_PREFIX);
}

export async function mutateMatchProposal<TResult>(
  id: string,
  mutate: (proposal: MatchProposal) => TResult | Promise<TResult>,
) {
  return mutateEncrypted(proposalKey(id), mutate, proposalMetadata);
}

export async function saveConnectConnection(
  connection: ConnectConnection,
): Promise<void> {
  await connectStore().set(connectionKey(connection.id), encryptJson(connection), {
    metadata: connectionMetadata(connection),
  });
}

export async function getConnectConnection(
  id: string,
): Promise<ConnectConnection | null> {
  return readEncrypted<ConnectConnection>(connectionKey(id));
}

export async function listConnectConnections(): Promise<ConnectConnection[]> {
  return listEncrypted<ConnectConnection>(CONNECTION_PREFIX);
}

export async function mutateConnectConnection<TResult>(
  id: string,
  mutate: (connection: ConnectConnection) => TResult | Promise<TResult>,
) {
  return mutateEncrypted(connectionKey(id), mutate, connectionMetadata);
}

export async function enforceConnectRateLimit(identifier: string): Promise<void> {
  const store = connectStore();
  const key = `${RATE_PREFIX}${hashRateLimitIdentifier(identifier)}.json`;
  const now = new Date();

  for (let attempt = 0; attempt < CONDITIONAL_WRITE_ATTEMPTS; attempt += 1) {
    const existing = await store.getWithMetadata(key, {
      type: 'text',
      consistency: 'strong',
    });
    let window = existing?.data
      ? JSON.parse(existing.data) as RateWindow
      : null;

    if (!window || new Date(window.resetsAt) <= now) {
      window = {
        count: 0,
        resetsAt: new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString(),
      };
    }
    if (window.count >= 5) throw new Error('RATE_LIMITED');
    window.count += 1;

    const options = {
      metadata: {kind: 'connect-rate-limit', expiresAt: window.resetsAt},
    };
    const write = existing
      ? existing.etag
        ? await store.set(key, JSON.stringify(window), {
            ...options,
            onlyIfMatch: existing.etag,
          })
        : {modified: false}
      : await store.set(key, JSON.stringify(window), {
          ...options,
          onlyIfNew: true,
        });
    if (write.modified) return;
  }

  throw new Error('RATE_LIMIT_BUSY');
}
