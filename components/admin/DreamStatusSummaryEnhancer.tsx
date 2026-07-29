'use client';

import {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {createPortal} from 'react-dom';
import {
  BadgeCheck,
  CheckCircle2,
  CircleAlert,
  ClipboardList,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';

import type {
  DreamApplicationListItem,
  DreamApplicationStatus,
} from '@/lib/dream-applications/types';

type StatusFilter = 'all' | DreamApplicationStatus;

type ApplicationsResponse = {
  applications: DreamApplicationListItem[];
  viewer?: {
    isAdmin?: boolean;
  };
};

const STATUS_CARDS: Array<{
  status: Exclude<DreamApplicationStatus, 'draft'>;
  label: string;
  gradient: string;
  icon: React.ReactNode;
}> = [
  {
    status: 'new',
    label: 'New',
    gradient: 'from-fuchsia-500 to-brand-600',
    icon: <Sparkles className="h-6 w-6" />,
  },
  {
    status: 'under_review',
    label: 'Under review',
    gradient: 'from-blue-500 to-cyan-500',
    icon: <ClipboardList className="h-6 w-6" />,
  },
  {
    status: 'more_info_requested',
    label: 'More information',
    gradient: 'from-amber-500 to-orange-500',
    icon: <CircleAlert className="h-6 w-6" />,
  },
  {
    status: 'board_review',
    label: 'Board review',
    gradient: 'from-purple-500 to-violet-600',
    icon: <ShieldCheck className="h-6 w-6" />,
  },
  {
    status: 'approved',
    label: 'Approved',
    gradient: 'from-emerald-500 to-teal-500',
    icon: <BadgeCheck className="h-6 w-6" />,
  },
  {
    status: 'declined',
    label: 'Declined',
    gradient: 'from-rose-500 to-red-500',
    icon: <CircleAlert className="h-6 w-6" />,
  },
  {
    status: 'closed',
    label: 'Closed',
    gradient: 'from-slate-500 to-slate-700',
    icon: <CheckCircle2 className="h-6 w-6" />,
  },
];

function findLegacySummary(): HTMLDivElement | null {
  const candidates = document.querySelectorAll<HTMLDivElement>('div.grid.gap-4');
  return Array.from(candidates).find((element) => {
    const text = element.textContent || '';
    return text.includes('New applications')
      && text.includes('In review')
      && text.includes('Approved');
  }) || null;
}

function findStatusSelect(): HTMLSelectElement | null {
  return Array.from(document.querySelectorAll<HTMLSelectElement>('select')).find((select) => (
    Array.from(select.options).some((option) => option.value === 'all')
    && Array.from(select.options).some((option) => option.value === 'board_review')
  )) || null;
}

function setNativeSelectValue(select: HTMLSelectElement, value: string) {
  const descriptor = Object.getOwnPropertyDescriptor(
    HTMLSelectElement.prototype,
    'value',
  );
  descriptor?.set?.call(select, value);
  select.dispatchEvent(new Event('change', {bubbles: true}));
}

export default function DreamStatusSummaryEnhancer() {
  const [portalHost, setPortalHost] = useState<HTMLDivElement | null>(null);
  const [applications, setApplications] = useState<DreamApplicationListItem[]>([]);
  const [activeStatus, setActiveStatus] = useState<StatusFilter>('all');
  const legacySummaryRef = useRef<HTMLDivElement | null>(null);
  const portalHostRef = useRef<HTMLDivElement | null>(null);

  const removeEnhancement = useCallback(() => {
    if (legacySummaryRef.current?.isConnected) {
      legacySummaryRef.current.style.removeProperty('display');
    }
    portalHostRef.current?.remove();
    legacySummaryRef.current = null;
    portalHostRef.current = null;
    setPortalHost(null);
  }, []);

  const loadApplications = useCallback(async () => {
    const response = await fetch('/api/admin/dream-applications', {
      cache: 'no-store',
    });
    if (!response.ok) return null;

    const payload = await response.json() as ApplicationsResponse;
    if (!payload.viewer?.isAdmin) return null;

    setApplications(payload.applications);
    const filter = findStatusSelect()?.value as StatusFilter | undefined;
    setActiveStatus(filter || 'all');
    return payload;
  }, []);

  const installEnhancement = useCallback(async (legacySummary: HTMLDivElement) => {
    const payload = await loadApplications();
    if (!payload || !legacySummary.parentElement || !legacySummary.isConnected) return;

    removeEnhancement();

    const host = document.createElement('div');
    host.dataset.dreamStatusSummary = 'complete';
    legacySummary.parentElement.insertBefore(host, legacySummary);
    legacySummary.style.display = 'none';

    legacySummaryRef.current = legacySummary;
    portalHostRef.current = host;
    setPortalHost(host);
  }, [loadApplications, removeEnhancement]);

  useEffect(() => {
    let disposed = false;
    let installing = false;

    const synchronize = async () => {
      if (disposed || installing) return;

      const legacySummary = findLegacySummary();
      if (!legacySummary) {
        if (legacySummaryRef.current || portalHostRef.current) removeEnhancement();
        return;
      }

      if (legacySummaryRef.current === legacySummary && portalHostRef.current?.isConnected) {
        return;
      }

      installing = true;
      try {
        await installEnhancement(legacySummary);
      } finally {
        installing = false;
      }
    };

    void synchronize();

    const observer = new MutationObserver(() => {
      void synchronize();
    });
    observer.observe(document.body, {childList: true, subtree: true});

    const interval = window.setInterval(() => {
      void synchronize();
    }, 1500);

    return () => {
      disposed = true;
      observer.disconnect();
      window.clearInterval(interval);
      removeEnhancement();
    };
  }, [installEnhancement, removeEnhancement]);

  useEffect(() => {
    if (!portalHost) return;
    const interval = window.setInterval(() => {
      void loadApplications();
    }, 30000);
    return () => window.clearInterval(interval);
  }, [loadApplications, portalHost]);

  const counts = useMemo<Record<DreamApplicationStatus, number>>(() => ({
    draft: applications.filter((application) => application.status === 'draft').length,
    new: applications.filter((application) => application.status === 'new').length,
    under_review: applications.filter((application) => application.status === 'under_review').length,
    more_info_requested: applications.filter((application) => application.status === 'more_info_requested').length,
    board_review: applications.filter((application) => application.status === 'board_review').length,
    approved: applications.filter((application) => application.status === 'approved').length,
    declined: applications.filter((application) => application.status === 'declined').length,
    closed: applications.filter((application) => application.status === 'closed').length,
  }), [applications]);

  function filterByStatus(status: Exclude<DreamApplicationStatus, 'draft'>) {
    const select = findStatusSelect();
    if (!select) return;

    const nextStatus: StatusFilter = activeStatus === status ? 'all' : status;
    setNativeSelectValue(select, nextStatus);
    setActiveStatus(nextStatus);
  }

  if (!portalHost) return null;

  return createPortal(
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7">
      {STATUS_CARDS.map((card) => {
        const active = activeStatus === card.status;
        return (
          <button
            type="button"
            key={card.status}
            onClick={() => filterByStatus(card.status)}
            aria-pressed={active}
            className={`rounded-3xl border bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${
              active
                ? 'border-brand-400 ring-4 ring-brand-100'
                : 'border-white'
            }`}
          >
            <span className={`flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br ${card.gradient} text-white`}>
              {card.icon}
            </span>
            <span className="mt-5 block text-3xl font-black text-slate-950">
              {counts[card.status]}
            </span>
            <span className="mt-1 block text-sm font-bold text-slate-500">
              {card.label}
            </span>
          </button>
        );
      })}
    </div>,
    portalHost,
  );
}
