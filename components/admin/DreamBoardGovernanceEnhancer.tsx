'use client';

import {useCallback, useEffect, useMemo, useState} from 'react';
import {createPortal} from 'react-dom';
import {
  CheckCircle2,
  CircleAlert,
  Gavel,
  LoaderCircle,
  ShieldCheck,
  XCircle,
} from 'lucide-react';

import type {
  DreamApplicationStatus,
  DreamBoardDecision,
  DreamBoardVote,
} from '@/lib/dream-applications/types';

interface GovernanceApplication {
  id: string;
  reference: string;
  status: DreamApplicationStatus;
  boardVotes: DreamBoardVote[];
}

interface GovernanceViewer {
  email: string;
  isAdmin: boolean;
  isBoardMember: boolean;
}

interface GovernanceResponse {
  application: GovernanceApplication;
  viewer: GovernanceViewer;
}

const OLD_AUTOMATIC_COPY = 'Two matching votes decide the application automatically.';
const GOVERNANCE_COPY =
  'All three votes are requested. Two matching votes let the administrator finalize the majority decision; the case never closes automatically.';

async function readJson<T>(response: Response): Promise<T> {
  const payload = await response.json().catch(() => ({})) as T & {error?: string};
  if (!response.ok) {
    throw new Error(payload.error || 'Request failed.');
  }
  return payload;
}

function correctVotingCopy() {
  for (const paragraph of document.querySelectorAll<HTMLParagraphElement>('p')) {
    if (paragraph.textContent?.trim() === OLD_AUTOMATIC_COPY) {
      paragraph.textContent = GOVERNANCE_COPY;
    }
  }
}

export default function DreamBoardGovernanceEnhancer({
  applicationId,
}: {
  applicationId: string;
}) {
  const [application, setApplication] = useState<GovernanceApplication>();
  const [viewer, setViewer] = useState<GovernanceViewer>();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string>();

  const loadGovernance = useCallback(async () => {
    try {
      const payload = await readJson<GovernanceResponse>(
        await fetch(`/api/admin/dream-applications/${encodeURIComponent(applicationId)}`, {
          cache: 'no-store',
        }),
      );
      setApplication(payload.application);
      setViewer(payload.viewer);
    } catch {
      // The main review screen owns authentication and unavailable-state UI.
      // This enhancer stays silent until that screen can load the case.
    }
  }, [applicationId]);

  useEffect(() => {
    correctVotingCopy();
    void loadGovernance();

    const observer = new MutationObserver(() => correctVotingCopy());
    observer.observe(document.body, {childList: true, subtree: true});

    const refreshAfterVote = (event: Event) => {
      const button = (event.target as HTMLElement | null)?.closest('button');
      const label = button?.textContent?.trim();
      if (label === 'Approve' || label === 'Reject') {
        window.setTimeout(() => void loadGovernance(), 700);
      }
    };
    document.addEventListener('click', refreshAfterVote, true);

    const interval = window.setInterval(() => {
      if (document.visibilityState === 'visible') void loadGovernance();
    }, 10_000);

    return () => {
      observer.disconnect();
      document.removeEventListener('click', refreshAfterVote, true);
      window.clearInterval(interval);
    };
  }, [loadGovernance]);

  const summary = useMemo(() => {
    const votes = application?.boardVotes || [];
    const approvals = votes.filter((vote) => vote.decision === 'approve').length;
    const rejections = votes.filter((vote) => vote.decision === 'reject').length;
    const totalVotes = approvals + rejections;
    const majorityDecision: DreamBoardDecision | undefined = approvals === rejections
      ? undefined
      : approvals > rejections
        ? 'approve'
        : 'reject';
    return {
      approvals,
      rejections,
      totalVotes,
      majorityDecision,
      canFinalize: totalVotes >= 2 && Boolean(majorityDecision),
    };
  }, [application?.boardVotes]);

  async function finalize(decision: DreamBoardDecision) {
    if (!application || !summary.canFinalize) return;
    const label = decision === 'approve' ? 'approve' : 'decline';
    if (!window.confirm(
      `Confirm the final Board decision and ${label} ${application.reference}? This closes Board voting.`,
    )) return;

    setBusy(true);
    setError(undefined);
    try {
      const payload = await readJson<{application: GovernanceApplication}>(
        await fetch('/api/admin/dream-applications', {
          method: 'PATCH',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            applicationId: application.id,
            status: decision === 'approve' ? 'approved' : 'declined',
            finalizeBoardDecision: true,
          }),
        }),
      );
      setApplication(payload.application);
      window.setTimeout(() => window.location.reload(), 250);
    } catch (finalizationError) {
      setError(
        finalizationError instanceof Error
          ? finalizationError.message
          : 'Unable to finalize the Board decision.',
      );
      await loadGovernance();
    } finally {
      setBusy(false);
    }
  }

  if (
    typeof document === 'undefined' ||
    !application ||
    !viewer?.isAdmin ||
    application.status !== 'board_review'
  ) {
    return null;
  }

  const waitingMessage = summary.totalVotes < 2
    ? `Waiting for at least one more vote (${summary.totalVotes} of 3 received).`
    : !summary.majorityDecision
      ? 'The available votes are tied. The third Board member must vote.'
      : `Current majority: ${summary.majorityDecision === 'approve' ? 'Approve' : 'Reject'}. You may wait for the third vote or finalize now.`;

  return createPortal(
    <aside className="fixed bottom-4 right-4 z-[120] w-[calc(100%-2rem)] max-w-md overflow-hidden rounded-[1.75rem] border border-purple-200 bg-white shadow-2xl">
      <header className="flex items-start gap-3 bg-gradient-to-r from-purple-800 to-brand-700 p-5 text-white">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white/15">
          <Gavel className="h-6 w-6" />
        </span>
        <div>
          <p className="text-xs font-black uppercase tracking-[0.18em] text-purple-100">
            Administrator only
          </p>
          <h2 className="mt-1 text-lg font-black">Finalize the Board decision</h2>
        </div>
      </header>

      <div className="space-y-4 p-5">
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="rounded-xl bg-emerald-50 p-3">
            <p className="text-2xl font-black text-emerald-700">{summary.approvals}</p>
            <p className="text-[10px] font-black uppercase text-emerald-700">Approve</p>
          </div>
          <div className="rounded-xl bg-rose-50 p-3">
            <p className="text-2xl font-black text-rose-700">{summary.rejections}</p>
            <p className="text-[10px] font-black uppercase text-rose-700">Reject</p>
          </div>
          <div className="rounded-xl bg-purple-50 p-3">
            <p className="text-2xl font-black text-purple-700">{summary.totalVotes}/3</p>
            <p className="text-[10px] font-black uppercase text-purple-700">Received</p>
          </div>
        </div>

        <p className="flex items-start gap-2 rounded-xl bg-slate-50 p-3 text-sm font-semibold leading-relaxed text-slate-700">
          <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-purple-700" />
          {waitingMessage}
        </p>

        {viewer.isAdmin && !viewer.isBoardMember && (
          <p className="flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm font-semibold text-amber-900">
            <CircleAlert className="mt-0.5 h-5 w-5 shrink-0" />
            The administrator must also be included in the three configured Board emails.
          </p>
        )}

        {error && (
          <p className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-sm font-semibold text-red-800" role="alert">
            <CircleAlert className="mt-0.5 h-5 w-5 shrink-0" /> {error}
          </p>
        )}

        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            disabled={
              busy ||
              !viewer.isBoardMember ||
              !summary.canFinalize ||
              summary.majorityDecision !== 'approve'
            }
            onClick={() => void finalize('approve')}
            className="flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-3 py-3 text-sm font-black text-white disabled:cursor-not-allowed disabled:opacity-35"
          >
            {busy ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
            Confirm approval
          </button>
          <button
            type="button"
            disabled={
              busy ||
              !viewer.isBoardMember ||
              !summary.canFinalize ||
              summary.majorityDecision !== 'reject'
            }
            onClick={() => void finalize('reject')}
            className="flex items-center justify-center gap-2 rounded-xl bg-rose-600 px-3 py-3 text-sm font-black text-white disabled:cursor-not-allowed disabled:opacity-35"
          >
            {busy ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <XCircle className="h-4 w-4" />}
            Confirm decline
          </button>
        </div>

        <p className="text-center text-xs font-semibold leading-relaxed text-slate-500">
          Final confirmation is an administrative action, not a second vote.
        </p>
      </div>
    </aside>,
    document.body,
  );
}
