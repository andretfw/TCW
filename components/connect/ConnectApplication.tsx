'use client';

import {FormEvent, useMemo, useState} from 'react';
import Link from 'next/link';
import {useLocale} from 'next-intl';
import {
  ArrowRight,
  CheckCircle2,
  HeartHandshake,
  LoaderCircle,
  ShieldCheck,
  Sparkles,
  UsersRound,
  Video,
} from 'lucide-react';

import {localizedPath} from '@/lib/routes';
import type {AvailabilityKey} from '@/lib/connect/types';

type Locale = 'en' | 'ro' | 'es';
type Role = 'survivor' | 'warrior';
type Option = {value: string; en: string; ro: string; es: string};
type AvailabilityOption = Option & {keys: AvailabilityKey[]};

const COPY = {
  en: {
    title: 'Meet someone who truly understands.',
    subtitle: 'TCW privately matches adults living with cancer with survivors who have relevant lived experience. After both people agree, the system schedules a private Google Meet.',
    survivor: 'I am a survivor',
    survivorText: 'I want to support a warrior through an experience I know personally.',
    warrior: 'I am living with cancer',
    warriorText: 'I want to speak with a survivor who has faced something similar.',
    choose: 'Choose how you want to join',
    change: 'Change selection',
    how: 'How it works',
    steps: [
      ['Create a private profile', 'We collect only the information needed for matching.'],
      ['Confirm your email', 'Warriors enter matching after confirmation. Survivor mentors are reviewed by TCW before matching.'],
      ['Meet after mutual consent', 'Both people accept before TCW creates a Google Meet.'],
    ],
    formTitle: 'Create your private TCW Connect profile',
    formIntro: 'No medical records, surname, phone number or public profile are required.',
    about: 'About you', experience: 'Cancer experience', support: 'Useful support', availability: 'Communication and availability', consent: 'Consent and rules',
    firstName: 'First name or chosen name', email: 'Email', country: 'Country', age: 'Age range', gender: 'Gender', languages: 'Languages you can comfortably use',
    cancer: 'Cancer type', subtype: 'Subtype, if relevant', phase: 'Current or most relevant experience', treatments: 'Treatments or procedures experienced', topics: 'Topics you would like to discuss', intro: 'Short introduction, optional', introPlaceholder: 'A few sentences about the support you can offer or hope to receive.',
    capacity: 'How many warriors can you support at one time?', mentorPreference: 'Preferred survivor gender', communication: 'Preferred communication', availabilityHelp: 'Choose every time window that usually works. TCW will find the first shared 45-minute slot.', timezone: 'Detected time zone',
    consentHealth: 'I explicitly consent to TCW processing the cancer and treatment information I provide for peer-support matching.',
    consentAutomated: 'I consent to automated matching, limited-profile sharing and automated program emails.',
    consentContact: 'I consent to my email being shared with the matched person only after we both accept.',
    consentMeeting: 'I consent to TCW automatically scheduling a private Google Meet from our shared availability.',
    consentRules: 'I am 18 or older and agree to the peer-support rules. I understand this is not medical care, therapy or an emergency service.',
    consentSafety: 'I understand I can report and block at any time. A report immediately stops contact, suspends the reported profile for TCW review and cancels future meetings.',
    submit: 'Join TCW Connect', submitting: 'Creating your private profile…',
    successTitle: 'Check your email to activate your profile.',
    successText: 'We sent you a private TCW Connect link. Matching begins only after you open it and confirm control of the email address.',
    successMentorText: 'We sent you a private link to confirm your email. After confirmation, TCW will verify your identity and survivor experience before your profile can enter matching.',
    reference: 'Reference', formError: 'Complete every required field and choose at least one option in each section.', serverError: 'We could not create the profile. Check the form and try again.',
    policy: 'Read the peer-support policy', privacy: 'Health information is encrypted and never displayed in a public directory.',
  },
  ro: {
    title: 'Vorbește cu cineva care înțelege cu adevărat.',
    subtitle: 'TCW conectează în mod privat adulții care trăiesc cu cancer cu supraviețuitori care au o experiență relevantă. După ce ambele persoane acceptă, sistemul programează un Google Meet privat.',
    survivor: 'Sunt supraviețuitor',
    survivorText: 'Vreau să sprijin un luptător printr-o experiență pe care o cunosc personal.',
    warrior: 'Trăiesc cu cancer',
    warriorText: 'Vreau să vorbesc cu un supraviețuitor care a trecut prin ceva asemănător.',
    choose: 'Alege cum dorești să participi',
    change: 'Schimbă selecția',
    how: 'Cum funcționează',
    steps: [
      ['Creezi un profil privat', 'Colectăm doar informațiile necesare pentru potrivire.'],
      ['Confirmi adresa de email', 'Luptătorii intră în potrivire după confirmare. Mentorii sunt verificați de TCW înainte.'],
      ['Vă întâlniți după acceptul reciproc', 'Ambele persoane acceptă înainte ca TCW să creeze un Google Meet.'],
    ],
    formTitle: 'Creează profilul tău privat TCW Connect',
    formIntro: 'Nu cerem documente medicale, nume de familie, număr de telefon sau profil public.',
    about: 'Despre tine', experience: 'Experiența oncologică', support: 'Sprijin util', availability: 'Comunicare și disponibilitate', consent: 'Consimțământ și reguli',
    firstName: 'Prenume sau numele ales', email: 'Email', country: 'Țara', age: 'Grupa de vârstă', gender: 'Gen', languages: 'Limbile în care poți comunica confortabil',
    cancer: 'Tipul de cancer', subtype: 'Subtipul, dacă este relevant', phase: 'Experiența actuală sau cea mai relevantă', treatments: 'Tratamente sau proceduri experimentate', topics: 'Subiectele despre care ai dori să vorbiți', intro: 'Scurtă prezentare, opțional', introPlaceholder: 'Câteva propoziții despre sprijinul pe care îl poți oferi sau primi.',
    capacity: 'Câți luptători poți sprijini în același timp?', mentorPreference: 'Genul preferat al supraviețuitorului', communication: 'Metoda de comunicare preferată', availabilityHelp: 'Alege intervalele care îți sunt de obicei potrivite. TCW va găsi primul interval comun de 45 de minute.', timezone: 'Fus orar detectat',
    consentHealth: 'Consimt explicit ca TCW să prelucreze informațiile despre cancer și tratament pentru potrivirea în program.',
    consentAutomated: 'Consimt la potrivirea automată, afișarea profilului limitat și emailurile automate ale programului.',
    consentContact: 'Consimt ca adresa mea de email să fie transmisă persoanei potrivite numai după ce acceptăm amândoi.',
    consentMeeting: 'Consimt ca TCW să programeze automat un Google Meet privat din disponibilitatea noastră comună.',
    consentRules: 'Am cel puțin 18 ani și accept regulile programului. Înțeleg că acesta nu este serviciu medical, terapie sau serviciu de urgență.',
    consentSafety: 'Înțeleg că pot raporta și bloca oricând. O sesizare oprește imediat contactul, suspendă profilul raportat pentru verificare și anulează întâlnirile viitoare.',
    submit: 'Înscrie-te în TCW Connect', submitting: 'Creăm profilul tău privat…',
    successTitle: 'Verifică emailul pentru a activa profilul.',
    successText: 'Ți-am trimis un link privat TCW Connect. Potrivirea începe numai după ce îl deschizi și confirmi că adresa de email îți aparține.',
    successMentorText: 'Ți-am trimis un link privat pentru confirmarea emailului. După confirmare, TCW va verifica identitatea și experiența oncologică înainte ca profilul să intre în potrivire.',
    reference: 'Referință', formError: 'Completează toate câmpurile obligatorii și alege cel puțin o opțiune în fiecare secțiune.', serverError: 'Profilul nu a putut fi creat. Verifică formularul și încearcă din nou.',
    policy: 'Citește politica de sprijin între persoane', privacy: 'Informațiile despre sănătate sunt criptate și nu apar niciodată într-un director public.',
  },
  es: {
    title: 'Habla con alguien que realmente lo entiende.',
    subtitle: 'TCW conecta de forma privada a adultos que viven con cáncer con supervivientes con experiencia relevante. Después de que ambas personas acepten, el sistema programa un Google Meet privado.',
    survivor: 'Soy superviviente',
    survivorText: 'Quiero apoyar a una persona en una experiencia que conozco personalmente.',
    warrior: 'Vivo con cáncer',
    warriorText: 'Quiero hablar con un superviviente que haya pasado por algo parecido.',
    choose: 'Elige cómo quieres participar',
    change: 'Cambiar selección',
    how: 'Cómo funciona',
    steps: [
      ['Crea un perfil privado', 'Solo recogemos la información necesaria para encontrar una coincidencia.'],
      ['Confirma tu correo', 'Las personas con cáncer entran tras confirmar. TCW revisa a los mentores antes.'],
      ['Reuníos con consentimiento mutuo', 'Ambas personas aceptan antes de que TCW cree un Google Meet.'],
    ],
    formTitle: 'Crea tu perfil privado de TCW Connect',
    formIntro: 'No pedimos historial médico, apellido, teléfono ni un perfil público.',
    about: 'Sobre ti', experience: 'Experiencia con el cáncer', support: 'Apoyo útil', availability: 'Comunicación y disponibilidad', consent: 'Consentimiento y reglas',
    firstName: 'Nombre o nombre elegido', email: 'Correo electrónico', country: 'País', age: 'Rango de edad', gender: 'Género', languages: 'Idiomas que puedes usar cómodamente',
    cancer: 'Tipo de cáncer', subtype: 'Subtipo, si es relevante', phase: 'Experiencia actual o más relevante', treatments: 'Tratamientos o procedimientos vividos', topics: 'Temas que te gustaría conversar', intro: 'Presentación breve, opcional', introPlaceholder: 'Unas frases sobre el apoyo que puedes ofrecer o recibir.',
    capacity: '¿A cuántas personas puedes apoyar al mismo tiempo?', mentorPreference: 'Género preferido del superviviente', communication: 'Comunicación preferida', availabilityHelp: 'Elige los horarios que normalmente te sirven. TCW buscará el primer intervalo común de 45 minutos.', timezone: 'Zona horaria detectada',
    consentHealth: 'Doy mi consentimiento explícito para que TCW trate la información sobre cáncer y tratamiento para encontrar apoyo compatible.',
    consentAutomated: 'Acepto la coincidencia automática, el perfil limitado y los correos automáticos del programa.',
    consentContact: 'Acepto que mi correo se comparta con la persona asignada solo después de que ambos aceptemos.',
    consentMeeting: 'Acepto que TCW programe automáticamente un Google Meet privado según nuestra disponibilidad común.',
    consentRules: 'Tengo 18 años o más y acepto las reglas. Entiendo que no es atención médica, terapia ni un servicio de emergencia.',
    consentSafety: 'Entiendo que puedo reportar y bloquear en cualquier momento. Un reporte detiene el contacto, suspende el perfil para revisión y cancela las reuniones futuras.',
    submit: 'Unirme a TCW Connect', submitting: 'Creando tu perfil privado…',
    successTitle: 'Revisa tu correo para activar el perfil.',
    successText: 'Te enviamos un enlace privado de TCW Connect. Las coincidencias comienzan solo después de abrirlo y confirmar que controlas esa dirección.',
    successMentorText: 'Te enviamos un enlace privado para confirmar tu correo. Después, TCW verificará tu identidad y experiencia antes de que el perfil entre en el sistema.',
    reference: 'Referencia', formError: 'Completa todos los campos obligatorios y elige al menos una opción en cada sección.', serverError: 'No pudimos crear el perfil. Revisa el formulario e inténtalo de nuevo.',
    policy: 'Leer la política de apoyo entre pares', privacy: 'Tu información de salud está cifrada y nunca aparece en un directorio público.',
  },
} as const;

const LANGUAGES: Option[] = [
  {value: 'English', en: 'English', ro: 'Engleză', es: 'Inglés'},
  {value: 'Romanian', en: 'Romanian', ro: 'Română', es: 'Rumano'},
  {value: 'Spanish', en: 'Spanish', ro: 'Spaniolă', es: 'Español'},
  {value: 'Italian', en: 'Italian', ro: 'Italiană', es: 'Italiano'},
  {value: 'French', en: 'French', ro: 'Franceză', es: 'Francés'},
  {value: 'Other', en: 'Other', ro: 'Altă limbă', es: 'Otro'},
];

const CANCERS: Option[] = [
  ['Breast cancer', 'Breast cancer', 'Cancer de sân', 'Cáncer de mama'],
  ['Colorectal cancer', 'Colorectal cancer', 'Cancer colorectal', 'Cáncer colorrectal'],
  ['Lung cancer', 'Lung cancer', 'Cancer pulmonar', 'Cáncer de pulmón'],
  ['Prostate cancer', 'Prostate cancer', 'Cancer de prostată', 'Cáncer de próstata'],
  ['Ovarian cancer', 'Ovarian cancer', 'Cancer ovarian', 'Cáncer de ovario'],
  ['Cervical cancer', 'Cervical cancer', 'Cancer de col uterin', 'Cáncer de cuello uterino'],
  ['Uterine cancer', 'Uterine cancer', 'Cancer uterin', 'Cáncer de útero'],
  ['Pancreatic cancer', 'Pancreatic cancer', 'Cancer pancreatic', 'Cáncer de páncreas'],
  ['Liver cancer', 'Liver cancer', 'Cancer hepatic', 'Cáncer de hígado'],
  ['Kidney cancer', 'Kidney cancer', 'Cancer renal', 'Cáncer de riñón'],
  ['Bladder cancer', 'Bladder cancer', 'Cancer de vezică', 'Cáncer de vejiga'],
  ['Skin cancer / melanoma', 'Skin cancer / melanoma', 'Cancer de piele / melanom', 'Cáncer de piel / melanoma'],
  ['Head and neck cancer', 'Head and neck cancer', 'Cancer de cap și gât', 'Cáncer de cabeza y cuello'],
  ['Brain tumour', 'Brain tumour', 'Tumoră cerebrală', 'Tumor cerebral'],
  ['Leukaemia', 'Leukaemia', 'Leucemie', 'Leucemia'],
  ['Lymphoma', 'Lymphoma', 'Limfom', 'Linfoma'],
  ['Myeloma', 'Myeloma', 'Mielom', 'Mieloma'],
  ['Sarcoma', 'Sarcoma', 'Sarcom', 'Sarcoma'],
  ['Childhood cancer experience', 'Childhood cancer experience', 'Experiență de cancer în copilărie', 'Experiencia de cáncer infantil'],
  ['Other cancer', 'Other cancer', 'Alt tip de cancer', 'Otro tipo de cáncer'],
].map(([value, en, ro, es]) => ({value, en, ro, es}));

const TREATMENTS: Option[] = [
  ['Chemotherapy', 'Chemotherapy', 'Chimioterapie', 'Quimioterapia'],
  ['Radiotherapy', 'Radiotherapy', 'Radioterapie', 'Radioterapia'],
  ['Immunotherapy', 'Immunotherapy', 'Imunoterapie', 'Inmunoterapia'],
  ['Hormone therapy', 'Hormone therapy', 'Terapie hormonală', 'Terapia hormonal'],
  ['Targeted therapy', 'Targeted therapy', 'Terapie țintită', 'Terapia dirigida'],
  ['Cancer surgery', 'Cancer surgery', 'Intervenție chirurgicală', 'Cirugía oncológica'],
  ['Mastectomy', 'Mastectomy', 'Mastectomie', 'Mastectomía'],
  ['Ostomy', 'Ostomy', 'Stomă', 'Ostomía'],
  ['Stem cell transplant', 'Stem cell transplant', 'Transplant de celule stem', 'Trasplante de células madre'],
  ['Long-term medication', 'Long-term medication', 'Tratament medicamentos pe termen lung', 'Medicación a largo plazo'],
  ['Active monitoring', 'Active monitoring', 'Monitorizare activă', 'Vigilancia activa'],
  ['Other treatment', 'Other treatment', 'Alt tratament', 'Otro tratamiento'],
].map(([value, en, ro, es]) => ({value, en, ro, es}));

const TOPICS: Option[] = [
  ['New diagnosis', 'New diagnosis', 'Diagnostic nou', 'Diagnóstico reciente'],
  ['Treatment decisions', 'Treatment decisions', 'Decizii despre tratament', 'Decisiones de tratamiento'],
  ['Treatment side effects', 'Treatment side effects', 'Efecte adverse', 'Efectos secundarios'],
  ['Surgery and recovery', 'Surgery and recovery', 'Operație și recuperare', 'Cirugía y recuperación'],
  ['Body image', 'Body image', 'Imagine corporală', 'Imagen corporal'],
  ['Hair loss', 'Hair loss', 'Căderea părului', 'Caída del cabello'],
  ['Fertility and intimacy', 'Fertility and intimacy', 'Fertilitate și intimitate', 'Fertilidad e intimidad'],
  ['Parenting and family', 'Parenting and family', 'Copii și familie', 'Crianza y familia'],
  ['Work and finances', 'Work and finances', 'Muncă și finanțe', 'Trabajo y finanzas'],
  ['Fear of recurrence', 'Fear of recurrence', 'Teama de recidivă', 'Miedo a la recurrencia'],
  ['Living with metastatic cancer', 'Living with metastatic cancer', 'Viața cu cancer metastatic', 'Vivir con cáncer metastásico'],
  ['Life after treatment', 'Life after treatment', 'Viața după tratament', 'Vida después del tratamiento'],
].map(([value, en, ro, es]) => ({value, en, ro, es}));

const AGE: Option[] = ['18-24', '25-34', '35-44', '45-54', '55-64', '65+'].map((value) => ({value, en: value, ro: value, es: value}));
AGE.push({value: 'prefer-not', en: 'Prefer not to say', ro: 'Prefer să nu spun', es: 'Prefiero no decirlo'});

const GENDER: Option[] = [
  {value: 'woman', en: 'Woman', ro: 'Femeie', es: 'Mujer'},
  {value: 'man', en: 'Man', ro: 'Bărbat', es: 'Hombre'},
  {value: 'nonbinary', en: 'Non-binary', ro: 'Non-binar', es: 'No binario'},
  {value: 'self-described', en: 'I describe myself differently', ro: 'Mă descriu altfel', es: 'Me describo de otra forma'},
  {value: 'prefer-not', en: 'Prefer not to say', ro: 'Prefer să nu spun', es: 'Prefiero no decirlo'},
];

const PHASE: Option[] = [
  {value: 'newly-diagnosed', en: 'Newly diagnosed', ro: 'Diagnostic recent', es: 'Diagnóstico reciente'},
  {value: 'in-treatment', en: 'In treatment', ro: 'În tratament', es: 'En tratamiento'},
  {value: 'post-treatment', en: 'After treatment', ro: 'După tratament', es: 'Después del tratamiento'},
  {value: 'recurrence', en: 'Recurrence', ro: 'Recidivă', es: 'Recurrencia'},
  {value: 'metastatic', en: 'Living with metastatic cancer', ro: 'Cancer metastatic', es: 'Cáncer metastásico'},
];

const MENTOR: Option[] = [
  {value: 'no-preference', en: 'No preference', ro: 'Fără preferință', es: 'Sin preferencia'},
  ...GENDER.filter((item) => ['woman', 'man', 'nonbinary'].includes(item.value)),
];

const AVAILABILITY: AvailabilityOption[] = [
  {value: 'weekday-morning', en: 'Weekday mornings', ro: 'Dimineți în timpul săptămânii', es: 'Mañanas entre semana', keys: ['mon-morning', 'tue-morning', 'wed-morning', 'thu-morning', 'fri-morning']},
  {value: 'weekday-afternoon', en: 'Weekday afternoons', ro: 'După-amiezi în timpul săptămânii', es: 'Tardes entre semana', keys: ['mon-afternoon', 'tue-afternoon', 'wed-afternoon', 'thu-afternoon', 'fri-afternoon']},
  {value: 'weekday-evening', en: 'Weekday evenings', ro: 'Seri în timpul săptămânii', es: 'Noches entre semana', keys: ['mon-evening', 'tue-evening', 'wed-evening', 'thu-evening', 'fri-evening']},
  {value: 'sat-morning', en: 'Saturday morning', ro: 'Sâmbătă dimineața', es: 'Sábado por la mañana', keys: ['sat-morning']},
  {value: 'sat-afternoon', en: 'Saturday afternoon', ro: 'Sâmbătă după-amiaza', es: 'Sábado por la tarde', keys: ['sat-afternoon']},
  {value: 'sat-evening', en: 'Saturday evening', ro: 'Sâmbătă seara', es: 'Sábado por la noche', keys: ['sat-evening']},
  {value: 'sun-morning', en: 'Sunday morning', ro: 'Duminică dimineața', es: 'Domingo por la mañana', keys: ['sun-morning']},
  {value: 'sun-afternoon', en: 'Sunday afternoon', ro: 'Duminică după-amiaza', es: 'Domingo por la tarde', keys: ['sun-afternoon']},
  {value: 'sun-evening', en: 'Sunday evening', ro: 'Duminică seara', es: 'Domingo por la noche', keys: ['sun-evening']},
];

function label(option: Option, locale: Locale) {
  return option[locale];
}

function Multi({name, options, locale}: {name: string; options: Option[]; locale: Locale}) {
  return (
    <div className="grid gap-2 sm:grid-cols-2">
      {options.map((option) => (
        <label key={option.value} className="flex cursor-pointer items-start gap-3 rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm font-semibold text-neutral-700 hover:border-indigo-300 hover:bg-indigo-50">
          <input type="checkbox" name={name} value={option.value} className="mt-0.5 h-4 w-4 accent-indigo-600" />
          {label(option, locale)}
        </label>
      ))}
    </div>
  );
}

function Field({children}: {children: React.ReactNode}) {
  return <label className="space-y-2 text-sm font-bold text-neutral-700">{children}</label>;
}

export default function ConnectApplication() {
  const rawLocale = useLocale();
  const locale: Locale = rawLocale === 'ro' || rawLocale === 'es' ? rawLocale : 'en';
  const text = COPY[locale];
  const [role, setRole] = useState<Role>();
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const timezone = useMemo(() => Intl.DateTimeFormat().resolvedOptions().timeZone || 'Europe/Bucharest', []);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!role) return;
    const form = event.currentTarget;
    const data = new FormData(form);
    const languages = data.getAll('languages').map(String);
    const treatments = data.getAll('treatments').map(String);
    const topics = data.getAll('topics').map(String);
    const communicationMethods = data.getAll('communicationMethods').map(String);
    const availability = [...new Set(data.getAll('availability').flatMap((value) => AVAILABILITY.find((item) => item.value === String(value))?.keys || []))];

    if (!languages.length || !treatments.length || !topics.length || !communicationMethods.length || !availability.length) {
      setStatus('error');
      setMessage(text.formError);
      return;
    }

    setStatus('submitting');
    setMessage('');
    try {
      const response = await fetch('/api/connect/apply', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          role, locale, timezone,
          firstName: data.get('firstName'), email: data.get('email'), country: data.get('country'),
          ageRange: data.get('ageRange'), gender: data.get('gender'), languages,
          cancerType: data.get('cancerType'), cancerSubtype: data.get('cancerSubtype'), phase: data.get('phase'),
          treatments, topics, communicationMethods, availability,
          shortIntro: data.get('shortIntro'), maxConnections: data.get('maxConnections'), mentorGenderPreference: data.get('mentorGenderPreference'),
          consent: {
            adultConfirmed: data.has('consentRules'),
            healthDataMatching: data.has('consentHealth'),
            automatedMatching: data.has('consentAutomated'),
            limitedProfileSharing: data.has('consentAutomated'),
            mutualContactSharing: data.has('consentContact'),
            automatedMeetingScheduling: data.has('consentMeeting'),
            safetyAndReporting: data.has('consentSafety'),
            programRules: data.has('consentRules'),
          },
        }),
      });
      const result = await response.json().catch(() => ({})) as {reference?: string; error?: string};
      if (!response.ok) throw new Error(result.error || text.serverError);
      setMessage(result.reference || '');
      setStatus('success');
      form.reset();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : text.serverError);
      setStatus('error');
    }
  }

  return (
    <main className="min-h-screen bg-[#faf9ff] pt-20">
      <section className="bg-gradient-to-br from-indigo-950 via-indigo-800 to-purple-700 py-20 text-white md:py-28">
        <div className="container mx-auto px-4 text-center">
          <HeartHandshake className="mx-auto h-16 w-16 rounded-3xl bg-white/15 p-3 ring-1 ring-white/25" />
          <p className="mt-6 text-sm font-black uppercase tracking-[0.22em] text-indigo-200">TCW Connect</p>
          <h1 className="mx-auto mt-4 max-w-4xl text-4xl font-black leading-tight md:text-7xl">{text.title}</h1>
          <p className="mx-auto mt-6 max-w-3xl text-lg leading-relaxed text-indigo-100 md:text-xl">{text.subtitle}</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3 text-sm font-bold">
            {['18+', 'Private', 'Mutual consent', 'Google Meet'].map((item) => <span key={item} className="rounded-full bg-white/10 px-4 py-2">{item}</span>)}
          </div>
        </div>
      </section>

      <div className="container mx-auto max-w-6xl px-4 py-14 md:py-20">
        <section className="mb-14">
          <h2 className="text-center text-3xl font-black text-neutral-900">{text.how}</h2>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {text.steps.map(([title, description], index) => (
              <article key={title} className="rounded-3xl border border-indigo-100 bg-white p-6 shadow-sm">
                <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-600 font-black text-white">{index + 1}</span>
                <h3 className="mt-4 text-lg font-black text-neutral-900">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-neutral-600">{description}</p>
              </article>
            ))}
          </div>
        </section>

        {!role && (
          <section className="mx-auto max-w-4xl">
            <h2 className="text-center text-3xl font-black text-neutral-900">{text.choose}</h2>
            <div className="mt-8 grid gap-6 md:grid-cols-2">
              {([
                ['survivor', text.survivor, text.survivorText, UsersRound, 'purple'],
                ['warrior', text.warrior, text.warriorText, HeartHandshake, 'indigo'],
              ] as const).map(([value, title, description, Icon, tone]) => (
                <button key={value} type="button" onClick={() => setRole(value)} className="group rounded-[2rem] border-2 border-transparent bg-white p-8 text-left shadow-lg transition hover:-translate-y-1 hover:border-indigo-300 hover:shadow-xl">
                  <span className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-${tone}-100 text-${tone}-700`}><Icon className="h-7 w-7" /></span>
                  <h3 className="mt-6 text-2xl font-black text-neutral-900">{title}</h3>
                  <p className="mt-3 leading-relaxed text-neutral-600">{description}</p>
                  <span className="mt-6 inline-flex items-center gap-2 font-black text-indigo-700">{text.submit}<ArrowRight className="h-4 w-4" /></span>
                </button>
              ))}
            </div>
          </section>
        )}

        {role && status !== 'success' && (
          <section className="mx-auto max-w-4xl rounded-[2rem] border border-indigo-100 bg-white p-5 shadow-xl md:p-10">
            <div className="mb-8 flex flex-col gap-4 border-b border-neutral-100 pb-8 sm:flex-row sm:justify-between">
              <div><p className="text-xs font-black uppercase tracking-[0.18em] text-indigo-600">{role === 'survivor' ? text.survivor : text.warrior}</p><h2 className="mt-2 text-3xl font-black text-neutral-900">{text.formTitle}</h2><p className="mt-2 text-neutral-600">{text.formIntro}</p></div>
              <button type="button" onClick={() => {setRole(undefined); setStatus('idle'); setMessage('');}} className="self-start rounded-full border border-neutral-200 px-4 py-2 text-sm font-bold text-neutral-600">{text.change}</button>
            </div>

            <form onSubmit={submit} className="space-y-10">
              <fieldset className="space-y-5"><legend className="text-xl font-black text-neutral-900">{text.about}</legend>
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field><span>{text.firstName}</span><input name="firstName" required maxLength={60} className="w-full rounded-xl border border-neutral-300 px-4 py-3" /></Field>
                  <Field><span>{text.email}</span><input name="email" type="email" required maxLength={254} className="w-full rounded-xl border border-neutral-300 px-4 py-3" /></Field>
                  <Field><span>{text.country}</span><input name="country" required maxLength={80} className="w-full rounded-xl border border-neutral-300 px-4 py-3" /></Field>
                  <Field><span>{text.age}</span><select name="ageRange" required defaultValue="" className="w-full rounded-xl border border-neutral-300 bg-white px-4 py-3"><option value="" disabled>—</option>{AGE.map((o) => <option key={o.value} value={o.value}>{label(o, locale)}</option>)}</select></Field>
                  <Field><span>{text.gender}</span><select name="gender" required defaultValue="" className="w-full rounded-xl border border-neutral-300 bg-white px-4 py-3"><option value="" disabled>—</option>{GENDER.map((o) => <option key={o.value} value={o.value}>{label(o, locale)}</option>)}</select></Field>
                </div>
                <div><p className="mb-3 text-sm font-bold text-neutral-700">{text.languages}</p><Multi name="languages" options={LANGUAGES} locale={locale} /></div>
              </fieldset>

              <fieldset className="space-y-5 border-t border-neutral-100 pt-8"><legend className="text-xl font-black text-neutral-900">{text.experience}</legend>
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field><span>{text.cancer}</span><select name="cancerType" required defaultValue="" className="w-full rounded-xl border border-neutral-300 bg-white px-4 py-3"><option value="" disabled>—</option>{CANCERS.map((o) => <option key={o.value} value={o.value}>{label(o, locale)}</option>)}</select></Field>
                  <Field><span>{text.subtype}</span><input name="cancerSubtype" maxLength={100} className="w-full rounded-xl border border-neutral-300 px-4 py-3" /></Field>
                  <Field><span>{text.phase}</span><select name="phase" required defaultValue="" className="w-full rounded-xl border border-neutral-300 bg-white px-4 py-3"><option value="" disabled>—</option>{PHASE.map((o) => <option key={o.value} value={o.value}>{label(o, locale)}</option>)}</select></Field>
                </div>
                <div><p className="mb-3 text-sm font-bold text-neutral-700">{text.treatments}</p><Multi name="treatments" options={TREATMENTS} locale={locale} /></div>
              </fieldset>

              <fieldset className="space-y-5 border-t border-neutral-100 pt-8"><legend className="text-xl font-black text-neutral-900">{text.support}</legend>
                <div><p className="mb-3 text-sm font-bold text-neutral-700">{text.topics}</p><Multi name="topics" options={TOPICS} locale={locale} /></div>
                <Field><span>{text.intro}</span><textarea name="shortIntro" rows={4} maxLength={500} placeholder={text.introPlaceholder} className="w-full rounded-xl border border-neutral-300 px-4 py-3" /></Field>
                {role === 'survivor' ? <Field><span>{text.capacity}</span><select name="maxConnections" defaultValue="1" className="w-full rounded-xl border border-neutral-300 bg-white px-4 py-3"><option value="1">1</option><option value="2">2</option><option value="3">3</option></select></Field> : <Field><span>{text.mentorPreference}</span><select name="mentorGenderPreference" defaultValue="no-preference" className="w-full rounded-xl border border-neutral-300 bg-white px-4 py-3">{MENTOR.map((o) => <option key={o.value} value={o.value}>{label(o, locale)}</option>)}</select></Field>}
              </fieldset>

              <fieldset className="space-y-5 border-t border-neutral-100 pt-8"><legend className="text-xl font-black text-neutral-900">{text.availability}</legend>
                <div><p className="mb-3 text-sm font-bold text-neutral-700">{text.communication}</p><div className="grid gap-3 sm:grid-cols-2"><label className="flex items-center gap-3 rounded-xl border border-indigo-200 bg-indigo-50 px-4 py-3 font-bold"><input type="checkbox" name="communicationMethods" value="google-meet" defaultChecked className="h-4 w-4 accent-indigo-600" /><Video className="h-5 w-5" />Google Meet</label><label className="flex items-center gap-3 rounded-xl border border-neutral-200 px-4 py-3 font-bold"><input type="checkbox" name="communicationMethods" value="email" className="h-4 w-4 accent-indigo-600" />Email</label></div></div>
                <div><p className="text-sm font-bold text-neutral-700">{text.availabilityHelp}</p><p className="my-3 rounded-xl bg-neutral-50 px-4 py-3 text-sm">{text.timezone}: <strong>{timezone}</strong></p><div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">{AVAILABILITY.map((o) => <label key={o.value} className="flex items-center gap-3 rounded-xl border border-neutral-200 px-4 py-3 text-sm font-semibold"><input type="checkbox" name="availability" value={o.value} className="h-4 w-4 accent-indigo-600" />{label(o, locale)}</label>)}</div></div>
              </fieldset>

              <fieldset className="space-y-3 border-t border-neutral-100 pt-8"><legend className="text-xl font-black text-neutral-900">{text.consent}</legend>
                {([
                  ['consentHealth', text.consentHealth], ['consentAutomated', text.consentAutomated], ['consentContact', text.consentContact], ['consentMeeting', text.consentMeeting], ['consentSafety', text.consentSafety], ['consentRules', text.consentRules],
                ] as const).map(([name, wording]) => <label key={name} className="flex items-start gap-3 rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-4 text-sm leading-relaxed text-neutral-700"><input type="checkbox" name={name} required className="mt-1 h-4 w-4 shrink-0 accent-indigo-600" />{wording}</label>)}
              </fieldset>

              {status === 'error' && <p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-700">{message || text.serverError}</p>}
              <button type="submit" disabled={status === 'submitting'} className="flex w-full items-center justify-center gap-3 rounded-2xl bg-indigo-700 px-6 py-4 text-lg font-black text-white shadow-lg hover:bg-indigo-800 disabled:opacity-60">{status === 'submitting' ? <LoaderCircle className="h-5 w-5 animate-spin" /> : <Sparkles className="h-5 w-5" />}{status === 'submitting' ? text.submitting : text.submit}</button>
              <div className="flex flex-col items-center justify-between gap-4 rounded-2xl bg-indigo-50 px-5 py-4 text-sm text-indigo-950 sm:flex-row"><span className="flex items-start gap-2"><ShieldCheck className="mt-0.5 h-5 w-5 shrink-0" />{text.privacy}</span><Link href={localizedPath(locale, 'peerPolicy')} className="shrink-0 font-black underline underline-offset-4">{text.policy}</Link></div>
            </form>
          </section>
        )}

        {status === 'success' && (
          <section className="mx-auto max-w-2xl rounded-[2rem] border border-emerald-200 bg-white p-10 text-center shadow-xl"><CheckCircle2 className="mx-auto h-16 w-16 rounded-full bg-emerald-100 p-3 text-emerald-700" /><h2 className="mt-6 text-3xl font-black text-neutral-900">{text.successTitle}</h2><p className="mx-auto mt-4 max-w-xl leading-relaxed text-neutral-600">{role === 'survivor' ? text.successMentorText : text.successText}</p>{message && <p className="mt-5 rounded-xl bg-neutral-50 px-4 py-3 font-black text-neutral-700">{text.reference}: {message}</p>}</section>
        )}
      </div>
    </main>
  );
}
