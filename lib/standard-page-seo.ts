import type {Metadata} from 'next';
import {
  localizedPath,
  normalizeLocale,
  type RouteKey,
  type SiteLocale,
} from '@/lib/routes';

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || 'https://tutticancerwarriors.org';
const SOCIAL_IMAGE = '/og-image.png';

const OPEN_GRAPH_LOCALES: Record<SiteLocale, string> = {
  en: 'en_US',
  ro: 'ro_RO',
  es: 'es_ES',
};

export type StandardSeoRoute =
  | 'team'
  | 'understandingDiagnosis'
  | 'questionsForDoctor'
  | 'emotionalWellBeing'
  | 'awarenessCalendar'
  | 'getInvolved'
  | 'volunteers'
  | 'peerSupport'
  | 'connectSurvivor'
  | 'dreamApplication'
  | 'shareJourney'
  | 'moodBoost'
  | 'mensHealth'
  | 'kidneyCancer'
  | 'pilates'
  | 'privacy'
  | 'terms'
  | 'peerPolicy'
  | 'financials';

type SeoCopy = {
  title: string;
  description: string;
};

const SEO_COPY: Record<
  StandardSeoRoute,
  Record<SiteLocale, SeoCopy>
> = {
  team: {
    en: {
      title: 'Meet Our Team',
      description:
        'Meet the team behind Tutti Cancer Warriors and learn how we combine practical support, cancer awareness and community for people affected by cancer.',
    },
    ro: {
      title: 'Cunoaște echipa noastră',
      description:
        'Cunoaște echipa Tutti Cancer Warriors și află cum îmbinăm sprijinul practic, informarea despre cancer și comunitatea pentru persoanele afectate.',
    },
    es: {
      title: 'Conoce a nuestro equipo',
      description:
        'Conoce al equipo de Tutti Cancer Warriors y cómo unimos apoyo práctico, concienciación sobre el cáncer y comunidad para las personas afectadas.',
    },
  },
  understandingDiagnosis: {
    en: {
      title: 'Understanding a Cancer Diagnosis',
      description:
        'Understand common cancer diagnosis terms, tests, staging and the next questions to discuss with your medical team.',
    },
    ro: {
      title: 'Înțelegerea unui diagnostic de cancer',
      description:
        'Înțelege termenii frecvenți dintr-un diagnostic de cancer, investigațiile, stadializarea și întrebările de discutat cu echipa medicală.',
    },
    es: {
      title: 'Entender un diagnóstico de cáncer',
      description:
        'Comprende términos frecuentes del diagnóstico de cáncer, pruebas, estadificación y las próximas preguntas para tu equipo médico.',
    },
  },
  questionsForDoctor: {
    en: {
      title: 'Questions to Ask Your Cancer Doctor',
      description:
        'Prepare for oncology appointments with practical questions about diagnosis, tests, treatment options, side effects, daily life and support.',
    },
    ro: {
      title: 'Întrebări pentru medicul oncolog',
      description:
        'Pregătește-te pentru consultațiile oncologice cu întrebări despre diagnostic, investigații, tratament, efecte adverse, viața zilnică și sprijin.',
    },
    es: {
      title: 'Preguntas para tu equipo médico',
      description:
        'Prepárate para tus citas oncológicas con preguntas sobre diagnóstico, pruebas, tratamiento, efectos secundarios, vida diaria y apoyo.',
    },
  },
  emotionalWellBeing: {
    en: {
      title: 'Emotional Well-Being During Cancer',
      description:
        'Explore gentle, practical resources for coping with the emotional impact of cancer, for patients, survivors and the people who care about them.',
    },
    ro: {
      title: 'Bunăstare emoțională în timpul cancerului',
      description:
        'Descoperă resurse blânde și practice pentru impactul emoțional al cancerului, dedicate pacienților, supraviețuitorilor și celor apropiați.',
    },
    es: {
      title: 'Bienestar emocional durante el cáncer',
      description:
        'Explora recursos prácticos y cercanos para afrontar el impacto emocional del cáncer, para pacientes, supervivientes y personas cercanas.',
    },
  },
  awarenessCalendar: {
    en: {
      title: 'Cancer Awareness Calendar 2026',
      description:
        'Explore the 2026 cancer awareness calendar, including awareness months and key international dates for education, prevention and solidarity.',
    },
    ro: {
      title: 'Calendar oncologic 2026',
      description:
        'Explorează calendarul oncologic 2026, cu lunile de conștientizare și datele internaționale importante pentru informare, prevenție și solidaritate.',
    },
    es: {
      title: 'Calendario de concienciación sobre el cáncer 2026',
      description:
        'Explora el calendario de concienciación sobre el cáncer 2026, con meses temáticos y fechas internacionales para informar, prevenir y acompañar.',
    },
  },
  getInvolved: {
    en: {
      title: 'Get Involved in Our Mission',
      description:
        'Discover meaningful ways to support cancer warriors through donations, volunteering, peer connection and dream support with Tutti Cancer Warriors.',
    },
    ro: {
      title: 'Implică-te în misiunea noastră',
      description:
        'Descoperă modalități cu sens de a susține persoanele afectate de cancer prin donații, voluntariat, sprijin între pacienți și împlinirea dorințelor.',
    },
    es: {
      title: 'Involúcrate en nuestra misión',
      description:
        'Descubre formas significativas de apoyar a personas con cáncer mediante donaciones, voluntariado, apoyo entre pacientes y sueños cumplidos.',
    },
  },
  volunteers: {
    en: {
      title: 'Volunteer with Us',
      description:
        'Volunteer with Tutti Cancer Warriors and use your time, skills or voice to support people affected by cancer and strengthen our community.',
    },
    ro: {
      title: 'Fii voluntar alături de noi',
      description:
        'Folosește-ți timpul, abilitățile sau vocea ca voluntar Tutti Cancer Warriors pentru a susține persoanele afectate de cancer și comunitatea noastră.',
    },
    es: {
      title: 'Haz voluntariado con nosotros',
      description:
        'Aporta tu tiempo, habilidades o voz como voluntario de Tutti Cancer Warriors para apoyar a personas con cáncer y fortalecer nuestra comunidad.',
    },
  },
  peerSupport: {
    en: {
      title: 'Peer Support for People Affected by Cancer',
      description:
        'Learn about our peer-support program, its boundaries and how shared lived experience can help people affected by cancer feel less alone.',
    },
    ro: {
      title: 'Sprijin între persoanele afectate de cancer',
      description:
        'Află cum funcționează programul nostru de sprijin între pacienți, care sunt limitele sale și cum experiența împărtășită poate reduce izolarea.',
    },
    es: {
      title: 'Apoyo entre personas afectadas por el cáncer',
      description:
        'Conoce nuestro programa de apoyo entre pacientes, sus límites y cómo compartir experiencias puede ayudar a que nadie afronte el cáncer en soledad.',
    },
  },
  connectSurvivor: {
    en: {
      title: 'Connect with a Cancer Survivor',
      description:
        'Request a supportive connection with a cancer survivor who can share lived experience, encouragement and practical perspective.',
    },
    ro: {
      title: 'Conectează-te cu un supraviețuitor al cancerului',
      description:
        'Solicită o conexiune de sprijin cu un supraviețuitor al cancerului care poate împărtăși experiență, încurajare și o perspectivă practică.',
    },
    es: {
      title: 'Conecta con un superviviente de cáncer',
      description:
        'Solicita una conexión de apoyo con un superviviente de cáncer que pueda compartir experiencia, ánimo y una perspectiva práctica.',
    },
  },
  dreamApplication: {
    en: {
      title: 'Apply for Cancer Warrior Dream Support',
      description:
        'Learn how to request non-medical, practical or emotional wish support from Tutti Cancer Warriors and what information is needed to apply.',
    },
    ro: {
      title: 'Solicită sprijin pentru o dorință',
      description:
        'Află cum poți solicita sprijin nemedical, practic sau emoțional pentru o dorință prin Tutti Cancer Warriors și ce informații sunt necesare.',
    },
    es: {
      title: 'Solicita apoyo para un sueño',
      description:
        'Descubre cómo solicitar apoyo no médico, práctico o emocional para un sueño con Tutti Cancer Warriors y qué información necesitas para aplicar.',
    },
  },
  shareJourney: {
    en: {
      title: 'Share Your Cancer Journey',
      description:
        'Share your cancer journey with Tutti Cancer Warriors, on your terms, to raise awareness and help others feel seen, informed and less alone.',
    },
    ro: {
      title: 'Împărtășește-ți experiența cu cancerul',
      description:
        'Împărtășește-ți experiența cu Tutti Cancer Warriors, în termenii tăi, pentru a informa și a-i ajuta pe ceilalți să se simtă văzuți și mai puțin singuri.',
    },
    es: {
      title: 'Comparte tu experiencia con el cáncer',
      description:
        'Comparte tu experiencia con Tutti Cancer Warriors, a tu manera, para concienciar y ayudar a otras personas a sentirse vistas y menos solas.',
    },
  },
  moodBoost: {
    en: {
      title: 'A Gentle Mood Boost for Cancer Warriors',
      description:
        'Find a gentle dose of encouragement, grounding ideas and small mood-lifting moments created for cancer warriors and their loved ones.',
    },
    ro: {
      title: 'O doză de încurajare pentru luptătorii cu cancer',
      description:
        'Găsește o doză blândă de încurajare, idei pentru echilibru și mici momente care pot aduce lumină persoanelor afectate de cancer și celor dragi.',
    },
    es: {
      title: 'Una dosis de ánimo para cancer warriors',
      description:
        'Encuentra ánimo, ideas para volver al presente y pequeños momentos de luz creados para personas afectadas por el cáncer y sus seres queridos.',
    },
  },
  mensHealth: {
    en: {
      title: 'Men’s Health Week 2026',
      description:
        'Explore our Men’s Health Week 2026 awareness resources on earlier conversations, cancer awareness and emotional well-being.',
    },
    ro: {
      title: 'Săptămâna Sănătății Bărbaților 2026',
      description:
        'Descoperă resursele noastre pentru Săptămâna Sănătății Bărbaților 2026 despre dialog timpuriu, informare oncologică și bunăstare emoțională.',
    },
    es: {
      title: 'Semana de la Salud Masculina 2026',
      description:
        'Explora nuestros recursos para la Semana de la Salud Masculina 2026 sobre conversaciones tempranas, concienciación del cáncer y bienestar emocional.',
    },
  },
  kidneyCancer: {
    en: {
      title: 'World Kidney Cancer Day 2026',
      description:
        'Explore our World Kidney Cancer Day 2026 resources about kidney cancer awareness, informed conversations and support.',
    },
    ro: {
      title: 'Ziua Mondială a Cancerului Renal 2026',
      description:
        'Explorează resursele noastre pentru Ziua Mondială a Cancerului Renal 2026 despre informare, conversații documentate și sprijin.',
    },
    es: {
      title: 'Día Mundial del Cáncer de Riñón 2026',
      description:
        'Explora nuestros recursos para el Día Mundial del Cáncer de Riñón 2026 sobre concienciación, conversaciones informadas y apoyo.',
    },
  },
  pilates: {
    en: {
      title: 'Pilates for Cancer Warriors Community Event',
      description:
        'Discover our community Pilates event bringing people together through movement, connection and support for cancer warriors.',
    },
    ro: {
      title: 'Eveniment Pilates pentru luptătorii cu cancer',
      description:
        'Descoperă evenimentul nostru comunitar de Pilates, care aduce oamenii împreună prin mișcare, conexiune și sprijin pentru luptătorii cu cancer.',
    },
    es: {
      title: 'Evento de Pilates para Cancer Warriors',
      description:
        'Descubre nuestro evento comunitario de Pilates, que une a las personas mediante movimiento, conexión y apoyo para cancer warriors.',
    },
  },
  privacy: {
    en: {
      title: 'Privacy Policy',
      description:
        'Read how Tutti Cancer Warriors collects, uses, stores and protects personal information across our website, applications and support programs.',
    },
    ro: {
      title: 'Politica de confidențialitate',
      description:
        'Află cum Tutti Cancer Warriors colectează, utilizează, stochează și protejează datele personale pe website, în cereri și în programele de sprijin.',
    },
    es: {
      title: 'Política de privacidad',
      description:
        'Consulta cómo Tutti Cancer Warriors recopila, utiliza, almacena y protege los datos personales en el sitio, solicitudes y programas de apoyo.',
    },
  },
  terms: {
    en: {
      title: 'Terms and Conditions',
      description:
        'Read the terms governing use of the Tutti Cancer Warriors website, donations, applications, content and community programs.',
    },
    ro: {
      title: 'Termeni și condiții',
      description:
        'Citește termenii care reglementează utilizarea website-ului Tutti Cancer Warriors, donațiile, cererile, conținutul și programele comunitare.',
    },
    es: {
      title: 'Términos y condiciones',
      description:
        'Consulta los términos que regulan el uso del sitio de Tutti Cancer Warriors, las donaciones, solicitudes, contenidos y programas comunitarios.',
    },
  },
  peerPolicy: {
    en: {
      title: 'Peer Support Program Policy',
      description:
        'Read the safety, confidentiality, boundaries and participation principles for the Tutti Cancer Warriors peer-support program.',
    },
    ro: {
      title: 'Politica programului de sprijin între pacienți',
      description:
        'Citește principiile de siguranță, confidențialitate, limite și participare ale programului Tutti Cancer Warriors de sprijin între pacienți.',
    },
    es: {
      title: 'Política del programa de apoyo entre pacientes',
      description:
        'Consulta los principios de seguridad, confidencialidad, límites y participación del programa de apoyo entre pacientes de Tutti Cancer Warriors.',
    },
  },
  financials: {
    en: {
      title: 'Financial Transparency and Annual Reports',
      description:
        'Explore Tutti Cancer Warriors financial transparency information, annual reports and documents explaining how our nonprofit manages its resources.',
    },
    ro: {
      title: 'Transparență financiară și rapoarte anuale',
      description:
        'Explorează informațiile de transparență financiară, rapoartele anuale și documentele care arată cum Tutti Cancer Warriors gestionează resursele.',
    },
    es: {
      title: 'Transparencia financiera e informes anuales',
      description:
        'Explora la información de transparencia financiera, los informes anuales y los documentos sobre cómo Tutti Cancer Warriors gestiona sus recursos.',
    },
  },
};

function absoluteRouteUrl(locale: SiteLocale, route: RouteKey) {
  return `${SITE_URL}${localizedPath(locale, route)}`;
}

export function getStandardPageMetadata(
  route: StandardSeoRoute,
  localeInput: string,
): Metadata {
  const locale = normalizeLocale(localeInput);
  const copy = SEO_COPY[route][locale];
  const canonical = absoluteRouteUrl(locale, route);

  return {
    title: copy.title,
    description: copy.description,
    alternates: {
      canonical,
      languages: {
        en: absoluteRouteUrl('en', route),
        ro: absoluteRouteUrl('ro', route),
        es: absoluteRouteUrl('es', route),
        'x-default': absoluteRouteUrl('es', route),
      },
    },
    openGraph: {
      title: `${copy.title} | Tutti Cancer Warriors`,
      description: copy.description,
      url: canonical,
      siteName: 'Tutti Cancer Warriors',
      locale: OPEN_GRAPH_LOCALES[locale],
      alternateLocale: Object.values(OPEN_GRAPH_LOCALES).filter(
        (value) => value !== OPEN_GRAPH_LOCALES[locale],
      ),
      type: 'website',
      images: [
        {
          url: SOCIAL_IMAGE,
          width: 1200,
          height: 630,
          alt: `${copy.title} — Tutti Cancer Warriors`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${copy.title} | Tutti Cancer Warriors`,
      description: copy.description,
      images: [SOCIAL_IMAGE],
    },
  };
}
