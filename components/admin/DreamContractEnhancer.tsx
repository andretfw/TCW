'use client';

import {useCallback, useEffect, useRef, useState} from 'react';
import {createPortal} from 'react-dom';
import {
  CheckCircle2,
  Download,
  FileText,
  LoaderCircle,
  Save,
  WandSparkles,
} from 'lucide-react';

import type {
  DreamApplicationStatus,
  DreamContractDetails,
  DreamContractDocument,
  DreamContractPaymentMethod,
  PublicityChoice,
} from '@/lib/dream-applications/types';

interface ContractApplication {
  id: string;
  reference: string;
  status: DreamApplicationStatus;
  fullName: string;
  email: string;
  country: string;
  dream: string;
  requestedAmountEur: number;
  locale: 'en' | 'ro' | 'es';
  publicityChoice: PublicityChoice;
  contractDetails?: DreamContractDetails;
  contractNumber?: number;
  contractDocument?: DreamContractDocument;
}

interface ApplicationResponse {
  application: ContractApplication;
  viewer?: {isAdmin?: boolean};
}

interface ContractActionResponse {
  saved?: boolean;
  generated?: boolean;
  error?: string;
}

const PAYMENT_METHODS: Array<{value: DreamContractPaymentMethod; label: string}> = [
  {value: 'direct_supplier_payment', label: 'Direct payment to supplier'},
  {value: 'direct_tcw_purchase', label: 'Direct purchase by TCW'},
  {value: 'direct_tcw_booking', label: 'Booking and direct payment by TCW'},
  {value: 'beneficiary_bank_transfer', label: 'Bank transfer to beneficiary'},
];

function today(): string {
  const date = new Date();
  const offset = date.getTimezoneOffset();
  return new Date(date.getTime() - offset * 60_000).toISOString().slice(0, 10);
}

function selectedApplicationId(): string | null {
  const link = Array.from(document.querySelectorAll<HTMLAnchorElement>('a[href]')).find((element) => (
    element.getAttribute('href')?.includes('/api/admin/dream-applications/')
    && element.getAttribute('href')?.includes('/files/')
  ));
  const href = link?.getAttribute('href') || '';
  const match = href.match(/\/api\/admin\/dream-applications\/([^/]+)\/files\//);
  return match?.[1] ? decodeURIComponent(match[1]) : null;
}

function privateFilesSection(): HTMLElement | null {
  const heading = Array.from(document.querySelectorAll<HTMLHeadingElement>('h3')).find((element) => (
    (element.textContent || '').trim().startsWith('Private files')
  ));
  return heading?.closest('section') || null;
}

function defaultDetails(application: ContractApplication): DreamContractDetails {
  return application.contractDetails || {
    language: application.locale === 'ro' ? 'ro' : 'en',
    fullAddress: '',
    birthDate: '',
    nationality: application.country,
    idDocumentType: '',
    idSeriesNumber: '',
    approvedAmountEur: Math.min(500, Math.max(1, Math.round(application.requestedAmountEur || 500))),
    approvedRequest: application.dream,
    paymentMethod: 'direct_supplier_payment',
    contractDate: today(),
  };
}

function publicityLabel(choice: PublicityChoice): string {
  if (choice === 'full') return 'Full consent';
  if (choice === 'anonymous') return 'Anonymous / limited consent';
  return 'No publicity consent';
}

function formatDate(value?: string): string {
  if (!value) return 'Not generated';
  return new Intl.DateTimeFormat('en-GB', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));
}

export default function DreamContractEnhancer() {
  const [portalHost, setPortalHost] = useState<HTMLDivElement | null>(null);
  const [application, setApplication] = useState<ContractApplication | null>(null);
  const [details, setDetails] = useState<DreamContractDetails | null>(null);
  const [saving, setSaving] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [message, setMessage] = useState<string>();
  const [error, setError] = useState<string>();
  const activeIdRef = useRef<string | null>(null);
  const formIdRef = useRef<string | null>(null);
  const hostRef = useRef<HTMLDivElement | null>(null);

  const removePanel = useCallback(() => {
    hostRef.current?.remove();
    hostRef.current = null;
    activeIdRef.current = null;
    formIdRef.current = null;
    setPortalHost(null);
    setApplication(null);
    setDetails(null);
    setMessage(undefined);
    setError(undefined);
  }, []);

  const loadApplication = useCallback(async (id: string, resetForm = false) => {
    const response = await fetch(`/api/admin/dream-applications/${encodeURIComponent(id)}`, {
      cache: 'no-store',
    });
    if (!response.ok) return null;
    const payload = await response.json() as ApplicationResponse;
    if (!payload.viewer?.isAdmin) return null;
    setApplication(payload.application);
    if (resetForm || formIdRef.current !== id) {
      formIdRef.current = id;
      setDetails(defaultDetails(payload.application));
    }
    return payload.application;
  }, []);

  const synchronize = useCallback(async () => {
    const id = selectedApplicationId();
    const filesSection = privateFilesSection();
    if (!id || !filesSection?.parentElement) {
      if (hostRef.current) removePanel();
      return;
    }
    if (activeIdRef.current === id && hostRef.current?.isConnected) return;
    removePanel();
    const loaded = await loadApplication(id, true);
    if (!loaded || !filesSection.parentElement || !filesSection.isConnected) return;

    const host = document.createElement('div');
    host.dataset.dreamContract = id;
    const emailHost = filesSection.parentElement.querySelector<HTMLElement>('[data-dream-applicant-email]');
    if (emailHost) emailHost.insertAdjacentElement('afterend', host);
    else filesSection.parentElement.insertBefore(host, filesSection);
    activeIdRef.current = id;
    hostRef.current = host;
    setPortalHost(host);
  }, [loadApplication, removePanel]);

  useEffect(() => {
    let disposed = false;
    let synchronizing = false;
    const run = async () => {
      if (disposed || synchronizing) return;
      synchronizing = true;
      try {
        await synchronize();
      } finally {
        synchronizing = false;
      }
    };
    void run();
    const observer = new MutationObserver(() => void run());
    observer.observe(document.body, {childList: true, subtree: true});
    const interval = window.setInterval(() => void run(), 1500);
    return () => {
      disposed = true;
      observer.disconnect();
      window.clearInterval(interval);
      removePanel();
    };
  }, [removePanel, synchronize]);

  useEffect(() => {
    if (!portalHost || !application) return;
    const interval = window.setInterval(() => {
      void loadApplication(application.id, false);
    }, 15_000);
    return () => window.clearInterval(interval);
  }, [application, loadApplication, portalHost]);

  function update<K extends keyof DreamContractDetails>(key: K, value: DreamContractDetails[K]) {
    setDetails((current) => current ? {...current, [key]: value} : current);
    setMessage(undefined);
    setError(undefined);
  }

  async function submit(mode: 'save' | 'generate') {
    if (!application || !details) return;
    if (mode === 'generate') {
      const label = application.contractNumber
        ? `Regenerate contract No. ${application.contractNumber} using the current details?`
        : 'Generate the contract and permanently assign the next number, starting from No. 20?';
      if (!window.confirm(label)) return;
      setGenerating(true);
    } else setSaving(true);
    setError(undefined);
    setMessage(undefined);
    try {
      const response = await fetch(
        `/api/admin/dream-applications/${encodeURIComponent(application.id)}/contract`,
        {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({mode, details}),
        },
      );
      const payload = await response.json().catch(() => ({})) as ContractActionResponse;
      if (!response.ok) throw new Error(payload.error || 'Unable to prepare the contract.');
      await loadApplication(application.id, true);
      setMessage(mode === 'generate' ? 'Contract generated and saved privately in Google Drive.' : 'Contract details saved.');
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Unable to prepare the contract.');
    } finally {
      setSaving(false);
      setGenerating(false);
    }
  }

  if (!portalHost || !application || !details) return null;
  const editable = application.status === 'approved';
  const contractDocument = application.contractDocument;

  return createPortal(
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-5 flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-violet-100 text-violet-700">
          <FileText className="h-5 w-5" />
        </span>
        <div>
          <h3 className="text-lg font-black text-slate-950">Support contract</h3>
          <p className="text-xs font-semibold text-slate-400">Word contract generated from the approved application</p>
        </div>
      </div>

      <div className="mb-5 grid gap-3 sm:grid-cols-3">
        <div className="rounded-2xl bg-slate-50 p-4">
          <p className="text-xs font-bold uppercase tracking-wide text-slate-400">Contract number</p>
          <p className="mt-1 text-lg font-black text-slate-900">
            {application.contractNumber ? `No. ${application.contractNumber}` : 'Assigned on generation'}
          </p>
          {!application.contractNumber && <p className="mt-1 text-xs font-semibold text-slate-500">First portal number: 20</p>}
        </div>
        <div className="rounded-2xl bg-slate-50 p-4">
          <p className="text-xs font-bold uppercase tracking-wide text-slate-400">Publicity choice</p>
          <p className="mt-1 text-sm font-black text-slate-900">{publicityLabel(application.publicityChoice)}</p>
          <p className="mt-1 text-xs font-semibold text-slate-500">Filled automatically from the application</p>
        </div>
        <div className="rounded-2xl bg-slate-50 p-4">
          <p className="text-xs font-bold uppercase tracking-wide text-slate-400">Latest document</p>
          <p className="mt-1 text-sm font-black text-slate-900">{formatDate(contractDocument?.generatedAt)}</p>
          {contractDocument && (
            <a
              href={`/api/admin/dream-applications/${encodeURIComponent(application.id)}/contract/download`}
              className="mt-2 inline-flex items-center gap-2 text-sm font-black text-violet-700 hover:underline"
            >
              <Download className="h-4 w-4" /> Download Word contract
            </a>
          )}
        </div>
      </div>

      {!editable ? (
        <p className="rounded-2xl bg-slate-50 p-4 text-sm font-semibold leading-relaxed text-slate-600">
          Contract details can be edited and generated only while the application is Approved. Existing contracts remain available for download after the case is closed.
        </p>
      ) : (
        <div className="space-y-5">
          <div className="grid gap-4 md:grid-cols-2">
            <label className="text-sm font-bold text-slate-700">
              Contract language
              <select value={details.language} onChange={(event) => update('language', event.target.value as DreamContractDetails['language'])} className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-violet-500 focus:ring-4 focus:ring-violet-100">
                <option value="ro">Romanian</option>
                <option value="en">English</option>
              </select>
            </label>
            <label className="text-sm font-bold text-slate-700">
              Contract date
              <input type="date" value={details.contractDate} onChange={(event) => update('contractDate', event.target.value)} className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-violet-500 focus:ring-4 focus:ring-violet-100" />
            </label>
            <label className="text-sm font-bold text-slate-700 md:col-span-2">
              Full contractual address
              <input value={details.fullAddress} maxLength={500} onChange={(event) => update('fullAddress', event.target.value)} className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-violet-500 focus:ring-4 focus:ring-violet-100" />
            </label>
            <label className="text-sm font-bold text-slate-700">
              Birth date
              <input type="date" value={details.birthDate} onChange={(event) => update('birthDate', event.target.value)} className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-violet-500 focus:ring-4 focus:ring-violet-100" />
            </label>
            <label className="text-sm font-bold text-slate-700">
              Nationality
              <input value={details.nationality} maxLength={100} onChange={(event) => update('nationality', event.target.value)} className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-violet-500 focus:ring-4 focus:ring-violet-100" />
            </label>
            <label className="text-sm font-bold text-slate-700">
              Identity document type
              <input value={details.idDocumentType} maxLength={100} placeholder="Identity card / Passport" onChange={(event) => update('idDocumentType', event.target.value)} className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-violet-500 focus:ring-4 focus:ring-violet-100" />
            </label>
            <label className="text-sm font-bold text-slate-700">
              ID series and number
              <input value={details.idSeriesNumber} maxLength={120} onChange={(event) => update('idSeriesNumber', event.target.value)} className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-violet-500 focus:ring-4 focus:ring-violet-100" />
            </label>
            <label className="text-sm font-bold text-slate-700">
              Approved amount (EUR, maximum 500)
              <input type="number" min={1} max={500} step={1} value={details.approvedAmountEur} onChange={(event) => update('approvedAmountEur', Number(event.target.value))} className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-violet-500 focus:ring-4 focus:ring-violet-100" />
            </label>
            <label className="text-sm font-bold text-slate-700">
              Support method
              <select value={details.paymentMethod} onChange={(event) => update('paymentMethod', event.target.value as DreamContractPaymentMethod)} className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-violet-500 focus:ring-4 focus:ring-violet-100">
                {PAYMENT_METHODS.map((method) => <option key={method.value} value={method.value}>{method.label}</option>)}
              </select>
            </label>
            <label className="text-sm font-bold text-slate-700 md:col-span-2">
              Exact approved request
              <textarea rows={5} maxLength={2000} value={details.approvedRequest} onChange={(event) => update('approvedRequest', event.target.value)} className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-violet-500 focus:ring-4 focus:ring-violet-100" />
            </label>
          </div>

          {error && <p className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-bold text-red-800">{error}</p>}
          {message && <p className="flex items-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-bold text-emerald-800"><CheckCircle2 className="h-5 w-5" />{message}</p>}

          <div className="grid gap-3 sm:grid-cols-2">
            <button type="button" disabled={saving || generating} onClick={() => void submit('save')} className="flex items-center justify-center gap-2 rounded-2xl border border-violet-200 bg-white px-4 py-3 font-black text-violet-700 hover:bg-violet-50 disabled:opacity-50">
              {saving ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} Save contract details
            </button>
            <button type="button" disabled={saving || generating} onClick={() => void submit('generate')} className="flex items-center justify-center gap-2 rounded-2xl bg-violet-600 px-4 py-3 font-black text-white hover:bg-violet-700 disabled:opacity-50">
              {generating ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <WandSparkles className="h-4 w-4" />} {contractDocument ? 'Regenerate Word contract' : 'Generate Word contract'}
            </button>
          </div>
        </div>
      )}
    </section>,
    portalHost,
  );
}
