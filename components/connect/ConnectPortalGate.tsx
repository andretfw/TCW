'use client';

import {useEffect, useState} from 'react';

import ConnectPortal from './ConnectPortal';

const TOKEN_STORAGE_KEY = 'tcw_connect_private_portal_token';

type Locale = 'en' | 'ro' | 'es';

export default function ConnectPortalGate({locale}: {locale: Locale}) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const fragment = window.location.hash.startsWith('#')
      ? window.location.hash.slice(1)
      : window.location.hash;
    const token = new URLSearchParams(fragment).get('token');

    if (token) {
      window.sessionStorage.setItem(TOKEN_STORAGE_KEY, token);
      window.history.replaceState(
        null,
        '',
        `${window.location.pathname}${window.location.search}`,
      );
    }

    setReady(true);
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
