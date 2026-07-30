export type HomepageLocale = 'en' | 'ro' | 'es';
export type WarriorCountry = 'US' | 'UK' | 'RO';

export type HomepageWarrior = {
  name: string;
  country: WarriorCountry;
  image: string;
  imagePosition?: string;
  support: string;
  story: string;
  memorial?: boolean;
};

const countryNames: Record<HomepageLocale, Record<WarriorCountry, string>> = {
  en: {
    US: 'United States',
    UK: 'United Kingdom',
    RO: 'Romania',
  },
  ro: {
    US: 'Statele Unite',
    UK: 'Regatul Unit',
    RO: 'România',
  },
  es: {
    US: 'Estados Unidos',
    UK: 'Reino Unido',
    RO: 'Rumanía',
  },
};

export const countryFlags: Record<WarriorCountry, string> = {
  US: '🇺🇸',
  UK: '🇬🇧',
  RO: '🇷🇴',
};

const sharedWarriorDetails: Array<
  Pick<HomepageWarrior, 'name' | 'country' | 'image' | 'imagePosition' | 'memorial'>
> = [
  {name: 'Anetra', country: 'US', image: '/anetra-home.jpg', imagePosition: 'object-[center_25%]'},
  {name: 'Janelle', country: 'US', image: '/janelle-ysc-summit-1.jpg', imagePosition: 'object-top'},
  {name: 'Jeanelle', country: 'US', image: '/jeanelle-home.jpg'},
  {name: 'Susan', country: 'US', image: '/susan.jpg', imagePosition: 'object-[center_35%]'},
  {name: 'Taya', country: 'US', image: '/taya.jpg'},
  {name: 'D.', country: 'US', image: '/warrior.jpg'},
  {
    name: 'Jocelyn',
    country: 'US',
    image: '',
  },
  {name: 'Monica', country: 'RO', image: '/Monica RO (1).jpg'},
  {
    name: 'Penny',
    country: 'UK',
    image: '',
  },
  {name: 'Wren', country: 'US', image: '/wren.jpg'},
  {name: 'Elise', country: 'UK', image: '/warriors/elise.webp'},
  {name: 'Giulia', country: 'RO', image: '/warriors/giulia.webp'},
  {name: 'Maria', country: 'RO', image: '/warriors/maria.webp'},
  {name: 'Dan', country: 'RO', image: '/warriors/dan.webp', memorial: true},
  {name: 'Laura', country: 'RO', image: '/warriors/laura.webp'},
  {name: 'Cristina', country: 'RO', image: '/warriors/cristina.webp'},
  {name: 'Mirela', country: 'RO', image: '/warriors/mirela.webp'},
  {name: 'Iulia', country: 'RO', image: '/warriors/iulia.webp'},
];

const warriorStories: Record<
  HomepageLocale,
  Array<Pick<HomepageWarrior, 'support' | 'story'>>
> = {
  en: [
    {
      support: 'A restorative mental-health retreat',
      story:
        'Anetra has long cared for others and used her voice to encourage her community. Her wish created space to rest, reconnect and care for her own wellbeing.',
    },
    {
      support: 'Attending the YSC Summit',
      story:
        'Janelle wanted to meet others who understand life with cancer and grow into patient advocacy. Support helped her join a gathering built around learning and connection.',
    },
    {
      support: 'Wellness tools for her community',
      story:
        'Jeanelle is a yoga instructor and advocate creating welcoming spaces for other women. Her wish provided practical tools for free, trauma-informed wellbeing sessions.',
    },
    {
      support: 'Art Journal Circles',
      story:
        'Susan is an artist who turns creativity into connection. Support helped her share art materials and host journal circles that give people room to express themselves.',
    },
    {
      support: 'A Harry Potter World family trip',
      story:
        'Taya wished for joyful, unhurried time with her son. Their trip became a chance to make new memories together beyond appointments and everyday pressure.',
    },
    {
      support: 'Help with essential living costs',
      story:
        'When treatment made working difficult, practical support helped D. protect stability at home and keep her energy for recovery and family. Her identity remains private by choice.',
    },
    {
      support: 'Help with overdue utility bills',
      story:
        'Jocelyn was balancing treatment, parenting and the financial strain that followed. Support helped make home feel steadier while she focused on her health and family.',
    },
    {
      support: 'Creative workshops for other warriors',
      story:
        'Monica wanted to turn her love of making things into moments of connection. Her wish helped create craft workshops where people can meet, create and feel less alone.',
    },
    {
      support: 'A long-dreamed-of trip to New York',
      story:
        'Penny hoped to mark a difficult chapter with something joyful. Support helped make room for adventure, celebration and a memory centred on life rather than illness.',
    },
    {
      support: 'The Living Beyond Breast Cancer Conference',
      story:
        'Wren chose a space for trusted information, community and honest conversation. Support helped her learn and connect with others living through similar realities.',
    },
    {
      support: 'Four restorative days at Center Parcs',
      story:
        'Elise loves animals, pub quizzes and time with the people closest to her. Her wish gave her and her husband a peaceful break and space to simply enjoy being together.',
    },
    {
      support: 'A quiet weekend away',
      story:
        'Giulia finds joy in beautiful places and the company of people she loves. Her wish offered a gentle change of scenery and time to rest with her partner.',
    },
    {
      support: 'A garden swing',
      story:
        'Maria has devoted much of her life to family, home and hard work. Her garden swing created a peaceful place to pause, spend time outside and enjoy the family around her.',
    },
    {
      support: 'Two armchairs for the terrace',
      story:
        'Dan loved gardening, nature, craft and outdoor time with the people he loved. The chairs gave him more comfort on the terrace. Dan later passed away; we remember him with warmth and gratitude.',
    },
    {
      support: 'A garden pavilion',
      story:
        'Laura loves gardening, cooking, crochet, travel and being among people. Her pavilion made the garden a more welcoming place to rest and gather with family and friends.',
    },
    {
      support: 'Tools for a small nail-care business',
      story:
        'Cristina is creative, independent and drawn to a simpler life filled with flowers, gardens and animals. Practical equipment helped her begin building work of her own.',
    },
    {
      support: 'Books, self-care and creative materials',
      story:
        'Mirela loves crafts, plants, reading, travel, people and animals. Her wish brought together small things that support rest, curiosity and the pleasure of making by hand.',
    },
    {
      support: 'Equipment for online coaching',
      story:
        'Iulia is creative and deeply motivated to help others grow. Audio-video equipment and an online meeting subscription supported her next chapter in coaching and community care.',
    },
  ],
  ro: [
    {
      support: 'O experiență pentru odihnă și echilibru emoțional',
      story:
        'Anetra a avut mereu grijă de ceilalți și și-a folosit vocea pentru a-și încuraja comunitatea. Dorința ei i-a oferit spațiu pentru odihnă, reconectare și propria stare de bine.',
    },
    {
      support: 'Participarea la summitul YSC',
      story:
        'Janelle și-a dorit să întâlnească oameni care înțeleg viața cu cancer și să facă pași spre advocacy. Sprijinul a ajutat-o să participe la un eveniment dedicat învățării și conectării.',
    },
    {
      support: 'Instrumente de wellbeing pentru comunitate',
      story:
        'Jeanelle este instructor de yoga și advocate, iar visul ei este să creeze spații primitoare pentru alte femei. Sprijinul a oferit materiale practice pentru sesiuni gratuite de wellbeing.',
    },
    {
      support: 'Cercuri de jurnal prin artă',
      story:
        'Susan este artistă și transformă creativitatea în conexiune. Sprijinul a ajutat-o să ofere materiale și să organizeze cercuri în care oamenii se pot exprima prin artă.',
    },
    {
      support: 'O călătorie în lumea Harry Potter',
      story:
        'Taya și-a dorit timp senin și fără grabă alături de fiul ei. Călătoria lor a devenit o ocazie de a crea amintiri noi, dincolo de programări și presiunea cotidiană.',
    },
    {
      support: 'Ajutor pentru cheltuieli esențiale',
      story:
        'Când tratamentul i-a făcut munca dificilă, sprijinul practic a ajutat-o pe D. să păstreze stabilitatea de acasă și energia pentru recuperare și familie. Identitatea ei rămâne privată, conform dorinței sale.',
    },
    {
      support: 'Ajutor pentru facturi restante',
      story:
        'Jocelyn îmbina tratamentul, rolul de părinte și presiunea financiară. Sprijinul a adus mai multă stabilitate acasă, în timp ce ea s-a concentrat pe sănătate și familie.',
    },
    {
      support: 'Ateliere creative pentru alți warriors',
      story:
        'Monica și-a dorit să transforme bucuria lucrului manual în momente de apropiere. Visul ei a susținut ateliere în care oamenii se pot întâlni, crea și simți mai puțin singuri.',
    },
    {
      support: 'O călătorie mult visată la New York',
      story:
        'Penny și-a dorit să marcheze o perioadă dificilă prin ceva luminos. Sprijinul a făcut loc aventurii, bucuriei și unei amintiri despre viață, nu despre boală.',
    },
    {
      support: 'Conferința Living Beyond Breast Cancer',
      story:
        'Wren a ales un spațiu cu informații de încredere, comunitate și conversații sincere. Sprijinul a ajutat-o să învețe și să cunoască oameni cu experiențe asemănătoare.',
    },
    {
      support: 'Patru zile de odihnă la Center Parcs',
      story:
        'Elise iubește animalele, quiz-urile și timpul petrecut cu oamenii apropiați. Dorința ei i-a oferit ei și soțului un răgaz liniștit și timp în care să se bucure pur și simplu unul de celălalt.',
    },
    {
      support: 'Un weekend liniștit departe de casă',
      story:
        'Giulia găsește bucurie în locuri frumoase și în compania celor dragi. Dorința ei a însemnat o schimbare blândă de decor și timp pentru odihnă alături de partener.',
    },
    {
      support: 'Un leagăn de grădină',
      story:
        'Maria și-a dedicat o mare parte din viață familiei, casei și muncii. Leagănul i-a oferit un loc liniștit pentru pauză, timp afară și bucuria familiei din jur.',
    },
    {
      support: 'Două fotolii pentru terasă',
      story:
        'Dan iubea grădinăritul, natura, meșteșugul și timpul petrecut afară cu cei dragi. Fotoliile i-au adus mai mult confort pe terasă. Dan s-a stins ulterior; îl păstrăm în amintire cu căldură și recunoștință.',
    },
    {
      support: 'Un pavilion de grădină',
      story:
        'Laura iubește grădinăritul, gătitul, croșetatul, călătoriile și oamenii. Pavilionul a transformat grădina într-un loc mai primitor pentru odihnă și timp cu familia și prietenii.',
    },
    {
      support: 'Echipamente pentru o mică afacere de manichiură',
      story:
        'Cristina este creativă, independentă și atrasă de o viață mai simplă, cu flori, grădini și animale. Echipamentele au ajutat-o să înceapă să construiască o activitate proprie.',
    },
    {
      support: 'Cărți, îngrijire personală și materiale creative',
      story:
        'Mirela iubește lucrul manual, plantele, lectura, călătoriile, oamenii și animalele. Dorința ei a reunit lucruri mici care aduc odihnă, curiozitate și bucuria de a crea.',
    },
    {
      support: 'Echipamente pentru coaching online',
      story:
        'Iulia este creativă și profund motivată să-i ajute pe ceilalți să crească. Echipamentele audio-video și abonamentul pentru întâlniri online i-au susținut următorul capitol în coaching și sprijin comunitar.',
    },
  ],
  es: [
    {
      support: 'Un retiro para descansar y cuidar su bienestar',
      story:
        'Anetra siempre ha cuidado de los demás y ha usado su voz para animar a su comunidad. Su deseo le dio espacio para descansar, reconectar y cuidar también de sí misma.',
    },
    {
      support: 'Participar en la cumbre YSC',
      story:
        'Janelle quería conocer a personas que entienden la vida con cáncer y dar pasos hacia la defensa del paciente. El apoyo le permitió asistir a un encuentro de aprendizaje y conexión.',
    },
    {
      support: 'Material de bienestar para su comunidad',
      story:
        'Jeanelle es instructora de yoga y defensora de pacientes que crea espacios acogedores para otras mujeres. Su deseo aportó herramientas para sesiones gratuitas de bienestar.',
    },
    {
      support: 'Círculos de diario artístico',
      story:
        'Susan es artista y convierte la creatividad en conexión. El apoyo le permitió compartir materiales y organizar círculos donde las personas pueden expresarse a través del arte.',
    },
    {
      support: 'Un viaje familiar al mundo de Harry Potter',
      story:
        'Taya deseaba compartir tiempo alegre y sin prisas con su hijo. El viaje les dio la oportunidad de crear recuerdos nuevos, más allá de las citas y la presión cotidiana.',
    },
    {
      support: 'Ayuda con gastos esenciales',
      story:
        'Cuando el tratamiento dificultó el trabajo, el apoyo práctico ayudó a D. a mantener la estabilidad en casa y reservar energía para su recuperación y su familia. Su identidad permanece privada por decisión propia.',
    },
    {
      support: 'Ayuda con facturas atrasadas',
      story:
        'Jocelyn compaginaba el tratamiento, la crianza y la presión económica. El apoyo aportó más estabilidad en casa mientras ella se centraba en su salud y su familia.',
    },
    {
      support: 'Talleres creativos para otros warriors',
      story:
        'Monica quiso convertir su afición por las manualidades en momentos de conexión. Su deseo ayudó a crear talleres donde las personas pueden reunirse, crear y sentirse menos solas.',
    },
    {
      support: 'Un viaje soñado a Nueva York',
      story:
        'Penny quería cerrar una etapa difícil con algo luminoso. El apoyo abrió espacio para la aventura, la celebración y un recuerdo centrado en la vida, no en la enfermedad.',
    },
    {
      support: 'La conferencia Living Beyond Breast Cancer',
      story:
        'Wren eligió un espacio de información fiable, comunidad y conversación honesta. El apoyo le permitió aprender y conectar con otras personas que viven realidades parecidas.',
    },
    {
      support: 'Cuatro días de descanso en Center Parcs',
      story:
        'A Elise le encantan los animales, los concursos y pasar tiempo con su gente. Su deseo les dio a ella y a su marido una pausa tranquila para disfrutar sencillamente de estar juntos.',
    },
    {
      support: 'Un fin de semana tranquilo',
      story:
        'Giulia encuentra alegría en los lugares bonitos y en la compañía de quienes quiere. Su deseo le ofreció un cambio suave de escenario y tiempo para descansar con su pareja.',
    },
    {
      support: 'Un columpio de jardín',
      story:
        'Maria ha dedicado gran parte de su vida a la familia, el hogar y el trabajo. El columpio creó un lugar tranquilo para detenerse, disfrutar del aire libre y de su familia.',
    },
    {
      support: 'Dos sillones para la terraza',
      story:
        'A Dan le encantaban la jardinería, la naturaleza, la artesanía y el tiempo al aire libre con los suyos. Los sillones le dieron más comodidad en la terraza. Dan falleció posteriormente; lo recordamos con cariño y gratitud.',
    },
    {
      support: 'Un cenador de jardín',
      story:
        'A Laura le encantan la jardinería, la cocina, el ganchillo, los viajes y estar con gente. El cenador hizo del jardín un lugar más acogedor para descansar y reunirse.',
    },
    {
      support: 'Herramientas para un pequeño negocio de manicura',
      story:
        'Cristina es creativa, independiente y sueña con una vida más sencilla entre flores, jardines y animales. El equipo práctico le ayudó a empezar a construir un trabajo propio.',
    },
    {
      support: 'Libros, autocuidado y materiales creativos',
      story:
        'A Mirela le encantan las manualidades, las plantas, la lectura, los viajes, las personas y los animales. Su deseo reunió pequeñas cosas que aportan descanso, curiosidad y placer por crear.',
    },
    {
      support: 'Equipo para sesiones de coaching online',
      story:
        'Iulia es creativa y está muy motivada para ayudar a otras personas a crecer. El equipo audiovisual y la suscripción para reuniones online apoyaron su nueva etapa en el coaching.',
    },
  ],
};

export const homepageCopy = {
  en: {
    mission: {
      eyebrow: 'SUPPORT BEYOND TREATMENT',
      title: 'Cancer treatment happens in hospitals. Its weight follows people home.',
      body:
        'That is where our support begins: in everyday life, dignity, family, recovery and the things that still make someone feel like themselves.',
    },
    pathways: {
      eyebrow: 'WHAT SUPPORT CAN LOOK LIKE',
      title: 'A meaningful wish is never one-size-fits-all.',
      body:
        'We listen to what would make a real difference now, then help turn that personal wish into practical support.',
      items: [
        {title: 'Home & stability', body: 'Essential costs and practical help when treatment disrupts work and daily life.'},
        {title: 'Rest & recovery', body: 'Space to breathe, restore energy and step outside the routine of treatment.'},
        {title: 'Family moments', body: 'Time together and memories that belong to the person, not to cancer.'},
        {title: 'Independence & purpose', body: 'Tools that support creativity, work, confidence and a next chapter.'},
        {title: 'Community & connection', body: 'Learning, peer support and shared experiences that make isolation smaller.'},
      ],
    },
    impact: {
      funds: 'provided in direct support',
      dreams: 'meaningful wishes supported',
      warriors: 'warriors supported',
    },
    stories: {
      eyebrow: '18 WARRIORS · 18 STORIES',
      title: 'Support looks different for everyone.',
      body:
        'Every wish starts with a person, not a diagnosis. These are the moments, practical needs and new beginnings our community helped make possible.',
      supported: 'What we supported',
      memorial: 'In memory',
      photoProtected: 'Identity protected',
    },
    next: {
      eyebrow: 'FIND YOUR NEXT STEP',
      title: 'Support, information and community—wherever you are today.',
      apply: {
        title: 'Apply for dream support',
        body: 'Tell us about the wish that could bring meaningful relief, connection or possibility.',
        cta: 'Start an application',
      },
      learn: {
        title: 'Explore cancer information',
        body: 'Plain-language guides designed to help you feel more informed and prepared.',
        cta: 'Browse the guides',
      },
      peers: {
        title: 'Find peer support',
        body: 'Connect with someone who understands the emotional reality of living with cancer.',
        cta: 'Explore peer support',
      },
    },
    final: {
      eyebrow: 'MORE ROOM FOR LIFE',
      title: 'Help another warrior feel seen, supported and free to thrive.',
      body:
        'Every donation helps turn a personal wish into something real: a steadier home, a joyful memory, a creative beginning or a moment of rest.',
      donate: 'Support the next wish',
      stories: 'Meet our warriors',
    },
  },
  ro: {
    mission: {
      eyebrow: 'SPRIJIN DINCOLO DE TRATAMENT',
      title: 'Tratamentul se întâmplă în spital. Greutatea cancerului îi urmează pe oameni acasă.',
      body:
        'Acolo începe sprijinul nostru: în viața de zi cu zi, în demnitate, familie, recuperare și în lucrurile care îi ajută pe oameni să se simtă din nou ei înșiși.',
    },
    pathways: {
      eyebrow: 'CUM POATE ARĂTA SPRIJINUL',
      title: 'O dorință importantă nu arată la fel pentru toată lumea.',
      body:
        'Ascultăm ce ar face o diferență reală acum, apoi ajutăm ca acea dorință personală să devină sprijin concret.',
      items: [
        {title: 'Casă și stabilitate', body: 'Cheltuieli esențiale și ajutor practic atunci când tratamentul schimbă munca și viața de zi cu zi.'},
        {title: 'Odihnă și recuperare', body: 'Spațiu pentru respirație, refacerea energiei și o pauză de la rutina tratamentului.'},
        {title: 'Momente în familie', body: 'Timp împreună și amintiri care aparțin persoanei, nu cancerului.'},
        {title: 'Independență și sens', body: 'Instrumente care susțin creativitatea, munca, încrederea și un nou capitol.'},
        {title: 'Comunitate și conectare', body: 'Învățare, sprijin între pacienți și experiențe împărtășite care reduc izolarea.'},
      ],
    },
    impact: {
      funds: 'oferiți ca sprijin direct',
      dreams: 'dorințe importante susținute',
      warriors: 'warriors sprijiniți',
    },
    stories: {
      eyebrow: '18 WARRIORS · 18 POVEȘTI',
      title: 'Sprijinul arată diferit pentru fiecare om.',
      body:
        'Fiecare dorință începe cu un om, nu cu un diagnostic. Acestea sunt momentele, nevoile practice și noile începuturi pe care comunitatea noastră le-a făcut posibile.',
      supported: 'Ce am susținut',
      memorial: 'În memoriam',
      photoProtected: 'Identitate protejată',
    },
    next: {
      eyebrow: 'ALEGE URMĂTORUL PAS',
      title: 'Sprijin, informații și comunitate, oriunde te-ai afla astăzi.',
      apply: {
        title: 'Aplică pentru sprijin',
        body: 'Spune-ne despre dorința care ar putea aduce alinare, apropiere sau o nouă posibilitate.',
        cta: 'Începe cererea',
      },
      learn: {
        title: 'Descoperă informații despre cancer',
        body: 'Ghiduri clare, create pentru a te ajuta să te simți mai informat și pregătit.',
        cta: 'Vezi ghidurile',
      },
      peers: {
        title: 'Găsește sprijin între pacienți',
        body: 'Conectează-te cu cineva care înțelege realitatea emoțională a vieții cu cancer.',
        cta: 'Descoperă programul',
      },
    },
    final: {
      eyebrow: 'MAI MULT LOC PENTRU VIAȚĂ',
      title: 'Ajută un alt warrior să se simtă văzut, sprijinit și liber să prospere.',
      body:
        'Fiecare donație ajută o dorință personală să devină realitate: mai multă stabilitate acasă, o amintire luminoasă, un început creativ sau un moment de odihnă.',
      donate: 'Susține următoarea dorință',
      stories: 'Cunoaște-i pe warriors',
    },
  },
  es: {
    mission: {
      eyebrow: 'APOYO MÁS ALLÁ DEL TRATAMIENTO',
      title: 'El tratamiento ocurre en el hospital. El peso del cáncer acompaña a las personas hasta casa.',
      body:
        'Ahí empieza nuestro apoyo: en la vida cotidiana, la dignidad, la familia, la recuperación y todo lo que ayuda a una persona a volver a sentirse ella misma.',
    },
    pathways: {
      eyebrow: 'LAS FORMAS DEL APOYO',
      title: 'Un deseo importante nunca es igual para todo el mundo.',
      body:
        'Escuchamos qué marcaría una diferencia real ahora y ayudamos a convertir ese deseo personal en apoyo concreto.',
      items: [
        {title: 'Hogar y estabilidad', body: 'Gastos esenciales y ayuda práctica cuando el tratamiento altera el trabajo y la vida diaria.'},
        {title: 'Descanso y recuperación', body: 'Espacio para respirar, recuperar energía y salir por un momento de la rutina del tratamiento.'},
        {title: 'Momentos en familia', body: 'Tiempo juntos y recuerdos que pertenecen a la persona, no al cáncer.'},
        {title: 'Independencia y propósito', body: 'Herramientas que apoyan la creatividad, el trabajo, la confianza y una nueva etapa.'},
        {title: 'Comunidad y conexión', body: 'Aprendizaje, apoyo entre iguales y experiencias compartidas que reducen el aislamiento.'},
      ],
    },
    impact: {
      funds: 'entregados en apoyo directo',
      dreams: 'deseos importantes apoyados',
      warriors: 'warriors apoyados',
    },
    stories: {
      eyebrow: '18 WARRIORS · 18 HISTORIAS',
      title: 'El apoyo es diferente para cada persona.',
      body:
        'Cada deseo empieza con una persona, no con un diagnóstico. Estos son los momentos, las necesidades prácticas y los nuevos comienzos que nuestra comunidad hizo posibles.',
      supported: 'Lo que apoyamos',
      memorial: 'En memoria',
      photoProtected: 'Identidad protegida',
    },
    next: {
      eyebrow: 'ENCUENTRA TU PRÓXIMO PASO',
      title: 'Apoyo, información y comunidad, estés donde estés hoy.',
      apply: {
        title: 'Solicita apoyo para un deseo',
        body: 'Cuéntanos qué deseo podría aportar alivio, conexión o una nueva posibilidad.',
        cta: 'Iniciar una solicitud',
      },
      learn: {
        title: 'Explora información sobre el cáncer',
        body: 'Guías claras pensadas para ayudarte a sentirte más informado y preparado.',
        cta: 'Ver las guías',
      },
      peers: {
        title: 'Encuentra apoyo entre iguales',
        body: 'Conecta con alguien que comprende la realidad emocional de vivir con cáncer.',
        cta: 'Explorar el apoyo',
      },
    },
    final: {
      eyebrow: 'MÁS ESPACIO PARA LA VIDA',
      title: 'Ayuda a otro warrior a sentirse visto, apoyado y libre para prosperar.',
      body:
        'Cada donación convierte un deseo personal en algo real: un hogar más estable, un recuerdo alegre, un comienzo creativo o un momento de descanso.',
      donate: 'Apoya el próximo deseo',
      stories: 'Conoce a nuestros warriors',
    },
  },
} as const;

export function getHomepageLocale(locale: string): HomepageLocale {
  return locale === 'ro' || locale === 'es' ? locale : 'en';
}

export function getHomepageWarriors(locale: HomepageLocale): HomepageWarrior[] {
  return sharedWarriorDetails.map((warrior, index) => ({
    ...warrior,
    ...warriorStories[locale][index],
  }));
}

export function getCountryName(locale: HomepageLocale, country: WarriorCountry): string {
  return countryNames[locale][country];
}
