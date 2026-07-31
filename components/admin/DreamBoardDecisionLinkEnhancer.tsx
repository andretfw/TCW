'use client';

import {useCallback, useEffect, useState} from 'react';
import {createPortal} from 'react-dom';
import {Gavel} from 'lucide-react';

function selectedApplicationId(): string | null {
  const selected = document.querySelector<HTMLElement>('[data-dream-application-id]');
  return selected?.dataset.dreamApplicationId || null;
}

function findStatusSelect(): HTMLSelectElement | null {
  return Array.from(document.querySelectorAll<HTMLSelectElement>('select')).find((select) => {
    const values = Array.from(select.options).map((option) => option.value);
    return values.includes('board_review')
      && values.includes('approved')
      && values.includes('declined')
      && !values.includes('all');
  }) || null;
}

export default function DreamBoardDecisionLinkEnhancer() {
  const [host, setHost] = useState<HTMLDivElement | null>(null);
  const [applicationId, setApplicationId] = useState<string>();
  const [boardReviewOpen, setBoardReviewOpen] = useState(false);

  const synchronize = useCallback(() => {
    const select = findStatusSelect();
    const id = selectedApplicationId();
    const open = Boolean(select && id && select.value === 'board_review');
    setApplicationId(id || undefined);
    setBoardReviewOpen(open);

    if (!select || !open) {
      host?.remove();
      setHost(null);
      return;
    }
    if (host?.isConnected) return;

    const nextHost = document.createElement('div');
    nextHost.dataset.dreamBoardDecisionLink = 'true';
    select.insertAdjacentElement('afterend', nextHost);
    setHost(nextHost);
  }, [host]);

  useEffect(() => {
    const initialSync = window.setTimeout(synchronize, 0);
    const observer = new MutationObserver(synchronize);
    observer.observe(document.body, {childList: true, subtree: true});
    const interval = window.setInterval(synchronize, 1000);
    return () => {
      window.clearTimeout(initialSync);
      observer.disconnect();
      window.clearInterval(interval);
      host?.remove();
    };
  }, [host, synchronize]);

  if (!host || !applicationId || !boardReviewOpen) return null;

  return createPortal(
    <a
      href={`/admin/dream-applications/board/${encodeURIComponent(applicationId)}`}
      className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-purple-300 bg-purple-50 px-3 py-2.5 text-xs font-black text-purple-800 hover:bg-purple-100"
    >
      <Gavel className="h-4 w-4" />
      Open Board voting & final decision
    </a>,
    host,
  );
}
