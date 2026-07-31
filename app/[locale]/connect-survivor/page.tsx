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

type LocalizedOption = {
  value: string;
  en: string;
  ro: string;
  es: string;
};

const COPY = {
  en: {
    eyebrow: 'TCW Connect',
    title: 'Meet someone who truly understands.',
    subtitle:
      'TCW automatically matches adults living with cancer with survivors who have relevant lived experience, then schedules a private Google Meet after both people agree.',
    survivorTitle: 'I am a survivor',
    survivorText: 'I want to support a warrior through a cancer experience I know personally.',
    warriorTitle: 'I am living with cancer',
    warriorText: 'I want to speak with a survivor who has faced something similar.',
    chooseRole: 'Choose how you want to join',
    changeRole: 'Change selection',
    howTitle: 'How it works',
    steps: [
      ['Create a private profile', 'Only the information needed for matching is collected.'],
      ['Receive a compatible match', 'Both people see a limited profile and choose whether to connect.'],
      ['Meet safely', 'TCW schedules a private Google Meet from your shared availability.'],
    ],
    formTitle: 'Create your private TCW Connect profile',
    formIntro: 'No medical records, surname, phone number or public profile are required.',
    personal: 'About you',
    experience: 'Your cancer experience',
    support: 'What would make this connection useful?',
    availability: 'Communication and availability',
    consent: 'Consent and program rules',
    firstName: 'First name or chosen name',
    email: 'Email',
    country: 'Country',
    age: 'Age range',
    gender: 'Gender',
    languages: 'Languages you can comfortably use',
    cancerType: 'Cancer type',
    subtype: 'Subtype, if relevant',
    phase: 'Current or most relevant experience',
    treatments: 'Treatments or procedures you have experienced',
    topics: 'Topics you would like to discuss',
    intro: 'A short introduction, optional',
    introPlaceholder: 'A few sentences about what support you can offer or hope to receive.',
    maxConnections: 'How many warriors can you support at one time?',
    mentorPreference: 'Preferred survivor gender',
    communication: 'Preferred communication',
    availabilityHelp: 'Choose every time window that usually works for you. TCW uses these to find the first shared 45-minute slot.',
    timezone: 'Detected time zone',
    consentHealth: 'I explicitly consent to TCW processing the cancer and treatment information I provide for peer-support matching.',
    consentAutomated: 'I consent to automated matching, limited profile sharing and automated emails.',
    consentContact: 'I consent to my email being shared with the matched person only after we both accept.',
    consentMeeting: 'I consent to TCW automatically scheduling a private Google Meet from our shared availability.',
    consentRules: 'I am 18 or older and agree to the peer-support rules. I understand this is not medical care, therapy or an emergency service.',
    submit: 'Join TCW Connect',
    submitting: 'Creating your private profile…',
    successTitle: 'Your profile is active.',
    successText: 'Check your email for your private TCW Connect link. The system can now begin matching you automatically.',
    reference: 'Reference',
    error: 'Please complete every required field and choose at least one option in each section.',
    serverError: 'We could not create the profile. Please check the form and try again.',
    policy: 'Read the peer-support policy',
    privacyNote: 'Your health information is encrypted and is never displayed in a public directory.',
  },
  ro: {
    eyebrow: 'TCW Connect',
    title: 'Vorbește cu cineva care înțelege cu adevărat.',
    subtitle:
      'TCW conectează automat adulții care trăiesc cu cancer cu supraviețuitori care au o experiență relevantă, apoi programează un Google Meet privat după ce ambele persoane acceptă.',
    survivorTitle: 'Sunt supraviețuitor',
    survivorText: 'Vreau să sprijin un luptător printr-o experiență oncologică pe care o cunosc personal.',
    warriorTitle: 'Trăiesc cu cancer',
    warriorText: 'Vreau să vorbesc cu un supraviețuitor care a trecut prin ceva asemănător.',
    chooseRole: 'Alege cum dorești să participi',
    changeRole: 'Schimbă selecția',
    howTitle: 'Cum funcționează',
    steps: [
      ['Creezi un profil privat', 'Colectăm doar informațiile necesare pentru potrivire.'],
      ['Primești o potrivire compatibilă', 'Ambele persoane văd un profil limitat și aleg dacă doresc conexiunea.'],
      ['Vă întâlniți în siguranță', 'TCW programează un Google Meet privat din disponibilitatea comună.'],
    ],
    formTitle: 'Creează profilul tău privat TCW Connect',
    formIntro: 'Nu cerem documente medicale, nume de familie, număr de telefon sau profil public.',
    personal: 'Despre tine',
    experience: 'Experiența oncologică',
    support: 'Ce ar face această conexiune utilă?',
    availability: 'Comunicare și disponibilitate',
    consent: 'Consimțământ și reguli',
    firstName: 'Prenume sau numele ales',
    email: 'Email',
    country: 'Țara',
    age: 'Grupa de vârstă',
    gender: 'Gen',
    languages: 'Limbile în care poți comunica confortabil',
    cancerType: 'Tipul de cancer',
    subtype: 'Subtipul, dacă este relevant',
    phase: 'Experiența actuală sau cea mai relevantă',
    treatments: 'Tratamente sau proceduri prin care ai trecut',
    topics: 'Subiectele despre care ai dori să vorbiți',
    intro: 'Scurtă prezentare, opțional',
    introPlaceholder: 'Câteva propoziții despre sprijinul pe care îl poți oferi sau pe care speri să îl primești.',
    maxConnections: 'Câți luptători poți sprijini în același timp?',
    mentorPreference: 'Genul preferat al supraviețuitorului',
    communication: 'Metoda de comunicare preferată',
    availabilityHelp: 'Alege toate intervalele care îți sunt de obicei potrivite. TCW caută primul interval comun de 45 de minute.',
    timezone: 'Fus orar detectat',
    consentHealth: 'Consimt explicit ca TCW să prelucreze informațiile despre cancer și tratament pentru potrivirea în program.',
    consentAutomated: 'Consimt la potrivirea automată, afișarea profilului limitat și emailurile automate.',
    consentContact: 'Consimt ca adresa mea de email să fie transmisă persoanei potrivite numai după ce acceptăm amândoi.',
    consentMeeting: 'Consimt ca TCW să programeze automat un Google Meet privat din disponibilitatea noastră comună.',
    consentRules: 'Am cel puțin 18 ani și accept regulile programului. Înțeleg că acesta nu este serviciu medical, terapie sau serviciu de urgență.',
    submit: 'Înscrie-te în TCW Connect',
    submitting: 'Creăm profilul tău privat…',
    successTitle: 'Profilul tău este activ.',
    successText: 'Verifică emailul pentru linkul privat TCW Connect. Sistemul poate începe acum potrivirea automată.',
    reference: 'Referință',
    error: 'Completează toate câmpurile obligatorii și alege cel puțin o opțiune în fiecare secțiune.',
    serverError: 'Profilul nu a putut fi creat. Verifică formularul și încearcă din nou.',
    policy: 'Citește politica de sprijin între persoane',
    privacyNote: 'Informațiile despre sănătate sunt criptate și nu apar niciodată într-un director public.',
  },
  es: {
    eyebrow: 'TCW Connect',
    title: 'Habla con alguien que realmente lo entiende.',
    subtitle:
      'TCW conecta automáticamente a adultos que viven con cáncer con supervivientes con experiencia relevante y programa un Google Meet privado después de que ambas personas acepten.',
    survivorTitle: 'Soy superviviente',
    survivorText: 'Quiero apoyar a una persona en una experiencia de cáncer que conozco personalmente.',
    warriorTitle: 'Vivo con cáncer',
    warriorText: 'Quiero hablar con un superviviente que haya pasado por algo parecido.',
    chooseRole: 'Elige cómo quieres participar',
    changeRole: 'Cambiar selección',
    howTitle: 'Cómo funciona',
    steps: [
      ['Crea un perfil privado', 'Solo recogemos la información necesaria para encontrar una coincidencia.'],
      ['Recibe una coincidencia compatible', 'Ambas personas ven un perfil limitado y deciden si desean conectar.'],
      ['Reuníos de forma segura', 'TCW programa un Google Meet privado según vuestra disponibilidad común.'],
    ],
    formTitle: 'Crea tu perfil privado de TCW Connect',
    formIntro: 'No pedimos historial médico, apellido, teléfono ni un perfil público.',
    personal: 'Sobre ti',
    experience: 'Tu experiencia con el cáncer',
    support: '¿Qué haría útil esta conexión?',
    availability: 'Comunicación y disponibilidad',
    consent: 'Consentimiento y reglas',
    firstName: 'Nombre o nombre elegido',
    email: 'Correo electrónico',
    country: 'País',
    age: 'Rango de edad',
    gender: 'Género',
    languages: 'Idiomas que puedes usar cómodamente',
    cancerType: 'Tipo de cáncer',
    subtype: 'Subtipo, si es relevante',
    phase: 'Experiencia actual o más relevante',
    treatments: 'Tratamientos o procedimientos que has vivido',
    topics: 'Temas que te gustaría conversar',
    intro: 'Presentación breve, opcional',
    introPlaceholder: 'Unas frases sobre el apoyo que puedes ofrecer o que esperas recibir.',
    maxConnections: '¿A cuántas personas puedes apoyar al mismo tiempo?',
    mentorPreference: 'Género preferido del superviviente',
    communication: 'Comunicación preferida',
    availabilityHelp: 'Elige todos los horarios que normalmente te sirven. TCW buscará el primer intervalo común de 45 minutos.',
    timezone: 'Zona horaria detectada',
    consentHealth: 'Doy mi consentimiento explícito para que TCW trate la información sobre cáncer y tratamiento para encontrar apoyo compatible.',
    consentAutomated: 'Acepto la coincidencia automática, el perfil limitado y los correos automáticos.',
    consentContact: 'Acepto que mi correo se comparta con la persona asignada solo después de que ambos aceptemos.',
    consentMeeting: 'Acepto que TCW programe automáticamente un Google Meet privado según nuestra disponibilidad común.',
    consentRules: 'Tengo 18 años o más y acepto las reglas. Entiendo que no es atención médica, terapia ni un servicio de emergencia.',
    submit: 'Unirme a TCW Connect',
    submitting: 'Creando tu perfil privado…',
    successTitle: 'Tu perfil está activo.',
    successText: 'Revisa tu correo para encontrar tu enlace privado de TCW Connect. El sistema ya puede comenzar la búsqueda automática.',
    reference: 'Referencia',
    error: 'Completa todos los campos obligatorios y elige al menos una opción en cada sección.',
    serverError: 'No pudimos crear el perfil. Revisa el formulario e inténtalo de nuevo.',
    policy: 'Leer la política de apoyo entre pares',
    privacyNote: 'Tu información de salud está cifrada y nunca aparece en un directorio público.',
  },
} as const;

const LANGUAGES: LocalizedOption[] = [
  {value: 'English', en: 'English', ro: 'Engleză', es: 'Inglés'},
  {value: 'Romanian', en: 'Romanian', ro: 'Română', es: 'Rumano'},
  {value: 'Spanish', en: 'Spanish', ro: 'Spaniolă', es: 'Español'},
  {value: 'Italian', en: 'Italian', ro: 'Italiană', es: 'Italiano'},
  {value: 'French', en: 'French', ro: 'Franceză', es: 'Francés'},
  {value: 'Other', en: 'Other', ro: 'Altă limbă', es: 'Otro'},
];

const CANCERS: LocalizedOption[] = [
  {value: 'Breast cancer', en: 'Breast cancer', ro: 'Cancer de sân', es: 'Cáncer de mama'},
  {value: 'Colorectal cancer', en: 'Colorectal cancer', ro: 'Cancer colorectal', es: 'Cáncer colorrectal'},
  {value: 'Lung cancer', en: 'Lung cancer', ro: 'Cancer pulmonar', es: 'Cáncer de pulmón'},
  {value: 'Prostate cancer', en: 'Prostate cancer', ro: 'Cancer de prostată', es: 'Cáncer de próstata'},
  {value: 'Ovarian cancer', en: 'Ovarian cancer', ro: 'Cancer ovarian', es: 'Cáncer de ovario'},
  {value: 'Cervical cancer', en: 'Cervical cancer', ro: 'Cancer de col uterin', es: 'Cáncer de cuello uterino'},
  {value: 'Uterine cancer', en: 'Uterine cancer', ro: 'Cancer uterin', es: 'Cáncer de útero'},
  {value: 'Pancreatic cancer', en: 'Pancreatic cancer', ro: 'Cancer pancreatic', es: 'Cáncer de páncreas'},
  {value: 'Liver cancer', en: 'Liver cancer', ro: 'Cancer hepatic', es: 'Cáncer de hígado'},
  {value: 'Kidney cancer', en: 'Kidney cancer', ro: 'Cancer renal', es: 'Cáncer de riñón'},
  {value: 'Bladder cancer', en: 'Bladder cancer', ro: 'Cancer de vezică', es: 'Cáncer de vejiga'},
  {value: 'Skin cancer / melanoma', en: 'Skin cancer / melanoma', ro: 'Cancer de piele / melanom', es: 'Cáncer de piel / melanoma'},
  {value: 'Head and neck cancer', en: 'Head and neck cancer', ro: 'Cancer de cap și gât', es: 'Cáncer de cabeza y cuello'},
  {value: 'Brain tumour', en: 'Brain tumour', ro: 'Tumoră cerebrală', es: 'Tumor cerebral'},
  {value: 'Leukaemia', en: 'Leukaemia', ro: 'Leucemie', es: 'Leucemia'},
  {value: 'Lymphoma', en: 'Lymphoma', ro: 'Limfom', es: 'Linfoma'},
  {value: 'Myeloma', en: 'Myeloma', ro: 'Mielom', es: 'Mieloma'},
  {value: 'Sarcoma', en: 'Sarcoma', ro: 'Sarcom', es: 'Sarcoma'},
  {value: 'Childhood cancer experience', en: 'Childhood cancer experience', ro: 'Experiență de cancer în copilărie', es: 'Experiencia de cáncer infantil'},
  {value: 'Other cancer', en: 'Other cancer', ro: 'Alt tip de cancer', es: 'Otro tipo de cáncer'},
];

const TREATMENTS: LocalizedOption[] = [
  {value: 'Chemotherapy', en: 'Chemotherapy', ro: 'Chimioterapie', es: 'Quimioterapia'},
  {value: 'Radiotherapy', en: 'Radiotherapy', ro: 'Radioterapie', es: 'Radioterapia'},
  {value: 'Immunotherapy', en: 'Immunotherapy', ro: 'Imunoterapie', es: 'Inmunoterapia'},
  {value: 'Hormone therapy', en: 'Hormone therapy', ro: 'Terapie hormonală', es: 'Terapia hormonal'},
  {value: 'Targeted therapy', en: 'Targeted therapy', ro: 'Terapie țintită', es: 'Terapia dirigida'},
  {value: 'Cancer surgery', en: 'Cancer surgery', ro: 'Intervenție chirurgicală', es: 'Cirugía oncológica'},
  {value: 'Mastectomy', en: 'Mastectomy', ro: 'Mastectomie', es: 'Mastectomía'},
  {value: 'Ostomy', en: 'Ostomy', ro: 'Stomă', es: 'Ostomía'},
  {value: 'Stem cell transplant', en: 'Stem cell transplant', ro: 'Transplant de celule stem', es: 'Trasplante de células madre'},
  {value: 'Long-term medication', en: 'Long-term medication', ro: 'Tratament medicamentos pe termen lung', es: 'Medicación a largo plazo'},
  {value: 'Active monitoring', en: 'Active monitoring', ro: 'Monitorizare activă', es: 'Vigilancia activa'},
  {value: 'Other treatment', en: 'Other treatment', ro: 'Alt tratament', es: 'Otro tratamiento'},
];

const TOPICS: LocalizedOption[] = [
  {value: 'New diagnosis', en: 'New diagnosis', ro: 'Diagnostic nou', es: 'Diagnóstico reciente'},
  {value: 'Treatment decisions', en: 'Treatment decisions', ro: 'Decizii despre tratament', es: 'Decisiones de tratamiento'},
  {value: 'Treatment side effects', en: 'Treatment side effects', ro: 'Efecte adverse', es: 'Efectos secundarios'},
  {value: 'Surgery and recovery', en: 'Surgery and recovery', ro: 'Operație și recuperare', es: 'Cirugía y recuperación'},
  {value: 'Body image', en: 'Body image', ro: 'Imagine corporală', es: 'Imagen corporal'},
  {value: 'Hair loss', en: 'Hair loss', ro: 'Căderea părului', es: 'Caída del cabello'},
  {value: 'Fertility and intimacy', en: 'Fertility and intimacy', ro: 'Fertilitate și intimitate', es: 'Fertilidad e intimidad'},
  {value: 'Parenting and family', en: 'Parenting and family', ro: 'Copii și familie', es: 'Crianza y familia'},
  {value: 'Work and finances', en: 'Work and finances', ro: 'Muncă și finanțe', es: 'Trabajo y finanzas'},
  {value: 'Fear of recurrence', en: 'Fear of recurrence', ro: 'Teama de recidivă', es: 'Miedo a la recurrencia'},
  {value: 'Living with metastatic cancer', en: 'Living with metastatic cancer', ro: 'Viața cu cancer metastatic', es: 'Vivir con cáncer metastásico'},
  {value: 'Life after treatment', en: 'Life after treatment', ro: 'Viața după tratament', es: 'Vida después del tratamiento'},
];

const AVAILABILITY_GROUPS: Array<LocalizedOption & {keys: AvailabilityKey[]}> = [
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

const AGE_OPTIONS: LocalizedOption[] = [
  {value: '18-24', en: '18–24', ro: '18–24', es: '18–24'},
  {value: '25-34', en: '25–34', ro: '25–34', es: '25–34'},
  {value: '35-44', en: '35–44', ro: '35–44', es: '35–44'},
  {value: '45-54', en: '45–54', ro: '45–54', es: '45–54'},
  {value: '55-64', en: '55–64', ro: '55–64', es: '55–64'},
  {value: '65+', en: '65+', ro: '65+', es: '65+'},
  {value: 'prefer-not', en: 'Prefer not to say', ro: 'Prefer să nu spun', es: 'Prefiero no decirlo'},
];

const GENDER_OPTIONS: LocalizedOption[] = [
  {value: 'woman', en: 'Woman', ro: 'Femeie', es: 'Mujer'},
  {value: 'man', en: 'Man', ro: 'Bărbat', es: 'Hombre'},
  {value: 'nonbinary', en: 'Non-binary', ro: 'Non-binar', es: 'No binario'},
  {value: 'self-described', en: 'I describe myself differently', ro: 'Mă descriu altfel', es: 'Me describo de otra forma'},
  {value: 'prefer-not', en: 'Prefer not to say', ro: 'Prefer să nu spun', es: 'Prefiero no decirlo'},
];

const PHASE_OPTIONS: LocalizedOption[] = [
  {value: 'newly-diagnosed', en: 'Newly diagnosed', ro: 'Diagnostic recent', es: 'Diagnóstico reciente'},
  {value: 'in-treatment', en: 'In treatment', ro: 'În tratament', es: 'En tratamiento'},
  {value: 'post-treatment', en: 'After treatment', ro: 'După tratament', es: 'Después del tratamiento'},
  {value: 'recurrence', en: 'Recurrence', ro: 'Recidivă', es: 'Recurrencia'},
  {value: 'metastatic', en: 'Living with metastatic cancer', ro: 'Cancer metastatic', es: 'Cáncer metastásico'},
];

const MENTOR_PREFERENCES: LocalizedOption[] = [
  {value: 'no-preference', en: 'No preference', ro: 'Fără preferință', es: 'Sin preferencia'},
  {value: 'woman', en: 'Woman', ro: 'Femeie', es: 'Mujer'},
  {value: 'man', en: 'Man', ro: 'Bărbat', es: 'Hombre'},
  {value: 'nonbinary', en: 'Non-binary', ro: 'Non-binar', es: 'No binario'},
];

function optionLabel(option: LocalizedOption, locale: Locale): string {
  return option[locale];
}

function CheckboxGroup({
  name,
  options,
  locale,
}: {
  name: string;
  options: LocalizedOption[];
  locale: Locale;
}) {
  return (
    <div className="grid gap-2 sm:grid-cols-2">
      {options.map((option) => (
        <label
          key={option.value}
          className="flex cursor-pointer items-start gap-3 rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm font-semibold text-neutral-700 transition hover:border-indigo-300 hover:bg-indigo-50"
        >
          <input
            type="checkbox"
            name={name}
            value={option.value}
            className="mt-0.5 h-4 w-4 accent-indigo-600"
          />
          <span>{optionLabel(option, locale)}</span>
        </label>
      ))}
    </div>
  );
}

export default function ConnectSurvivorPage() {
  const rawLocale = useLocale();
  const locale: Locale = rawLocale === 'ro' || rawLocale === 'es' ? rawLocale : 'en';
  const text = COPY[locale];
  const [role, setRole] = useState<Role | null>(null);
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const timezone = useMemo(() => (
    typeof Intl !== 'undefined'
      ? Intl.DateTimeFormat().resolvedOptions().timeZone || 'Europe/Bucharest'
      : 'Europe/Bucharest'
  ), []);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!role) return;
    const form = event.currentTarget;
    const data = new FormData(form);
    const languages = data.getAll('languages').map(String);
    const treatments = data.getAll('treatments').map(String);
    const topics = data.getAll('topics').map(String);
    const communicationMethods = data.getAll('communicationMethods').map(String);
    const selectedAvailability = data.getAll('availabilityGroup').map(String);
    const availability = [...new Set(
      selectedAvailability.flatMap((groupId) => (
        AVAILABILITY_GROUPS.find((group) => group.value === groupId)?.keys || []
      )),
    )];

    if (
      languages.length === 0 ||
      treatments.length === 0 ||
      topics.length === 0 ||
      communicationMethods.length === 0 ||
      availability.length === 0
    ) {
      setStatus('error');
      setMessage(text.error);
      return;
    }

    setStatus('submitting');
    setMessage('');
    try {
      const response = await fetch('/api/connect/apply', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          role,
          locale,
          firstName: data.get('firstName'),
          email: data.get('email'),
          country: data.get('country'),
          timezone,
          ageRange: data.get('ageRange'),
          gender: data.get('gender'),
          languages,
          cancerType: data.get('cancerType'),
          cancerSubtype: data.get('cancerSubtype'),
          phase: data.get('phase'),
          treatments,
          topics,
          communicationMethods,
          availability,
          shortIntro: data.get('shortIntro'),
          maxConnections: data.get('maxConnections'),
          mentorGenderPreference: data.get('mentorGenderPreference'),
          consent: {
            adultConfirmed: data.has('adultConfirmed'),
            healthDataMatching: data.has('healthDataMatching'),
            automatedMatching: data.has('automatedMatching'),
            limitedProfileSharing: data.has('limitedProfileSharing'),
            mutualContactSharing: data.has('mutualContactSharing'),
            automatedMeetingScheduling: data.has('automatedMeetingScheduling'),
            programRules: data.has('programRules'),
          },
        }),
      });
      const result = await response.json().catch(() => ({})) as {
        reference?: string;
        error?: string;
      };
      if (!response.ok) throw new Error(result.error || text.serverError);
      setStatus('success');
      setMessage(result.reference || '');
      form.reset();
    } catch (error) {
      setStatus('error');
      setMessage(error instanceof Error ? error.message : text.serverError);
    }
  }

  return (
    <main className="min-h-screen bg-[#faf9ff] pt-20">
      <section className="overflow-hidden bg-gradient-to-br from-indigo-950 via-indigo-800 to-purple-700 py-20 text-white md:py-28">
        <div className="container mx-auto px-4 text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-3xl bg-white/15 shadow-xl ring-1 ring-white/25">
            <HeartHandshake className="h-9 w-9" />
          </div>
          <p className="mb-4 text-sm font-black uppercase tracking-[0.22em] text-indigo-200">{text.eyebrow}</p>
          <h1 className="mx-auto max-w-4xl text-4xl font-black leading-tight md:text-7xl">{text.title}</h1>
          <p className="mx-auto mt-6 max-w-3xl text-lg leading-relaxed text-indigo-100 md:text-xl">{text.subtitle}</p>
          <div className="mx-auto mt-8 flex max-w-3xl flex-wrap justify-center gap-3 text-sm font-bold text-indigo-50">
            <span className="rounded-full bg-white/10 px-4 py-2">18+ only</span>
            <span className="rounded-full bg-white/10 px-4 py-2">Private profiles</span>
            <span className="rounded-full bg-white/10 px-4 py-2">Mutual consent</span>
            <span className="rounded-full bg-white/10 px-4 py-2">Google Meet</span>
          </div>
        </div>
      </section>

      <section className="container mx-auto max-w-6xl px-4 py-14 md:py-20">
        <div className="mb-14">
          <h2 className="text-center text-3xl font-black text-neutral-900">{text.howTitle}</h2>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {text.steps.map(([title, description], index) => (
              <article key={title} className="rounded-3xl border border-indigo-100 bg-white p-6 shadow-sm">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-600 font-black text-white">{index + 1}</div>
                <h3 className="text-lg font-black text-neutral-900">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-neutral-600">{description}</p>
              </article>
            ))}
          </div>
        </div>

        {!role && (
          <section className="mx-auto max-w-4xl">
            <h2 className="text-center text-3xl font-black text-neutral-900">{text.chooseRole}</h2>
            <div className="mt-8 grid gap-6 md:grid-cols-2">
              <button
                type="button"
                onClick={() => setRole('survivor')}
                className="group rounded-[2rem] border-2 border-transparent bg-white p-8 text-left shadow-lg transition hover:-translate-y-1 hover:border-purple-300 hover:shadow-xl"
              >
                <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-100 text-purple-700">
                  <UsersRound className="h-7 w-7" />
                </span>
                <h3 className="mt-6 text-2xl font-black text-neutral-900">{text.survivorTitle}</h3>
                <p className="mt-3 leading-relaxed text-neutral-600">{text.survivorText}</p>
                <span className="mt-6 inline-flex items-center gap-2 font-black text-purple-700">
                  {text.submit} <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                </span>
              </button>
              <button
                type="button"
                onClick={() => setRole('warrior')}
                className="group rounded-[2rem] border-2 border-transparent bg-white p-8 text-left shadow-lg transition hover:-translate-y-1 hover:border-indigo-300 hover:shadow-xl"
              >
                <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-700">
                  <HeartHandshake className="h-7 w-7" />
                </span>
                <h3 className="mt-6 text-2xl font-black text-neutral-900">{text.warriorTitle}</h3>
                <p className="mt-3 leading-relaxed text-neutral-600">{text.warriorText}</p>
                <span className="mt-6 inline-flex items-center gap-2 font-black text-indigo-700">
                  {text.submit} <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                </span>
              </button>
            </div>
          </section>
        )}

        {role && status !== 'success' && (
          <section className="mx-auto max-w-4xl rounded-[2rem] border border-indigo-100 bg-white p-5 shadow-xl md:p-10">
            <div className="mb-8 flex flex-col gap-4 border-b border-neutral-100 pb-8 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.18em] text-indigo-600">
                  {role === 'survivor' ? text.survivorTitle : text.warriorTitle}
                </p>
                <h2 className="mt-2 text-3xl font-black text-neutral-900">{text.formTitle}</h2>
                <p className="mt-2 text-neutral-600">{text.formIntro}</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setRole(null);
                  setStatus('idle');
                  setMessage('');
                }}
                className="shrink-0 rounded-full border border-neutral-200 px-4 py-2 text-sm font-bold text-neutral-600 hover:border-indigo-300 hover:text-indigo-700"
              >
                {text.changeRole}
              </button>
            </div>

            <form onSubmit={submit} className="space-y-10">
              <fieldset className="space-y-5">
                <legend className="text-xl font-black text-neutral-900">{text.personal}</legend>
                <div className="grid gap-5 sm:grid-cols-2">
                  <label className="space-y-2 text-sm font-bold text-neutral-700">
                    <span>{text.firstName}</span>
                    <input name="firstName" required maxLength={60} className="w-full rounded-xl border border-neutral-300 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100" />
                  </label>
                  <label className="space-y-2 text-sm font-bold text-neutral-700">
                    <span>{text.email}</span>
                    <input name="email" type="email" required maxLength={254} className="w-full rounded-xl border border-neutral-300 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100" />
                  </label>
                  <label className="space-y-2 text-sm font-bold text-neutral-700">
                    <span>{text.country}</span>
                    <input name="country" required maxLength={80} className="w-full rounded-xl border border-neutral-300 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100" />
                  </label>
                  <label className="space-y-2 text-sm font-bold text-neutral-700">
                    <span>{text.age}</span>
                    <select name="ageRange" required defaultValue="" className="w-full rounded-xl border border-neutral-300 bg-white px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100">
                      <option value="" disabled>—</option>
                      {AGE_OPTIONS.map((option) => <option key={option.value} value={option.value}>{optionLabel(option, locale)}</option>)}
                    </select>
                  </label>
                  <label className="space-y-2 text-sm font-bold text-neutral-700 sm:col-span-2">
                    <span>{text.gender}</span>
                    <select name="gender" required defaultValue="" className="w-full rounded-xl border border-neutral-300 bg-white px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100">
                      <option value="" disabled>—</option>
                      {GENDER_OPTIONS.map((option) => <option key={option.value} value={option.value}>{optionLabel(option, locale)}</option>)}
                    </select>
                  </label>
                </div>
                <div>
                  <p className="mb-3 text-sm font-bold text-neutral-700">{text.languages}</p>
                  <CheckboxGroup name="languages" options={LANGUAGES} locale={locale} />
                </div>
              </fieldset>

              <fieldset className="space-y-5 border-t border-neutral-100 pt-8">
                <legend className="text-xl font-black text-neutral-900">{text.experience}</legend>
                <div className="grid gap-5 sm:grid-cols-2">
                  <label className="space-y-2 text-sm font-bold text-neutral-700">
                    <span>{text.cancerType}</span>
                    <select name="cancerType" required defaultValue="" className="w-full rounded-xl border border-neutral-300 bg-white px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100">
                      <option value="" disabled>—</option>
                      {CANCERS.map((option) => <option key={option.value} value={option.value}>{optionLabel(option, locale)}</option>)}
                    </select>
                  </label>
                  <label className="space-y-2 text-sm font-bold text-neutral-700">
                    <span>{text.subtype}</span>
                    <input name="cancerSubtype" maxLength={100} className="w-full rounded-xl border border-neutral-300 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100" />
                  </label>
                  <label className="space-y-2 text-sm font-bold text-neutral-700 sm:col-span-2">
                    <span>{text.phase}</span>
                    <select name="phase" required defaultValue="" className="w-full rounded-xl border border-neutral-300 bg-white px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100">
                      <option value="" disabled>—</option>
                      {PHASE_OPTIONS.map((option) => <option key={option.value} value={option.value}>{optionLabel(option, locale)}</option>)}
                    </select>
                  </label>
                </div>
                <div>
                  <p className="mb-3 text-sm font-bold text-neutral-700">{text.treatments}</p>
                  <CheckboxGroup name="treatments" options={TREATMENTS} locale={locale} />
                </div>
              </fieldset>

              <fieldset className="space-y-5 border-t border-neutral-100 pt-8">
                <legend className="text-xl font-black text-neutral-900">{text.support}</legend>
                <div>
                  <p className="mb-3 text-sm font-bold text-neutral-700">{text.topics}</p>
                  <CheckboxGroup name="topics" options={TOPICS} locale={locale} />
                </div>
                <label className="block space-y-2 text-sm font-bold text-neutral-700">
                  <span>{text.intro}</span>
                  <textarea name="shortIntro" maxLength={500} rows={4} placeholder={text.introPlaceholder} className="w-full rounded-xl border border-neutral-300 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100" />
                </label>
                {role === 'survivor' ? (
                  <label className="block space-y-2 text-sm font-bold text-neutral-700">
                    <span>{text.maxConnections}</span>
                    <select name="maxConnections" defaultValue="1" className="w-full rounded-xl border border-neutral-300 bg-white px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100">
                      <option value="1">1</option>
                      <option value="2">2</option>
                      <option value="3">3</option>
                    </select>
                  </label>
                ) : (
                  <label className="block space-y-2 text-sm font-bold text-neutral-700">
                    <span>{text.mentorPreference}</span>
                    <select name="mentorGenderPreference" defaultValue="no-preference" className="w-full rounded-xl border border-neutral-300 bg-white px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100">
                      {MENTOR_PREFERENCES.map((option) => <option key={option.value} value={option.value}>{optionLabel(option, locale)}</option>)}
                    </select>
                  </label>
                )}
              </fieldset>

              <fieldset className="space-y-5 border-t border-neutral-100 pt-8">
                <legend className="text-xl font-black text-neutral-900">{text.availability}</legend>
                <div>
                  <p className="mb-3 text-sm font-bold text-neutral-700">{text.communication}</p>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-indigo-200 bg-indigo-50 px-4 py-3 font-bold text-indigo-900">
                      <input type="checkbox" name="communicationMethods" value="google-meet" defaultChecked className="h-4 w-4 accent-indigo-600" />
                      <Video className="h-5 w-5" /> Google Meet
                    </label>
                    <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-neutral-200 px-4 py-3 font-bold text-neutral-700">
                      <input type="checkbox" name="communicationMethods" value="email" className="h-4 w-4 accent-indigo-600" />
                      Email
                    </label>
                  </div>
                </div>
                <div>
                  <p className="mb-2 text-sm font-bold text-neutral-700">{text.availabilityHelp}</p>
                  <p className="mb-4 rounded-xl bg-neutral-50 px-4 py-3 text-sm text-neutral-600">
                    {text.timezone}: <strong>{timezone}</strong>
                  </p>
                  <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                    {AVAILABILITY_GROUPS.map((group) => (
                      <label key={group.value} className="flex cursor-pointer items-center gap-3 rounded-xl border border-neutral-200 px-4 py-3 text-sm font-semibold text-neutral-700 hover:border-indigo-300 hover:bg-indigo-50">
                        <input type="checkbox" name="availabilityGroup" value={group.value} className="h-4 w-4 accent-indigo-600" />
                        {optionLabel(group, locale)}
                      </label>
                    ))}
                  </div>
                </div>
              </fieldset>

              <fieldset className="space-y-3 border-t border-neutral-100 pt-8">
                <legend className="text-xl font-black text-neutral-900">{text.consent}</legend>
                {[
                  ['healthDataMatching', text.consentHealth],
                  ['automatedMatching', text.consentAutomated],
                  ['limitedProfileSharing', text.consentAutomated],
                  ['mutualContactSharing', text.consentContact],
                  ['automatedMeetingScheduling', text.consentMeeting],
                  ['adultConfirmed', text.consentRules],
                  ['programRules', text.consentRules],
                ].map(([name, label], index) => (
                  <label key={name} className={`${index === 2 || index === 6 ? 'hidden' : 'flex'} cursor-pointer items-start gap-3 rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-4 text-sm leading-relaxed text-neutral-700`}>
                    <input type="checkbox" name={name} required={index !== 2 && index !== 6} defaultChecked={index === 2 || index === 6} className="mt-1 h-4 w-4 shrink-0 accent-indigo-600" />
                    <span>{label}</span>
                  </label>
                ))}
              </fieldset>

              {status === 'error' && (
                <p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-700">{message || text.serverError}</p>
              )}

              <button
                type="submit"
                disabled={status === 'submitting'}
                className="flex w-full items-center justify-center gap-3 rounded-2xl bg-indigo-700 px-6 py-4 text-lg font-black text-white shadow-lg transition hover:bg-indigo-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {status === 'submitting' ? <LoaderCircle className="h-5 w-5 animate-spin" /> : <Sparkles className="h-5 w-5" />}
                {status === 'submitting' ? text.submitting : text.submit}
              </button>

              <div className="flex flex-col items-center justify-between gap-4 rounded-2xl bg-indigo-50 px-5 py-4 text-sm text-indigo-950 sm:flex-row">
                <span className="flex items-start gap-2">
                  <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0" />
                  {text.privacyNote}
                </span>
                <Link href={localizedPath(locale, 'peerPolicy')} className="shrink-0 font-black underline underline-offset-4">
                  {text.policy}
                </Link>
              </div>
            </form>
          </section>
        )}

        {status === 'success' && (
          <section className="mx-auto max-w-2xl rounded-[2rem] border border-emerald-200 bg-white p-10 text-center shadow-xl">
            <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
              <CheckCircle2 className="h-9 w-9" />
            </span>
            <h2 className="mt-6 text-3xl font-black text-neutral-900">{text.successTitle}</h2>
            <p className="mx-auto mt-4 max-w-xl leading-relaxed text-neutral-600">{text.successText}</p>
            {message && <p className="mt-5 rounded-xl bg-neutral-50 px-4 py-3 font-black text-neutral-700">{text.reference}: {message}</p>}
          </section>
        )}
      </section>
    </main>
  );
}
