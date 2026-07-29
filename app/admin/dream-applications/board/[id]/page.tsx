import DreamBoardReview from '@/components/admin/DreamBoardReview';

export const dynamic = 'force-dynamic';

export default async function DreamBoardReviewPage({
  params,
}: {
  params: Promise<{id: string}>;
}) {
  const {id} = await params;
  return <DreamBoardReview applicationId={id} />;
}
