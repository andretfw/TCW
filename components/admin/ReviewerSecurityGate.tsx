'use client';

import {FormEvent, useEffect, useState} from 'react';
import {
  CircleAlert,
  KeyRound,
  LoaderCircle,
  LogOut,
  Mail,
  ShieldCheck,
} from 'lucide-react';
import {getUser, logout} from '@netlify/identity';

type GateState = 'checking' | 'signed-out' | 'challenge' | 'verified' | 'denied';

async function readPayload(response: Response): Promise<{verified?: boolean; error?: string}> {
  return response.json().catch(() => ({})) as Promise<{verified?: boolean; error?: string}>;
}

export default function ReviewerSecurityGate({children}: {children: React.ReactNode}) {
  const [gate, setGate] = useState<GateState>('checking');
  const [email, setEmail] = useState('');
  const [sending, setSending] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    let timeout: number | undefined;

    async function check() {
      let nextDelay = 1_000;
      try {
        const user = await getUser();
        if (!active) return;
        if (!user?.email) {
          setEmail('');
          setGate('signed-out');
        } else {
          setEmail(user.email);
          const response = await fetch('/api/admin/security/session', {
            cache: 'no-store',
          });
          if (!active) return;
          if (response.status === 403) {
            setGate('denied');
            nextDelay = 30_000;
          } else if (response.status === 401) {
            setGate('signed-out');
          } else if (response.ok) {
            const payload = await readPayload(response);
            setGate(payload.verified ? 'verified' : 'challenge');
            nextDelay = payload.verified ? 60_000 : 5_000;
          }
        }
      } catch {
        if (active) nextDelay = 5_000;
      } finally {
        if (active) timeout = window.setTimeout(check, nextDelay);
      }
    }

    const onFocus = () => void check();
    void check();
    window.addEventListener('focus', onFocus);
    return () => {
      active = false;
      if (timeout) window.clearTimeout(timeout);
      window.removeEventListener('focus', onFocus);
    };
  }, []);

  async function requestCode() {
    setSending(true);
    setError('');
    try {
      const response = await fetch('/api/admin/security/session', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({action: 'request'}),
      });
      const payload = await readPayload(response);
      if (!response.ok) throw new Error(payload.error || 'Unable to send the code.');
      setSent(true);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Unable to send the code.');
    } finally {
      setSending(false);
    }
  }

  async function verifyCode(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setVerifying(true);
    setError('');
    try {
      const response = await fetch('/api/admin/security/session', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          action: 'verify',
          code: String(data.get('code') || '').trim(),
        }),
      });
      const payload = await readPayload(response);
      if (!response.ok || payload.verified !== true) {
        throw new Error(payload.error || 'Unable to verify the code.');
      }
      window.location.reload();
    } catch (verifyError) {
      setError(verifyError instanceof Error ? verifyError.message : 'Unable to verify the code.');
      setVerifying(false);
    }
  }

  async function signOutEverywhere() {
    setVerifying(true);
    try {
      await fetch('/api/admin/security/session', {
        method: 'DELETE',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({allDevices: true}),
      });
    } finally {
      await logout().catch(() => undefined);
      window.location.assign('/admin/dream-applications');
    }
  }

  if (gate === 'signed-out') return <>{children}</>;

  if (gate === 'verified') {
    return (
      <>
        {children}
        <button
          type="button"
          onClick={() => void signOutEverywhere()}
          className="fixed bottom-4 left-4 z-[200] flex items-center gap-2 rounded-full border border-slate-700 bg-slate-950/95 px-4 py-2.5 text-xs font-black text-white shadow-xl backdrop-blur hover:bg-slate-800"
          title="Revoke every TCW reviewer session and sign out this device"
        >
          <LogOut className="h-4 w-4" />
          Log out all devices
        </button>
      </>
    );
  }

  if (gate === 'checking') {
    return (
      <main className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-950 px-5 text-white">
        <div className="flex items-center gap-3 font-black">
          <LoaderCircle className="h-6 w-6 animate-spin text-brand-300" />
          Checking secure access
        </div>
      </main>
    );
  }

  return (
    <>
      {children}
      <main className="fixed inset-0 z-[9999] flex items-center justify-center overflow-y-auto bg-slate-950 px-5 py-10 text-white">
        <section className="w-full max-w-md rounded-[2rem] border border-white/10 bg-white/[0.07] p-8 shadow-2xl backdrop-blur-xl">
          <ShieldCheck className="mx-auto h-16 w-16 rounded-2xl bg-gradient-to-br from-brand-500 to-fuchsia-600 p-4" />
          <p className="mt-6 text-center text-xs font-black uppercase tracking-[0.22em] text-brand-300">
            TCW two-step security
          </p>
          <h1 className="mt-3 text-center text-3xl font-black">
            {gate === 'denied' ? 'Access not approved' : 'Verify it’s you'}
          </h1>
          <p className="mt-3 text-center text-sm leading-relaxed text-slate-300">
            {gate === 'denied'
              ? 'This signed-in account is not on the current TCW administrator or Board access list.'
              : `Your normal TCW account is signed in as ${email}. A one-time security code is required before confidential applications can be opened.`}
          </p>

          {gate === 'challenge' && (
            <>
              {!sent ? (
                <button
                  type="button"
                  disabled={sending}
                  onClick={() => void requestCode()}
                  className="mt-8 flex w-full items-center justify-center gap-2 rounded-2xl bg-white px-5 py-3.5 font-black text-slate-950 disabled:opacity-60"
                >
                  {sending ? <LoaderCircle className="h-5 w-5 animate-spin" /> : <Mail className="h-5 w-5 text-brand-600" />}
                  Send security code
                </button>
              ) : (
                <form className="mt-8 space-y-4" onSubmit={verifyCode}>
                  <label className="block text-sm font-bold text-slate-200">
                    Six-digit code
                    <input
                      name="code"
                      inputMode="numeric"
                      autoComplete="one-time-code"
                      pattern="[0-9]{6}"
                      minLength={6}
                      maxLength={6}
                      required
                      autoFocus
                      className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-center text-2xl font-black tracking-[0.35em] text-white outline-none focus:border-brand-400"
                    />
                  </label>
                  <button
                    type="submit"
                    disabled={verifying}
                    className="flex w-full items-center justify-center gap-2 rounded-2xl bg-brand-600 px-5 py-3.5 font-black disabled:opacity-60"
                  >
                    {verifying ? <LoaderCircle className="h-5 w-5 animate-spin" /> : <KeyRound className="h-5 w-5" />}
                    Verify and continue
                  </button>
                  <button
                    type="button"
                    disabled={sending}
                    onClick={() => void requestCode()}
                    className="w-full rounded-2xl border border-white/10 px-5 py-3 text-sm font-bold text-slate-300 hover:bg-white/5"
                  >
                    Send a new code
                  </button>
                </form>
              )}
            </>
          )}

          {error && (
            <p role="alert" className="mt-5 flex items-start gap-2 rounded-2xl border border-red-400/20 bg-red-400/10 p-4 text-sm font-semibold text-red-100">
              <CircleAlert className="mt-0.5 h-5 w-5 shrink-0" />
              {error}
            </p>
          )}

          <p className="mt-5 text-center text-xs leading-relaxed text-slate-500">
            The code expires in 10 minutes. After verification, this device stays trusted for up to 12 hours.
          </p>
          <button
            type="button"
            disabled={verifying}
            onClick={() => void signOutEverywhere()}
            className="mt-5 w-full rounded-2xl border border-white/10 px-5 py-3 text-sm font-black text-slate-300 hover:bg-white/5"
          >
            Sign out
          </button>
        </section>
      </main>
    </>
  );
}
