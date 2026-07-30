'use client';

import {useCallback, useEffect, useRef, useState} from 'react';
import {createPortal} from 'react-dom';
import {
  CheckCircle2,
  CircleAlert,
  LoaderCircle,
  Mail,
  RefreshCw,
  Send,
  ShieldCheck,
  X,
} from 'lucide-react';

interface BoardReviewPreview {
  recipients: string[];
  subject: string;
  body: string;
  reviewUrl: string;
}

interface BoardNotificationResult {
  sent: string[];
  failed: Array<{email: string; error: string}>;
}

interface BoardReviewResponse {
  preview?: BoardReviewPreview;
  alreadySent?: string[];
  pendingRecipients?: string[];
  boardNotification?: BoardNotificationResult;
  movedToBoardReview?: boolean;
  error?: string;
}

function selectedApplicationId(): string | null {
  const selected = document.querySelector<HTMLElement>('[data-dream-application-id]');
  const selectedId = selected?.dataset.dreamApplicationId;
  if (selectedId) return selectedId;

  const link = Array.from(document.querySelectorAll<HTMLAnchorElement>('a[href]')).find((element) => (
    element.getAttribute('href')?.includes('/api/admin/dream-applications/')
    && element.getAttribute('href')?.includes('/files/')
  ));
  const href = link?.getAttribute('href') || '';
  const match = href.match(/\/api\/admin\/dream-applications\/([^/]+)\/files\//);
  return match?.[1] ? decodeURIComponent(match[1]) : null;
}

function findStatusSelect(): HTMLSelectElement | null {
  return Array.from(document.querySelectorAll<HTMLSelectElement>('select')).find((select) => {
    const values = Array.from(select.options).map((option) => option.value);
    return values.includes('board_review')
      && values.includes('approved')
      && values.includes('closed')
      && !values.includes('all');
  }) || null;
}

function setNativeSelectValue(select: HTMLSelectElement, value: string) {
  const descriptor = Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype, 'value');
  descriptor?.set?.call(select, value);
}

async function readResponse(response: Response): Promise<BoardReviewResponse> {
  const payload = await response.json().catch(() => ({})) as BoardReviewResponse;
  if (!response.ok) throw new Error(payload.error || 'Unable to process the board review email.');
  return payload;
}

export default function DreamBoardReviewEmailEnhancer() {
  const [triggerHost, setTriggerHost] = useState<HTMLDivElement | null>(null);
  const [currentStatus, setCurrentStatus] = useState('');
  const [applicationId, setApplicationId] = useState<string>();
  const [sourceStatus, setSourceStatus] = useState<string>();
  const [preview, setPreview] = useState<BoardReviewPreview>();
  const [alreadySent, setAlreadySent] = useState<string[]>([]);
  const [pendingRecipients, setPendingRecipients] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string>();
  const selectRef = useRef<HTMLSelectElement | null>(null);
  const hostRef = useRef<HTMLDivElement | null>(null);
  const previousStatusRef = useRef('');
  const listenersRef = useRef<{
    remember: () => void;
    change: (event: Event) => void;
  } | undefined>(undefined);

  const closePreview = useCallback(() => {
    if (sending) return;
    setApplicationId(undefined);
    setSourceStatus(undefined);
    setPreview(undefined);
    setAlreadySent([]);
    setPendingRecipients([]);
    setError(undefined);
  }, [sending]);

  const loadPreview = useCallback(async (id: string, status: string) => {
    setApplicationId(id);
    setSourceStatus(status);
    setLoading(true);
    setError(undefined);
    setPreview(undefined);
    try {
      const payload = await readResponse(await fetch(
        `/api/admin/dream-applications/${encodeURIComponent(id)}/board-review-email`,
        {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({mode: 'preview'}),
        },
      ));
      setPreview(payload.preview);
      setAlreadySent(payload.alreadySent || []);
      setPendingRecipients(payload.pendingRecipients || payload.preview?.recipients || []);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Unable to preview the board review email.');
    } finally {
      setLoading(false);
    }
  }, []);

  const removeEnhancement = useCallback(() => {
    const select = selectRef.current;
    const listeners = listenersRef.current;
    if (select && listeners) {
      select.removeEventListener('pointerdown', listeners.remember, true);
      select.removeEventListener('focus', listeners.remember, true);
      select.removeEventListener('keydown', listeners.remember, true);
      select.removeEventListener('change', listeners.change, true);
    }
    hostRef.current?.remove();
    selectRef.current = null;
    hostRef.current = null;
    listenersRef.current = undefined;
    setTriggerHost(null);
    setCurrentStatus('');
  }, []);

  const installEnhancement = useCallback((select: HTMLSelectElement) => {
    removeEnhancement();
    previousStatusRef.current = select.value;
    setCurrentStatus(select.value);

    const host = document.createElement('div');
    host.dataset.dreamBoardReviewEmail = 'true';
    select.insertAdjacentElement('afterend', host);

    const remember = () => {
      previousStatusRef.current = select.value;
    };
    const change = (event: Event) => {
      const nextStatus = select.value;
      const previousStatus = previousStatusRef.current;
      if (nextStatus !== 'board_review' || previousStatus === 'board_review') {
        previousStatusRef.current = nextStatus;
        setCurrentStatus(nextStatus);
        return;
      }

      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();
      setNativeSelectValue(select, previousStatus);
      setCurrentStatus(previousStatus);

      const id = selectedApplicationId();
      if (!id) {
        setError('Open the application again before sending it to Board review.');
        return;
      }
      void loadPreview(id, previousStatus);
    };

    select.addEventListener('pointerdown', remember, true);
    select.addEventListener('focus', remember, true);
    select.addEventListener('keydown', remember, true);
    select.addEventListener('change', change, true);

    selectRef.current = select;
    hostRef.current = host;
    listenersRef.current = {remember, change};
    setTriggerHost(host);
  }, [loadPreview, removeEnhancement]);

  useEffect(() => {
    let disposed = false;
    let installing = false;
    const synchronize = () => {
      if (disposed || installing) return;
      const select = findStatusSelect();
      if (!select) {
        if (selectRef.current) removeEnhancement();
        return;
      }
      if (selectRef.current === select && hostRef.current?.isConnected) {
        setCurrentStatus(select.value);
        if (!applicationId) previousStatusRef.current = select.value;
        return;
      }
      installing = true;
      try {
        installEnhancement(select);
      } finally {
        installing = false;
      }
    };

    synchronize();
    const observer = new MutationObserver(synchronize);
    observer.observe(document.body, {childList: true, subtree: true});
    const interval = window.setInterval(synchronize, 1000);
    return () => {
      disposed = true;
      observer.disconnect();
      window.clearInterval(interval);
      removeEnhancement();
    };
  }, [applicationId, installEnhancement, removeEnhancement]);

  async function sendBoardReviewEmail() {
    if (!applicationId || !preview) return;
    const action = sourceStatus === 'board_review'
      ? 'send the board review email to the members still waiting for it'
      : 'move this application to Board review and send the email to all three board members';
    if (!window.confirm(`Confirm that you want to ${action}?`)) return;

    setSending(true);
    setError(undefined);
    try {
      const payload = await readResponse(await fetch(
        `/api/admin/dream-applications/${encodeURIComponent(applicationId)}/board-review-email`,
        {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({mode: 'send'}),
        },
      ));
      const failures = payload.boardNotification?.failed || [];
      if (failures.length > 0) {
        setError(`The application is in Board review, but ${failures.length} email${failures.length === 1 ? '' : 's'} could not be delivered. Reopen the preview to resend.`);
      }
      window.setTimeout(() => window.location.reload(), failures.length > 0 ? 1200 : 300);
    } catch (sendError) {
      setError(sendError instanceof Error ? sendError.message : 'Unable to send the board review email.');
      setSending(false);
    }
  }

  const showResendTrigger = Boolean(triggerHost && currentStatus === 'board_review');
  const modal = Boolean(applicationId);
  const allSent = Boolean(preview && pendingRecipients.length === 0);

  return (
    <>
      {showResendTrigger && triggerHost && createPortal(
        <button
          type="button"
          onClick={() => {
            const id = selectedApplicationId();
            if (id) void loadPreview(id, 'board_review');
          }}
          className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-purple-300 bg-purple-50 px-3 py-2 text-xs font-black text-purple-800 hover:bg-purple-100"
        >
          <Mail className="h-4 w-4" /> Preview board email / resend
        </button>,
        triggerHost,
      )}

      {modal && typeof document !== 'undefined' && createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/75 p-4 backdrop-blur-sm">
          <section className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-[2rem] bg-white shadow-2xl">
            <header className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-slate-200 bg-white p-6">
              <div className="flex gap-3">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-purple-100 text-purple-700">
                  <ShieldCheck className="h-6 w-6" />
                </span>
                <div>
                  <h2 className="text-xl font-black text-slate-950">Board review email preview</h2>
                  <p className="mt-1 text-sm font-semibold text-slate-500">
                    {sourceStatus === 'board_review'
                      ? 'Review the message before resending it.'
                      : 'Nothing has changed yet. The current status is preserved until you confirm and send.'}
                  </p>
                </div>
              </div>
              <button type="button" disabled={sending} onClick={closePreview} className="rounded-xl p-2 text-slate-500 hover:bg-slate-100" aria-label="Close preview">
                <X className="h-5 w-5" />
              </button>
            </header>

            <div className="space-y-5 p-6">
              {loading ? (
                <div className="flex items-center justify-center gap-3 rounded-2xl bg-slate-50 p-8 font-black text-slate-600">
                  <LoaderCircle className="h-5 w-5 animate-spin" /> Preparing the exact email
                </div>
              ) : preview ? (
                <>
                  <div className="rounded-2xl border border-purple-200 bg-purple-50 p-4">
                    <p className="font-black text-purple-950">Recipients — all three TCW board members</p>
                    <div className="mt-3 space-y-2">
                      {preview.recipients.map((email) => {
                        const sent = alreadySent.includes(email);
                        return (
                          <div key={email} className="flex items-center justify-between gap-3 rounded-xl bg-white px-3 py-2 text-sm font-bold text-slate-700">
                            <span>{email}</span>
                            {sent ? (
                              <span className="flex items-center gap-1 text-xs text-emerald-700"><CheckCircle2 className="h-4 w-4" /> Sent</span>
                            ) : (
                              <span className="text-xs text-purple-700">Will receive email</span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="overflow-hidden rounded-2xl border border-slate-200">
                    <div className="border-b border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
                      <p><strong>Subject:</strong> {preview.subject}</p>
                    </div>
                    <pre className="max-h-96 overflow-auto whitespace-pre-wrap p-5 font-sans text-sm leading-relaxed text-slate-700">{preview.body}</pre>
                  </div>

                  {allSent && (
                    <p className="flex items-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-bold text-emerald-800">
                      <CheckCircle2 className="h-5 w-5" /> All three board members already received this email.
                    </p>
                  )}
                </>
              ) : null}

              {error && (
                <p className="flex items-start gap-2 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-800">
                  <CircleAlert className="mt-0.5 h-5 w-5 shrink-0" /> {error}
                </p>
              )}

              <div className="grid gap-3 sm:grid-cols-2">
                <button type="button" disabled={sending} onClick={closePreview} className="rounded-2xl border border-slate-300 bg-white px-4 py-3 font-black text-slate-700 hover:bg-slate-50 disabled:opacity-50">
                  Cancel — keep current status
                </button>
                <button
                  type="button"
                  disabled={!preview || loading || sending || allSent}
                  onClick={() => void sendBoardReviewEmail()}
                  className="flex items-center justify-center gap-2 rounded-2xl bg-purple-700 px-4 py-3 font-black text-white hover:bg-purple-800 disabled:opacity-50"
                >
                  {sending ? <LoaderCircle className="h-5 w-5 animate-spin" /> : sourceStatus === 'board_review' ? <RefreshCw className="h-5 w-5" /> : <Send className="h-5 w-5" />}
                  {sourceStatus === 'board_review' ? 'Send to missing recipients' : 'Move to Board review and send'}
                </button>
              </div>
            </div>
          </section>
        </div>,
        document.body,
      )}
    </>
  );
}
