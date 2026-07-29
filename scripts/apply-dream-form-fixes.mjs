import fs from 'node:fs';

function edit(path, replacements) {
  let source = fs.readFileSync(path, 'utf8');
  for (const [before, after] of replacements) {
    if (!source.includes(before)) {
      throw new Error(`Expected text not found in ${path}: ${before.slice(0, 120)}`);
    }
    source = source.replace(before, after);
  }
  fs.writeFileSync(path, source);
}

edit('components/DreamApplicationForm.tsx', [
  [
    "    validEmail: 'Enter a valid email address.',\n    validUrl:",
    "    validEmail: 'Enter a valid email address.',\n    validPhone: 'Enter a valid phone number with 7 to 15 digits.',\n    validUrl:",
  ],
  [
    "    medicalRequired: 'Please select one diagnosis-verification document.',\n    fileTooLarge:",
    "    medicalRequired: 'Please select one diagnosis-verification document.',\n    identityFile: 'ID or passport',\n    identityFileHelp: 'Upload one clear PDF, JPG or PNG of the photo/details page, no larger than 4 MB. You may cover information that is not needed to verify your identity.',\n    identityRequired: 'Please select one ID or passport document.',\n    fileTooLarge:",
  ],
  [
    "    validEmail: 'Introdu o adresă de email validă.',\n    validUrl:",
    "    validEmail: 'Introdu o adresă de email validă.',\n    validPhone: 'Introdu un număr de telefon valid, cu 7 până la 15 cifre.',\n    validUrl:",
  ],
  [
    "    medicalRequired: 'Selectează un document care confirmă diagnosticul.',\n    fileTooLarge:",
    "    medicalRequired: 'Selectează un document care confirmă diagnosticul.',\n    identityFile: 'Carte de identitate sau pașaport',\n    identityFileHelp: 'Încarcă un singur PDF, JPG sau PNG clar cu pagina care conține fotografia și datele, de maximum 4 MB. Poți acoperi informațiile care nu sunt necesare pentru verificarea identității.',\n    identityRequired: 'Selectează o carte de identitate sau un pașaport.',\n    fileTooLarge:",
  ],
  [
    "    validEmail: 'Introduce un correo electrónico válido.',\n    validUrl:",
    "    validEmail: 'Introduce un correo electrónico válido.',\n    validPhone: 'Introduce un número de teléfono válido de 7 a 15 dígitos.',\n    validUrl:",
  ],
  [
    "    medicalRequired: 'Selecciona un documento que verifique el diagnóstico.',\n    fileTooLarge:",
    "    medicalRequired: 'Selecciona un documento que verifique el diagnóstico.',\n    identityFile: 'Documento de identidad o pasaporte',\n    identityFileHelp: 'Sube un PDF, JPG o PNG claro de la página con la foto y los datos, de máximo 4 MB. Puedes ocultar la información que no sea necesaria para verificar tu identidad.',\n    identityRequired: 'Selecciona un documento de identidad o pasaporte.',\n    fileTooLarge:",
  ],
  [
    "  ['story', 'dream', 'emotionalImpact', 'estimatedCost', 'requestedAmountEur'],",
    "  ['story', 'dream', 'emotionalImpact', 'estimatedCost'],",
  ],
  [
    "  const [medicalFile, setMedicalFile] = useState<File | null>(null);\n  const [medicalError, setMedicalError] = useState<string>();",
    "  const [medicalFile, setMedicalFile] = useState<File | null>(null);\n  const [medicalError, setMedicalError] = useState<string>();\n  const [identityFile, setIdentityFile] = useState<File | null>(null);\n  const [identityError, setIdentityError] = useState<string>();",
  ],
  [
    "      publicityChoice: 'none',\n",
    "",
  ],
  [
    "    if (step === 2 && !medicalFile) {\n      setMedicalError(c.medicalRequired);\n      return;\n    }",
    "    if (step === 2) {\n      let missingDocument = false;\n      if (!medicalFile) {\n        setMedicalError(c.medicalRequired);\n        missingDocument = true;\n      }\n      if (!identityFile) {\n        setIdentityError(c.identityRequired);\n        missingDocument = true;\n      }\n      if (missingDocument) return;\n    }",
  ],
  [
    "  function choosePhotos(files: File[]) {",
    "  function chooseIdentityFile(file?: File) {\n    setIdentityError(undefined);\n    if (!file) {\n      setIdentityFile(null);\n      return;\n    }\n    if (file.size > MAX_DREAM_FILE_BYTES) {\n      setIdentityError(c.fileTooLarge);\n      return;\n    }\n    if (!['application/pdf', 'image/jpeg', 'image/png'].includes(file.type)) {\n      setIdentityError(c.wrongMedicalType);\n      return;\n    }\n    setIdentityFile(file);\n  }\n\n  function choosePhotos(files: File[]) {",
  ],
  [
    "    category: 'medical' | 'photo',",
    "    category: 'medical' | 'identity' | 'photo',",
  ],
  [
    "    if (!medicalFile) {\n      setMedicalError(c.medicalRequired);\n      setStep(2);\n      window.setTimeout(scrollToForm, 50);\n      return;\n    }",
    "    if (!medicalFile || !identityFile) {\n      if (!medicalFile) setMedicalError(c.medicalRequired);\n      if (!identityFile) setIdentityError(c.identityRequired);\n      setStep(2);\n      window.setTimeout(scrollToForm, 50);\n      return;\n    }",
  ],
  [
    "        {category: 'medical' as const, file: medicalFile},\n        ...photos.map",
    "        {category: 'medical' as const, file: medicalFile},\n        {category: 'identity' as const, file: identityFile},\n        ...photos.map",
  ],
  [
    "    setMedicalFile(null);\n    setPhotos([]);",
    "    setMedicalFile(null);\n    setIdentityFile(null);\n    setPhotos([]);",
  ],
  [
    "<input type=\"tel\" className={INPUT_CLASS} autoComplete=\"tel\" {...register('phone', {required: c.genericRequired, minLength: {value: 5, message: c.moreDetail}})} />",
    "<input type=\"tel\" className={INPUT_CLASS} autoComplete=\"tel\" {...register('phone', {required: c.genericRequired, validate: (value) => { const normalized = value.trim().replace(/[()\\s.\\-]/g, ''); const digits = normalized.replace(/\\D/g, ''); return (/^\\+?\\d{7,15}$/.test(normalized) && !/^(\\d)\\1+$/.test(digits)) || c.validPhone; }})} />",
  ],
  [
    "              <ErrorText message={medicalError} />\n            </div>\n          </section>",
    "              <ErrorText message={medicalError} />\n            </div>\n\n            <div className=\"mt-6 rounded-3xl border-2 border-dashed border-violet-200 bg-violet-50/50 p-6\">\n              <label className=\"block cursor-pointer\">\n                <span className=\"flex items-center gap-3 text-base font-black text-violet-950\">\n                  <Paperclip className=\"h-5 w-5 text-violet-600\" />\n                  {c.identityFile}<RequiredMark />\n                </span>\n                <span className=\"mt-2 block text-sm leading-relaxed text-neutral-600\">{c.identityFileHelp}</span>\n                <input\n                  type=\"file\"\n                  accept=\".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png\"\n                  className=\"mt-5 block w-full text-sm text-neutral-600 file:mr-4 file:rounded-full file:border-0 file:bg-violet-600 file:px-5 file:py-3 file:font-bold file:text-white hover:file:bg-violet-700\"\n                  onChange={(event) => chooseIdentityFile(event.target.files?.[0])}\n                />\n              </label>\n              {identityFile && (\n                <div className=\"mt-4 flex items-center justify-between gap-3 rounded-2xl bg-white p-4 shadow-sm\">\n                  <span className=\"min-w-0\">\n                    <span className=\"block truncate text-sm font-bold text-neutral-800\">{identityFile.name}</span>\n                    <span className=\"text-xs text-neutral-500\">{formatBytes(identityFile.size)}</span>\n                  </span>\n                  <button type=\"button\" onClick={() => setIdentityFile(null)} className=\"rounded-full p-2 text-neutral-500 hover:bg-red-50 hover:text-red-600\" aria-label={c.remove}>\n                    <Trash2 className=\"h-5 w-5\" />\n                  </button>\n                </div>\n              )}\n              <ErrorText message={identityError} />\n            </div>\n          </section>",
  ],
  [
    "                <label className={LABEL_CLASS}>\n                  <span className=\"flex items-center justify-between gap-3\">\n                    <span>{c.requestedAmountEur}<RequiredMark /></span>\n                    <span className=\"rounded-full bg-brand-100 px-2.5 py-1 text-[11px] text-brand-700\">{c.maxGrant}</span>\n                  </span>\n                  <input type=\"number\" min=\"1\" max=\"500\" step=\"0.01\" className={INPUT_CLASS} {...register('requestedAmountEur', {required: c.genericRequired, valueAsNumber: true, min: {value: 1, message: c.amountRange}, max: {value: 500, message: c.amountRange}})} />\n                  <ErrorText message={errors.requestedAmountEur?.message} />\n                </label>\n",
    "",
  ],
]);

edit('lib/dream-applications/types.ts', [
  [
    "export const DREAM_FILE_CATEGORIES = ['medical', 'photo'] as const;",
    "export const DREAM_FILE_CATEGORIES = ['medical', 'identity', 'photo'] as const;",
  ],
]);

edit('lib/dream-applications/google-drive.ts', [
  [
    "  category: 'medical' | 'photo';",
    "  category: 'medical' | 'identity' | 'photo';",
  ],
]);

edit('app/api/dream-applications/upload/route.ts', [
  [
    "  if (category === 'medical' && categoryFiles.length >= 1) {\n    throw new DreamUploadError('Only one diagnosis document is requested.', 400);\n  }\n  if (category === 'photo'",
    "  if (category === 'medical' && categoryFiles.length >= 1) {\n    throw new DreamUploadError('Only one diagnosis document is requested.', 400);\n  }\n  if (category === 'identity' && categoryFiles.length >= 1) {\n    throw new DreamUploadError('Only one ID or passport document is requested.', 400);\n  }\n  if (category === 'photo'",
  ],
]);

edit('app/api/dream-applications/submit/route.ts', [
  [
    "      if (!application.files.some((file) => file.category === 'medical')) {\n        throw new DreamSubmissionError('A diagnosis-verification document is required.', 400);\n      }",
    "      if (!application.files.some((file) => file.category === 'medical')) {\n        throw new DreamSubmissionError('A diagnosis-verification document is required.', 400);\n      }\n      if (!application.files.some((file) => file.category === 'identity')) {\n        throw new DreamSubmissionError('An ID or passport document is required.', 400);\n      }",
  ],
]);

edit('lib/dream-applications/validation.ts', [
  [
    "  const diagnosisDate = requiredString(input.diagnosisDate, 'diagnosisDate', 4, 10);",
    "  const phone = requiredString(input.phone, 'phone', 7, 50);\n  const normalizedPhone = phone.replace(/[()\\s.\\-]/g, '');\n  const phoneDigits = normalizedPhone.replace(/\\D/g, '');\n  if (!/^\\+?\\d{7,15}$/.test(normalizedPhone) || /^(\\d)\\1+$/.test(phoneDigits)) {\n    throw new DreamValidationError('Please enter a valid phone number.', 'phone');\n  }\n\n  const diagnosisDate = requiredString(input.diagnosisDate, 'diagnosisDate', 4, 10);",
  ],
  [
    "    phone: requiredString(input.phone, 'phone', 5, 50),",
    "    phone,",
  ],
]);

edit('components/admin/AdminDreamApplications.tsx', [
  [
    "                      <LabelValue label=\"Requested from TCW\" value={`€${selected.requestedAmountEur.toFixed(2)}`} />\n",
    "",
  ],
  [
    "                          <p className=\"mt-1 text-xs font-bold text-brand-700\">Requested €{application.requestedAmountEur.toFixed(2)}</p>",
    "                          <p className=\"mt-1 text-xs font-bold text-brand-700\">Estimated cost: {application.estimatedCost}</p>",
  ],
]);

fs.rmSync('scripts/apply-dream-form-fixes.mjs');
fs.rmSync('.github/workflows/apply-dream-form-fixes.yml');
