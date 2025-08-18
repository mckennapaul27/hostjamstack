export const i18n = {
  locales: ['en', 'de', 'fr', 'pl', 'es'] as const,
  defaultLocale: 'en',
  prefixDefault: true,
} as const

export type Locale = (typeof i18n)['locales'][number]

export const isValidLocale = (lang: string): lang is Locale =>
  (i18n.locales as readonly string[]).includes(lang)
