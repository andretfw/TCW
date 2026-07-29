'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  ArrowLeft,
  BadgeCheck,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  CircleAlert,
  ClipboardList,
  Download,
  ExternalLink,
  FileHeart,
  Filter,
  HeartHandshake,
  Languages,
  LoaderCircle,
  LockKeyhole,
  LogIn,
  LogOut,
  MapPin,
  MessageSquareText,
  RefreshCw,
  Search,
  ShieldCheck,
  Sparkles,
  Trash2,
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

import {
  DREAM_APPLICATION_STATUSES,
  type DreamApplicationEvent,
  type DreamApplicationInput,
  type DreamApplicationListItem,
  type DreamApplicationNote,
  type DreamApplicationStatus,
  type DreamApplicationFile,
} from '@/lib/dream-applications/types';

type AdminFile = Omit<DreamApplicationFile, 'storageKey'>;

interface AdminApplication extends DreamApplicationInput {
  id: string;
  reference: string;
  status: DreamApplicationStatus;
  createdAt: string;
  updatedAt: string;
  submittedAt?: string;
  retentionDeleteAt?: string;
  files: AdminFile[];
  reviewerNotes: DreamApplicationNote[];
  history: DreamApplicationEvent[];
  consentVersion: string;
  grantPolicyVersion: string;
  privacyNoticeVersion: string;
}

const STATUS_COPY: Record<DreamApplicationStatus, {label: string; className: string}> = {
  draft: {label: 'Draft', className: 'bg-neutral-100 text-neutral-700'},
  new: {label: 'New', className: 'bg-fuchsia-100 text-fuchsia-800'},
  under_review: {label: 'Under review', className: 'bg-blue-100 text-blue-800'},
  more_info_requested: {label: 'More information', className: 'bg-amber-100 text-amber-900'},
  board_review: {label: 'Board review', className: 'bg-purple-100 text-purple-800'},
  approved: {label: 'Approved', className: 'bg-emerald-100 text-emerald-800'},
  declined: {label: 'Declined', className: 'bg-rose-100 text-rose-800'},
  closed: {label: 'Closed', className: 'bg-slate-200 text-slate-800'},
};

const TREATMENT_COPY: Record<DreamApplicationInput['treatmentStatus'], string> = {
  active_treatment: 'Active treatment',
  post_surgery_recovery: 'Post-surgery recovery',
  remission: 'Remission',
  palliative_care: 'Palliative care',
  other: 'Other',
};

const PUBLICITY_COPY: Record<DreamApplicationInput['publicityChoice'], string> = {
  full: 'Full story permission',
  anonymous: 'Anonymous or limited permission',
  none: 'Private - no publication',
};

async function readJson<T>(response: Response): Promise<T> {
  const payload = await response.json() as T & {error?: string};
  if (!response.ok) {
    const error = new Error(payload.error || 'Request failed.') as Error & {status?: number};
    error.status = response.status;
    throw error;
  }
  return payload;
}

function formatDate(value?: string) {
  if (!value) return 'Not available';
  return new Intl.DateTimeFormat('en-GB', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));
}

function StatusBadge({status}: {status: DreamApplicationStatus}) {
  const copy = STATUS_COPY[status];
  return (
    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-black ${copy.className}`}>
      {copy.label}
    </span>
  );
}

function DetailCard({
  icon,
  title,
  children,
  className = '',
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={`rounded-3xl border border-slate-200 bg-white p-6 shadow-sm ${className}`}>
      <div className="mb-5 flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-brand-100 text-brand-700">
          {icon}
        </span>
        <h3 className="text-lg font-black text-slate-950">{title}</h3>
      </div>
      {children}
    </section>
  );
}

function LabelValue({label, value}: {label: string; value?: React.ReactNode}) {
  return (
    <div>
      <dt className="text-xs font-bold uppercase tracking-wider text-slate-400">{label}</dt>
      <dd className="mt-1 whitespace-pre-wrap text-sm font-semibold leading-relaxed text-slate-800">
        {value || 'Not provided'}
      </dd>
    </div>
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
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 px-5 py-12 text-white">
      <div className="absolute left-1/4 top-0 h-96 w-96 rounded-full bg-brand-600/25 blur-[120px]" />
      <div className="absolute bottom-0 right-1/4 h-96 w-96 rounded-full bg-fuchsia-600/20 blur-[120px]" />
      <div className="relative w-full max-w-md overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.07] p-7 shadow-2xl backdrop-blur-xl md:p-10">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-fuchsia-600 shadow-lg shadow-brand-600/30">
          <LockKeyhole className="h-8 w-8" />
        </div>
        <p className="mt-6 text-center text-xs font-black uppercase tracking-[0.25em] text-brand-300">TCW private review</p>
        <h1 className="mt-3 text-center text-3xl font-black">Dream applications</h1>
        <p className="mt-3 text-center text-sm leading-relaxed text-slate-300">
          This area contains confidential health information and is available only to invited TCW reviewers.
        </p>

        {loading ? (
          <div className="mt-8 flex items-center justify-center gap-3 rounded-2xl bg-white/5 p-5 text-sm font-bold text-slate-200">
            <LoaderCircle className="h-5 w-5 animate-spin" />
            Checking secure access
          </div>
        ) : (
          <>
            <button
              type="button"
              onClick={() => oauthLogin('google')}
              className="mt-8 flex w-full items-center justify-center gap-3 rounded-2xl bg-white px-5 py-3.5 font-black text-slate-900 transition hover:bg-brand-50"
            >
              <LogIn className="h-5 w-5 text-brand-600" />
              Continue with Google
            </button>
            <div className="my-6 flex items-center gap-3 text-xs font-bold uppercase tracking-wider text-slate-500">
              <span className="h-px flex-1 bg-white/10" />
              or invited email
              <span className="h-px flex-1 bg-white/10" />
            </div>
            <form
              onSubmit={async (event) => {
                event.preventDefault();
                setSubmitting(true);
                try {
                  await onEmailLogin(email, password);
                } finally {
                  setSubmitting(false);
                }
              }}
              className="space-y-4"
            >
              <label className="block text-sm font-bold text-slate-200">
                Email
                <input
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3 text-white outline-none focus:border-brand-400 focus:ring-4 focus:ring-brand-500/20"
                />
              </label>
              <label className="block text-sm font-bold text-slate-200">
                Password
                <input
                  type="password"
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3 text-white outline-none focus:border-brand-400 focus:ring-4 focus:ring-brand-500/20"
                />
              </label>
              <button
                type="submit"
                disabled={submitting}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-brand-600 px-5 py-3.5 font-black transition hover:bg-brand-500 disabled:opacity-60"
              >
                {submitting && <LoaderCircle className="h-5 w-5 animate-spin" />}
                Sign in securely
              </button>
            </form>
          </>
        )}
        {error && (
          <p className="mt-5 flex items-start gap-2 rounded-2xl border border-red-400/20 bg-red-400/10 p-4 text-sm font-semibold leading-relaxed text-red-100" role="alert">
            <CircleAlert className="mt-0.5 h-5 w-5 shrink-0" />
            {error}
          </p>
        )}
        <p className="mt-6 text-center text-xs leading-relaxed text-slate-500">
          Do not share screenshots, downloads or login details. All access is subject to TCW confidentiality rules.
        </p>
      </div>
    </main>
  );
}

export default function AdminDreamApplications() {
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [authError, setAuthError] = useState<string>();
  const [applications, setApplications] = useState<DreamApplicationListItem[]>([]);
  const [selected, setSelected] = useState<AdminApplication | null>(null);
  const [loading, setLoading] = useState(false);
  const [accessDenied, setAccessDenied] = useState(false);
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | DreamApplicationStatus>('all');
  const [note, setNote] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string>();

  useEffect(() => {
    let active = true;
    async function initialize() {
      try {
        await handleAuthCallback();
        const currentUser = await getUser();
        if (active) {
          setUser(currentUser);
          if (currentUser) await loadApplications();
        }
      } catch (initializationError) {
        if (active) {
          setAuthError(
            initializationError instanceof Error
              ? initializationError.message
              : 'Unable to verify this login.',
          );
        }
      } finally {
        if (active) setAuthLoading(false);
      }
    }
    void initialize();
    return () => {
      active = false;
    };
  }, []);

  async function loadApplications() {
    setLoading(true);
    setError(undefined);
    try {
      const payload = await readJson<{applications: DreamApplicationListItem[]}>(
        await fetch('/api/admin/dream-applications', {cache: 'no-store'}),
      );
      setApplications(payload.applications);
      setAccessDenied(false);
    } catch (loadError) {
      const status = (loadError as Error & {status?: number}).status;
      if (status === 403) setAccessDenied(true);
      if (status === 401) setUser(null);
      setError(loadError instanceof Error ? loadError.message : 'Unable to load applications.');
    } finally {
      setLoading(false);
    }
  }

  async function loadApplication(id: string) {
    setLoading(true);
    setError(undefined);
    try {
      const payload = await readJson<{application: AdminApplication}>(
        await fetch(`/api/admin/dream-applications/${id}`, {cache: 'no-store'}),
      );
      setSelected(payload.application);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Unable to load the application.');
    } finally {
      setLoading(false);
    }
  }

  async function updateApplication(status: DreamApplicationStatus, reviewerNote?: string) {
    if (!selected) return;
    setSaving(true);
    setError(undefined);
    try {
      const payload = await readJson<{application: AdminApplication}>(
        await fetch('/api/admin/dream-applications', {
          method: 'PATCH',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            applicationId: selected.id,
            status,
            reviewerNote: reviewerNote || undefined,
          }),
        }),
      );
      setSelected(payload.application);
      setNote('');
      await loadApplications();
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'Unable to save the update.');
    } finally {
      setSaving(false);
    }
  }

  async function permanentlyDelete() {
    if (!selected) return;
    const confirmed = window.confirm(
      `Permanently delete ${selected.reference}, including every medical document and photograph? This cannot be undone.`,
    );
    if (!confirmed) return;

    setSaving(true);
    try {
      await readJson<{ok: true}>(
        await fetch('/api/admin/dream-applications', {
          method: 'DELETE',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({applicationId: selected.id}),
        }),
      );
      setSelected(null);
      await loadApplications();
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : 'Unable to delete the application.');
    } finally {
      setSaving(false);
    }
  }

  async function emailLogin(email: string, password: string) {
    setAuthError(undefined);
    try {
      const loggedIn = await login(email, password);
      setUser(loggedIn);
      await loadApplications();
    } catch (loginError) {
      setAuthError(loginError instanceof Error ? loginError.message : 'Unable to sign in.');
    }
  }

  async function signOut() {
    await logout();
    setUser(null);
    setApplications([]);
    setSelected(null);
  }

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return applications.filter((application) => {
      const matchesStatus = statusFilter === 'all' || application.status === statusFilter;
      const matchesQuery = !normalized || [
        application.reference,
        application.fullName,
        application.country,
        application.diagnosis,
        application.dream,
      ].some((value) => value.toLowerCase().includes(normalized));
      return matchesStatus && matchesQuery;
    });
  }, [applications, query, statusFilter]);

  const counts = useMemo(() => ({
    new: applications.filter((application) => application.status === 'new').length,
    review: applications.filter((application) => ['under_review', 'board_review'].includes(application.status)).length,
    approved: applications.filter((application) => application.status === 'approved').length,
  }), [applications]);

  if (!user) {
    return <LoginScreen loading={authLoading} error={authError} onEmailLogin={emailLogin} />;
  }

  if (accessDenied) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 p-6 text-white">
        <div className="max-w-lg rounded-[2rem] border border-red-400/20 bg-white/5 p-8 text-center">
          <ShieldCheck className="mx-auto h-12 w-12 text-red-300" />
          <h1 className="mt-5 text-3xl font-black">Reviewer access required</h1>
          <p className="mt-3 leading-relaxed text-slate-300">
            You are signed in as {user.email}, but this account has not been assigned the <strong>dream-reviewer</strong> role or included in the approved email list.
          </p>
          <button type="button" onClick={signOut} className="mt-7 rounded-full bg-white px-6 py-3 font-black text-slate-900">
            Sign out
          </button>
        </div>
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <header className="sticky top-0 z-40 border-b border-white/10 bg-slate-950 text-white shadow-xl">
        <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-4 px-5 py-4 md:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-fuchsia-600">
              <HeartHandshake className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-300">TCW private review</p>
              <h1 className="font-black">Dream applications</h1>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="hidden text-right text-xs text-slate-400 md:block">
              Signed in<br /><strong className="text-slate-200">{user.email}</strong>
            </span>
            <button type="button" onClick={loadApplications} className="rounded-xl p-2.5 text-slate-300 hover:bg-white/10 hover:text-white" aria-label="Refresh applications">
              <RefreshCw className={`h-5 w-5 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button type="button" onClick={signOut} className="rounded-xl p-2.5 text-slate-300 hover:bg-white/10 hover:text-white" aria-label="Sign out">
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1600px] px-4 py-6 md:px-8 md:py-8">
        {error && (
          <div className="mb-6 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-800" role="alert">
            <CircleAlert className="h-5 w-5 shrink-0" />
            {error}
          </div>
        )}

        {selected ? (
          <div>
            <button type="button" onClick={() => setSelected(null)} className="mb-5 inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-black text-slate-700 shadow-sm hover:text-brand-700">
              <ArrowLeft className="h-4 w-4" />
              All applications
            </button>

            <div className="mb-6 overflow-hidden rounded-[2rem] bg-gradient-to-br from-brand-700 via-purple-800 to-slate-950 p-6 text-white shadow-xl md:p-9">
              <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <StatusBadge status={selected.status} />
                    <span className="text-xs font-bold uppercase tracking-wider text-brand-200">{selected.reference}</span>
                  </div>
                  <h2 className="mt-4 text-3xl font-black md:text-5xl">{selected.fullName}</h2>
                  <p className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm text-brand-100">
                    <span className="flex items-center gap-1.5"><MapPin className="h-4 w-4" />{selected.city}, {selected.country}</span>
                    <span className="flex items-center gap-1.5"><CalendarDays className="h-4 w-4" />Submitted {formatDate(selected.submittedAt)}</span>
                    <span className="flex items-center gap-1.5"><Languages className="h-4 w-4" />{selected.locale.toUpperCase()}</span>
                  </p>
                </div>
                <div className="min-w-64 rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur">
                  <label className="text-xs font-bold uppercase tracking-wider text-brand-100">Application status</label>
                  <select
                    value={selected.status}
                    disabled={saving}
                    onChange={(event) => void updateApplication(event.target.value as DreamApplicationStatus)}
                    className="mt-2 w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 font-bold text-white"
                  >
                    {DREAM_APPLICATION_STATUSES.filter((status) => status !== 'draft').map((status) => (
                      <option key={status} value={status}>{STATUS_COPY[status].label}</option>
                    ))}
                  </select>
                  {selected.retentionDeleteAt && (
                    <p className="mt-2 text-xs leading-relaxed text-amber-200">
                      Scheduled secure deletion: {formatDate(selected.retentionDeleteAt)}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
              <div className="space-y-6">
                <DetailCard icon={<UserRound className="h-5 w-5" />} title="Applicant and contact">
                  <dl className="grid gap-5 md:grid-cols-2">
                    <LabelValue label="Full name" value={selected.fullName} />
                    <LabelValue label="Preferred contact" value={selected.preferredContact} />
                    <LabelValue label="Email" value={<a className="text-brand-700 hover:underline" href={`mailto:${selected.email}`}>{selected.email}</a>} />
                    <LabelValue label="Phone" value={<a className="text-brand-700 hover:underline" href={`tel:${selected.phone}`}>{selected.phone}</a>} />
                    <LabelValue label="Location" value={`${selected.city}, ${selected.country}`} />
                    <LabelValue label="Social profile" value={selected.socialProfile ? <a className="inline-flex items-center gap-1 text-brand-700 hover:underline" href={selected.socialProfile} target="_blank" rel="noopener noreferrer">Open profile <ExternalLink className="h-3.5 w-3.5" /></a> : undefined} />
                  </dl>
                </DetailCard>

                <DetailCard icon={<FileHeart className="h-5 w-5" />} title="Cancer and eligibility">
                  <dl className="grid gap-5 md:grid-cols-2">
                    <LabelValue label="Diagnosis" value={selected.diagnosis} />
                    <LabelValue label="Stage" value={selected.cancerStage} />
                    <LabelValue label="Diagnosis date" value={selected.diagnosisDate} />
                    <LabelValue label="Current status" value={`${TREATMENT_COPY[selected.treatmentStatus]}${selected.treatmentStatusOther ? ` - ${selected.treatmentStatusOther}` : ''}`} />
                  </dl>
                </DetailCard>

                <DetailCard icon={<Sparkles className="h-5 w-5" />} title="Story and dream">
                  <dl className="space-y-6">
                    <LabelValue label="Who they are beyond cancer" value={selected.story} />
                    <LabelValue label="Dream or wish" value={selected.dream} />
                    <LabelValue label="Emotional meaning" value={selected.emotionalImpact} />
                    <div className="grid gap-5 rounded-2xl bg-brand-50 p-5 md:grid-cols-2">
                      <LabelValue label="Estimated total cost" value={selected.estimatedCost} />
                      <LabelValue label="Difference plan" value={selected.differencePlan} />
                      <LabelValue label="Supplier link" value={selected.supplierLink ? <a className="inline-flex items-center gap-1 text-brand-700 hover:underline" href={selected.supplierLink} target="_blank" rel="noopener noreferrer">Open link <ExternalLink className="h-3.5 w-3.5" /></a> : undefined} />
                    </div>
                  </dl>
                </DetailCard>

                <DetailCard icon={<ShieldCheck className="h-5 w-5" />} title="Consent and declarations">
                  <dl className="grid gap-5 md:grid-cols-2">
                    <LabelValue label="Publicity choice" value={PUBLICITY_COPY[selected.publicityChoice]} />
                    <LabelValue label="Health-data consent" value={selected.consentsHealthData ? 'Explicitly confirmed' : 'Missing'} />
                    <LabelValue label="Grant Policy" value={`Accepted v${selected.grantPolicyVersion}`} />
                    <LabelValue label="Privacy Notice" value={`Read - version ${selected.privacyNoticeVersion}`} />
                    <LabelValue label="Accuracy declaration" value={selected.confirmsAccuracy ? 'Confirmed' : 'Missing'} />
                    <LabelValue label="Proof within 3 months" value={selected.confirmsProofOfUse ? 'Confirmed' : 'Missing'} />
                  </dl>
                </DetailCard>
              </div>

              <aside className="space-y-6">
                <DetailCard icon={<Download className="h-5 w-5" />} title={`Private files (${selected.files.length})`}>
                  <div className="space-y-3">
                    {selected.files.map((file) => (
                      <a
                        key={file.id}
                        href={`/api/admin/dream-applications/${selected.id}/files/${file.id}`}
                        className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 p-4 transition hover:border-brand-300 hover:bg-brand-50"
                      >
                        <span className="min-w-0">
                          <span className="block truncate text-sm font-black text-slate-800">{file.originalName}</span>
                          <span className="mt-1 block text-xs font-semibold uppercase tracking-wide text-slate-400">
                            {file.category} · {(file.size / 1024 / 1024).toFixed(1)} MB
                          </span>
                        </span>
                        <Download className="h-5 w-5 shrink-0 text-brand-600" />
                      </a>
                    ))}
                  </div>
                  <p className="mt-4 rounded-xl bg-amber-50 p-3 text-xs font-medium leading-relaxed text-amber-900">
                    Downloads are decrypted only after authorization. Store them securely and delete local copies when no longer needed.
                  </p>
                </DetailCard>

                <DetailCard icon={<MessageSquareText className="h-5 w-5" />} title="Private reviewer notes">
                  <textarea
                    rows={5}
                    value={note}
                    onChange={(event) => setNote(event.target.value)}
                    placeholder="Add a confidential note for the TCW board..."
                    className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-100"
                  />
                  <button
                    type="button"
                    disabled={saving || !note.trim()}
                    onClick={() => void updateApplication(selected.status, note)}
                    className="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-950 px-4 py-3 font-black text-white disabled:opacity-50"
                  >
                    {saving && <LoaderCircle className="h-4 w-4 animate-spin" />}
                    Save private note
                  </button>
                  <div className="mt-5 space-y-3">
                    {[...selected.reviewerNotes].reverse().map((entry) => (
                      <div key={entry.id} className="rounded-2xl bg-slate-50 p-4">
                        <p className="whitespace-pre-wrap text-sm leading-relaxed text-slate-700">{entry.body}</p>
                        <p className="mt-2 text-[11px] font-semibold text-slate-400">{entry.author} · {formatDate(entry.createdAt)}</p>
                      </div>
                    ))}
                    {selected.reviewerNotes.length === 0 && (
                      <p className="text-sm text-slate-400">No reviewer notes yet.</p>
                    )}
                  </div>
                </DetailCard>

                <DetailCard icon={<ClipboardList className="h-5 w-5" />} title="Activity history">
                  <div className="space-y-4">
                    {[...selected.history].reverse().map((event) => (
                      <div key={event.id} className="flex gap-3">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                        <div>
                          <p className="text-sm font-bold text-slate-700">
                            {event.type === 'submitted' && 'Application submitted'}
                            {event.type === 'note_added' && 'Private note added'}
                            {event.type === 'status_changed' && `${event.fromStatus ? STATUS_COPY[event.fromStatus].label : ''} → ${event.toStatus ? STATUS_COPY[event.toStatus].label : ''}`}
                          </p>
                          <p className="text-xs text-slate-400">{formatDate(event.createdAt)} · {event.actor}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </DetailCard>

                <button
                  type="button"
                  disabled={saving}
                  onClick={permanentlyDelete}
                  className="flex w-full items-center justify-center gap-2 rounded-2xl border border-red-200 bg-white px-4 py-3 font-black text-red-700 transition hover:bg-red-50 disabled:opacity-50"
                >
                  <Trash2 className="h-5 w-5" />
                  Permanently delete application
                </button>
              </aside>
            </div>
          </div>
        ) : (
          <>
            <div className="grid gap-4 sm:grid-cols-3">
              {[
                {label: 'New applications', value: counts.new, icon: <Sparkles className="h-6 w-6" />, color: 'from-fuchsia-500 to-brand-600'},
                {label: 'In review', value: counts.review, icon: <ClipboardList className="h-6 w-6" />, color: 'from-blue-500 to-cyan-500'},
                {label: 'Approved', value: counts.approved, icon: <BadgeCheck className="h-6 w-6" />, color: 'from-emerald-500 to-teal-500'},
              ].map((card) => (
                <div key={card.label} className="rounded-3xl border border-white bg-white p-5 shadow-sm">
                  <div className={`flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br ${card.color} text-white`}>
                    {card.icon}
                  </div>
                  <p className="mt-5 text-3xl font-black text-slate-950">{card.value}</p>
                  <p className="mt-1 text-sm font-bold text-slate-500">{card.label}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 rounded-[2rem] border border-white bg-white p-5 shadow-sm md:p-7">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <h2 className="text-2xl font-black">Application queue</h2>
                  <p className="mt-1 text-sm text-slate-500">{filtered.length} of {applications.length} applications</p>
                </div>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <label className="relative">
                    <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      value={query}
                      onChange={(event) => setQuery(event.target.value)}
                      placeholder="Search name, country, dream..."
                      className="w-full rounded-2xl border border-slate-200 py-3 pl-11 pr-4 text-sm outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-100 sm:w-72"
                    />
                  </label>
                  <label className="relative">
                    <Filter className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <select
                      value={statusFilter}
                      onChange={(event) => setStatusFilter(event.target.value as typeof statusFilter)}
                      className="w-full appearance-none rounded-2xl border border-slate-200 py-3 pl-11 pr-8 text-sm font-bold outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-100"
                    >
                      <option value="all">All statuses</option>
                      {DREAM_APPLICATION_STATUSES.filter((status) => status !== 'draft').map((status) => (
                        <option key={status} value={status}>{STATUS_COPY[status].label}</option>
                      ))}
                    </select>
                  </label>
                </div>
              </div>

              <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200">
                {loading && applications.length === 0 ? (
                  <div className="flex items-center justify-center gap-3 p-12 font-bold text-slate-500">
                    <LoaderCircle className="h-6 w-6 animate-spin text-brand-600" />
                    Decrypting the private queue
                  </div>
                ) : filtered.length === 0 ? (
                  <div className="p-12 text-center">
                    <HeartHandshake className="mx-auto h-10 w-10 text-slate-300" />
                    <p className="mt-4 font-bold text-slate-500">No applications match this view.</p>
                  </div>
                ) : (
                  <div className="divide-y divide-slate-100">
                    {filtered.map((application) => (
                      <button
                        type="button"
                        key={application.id}
                        onClick={() => void loadApplication(application.id)}
                        className="grid w-full gap-4 p-5 text-left transition hover:bg-brand-50/50 md:grid-cols-[minmax(220px,1fr)_minmax(180px,.8fr)_minmax(240px,1.3fr)_auto] md:items-center"
                      >
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="font-black text-slate-900">{application.fullName}</p>
                            <StatusBadge status={application.status} />
                          </div>
                          <p className="mt-1 text-xs font-bold uppercase tracking-wider text-slate-400">{application.reference}</p>
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-700">{application.country}</p>
                          <p className="mt-1 text-xs text-slate-400">{application.diagnosis}</p>
                        </div>
                        <div>
                          <p className="line-clamp-2 text-sm leading-relaxed text-slate-600">{application.dream}</p>
                          <p className="mt-1 text-xs font-bold text-brand-700">Estimated cost: {application.estimatedCost}</p>
                        </div>
                        <div className="flex items-center justify-between gap-4 md:justify-end">
                          <span className="text-xs font-semibold text-slate-400">{formatDate(application.submittedAt)}</span>
                          <ChevronRight className="h-5 w-5 text-slate-300" />
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
