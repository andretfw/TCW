'use client';

import {useEffect, useMemo, useState} from 'react';
import {
  BadgeCheck,
  Ban,
  CircleAlert,
  ClipboardCheck,
  Flag,
  HeartHandshake,
  LoaderCircle,
  LockKeyhole,
  LogIn,
  LogOut,
  RefreshCw,
  ShieldCheck,
  UserCheck,
  UsersRound,
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
  ConnectIncident,
  ConnectIncidentStatus,
  ConnectProfile,
  MentorVerificationMethod,
} from '@/lib/connect/types';

type AdminProfile = Omit<ConnectProfile, 'portalToken'>;
type IncidentView = ConnectIncident & {
  reporter?: AdminProfile;
  reported?: AdminProfile;
};

type DashboardData = {
  mentors: AdminProfile[];
  incidents: IncidentView[];
  viewer?: {email: string};
};

async function readJson<T>(response: Response): Promise<T> {
  const payload = await response.json().catch(() => ({})) as T & {error?: string};
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

function statusTone(status: string): string {
  if (status === 'active' || status === 'approved' || status === 'resolved') {
    return 'bg-emerald-100 text-emerald-800';
  }
  if (status === 'pending-review' || status === 'reviewing') {
    return 'bg-amber-100 text-amber-900';
  }
  if (status === 'suspended' || status === 'review-rejected' || status === 'open') {
    return 'bg-red-100 text-red-800';
  }
  return 'bg-slate-200 text-slate-800';
}

function Badge({status}: {status: string}) {
  return (
    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-black ${statusTone(status)}`}>
      {status.replaceAll('-', ' ')}
    </span>
  );
}

function LoginScreen({
  loading,
  error,
  onEmailLogin,
}: {
  loading: boolean;
  error?: string;
  onEmailLogin: (email: string, password: string) => Promise<void>;
}) {
  const [email, setEmail] = useState('tcw@tutticancerwarriors.org');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-5 py-12 text-white">
      <section className="w-full max-w-md rounded-[2rem] border border-white/10 bg-white/[0.07] p-8 shadow-2xl">
        <LockKeyhole className="mx-auto h-16 w-16 rounded-2xl bg-gradient-to-br from-brand-500 to-fuchsia-600 p-4" />
        <p className="mt-6 text-center text-xs font-black uppercase tracking-[0.22em] text-brand-300">TCW private safety area</p>
        <h1 className="mt-3 text-center text-3xl font-black">TCW Connect review</h1>
        <p className="mt-3 text-center text-sm leading-relaxed text-slate-300">
          Mentor verification and safeguarding incidents are restricted to the TCW administrator.
        </p>
        {loading ? (
          <p className="mt-8 flex items-center justify-center gap-2 rounded-2xl bg-white/5 p-4 font-bold">
            <LoaderCircle className="h-5 w-5 animate-spin" /> Checking secure access
          </p>
        ) : (
          <>
            <button type="button" onClick={() => oauthLogin('google')} className="mt-8 flex w-full items-center justify-center gap-2 rounded-2xl bg-white px-5 py-3.5 font-black text-slate-950">
              <LogIn className="h-5 w-5 text-brand-600" /> Continue with Google
            </button>
            <div className="my-5 flex items-center gap-3 text-xs font-bold uppercase tracking-wide text-slate-500"><span className="h-px flex-1 bg-white/10" />or email<span className="h-px flex-1 bg-white/10" /></div>
            <form
              className="space-y-4"
              onSubmit={async (event) => {
                event.preventDefault();
                setSubmitting(true);
                try { await onEmailLogin(email, password); } finally { setSubmitting(false); }
              }}
            >
              <label className="block text-sm font-bold">Email<input type="email" required value={email} onChange={(event) => setEmail(event.target.value)} className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3" /></label>
              <label className="block text-sm font-bold">Password<input type="password" required value={password} onChange={(event) => setPassword(event.target.value)} className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3" /></label>
              <button type="submit" disabled={submitting} className="flex w-full items-center justify-center gap-2 rounded-2xl bg-brand-600 px-5 py-3.5 font-black disabled:opacity-60">
                {submitting && <LoaderCircle className="h-5 w-5 animate-spin" />} Sign in securely
              </button>
            </form>
          </>
        )}
        {error && <p role="alert" className="mt-5 rounded-2xl border border-red-400/20 bg-red-400/10 p-4 text-sm text-red-100">{error}</p>}
      </section>
    </main>
  );
}

function MentorReviewCard({
  mentor,
  busy,
  onReview,
}: {
  mentor: AdminProfile;
  busy: boolean;
  onReview: (body: Record<string, unknown>) => Promise<void>;
}) {
  const [identityVerified, setIdentityVerified] = useState(false);
  const [experienceVerified, setExperienceVerified] = useState(false);
  const [method, setMethod] = useState<MentorVerificationMethod>('video-call');
  const [note, setNote] = useState('');
  const reviewable = (
    mentor.status !== 'closed' &&
    mentor.status !== 'suspended' &&
    mentor.mentorReview?.status !== 'approved'
  );

  return (
    <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2"><h3 className="text-xl font-black">{mentor.firstName}</h3><Badge status={mentor.status} /></div>
          <p className="mt-1 text-xs font-bold uppercase tracking-wide text-slate-400">{mentor.reference}</p>
          <p className="mt-3 text-sm font-semibold text-slate-700">{mentor.email} · {mentor.country} · {mentor.locale.toUpperCase()}</p>
        </div>
        <p className="text-sm text-slate-500">Email verified: <strong>{formatDate(mentor.emailVerifiedAt)}</strong></p>
      </div>
      <dl className="mt-5 grid gap-4 rounded-2xl bg-slate-50 p-5 sm:grid-cols-2 lg:grid-cols-4">
        <div><dt className="text-xs font-black uppercase text-slate-400">Cancer</dt><dd className="mt-1 font-semibold">{mentor.cancerType}{mentor.cancerSubtype ? ` — ${mentor.cancerSubtype}` : ''}</dd></div>
        <div><dt className="text-xs font-black uppercase text-slate-400">Experience</dt><dd className="mt-1 font-semibold">{mentor.phase}</dd></div>
        <div><dt className="text-xs font-black uppercase text-slate-400">Treatments</dt><dd className="mt-1 font-semibold">{mentor.treatments.join(', ')}</dd></div>
        <div><dt className="text-xs font-black uppercase text-slate-400">Capacity</dt><dd className="mt-1 font-semibold">{mentor.maxConnections}</dd></div>
      </dl>
      {mentor.shortIntro && <p className="mt-4 whitespace-pre-wrap rounded-2xl border border-brand-100 bg-brand-50 p-4 text-sm leading-relaxed text-brand-950">{mentor.shortIntro}</p>}
      {mentor.mentorReview && (
        <p className="mt-4 text-sm text-slate-600">
          Last review: <strong>{mentor.mentorReview.status}</strong> by {mentor.mentorReview.reviewedBy || 'TCW'} on {formatDate(mentor.mentorReview.reviewedAt)}.
          {mentor.mentorReview.note ? ` Private note: ${mentor.mentorReview.note}` : ''}
        </p>
      )}
      {reviewable && (
        <div className="mt-5 grid gap-4 border-t border-slate-100 pt-5 lg:grid-cols-[1fr_1fr]">
          <div className="space-y-3">
            <label className="flex items-start gap-3 rounded-xl border border-slate-200 p-4 text-sm font-bold"><input type="checkbox" checked={identityVerified} onChange={(event) => setIdentityVerified(event.target.checked)} className="mt-0.5 h-4 w-4" />Identity checked</label>
            <label className="flex items-start gap-3 rounded-xl border border-slate-200 p-4 text-sm font-bold"><input type="checkbox" checked={experienceVerified} onChange={(event) => setExperienceVerified(event.target.checked)} className="mt-0.5 h-4 w-4" />Survivor experience checked</label>
            <label className="block text-sm font-bold">Verification method<select value={method} onChange={(event) => setMethod(event.target.value as MentorVerificationMethod)} className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3"><option value="video-call">Video call</option><option value="document-review">Document review</option><option value="trusted-referral">Trusted referral</option><option value="other">Other</option></select></label>
          </div>
          <div>
            <label className="block text-sm font-bold">Private review note<textarea value={note} onChange={(event) => setNote(event.target.value)} rows={5} maxLength={2000} className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3" /></label>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <button type="button" disabled={busy || !identityVerified || !experienceVerified} onClick={() => void onReview({action: 'approve-mentor', profileId: mentor.id, identityVerified, survivorExperienceVerified: experienceVerified, verificationMethod: method, note})} className="flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 font-black text-white disabled:opacity-50"><UserCheck className="h-5 w-5" />Approve mentor</button>
              <button type="button" disabled={busy || note.trim().length < 10} onClick={() => void onReview({action: 'reject-mentor', profileId: mentor.id, note})} className="flex items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 font-black text-red-800 disabled:opacity-50"><Ban className="h-5 w-5" />Reject</button>
            </div>
          </div>
        </div>
      )}
    </article>
  );
}

function IncidentCard({
  incident,
  busy,
  onReview,
}: {
  incident: IncidentView;
  busy: boolean;
  onReview: (body: Record<string, unknown>) => Promise<void>;
}) {
  const [status, setStatus] = useState<ConnectIncidentStatus>(incident.status);
  const [profileAction, setProfileAction] = useState<'keep-suspended' | 'reinstate' | 'close'>('keep-suspended');
  const [note, setNote] = useState(incident.reviewNote || '');
  return (
    <article className="rounded-3xl border border-red-100 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div><div className="flex flex-wrap items-center gap-2"><h3 className="text-xl font-black">{incident.reference}</h3><Badge status={incident.status} /></div><p className="mt-2 text-sm font-bold text-red-700">{incident.category.replaceAll('-', ' ')}</p></div>
        <p className="text-sm text-slate-500">Reported {formatDate(incident.createdAt)}</p>
      </div>
      <div className="mt-5 grid gap-4 rounded-2xl bg-slate-50 p-5 md:grid-cols-2">
        <div><p className="text-xs font-black uppercase text-slate-400">Reporter</p><p className="mt-1 font-bold">{incident.reporter?.firstName || incident.reporterProfileId} · {incident.reporter?.reference}</p></div>
        <div><p className="text-xs font-black uppercase text-slate-400">Reported profile</p><p className="mt-1 font-bold">{incident.reported?.firstName || incident.reportedProfileId} · {incident.reported?.reference}</p><div className="mt-2"><Badge status={incident.reported?.status || 'unavailable'} /></div></div>
      </div>
      {incident.details && <p className="mt-4 whitespace-pre-wrap rounded-2xl border border-red-100 bg-red-50 p-4 text-sm leading-relaxed text-red-950">{incident.details}</p>}
      <div className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
        <p className="rounded-xl border border-slate-200 p-3"><strong>{incident.affectedConnectionIds.length}</strong> connection(s) ended.</p>
        <p className={`rounded-xl border p-3 ${incident.meetingCancellationFailures.length ? 'border-amber-300 bg-amber-50 text-amber-900' : 'border-emerald-200 bg-emerald-50 text-emerald-900'}`}><strong>{incident.meetingCancellationFailures.length}</strong> calendar cancellation failure(s).</p>
      </div>
      <div className="mt-5 grid gap-4 border-t border-slate-100 pt-5 md:grid-cols-3">
        <label className="text-sm font-bold">Incident status<select value={status} onChange={(event) => setStatus(event.target.value as ConnectIncidentStatus)} className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3"><option value="open">Open</option><option value="reviewing">Reviewing</option><option value="resolved">Resolved</option><option value="dismissed">Dismissed</option></select></label>
        <label className="text-sm font-bold">Reported profile<select value={profileAction} onChange={(event) => setProfileAction(event.target.value as typeof profileAction)} className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3"><option value="keep-suspended">Keep suspended</option><option value="reinstate">Reinstate</option><option value="close">Close permanently</option></select></label>
        <label className="text-sm font-bold">Private review note<textarea value={note} onChange={(event) => setNote(event.target.value)} rows={3} maxLength={2000} className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3" /></label>
      </div>
      <button type="button" disabled={busy} onClick={() => void onReview({action: 'review-incident', incidentId: incident.id, status, profileAction, note})} className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-slate-950 px-5 py-3 font-black text-white disabled:opacity-50"><ClipboardCheck className="h-5 w-5" />Save incident review</button>
    </article>
  );
}

export default function AdminConnectSafety() {
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [authError, setAuthError] = useState<string>();
  const [data, setData] = useState<DashboardData>({mentors: [], incidents: []});
  const [loading, setLoading] = useState(false);
  const [busyId, setBusyId] = useState('');
  const [error, setError] = useState<string>();

  async function loadDashboard() {
    setLoading(true);
    setError(undefined);
    try {
      setData(await readJson<DashboardData>(await fetch('/api/admin/connect-safety', {cache: 'no-store'})));
    } catch (loadError) {
      const status = (loadError as Error & {status?: number}).status;
      if (status === 401) setUser(null);
      setError(loadError instanceof Error ? loadError.message : 'Unable to load TCW Connect safety cases.');
    } finally { setLoading(false); }
  }

  useEffect(() => {
    let active = true;
    async function initialize() {
      try {
        await handleAuthCallback();
        const currentUser = await getUser();
        if (!active) return;
        setUser(currentUser);
        if (currentUser) await loadDashboard();
      } catch (initializationError) {
        if (active) setAuthError(initializationError instanceof Error ? initializationError.message : 'Unable to verify this login.');
      } finally { if (active) setAuthLoading(false); }
    }
    void initialize();
    return () => { active = false; };
  }, []);

  async function emailLogin(email: string, password: string) {
    setAuthError(undefined);
    try { setUser(await login(email, password)); await loadDashboard(); }
    catch (loginError) { setAuthError(loginError instanceof Error ? loginError.message : 'Unable to sign in.'); }
  }

  async function signOut() {
    await logout();
    setUser(null);
    setData({mentors: [], incidents: []});
  }

  async function update(body: Record<string, unknown>) {
    const itemId = String(body.profileId || body.incidentId || 'update');
    setBusyId(itemId);
    setError(undefined);
    try {
      const result = await readJson<DashboardData & {ok: true}>(await fetch('/api/admin/connect-safety', {
        method: 'PATCH',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(body),
      }));
      setData({mentors: result.mentors, incidents: result.incidents});
    } catch (updateError) {
      setError(updateError instanceof Error ? updateError.message : 'Unable to save the safety review.');
    } finally { setBusyId(''); }
  }

  const pendingMentors = useMemo(() => data.mentors.filter((mentor) => (
    mentor.status !== 'closed' &&
    mentor.status !== 'suspended' &&
    mentor.mentorReview?.status !== 'approved'
  )), [data.mentors]);
  const reviewedMentors = useMemo(() => data.mentors.filter((mentor) => !pendingMentors.includes(mentor)), [data.mentors, pendingMentors]);
  const openIncidents = data.incidents.filter((incident) => ['open', 'reviewing'].includes(incident.status)).length;

  if (!user) return <LoginScreen loading={authLoading} error={authError} onEmailLogin={emailLogin} />;

  return (
    <div className="min-h-screen bg-slate-100 text-slate-950">
      <header className="sticky top-0 z-40 bg-slate-950 text-white shadow-xl">
        <div className="mx-auto flex max-w-[1500px] items-center justify-between gap-4 px-5 py-4 md:px-8">
          <div className="flex items-center gap-3"><HeartHandshake className="h-11 w-11 rounded-2xl bg-gradient-to-br from-brand-500 to-fuchsia-600 p-2.5" /><div><p className="text-xs font-black uppercase tracking-[0.18em] text-brand-300">TCW private safety area</p><h1 className="font-black">TCW Connect safeguarding</h1></div></div>
          <div className="flex items-center gap-2"><span className="hidden text-xs text-slate-400 md:block">{user.email}</span><button type="button" onClick={() => void loadDashboard()} aria-label="Refresh" className="rounded-xl p-2.5 hover:bg-white/10"><RefreshCw className={`h-5 w-5 ${loading ? 'animate-spin' : ''}`} /></button><button type="button" onClick={() => void signOut()} aria-label="Sign out" className="rounded-xl p-2.5 hover:bg-white/10"><LogOut className="h-5 w-5" /></button></div>
        </div>
      </header>

      <main className="mx-auto max-w-[1500px] px-4 py-8 md:px-8">
        {error && <p role="alert" className="mb-6 flex items-start gap-2 rounded-2xl border border-red-200 bg-red-50 p-4 font-bold text-red-800"><CircleAlert className="mt-0.5 h-5 w-5 shrink-0" />{error}</p>}
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-3xl bg-white p-6 shadow-sm"><UsersRound className="h-10 w-10 rounded-2xl bg-amber-100 p-2 text-amber-800" /><p className="mt-4 text-3xl font-black">{pendingMentors.length}</p><p className="font-bold text-slate-500">Mentors needing review</p></div>
          <div className="rounded-3xl bg-white p-6 shadow-sm"><Flag className="h-10 w-10 rounded-2xl bg-red-100 p-2 text-red-800" /><p className="mt-4 text-3xl font-black">{openIncidents}</p><p className="font-bold text-slate-500">Open incidents</p></div>
          <div className="rounded-3xl bg-white p-6 shadow-sm"><ShieldCheck className="h-10 w-10 rounded-2xl bg-emerald-100 p-2 text-emerald-800" /><p className="mt-4 text-3xl font-black">{reviewedMentors.length}</p><p className="font-bold text-slate-500">Reviewed mentors</p></div>
        </div>

        <section className="mt-8">
          <div className="flex items-center gap-3"><UserCheck className="h-7 w-7 text-brand-700" /><div><h2 className="text-2xl font-black">Mentor verification queue</h2><p className="text-sm text-slate-500">No mentor enters automated matching until both checks are recorded.</p></div></div>
          <div className="mt-5 space-y-5">{pendingMentors.length ? pendingMentors.map((mentor) => <MentorReviewCard key={mentor.id} mentor={mentor} busy={busyId === mentor.id} onReview={update} />) : <p className="rounded-3xl bg-white p-8 text-center font-bold text-slate-500">No mentor is waiting for review.</p>}</div>
        </section>

        <section className="mt-10">
          <div className="flex items-center gap-3"><Flag className="h-7 w-7 text-red-700" /><div><h2 className="text-2xl font-black">Safeguarding incidents</h2><p className="text-sm text-slate-500">Reports immediately suspend the reported profile, end contact and cancel scheduled meetings.</p></div></div>
          <div className="mt-5 space-y-5">{data.incidents.length ? data.incidents.map((incident) => <IncidentCard key={incident.id} incident={incident} busy={busyId === incident.id} onReview={update} />) : <p className="rounded-3xl bg-white p-8 text-center font-bold text-slate-500">No safeguarding incidents.</p>}</div>
        </section>

        {reviewedMentors.length > 0 && (
          <section className="mt-10">
            <div className="flex items-center gap-3"><BadgeCheck className="h-7 w-7 text-emerald-700" /><h2 className="text-2xl font-black">Reviewed mentors</h2></div>
            <div className="mt-5 space-y-5">{reviewedMentors.map((mentor) => <MentorReviewCard key={mentor.id} mentor={mentor} busy={false} onReview={update} />)}</div>
          </section>
        )}
      </main>
    </div>
  );
}
