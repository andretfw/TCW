import type {Metadata} from 'next';

import AdminConnectSafety from '@/components/admin/AdminConnectSafety';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'TCW Connect safety review',
  robots: {index: false, follow: false, nocache: true},
  referrer: 'no-referrer',
};

export default function ConnectSafetyAdminPage() {
  return <AdminConnectSafety />;
}
