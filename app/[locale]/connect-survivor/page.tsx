import ConnectApplication from '@/components/connect/ConnectApplication';
import ConnectProfileAccessButton from '@/components/connect/ConnectProfileAccessButton';

export default async function ConnectSurvivorPage({
  params,
}: {
  params: Promise<{locale: string}>;
}) {
  const {locale: rawLocale} = await params;
  const locale = rawLocale === 'ro' || rawLocale === 'es' ? rawLocale : 'en';

  return (
    <>
      <ConnectApplication />
      <ConnectProfileAccessButton locale={locale} />
    </>
  );
}
