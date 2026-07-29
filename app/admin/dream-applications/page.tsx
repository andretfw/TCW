import AdminDreamApplications from '@/components/admin/AdminDreamApplications';
import DreamApplicantEmailEnhancer from '@/components/admin/DreamApplicantEmailEnhancer';
import DreamStatusSummaryEnhancer from '@/components/admin/DreamStatusSummaryEnhancer';
import GoogleDriveConnectionNotice from '@/components/admin/GoogleDriveConnectionNotice';

export const dynamic = 'force-dynamic';

export default function DreamApplicationsAdminPage() {
  return (
    <>
      <GoogleDriveConnectionNotice />
      <AdminDreamApplications />
      <DreamStatusSummaryEnhancer />
      <DreamApplicantEmailEnhancer />
    </>
  );
}
