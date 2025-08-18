export const i18n = {
  locales: [
    'en', // English
    'es', // Spanish
    'de', // German
    'fr', // French
    'pl', // Polish
  ],
  defaultLocale: 'en',
  prefixDefault: true,
} as const

export type Locale = (typeof i18n)['locales'][number]

export const isValidLocale = (lang: string): lang is Locale => {
  return i18n.locales.includes(lang as Locale)
}
