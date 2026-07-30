'use client';

import {useState} from 'react';
import {FileUp, LoaderCircle, ShieldCheck} from 'lucide-react';

function parseCsv(input: string): Record<string, string>[] {
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = '';
  let quoted = false;
  for (let index = 0; index < input.length; index += 1) {
    const char = input[index];
    if (quoted && char === '"' && input[index + 1] === '"') { cell += '"'; index += 1; continue; }
    if (char === '"') { quoted = !quoted; continue; }
    if (!quoted && char === ',') { row.push(cell); cell = ''; continue; }
    if (!quoted && (char === '\n' || char === '\r')) {
      if (char === '\r' && input[index + 1] === '\n') index += 1;
      row.push(cell); rows.push(row); row = []; cell = ''; continue;
    }
    cell += char;
  }
  row.push(cell);
  if (row.some(Boolean)) rows.push(row);
  const [headers, ...data] = rows;
  if (!headers?.length) return [];
  return data.map((values) => Object.fromEntries(headers.map((header, index) => [header.trim(), values[index]?.trim() || '']))).filter((entry) => Object.values(entry).some(Boolean));
}

export default function DreamHistoricalImport({onImported}: {onImported: () => Promise<void>}) {
  const [locale, setLocale] = useState<'ro' | 'en'>('ro');
  const [rows, setRows] = useState<Record<string, string>[]>([]);
  const [filename, setFilename] = useState('');
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string>();

  async function choose(file?: File) {
    if (!file) return;
    setMessage(undefined);
    try {
      const parsed = parseCsv(await file.text());
      if (!parsed.length) throw new Error('This CSV has no application rows.');
      if (parsed.length > 250) throw new Error('Import one file with up to 250 rows at a time.');
      setRows(parsed); setFilename(file.name);
    } catch (error) { setRows([]); setMessage(error instanceof Error ? error.message : 'Unable to read this CSV.'); }
  }

  async function importRows() {
    if (!rows.length || !window.confirm(`Import ${rows.length} historical applications as Closed? No emails, board votes, reminders or Drive files will be created.`)) return;
    setBusy(true); setMessage(undefined);
    try {
      const response = await fetch('/api/admin/dream-applications/import', {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({locale, rows})});
      const payload = await response.json() as {error?: string; imported?: number; skipped?: number};
      if (!response.ok) throw new Error(payload.error || 'Import failed.');
      setMessage(`${payload.imported} imported as Closed${payload.skipped ? `; ${payload.skipped} duplicate row(s) skipped` : ''}.`);
      setRows([]); setFilename(''); await onImported();
    } catch (error) { setMessage(error instanceof Error ? error.message : 'Import failed.'); }
    finally { setBusy(false); }
  }

  return <section className="mb-6 rounded-[2rem] border border-brand-100 bg-brand-50 p-5 shadow-sm md:p-7">
    <div className="flex gap-4"><span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-brand-600 text-white"><FileUp className="h-5 w-5" /></span><div><h2 className="text-xl font-black">Import past Google Form applications</h2><p className="mt-1 text-sm leading-relaxed text-slate-600">Admin-only. Original CSV fields are saved privately. Every imported case is <strong>Closed</strong>; no emails, votes, reminders, contracts or Drive files are created.</p></div></div>
    <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-end"><label className="block text-sm font-bold">Form language<select value={locale} onChange={(event) => setLocale(event.target.value as 'ro' | 'en')} className="mt-2 block rounded-xl border border-slate-200 bg-white px-3 py-2"><option value="ro">Romanian CSV</option><option value="en">English CSV</option></select></label><label className="block flex-1 text-sm font-bold">Google Forms CSV<input type="file" accept=".csv,text/csv" onChange={(event) => void choose(event.target.files?.[0])} className="mt-2 block w-full text-sm" /></label></div>
    {rows.length > 0 && <div className="mt-5 rounded-2xl bg-white p-4"><p className="font-bold">{filename}: {rows.length} row(s) ready</p><p className="mt-1 text-xs text-slate-500">Preview: {Object.values(rows[0]).filter(Boolean).slice(0, 3).join(' · ')}</p><button type="button" disabled={busy} onClick={() => void importRows()} className="mt-4 inline-flex items-center gap-2 rounded-xl bg-slate-950 px-4 py-3 text-sm font-black text-white disabled:opacity-50">{busy ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <ShieldCheck className="h-4 w-4" />} Import as Closed</button></div>}
    {message && <p className="mt-4 text-sm font-semibold text-slate-700" role="status">{message}</p>}
  </section>;
}
