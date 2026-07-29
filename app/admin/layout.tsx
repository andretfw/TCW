import type { Metadata } from 'next';

import '../globals.css';

export const metadata: Metadata = {
  title: 'Dream Applications | TCW Private Review',
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
};

export default function AdminLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-950 antialiased">
        {children}
      </body>
    </html>
  );
}

