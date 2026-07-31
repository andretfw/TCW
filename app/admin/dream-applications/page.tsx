import AdminDreamApplications from '@/components/admin/AdminDreamApplications';
import DreamApplicantEmailEnhancer from '@/components/admin/DreamApplicantEmailEnhancer';
import DreamBoardDecisionLinkEnhancer from '@/components/admin/DreamBoardDecisionLinkEnhancer';
import DreamBoardReviewEmailEnhancer from '@/components/admin/DreamBoardReviewEmailEnhancer';
import DreamContractEnhancer from '@/components/admin/DreamContractEnhancer';
import DreamContractTemplateEnhancer from '@/components/admin/DreamContractTemplateEnhancer';
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
      <DreamBoardReviewEmailEnhancer />
      <DreamBoardDecisionLinkEnhancer />
      <DreamContractEnhancer />
      <DreamContractTemplateEnhancer />
    </>
  );
}
