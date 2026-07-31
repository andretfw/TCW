import {Suspense} from 'react';
import type {Metadata} from 'next';

import ConnectPortalGate from '@/components/connect/ConnectPortalGate';

export const metadata: Metadata = {
  title: 'TCW Connect',
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
  referrer: 'no-referrer',
};

export default async function ConnectPortalPage({
  params,
}: {
  params: Promise<{locale: string}>;
}) {
  const {locale: rawLocale} = await params;
  const locale = rawLocale === 'ro' || rawLocale === 'es' ? rawLocale : 'en';

  return (
    <Suspense
      fallback={(
        <main className="flex min-h-screen items-center justify-center bg-[#faf9ff] px-4 pt-20">
          <p className="font-bold text-neutral-700">TCW Connect…</p>
        </main>
      )}
    >
      <ConnectPortalGate locale={locale} />
    </Suspense>
  );
}
