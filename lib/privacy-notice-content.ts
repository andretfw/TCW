import type {SiteLocale} from './routes';

export const PRIVACY_NOTICE_CONTENT: Record<SiteLocale, string> = {
  en: `
    <h3>1. Who is responsible for your data?</h3>
    <p>The controller is <strong>Asociația Tutti Cancer Warriors</strong> (“TCW”), a Romanian nonprofit association, CIF 50156252, based in Bucharest, Romania. For privacy questions or to exercise your rights, email <a href="mailto:tcw@tutticancerwarriors.org">tcw@tutticancerwarriors.org</a>.</p>

    <h3>2. Data we collect</h3>
    <ul>
      <li><strong>Website and security data:</strong> IP address, device/browser information, requested pages, date/time and security logs processed by our hosting provider.</li>
      <li><strong>Contact and peer-support data:</strong> name, contact details, messages, preferences and information you choose to share for matching and support.</li>
      <li><strong>Dream Support applications:</strong> identity and contact details, adult-eligibility confirmations, country, wish, cost information, cancer-diagnosis or treatment information, diagnosis-verification and identity/passport documents, optional photographs, consent choices, grant agreement information and proof that approved support was used as agreed.</li>
      <li><strong>Donations:</strong> donor and transaction information supplied by payment providers, banks or by you. For cryptocurrency verification, a transaction hash and public blockchain data may be checked.</li>
      <li><strong>Stories and publicity:</strong> text, name, photographs, video, audio and the permission choices you submit.</li>
    </ul>

    <h3>3. Why we use data and our legal bases</h3>
    <ul>
      <li>To answer requests, take steps you ask us to take and administer a program or agreement.</li>
      <li>To assess Dream Support eligibility and need, make and record decisions, deliver approved support and verify its agreed use.</li>
      <li>To manage donations, accounting, fraud prevention, audits and legal obligations.</li>
      <li>For our legitimate interests in operating and securing the website, keeping appropriate records and improving charitable services, where those interests do not override your rights.</li>
      <li>With consent where required. <strong>Health data is special-category data and is processed on the basis of your explicit consent</strong>, unless another Article 9 GDPR condition clearly applies. Public use of your story, name, diagnosis summary or image uses a separate, optional choice and does not affect grant eligibility.</li>
    </ul>
    <p>You may withdraw consent at any time for future processing. Withdrawal does not affect processing already carried out lawfully. If information is required to assess or administer a request, we may be unable to continue without it.</p>

    <h3>4. Dream Support applications and medical evidence</h3>
    <p>Dream Support applications are submitted through TCW’s website. Application answers and reviewer records are encrypted by TCW’s application and stored in private application storage. Uploaded diagnosis evidence, identity documents and optional photographs are kept in restricted cloud document storage managed for TCW. The encrypted application record contains only the private file identifier; no public file link is created. The submission alert contains only the application reference, language and submission time and does not contain the applicant’s name, answers, photographs or medical evidence. Please do not send medical records through ordinary email.</p>

    <h3>5. Who receives data?</h3>
    <p>Dream Support application access is limited to authorised TCW reviewers who need it for assessment and administration. We use hosting, identity-access, private application-storage and restricted cloud document-storage providers to operate the portal. Other parts of our operations may use Supabase, PayPal, Better Giving, banks, cryptocurrency infrastructure, communications providers, accountants, legal advisers and security providers. We may disclose information to public authorities when legally required. Service providers may process data only for the agreed service or under their own legal obligations.</p>

    <h3>6. International transfers</h3>
    <p>Some providers or recipients may be outside Romania or the European Economic Area. Where GDPR transfer rules apply, we use an adequacy decision, approved contractual safeguards or another lawful transfer mechanism, as appropriate. Public blockchain information is globally accessible by design.</p>

    <h3>7. How long we keep data</h3>
    <p>Incomplete Dream Support drafts and their uploads are scheduled for deletion after 24 hours. Declined applications are scheduled for deletion after 365 days. Closed cases, including medical evidence and identity documents, are retained only while necessary for TCW’s assessment, administration, verification, safeguarding or legal obligations, then securely deleted or anonymised where appropriate. Limited grant, payment, decision, consent and accounting records may need to be kept separately for periods required by tax, accounting, audit, limitation or other laws. Deletion may be paused where evidence is reasonably required for a dispute, safeguarding matter or legal obligation. Public stories remain within the permission given until removed or permission is withdrawn, subject to lawful archival or recordkeeping needs. Provider security logs follow the provider’s configured retention period.</p>

    <h3>8. Your rights</h3>
    <p>Depending on the circumstances, you may request access, correction, deletion, restriction or portability, or object to processing based on legitimate interests. You may withdraw consent at any time and complain to the Romanian supervisory authority, <a href="https://www.dataprotection.ro/" target="_blank" rel="noopener noreferrer">ANSPDCP</a>, or another competent authority where you live. To make a request, email <a href="mailto:tcw@tutticancerwarriors.org">tcw@tutticancerwarriors.org</a>. We may need to verify your identity.</p>

    <h3>9. Security</h3>
    <p>Dream Support application answers and the stored document-service authorisation token are encrypted by the application using AES-256-GCM before private storage. Documents are transferred over encrypted connections into restricted cloud document storage. Reviewer access requires invited and approved accounts; no public file links are created. Private responses are marked not to be cached, file types and sizes are restricted, stored filenames are pseudonymous, and protected portal links open an authorised provider preview rather than serving document bytes publicly. Our providers also protect data in transit and at rest. No internet transmission or storage system is completely secure, so please share only the information requested and use the designated form.</p>

    <h3>10. Cookies, local storage and analytics</h3>
    <p><strong>TCW currently does not run Google Analytics, advertising pixels or marketing trackers and does not set analytics or marketing cookies on this website.</strong> The public site uses a functional <code>NEXT_LOCALE</code> cookie for up to one year to remember the language you select. Netlify Identity uses strictly necessary authentication storage in the private reviewer area. The hosting provider still processes ordinary request and security logs. External services, including payment providers, social networks and any remaining external forms, may use their own cookies under their own notices. If TCW later adds non-essential analytics, advertising or embedded services, they will not be activated until the required information and consent controls are in place.</p>

    <h3>11. Children</h3>
    <p>Dream Support applicants must be at least 18. Our online services are not directed at children who cannot lawfully provide the required consent. If you believe a child’s data was submitted without proper authorisation, contact us so we can assess and act.</p>

    <h3>12. Changes and contact</h3>
    <p>We may update this Notice when our services or legal obligations change. The effective date above identifies the current version.</p>
    <p><strong>Asociația Tutti Cancer Warriors</strong><br>Bucharest, Romania · CIF 50156252<br>Email: <a href="mailto:tcw@tutticancerwarriors.org">tcw@tutticancerwarriors.org</a><br>Website: <a href="https://tutticancerwarriors.org">https://tutticancerwarriors.org</a></p>
  `,
  ro: `
    <h3>1. Cine răspunde de datele dumneavoastră?</h3>
    <p>Operatorul este <strong>Asociația Tutti Cancer Warriors</strong> („TCW”), asociație nonprofit din România, CIF 50156252, cu sediul în București, România. Pentru întrebări sau exercitarea drepturilor, scrieți la <a href="mailto:tcw@tutticancerwarriors.org">tcw@tutticancerwarriors.org</a>.</p>

    <h3>2. Datele pe care le colectăm</h3>
    <ul>
      <li><strong>Date despre site și securitate:</strong> adresa IP, informații despre dispozitiv/browser, paginile solicitate, data/ora și jurnale de securitate prelucrate de furnizorul de găzduire.</li>
      <li><strong>Date de contact și sprijin între pacienți:</strong> nume, date de contact, mesaje, preferințe și informații pe care alegeți să le transmiteți pentru potrivire și sprijin.</li>
      <li><strong>Cereri Dream Support:</strong> identitate și contact, confirmări privind vârsta minimă, țară, visul solicitat, costuri, informații despre diagnosticul sau tratamentul oncologic, document de confirmare a diagnosticului și document de identitate/pașaport, fotografii opționale, opțiuni de consimțământ, informații despre contractul de grant și dovada utilizării sprijinului aprobat conform acordului.</li>
      <li><strong>Donații:</strong> informații despre donator și tranzacție primite de la procesator, bancă sau de la dumneavoastră. Pentru verificarea criptomonedelor se pot verifica identificatorul tranzacției și datele publice din blockchain.</li>
      <li><strong>Povești și publicitate:</strong> text, nume, fotografii, video, audio și opțiunile de acord transmise.</li>
    </ul>

    <h3>3. Scopuri și temeiuri legale</h3>
    <ul>
      <li>Pentru a răspunde solicitărilor, a efectua demersurile cerute și a administra un program sau contract.</li>
      <li>Pentru a evalua eligibilitatea și nevoia în cadrul Dream Support, a adopta și consemna decizii, a acorda sprijinul aprobat și a verifica utilizarea convenită.</li>
      <li>Pentru gestionarea donațiilor, contabilitate, prevenirea fraudei, audit și obligații legale.</li>
      <li>Pentru interesele noastre legitime de operare și securizare a site-ului, păstrare a evidențelor necesare și îmbunătățire a serviciilor caritabile, când drepturile dumneavoastră nu prevalează.</li>
      <li>Pe baza consimțământului atunci când este necesar. <strong>Datele privind sănătatea sunt date din categorii speciale și sunt prelucrate pe baza consimțământului explicit</strong>, cu excepția situației în care se aplică în mod clar o altă condiție din articolul 9 GDPR. Utilizarea publică a poveștii, prenumelui, unui rezumat al diagnosticului sau imaginii se bazează pe o alegere separată și opțională, care nu influențează eligibilitatea.</li>
    </ul>
    <p>Puteți retrage oricând consimțământul pentru viitor. Retragerea nu afectează prelucrarea legală efectuată anterior. Dacă o informație este necesară pentru evaluarea sau administrarea unei solicitări, este posibil să nu putem continua fără aceasta.</p>

    <h3>4. Cererile Dream Support și documentele medicale</h3>
    <p>Cererile Dream Support sunt trimise prin site-ul TCW. Răspunsurile și evidențele evaluatorilor sunt criptate de aplicația TCW și stocate privat. Documentul de confirmare a diagnosticului, documentul de identitate și fotografiile opționale sunt păstrate în spațiu restricționat de stocare cloud pentru documente, gestionat pentru TCW. Dosarul criptat conține numai identificatorul privat al fișierului; nu este creat niciun link public. Alerta de trimitere conține numai referința cererii, limba și momentul trimiterii și nu conține numele solicitantului, răspunsurile, fotografiile sau documentele medicale. Nu trimiteți documente medicale prin email obișnuit.</p>

    <h3>5. Cine primește datele?</h3>
    <p>Accesul la cererile Dream Support este limitat la evaluatorii TCW autorizați care au nevoie de date pentru evaluare și administrare. Utilizăm furnizori de găzduire, acces pe bază de identitate, stocare privată a cererilor și stocare cloud restricționată pentru documente, pentru funcționarea portalului. Alte activități ale organizației pot utiliza Supabase, PayPal, Better Giving, bănci, infrastructură pentru criptomonede, furnizori de comunicații, contabili, consultanți juridici și furnizori de securitate. Putem divulga informații autorităților publice când legea o cere. Furnizorii pot prelucra datele numai pentru serviciul convenit sau potrivit obligațiilor lor legale proprii.</p>

    <h3>6. Transferuri internaționale</h3>
    <p>Unii furnizori sau destinatari pot fi în afara României ori a Spațiului Economic European. Când se aplică regulile GDPR, folosim o decizie de adecvare, garanții contractuale aprobate sau alt mecanism legal, după caz. Informațiile din blockchainul public sunt accesibile global prin natura tehnologiei.</p>

    <h3>7. Durata păstrării</h3>
    <p>Ciornele Dream Support nefinalizate și fișierele lor încărcate sunt programate pentru ștergere după 24 de ore. Cererile respinse sunt programate pentru ștergere după 365 de zile. Cazurile închise, inclusiv documentele medicale și de identitate, sunt păstrate numai atât timp cât este necesar pentru evaluare, administrare, verificare, protecție sau obligații legale, apoi sunt șterse securizat sau anonimizate, când este adecvat. Evidențe limitate privind grantul, plata, decizia, consimțământul și contabilitatea pot fi păstrate separat pe perioadele cerute de normele fiscale, contabile, de audit, prescripție sau alte legi. Ștergerea poate fi suspendată dacă dovezile sunt necesare în mod rezonabil pentru o contestație, o situație de protecție sau o obligație legală. Poveștile publice rămân în limitele acordului dat până la eliminare sau retragerea acordului, sub rezerva arhivării ori evidențelor cerute de lege. Jurnalele de securitate urmează perioada configurată de furnizor.</p>

    <h3>8. Drepturile dumneavoastră</h3>
    <p>În funcție de situație, puteți solicita accesul, rectificarea, ștergerea, restricționarea sau portabilitatea ori vă puteți opune prelucrării bazate pe interes legitim. Puteți retrage consimțământul oricând și puteți depune plângere la <a href="https://www.dataprotection.ro/" target="_blank" rel="noopener noreferrer">ANSPDCP</a> sau la altă autoritate competentă din țara dumneavoastră. Pentru o cerere, scrieți la <a href="mailto:tcw@tutticancerwarriors.org">tcw@tutticancerwarriors.org</a>. Putem solicita verificarea identității.</p>

    <h3>9. Securitate</h3>
    <p>Răspunsurile cererilor Dream Support și tokenul de autorizare al serviciului de documente sunt criptate de aplicație cu AES-256-GCM înainte de stocarea privată. Documentele sunt transferate prin conexiuni criptate în spațiu cloud restricționat pentru documente. Accesul evaluatorilor necesită conturi invitate și aprobate; nu sunt create linkuri publice către fișiere. Răspunsurile private nu pot fi stocate în cache, tipurile și dimensiunile fișierelor sunt limitate, denumirile fișierelor stocate sunt pseudonimizate, iar linkurile protejate din portal deschid previzualizarea autorizată a furnizorului în loc să publice fișierul. Furnizorii noștri protejează datele în tranzit și în repaus. Nicio transmitere sau stocare online nu este complet sigură; transmiteți numai informațiile cerute și utilizați formularul desemnat.</p>

    <h3>10. Cookie-uri, stocare locală și analiză</h3>
    <p><strong>TCW nu utilizează în prezent Google Analytics, pixeli publicitari sau trackere de marketing și nu setează cookie-uri de analiză ori marketing pe acest site.</strong> Site-ul public folosește cookie-ul funcțional <code>NEXT_LOCALE</code> timp de până la un an pentru a reține limba selectată. Netlify Identity utilizează stocare de autentificare strict necesară în zona privată a evaluatorilor. Furnizorul de găzduire prelucrează în continuare jurnale tehnice și de securitate obișnuite. Serviciile externe, inclusiv procesatorii de plăți, rețelele sociale și orice formulare externe rămase, pot utiliza propriile cookie-uri conform propriilor informări. Dacă TCW adaugă ulterior servicii neesențiale de analiză, publicitate sau conținut integrat, acestea nu vor fi activate înainte de implementarea informațiilor și mecanismelor de consimțământ necesare.</p>

    <h3>11. Minori</h3>
    <p>Solicitanții Dream Support trebuie să aibă cel puțin 18 ani. Serviciile online nu sunt destinate copiilor care nu pot oferi legal consimțământul necesar. Dacă apreciați că datele unui copil au fost transmise fără autorizare adecvată, contactați-ne pentru a analiza și lua măsurile necesare.</p>

    <h3>12. Modificări și contact</h3>
    <p>Putem actualiza această Notă când serviciile sau obligațiile legale se schimbă. Data de mai sus identifică versiunea actuală.</p>
    <p><strong>Asociația Tutti Cancer Warriors</strong><br>București, România · CIF 50156252<br>Email: <a href="mailto:tcw@tutticancerwarriors.org">tcw@tutticancerwarriors.org</a><br>Site: <a href="https://tutticancerwarriors.org">https://tutticancerwarriors.org</a></p>
  `,
  es: `
    <h3>1. ¿Quién es responsable de tus datos?</h3>
    <p>El responsable del tratamiento es <strong>Asociația Tutti Cancer Warriors</strong> (“TCW”), asociación rumana sin ánimo de lucro, CIF 50156252, con sede en Bucarest, Rumanía. Para consultas o para ejercer tus derechos, escribe a <a href="mailto:tcw@tutticancerwarriors.org">tcw@tutticancerwarriors.org</a>.</p>

    <h3>2. Datos que recopilamos</h3>
    <ul>
      <li><strong>Datos del sitio y de seguridad:</strong> dirección IP, información del dispositivo/navegador, páginas solicitadas, fecha/hora y registros de seguridad tratados por el proveedor de alojamiento.</li>
      <li><strong>Datos de contacto y apoyo entre pares:</strong> nombre, datos de contacto, mensajes, preferencias e información que decides compartir para la asignación y el apoyo.</li>
      <li><strong>Solicitudes de Dream Support:</strong> identidad y contacto, confirmaciones de mayoría de edad, país, deseo, información de costes, diagnóstico o tratamiento oncológico, documentos de verificación del diagnóstico y de identidad/pasaporte, fotografías opcionales, opciones de consentimiento, información del acuerdo de ayuda y prueba de que la ayuda aprobada se utilizó según lo acordado.</li>
      <li><strong>Donaciones:</strong> datos del donante y de la transacción proporcionados por el procesador, el banco o por ti. Para verificar criptomonedas puede comprobarse el identificador de la transacción y la información pública de la cadena de bloques.</li>
      <li><strong>Historias y difusión:</strong> texto, nombre, fotografías, vídeo, audio y las opciones de permiso que envías.</li>
    </ul>

    <h3>3. Finalidades y bases jurídicas</h3>
    <ul>
      <li>Para responder a solicitudes, adoptar las medidas que nos pides y administrar un programa o acuerdo.</li>
      <li>Para evaluar la elegibilidad y necesidad de Dream Support, adoptar y registrar decisiones, entregar la ayuda aprobada y verificar su uso acordado.</li>
      <li>Para gestionar donaciones, contabilidad, prevención del fraude, auditorías y obligaciones legales.</li>
      <li>Por nuestros intereses legítimos en operar y proteger el sitio, mantener registros apropiados y mejorar los servicios benéficos, siempre que no prevalezcan tus derechos.</li>
      <li>Con consentimiento cuando sea necesario. <strong>Los datos de salud son datos de categoría especial y se tratan sobre la base de tu consentimiento explícito</strong>, salvo que sea claramente aplicable otra condición del artículo 9 del RGPD. El uso público de tu historia, nombre de pila, un resumen del diagnóstico o imagen se basa en una elección separada y opcional que no afecta a la elegibilidad.</li>
    </ul>
    <p>Puedes retirar el consentimiento en cualquier momento para el futuro. La retirada no afecta al tratamiento lícito ya realizado. Si cierta información es necesaria para evaluar o gestionar una solicitud, puede que no podamos continuar sin ella.</p>

    <h3>4. Solicitudes de Dream Support y documentación médica</h3>
    <p>Las solicitudes de Dream Support se envían a través del sitio web de TCW. Las respuestas y los registros de revisión son cifrados por la aplicación de TCW y se almacenan de forma privada. La prueba del diagnóstico, el documento de identidad y las fotografías opcionales se conservan en almacenamiento restringido de documentos en la nube gestionado para TCW. El expediente cifrado contiene solo el identificador privado del archivo; no se crea ningún enlace público. El aviso de presentación solo contiene la referencia, el idioma y la hora y no contiene el nombre de la persona solicitante, respuestas, fotografías ni documentación médica. No envíes historiales médicos por correo electrónico ordinario.</p>

    <h3>5. ¿Quién recibe los datos?</h3>
    <p>El acceso a las solicitudes de Dream Support se limita a revisores autorizados de TCW que lo necesiten para evaluar y administrar la ayuda. Utilizamos proveedores de alojamiento, acceso basado en identidad, almacenamiento privado de solicitudes y almacenamiento restringido de documentos en la nube para operar el portal. Otras partes de nuestras operaciones pueden utilizar Supabase, PayPal, Better Giving, bancos, infraestructura de criptomonedas, proveedores de comunicaciones, contables, asesores jurídicos y proveedores de seguridad. También podemos comunicar información a autoridades públicas cuando la ley lo exija. Los proveedores solo pueden tratar los datos para el servicio acordado o conforme a sus propias obligaciones legales.</p>

    <h3>6. Transferencias internacionales</h3>
    <p>Algunos proveedores o destinatarios pueden estar fuera de Rumanía o del Espacio Económico Europeo. Cuando se aplican las reglas del RGPD, utilizamos una decisión de adecuación, garantías contractuales aprobadas u otro mecanismo legal, según corresponda. La información de una cadena de bloques pública es accesible globalmente por diseño.</p>

    <h3>7. Plazos de conservación</h3>
    <p>Los borradores de Dream Support incompletos y sus archivos cargados se programan para su eliminación después de 24 horas. Las solicitudes rechazadas se programan para su eliminación después de 365 días. Los casos cerrados, incluida la documentación médica y de identidad, se conservan solo mientras sean necesarios para la evaluación, administración, verificación, protección u obligaciones legales, y después se eliminan de forma segura o se anonimizan cuando proceda. Es posible que determinados registros de la ayuda, pago, decisión, consentimiento y contabilidad deban conservarse por separado durante los periodos exigidos por normas fiscales, contables, de auditoría, prescripción u otras leyes. La eliminación puede suspenderse cuando la prueba sea razonablemente necesaria para una disputa, una cuestión de protección o una obligación legal. Las historias públicas permanecen dentro del permiso concedido hasta que se eliminen o se retire el permiso, sin perjuicio de necesidades legales de archivo o registro. Los registros de seguridad siguen el periodo configurado por el proveedor.</p>

    <h3>8. Tus derechos</h3>
    <p>Según las circunstancias, puedes solicitar acceso, rectificación, supresión, limitación o portabilidad, u oponerte al tratamiento basado en intereses legítimos. Puedes retirar el consentimiento en cualquier momento y reclamar ante la autoridad rumana, <a href="https://www.dataprotection.ro/" target="_blank" rel="noopener noreferrer">ANSPDCP</a>, u otra autoridad competente donde vivas. Para solicitarlo, escribe a <a href="mailto:tcw@tutticancerwarriors.org">tcw@tutticancerwarriors.org</a>. Podemos necesitar verificar tu identidad.</p>

    <h3>9. Seguridad</h3>
    <p>Las respuestas de Dream Support y el token de autorización del servicio de documentos se cifran mediante AES-256-GCM antes del almacenamiento privado. Los documentos se transfieren mediante conexiones cifradas a almacenamiento restringido de documentos en la nube. El acceso de los revisores requiere cuentas invitadas y aprobadas; no se crean enlaces públicos a los archivos. Las respuestas privadas se marcan para que no se almacenen en caché, se restringen los tipos y tamaños de archivo, los nombres almacenados son seudónimos y los enlaces protegidos del portal abren una vista previa autorizada del proveedor en lugar de publicar los documentos. Nuestros proveedores también protegen los datos en tránsito y en reposo. Ninguna transmisión o almacenamiento por Internet es completamente seguro; comparte solo la información solicitada y utiliza el formulario designado.</p>

    <h3>10. Cookies, almacenamiento local y analítica</h3>
    <p><strong>TCW no utiliza actualmente Google Analytics, píxeles publicitarios ni rastreadores de marketing y no instala cookies de analítica o marketing en este sitio.</strong> El sitio público utiliza la cookie funcional <code>NEXT_LOCALE</code> durante un máximo de un año para recordar el idioma seleccionado. Netlify Identity utiliza almacenamiento de autenticación estrictamente necesario en el área privada de revisores. El proveedor de alojamiento sigue tratando registros técnicos y de seguridad ordinarios. Los servicios externos, incluidos procesadores de pagos, redes sociales y cualquier formulario externo restante, pueden utilizar sus propias cookies conforme a sus avisos. Si TCW añade en el futuro analítica, publicidad o contenidos integrados no esenciales, no se activarán antes de implantar la información y los controles de consentimiento necesarios.</p>

    <h3>11. Menores</h3>
    <p>Quienes soliciten Dream Support deben tener al menos 18 años. Los servicios en línea no se dirigen a menores que no puedan otorgar legalmente el consentimiento requerido. Si crees que se enviaron datos de un menor sin autorización adecuada, contacta con nosotros para que podamos evaluarlo y actuar.</p>

    <h3>12. Cambios y contacto</h3>
    <p>Podemos actualizar este Aviso cuando cambien nuestros servicios u obligaciones legales. La fecha anterior identifica la versión vigente.</p>
    <p><strong>Asociația Tutti Cancer Warriors</strong><br>Bucarest, Rumanía · CIF 50156252<br>Email: <a href="mailto:tcw@tutticancerwarriors.org">tcw@tutticancerwarriors.org</a><br>Sitio web: <a href="https://tutticancerwarriors.org">https://tutticancerwarriors.org</a></p>
  `,
};
