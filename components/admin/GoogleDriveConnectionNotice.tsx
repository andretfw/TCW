'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ExternalLink, HardDrive, LoaderCircle, ShieldCheck, TriangleAlert } from 'lucide-react';
import { getUser } from '@netlify/identity';

interface DriveStatus {
  connected: boolean;
  connectedEmail?: string;
  connectedAt?: string;
  folderConfigured: boolean;
}

export default function GoogleDriveConnectionNotice() {
  const [status, setStatus] = useState<DriveStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let active = true;
    async function load() {
      try {
        const user = await getUser();
        if (!user || !active) return;
        setVisible(true);
        const response = await fetch('/api/admin/google-drive/status', {cache: 'no-store'});
        if (!response.ok) return;
        const payload = await response.json() as DriveStatus;
        if (active) setStatus(payload);
      } finally {
        if (active) setLoading(false);
      }
    }
    void load();
    return () => {
      active = false;
    };
  }, []);

  if (!visible) return null;

  if (loading) {
    return (
      <div className="border-b border-slate-800 bg-slate-950 px-5 py-2 text-xs font-bold text-slate-300">
        <span className="mx-auto flex max-w-[1600px] items-center gap-2">
          <LoaderCircle className="h-4 w-4 animate-spin" />
          Checking private Google Drive connection
        </span>
      </div>
    );
  }

  if (status?.connected && status.folderConfigured) {
    return (
      <div className="border-b border-emerald-200 bg-emerald-50 px-5 py-2 text-xs font-bold text-emerald-900">
        <span className="mx-auto flex max-w-[1600px] items-center gap-2">
          <ShieldCheck className="h-4 w-4" />
          Private Shared Drive connected as {status.connectedEmail}. New documents will be stored in Google Drive, not Netlify Blobs.
        </span>
      </div>
    );
  }

  return (
    <div className="border-b border-amber-200 bg-amber-50 px-5 py-3 text-sm text-amber-950">
      <div className="mx-auto flex max-w-[1600px] flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <TriangleAlert className="mt-0.5 h-5 w-5 shrink-0" />
          <div>
            <p className="font-black">Google Drive document storage is not ready</p>
            <p className="mt-1 text-xs font-medium leading-relaxed">
              {!status?.folderConfigured
                ? 'Add GOOGLE_DRIVE_UPLOAD_FOLDER_ID in Netlify, then connect the TCW Workspace account.'
                : 'Connect the TCW Workspace account once before accepting applications.'}
            </p>
          </div>
        </div>
        <Link
          href="/api/admin/google-drive/oauth/start"
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-slate-950 px-5 py-2.5 text-xs font-black text-white"
        >
          <HardDrive className="h-4 w-4" />
          Connect Google Drive
          <ExternalLink className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  );
}
