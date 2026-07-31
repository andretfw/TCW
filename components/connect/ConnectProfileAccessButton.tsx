import Link from 'next/link';
import {LogIn} from 'lucide-react';

import {localizedPath} from '@/lib/routes';

type Locale = 'en' | 'ro' | 'es';

const COPY: Record<Locale, {prompt: string; action: string; slug: string}> = {
  en: {
    prompt: 'Already joined?',
    action: 'Access my profile',
    slug: 'my-connection',
  },
  ro: {
    prompt: 'Ești deja înscris?',
    action: 'Accesează profilul',
    slug: 'conexiunea-mea',
  },
  es: {
    prompt: '¿Ya te registraste?',
    action: 'Acceder a mi perfil',
    slug: 'mi-conexion',
  },
};

export default function ConnectProfileAccessButton({locale}: {locale: Locale}) {
  const text = COPY[locale];
  const href = `${localizedPath(locale, 'connectSurvivor')}/${text.slug}`;

  return (
    <Link
      href={href}
      className="fixed bottom-5 right-4 z-40 flex max-w-[calc(100vw-2rem)] items-center gap-3 rounded-2xl border border-indigo-200 bg-white px-4 py-3 text-left shadow-xl transition hover:-translate-y-0.5 hover:border-indigo-400 hover:shadow-2xl sm:right-6"
    >
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-700 text-white">
        <LogIn className="h-5 w-5" />
      </span>
      <span>
        <span className="block text-xs font-bold text-neutral-500">{text.prompt}</span>
        <span className="block font-black text-indigo-800">{text.action}</span>
      </span>
    </Link>
  );
}
