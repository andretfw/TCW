import type { CancerId } from '@/lib/routes';

export {};

declare module '@/lib/cancer-guide-trust' {
  export function getCancerGuideTrustContent(
    cancerId: CancerId,
    localeInput: string,
  ):
    | {
        heading: string;
        disclaimer: string;
        sourcesHeading: string;
        checkedLabel: string;
        checkedDate: string;
        statsTitle?: string;
        stats: [
          { value: string; label: string },
          { value: string; label: string },
        ];
        sources: { label: string; href: string }[];
      }
    | undefined;
}
