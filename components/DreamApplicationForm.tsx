'use client';

import { useMemo, useRef, useState } from 'react';
import { useLocale } from 'next-intl';
import { useForm, useWatch, type FieldPath } from 'react-hook-form';
import {
  BadgeCheck,
  Camera,
  Check,
  ChevronLeft,
  ChevronRight,
  CircleAlert,
  FileCheck2,
  FileHeart,
  HeartHandshake,
  LoaderCircle,
  LockKeyhole,
  MailCheck,
  Paperclip,
  ShieldCheck,
  Sparkles,
  Trash2,
  UserRound,
} from 'lucide-react';

import { localizedPath } from '@/lib/routes';
import {
  MAX_DREAM_FILE_BYTES,
  MAX_DREAM_PHOTOS,
  type DreamApplicationInput,
  type DreamApplicationStartPayload,
} from '@/lib/dream-applications/types';

type Locale = DreamApplicationInput['locale'];
type FormValues = DreamApplicationInput & {website: string};

const COPY = {
  en: {
    secureEyebrow: 'Private Dream Support application',
    title: 'Tell us about the dream waiting for you',
    subtitle:
      'A calm, secure space to share who you are, verify eligibility and describe the non-medical wish that would bring you joy.',
    privacyPromise: 'Your documents stay private and are never published.',
    saveTime: 'Allow about 10 minutes. This form cannot be saved as a draft.',
    steps: ['Eligibility', 'About you', 'Diagnosis', 'Your dream', 'Consent'],
    stepLabel: 'Step',
    of: 'of',
    eligibilityTitle: 'Let’s first make sure this program is right for you',
    eligibilityIntro:
      'Dream Support is for adults affected by cancer. The maximum award is €500 and every application is reviewed individually by TCW.',
    confirmsAdult: 'I am at least 18 years old.',
    confirmsSelfApplication: 'I am applying for myself and the information is mine to share.',
    confirmsNonMedical:
      'My request is a non-medical personal wish. I understand TCW does not fund treatment or medication.',
    notGuarantee:
      'Submitting an application does not guarantee approval. TCW must also be able to provide the support lawfully and practically in your country.',
    aboutTitle: 'A little about you',
    aboutIntro: 'We only ask for the contact information needed to review and discuss your application.',
    fullName: 'Full name',
    email: 'Email address',
    phone: 'Phone number',
    city: 'City',
    country: 'Country of residence',
    preferredContact: 'How should we contact you?',
    emailOption: 'Email',
    phoneOption: 'Phone',
    whatsappOption: 'WhatsApp',
    socialProfile: 'Social media profile',
    optional: 'Optional',
    socialHint: 'This does not affect eligibility.',
    diagnosisTitle: 'Diagnosis verification',
    diagnosisIntro:
      'One recent document is enough. Please hide your personal number, exact address and unrelated medical information.',
    diagnosis: 'Cancer diagnosis',
    diagnosisPlaceholder: 'For example: breast cancer',
    cancerStage: 'Stage',
    stagePlaceholder: 'For example: Stage 2B, if known',
    diagnosisDate: 'Approximate diagnosis date',
    futureDiagnosisDate: 'The diagnosis date cannot be in the future.',
    treatmentStatus: 'Current status',
    treatmentOptions: {
      active_treatment: 'Active treatment',
      post_surgery_recovery: 'Post-surgery recovery',
      remission: 'Remission',
      palliative_care: 'Palliative care',
      other: 'Other',
    },
    treatmentStatusOther: 'Please describe your current status',
    medicalFile: 'Diagnosis-verification document',
    medicalFileHelp: 'One PDF, JPG or PNG, no larger than 4 MB.',
    medicalRequired: 'Please select one diagnosis-verification document.',
    identityFile: 'ID or passport',
    identityFileHelp: 'Upload one clear PDF, JPG or PNG of the photo/details page, no larger than 4 MB. You may cover information that is not needed to verify your identity.',
    identityRequired: 'Please select one ID or passport document.',
    fileTooLarge: 'Each file must be smaller than 4 MB.',
    wrongMedicalType: 'Use a PDF, JPG or PNG file.',
    dreamTitle: 'Now tell us about your dream',
    dreamIntro:
      'We want to meet the person beyond the diagnosis and understand the joy this support could create.',
    story: 'Who are you beyond cancer?',
    storyHint: 'Tell us about your life, passions, people and the things that feel like you.',
    dream: 'What is your dream or wish?',
    dreamHint: 'Be specific about the experience, item, hobby or meaningful activity.',
    emotionalImpact: 'What would this dream mean to you emotionally?',
    estimatedCost: 'Estimated total cost',
    estimatedCostHint: 'Include the amount and currency, for example £549 or 2,400 RON.',
    requestedAmountEur: 'Amount requested from TCW in EUR',
    maxGrant: 'Maximum €500',
    supplierLink: 'Supplier, product or booking link',
    differencePlan: 'If the total exceeds €500, how will the difference be covered?',
    publicityTitle: 'Privacy and your choices',
    publicityIntro:
      'Publicity permission is separate and optional. Choosing privacy will never reduce your chance of approval.',
    publicityFullTitle: 'Yes, share my story',
    publicityFull:
      'TCW may use my first name, selected photographs, story and a non-sensitive diagnosis summary for fundraising, impact reporting and awareness.',
    publicityAnonymousTitle: 'Anonymous or limited sharing',
    publicityAnonymous:
      'TCW may share an anonymous version without my full name or a clearly identifiable face.',
    publicityNoneTitle: 'Keep my application private',
    publicityNone:
      'TCW may review my application but may not publish my name, story, diagnosis or photographs.',
    photosTitle: 'Photographs of you',
    photosHelp:
      'Optional. Add up to 3 JPG or PNG photographs. They will only be used according to the choice above.',
    tooManyPhotos: 'Select no more than 3 photographs.',
    wrongPhotoType: 'Photographs must be JPG or PNG.',
    confirmsAccuracy:
      'I confirm that the information and documents provided are authentic and accurate.',
    confirmsProof:
      'If approved, I will use the support only for the agreed wish and provide the required receipts or proof within 3 months.',
    acceptsGrantPolicyPrefix: 'I have read and accept the',
    grantPolicy: 'Grant Policy v3.1',
    acceptsPrivacyPrefix: 'I confirm that I have read the',
    privacyNotice: 'Privacy and Data Protection Notice',
    healthConsent:
      'I explicitly consent to TCW processing my cancer-related information and diagnosis evidence to assess and administer this application. I understand that I may withdraw consent for future processing, although TCW may then be unable to continue my application.',
    retention:
      'Medical evidence and ID documents are restricted to authorised reviewers and kept only as long as needed for assessment, administration or a legal obligation.',
    previous: 'Back',
    next: 'Continue',
    submit: 'Securely submit application',
    submitting: 'Securely uploading',
    uploadProgress: 'Secure upload',
    genericRequired: 'This field is required.',
    moreDetail: 'Please provide a little more detail.',
    validEmail: 'Enter a valid email address.',
    validPhone: 'Enter a valid phone number with 7 to 15 digits.',
    validUrl: 'Enter a complete link beginning with https://',
    amountRange: 'Enter an amount between €1 and €500.',
    submissionError:
      'We could not securely submit the application. Nothing was made public. Please try again.',
    successEyebrow: 'Application received securely',
    successTitle: 'Your dream is now with our team',
    successText:
      'TCW will review the application and contact you if clarification is needed. Please save this private reference:',
    referenceLabel: 'Application reference',
    responseTime: 'We normally review complete applications within 15 calendar days.',
    successPrivacy:
      'Your medical evidence remains private. It is not included in the notification sent to TCW.',
    applyAnother: 'Start another application',
    remove: 'Remove',
    reviewReady: 'One final check',
    reviewReadyText:
      'Before submitting, confirm the declarations below. The medical upload will begin only after you press the secure submission button.',
  },
  ro: {
    secureEyebrow: 'Cerere privată pentru Dream Support',
    title: 'Povestește-ne despre visul care te așteaptă',
    subtitle:
      'Un spațiu calm și sigur în care ne poți spune cine ești, îți poți confirma eligibilitatea și poți descrie dorința non-medicală care ți-ar aduce bucurie.',
    privacyPromise: 'Documentele tale rămân private și nu sunt publicate niciodată.',
    saveTime: 'Rezervă aproximativ 10 minute. Formularul nu poate fi salvat ca ciornă.',
    steps: ['Eligibilitate', 'Despre tine', 'Diagnostic', 'Visul tău', 'Acorduri'],
    stepLabel: 'Pasul',
    of: 'din',
    eligibilityTitle: 'Mai întâi, să verificăm dacă programul ți se potrivește',
    eligibilityIntro:
      'Dream Support este destinat adulților afectați de cancer. Sprijinul maxim este de 500 €, iar fiecare cerere este analizată individual de TCW.',
    confirmsAdult: 'Am cel puțin 18 ani.',
    confirmsSelfApplication: 'Aplic pentru mine, iar informațiile îmi aparțin și le pot furniza.',
    confirmsNonMedical:
      'Dorința mea este una personală, non-medicală. Înțeleg că TCW nu finanțează tratamente sau medicamente.',
    notGuarantee:
      'Trimiterea cererii nu garantează aprobarea. TCW trebuie să poată oferi sprijinul legal și practic în țara ta.',
    aboutTitle: 'Câteva lucruri despre tine',
    aboutIntro: 'Solicităm doar datele de contact necesare pentru evaluarea și discutarea cererii.',
    fullName: 'Nume complet',
    email: 'Adresă de email',
    phone: 'Număr de telefon',
    city: 'Oraș',
    country: 'Țara de reședință',
    preferredContact: 'Cum preferi să te contactăm?',
    emailOption: 'Email',
    phoneOption: 'Telefon',
    whatsappOption: 'WhatsApp',
    socialProfile: 'Profil social media',
    optional: 'Opțional',
    socialHint: 'Nu influențează eligibilitatea.',
    diagnosisTitle: 'Confirmarea diagnosticului',
    diagnosisIntro:
      'Este suficient un singur document recent. Te rugăm să ascunzi CNP-ul, adresa exactă și informațiile medicale care nu sunt relevante.',
    diagnosis: 'Diagnosticul oncologic',
    diagnosisPlaceholder: 'De exemplu: cancer mamar',
    cancerStage: 'Stadiul',
    stagePlaceholder: 'De exemplu: Stadiul 2B, dacă este cunoscut',
    diagnosisDate: 'Data aproximativă a diagnosticului',
    futureDiagnosisDate: 'Data diagnosticului nu poate fi în viitor.',
    treatmentStatus: 'Statusul actual',
    treatmentOptions: {
      active_treatment: 'În tratament activ',
      post_surgery_recovery: 'În recuperare post-operatorie',
      remission: 'În remisie',
      palliative_care: 'Îngrijire paliativă',
      other: 'Altul',
    },
    treatmentStatusOther: 'Descrie pe scurt statusul actual',
    medicalFile: 'Document care confirmă diagnosticul',
    medicalFileHelp: 'Un singur PDF, JPG sau PNG, de maximum 4 MB.',
    medicalRequired: 'Selectează un document care confirmă diagnosticul.',
    identityFile: 'Carte de identitate sau pașaport',
    identityFileHelp: 'Încarcă un singur PDF, JPG sau PNG clar cu pagina care conține fotografia și datele, de maximum 4 MB. Poți acoperi informațiile care nu sunt necesare pentru verificarea identității.',
    identityRequired: 'Selectează o carte de identitate sau un pașaport.',
    fileTooLarge: 'Fiecare fișier trebuie să fie mai mic de 4 MB.',
    wrongMedicalType: 'Folosește un fișier PDF, JPG sau PNG.',
    dreamTitle: 'Acum povestește-ne despre visul tău',
    dreamIntro:
      'Vrem să cunoaștem omul dincolo de diagnostic și să înțelegem bucuria pe care acest sprijin o poate crea.',
    story: 'Cine ești dincolo de cancer?',
    storyHint: 'Povestește-ne despre viața, pasiunile, oamenii și lucrurile care te reprezintă.',
    dream: 'Care este visul sau dorința ta?',
    dreamHint: 'Descrie concret experiența, obiectul, hobby-ul sau activitatea care contează pentru tine.',
    emotionalImpact: 'Ce ar însemna emoțional pentru tine îndeplinirea acestui vis?',
    estimatedCost: 'Costul total estimat',
    estimatedCostHint: 'Include suma și moneda, de exemplu 2.400 RON sau 549 £.',
    requestedAmountEur: 'Suma solicitată de la TCW, în EUR',
    maxGrant: 'Maximum 500 €',
    supplierLink: 'Link către furnizor, produs sau rezervare',
    differencePlan: 'Dacă totalul depășește 500 €, cum va fi acoperită diferența?',
    publicityTitle: 'Confidențialitatea și alegerile tale',
    publicityIntro:
      'Acordul de publicitate este separat și opțional. Alegerea confidențialității nu îți va reduce niciodată șansa de aprobare.',
    publicityFullTitle: 'Da, povestea mea poate fi distribuită',
    publicityFull:
      'TCW poate folosi prenumele meu, fotografiile selectate, povestea și un rezumat nesensibil al diagnosticului pentru strângerea de fonduri, raportarea impactului și informare publică.',
    publicityAnonymousTitle: 'Distribuire anonimă sau limitată',
    publicityAnonymous:
      'TCW poate publica o versiune anonimă, fără numele meu complet sau o fotografie în care fața este clar identificabilă.',
    publicityNoneTitle: 'Cererea mea rămâne privată',
    publicityNone:
      'TCW poate evalua cererea, dar nu poate publica numele, povestea, diagnosticul sau fotografiile mele.',
    photosTitle: 'Fotografii cu tine',
    photosHelp:
      'Opțional. Poți adăuga maximum 3 fotografii JPG sau PNG. Vor fi folosite numai conform alegerii de mai sus.',
    tooManyPhotos: 'Selectează maximum 3 fotografii.',
    wrongPhotoType: 'Fotografiile trebuie să fie JPG sau PNG.',
    confirmsAccuracy:
      'Confirm că informațiile și documentele furnizate sunt autentice și corecte.',
    confirmsProof:
      'Dacă cererea este aprobată, voi folosi sprijinul numai pentru dorința agreată și voi furniza chitanțele sau dovezile solicitate în maximum 3 luni.',
    acceptsGrantPolicyPrefix: 'Am citit și accept',
    grantPolicy: 'Politica de Grant v3.1',
    acceptsPrivacyPrefix: 'Confirm că am citit',
    privacyNotice: 'Nota de Confidențialitate și Protecția Datelor',
    healthConsent:
      'Îmi exprim consimțământul explicit ca TCW să prelucreze informațiile mele despre cancer și dovada diagnosticului pentru evaluarea și administrarea acestei cereri. Înțeleg că pot retrage consimțământul pentru prelucrările viitoare, însă TCW poate să nu mai poată continua evaluarea.',
    retention:
      'Dovada medicală și documentul de identitate sunt accesibile numai persoanelor autorizate și sunt păstrate doar atât timp cât este necesar pentru evaluare, administrare sau o obligație legală.',
    previous: 'Înapoi',
    next: 'Continuă',
    submit: 'Trimite cererea în siguranță',
    submitting: 'Criptăm și încărcăm în siguranță',
    uploadProgress: 'Încărcare securizată',
    genericRequired: 'Acest câmp este obligatoriu.',
    moreDetail: 'Te rugăm să ne oferi puțin mai multe detalii.',
    validEmail: 'Introdu o adresă de email validă.',
    validPhone: 'Introdu un număr de telefon valid, cu 7 până la 15 cifre.',
    validUrl: 'Introdu un link complet care începe cu https://',
    amountRange: 'Introdu o sumă între 1 € și 500 €.',
    submissionError:
      'Cererea nu a putut fi trimisă în siguranță. Nimic nu a devenit public. Te rugăm să încerci din nou.',
    successEyebrow: 'Cerere primită în siguranță',
    successTitle: 'Visul tău a ajuns la echipa noastră',
    successText:
      'TCW va analiza cererea și te va contacta dacă sunt necesare clarificări. Salvează această referință privată:',
    referenceLabel: 'Referința cererii',
    responseTime: 'În mod normal, analizăm cererile complete în maximum 15 zile calendaristice.',
    successPrivacy:
      'Documentul medical rămâne privat și nu este inclus în notificarea trimisă către TCW.',
    applyAnother: 'Începe o altă cerere',
    remove: 'Elimină',
    reviewReady: 'O ultimă verificare',
    reviewReadyText:
      'Înainte de trimitere, confirmă declarațiile de mai jos. Încărcarea medicală începe numai după apăsarea butonului de trimitere securizată.',
  },
  es: {
    secureEyebrow: 'Solicitud privada de Dream Support',
    title: 'Cuéntanos sobre el sueño que te espera',
    subtitle:
      'Un espacio tranquilo y seguro para compartir quién eres, verificar tu elegibilidad y describir el deseo no médico que te devolvería alegría.',
    privacyPromise: 'Tus documentos permanecen privados y nunca se publican.',
    saveTime: 'Reserva unos 10 minutos. El formulario no puede guardarse como borrador.',
    steps: ['Elegibilidad', 'Sobre ti', 'Diagnóstico', 'Tu sueño', 'Consentimiento'],
    stepLabel: 'Paso',
    of: 'de',
    eligibilityTitle: 'Primero, comprobemos si este programa es adecuado para ti',
    eligibilityIntro:
      'Dream Support está dirigido a adultos afectados por el cáncer. La ayuda máxima es de 500 € y TCW revisa cada solicitud individualmente.',
    confirmsAdult: 'Tengo al menos 18 años.',
    confirmsSelfApplication: 'Solicito la ayuda para mí y tengo derecho a compartir esta información.',
    confirmsNonMedical:
      'Mi solicitud es un deseo personal no médico. Entiendo que TCW no financia tratamientos ni medicamentos.',
    notGuarantee:
      'Presentar una solicitud no garantiza su aprobación. TCW también debe poder proporcionar la ayuda legal y operativamente en tu país.',
    aboutTitle: 'Un poco sobre ti',
    aboutIntro: 'Solo solicitamos los datos de contacto necesarios para revisar y comentar tu solicitud.',
    fullName: 'Nombre completo',
    email: 'Correo electrónico',
    phone: 'Número de teléfono',
    city: 'Ciudad',
    country: 'País de residencia',
    preferredContact: '¿Cómo prefieres que te contactemos?',
    emailOption: 'Correo',
    phoneOption: 'Teléfono',
    whatsappOption: 'WhatsApp',
    socialProfile: 'Perfil de redes sociales',
    optional: 'Opcional',
    socialHint: 'No afecta a la elegibilidad.',
    diagnosisTitle: 'Verificación del diagnóstico',
    diagnosisIntro:
      'Un documento reciente es suficiente. Oculta tu número de identificación, dirección exacta e información médica no relacionada.',
    diagnosis: 'Diagnóstico de cáncer',
    diagnosisPlaceholder: 'Por ejemplo: cáncer de mama',
    cancerStage: 'Estadio',
    stagePlaceholder: 'Por ejemplo: Estadio 2B, si se conoce',
    diagnosisDate: 'Fecha aproximada del diagnóstico',
    futureDiagnosisDate: 'La fecha del diagnóstico no puede estar en el futuro.',
    treatmentStatus: 'Situación actual',
    treatmentOptions: {
      active_treatment: 'Tratamiento activo',
      post_surgery_recovery: 'Recuperación posoperatoria',
      remission: 'Remisión',
      palliative_care: 'Cuidados paliativos',
      other: 'Otra',
    },
    treatmentStatusOther: 'Describe brevemente tu situación actual',
    medicalFile: 'Documento que verifica el diagnóstico',
    medicalFileHelp: 'Un PDF, JPG o PNG, de máximo 4 MB.',
    medicalRequired: 'Selecciona un documento que verifique el diagnóstico.',
    identityFile: 'Documento de identidad o pasaporte',
    identityFileHelp: 'Sube un PDF, JPG o PNG claro de la página con la foto y los datos, de máximo 4 MB. Puedes ocultar la información que no sea necesaria para verificar tu identidad.',
    identityRequired: 'Selecciona un documento de identidad o pasaporte.',
    fileTooLarge: 'Cada archivo debe pesar menos de 4 MB.',
    wrongMedicalType: 'Utiliza un archivo PDF, JPG o PNG.',
    dreamTitle: 'Ahora cuéntanos sobre tu sueño',
    dreamIntro:
      'Queremos conocer a la persona más allá del diagnóstico y comprender la alegría que esta ayuda podría crear.',
    story: '¿Quién eres más allá del cáncer?',
    storyHint: 'Háblanos de tu vida, pasiones, personas y de aquello que te representa.',
    dream: '¿Cuál es tu sueño o deseo?',
    dreamHint: 'Describe claramente la experiencia, objeto, afición o actividad significativa.',
    emotionalImpact: '¿Qué significaría emocionalmente para ti cumplir este sueño?',
    estimatedCost: 'Coste total estimado',
    estimatedCostHint: 'Incluye el importe y la moneda, por ejemplo 549 £ o 2.400 RON.',
    requestedAmountEur: 'Importe solicitado a TCW en EUR',
    maxGrant: 'Máximo 500 €',
    supplierLink: 'Enlace del proveedor, producto o reserva',
    differencePlan: 'Si el total supera 500 €, ¿cómo se cubrirá la diferencia?',
    publicityTitle: 'Privacidad y tus elecciones',
    publicityIntro:
      'El permiso de difusión es separado y opcional. Elegir privacidad nunca reducirá tus posibilidades de aprobación.',
    publicityFullTitle: 'Sí, autorizo compartir mi historia',
    publicityFull:
      'TCW puede utilizar mi nombre de pila, fotografías seleccionadas, historia y un resumen no sensible del diagnóstico para recaudar fondos, informar del impacto y sensibilizar.',
    publicityAnonymousTitle: 'Difusión anónima o limitada',
    publicityAnonymous:
      'TCW puede compartir una versión anónima sin mi nombre completo ni una imagen donde mi rostro sea claramente identificable.',
    publicityNoneTitle: 'Mantener privada mi solicitud',
    publicityNone:
      'TCW puede revisar mi solicitud, pero no publicar mi nombre, historia, diagnóstico ni fotografías.',
    photosTitle: 'Fotografías tuyas',
    photosHelp:
      'Opcional. Añade hasta 3 fotografías JPG o PNG. Solo se utilizarán conforme a la elección anterior.',
    tooManyPhotos: 'Selecciona un máximo de 3 fotografías.',
    wrongPhotoType: 'Las fotografías deben ser JPG o PNG.',
    confirmsAccuracy:
      'Confirmo que la información y los documentos proporcionados son auténticos y correctos.',
    confirmsProof:
      'Si se aprueba, utilizaré la ayuda exclusivamente para el deseo acordado y proporcionaré los recibos o justificantes solicitados en un plazo de 3 meses.',
    acceptsGrantPolicyPrefix: 'He leído y acepto la',
    grantPolicy: 'Política de Ayudas v3.1',
    acceptsPrivacyPrefix: 'Confirmo que he leído el',
    privacyNotice: 'Aviso de Privacidad y Protección de Datos',
    healthConsent:
      'Consiento explícitamente que TCW trate mi información relacionada con el cáncer y la prueba del diagnóstico para evaluar y gestionar esta solicitud. Entiendo que puedo retirar el consentimiento para el tratamiento futuro, aunque TCW podría no poder continuar la solicitud.',
    retention:
      'El justificante médico y el documento de identidad están restringidos a revisores autorizados y se conservan solo mientras sean necesarios para la evaluación, administración o una obligación legal.',
    previous: 'Atrás',
    next: 'Continuar',
    submit: 'Enviar la solicitud de forma segura',
    submitting: 'Cifrando y cargando de forma segura',
    uploadProgress: 'Carga segura',
    genericRequired: 'Este campo es obligatorio.',
    moreDetail: 'Proporciona un poco más de información.',
    validEmail: 'Introduce un correo electrónico válido.',
    validPhone: 'Introduce un número de teléfono válido de 7 a 15 dígitos.',
    validUrl: 'Introduce un enlace completo que comience por https://',
    amountRange: 'Introduce un importe entre 1 € y 500 €.',
    submissionError:
      'No pudimos enviar la solicitud de forma segura. Nada se hizo público. Inténtalo de nuevo.',
    successEyebrow: 'Solicitud recibida de forma segura',
    successTitle: 'Tu sueño ya está con nuestro equipo',
    successText:
      'TCW revisará la solicitud y se pondrá en contacto contigo si necesita aclaraciones. Guarda esta referencia privada:',
    referenceLabel: 'Referencia de la solicitud',
    responseTime: 'Normalmente revisamos las solicitudes completas en un plazo de 15 días naturales.',
    successPrivacy:
      'Tu documento médico permanece privado y no se incluye en la notificación enviada a TCW.',
    applyAnother: 'Iniciar otra solicitud',
    remove: 'Eliminar',
    reviewReady: 'Una última comprobación',
    reviewReadyText:
      'Antes de enviar, confirma las declaraciones siguientes. La carga médica solo comenzará al pulsar el botón de envío seguro.',
  },
} as const;

const STEP_FIELDS: Array<Array<FieldPath<FormValues>>> = [
  ['confirmsAdult', 'confirmsSelfApplication', 'confirmsNonMedical'],
  ['fullName', 'email', 'phone', 'city', 'country', 'preferredContact'],
  ['diagnosis', 'diagnosisDate', 'treatmentStatus', 'treatmentStatusOther'],
  ['story', 'dream', 'emotionalImpact', 'estimatedCost'],
  [
    'publicityChoice',
    'confirmsAccuracy',
    'confirmsProofOfUse',
    'acceptsGrantPolicy',
    'acceptsPrivacyNotice',
    'consentsHealthData',
  ],
];

const INPUT_CLASS =
  'mt-2 w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3.5 text-neutral-900 shadow-sm outline-none transition placeholder:text-neutral-400 focus:border-brand-500 focus:ring-4 focus:ring-brand-100';
const LABEL_CLASS = 'block text-sm font-bold text-neutral-800';

function ErrorText({message}: {message?: string}) {
  if (!message) return null;
  return (
    <p className="mt-2 flex items-center gap-1.5 text-sm font-medium text-red-600" role="alert">
      <CircleAlert className="h-4 w-4" />
      {message}
    </p>
  );
}

function RequiredMark() {
  return <span className="ml-1 text-brand-600" aria-hidden="true">*</span>;
}

function formatBytes(bytes: number) {
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

async function jsonRequest<T>(url: string, body: unknown): Promise<T> {
  const response = await fetch(url, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(body),
  });
  const payload = await response.json() as T & {error?: string};
  if (!response.ok) throw new Error(payload.error || 'Request failed.');
  return payload;
}

export default function DreamApplicationForm() {
  const currentLocale = useLocale();
  const locale: Locale = currentLocale === 'ro' || currentLocale === 'es' ? currentLocale : 'en';
  const c = COPY[locale];
  const formTopRef = useRef<HTMLDivElement>(null);
  const [step, setStep] = useState(0);
  const [medicalFile, setMedicalFile] = useState<File | null>(null);
  const [medicalError, setMedicalError] = useState<string>();
  const [identityFile, setIdentityFile] = useState<File | null>(null);
  const [identityError, setIdentityError] = useState<string>();
  const [photos, setPhotos] = useState<File[]>([]);
  const [photoError, setPhotoError] = useState<string>();
  const [submissionError, setSubmissionError] = useState<string>();
  const [submitting, setSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [successReference, setSuccessReference] = useState<string>();

  const {
    register,
    handleSubmit,
    trigger,
    control,
    formState: {errors},
    reset,
  } = useForm<FormValues>({
    mode: 'onBlur',
    defaultValues: {
      locale,
      fullName: '',
      email: '',
      phone: '',
      city: '',
      country: locale === 'ro' ? 'România' : '',
      socialProfile: '',
      preferredContact: 'email',
      diagnosis: '',
      cancerStage: '',
      diagnosisDate: '',
      treatmentStatus: 'active_treatment',
      treatmentStatusOther: '',
      story: '',
      dream: '',
      emotionalImpact: '',
      estimatedCost: '',
      requestedAmountEur: 500,
      supplierLink: '',
      differencePlan: '',
      confirmsAdult: false,
      confirmsSelfApplication: false,
      confirmsNonMedical: false,
      confirmsAccuracy: false,
      confirmsProofOfUse: false,
      acceptsGrantPolicy: false,
      acceptsPrivacyNotice: false,
      consentsHealthData: false,
      website: '',
    },
  });

  const treatmentStatus = useWatch({control, name: 'treatmentStatus'});
  const publicityChoice = useWatch({control, name: 'publicityChoice'});
  const progress = useMemo(() => ((step + 1) / c.steps.length) * 100, [c.steps.length, step]);

  function scrollToForm() {
    formTopRef.current?.scrollIntoView({behavior: 'smooth', block: 'start'});
  }

  async function goNext() {
    const valid = await trigger(STEP_FIELDS[step], {shouldFocus: true});
    if (step === 2) {
      let missingDocument = false;
      if (!medicalFile) {
        setMedicalError(c.medicalRequired);
        missingDocument = true;
      }
      if (!identityFile) {
        setIdentityError(c.identityRequired);
        missingDocument = true;
      }
      if (missingDocument) return;
    }
    if (!valid) return;
    setStep((current) => Math.min(current + 1, c.steps.length - 1));
    window.setTimeout(scrollToForm, 50);
  }

  function chooseMedicalFile(file?: File) {
    setMedicalError(undefined);
    if (!file) {
      setMedicalFile(null);
      return;
    }
    if (file.size > MAX_DREAM_FILE_BYTES) {
      setMedicalError(c.fileTooLarge);
      return;
    }
    if (!['application/pdf', 'image/jpeg', 'image/png'].includes(file.type)) {
      setMedicalError(c.wrongMedicalType);
      return;
    }
    setMedicalFile(file);
  }

  function chooseIdentityFile(file?: File) {
    setIdentityError(undefined);
    if (!file) {
      setIdentityFile(null);
      return;
    }
    if (file.size > MAX_DREAM_FILE_BYTES) {
      setIdentityError(c.fileTooLarge);
      return;
    }
    if (!['application/pdf', 'image/jpeg', 'image/png'].includes(file.type)) {
      setIdentityError(c.wrongMedicalType);
      return;
    }
    setIdentityFile(file);
  }

  function choosePhotos(files: File[]) {
    setPhotoError(undefined);
    if (files.length > MAX_DREAM_PHOTOS) {
      setPhotoError(c.tooManyPhotos);
      return;
    }
    const next = files;
    if (next.some((file) => file.size > MAX_DREAM_FILE_BYTES)) {
      setPhotoError(c.fileTooLarge);
      return;
    }
    if (next.some((file) => !['image/jpeg', 'image/png'].includes(file.type))) {
      setPhotoError(c.wrongPhotoType);
      return;
    }
    setPhotos(next);
  }

  async function uploadFile(
    applicationId: string,
    uploadToken: string,
    category: 'medical' | 'identity' | 'photo',
    file: File,
  ) {
    const body = new FormData();
    body.set('applicationId', applicationId);
    body.set('uploadToken', uploadToken);
    body.set('category', category);
    body.set('file', file);
    const response = await fetch('/api/dream-applications/upload', {method: 'POST', body});
    const payload = await response.json() as {error?: string};
    if (!response.ok) throw new Error(payload.error || 'Upload failed.');
  }

  async function sendReferenceOnlyAlert(reference: string, submittedAt: string) {
    const body = new URLSearchParams({
      'form-name': 'dream-application-alert',
      'application-reference': reference,
      'application-locale': locale,
      'submitted-at': submittedAt,
      'bot-field': '',
    });
    await fetch('/dream-application-notification.html', {
      method: 'POST',
      headers: {'Content-Type': 'application/x-www-form-urlencoded'},
      body: body.toString(),
    });
  }

  // React Hook Form intentionally builds a stable submit handler from its internal refs.
  // eslint-disable-next-line react-hooks/refs
  const submitApplication = handleSubmit(async (values) => {
    if (!medicalFile || !identityFile) {
      if (!medicalFile) setMedicalError(c.medicalRequired);
      if (!identityFile) setIdentityError(c.identityRequired);
      setStep(2);
      window.setTimeout(scrollToForm, 50);
      return;
    }

    setSubmitting(true);
    setSubmissionError(undefined);
    setUploadProgress(5);

    try {
      const start = await jsonRequest<{
        applicationId: string;
        uploadToken: string;
        reference: string;
      }>('/api/dream-applications/start', values satisfies DreamApplicationStartPayload);

      const files = [
        {category: 'medical' as const, file: medicalFile},
        {category: 'identity' as const, file: identityFile},
        ...photos.map((file) => ({category: 'photo' as const, file})),
      ];
      for (let index = 0; index < files.length; index += 1) {
        await uploadFile(start.applicationId, start.uploadToken, files[index].category, files[index].file);
        setUploadProgress(10 + Math.round(((index + 1) / files.length) * 75));
      }

      const finalized = await jsonRequest<{
        reference: string;
        submittedAt: string;
      }>('/api/dream-applications/submit', {
        applicationId: start.applicationId,
        uploadToken: start.uploadToken,
      });
      setUploadProgress(100);
      setSuccessReference(finalized.reference);

      try {
        await sendReferenceOnlyAlert(finalized.reference, finalized.submittedAt);
      } catch (alertError) {
        console.warn('Application saved, but the reference-only alert could not be sent.', alertError);
      }
      window.setTimeout(scrollToForm, 50);
    } catch (error) {
      console.error('Dream Support submission failed', error);
      setSubmissionError(c.submissionError);
    } finally {
      setSubmitting(false);
    }
  });

  function startAgain() {
    reset();
    setStep(0);
    setMedicalFile(null);
    setIdentityFile(null);
    setPhotos([]);
    setSuccessReference(undefined);
    setSubmissionError(undefined);
    setUploadProgress(0);
    window.setTimeout(scrollToForm, 50);
  }

  if (successReference) {
    return (
      <div ref={formTopRef} className="scroll-mt-28 overflow-hidden rounded-[2rem] border border-emerald-100 bg-white shadow-2xl shadow-brand-900/10">
        <div className="bg-gradient-to-br from-emerald-500 via-teal-500 to-brand-700 px-6 py-14 text-center text-white md:px-12">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-white/20 ring-8 ring-white/10">
            <MailCheck className="h-10 w-10" />
          </div>
          <p className="mb-3 text-sm font-bold uppercase tracking-[0.24em] text-emerald-50">{c.successEyebrow}</p>
          <h2 className="text-3xl font-black md:text-5xl">{c.successTitle}</h2>
        </div>
        <div className="px-6 py-10 text-center md:px-12 md:py-14">
          <p className="mx-auto max-w-2xl text-lg leading-relaxed text-neutral-600">{c.successText}</p>
          <div className="mx-auto my-8 max-w-md rounded-3xl border-2 border-dashed border-brand-200 bg-brand-50 p-6">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-600">{c.referenceLabel}</p>
            <p className="mt-2 break-all text-3xl font-black tracking-wide text-brand-900">{successReference}</p>
          </div>
          <div className="mx-auto grid max-w-2xl gap-4 text-left md:grid-cols-2">
            <p className="rounded-2xl bg-neutral-50 p-5 text-sm leading-relaxed text-neutral-700">
              <BadgeCheck className="mb-3 h-6 w-6 text-emerald-600" />
              {c.responseTime}
            </p>
            <p className="rounded-2xl bg-blue-50 p-5 text-sm leading-relaxed text-blue-950">
              <LockKeyhole className="mb-3 h-6 w-6 text-blue-600" />
              {c.successPrivacy}
            </p>
          </div>
          <button
            type="button"
            onClick={startAgain}
            className="mt-9 rounded-full border border-neutral-200 px-6 py-3 text-sm font-bold text-neutral-700 transition hover:border-brand-300 hover:text-brand-700"
          >
            {c.applyAnother}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div ref={formTopRef} className="scroll-mt-24 overflow-hidden rounded-[2rem] border border-white/60 bg-white shadow-2xl shadow-brand-900/10">
      <div className="relative overflow-hidden bg-gradient-to-br from-brand-700 via-purple-800 to-slate-950 px-6 py-10 text-white md:px-12 md:py-14">
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-fuchsia-400/20 blur-3xl" />
        <div className="absolute -bottom-24 left-8 h-64 w-64 rounded-full bg-cyan-300/15 blur-3xl" />
        <div className="relative">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-brand-50 backdrop-blur">
            <LockKeyhole className="h-4 w-4" />
            {c.secureEyebrow}
          </div>
          <h2 className="max-w-3xl text-3xl font-black leading-tight md:text-5xl">{c.title}</h2>
          <p className="mt-5 max-w-3xl text-base leading-relaxed text-brand-100 md:text-lg">{c.subtitle}</p>
          <div className="mt-7 flex flex-col gap-3 text-sm text-white/90 sm:flex-row sm:gap-6">
            <span className="flex items-center gap-2"><ShieldCheck className="h-5 w-5 text-emerald-300" />{c.privacyPromise}</span>
            <span className="flex items-center gap-2"><Sparkles className="h-5 w-5 text-amber-300" />{c.saveTime}</span>
          </div>
        </div>
      </div>

      <div className="border-b border-neutral-100 bg-neutral-50/80 px-5 py-6 md:px-10">
        <div className="mb-3 flex items-center justify-between text-xs font-bold uppercase tracking-wider text-neutral-500">
          <span>{c.stepLabel} {step + 1} {c.of} {c.steps.length}</span>
          <span>{c.steps[step]}</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-neutral-200">
          <div
            className="h-full rounded-full bg-gradient-to-r from-brand-500 to-fuchsia-500 transition-all duration-500"
            style={{width: `${progress}%`}}
          />
        </div>
        <div className="mt-5 hidden grid-cols-5 gap-2 md:grid">
          {c.steps.map((label, index) => (
            <div key={label} className={`text-center text-xs font-bold ${index <= step ? 'text-brand-700' : 'text-neutral-400'}`}>
              <span className={`mx-auto mb-2 flex h-8 w-8 items-center justify-center rounded-full ${index < step ? 'bg-brand-600 text-white' : index === step ? 'bg-brand-100 text-brand-700 ring-2 ring-brand-500' : 'bg-neutral-200 text-neutral-500'}`}>
                {index < step ? <Check className="h-4 w-4" /> : index + 1}
              </span>
              {label}
            </div>
          ))}
        </div>
      </div>

      <form onSubmit={submitApplication} className="px-5 py-8 md:px-12 md:py-12" noValidate>
        <div className="absolute h-px w-px overflow-hidden [clip:rect(0,0,0,0)]">
          <label>
            Website
            <input tabIndex={-1} autoComplete="off" {...register('website')} />
          </label>
        </div>

        {step === 0 && (
          <section>
            <div className="mb-8 flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-amber-100 text-amber-700">
                <HeartHandshake className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-2xl font-black text-neutral-900">{c.eligibilityTitle}</h3>
                <p className="mt-2 leading-relaxed text-neutral-600">{c.eligibilityIntro}</p>
              </div>
            </div>
            <div className="space-y-4">
              {([
                ['confirmsAdult', c.confirmsAdult],
                ['confirmsSelfApplication', c.confirmsSelfApplication],
                ['confirmsNonMedical', c.confirmsNonMedical],
              ] as const).map(([name, label]) => (
                <label key={name} className="flex cursor-pointer items-start gap-4 rounded-2xl border border-neutral-200 p-5 transition hover:border-brand-300 hover:bg-brand-50/40">
                  <input
                    type="checkbox"
                    className="mt-1 h-5 w-5 rounded border-neutral-300 text-brand-600 focus:ring-brand-500"
                    {...register(name, {required: c.genericRequired})}
                  />
                  <span className="font-medium leading-relaxed text-neutral-800">{label}</span>
                </label>
              ))}
              <ErrorText message={
                errors.confirmsAdult?.message ||
                errors.confirmsSelfApplication?.message ||
                errors.confirmsNonMedical?.message
              } />
            </div>
            <div className="mt-7 flex gap-3 rounded-2xl border border-blue-100 bg-blue-50 p-5 text-sm leading-relaxed text-blue-950">
              <CircleAlert className="mt-0.5 h-5 w-5 shrink-0 text-blue-600" />
              {c.notGuarantee}
            </div>
          </section>
        )}

        {step === 1 && (
          <section>
            <div className="mb-8 flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-brand-100 text-brand-700">
                <UserRound className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-2xl font-black text-neutral-900">{c.aboutTitle}</h3>
                <p className="mt-2 leading-relaxed text-neutral-600">{c.aboutIntro}</p>
              </div>
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              <label className={LABEL_CLASS}>
                {c.fullName}<RequiredMark />
                <input className={INPUT_CLASS} autoComplete="name" {...register('fullName', {required: c.genericRequired, minLength: {value: 2, message: c.moreDetail}})} />
                <ErrorText message={errors.fullName?.message} />
              </label>
              <label className={LABEL_CLASS}>
                {c.email}<RequiredMark />
                <input type="email" className={INPUT_CLASS} autoComplete="email" {...register('email', {required: c.genericRequired, pattern: {value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: c.validEmail}})} />
                <ErrorText message={errors.email?.message} />
              </label>
              <label className={LABEL_CLASS}>
                {c.phone}<RequiredMark />
                <input type="tel" className={INPUT_CLASS} autoComplete="tel" {...register('phone', {required: c.genericRequired, validate: (value) => { const normalized = value.trim().replace(/[()\s.\-]/g, ''); const digits = normalized.replace(/\D/g, ''); return (/^\+?\d{7,15}$/.test(normalized) && !/^(\d)\1+$/.test(digits)) || c.validPhone; }})} />
                <ErrorText message={errors.phone?.message} />
              </label>
              <label className={LABEL_CLASS}>
                {c.city}<RequiredMark />
                <input className={INPUT_CLASS} autoComplete="address-level2" {...register('city', {required: c.genericRequired})} />
                <ErrorText message={errors.city?.message} />
              </label>
              <label className={LABEL_CLASS}>
                {c.country}<RequiredMark />
                <input className={INPUT_CLASS} autoComplete="country-name" {...register('country', {required: c.genericRequired})} />
                <ErrorText message={errors.country?.message} />
              </label>
              <label className={LABEL_CLASS}>
                {c.socialProfile} <span className="font-medium text-neutral-400">({c.optional})</span>
                <input type="url" placeholder="https://" className={INPUT_CLASS} {...register('socialProfile', {pattern: {value: /^https?:\/\/.+/i, message: c.validUrl}})} />
                <span className="mt-2 block text-xs font-medium text-neutral-500">{c.socialHint}</span>
                <ErrorText message={errors.socialProfile?.message} />
              </label>
            </div>
            <fieldset className="mt-7">
              <legend className={LABEL_CLASS}>{c.preferredContact}<RequiredMark /></legend>
              <div className="mt-3 grid gap-3 sm:grid-cols-3">
                {([
                  ['email', c.emailOption],
                  ['phone', c.phoneOption],
                  ['whatsapp', c.whatsappOption],
                ] as const).map(([value, label]) => (
                  <label key={value} className="flex cursor-pointer items-center gap-3 rounded-2xl border border-neutral-200 px-4 py-3 font-semibold text-neutral-700 has-[:checked]:border-brand-500 has-[:checked]:bg-brand-50 has-[:checked]:text-brand-800">
                    <input type="radio" value={value} {...register('preferredContact', {required: c.genericRequired})} />
                    {label}
                  </label>
                ))}
              </div>
            </fieldset>
          </section>
        )}

        {step === 2 && (
          <section>
            <div className="mb-8 flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-rose-100 text-rose-700">
                <FileHeart className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-2xl font-black text-neutral-900">{c.diagnosisTitle}</h3>
                <p className="mt-2 leading-relaxed text-neutral-600">{c.diagnosisIntro}</p>
              </div>
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              <label className={LABEL_CLASS}>
                {c.diagnosis}<RequiredMark />
                <input className={INPUT_CLASS} placeholder={c.diagnosisPlaceholder} {...register('diagnosis', {required: c.genericRequired})} />
                <ErrorText message={errors.diagnosis?.message} />
              </label>
              <label className={LABEL_CLASS}>
                {c.cancerStage} <span className="font-medium text-neutral-400">({c.optional})</span>
                <input className={INPUT_CLASS} placeholder={c.stagePlaceholder} {...register('cancerStage')} />
              </label>
              <label className={LABEL_CLASS}>
                {c.diagnosisDate}<RequiredMark />
                <input
                  type="month"
                  className={INPUT_CLASS}
                  {...register('diagnosisDate', {
                    required: c.genericRequired,
                    validate: (value) => (
                      value <= new Date().toISOString().slice(0, 7) ||
                      c.futureDiagnosisDate
                    ),
                  })}
                />
                <ErrorText message={errors.diagnosisDate?.message} />
              </label>
              <label className={LABEL_CLASS}>
                {c.treatmentStatus}<RequiredMark />
                <select className={INPUT_CLASS} {...register('treatmentStatus', {required: c.genericRequired})}>
                  {Object.entries(c.treatmentOptions).map(([value, label]) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
              </label>
              {treatmentStatus === 'other' && (
                <label className={`${LABEL_CLASS} md:col-span-2`}>
                  {c.treatmentStatusOther}<RequiredMark />
                  <input className={INPUT_CLASS} {...register('treatmentStatusOther', {required: c.genericRequired})} />
                  <ErrorText message={errors.treatmentStatusOther?.message} />
                </label>
              )}
            </div>
            <div className="mt-8 rounded-3xl border-2 border-dashed border-brand-200 bg-brand-50/50 p-6">
              <label className="block cursor-pointer">
                <span className="flex items-center gap-3 text-base font-black text-brand-950">
                  <Paperclip className="h-5 w-5 text-brand-600" />
                  {c.medicalFile}<RequiredMark />
                </span>
                <span className="mt-2 block text-sm leading-relaxed text-neutral-600">{c.medicalFileHelp}</span>
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png"
                  className="mt-5 block w-full text-sm text-neutral-600 file:mr-4 file:rounded-full file:border-0 file:bg-brand-600 file:px-5 file:py-3 file:font-bold file:text-white hover:file:bg-brand-700"
                  onChange={(event) => chooseMedicalFile(event.target.files?.[0])}
                />
              </label>
              {medicalFile && (
                <div className="mt-4 flex items-center justify-between gap-3 rounded-2xl bg-white p-4 shadow-sm">
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-bold text-neutral-800">{medicalFile.name}</span>
                    <span className="text-xs text-neutral-500">{formatBytes(medicalFile.size)}</span>
                  </span>
                  <button type="button" onClick={() => setMedicalFile(null)} className="rounded-full p-2 text-neutral-500 hover:bg-red-50 hover:text-red-600" aria-label={c.remove}>
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              )}
              <ErrorText message={medicalError} />
            </div>

            <div className="mt-6 rounded-3xl border-2 border-dashed border-violet-200 bg-violet-50/50 p-6">
              <label className="block cursor-pointer">
                <span className="flex items-center gap-3 text-base font-black text-violet-950">
                  <Paperclip className="h-5 w-5 text-violet-600" />
                  {c.identityFile}<RequiredMark />
                </span>
                <span className="mt-2 block text-sm leading-relaxed text-neutral-600">{c.identityFileHelp}</span>
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png"
                  className="mt-5 block w-full text-sm text-neutral-600 file:mr-4 file:rounded-full file:border-0 file:bg-violet-600 file:px-5 file:py-3 file:font-bold file:text-white hover:file:bg-violet-700"
                  onChange={(event) => chooseIdentityFile(event.target.files?.[0])}
                />
              </label>
              {identityFile && (
                <div className="mt-4 flex items-center justify-between gap-3 rounded-2xl bg-white p-4 shadow-sm">
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-bold text-neutral-800">{identityFile.name}</span>
                    <span className="text-xs text-neutral-500">{formatBytes(identityFile.size)}</span>
                  </span>
                  <button type="button" onClick={() => setIdentityFile(null)} className="rounded-full p-2 text-neutral-500 hover:bg-red-50 hover:text-red-600" aria-label={c.remove}>
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              )}
              <ErrorText message={identityError} />
            </div>
          </section>
        )}

        {step === 3 && (
          <section>
            <div className="mb-8 flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-fuchsia-100 text-fuchsia-700">
                <Sparkles className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-2xl font-black text-neutral-900">{c.dreamTitle}</h3>
                <p className="mt-2 leading-relaxed text-neutral-600">{c.dreamIntro}</p>
              </div>
            </div>
            <div className="space-y-6">
              <label className={LABEL_CLASS}>
                {c.story}<RequiredMark />
                <textarea rows={6} className={INPUT_CLASS} placeholder={c.storyHint} {...register('story', {required: c.genericRequired, minLength: {value: 30, message: c.moreDetail}})} />
                <ErrorText message={errors.story?.message} />
              </label>
              <label className={LABEL_CLASS}>
                {c.dream}<RequiredMark />
                <textarea rows={5} className={INPUT_CLASS} placeholder={c.dreamHint} {...register('dream', {required: c.genericRequired, minLength: {value: 20, message: c.moreDetail}})} />
                <ErrorText message={errors.dream?.message} />
              </label>
              <label className={LABEL_CLASS}>
                {c.emotionalImpact}<RequiredMark />
                <textarea rows={4} className={INPUT_CLASS} {...register('emotionalImpact', {required: c.genericRequired, minLength: {value: 20, message: c.moreDetail}})} />
                <ErrorText message={errors.emotionalImpact?.message} />
              </label>
              <div className="grid gap-6 md:grid-cols-2">
                <label className={LABEL_CLASS}>
                  {c.estimatedCost}<RequiredMark />
                  <input className={INPUT_CLASS} placeholder={c.estimatedCostHint} {...register('estimatedCost', {required: c.genericRequired})} />
                  <ErrorText message={errors.estimatedCost?.message} />
                </label>
                <label className={LABEL_CLASS}>
                  {c.supplierLink} <span className="font-medium text-neutral-400">({c.optional})</span>
                  <input type="url" placeholder="https://" className={INPUT_CLASS} {...register('supplierLink', {pattern: {value: /^https?:\/\/.+/i, message: c.validUrl}})} />
                  <ErrorText message={errors.supplierLink?.message} />
                </label>
                <label className={LABEL_CLASS}>
                  {c.differencePlan} <span className="font-medium text-neutral-400">({c.optional})</span>
                  <textarea rows={3} className={INPUT_CLASS} {...register('differencePlan')} />
                </label>
              </div>
            </div>
          </section>
        )}

        {step === 4 && (
          <section>
            <div className="mb-8 flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-2xl font-black text-neutral-900">{c.publicityTitle}</h3>
                <p className="mt-2 leading-relaxed text-neutral-600">{c.publicityIntro}</p>
              </div>
            </div>
            <fieldset>
              <legend className="sr-only">{c.publicityTitle}</legend>
              <div className="grid gap-4">
                {([
                  ['full', c.publicityFullTitle, c.publicityFull],
                  ['anonymous', c.publicityAnonymousTitle, c.publicityAnonymous],
                  ['none', c.publicityNoneTitle, c.publicityNone],
                ] as const).map(([value, title, description]) => (
                  <label key={value} className="flex cursor-pointer items-start gap-4 rounded-3xl border border-neutral-200 p-5 transition has-[:checked]:border-brand-500 has-[:checked]:bg-brand-50 has-[:checked]:shadow-sm">
                    <input type="radio" value={value} className="mt-1 h-5 w-5 text-brand-600 focus:ring-brand-500" {...register('publicityChoice', {required: c.genericRequired})} />
                    <span>
                      <span className="block font-black text-neutral-900">{title}</span>
                      <span className="mt-1 block text-sm leading-relaxed text-neutral-600">{description}</span>
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>

            <div className="mt-8 rounded-3xl border border-neutral-200 bg-neutral-50 p-6">
              <div className="flex items-start gap-3">
                <Camera className="mt-0.5 h-6 w-6 shrink-0 text-brand-600" />
                <div>
                  <h4 className="font-black text-neutral-900">{c.photosTitle} <span className="font-medium text-neutral-400">({c.optional})</span></h4>
                  <p className="mt-1 text-sm leading-relaxed text-neutral-600">{c.photosHelp}</p>
                </div>
              </div>
              <input
                type="file"
                multiple
                accept=".jpg,.jpeg,.png,image/jpeg,image/png"
                className="mt-5 block w-full text-sm text-neutral-600 file:mr-4 file:rounded-full file:border-0 file:bg-white file:px-5 file:py-3 file:font-bold file:text-brand-700 file:shadow-sm hover:file:bg-brand-50"
                onChange={(event) => choosePhotos(Array.from(event.target.files || []))}
              />
              {photos.length > 0 && (
                <div className="mt-4 space-y-2">
                  {photos.map((file) => (
                    <div key={`${file.name}-${file.lastModified}`} className="flex items-center justify-between gap-3 rounded-xl bg-white px-4 py-3 text-sm">
                      <span className="truncate font-semibold text-neutral-700">{file.name} · {formatBytes(file.size)}</span>
                      <button type="button" onClick={() => setPhotos((current) => current.filter((item) => item !== file))} className="text-neutral-400 hover:text-red-600" aria-label={c.remove}>
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <ErrorText message={photoError} />
              {publicityChoice === 'none' && photos.length > 0 && (
                <p className="mt-4 rounded-xl bg-blue-50 p-3 text-xs font-medium leading-relaxed text-blue-900">{c.publicityNone}</p>
              )}
            </div>

            <div className="my-8 rounded-3xl bg-gradient-to-br from-neutral-900 to-slate-800 p-6 text-white">
              <FileCheck2 className="h-7 w-7 text-brand-300" />
              <h4 className="mt-3 text-xl font-black">{c.reviewReady}</h4>
              <p className="mt-2 text-sm leading-relaxed text-neutral-300">{c.reviewReadyText}</p>
            </div>

            <div className="space-y-4">
              <label className="flex cursor-pointer items-start gap-4 rounded-2xl border border-neutral-200 p-5">
                <input type="checkbox" className="mt-1 h-5 w-5 rounded text-brand-600" {...register('confirmsAccuracy', {required: c.genericRequired})} />
                <span className="text-sm font-medium leading-relaxed text-neutral-800">{c.confirmsAccuracy}</span>
              </label>
              <label className="flex cursor-pointer items-start gap-4 rounded-2xl border border-neutral-200 p-5">
                <input type="checkbox" className="mt-1 h-5 w-5 rounded text-brand-600" {...register('confirmsProofOfUse', {required: c.genericRequired})} />
                <span className="text-sm font-medium leading-relaxed text-neutral-800">{c.confirmsProof}</span>
              </label>
              <label className="flex cursor-pointer items-start gap-4 rounded-2xl border border-neutral-200 p-5">
                <input type="checkbox" className="mt-1 h-5 w-5 rounded text-brand-600" {...register('acceptsGrantPolicy', {required: c.genericRequired})} />
                <span className="text-sm font-medium leading-relaxed text-neutral-800">
                  {c.acceptsGrantPolicyPrefix}{' '}
                  <a href="#grant-policy" className="font-bold text-brand-700 underline underline-offset-4">{c.grantPolicy}</a>.
                </span>
              </label>
              <label className="flex cursor-pointer items-start gap-4 rounded-2xl border border-neutral-200 p-5">
                <input type="checkbox" className="mt-1 h-5 w-5 rounded text-brand-600" {...register('acceptsPrivacyNotice', {required: c.genericRequired})} />
                <span className="text-sm font-medium leading-relaxed text-neutral-800">
                  {c.acceptsPrivacyPrefix}{' '}
                  <a href={localizedPath(locale, 'privacy')} target="_blank" rel="noopener noreferrer" className="font-bold text-brand-700 underline underline-offset-4">{c.privacyNotice}</a>.
                </span>
              </label>
              <label className="flex cursor-pointer items-start gap-4 rounded-2xl border-2 border-brand-200 bg-brand-50 p-5">
                <input type="checkbox" className="mt-1 h-5 w-5 rounded text-brand-600" {...register('consentsHealthData', {required: c.genericRequired})} />
                <span className="text-sm font-semibold leading-relaxed text-brand-950">{c.healthConsent}</span>
              </label>
              <ErrorText message={
                errors.confirmsAccuracy?.message ||
                errors.confirmsProofOfUse?.message ||
                errors.acceptsGrantPolicy?.message ||
                errors.acceptsPrivacyNotice?.message ||
                errors.consentsHealthData?.message
              } />
            </div>
            <p className="mt-5 flex gap-2 rounded-2xl bg-amber-50 p-4 text-xs font-medium leading-relaxed text-amber-950">
              <LockKeyhole className="mt-0.5 h-4 w-4 shrink-0" />
              {c.retention}
            </p>
          </section>
        )}

        {submissionError && (
          <div className="mt-8 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-5 text-sm font-semibold leading-relaxed text-red-800" role="alert">
            <CircleAlert className="mt-0.5 h-5 w-5 shrink-0" />
            {submissionError || c.submissionError}
          </div>
        )}

        {submitting && (
          <div className="mt-8 rounded-2xl border border-brand-200 bg-brand-50 p-5" aria-live="polite">
            <div className="flex items-center gap-3 font-bold text-brand-900">
              <LoaderCircle className="h-5 w-5 animate-spin" />
              {c.submitting}
            </div>
            <div className="mt-4 h-2 overflow-hidden rounded-full bg-brand-100">
              <div className="h-full rounded-full bg-brand-600 transition-all" style={{width: `${uploadProgress}%`}} />
            </div>
            <p className="mt-2 text-right text-xs font-bold text-brand-700">{c.uploadProgress}: {uploadProgress}%</p>
          </div>
        )}

        <div className="mt-10 flex flex-col-reverse gap-3 border-t border-neutral-100 pt-7 sm:flex-row sm:justify-between">
          {step > 0 ? (
            <button
              type="button"
              disabled={submitting}
              onClick={() => {
                setStep((current) => Math.max(current - 1, 0));
                window.setTimeout(scrollToForm, 50);
              }}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-neutral-200 px-6 py-3.5 font-bold text-neutral-700 transition hover:border-brand-300 hover:text-brand-700 disabled:opacity-50"
            >
              <ChevronLeft className="h-5 w-5" />
              {c.previous}
            </button>
          ) : <span />}
          {step < c.steps.length - 1 ? (
            <button
              type="button"
              onClick={goNext}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-brand-600 px-7 py-3.5 font-black text-white shadow-lg shadow-brand-600/20 transition hover:-translate-y-0.5 hover:bg-brand-700"
            >
              {c.next}
              <ChevronRight className="h-5 w-5" />
            </button>
          ) : (
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-brand-600 to-fuchsia-600 px-7 py-3.5 font-black text-white shadow-lg shadow-brand-600/20 transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? <LoaderCircle className="h-5 w-5 animate-spin" /> : <LockKeyhole className="h-5 w-5" />}
              {submitting ? c.submitting : c.submit}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
