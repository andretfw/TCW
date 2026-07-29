'use client';

import {useCallback, useEffect, useRef, useState} from 'react';
import {createPortal} from 'react-dom';
import {CheckCircle2, FileUp, LoaderCircle, TriangleAlert} from 'lucide-react';

import type {DreamContractLanguage} from '@/lib/dream-applications/types';

interface TemplateStatusResponse {
  templates?: Record<DreamContractLanguage, boolean>;
  error?: string;
}

export default function DreamContractTemplateEnhancer() {
  const [portalHost, setPortalHost] = useState<HTMLDivElement | null>(null);
  const [templates, setTemplates] = useState<Record<DreamContractLanguage, boolean>>({ro: false, en: false});
  const [uploading, setUploading] = useState<DreamContractLanguage | null>(null);
  const [error, setError] = useState<string>();
  const hostRef = useRef<HTMLDivElement | null>(null);
  const contractHostRef = useRef<HTMLElement | null>(null);

  const removePanel = useCallback(() => {
    hostRef.current?.remove();
    hostRef.current = null;
    contractHostRef.current = null;
    setPortalHost(null);
  }, []);

  const loadStatus = useCallback(async () => {
    const response = await fetch('/api/admin/dream-applications/contract-templates', {
      cache: 'no-store',
    });
    const payload = await response.json().catch(() => ({})) as TemplateStatusResponse;
    if (!response.ok) throw new Error(payload.error || 'Unable to load contract templates.');
    if (payload.templates) setTemplates(payload.templates);
  }, []);

  const synchronize = useCallback(async () => {
    const contractHost = document.querySelector<HTMLElement>('[data-dream-contract]');
    if (!contractHost?.parentElement) {
      if (hostRef.current) removePanel();
      return;
    }
    if (contractHostRef.current === contractHost && hostRef.current?.isConnected) return;
    removePanel();
    const host = document.createElement('div');
    host.dataset.dreamContractTemplates = 'true';
    contractHost.parentElement.insertBefore(host, contractHost);
    hostRef.current = host;
    contractHostRef.current = contractHost;
    setPortalHost(host);
    try {
      await loadStatus();
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Unable to load contract templates.');
    }
  }, [loadStatus, removePanel]);

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

  async function upload(language: DreamContractLanguage, file?: File) {
    if (!file) return;
    setUploading(language);
    setError(undefined);
    try {
      const form = new FormData();
      form.set('language', language);
      form.set('file', file);
      const response = await fetch('/api/admin/dream-applications/contract-templates', {
        method: 'POST',
        body: form,
      });
      const payload = await response.json().catch(() => ({})) as TemplateStatusResponse;
      if (!response.ok) throw new Error(payload.error || 'Unable to upload the template.');
      if (payload.templates) setTemplates(payload.templates);
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : 'Unable to upload the template.');
    } finally {
      setUploading(null);
    }
  }

  if (!portalHost) return null;

  return createPortal(
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-sky-100 text-sky-700">
          <FileUp className="h-5 w-5" />
        </span>
        <div>
          <h3 className="text-lg font-black text-slate-950">Contract templates</h3>
          <p className="text-xs font-semibold text-slate-400">Private Word templates used by the generator</p>
        </div>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {(['ro', 'en'] as const).map((language) => (
          <label key={language} className="flex cursor-pointer items-center justify-between gap-3 rounded-2xl border border-slate-200 p-4 hover:bg-slate-50">
            <span>
              <span className="flex items-center gap-2 font-black text-slate-900">
                {templates[language]
                  ? <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                  : <TriangleAlert className="h-5 w-5 text-amber-600" />}
                {language === 'ro' ? 'Romanian template' : 'English template'}
              </span>
              <span className="mt-1 block text-xs font-semibold text-slate-500">
                {templates[language] ? 'Ready — choose a file to replace it' : 'Missing — upload the .docx file'}
              </span>
            </span>
            <span className="rounded-xl bg-sky-600 px-3 py-2 text-xs font-black text-white">
              {uploading === language ? <LoaderCircle className="h-4 w-4 animate-spin" /> : 'Upload'}
            </span>
            <input
              type="file"
              accept=".docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              disabled={Boolean(uploading)}
              className="sr-only"
              onChange={(event) => {
                const file = event.target.files?.[0];
                event.target.value = '';
                void upload(language, file);
              }}
            />
          </label>
        ))}
      </div>
      {error && <p className="mt-4 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-bold text-red-800">{error}</p>}
    </section>,
    portalHost,
  );
}
