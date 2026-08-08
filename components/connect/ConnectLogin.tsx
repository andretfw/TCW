'use client';

import {FormEvent, useState} from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  CheckCircle2,
  HeartHandshake,
  LoaderCircle,
  LogIn,
  Mail,
  ShieldCheck,
  UsersRound,
} from 'lucide-react';

import {localizedPath} from '@/lib/routes';

type Locale = 'en' | 'ro' | 'es';
type Role = 'survivor' | 'warrior';

const COPY = {
  en: {
    eyebrow: 'TCW Connect',
    title: 'Access your private profile',
    subtitle: 'Enter the email used when you joined. We will send a secure sign-in link so you can see whether you are waiting, matched or scheduled for a conversation.',
    survivor: 'I joined as a peer mentor',
    warrior: 'I joined looking for support',
    email: 'Email address',
    send: 'Send secure sign-in link',
    sending: 'Sending your link…',
    successTitle: 'Check your email',
    successText: 'If a matching TCW Connect profile exists, a secure access link has been sent. Check your spam folder too.',
    privacy: 'For privacy, we show the same confirmation whether or not an account exists.',
    session: 'The email link expires after 15 minutes and works once. After sign-in, this device can stay signed in for up to 30 days unless you log out.',
    error: 'The access request could not be completed. Check the details and try again.',
    back: 'Back to TCW Connect',
  },
  ro: {
    eyebrow: 'TCW Connect',
    title: 'Accesează profilul tău privat',
    subtitle: 'Introdu adresa de email folosită la înscriere. Îți trimitem un link securizat pentru a vedea dacă aștepți o potrivire, ai fost conectat sau ai o conversație programată.',
    survivor: 'M-am înscris ca mentor cu experiență oncologică',
    warrior: 'M-am înscris pentru a primi sprijin',
    email: 'Adresa de email',
    send: 'Trimite linkul securizat de acces',
    sending: 'Trimitem linkul…',
    successTitle: 'Verifică emailul',
    successText: 'Dacă există un profil TCW Connect corespunzător, a fost trimis un link securizat. Verifică și folderul Spam.',
    privacy: 'Pentru protecția datelor, afișăm aceeași confirmare indiferent dacă există sau nu un profil.',
    session: 'Linkul din email expiră după 15 minute și funcționează o singură dată. După autentificare, acest dispozitiv poate rămâne conectat până la 30 de zile, dacă nu te deconectezi.',
    error: 'Solicitarea de acces nu a putut fi finalizată. Verifică datele și încearcă din nou.',
    back: 'Înapoi la TCW Connect',
  },
  es: {
    eyebrow: 'TCW Connect',
    title: 'Accede a tu perfil privado',
    subtitle: 'Introduce el correo usado al registrarte. Te enviaremos un enlace seguro para ver si estás esperando, tienes una coincidencia o una conversación programada.',
    survivor: 'Me registré como mentor con experiencia en cáncer',
    warrior: 'Me registré para recibir apoyo',
    email: 'Correo electrónico',
    send: 'Enviar enlace seguro de acceso',
    sending: 'Enviando el enlace…',
    successTitle: 'Revisa tu correo',
    successText: 'Si existe un perfil de TCW Connect correspondiente, se ha enviado un enlace seguro. Revisa también la carpeta de spam.',
    privacy: 'Por privacidad, mostramos la misma confirmación exista o no un perfil.',
    session: 'El enlace del correo caduca a los 15 minutos y funciona una sola vez. Después de iniciar sesión, este dispositivo puede mantener la sesión hasta 30 días salvo que cierres sesión.',
    error: 'No se pudo completar la solicitud. Revisa los datos e inténtalo de nuevo.',
    back: 'Volver a TCW Connect',
  },
} as const;

export default function ConnectLogin({locale}: {locale: Locale}) {
  const text = COPY[locale];
  const [role, setRole] = useState<Role>('warrior');
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [error, setError] = useState('');

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);

    setStatus('sending');
    setError('');
    try {
      const response = await fetch('/api/connect/login', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({email: data.get('email'), role}),
      });
      const payload = await response.json().catch(() => ({})) as {error?: string};
      if (!response.ok) throw new Error(payload.error || text.error);
      setStatus('success');
      form.reset();
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : text.error);
      setStatus('error');
    }
  }

  return (
    <main className="min-h-screen bg-[#faf9ff] px-4 pb-20 pt-28">
      <section className="mx-auto max-w-2xl overflow-hidden rounded-[2rem] border border-indigo-100 bg-white shadow-xl">
        <div className="bg-gradient-to-br from-indigo-950 via-indigo-800 to-purple-700 px-7 py-10 text-white sm:px-10">
          <p className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-indigo-200">
            <ShieldCheck className="h-4 w-4" /> {text.eyebrow}
          </p>
          <h1 className="mt-4 text-4xl font-black leading-tight sm:text-5xl">{text.title}</h1>
          <p className="mt-4 leading-relaxed text-indigo-100">{text.subtitle}</p>
        </div>

        <div className="p-7 sm:p-10">
          {status === 'success' ? (
            <div className="text-center">
              <CheckCircle2 className="mx-auto h-16 w-16 rounded-full bg-emerald-100 p-3 text-emerald-700" />
              <h2 className="mt-6 text-3xl font-black text-neutral-900">{text.successTitle}</h2>
              <p className="mx-auto mt-4 max-w-lg leading-relaxed text-neutral-600">{text.successText}</p>
              <p className="mx-auto mt-4 max-w-lg rounded-xl bg-indigo-50 px-4 py-3 text-sm font-semibold text-indigo-950">{text.session}</p>
              <button
                type="button"
                onClick={() => setStatus('idle')}
                className="mt-6 rounded-xl border border-neutral-300 px-5 py-3 font-black text-neutral-700 hover:bg-neutral-50"
              >
                {text.send}
              </button>
            </div>
          ) : (
            <form onSubmit={submit} className="space-y-6">
              <div className="grid gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={() => setRole('warrior')}
                  className={`rounded-2xl border-2 p-5 text-left transition ${role === 'warrior' ? 'border-indigo-600 bg-indigo-50' : 'border-neutral-200 hover:border-indigo-300'}`}
                >
                  <HeartHandshake className="h-7 w-7 text-indigo-700" />
                  <span className="mt-3 block font-black text-neutral-900">{text.warrior}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setRole('survivor')}
                  className={`rounded-2xl border-2 p-5 text-left transition ${role === 'survivor' ? 'border-purple-600 bg-purple-50' : 'border-neutral-200 hover:border-purple-300'}`}
                >
                  <UsersRound className="h-7 w-7 text-purple-700" />
                  <span className="mt-3 block font-black text-neutral-900">{text.survivor}</span>
                </button>
              </div>

              <label className="block space-y-2 font-bold text-neutral-800">
                <span>{text.email}</span>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-neutral-400" />
                  <input
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    maxLength={254}
                    className="w-full rounded-xl border border-neutral-300 py-3 pl-12 pr-4 outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100"
                  />
                </div>
              </label>

              {status === 'error' && (
                <p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-700">
                  {error || text.error}
                </p>
              )}

              <button
                type="submit"
                disabled={status === 'sending'}
                className="flex w-full items-center justify-center gap-3 rounded-xl bg-indigo-700 px-6 py-4 text-lg font-black text-white shadow-lg hover:bg-indigo-800 disabled:opacity-60"
              >
                {status === 'sending' ? <LoaderCircle className="h-5 w-5 animate-spin" /> : <LogIn className="h-5 w-5" />}
                {status === 'sending' ? text.sending : text.send}
              </button>

              <p className="rounded-xl bg-neutral-50 px-4 py-3 text-sm leading-relaxed text-neutral-600">{text.privacy}</p>
            </form>
          )}

          <Link
            href={localizedPath(locale, 'connectSurvivor')}
            className="mx-auto mt-8 flex w-fit items-center gap-2 font-black text-indigo-700 hover:text-indigo-900"
          >
            <ArrowLeft className="h-4 w-4" /> {text.back}
          </Link>
        </div>
      </section>
    </main>
  );
}
