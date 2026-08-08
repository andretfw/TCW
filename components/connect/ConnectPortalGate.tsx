'use client';

import {useEffect, useState} from 'react';
import {LoaderCircle, LogOut} from 'lucide-react';

import ConnectLogin from './ConnectLogin';
import ConnectPortal from './ConnectPortal';

const TOKEN_STORAGE_KEY = 'tcw_connect_private_portal_token';

type Locale = 'en' | 'ro' | 'es';
type GateStatus = 'checking' | 'authenticated' | 'signed-out';

const LOGOUT_COPY: Record<Locale, string> = {
  en: 'Log out',
  ro: 'Deconectare',
  es: 'Cerrar sesión',
};

const LOGOUT_ALL_COPY: Record<Locale, string> = {
  en: 'Log out all devices',
  ro: 'Deconectează toate dispozitivele',
  es: 'Cerrar sesión en todos los dispositivos',
};

function sessionMarker(): string {
  return `tcw-session-${crypto.randomUUID()}`;
}

export default function ConnectPortalGate({locale}: {locale: Locale}) {
  const [status, setStatus] = useState<GateStatus>('checking');
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    let active = true;

    async function prepareSession() {
      let authenticated = false;
      const fragment = window.location.hash.startsWith('#')
        ? window.location.hash.slice(1)
        : window.location.hash;
      const privateToken = new URLSearchParams(fragment).get('token');

      if (privateToken) {
        try {
          const response = await fetch('/api/connect/session', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({token: privateToken}),
          });
          authenticated = response.ok;
        } catch {
          authenticated = false;
        } finally {
          window.history.replaceState(
            null,
            '',
            `${window.location.pathname}${window.location.search}`,
          );
        }
      }

      if (!authenticated) {
        try {
          const response = await fetch('/api/connect/session', {cache: 'no-store'});
          const payload = await response.json().catch(() => ({})) as {
            authenticated?: boolean;
          };
          authenticated = response.ok && payload.authenticated === true;
        } catch {
          authenticated = false;
        }
      }

      if (authenticated) {
        window.sessionStorage.setItem(TOKEN_STORAGE_KEY, sessionMarker());
      } else {
        window.sessionStorage.removeItem(TOKEN_STORAGE_KEY);
      }

      if (active) setStatus(authenticated ? 'authenticated' : 'signed-out');
    }

    void prepareSession();
    return () => {
      active = false;
    };
  }, []);

  async function logout(allDevices = false) {
    if (loggingOut) return;
    setLoggingOut(true);
    try {
      await fetch('/api/connect/session', {
        method: 'DELETE',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({allDevices}),
      });
    } finally {
      window.sessionStorage.removeItem(TOKEN_STORAGE_KEY);
      setStatus('signed-out');
      setLoggingOut(false);
    }
  }

  if (status === 'checking') {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#faf9ff] px-4 pt-20">
        <div className="text-center">
          <LoaderCircle className="mx-auto h-9 w-9 animate-spin text-indigo-700" />
          <p className="mt-4 font-bold text-neutral-700">TCW Connect…</p>
        </div>
      </main>
    );
  }

  if (status === 'signed-out') {
    return <ConnectLogin locale={locale} />;
  }

  return (
    <>
      <div className="fixed right-4 top-24 z-50 flex flex-col items-end gap-2">
        <button
          type="button"
          disabled={loggingOut}
          onClick={() => void logout(false)}
          className="flex items-center gap-2 rounded-full border border-white/30 bg-indigo-950/90 px-4 py-2 text-sm font-black text-white shadow-lg backdrop-blur hover:bg-indigo-900 disabled:opacity-60"
        >
          {loggingOut ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <LogOut className="h-4 w-4" />}
          {LOGOUT_COPY[locale]}
        </button>
        <button
          type="button"
          disabled={loggingOut}
          onClick={() => void logout(true)}
          className="rounded-full border border-indigo-200 bg-white/95 px-4 py-2 text-xs font-black text-indigo-950 shadow-lg backdrop-blur hover:bg-indigo-50 disabled:opacity-60"
        >
          {LOGOUT_ALL_COPY[locale]}
        </button>
      </div>
      <ConnectPortal locale={locale} />
    </>
  );
}
