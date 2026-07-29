'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  ArrowLeft,
  BadgeCheck,
  CircleAlert,
  Download,
  FileHeart,
  HeartHandshake,
  LoaderCircle,
  LockKeyhole,
  LogIn,
  LogOut,
  MapPin,
  ShieldCheck,
  ThumbsDown,
  ThumbsUp,
  UserRound,
} from 'lucide-react';
import {
  getUser,
  handleAuthCallback,
  login,
  logout,
  oauthLogin,
  type User,
} from '@netlify/identity';

import type {
  DreamApplicationFile,
  DreamApplicationInput,
  DreamApplicationStatus,
  DreamBoardDecision,
  DreamBoardVote,
} from '@/lib/dream-applications/types';

interface Viewer {
  email: string;
  isAdmin: boolean;
  isBoardMember: boolean;
}

type BoardFile = Pick<
  DreamApplicationFile,
  'id' | 'category' | 'originalName' | 'mimeType' | 'size' | 'uploadedAt'
>;

interface BoardApplication extends DreamApplicationInput {
  id: string;
  reference: string;
  status: DreamApplicationStatus;
  submittedAt?: string;
  files: BoardFile[];
  boardVotes: DreamBoardVote[];
}

async function readJson<T>(response: Response): Promise<T> {
  const payload = await response.json() as T & {error?: string};
  if (!response.ok) {
    const error = new Error(payload.error || 'Request failed.') as Error & {status?: number};
    error.status = response.status;
    throw error;
  }
  return payload;
}

function formatDate(value?: string): string {
  if (!value) return 'Not available';
  return new Intl.DateTimeFormat('en-GB', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));
}

function LoginPanel({
  loading,
  error,
  onEmailLogin,
}: {
  loading: boolean;
  error?: string;
  onEmailLogin: (email: string, password: string) => Promise<void>;
}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-5 py-12 text-white">
      <div className="w-full max-w-md rounded-[2rem] border border-white/10 bg-white/[0.07] p-8 shadow-2xl">
        <LockKeyhole className="mx-auto h-14 w-14 text-brand-300" />
        <p className="mt-6 text-center text-xs font-black uppercase tracking-[0.24em] text-brand-300">TCW board review</p>
        <h1 className="mt-3 text-center text-3xl font-black">Secure sign in</h1>
        <p className="mt-3 text-center text-sm leading-relaxed text-slate-300">
          This page contains confidential health information and is available only to the three TCW board members.
        </p>

        {loading ? (
          <div className="mt-8 flex items-center justify-center gap-3 rounded-2xl bg-white/5 p-5 font-bold">
            <LoaderCircle className="h-5 w-5 animate-spin" /> Checking access
          </div>
        ) : (
          <>
            <button
              type="button"
              onClick={() => oauthLogin('google')}
              className="mt-8 flex w-full items-center justify-center gap-2 rounded-2xl bg-white px-5 py-3.5 font-black text-slate-900"
            >
              <LogIn className="h-5 w-5 text-brand-600" /> Continue with Google
            </button>
            <div className="my-5 flex items-center gap-3 text-xs font-bold uppercase tracking-wider text-slate-500">
              <span className="h-px flex-1 bg-white/10" /> or invited email <span className="h-px flex-1 bg-white/10" />
            </div>
            <form
              className="space-y-4"
              onSubmit={async (event) => {
                event.preventDefault();
                setSubmitting(true);
                try {
                  await onEmailLogin(email, password);
                } finally {
                  setSubmitting(false);
                }
              }}
            >
              <input
                type="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="Invited email"
                className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 outline-none"
              />
              <input
                type="password"
                required
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Password"
                className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 outline-none"
              />
              <button
                type="submit"
                disabled={submitting}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-brand-600 px-5 py-3.5 font-black disabled:opacity-60"
              >
                {submitting && <LoaderCircle className="h-5 w-5 animate-spin" />} Sign in securely
              </button>
            </form>
          </>
        )}

        {error && (
          <p className="mt-5 rounded-2xl border border-red-400/20 bg-red-400/10 p-4 text-sm font-semibold text-red-100">
            {error}
          </p>
        )}
      </div>
    </main>
  );
}

function InfoCard({title, children}: {title: string; children: React.ReactNode}) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-black text-slate-950">{title}</h2>
      <div className="mt-5">{children}</div>
    </section>
  );
}

function Field({label, value}: {label: string; value?: React.ReactNode}) {
  return (
    <div>
      <dt className="text-xs font-bold uppercase tracking-wider text-slate-400">{label}</dt>
      <dd className="mt-1 whitespace-pre-wrap text-sm font-semibold leading-relaxed text-slate-800">
        {value || 'Not provided'}
      </dd>
    </div>
  );
}

export default function DreamBoardReview({applicationId}: {applicationId: string}) {
  const [user, setUser] = useState<User | null>(null);
  const [viewer, setViewer] = useState<Viewer>();
  const [application, setApplication] = useState<BoardApplication>();
  const [authLoading, setAuthLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string>();

  async function loadApplication() {
    setLoading(true);
    setError(undefined);
    try {
      const payload = await readJson<{application: BoardApplication; viewer: Viewer}>(
        await fetch(`/api/admin/dream-applications/${applicationId}`, {cache: 'no-store'}),
      );
      setApplication(payload.application);
      setViewer(payload.viewer);
    } catch (loadError) {
      const status = (loadError as Error & {status?: number}).status;
      if (status === 401) setUser(null);
      setError(loadError instanceof Error ? loadError.message : 'Unable to load this application.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    let active = true;
    async function initialize() {
      try {
        await handleAuthCallback();
        const currentUser = await getUser();
        if (!active) return;
        setUser(currentUser);
        if (currentUser) await loadApplication();
      } catch (initializationError) {
        if (active) {
          setError(initializationError instanceof Error ? initializationError.message : 'Unable to verify this login.');
        }
      } finally {
        if (active) setAuthLoading(false);
      }
    }
    void initialize();
    return () => { active = false; };
  }, [applicationId]);

  const summary = useMemo(() => {
    const votes = application?.boardVotes || [];
    return {
      approvals: votes.filter((vote) => vote.decision === 'approve').length,
      rejections: votes.filter((vote) => vote.decision === 'reject').length,
      currentVote: votes.find((vote) => vote.voterEmail === viewer?.email)?.decision,
    };
  }, [application?.boardVotes, viewer?.email]);

  async function emailLogin(email: string, password: string) {
    setError(undefined);
    const loggedIn = await login(email, password);
    setUser(loggedIn);
    await loadApplication();
  }

  async function signOut() {
    await logout();
    setUser(null);
    setApplication(undefined);
    setViewer(undefined);
  }

  async function castVote(decision: DreamBoardDecision) {
    if (!application) return;
    setSaving(true);
    setError(undefined);
    try {
      const payload = await readJson<{application: BoardApplication}>(
        await fetch(`/api/admin/dream-applications/${application.id}/vote`, {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({decision}),
        }),
      );
      setApplication(payload.application);
    } catch (voteError) {
      setError(voteError instanceof Error ? voteError.message : 'Unable to save your vote.');
    } finally {
      setSaving(false);
    }
  }

  if (!user) {
    return <LoginPanel loading={authLoading} error={error} onEmailLogin={emailLogin} />;
  }

  if (loading && !application) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-100">
        <div className="flex items-center gap-3 font-black text-slate-600">
          <LoaderCircle className="h-6 w-6 animate-spin text-brand-600" /> Loading secure board review
        </div>
      </main>
    );
  }

  if (!application || !viewer) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 p-6 text-white">
        <div className="max-w-lg rounded-3xl border border-red-400/20 bg-white/5 p-8 text-center">
          <CircleAlert className="mx-auto h-12 w-12 text-red-300" />
          <h1 className="mt-5 text-2xl font-black">Review unavailable</h1>
          <p className="mt-3 text-slate-300">{error || 'This application is not available for your account.'}</p>
          <button type="button" onClick={signOut} className="mt-6 rounded-full bg-white px-5 py-2.5 font-black text-slate-900">Sign out</button>
        </div>
      </main>
    );
  }

  const votingOpen = application.status === 'board_review';

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <header className="border-b border-white/10 bg-slate-950 text-white shadow-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-4">
          <div className="flex items-center gap-3">
            <HeartHandshake className="h-9 w-9 text-brand-300" />
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-brand-300">TCW private board</p>
              <p className="font-black">Dream application review</p>
            </div>
          </div>
          <button type="button" onClick={signOut} className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-bold text-slate-300 hover:bg-white/10">
            <LogOut className="h-4 w-4" /> Sign out
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-7 md:px-7">
        <a href="/admin/dream-applications" className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-black text-slate-700 shadow-sm">
          <ArrowLeft className="h-4 w-4" /> Dashboard
        </a>

        {error && <p className="mt-5 rounded-2xl border border-red-200 bg-red-50 p-4 font-semibold text-red-800">{error}</p>}

        <section className="mt-5 rounded-[2rem] bg-gradient-to-br from-brand-700 via-purple-800 to-slate-950 p-7 text-white shadow-xl md:p-9">
          <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-brand-200">{application.reference}</p>
              <h1 className="mt-3 text-3xl font-black md:text-5xl">{application.fullName}</h1>
              <p className="mt-3 flex items-center gap-2 text-sm text-brand-100">
                <MapPin className="h-4 w-4" /> {application.city}, {application.country} · Submitted {formatDate(application.submittedAt)}
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/10 px-5 py-4 text-sm font-black">
              {application.status === 'board_review' ? 'Board review open' : application.status === 'approved' ? 'Approved by board' : 'Declined by board'}
            </div>
          </div>
        </section>

        <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
          <div className="space-y-6">
            <InfoCard title="Applicant and diagnosis">
              <dl className="grid gap-5 md:grid-cols-2">
                <Field label="Full name" value={application.fullName} />
                <Field label="Diagnosis" value={application.diagnosis} />
                <Field label="Cancer stage" value={application.cancerStage} />
                <Field label="Diagnosis date" value={application.diagnosisDate} />
                <Field label="Treatment status" value={application.treatmentStatusOther || application.treatmentStatus.replaceAll('_', ' ')} />
                <Field label="Preferred contact" value={application.preferredContact} />
              </dl>
            </InfoCard>

            <InfoCard title="Story and requested support">
              <dl className="space-y-6">
                <Field label="Who they are beyond cancer" value={application.story} />
                <Field label="Dream or wish" value={application.dream} />
                <Field label="Why it matters" value={application.emotionalImpact} />
                <div className="grid gap-5 rounded-2xl bg-brand-50 p-5 md:grid-cols-2">
                  <Field label="Estimated cost" value={application.estimatedCost} />
                  <Field label="Difference plan" value={application.differencePlan} />
                  <Field label="Supplier link" value={application.supplierLink ? <a href={application.supplierLink} target="_blank" rel="noopener noreferrer" className="text-brand-700 underline">Open supplier link</a> : undefined} />
                </div>
              </dl>
            </InfoCard>

            <InfoCard title="Consent and eligibility declarations">
              <dl className="grid gap-5 md:grid-cols-2">
                <Field label="Health-data consent" value={application.consentsHealthData ? 'Confirmed' : 'Missing'} />
                <Field label="Adult applicant" value={application.confirmsAdult ? 'Confirmed' : 'Missing'} />
                <Field label="Non-medical request" value={application.confirmsNonMedical ? 'Confirmed' : 'Missing'} />
                <Field label="Proof of use" value={application.confirmsProofOfUse ? 'Confirmed' : 'Missing'} />
                <Field label="Publicity choice" value={application.publicityChoice} />
                <Field label="Information accurate" value={application.confirmsAccuracy ? 'Confirmed' : 'Missing'} />
              </dl>
            </InfoCard>
          </div>

          <aside className="space-y-6">
            <InfoCard title="Board decision">
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-2xl bg-emerald-50 p-4 text-center">
                  <p className="text-3xl font-black text-emerald-700">{summary.approvals}</p>
                  <p className="text-xs font-bold uppercase text-emerald-700">Approve</p>
                </div>
                <div className="rounded-2xl bg-rose-50 p-4 text-center">
                  <p className="text-3xl font-black text-rose-700">{summary.rejections}</p>
                  <p className="text-xs font-bold uppercase text-rose-700">Reject</p>
                </div>
              </div>
              <p className="mt-4 text-sm font-semibold text-slate-500">Two matching votes decide the application automatically.</p>

              {viewer.isBoardMember && votingOpen && (
                <div className="mt-5 grid gap-3">
                  <button
                    type="button"
                    disabled={saving}
                    onClick={() => void castVote('approve')}
                    className={`flex items-center justify-center gap-2 rounded-2xl px-4 py-3.5 font-black text-white disabled:opacity-60 ${summary.currentVote === 'approve' ? 'bg-emerald-800 ring-4 ring-emerald-200' : 'bg-emerald-600 hover:bg-emerald-700'}`}
                  >
                    {saving ? <LoaderCircle className="h-5 w-5 animate-spin" /> : <ThumbsUp className="h-5 w-5" />} Approve
                  </button>
                  <button
                    type="button"
                    disabled={saving}
                    onClick={() => void castVote('reject')}
                    className={`flex items-center justify-center gap-2 rounded-2xl px-4 py-3.5 font-black text-white disabled:opacity-60 ${summary.currentVote === 'reject' ? 'bg-rose-800 ring-4 ring-rose-200' : 'bg-rose-600 hover:bg-rose-700'}`}
                  >
                    {saving ? <LoaderCircle className="h-5 w-5 animate-spin" /> : <ThumbsDown className="h-5 w-5" />} Reject
                  </button>
                </div>
              )}

              {summary.currentVote && (
                <p className="mt-4 rounded-xl bg-slate-100 p-3 text-center text-sm font-black text-slate-700">
                  Your current vote: {summary.currentVote === 'approve' ? 'Approve' : 'Reject'}
                </p>
              )}

              {!votingOpen && (
                <div className="mt-5 flex items-center gap-3 rounded-2xl bg-brand-50 p-4 font-black text-brand-800">
                  <BadgeCheck className="h-6 w-6" /> Voting is complete.
                </div>
              )}
            </InfoCard>

            <InfoCard title={`Private documents (${application.files.length})`}>
              <div className="space-y-3">
                {application.files.map((file) => (
                  <a
                    key={file.id}
                    href={`/api/admin/dream-applications/${application.id}/files/${file.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 p-4 hover:bg-brand-50"
                  >
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-black">{file.originalName}</span>
                      <span className="text-xs font-bold uppercase text-slate-400">{file.category}</span>
                    </span>
                    <Download className="h-5 w-5 text-brand-600" />
                  </a>
                ))}
              </div>
              <p className="mt-4 text-xs font-semibold leading-relaxed text-amber-800">
                Confidential: do not share, screenshot or retain local copies.
              </p>
            </InfoCard>

            <div className="rounded-3xl border border-brand-200 bg-brand-50 p-5 text-sm font-semibold leading-relaxed text-brand-900">
              <ShieldCheck className="mb-3 h-7 w-7" />
              You are signed in as <strong>{viewer.email}</strong>. Your vote is recorded with your account and timestamp.
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
