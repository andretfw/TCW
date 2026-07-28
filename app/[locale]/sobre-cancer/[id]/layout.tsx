import type {ReactNode} from 'react';

export default function CancerDetailLayout({children}: {children: ReactNode}) {
  return (
    <div className="cancer-detail-route">
      {children}
      <style>{`
        .cancer-detail-route a[href$="/about-cancer"],
        .cancer-detail-route a[href$="/despre-cancer"],
        .cancer-detail-route a[href$="/sobre-cancer"] {
          position: relative;
          z-index: 60;
          pointer-events: auto;
        }
      `}</style>
    </div>
  );
}
