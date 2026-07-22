import {getRequestConfig} from 'next-intl/server';

export const locales = ['es', 'en', 'ro'] as const;
export type Locale = (typeof locales)[number];

const defaultLocale: Locale = 'es';

export default getRequestConfig(async ({requestLocale}) => {
  const requestedLocale = await requestLocale;
  const locale = locales.includes(requestedLocale as Locale)
    ? (requestedLocale as Locale)
    : defaultLocale;

  return {
    locale,
    messages: (await import(`./messages/${locale}.json`)).default,
  };
});
