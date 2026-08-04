'use client';

import {useCallback, useEffect, useMemo, useState} from 'react';
import {useSearchParams} from 'next/navigation';
import {
  CalendarDays,
  CheckCircle2,
  CircleAlert,
  Clock3,
  HeartHandshake,
  LoaderCircle,
  Flag,
  LogOut,
  PauseCircle,
  PlayCircle,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  UserRound,
  Video,
  XCircle,
} from 'lucide-react';

import type {
  ConnectPortalState,
  PublicConnectProfile,
} from '@/lib/connect/types';

type Locale = 'en' | 'ro' | 'es';
type PortalAction =
  | 'accept-proposal'
  | 'decline-proposal'
  | 'pause'
  | 'resume'
  | 'end'
  | 'end-rematch'
  | 'report-block'
  | 'select-meeting-time';

const TOKEN_STORAGE_KEY = 'tcw_connect_private_portal_token';

const COPY = {
  en: {
    title: 'Your private TCW Connect space',
    subtitle: 'Review matches, manage your connection and join scheduled conversations.',
    private: 'Private link',
    invalidTitle: 'This private link is unavailable.',
    invalidText: 'Open the newest TCW Connect email you received. For your privacy, old or incomplete links may not work.',
    loading: 'Opening your private TCW Connect space…',
    reference: 'Profile reference',
    active: 'Available for matching',
    paused: 'Profile paused',
    matched: 'Connected',
    closed: 'Profile closed',
    pendingReview: 'Pending TCW review',
    reviewRejected: 'Mentor profile not approved',
    suspended: 'Profile suspended for safety review',
    pendingReviewTitle: 'Your mentor profile is being reviewed',
    pendingReviewText: 'Your email is confirmed. TCW must verify your identity and survivor experience before your profile can enter automated matching.',
    reviewRejectedTitle: 'This mentor profile was not approved',
    reviewRejectedText: 'Your profile remains private and cannot enter matching. TCW will contact you if more information is needed.',
    suspendedTitle: 'This profile is temporarily suspended',
    suspendedText: 'Contact and matching are paused while TCW reviews a safeguarding concern. Future meetings linked to the connection have been cancelled.',
    matchTitle: 'We found a possible connection',
    matchIntro: 'Only a limited profile is shown. Contact details remain private until both people accept.',
    compatibility: 'compatibility',
    why: 'Why this match may work',
    accept: 'Accept this connection',
    decline: 'Not this match',
    safetyConfirm: 'I have read the safety rules and agree that contact details may be shared only after both people accept.',
    report: 'Report and block',
    reportPrompt: 'Briefly tell TCW what happened. Do not include unnecessary medical details.',
    reportConfirm: 'Report and block this person? Contact will stop immediately, the profile will be suspended for TCW review and future meetings will be cancelled.',
    reportSuccess: 'Your report was sent privately. Contact has stopped and TCW will review it.',
    accepting: 'Saving your decision…',
    connectionTitle: 'Your TCW Connect connection',
    meetScheduled: 'Your first conversation is scheduled',
    scheduling: 'TCW is arranging your first conversation.',
    schedulingHelp: 'The system could not find shared meeting options. TCW has been notified and will handle this exception.',
    chooseTimeTitle: 'Choose your first conversation',
    chooseTimeIntro: 'These three 45-minute options work for both availability windows. Google Meet is created only when you both confirm the same time.',
    yourChoice: 'Your choice',
    theirChoice: 'Their choice',
    selectTime: 'Choose this time',
    waitingForTheirChoice: 'Your choice is saved. Waiting for the other person.',
    theirChoiceReady: 'The other person has chosen a time. Confirm the same option or choose another.',
    choicesDiffer: 'You chose different times. Choose the option marked “Their choice” to agree, or wait for them to change.',
    creatingMeet: 'You both confirmed this time. Creating the private Google Meet…',
    retryScheduling: 'Google Meet could not be created. Choose the agreed time again to retry.',
    joinMeet: 'Join Google Meet',
    calendar: 'Open calendar event',
    end: 'End this connection',
    endRematch: 'End and find another match',
    pause: 'Pause matching',
    resume: 'Resume matching',
    waitingTitle: 'Your profile is in the matching pool',
    waitingText: 'The system will email you when a compatible person is available. You do not need to keep checking this page.',
    pausedTitle: 'Matching is paused',
    pausedText: 'Your profile stays private and will not receive new proposals until you resume.',
    roleSurvivor: 'Survivor mentor',
    roleWarrior: 'Warrior',
    age: 'Age range',
    country: 'Country',
    cancer: 'Cancer experience',
    phase: 'Experience stage',
    languages: 'Languages',
    treatments: 'Shared treatment experience',
    topics: 'Topics',
    communication: 'Communication',
    intro: 'Introduction',
    noIntro: 'No introduction was added.',
    confirmEnd: 'End this connection? The other person will no longer be shown as your active connection.',
    confirmRematch: 'End this connection and ask the system to find another match?',
    confirmDecline: 'Decline this match? The same two profiles will not be proposed again.',
    error: 'The action could not be completed. Refresh the page and try again.',
    refreshed: 'Updated',
    rules: 'Peer support is not medical care. Do not share medical instructions, request money, record calls or forward private meeting links.',
    reasons: {
      'same-cancer-type': 'Same cancer type',
      'same-cancer-subtype': 'Same cancer subtype',
      'shared-treatment-experience': 'Relevant treatment experience',
      'similar-cancer-phase': 'Similar stage of the cancer experience',
      'shared-support-topics': 'Shared support topics',
      'shared-language': 'Shared language',
      'compatible-communication': 'Compatible communication preference',
      'same-timezone': 'Same time zone',
      'gender-preference-compatible': 'Mentor preference respected',
      'similar-age-range': 'Similar age range',
    },
  },
  ro: {
    title: 'Spațiul tău privat TCW Connect',
    subtitle: 'Vezi potrivirile, administrează conexiunea și intră la conversațiile programate.',
    private: 'Link privat',
    invalidTitle: 'Acest link privat nu este disponibil.',
    invalidText: 'Deschide cel mai nou email primit de la TCW Connect. Pentru protecția datelor tale, linkurile vechi sau incomplete pot să nu funcționeze.',
    loading: 'Deschidem spațiul tău privat TCW Connect…',
    reference: 'Referința profilului',
    active: 'Disponibil pentru potrivire',
    paused: 'Profil pus pe pauză',
    matched: 'Conectat',
    closed: 'Profil închis',
    pendingReview: 'În verificare la TCW',
    reviewRejected: 'Profil de mentor neaprobat',
    suspended: 'Profil suspendat pentru verificare',
    pendingReviewTitle: 'Profilul tău de mentor este în verificare',
    pendingReviewText: 'Adresa de email este confirmată. TCW trebuie să verifice identitatea și experiența oncologică înainte ca profilul să intre în potrivirea automată.',
    reviewRejectedTitle: 'Acest profil de mentor nu a fost aprobat',
    reviewRejectedText: 'Profilul rămâne privat și nu poate intra în sistemul de potrivire. TCW te va contacta dacă sunt necesare informații suplimentare.',
    suspendedTitle: 'Acest profil este suspendat temporar',
    suspendedText: 'Contactul și potrivirea sunt oprite cât timp TCW verifică o sesizare de siguranță. Întâlnirile viitoare ale conexiunii au fost anulate.',
    matchTitle: 'Am găsit o posibilă conexiune',
    matchIntro: 'Este afișat doar un profil limitat. Datele de contact rămân private până când ambele persoane acceptă.',
    compatibility: 'compatibilitate',
    why: 'De ce această potrivire poate funcționa',
    accept: 'Acceptă această conexiune',
    decline: 'Nu această potrivire',
    safetyConfirm: 'Am citit regulile de siguranță și accept ca datele de contact să fie transmise numai după ce acceptăm amândoi.',
    report: 'Raportează și blochează',
    reportPrompt: 'Spune pe scurt echipei TCW ce s-a întâmplat. Nu include detalii medicale care nu sunt necesare.',
    reportConfirm: 'Raportezi și blochezi această persoană? Contactul se oprește imediat, profilul va fi suspendat pentru verificare, iar întâlnirile viitoare vor fi anulate.',
    reportSuccess: 'Sesizarea a fost trimisă privat. Contactul s-a oprit, iar TCW o va verifica.',
    accepting: 'Salvăm decizia…',
    connectionTitle: 'Conexiunea ta TCW Connect',
    meetScheduled: 'Prima conversație este programată',
    scheduling: 'TCW programează prima conversație.',
    schedulingHelp: 'Sistemul nu a putut găsi opțiuni comune pentru întâlnire. TCW a fost notificat și va gestiona această excepție.',
    chooseTimeTitle: 'Alege prima conversație',
    chooseTimeIntro: 'Aceste trei opțiuni de câte 45 de minute se potrivesc disponibilității amândurora. Google Meet este creat numai când confirmați amândoi același interval.',
    yourChoice: 'Alegerea ta',
    theirChoice: 'Alegerea celeilalte persoane',
    selectTime: 'Alege acest interval',
    waitingForTheirChoice: 'Alegerea ta este salvată. Așteptăm răspunsul celeilalte persoane.',
    theirChoiceReady: 'Cealaltă persoană a ales un interval. Confirmă aceeași opțiune sau alege alta.',
    choicesDiffer: 'Ați ales intervale diferite. Alege opțiunea marcată „Alegerea celeilalte persoane” pentru a confirma același interval sau așteaptă schimbarea alegerii.',
    creatingMeet: 'Ați confirmat amândoi același interval. Creăm Google Meet-ul privat…',
    retryScheduling: 'Google Meet nu a putut fi creat. Alege din nou intervalul comun pentru a reîncerca.',
    joinMeet: 'Intră pe Google Meet',
    calendar: 'Deschide evenimentul din calendar',
    end: 'Încheie conexiunea',
    endRematch: 'Încheie și caută altă potrivire',
    pause: 'Pune potrivirea pe pauză',
    resume: 'Reia potrivirea',
    waitingTitle: 'Profilul tău este în sistemul de potrivire',
    waitingText: 'Sistemul îți va trimite un email când apare o persoană compatibilă. Nu trebuie să verifici permanent această pagină.',
    pausedTitle: 'Potrivirea este pusă pe pauză',
    pausedText: 'Profilul rămâne privat și nu va primi propuneri noi până când reiei programul.',
    roleSurvivor: 'Mentor supraviețuitor',
    roleWarrior: 'Luptător',
    age: 'Grupa de vârstă',
    country: 'Țara',
    cancer: 'Experiența oncologică',
    phase: 'Etapa experienței',
    languages: 'Limbi',
    treatments: 'Experiență de tratament',
    topics: 'Subiecte',
    communication: 'Comunicare',
    intro: 'Prezentare',
    noIntro: 'Nu a fost adăugată o prezentare.',
    confirmEnd: 'Închei această conexiune? Cealaltă persoană nu va mai apărea drept conexiune activă.',
    confirmRematch: 'Închei această conexiune și ceri sistemului să găsească altă potrivire?',
    confirmDecline: 'Refuzi această potrivire? Aceleași două profiluri nu vor mai fi propuse împreună.',
    error: 'Acțiunea nu a putut fi finalizată. Reîncarcă pagina și încearcă din nou.',
    refreshed: 'Actualizat',
    rules: 'Sprijinul între persoane nu este îngrijire medicală. Nu oferi instrucțiuni medicale, nu cere bani, nu înregistra apelurile și nu distribui linkurile private.',
    reasons: {
      'same-cancer-type': 'Același tip de cancer',
      'same-cancer-subtype': 'Același subtip',
      'shared-treatment-experience': 'Experiență relevantă de tratament',
      'similar-cancer-phase': 'Etapă similară a experienței oncologice',
      'shared-support-topics': 'Subiecte comune de sprijin',
      'shared-language': 'Limbă comună',
      'compatible-communication': 'Preferințe compatibile de comunicare',
      'same-timezone': 'Același fus orar',
      'gender-preference-compatible': 'Preferința pentru mentor este respectată',
      'similar-age-range': 'Grupă de vârstă similară',
    },
  },
  es: {
    title: 'Tu espacio privado de TCW Connect',
    subtitle: 'Revisa coincidencias, gestiona tu conexión y únete a las conversaciones programadas.',
    private: 'Enlace privado',
    invalidTitle: 'Este enlace privado no está disponible.',
    invalidText: 'Abre el correo más reciente de TCW Connect. Para proteger tu privacidad, los enlaces antiguos o incompletos pueden no funcionar.',
    loading: 'Abriendo tu espacio privado de TCW Connect…',
    reference: 'Referencia del perfil',
    active: 'Disponible para coincidencias',
    paused: 'Perfil en pausa',
    matched: 'Conectado',
    closed: 'Perfil cerrado',
    pendingReview: 'Pendiente de revisión de TCW',
    reviewRejected: 'Perfil de mentor no aprobado',
    suspended: 'Perfil suspendido para revisión',
    pendingReviewTitle: 'Tu perfil de mentor está en revisión',
    pendingReviewText: 'Tu correo está confirmado. TCW debe verificar tu identidad y experiencia antes de que el perfil entre en el sistema automático.',
    reviewRejectedTitle: 'Este perfil de mentor no fue aprobado',
    reviewRejectedText: 'El perfil sigue privado y no puede entrar en las coincidencias. TCW te contactará si necesita más información.',
    suspendedTitle: 'Este perfil está suspendido temporalmente',
    suspendedText: 'El contacto y las coincidencias están pausados mientras TCW revisa una cuestión de seguridad. Se cancelaron las reuniones futuras de la conexión.',
    matchTitle: 'Encontramos una posible conexión',
    matchIntro: 'Solo se muestra un perfil limitado. Los datos de contacto siguen privados hasta que ambas personas acepten.',
    compatibility: 'compatibilidad',
    why: 'Por qué esta coincidencia puede funcionar',
    accept: 'Aceptar esta conexión',
    decline: 'No esta coincidencia',
    safetyConfirm: 'He leído las reglas de seguridad y acepto que los datos de contacto se compartan solo después de que ambos aceptemos.',
    report: 'Reportar y bloquear',
    reportPrompt: 'Cuenta brevemente a TCW qué ocurrió. No incluyas detalles médicos innecesarios.',
    reportConfirm: '¿Reportar y bloquear a esta persona? El contacto terminará inmediatamente, el perfil quedará suspendido para revisión y se cancelarán las reuniones futuras.',
    reportSuccess: 'Tu reporte se envió de forma privada. El contacto terminó y TCW lo revisará.',
    accepting: 'Guardando tu decisión…',
    connectionTitle: 'Tu conexión de TCW Connect',
    meetScheduled: 'Tu primera conversación está programada',
    scheduling: 'TCW está organizando la primera conversación.',
    schedulingHelp: 'El sistema no pudo encontrar opciones comunes para la reunión. TCW ha sido notificado y gestionará esta excepción.',
    chooseTimeTitle: 'Elige la primera conversación',
    chooseTimeIntro: 'Estas tres opciones de 45 minutos encajan con la disponibilidad de ambas personas. Google Meet se crea solo cuando ambas confirman el mismo horario.',
    yourChoice: 'Tu elección',
    theirChoice: 'Su elección',
    selectTime: 'Elegir este horario',
    waitingForTheirChoice: 'Tu elección está guardada. Esperamos la respuesta de la otra persona.',
    theirChoiceReady: 'La otra persona eligió un horario. Confirma la misma opción o elige otra.',
    choicesDiffer: 'Habéis elegido horarios diferentes. Elige la opción marcada “Su elección” para coincidir o espera a que cambie.',
    creatingMeet: 'Ambas personas confirmasteis el mismo horario. Estamos creando el Google Meet privado…',
    retryScheduling: 'No se pudo crear Google Meet. Elige de nuevo el horario acordado para reintentarlo.',
    joinMeet: 'Unirse a Google Meet',
    calendar: 'Abrir evento del calendario',
    end: 'Finalizar esta conexión',
    endRematch: 'Finalizar y buscar otra coincidencia',
    pause: 'Pausar coincidencias',
    resume: 'Reanudar coincidencias',
    waitingTitle: 'Tu perfil está en el sistema de coincidencias',
    waitingText: 'El sistema te enviará un correo cuando haya una persona compatible. No necesitas revisar esta página constantemente.',
    pausedTitle: 'Las coincidencias están en pausa',
    pausedText: 'Tu perfil sigue privado y no recibirá propuestas nuevas hasta que reanudes.',
    roleSurvivor: 'Mentor superviviente',
    roleWarrior: 'Persona con cáncer',
    age: 'Rango de edad',
    country: 'País',
    cancer: 'Experiencia de cáncer',
    phase: 'Etapa de la experiencia',
    languages: 'Idiomas',
    treatments: 'Experiencia de tratamiento',
    topics: 'Temas',
    communication: 'Comunicación',
    intro: 'Presentación',
    noIntro: 'No se añadió una presentación.',
    confirmEnd: '¿Finalizar esta conexión? La otra persona dejará de aparecer como tu conexión activa.',
    confirmRematch: '¿Finalizar esta conexión y pedir al sistema otra coincidencia?',
    confirmDecline: '¿Rechazar esta coincidencia? Los mismos perfiles no volverán a proponerse juntos.',
    error: 'No se pudo completar la acción. Actualiza la página e inténtalo de nuevo.',
    refreshed: 'Actualizado',
    rules: 'El apoyo entre pares no es atención médica. No des instrucciones médicas, no pidas dinero, no grabes llamadas ni compartas enlaces privados.',
    reasons: {
      'same-cancer-type': 'Mismo tipo de cáncer',
      'same-cancer-subtype': 'Mismo subtipo',
      'shared-treatment-experience': 'Experiencia relevante de tratamiento',
      'similar-cancer-phase': 'Etapa similar de la experiencia',
      'shared-support-topics': 'Temas de apoyo compartidos',
      'shared-language': 'Idioma compartido',
      'compatible-communication': 'Preferencias de comunicación compatibles',
      'same-timezone': 'Misma zona horaria',
      'gender-preference-compatible': 'Preferencia de mentor respetada',
      'similar-age-range': 'Rango de edad similar',
    },
  },
} as const;

function statusLabel(
  status: ConnectPortalState['profile']['status'],
  text: (typeof COPY)[Locale],
): string {
  if (status === 'pending-review') return text.pendingReview;
  if (status === 'review-rejected') return text.reviewRejected;
  if (status === 'paused') return text.paused;
  if (status === 'matched') return text.matched;
  if (status === 'suspended') return text.suspended;
  if (status === 'closed') return text.closed;
  return text.active;
}

function formatMeetingDate(
  value: string,
  timezone: string,
  locale: Locale,
): string {
  return new Intl.DateTimeFormat(
    locale === 'ro' ? 'ro-RO' : locale === 'es' ? 'es-ES' : 'en-GB',
    {
      dateStyle: 'full',
      timeStyle: 'short',
      timeZone: timezone,
    },
  ).format(new Date(value));
}

function ProfileDetails({
  profile,
  locale,
}: {
  profile: PublicConnectProfile;
  locale: Locale;
}) {
  const text = COPY[locale];
  const rows = [
    [text.age, profile.ageRange],
    [text.country, profile.country],
    [text.cancer, [profile.cancerType, profile.cancerSubtype].filter(Boolean).join(' — ')],
    [text.phase, profile.phase],
    [text.languages, profile.languages.join(', ')],
    [text.treatments, profile.treatments.join(', ')],
    [text.topics, profile.topics.join(', ')],
    [text.communication, profile.communicationMethods.join(', ')],
  ];

  return (
    <div className="space-y-5">
      <div className="flex items-start gap-4">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-700">
          <UserRound className="h-6 w-6" />
        </span>
        <div>
          <h3 className="text-2xl font-black text-neutral-900">{profile.firstName}</h3>
          <p className="mt-1 text-sm font-bold text-indigo-700">
            {profile.role === 'survivor' ? text.roleSurvivor : text.roleWarrior}
          </p>
        </div>
      </div>
      <dl className="grid gap-3 sm:grid-cols-2">
        {rows.map(([label, value]) => (
          <div key={label} className="rounded-xl bg-neutral-50 p-4">
            <dt className="text-xs font-black uppercase tracking-wide text-neutral-500">{label}</dt>
            <dd className="mt-1 text-sm font-semibold leading-relaxed text-neutral-800">{value || '—'}</dd>
          </div>
        ))}
      </dl>
      <div className="rounded-xl border border-indigo-100 bg-indigo-50 p-4">
        <p className="text-xs font-black uppercase tracking-wide text-indigo-700">{text.intro}</p>
        <p className="mt-2 text-sm leading-relaxed text-indigo-950">{profile.shortIntro || text.noIntro}</p>
      </div>
    </div>
  );
}

export default function ConnectPortal({locale}: {locale: Locale}) {
  const text = COPY[locale];
  const searchParams = useSearchParams();
  const [token, setToken] = useState('');
  const [state, setState] = useState<ConnectPortalState>();
  const [status, setStatus] = useState<'loading' | 'ready' | 'invalid'>('loading');
  const [busy, setBusy] = useState<PortalAction>();
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [safetyConfirmed, setSafetyConfirmed] = useState(false);

  useEffect(() => {
    const queryToken = searchParams.get('token') || '';
    const storedToken = window.sessionStorage.getItem(TOKEN_STORAGE_KEY) || '';
    const nextToken = queryToken || storedToken;
    if (queryToken) {
      window.sessionStorage.setItem(TOKEN_STORAGE_KEY, queryToken);
      const cleanUrl = `${window.location.pathname}${window.location.hash}`;
      window.history.replaceState(null, '', cleanUrl);
    }
    setToken(nextToken);
  }, [searchParams]);

  const load = useCallback(async (activeToken: string) => {
    if (!activeToken) {
      setStatus('invalid');
      return;
    }
    try {
      const response = await fetch(
        `/api/connect/portal?token=${encodeURIComponent(activeToken)}`,
        {cache: 'no-store'},
      );
      const payload = await response.json().catch(() => ({})) as ConnectPortalState & {error?: string};
      if (!response.ok) throw new Error(payload.error || text.error);
      setState(payload);
      setStatus('ready');
      setError('');
    } catch {
      window.sessionStorage.removeItem(TOKEN_STORAGE_KEY);
      setStatus('invalid');
    }
  }, [text.error]);

  useEffect(() => {
    if (token) void load(token);
  }, [load, token]);

  async function act(action: PortalAction, payload: Record<string, unknown> = {}) {
    if (!token || busy) return;
    if (action === 'decline-proposal' && !window.confirm(text.confirmDecline)) return;
    if (action === 'end' && !window.confirm(text.confirmEnd)) return;
    if (action === 'end-rematch' && !window.confirm(text.confirmRematch)) return;

    setBusy(action);
    setError('');
    setNotice('');
    try {
      const response = await fetch('/api/connect/portal', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({token, action, ...payload}),
      });
      const result = await response.json().catch(() => ({})) as {
        state?: ConnectPortalState;
        error?: string;
      };
      if (!response.ok || !result.state) {
        throw new Error(result.error || text.error);
      }
      setState(result.state);
      if (action === 'report-block') setNotice(text.reportSuccess);
      if (action === 'accept-proposal') setSafetyConfirmed(false);
    } catch (actionError) {
      setError(actionError instanceof Error ? actionError.message : text.error);
    } finally {
      setBusy(undefined);
    }
  }

  async function reportTarget(payload: {proposalId?: string; connectionId?: string}) {
    const details = window.prompt(text.reportPrompt);
    if (details === null) return;
    if (!window.confirm(text.reportConfirm)) return;
    await act('report-block', {
      ...payload,
      category: 'safety-concern',
      details,
    });
  }

  useEffect(() => {
    setSafetyConfirmed(false);
  }, [state?.proposal?.id]);

  const meetingDate = useMemo(() => {
    if (!state?.connection?.meeting) return '';
    return formatMeetingDate(
      state.connection.meeting.startsAt,
      state.profile.timezone,
      locale,
    );
  }, [locale, state]);

  if (status === 'loading') {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#faf9ff] px-4 pt-20">
        <div className="text-center">
          <LoaderCircle className="mx-auto h-10 w-10 animate-spin text-indigo-700" />
          <p className="mt-4 font-bold text-neutral-700">{text.loading}</p>
        </div>
      </main>
    );
  }

  if (status === 'invalid' || !state) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#faf9ff] px-4 pt-20">
        <section className="max-w-xl rounded-[2rem] border border-red-100 bg-white p-10 text-center shadow-xl">
          <CircleAlert className="mx-auto h-14 w-14 text-red-500" />
          <h1 className="mt-5 text-3xl font-black text-neutral-900">{text.invalidTitle}</h1>
          <p className="mt-4 leading-relaxed text-neutral-600">{text.invalidText}</p>
        </section>
      </main>
    );
  }

  const restrictedState = state.profile.status === 'pending-review'
    ? {title: text.pendingReviewTitle, body: text.pendingReviewText}
    : state.profile.status === 'review-rejected'
      ? {title: text.reviewRejectedTitle, body: text.reviewRejectedText}
      : state.profile.status === 'suspended'
        ? {title: text.suspendedTitle, body: text.suspendedText}
        : null;

  return (
    <main className="min-h-screen bg-[#faf9ff] pb-20 pt-20">
      <section className="bg-gradient-to-br from-indigo-950 via-indigo-800 to-purple-700 py-16 text-white">
        <div className="container mx-auto max-w-5xl px-4">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-indigo-200">
                <ShieldCheck className="h-4 w-4" /> {text.private}
              </p>
              <h1 className="mt-3 text-4xl font-black md:text-6xl">{text.title}</h1>
              <p className="mt-4 max-w-2xl text-indigo-100">{text.subtitle}</p>
            </div>
            <div className="rounded-2xl bg-white/10 p-5 ring-1 ring-white/20">
              <p className="text-xs font-black uppercase tracking-wide text-indigo-200">{text.reference}</p>
              <p className="mt-1 font-mono text-lg font-black">{state.profile.reference}</p>
              <p className="mt-2 inline-flex rounded-full bg-white/15 px-3 py-1 text-xs font-black">
                {statusLabel(state.profile.status, text)}
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto max-w-5xl space-y-7 px-4 py-10">
        {error && (
          <p role="alert" className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-4 font-bold text-red-700">
            <CircleAlert className="mt-0.5 h-5 w-5 shrink-0" /> {error}
          </p>
        )}
        {notice && (
          <p role="status" className="flex items-start gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-4 font-bold text-emerald-800">
            <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0" /> {notice}
          </p>
        )}

        {state.proposal && (
          <section className="rounded-[2rem] border border-indigo-100 bg-white p-6 shadow-xl md:p-9">
            <div className="mb-7 flex flex-col gap-4 border-b border-neutral-100 pb-6 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.18em] text-indigo-600">TCW Connect</p>
                <h2 className="mt-2 text-3xl font-black text-neutral-900">{text.matchTitle}</h2>
                <p className="mt-2 max-w-2xl text-sm leading-relaxed text-neutral-600">{text.matchIntro}</p>
              </div>
              <div className="shrink-0 rounded-2xl bg-emerald-50 px-5 py-4 text-center text-emerald-800">
                <p className="text-3xl font-black">{state.proposal.score}%</p>
                <p className="text-xs font-black uppercase">{text.compatibility}</p>
              </div>
            </div>

            <ProfileDetails profile={state.proposal.counterpart} locale={locale} />

            <div className="mt-6 rounded-2xl bg-purple-50 p-5">
              <h3 className="font-black text-purple-950">{text.why}</h3>
              <div className="mt-3 flex flex-wrap gap-2">
                {state.proposal.reasons.map((reason) => (
                  <span key={reason} className="rounded-full bg-white px-3 py-2 text-xs font-bold text-purple-800 shadow-sm">
                    {text.reasons[reason as keyof typeof text.reasons] || reason}
                  </span>
                ))}
              </div>
            </div>

            <label className="mt-7 flex items-start gap-3 rounded-2xl border border-indigo-200 bg-indigo-50 p-4 text-sm font-bold leading-relaxed text-indigo-950">
              <input type="checkbox" checked={safetyConfirmed} onChange={(event) => setSafetyConfirmed(event.target.checked)} className="mt-0.5 h-4 w-4 shrink-0 accent-indigo-700" />
              {text.safetyConfirm}
            </label>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              <button
                type="button"
                disabled={Boolean(busy) || !safetyConfirmed}
                onClick={() => void act('accept-proposal', {proposalId: state.proposal?.id || '', safetyConfirmed: true})}
                className="flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-4 font-black text-white hover:bg-emerald-700 disabled:opacity-50"
              >
                {busy === 'accept-proposal' ? <LoaderCircle className="h-5 w-5 animate-spin" /> : <CheckCircle2 className="h-5 w-5" />}
                {busy === 'accept-proposal' ? text.accepting : text.accept}
              </button>
              <button
                type="button"
                disabled={Boolean(busy)}
                onClick={() => void act('decline-proposal', {proposalId: state.proposal?.id || ''})}
                className="flex items-center justify-center gap-2 rounded-xl border border-neutral-300 px-5 py-4 font-black text-neutral-700 hover:border-red-300 hover:bg-red-50 hover:text-red-700 disabled:opacity-50"
              >
                <XCircle className="h-5 w-5" /> {text.decline}
              </button>
              <button
                type="button"
                disabled={Boolean(busy)}
                onClick={() => void reportTarget({proposalId: state.proposal?.id || ''})}
                className="flex items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-5 py-4 font-black text-red-800 hover:bg-red-100 disabled:opacity-50"
              >
                <Flag className="h-5 w-5" /> {text.report}
              </button>
            </div>
          </section>
        )}

        {state.connection && (
          <section className="rounded-[2rem] border border-purple-100 bg-white p-6 shadow-xl md:p-9">
            <div className="mb-7 flex items-center gap-3">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-100 text-purple-700">
                <HeartHandshake className="h-6 w-6" />
              </span>
              <h2 className="text-3xl font-black text-neutral-900">{text.connectionTitle}</h2>
            </div>

            <ProfileDetails profile={state.connection.counterpart} locale={locale} />

            {state.connection.meeting ? (
              <div className="mt-7 rounded-2xl border border-emerald-200 bg-emerald-50 p-6">
                <p className="flex items-center gap-2 font-black text-emerald-900">
                  <CalendarDays className="h-5 w-5" /> {text.meetScheduled}
                </p>
                <p className="mt-3 flex items-center gap-2 text-lg font-black text-neutral-900">
                  <Clock3 className="h-5 w-5 text-emerald-700" /> {meetingDate}
                </p>
                <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                  <a
                    href={state.connection.meeting.meetUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-center gap-2 rounded-xl bg-emerald-700 px-5 py-3 font-black text-white hover:bg-emerald-800"
                  >
                    <Video className="h-5 w-5" /> {text.joinMeet}
                  </a>
                  {state.connection.meeting.calendarUrl && (
                    <a
                      href={state.connection.meeting.calendarUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center justify-center gap-2 rounded-xl border border-emerald-300 bg-white px-5 py-3 font-black text-emerald-800"
                    >
                      <CalendarDays className="h-5 w-5" /> {text.calendar}
                    </a>
                  )}
                </div>
              </div>
            ) : state.connection.schedulingOptions?.length ? (
              <div className="mt-7 rounded-2xl border border-indigo-200 bg-indigo-50 p-5 md:p-6">
                <p className="flex items-center gap-2 text-lg font-black text-indigo-950">
                  <CalendarDays className="h-5 w-5" /> {text.chooseTimeTitle}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-indigo-900">
                  {text.chooseTimeIntro}
                </p>
                <div className="mt-5 grid gap-3">
                  {state.connection.schedulingOptions.map((option) => {
                    const mine = state.connection?.selectedOptionId === option.id;
                    const theirs =
                      state.connection?.counterpartSelectedOptionId === option.id;
                    return (
                      <button
                        key={option.id}
                        type="button"
                        aria-pressed={mine}
                        disabled={
                          Boolean(busy) ||
                          Boolean(state.connection?.schedulingInProgress)
                        }
                        onClick={() => void act('select-meeting-time', {
                          connectionId: state.connection?.id || '',
                          optionId: option.id,
                        })}
                        className={`rounded-2xl border-2 p-4 text-left transition disabled:cursor-wait disabled:opacity-70 ${
                          mine
                            ? 'border-indigo-700 bg-white shadow-md'
                            : 'border-white bg-white/80 hover:border-indigo-300'
                        }`}
                      >
                        <span className="block font-black text-neutral-900">
                          {formatMeetingDate(
                            option.startsAt,
                            state.profile.timezone,
                            locale,
                          )}
                        </span>
                        <span className="mt-2 flex flex-wrap gap-2">
                          {mine && (
                            <span className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-black text-indigo-800">
                              {text.yourChoice}
                            </span>
                          )}
                          {theirs && (
                            <span className="rounded-full bg-purple-100 px-3 py-1 text-xs font-black text-purple-800">
                              {text.theirChoice}
                            </span>
                          )}
                          {!mine && (
                            <span className="text-xs font-bold text-indigo-700">
                              {text.selectTime}
                            </span>
                          )}
                        </span>
                      </button>
                    );
                  })}
                </div>
                {state.connection.schedulingInProgress && (
                  <p className="mt-4 flex items-start gap-2 rounded-xl bg-white p-4 font-bold text-indigo-900">
                    <LoaderCircle className="mt-0.5 h-5 w-5 shrink-0 animate-spin" />
                    {text.creatingMeet}
                  </p>
                )}
                {!state.connection.schedulingInProgress &&
                  state.connection.schedulingError && (
                    <p className="mt-4 flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 p-4 font-bold text-amber-900">
                      <CircleAlert className="mt-0.5 h-5 w-5 shrink-0" />
                      {text.retryScheduling}
                    </p>
                  )}
                {!state.connection.schedulingInProgress &&
                  !state.connection.schedulingError &&
                  state.connection.selectedOptionId &&
                  state.connection.counterpartSelectedOptionId &&
                  state.connection.selectedOptionId !==
                    state.connection.counterpartSelectedOptionId && (
                    <p className="mt-4 rounded-xl bg-amber-50 p-4 text-sm font-bold text-amber-900">
                      {text.choicesDiffer}
                    </p>
                  )}
                {!state.connection.schedulingInProgress &&
                  !state.connection.schedulingError &&
                  state.connection.selectedOptionId &&
                  !state.connection.counterpartSelectedOptionId && (
                    <p className="mt-4 rounded-xl bg-white p-4 text-sm font-bold text-indigo-900">
                      {text.waitingForTheirChoice}
                    </p>
                  )}
                {!state.connection.schedulingInProgress &&
                  !state.connection.schedulingError &&
                  !state.connection.selectedOptionId &&
                  state.connection.counterpartSelectedOptionId && (
                    <p className="mt-4 rounded-xl bg-white p-4 text-sm font-bold text-indigo-900">
                      {text.theirChoiceReady}
                    </p>
                  )}
              </div>
            ) : (
              <div className="mt-7 rounded-2xl border border-amber-200 bg-amber-50 p-5">
                <p className="flex items-start gap-2 font-bold text-neutral-800">
                  <CircleAlert className="mt-0.5 h-5 w-5 shrink-0 text-amber-700" />
                  {text.schedulingHelp}
                </p>
              </div>
            )}

            <div className="mt-7 grid gap-3 sm:grid-cols-3">
              <button
                type="button"
                disabled={Boolean(busy)}
                onClick={() => void act('end', {connectionId: state.connection?.id || ''})}
                className="flex items-center justify-center gap-2 rounded-xl border border-neutral-300 px-5 py-3 font-black text-neutral-700 hover:bg-neutral-50 disabled:opacity-50"
              >
                <LogOut className="h-5 w-5" /> {text.end}
              </button>
              <button
                type="button"
                disabled={Boolean(busy)}
                onClick={() => void act('end-rematch', {connectionId: state.connection?.id || ''})}
                className="flex items-center justify-center gap-2 rounded-xl border border-indigo-300 bg-indigo-50 px-5 py-3 font-black text-indigo-800 hover:bg-indigo-100 disabled:opacity-50"
              >
                <RefreshCw className="h-5 w-5" /> {text.endRematch}
              </button>
              <button
                type="button"
                disabled={Boolean(busy)}
                onClick={() => void reportTarget({connectionId: state.connection?.id || ''})}
                className="flex items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-5 py-3 font-black text-red-800 hover:bg-red-100 disabled:opacity-50"
              >
                <Flag className="h-5 w-5" /> {text.report}
              </button>
            </div>
          </section>
        )}

        {!state.proposal && !state.connection && (
          <section className="rounded-[2rem] border border-indigo-100 bg-white p-9 text-center shadow-lg">
            {restrictedState ? (
              <>
                <ShieldCheck className="mx-auto h-14 w-14 text-indigo-600" />
                <h2 className="mt-5 text-3xl font-black text-neutral-900">{restrictedState.title}</h2>
                <p className="mx-auto mt-3 max-w-xl text-neutral-600">{restrictedState.body}</p>
              </>
            ) : state.profile.status === 'paused' ? (
              <>
                <PauseCircle className="mx-auto h-14 w-14 text-neutral-500" />
                <h2 className="mt-5 text-3xl font-black text-neutral-900">{text.pausedTitle}</h2>
                <p className="mx-auto mt-3 max-w-xl text-neutral-600">{text.pausedText}</p>
                <button
                  type="button"
                  disabled={Boolean(busy)}
                  onClick={() => void act('resume')}
                  className="mx-auto mt-6 flex items-center justify-center gap-2 rounded-xl bg-indigo-700 px-6 py-3 font-black text-white hover:bg-indigo-800 disabled:opacity-50"
                >
                  {busy === 'resume' ? <LoaderCircle className="h-5 w-5 animate-spin" /> : <PlayCircle className="h-5 w-5" />}
                  {text.resume}
                </button>
              </>
            ) : (
              <>
                <Sparkles className="mx-auto h-14 w-14 text-indigo-600" />
                <h2 className="mt-5 text-3xl font-black text-neutral-900">{text.waitingTitle}</h2>
                <p className="mx-auto mt-3 max-w-xl text-neutral-600">{text.waitingText}</p>
                <button
                  type="button"
                  disabled={Boolean(busy)}
                  onClick={() => void act('pause')}
                  className="mx-auto mt-6 flex items-center justify-center gap-2 rounded-xl border border-neutral-300 px-6 py-3 font-black text-neutral-700 hover:bg-neutral-50 disabled:opacity-50"
                >
                  <PauseCircle className="h-5 w-5" /> {text.pause}
                </button>
              </>
            )}
          </section>
        )}

        <aside className="flex items-start gap-3 rounded-2xl border border-indigo-100 bg-indigo-50 p-5 text-sm leading-relaxed text-indigo-950">
          <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-indigo-700" />
          {text.rules}
        </aside>
      </div>
    </main>
  );
}
