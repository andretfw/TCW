import AdminDreamApplications from '@/components/admin/AdminDreamApplications';
import DreamStatusSummaryEnhancer from '@/components/admin/DreamStatusSummaryEnhancer';
import GoogleDriveConnectionNotice from '@/components/admin/GoogleDriveConnectionNotice';

export const dynamic = 'force-dynamic';

export default function DreamApplicationsAdminPage() {
  return (
    <>
      <GoogleDriveConnectionNotice />
      <AdminDreamApplications />
      <DreamStatusSummaryEnhancer />
    </>
  );
}
