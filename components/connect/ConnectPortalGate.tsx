'use client';

import {useEffect, useState} from 'react';

import ConnectPortal from './ConnectPortal';

const TOKEN_STORAGE_KEY = 'tcw_connect_private_portal_token';

type Locale = 'en' | 'ro' | 'es';

function sessionMarker(): string {
  return `tcw-session-${crypto.randomUUID()}`;
}

export default function ConnectPortalGate({locale}: {locale: Locale}) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let active = true;

    async function prepareSession() {
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
          if (!response.ok) throw new Error('INVALID_PRIVATE_LINK');

          window.sessionStorage.setItem(TOKEN_STORAGE_KEY, sessionMarker());
          window.history.replaceState(
            null,
            '',
            `${window.location.pathname}${window.location.search}`,
          );
        } catch {
          window.sessionStorage.removeItem(TOKEN_STORAGE_KEY);
        }
      }

      if (active) setReady(true);
    }

    void prepareSession();
    return () => {
      active = false;
    };
  }, []);

  if (!ready) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#faf9ff] px-4 pt-20">
        <p className="font-bold text-neutral-700">TCW Connect…</p>
      </main>
    );
  }

  return <ConnectPortal locale={locale} />;
}
