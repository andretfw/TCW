import type {Metadata} from 'next';
import type {ReactNode} from 'react';
import {
  getStandardPageMetadata,
  type StandardSeoRoute,
} from '@/lib/standard-page-seo';

type MetadataProps = {
  params: Promise<{locale: string}>;
};

export function createStandardPageMetadata(route: StandardSeoRoute) {
  return async function generateMetadata({
    params,
  }: MetadataProps): Promise<Metadata> {
    const {locale} = await params;
    return getStandardPageMetadata(route, locale);
  };
}

export function StandardPageLayout({children}: {children: ReactNode}) {
  return children;
}
