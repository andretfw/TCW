import 'server-only';

import {createHash} from 'node:crypto';
import {readFile} from 'node:fs/promises';
import path from 'node:path';

import {fillDocxTemplate} from './docx-template';
import type {
  DreamApplicationRecord,
  DreamContractDetails,
  DreamContractLanguage,
  DreamContractPaymentMethod,
  PublicityChoice,
} from './types';

const TEMPLATE_FILES: Record<DreamContractLanguage, string> = {
  ro: 'TCW_Contract_RO.docx',
  en: 'TCW_Contract_EN.docx',
};

const PAYMENT_METHOD_COPY: Record<
  DreamContractLanguage,
  Record<DreamContractPaymentMethod, string>
> = {
  ro: {
    direct_supplier_payment: 'plată directă către furnizor',
    direct_tcw_purchase: 'achiziționarea directă de către TCW a bunului sau serviciului aprobat',
    direct_tcw_booking: 'rezervare și plată directă realizate de TCW',
    beneficiary_bank_transfer: 'transfer bancar către Beneficiar, exclusiv pentru realizarea scopului aprobat',
  },
  en: {
    direct_supplier_payment: 'direct payment to the supplier',
    direct_tcw_purchase: 'direct purchase by TCW of the approved item or service',
    direct_tcw_booking: 'booking and direct payment arranged by TCW',
    beneficiary_bank_transfer: 'bank transfer to the Beneficiary, exclusively for fulfilment of the approved purpose',
  },
};

const PUBLICITY_COPY: Record<
  DreamContractLanguage,
  Record<PublicityChoice, string>
> = {
  ro: {
    full: 'Acord integral pentru utilizarea numelui, imaginii și poveștii.',
    anonymous: 'Acord limitat: poveste anonimizată și/sau imagini aprobate separat.',
    none: 'Fără acord pentru publicare; cazul rămâne confidențial.',
  },
  en: {
    full: 'Full consent to the use of the Beneficiary’s name, image and story.',
    anonymous: 'Limited consent: anonymised story and/or images approved separately.',
    none: 'No consent for publication; the case remains confidential.',
  },
};

const EN_UNDER_TWENTY = [
  'zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine',
  'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen',
  'seventeen', 'eighteen', 'nineteen',
];
const EN_TENS = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
const RO_UNDER_TWENTY = [
  'zero', 'unu', 'doi', 'trei', 'patru', 'cinci', 'șase', 'șapte', 'opt', 'nouă',
  'zece', 'unsprezece', 'doisprezece', 'treisprezece', 'paisprezece',
  'cincisprezece', 'șaisprezece', 'șaptesprezece', 'optsprezece', 'nouăsprezece',
];
const RO_TENS = ['', '', 'douăzeci', 'treizeci', 'patruzeci', 'cincizeci', 'șaizeci', 'șaptezeci', 'optzeci', 'nouăzeci'];
const RO_HUNDREDS = ['', 'o sută', 'două sute', 'trei sute', 'patru sute', 'cinci sute'];

function englishAmountWords(value: number): string {
  if (value < 20) return EN_UNDER_TWENTY[value];
  if (value < 100) {
    const tens = Math.floor(value / 10);
    const units = value % 10;
    return units ? `${EN_TENS[tens]}-${EN_UNDER_TWENTY[units]}` : EN_TENS[tens];
  }
  const hundreds = Math.floor(value / 100);
  const remainder = value % 100;
  return remainder
    ? `${EN_UNDER_TWENTY[hundreds]} hundred and ${englishAmountWords(remainder)}`
    : `${EN_UNDER_TWENTY[hundreds]} hundred`;
}

function romanianAmountWords(value: number): string {
  if (value < 20) return RO_UNDER_TWENTY[value];
  if (value < 100) {
    const tens = Math.floor(value / 10);
    const units = value % 10;
    return units ? `${RO_TENS[tens]} și ${RO_UNDER_TWENTY[units]}` : RO_TENS[tens];
  }
  const hundreds = Math.floor(value / 100);
  const remainder = value % 100;
  return remainder
    ? `${RO_HUNDREDS[hundreds]} ${romanianAmountWords(remainder)}`
    : RO_HUNDREDS[hundreds];
}

function amountWords(value: number, language: DreamContractLanguage): string {
  return language === 'ro' ? romanianAmountWords(value) : englishAmountWords(value);
}

function formatContractDate(value: string, language: DreamContractLanguage): string {
  const date = new Date(`${value}T12:00:00Z`);
  if (Number.isNaN(date.getTime())) throw new Error('The contract contains an invalid date.');
  return new Intl.DateTimeFormat(language === 'ro' ? 'ro-RO' : 'en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(date);
}

async function readContractTemplate(language: DreamContractLanguage): Promise<Buffer> {
  const templatePath = path.join(
    process.cwd(),
    'public',
    'contract-templates',
    TEMPLATE_FILES[language],
  );
  return readFile(templatePath);
}

export interface GeneratedDreamContract {
  buffer: Buffer;
  filename: string;
  sha256: string;
}

export async function generateDreamContract(input: {
  application: DreamApplicationRecord;
  details: DreamContractDetails;
  contractNumber: number;
}): Promise<GeneratedDreamContract> {
  const {application, details, contractNumber} = input;
  const template = await readContractTemplate(details.language);
  const values: Record<string, string> = {
    CONTRACT_NUMBER: String(contractNumber),
    CONTRACT_DATE: formatContractDate(details.contractDate, details.language),
    APPLICATION_REFERENCE: application.reference,
    FULL_NAME: application.fullName,
    FULL_ADDRESS: details.fullAddress,
    BIRTH_DATE: formatContractDate(details.birthDate, details.language),
    NATIONALITY: details.nationality,
    ID_DOCUMENT_TYPE: details.idDocumentType,
    ID_SERIES_NUMBER: details.idSeriesNumber,
    APPROVED_AMOUNT_EUR: String(details.approvedAmountEur),
    APPROVED_AMOUNT_WORDS: amountWords(details.approvedAmountEur, details.language),
    APPROVED_REQUEST: details.approvedRequest,
    PAYMENT_METHOD: PAYMENT_METHOD_COPY[details.language][details.paymentMethod],
    PUBLICITY_CHOICE: PUBLICITY_COPY[details.language][application.publicityChoice],
    GRANT_POLICY_VERSION: application.grantPolicyVersion,
    BENEFICIARY_EMAIL: application.email,
    TCW_SIGNATURE_DATE: '',
    BENEFICIARY_SIGNATURE_DATE: '',
  };
  const buffer = fillDocxTemplate(template, values);
  const filename = `TCW-Contract-${contractNumber}-${application.reference}-${details.language.toUpperCase()}.docx`;
  return {
    buffer,
    filename,
    sha256: createHash('sha256').update(buffer).digest('hex'),
  };
}
