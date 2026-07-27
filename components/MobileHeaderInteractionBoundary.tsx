'use client';

import {useEffect, useRef, type ReactNode} from 'react';

type MobileHeaderInteractionBoundaryProps = {
  children: ReactNode;
};

export default function MobileHeaderInteractionBoundary({
  children,
}: MobileHeaderInteractionBoundaryProps) {
  const boundaryRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const boundary = boundaryRef.current;
    if (!boundary) return;

    const stopMobileMouseDown = (event: MouseEvent) => {
      if (window.matchMedia('(max-width: 767px)').matches) {
        event.stopPropagation();
      }
    };

    boundary.addEventListener('mousedown', stopMobileMouseDown);
    return () => boundary.removeEventListener('mousedown', stopMobileMouseDown);
  }, []);

  return <div ref={boundaryRef}>{children}</div>;
}
