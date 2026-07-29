'use client';

import {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {createPortal} from 'react-dom';
import {
  CheckCircle2,
  CircleAlert,
  LoaderCircle,
  Mail,
  RefreshCw,
  Send,
} from 'lucide-react';

import type {
  DreamApplicantEmailDelivery,
  DreamApplicantEmailKind,
  DreamApplicationStatus,
} from '@/lib/dream-applications/types';

interface EmailApplication {
  id: string;
  reference: string;
  status: DreamApplicationStatus;
  fullName: string;
  email: string;
  locale: 'en' | 'ro' | 'es';
  applicantEmailDeliveries?: DreamApplicantEmailDelivery[];
}

interface ApplicationResponse {
  application: EmailApplication;
  viewer?: {
    isAdmin?: boolean;
  };
}

interface EmailPreview {
  kind: DreamApplicantEmailKind;
  to: string;
  subject: string;
  body: string;
}

interface EmailActionResponse {
  preview?: EmailPreview;
  delivery?: DreamApplicantEmailDelivery;
  sent?: boolean;
  error?: string;
}

function selectedApplicationId(): string | null {
  const link = Array.from(document.querySelectorAll<HTMLAnchorElement>('a[href]')).find((element) => (
    element.getAttribute('href')?.includes('/api/admin/dream-applications/')
    && element.getAttribute('href')?.includes('/files/')
  ));
  const href = link?.getAttribute('href') || '';
  const match = href.match(/\/api\/admin\/dream-applications\/([^/]+)\/files\//);
  return match?.[1] ? decodeURIComponent(match[1]) : null;
}

function privateFilesSection(): HTMLElement | null {
  const heading = Array.from(document.querySelectorAll<HTMLHeadingElement>('h3')).find((element) => (
    (element.textContent || '').trim().startsWith('Private files')
  ));
  return heading?.closest('section') || null;
}

function emailKind(status: DreamApplicationStatus): DreamApplicantEmailKind | null {
  if (
    status === 'more_info_requested'
    || status === 'approved'
    || status === 'declined'
  ) {
    return status;
  }
  return null;
}

function kindLabel(kind: DreamApplicantEmailKind): string {
  if (kind === 'more_info_requested') return 'More information request';
  if (kind === 'approved') return 'Approval email';
  return 'Decline email';
}

function formatDate(value?: string): string {
  if (!value) return 'Not available';
  return new Intl.DateTimeFormat('en-GB', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));
}

async function readPayload(response: Response): Promise<EmailActionResponse> {
  return response.json().catch(() => ({})) as Promise<EmailActionResponse>;
}

export default function DreamApplicantEmailEnhancer() {
  const [portalHost, setPortalHost] = useState<HTMLDivElement | null>(null);
  const [application, setApplication] = useState<EmailApplication | null>(null);
  const [informationRequest, setInformationRequest] = useState('');
  const [preview, setPreview] = useState<EmailPreview | null>(null);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string>();
  const activeIdRef = useRef<string | null>(null);
  const hostRef = useRef<HTMLDivElement | null>(null);

  const removePanel = useCallback(() => {
    hostRef.current?.remove();
    hostRef.current = null;
    activeIdRef.current = null;
    setPortalHost(null);
    setApplication(null);
    setPreview(null);
    setError(undefined);
  }, []);

  const loadApplication = useCallback(async (id: string) => {
    const response = await fetch(`/api/admin/dream-applications/${encodeURIComponent(id)}`, {
      cache: 'no-store',
    });
    if (!response.ok) return null;
    const payload = await response.json() as ApplicationResponse;
    if (!payload.viewer?.isAdmin) return null;
    setApplication(payload.application);
    return payload.application;
  }, []);

  const synchronize = useCallback(async () => {
    const id = selectedApplicationId();
    const filesSection = privateFilesSection();
    if (!id || !filesSection?.parentElement) {
      if (hostRef.current) removePanel();
      return;
    }

    if (activeIdRef.current === id && hostRef.current?.isConnected) return;
    removePanel();

    const loaded = await loadApplication(id);
    if (!loaded || !filesSection.parentElement || !filesSection.isConnected) return;

    const host = document.createElement('div');
    host.dataset.dreamApplicantEmail = id;
    filesSection.parentElement.insertBefore(host, filesSection);
    activeIdRef.current = id;
    hostRef.current = host;
    setPortalHost(host);
  }, [loadApplication, removePanel]);

  useEffect(() => {
    let disposed = false;
    let synchronizing = false;
    const run = async () => {
      if (disposed || synchronizing) return;
      synchronizing = true;
      try {
        await synchronize();
      } finally {
        synchronizing = false;
      }
    };

    void run();
    const observer = new MutationObserver(() => void run());
    observer.observe(document.body, {childList: true, subtree: true});
    const interval = window.setInterval(() => void run(), 1500);

    return () => {
      disposed = true;
      observer.disconnect();
      window.clearInterval(interval);
      removePanel();
    };
  }, [removePanel, synchronize]);

  useEffect(() => {
    if (!portalHost || !application) return;
    const interval = window.setInterval(() => {
      void loadApplication(application.id);
    }, 10_000);
    return () => window.clearInterval(interval);
  }, [application, loadApplication, portalHost]);

  const kind = application ? emailKind(application.status) : null;
  const deliveries = useMemo(
    () => application?.applicantEmailDeliveries || [],
    [application?.applicantEmailDeliveries],
  );
  const kindDeliveries = useMemo(
    () => kind ? deliveries.filter((delivery) => delivery.kind === kind) : [],
    [deliveries, kind],
  );
  const successfulDelivery = [...kindDeliveries]
    .reverse()
    .find((delivery) => Boolean(delivery.sentAt));
  const latestDelivery = kindDeliveries.at(-1);
  const failedInformationRequest = kind === 'more_info_requested'
    ? [...kindDeliveries]
      .reverse()
      .find((delivery) => delivery.error && delivery.informationRequest)
      ?.informationRequest
    : undefined;

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setPreview(null);
      setError(undefined);
      setInformationRequest(kind === 'more_info_requested' ? failedInformationRequest || '' : '');
    }, 0);
    return () => window.clearTimeout(timeout);
  }, [application?.id, failedInformationRequest, kind]);

  async function performAction(mode: 'preview' | 'send') {
    if (!application || !kind) return;
    const response = await fetch(
      `/api/admin/dream-applications/${encodeURIComponent(application.id)}/applicant-email`,
      {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          mode,
          kind,
          informationRequest: kind === 'more_info_requested' ? informationRequest : undefined,
        }),
      },
    );
    const payload = await readPayload(response);
    if (payload.delivery) {
      setApplication((current) => current ? {
        ...current,
        applicantEmailDeliveries: [
          ...(current.applicantEmailDeliveries || []),
          payload.delivery as DreamApplicantEmailDelivery,
        ],
      } : current);
    }
    if (!response.ok) throw new Error(payload.error || 'Unable to process this email.');
    if (payload.preview) setPreview(payload.preview);
    return payload;
  }

  async function previewEmail() {
    setLoading(true);
    setError(undefined);
    try {
      await performAction('preview');
    } catch (previewError) {
      setPreview(null);
      setError(previewError instanceof Error ? previewError.message : 'Unable to preview this email.');
    } finally {
      setLoading(false);
    }
  }

  async function sendEmail() {
    if (!application || !kind || !preview || successfulDelivery) return;
    const confirmed = window.confirm(
      `Send this ${kindLabel(kind).toLowerCase()} to ${application.email}?`,
    );
    if (!confirmed) return;

    setSending(true);
    setError(undefined);
    try {
      await performAction('send');
      await loadApplication(application.id);
    } catch (sendError) {
      setError(sendError instanceof Error ? sendError.message : 'Email delivery failed.');
      await loadApplication(application.id);
    } finally {
      setSending(false);
    }
  }

  if (!portalHost || !application) return null;

  return createPortal(
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-5 flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-brand-100 text-brand-700">
          <Mail className="h-5 w-5" />
        </span>
        <div>
          <h3 className="text-lg font-black text-slate-950">Applicant email</h3>
          <p className="text-xs font-semibold text-slate-400">Manual review before every send</p>
        </div>
      </div>

      {!kind ? (
        <p className="rounded-2xl bg-slate-50 p-4 text-sm font-semibold leading-relaxed text-slate-600">
          A decision email becomes available when the application is set to More information, Approved or Declined.
        </p>
      ) : successfulDelivery ? (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
          <p className="flex items-center gap-2 font-black text-emerald-800">
            <CheckCircle2 className="h-5 w-5" />
            Email sent
          </p>
          <p className="mt-2 text-sm font-semibold text-emerald-700">
            {kindLabel(kind)} was delivered to {application.email} on {formatDate(successfulDelivery.sentAt)}.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="rounded-2xl bg-brand-50 p-4 text-sm">
            <p className="font-black text-brand-900">{kindLabel(kind)}</p>
            <p className="mt-1 font-semibold text-brand-700">
              Recipient: {application.email} · Language: {application.locale.toUpperCase()}
            </p>
          </div>

          {kind === 'more_info_requested' && (
            <label className="block text-sm font-bold text-slate-700">
              Information needed — write this in {application.locale.toUpperCase()}
              <textarea
                rows={5}
                maxLength={2000}
                value={informationRequest}
                onChange={(event) => {
                  setInformationRequest(event.target.value);
                  setPreview(null);
                }}
                placeholder="List exactly what the applicant needs to send or clarify..."
                className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-100"
              />
              <span className="mt-1 block text-right text-xs text-slate-400">
                {informationRequest.length}/2000
              </span>
            </label>
          )}

          <button
            type="button"
            disabled={loading || (kind === 'more_info_requested' && informationRequest.trim().length < 5)}
            onClick={() => void previewEmail()}
            className="flex w-full items-center justify-center gap-2 rounded-2xl border border-brand-200 bg-white px-4 py-3 font-black text-brand-700 transition hover:bg-brand-50 disabled:opacity-50"
          >
            {loading ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
            {preview ? 'Refresh preview' : 'Preview email'}
          </button>

          {preview && (
            <div className="overflow-hidden rounded-2xl border border-slate-200">
              <div className="border-b border-slate-200 bg-slate-50 p-4 text-sm">
                <p><strong>To:</strong> {preview.to}</p>
                <p className="mt-1"><strong>Subject:</strong> {preview.subject}</p>
              </div>
              <pre className="max-h-96 overflow-auto whitespace-pre-wrap p-4 font-sans text-sm leading-relaxed text-slate-700">
                {preview.body}
              </pre>
            </div>
          )}

          {latestDelivery?.error && (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-800">
              <p className="flex items-center gap-2 font-black">
                <CircleAlert className="h-5 w-5" />
                Last delivery failed
              </p>
              <p className="mt-2 break-words">{latestDelivery.error}</p>
            </div>
          )}

          <button
            type="button"
            disabled={!preview || sending}
            onClick={() => void sendEmail()}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-950 px-4 py-3 font-black text-white transition hover:bg-slate-800 disabled:opacity-50"
          >
            {sending ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            {latestDelivery?.error ? 'Resend email' : 'Send email'}
          </button>
        </div>
      )}

      {error && (
        <p className="mt-4 flex items-start gap-2 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-800">
          <CircleAlert className="mt-0.5 h-5 w-5 shrink-0" />
          {error}
        </p>
      )}

      {deliveries.length > 0 && (
        <div className="mt-6 border-t border-slate-200 pt-5">
          <p className="text-xs font-black uppercase tracking-wider text-slate-400">Private delivery history</p>
          <div className="mt-3 space-y-3">
            {[...deliveries].reverse().map((delivery) => (
              <div key={delivery.id} className="rounded-2xl bg-slate-50 p-4 text-sm">
                <p className="flex items-center gap-2 font-black text-slate-800">
                  {delivery.sentAt ? (
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  ) : (
                    <CircleAlert className="h-4 w-4 text-red-600" />
                  )}
                  {kindLabel(delivery.kind)} — {delivery.sentAt ? 'Sent' : 'Failed'}
                </p>
                <p className="mt-1 text-xs font-semibold text-slate-500">
                  {formatDate(delivery.sentAt || delivery.attemptedAt)} · {delivery.requestedBy}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>,
    portalHost,
  );
}
