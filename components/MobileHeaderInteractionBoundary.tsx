'use client';

import type {MouseEvent, ReactNode} from 'react';

type MobileHeaderInteractionBoundaryProps = {
  children: ReactNode;
};

export default function MobileHeaderInteractionBoundary({
  children,
}: MobileHeaderInteractionBoundaryProps) {
  const handleMouseDown = (event: MouseEvent<HTMLDivElement>) => {
    if (window.matchMedia('(max-width: 767px)').matches) {
      event.stopPropagation();
    }
  };

  return <div onMouseDown={handleMouseDown}>{children}</div>;
}
