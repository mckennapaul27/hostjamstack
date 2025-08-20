import { initTranslations } from '@/app/i18n'
import TranslationsProvider from '@/components/TranslationsProvider'
import { i18n, isValidLocale } from '@/i18n-config'
import '@/styles/tailwind.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: {
    template: '%s - Host Jamstack',
    default: 'Host Jamstack - Premium Jamstack Hosting & Deployment',
  },
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ lang: string }>
}) {
  const awaitedParams = await params
  let locale = awaitedParams.lang

  // Validate locale and fallback to default if invalid
  if (!isValidLocale(awaitedParams.lang)) {
    locale = i18n.defaultLocale
  }

  // Initialize translations with common namespace
  const { resources } = await initTranslations(locale, ['common'])

  return (
    <html lang={locale}>
      <head>
        <link
          rel="stylesheet"
          href="https://api.fontshare.com/css?f%5B%5D=switzer@400,500,600,700&amp;display=swap"
        />
        <link
          rel="alternate"
          type="application/rss+xml"
          title="The Host Jamstack Blog"
          href="/blog/feed.xml"
        />
      </head>
      <body className="text-gray-950 antialiased">
        <TranslationsProvider
          namespaces={['common']}
          locale={locale}
          resources={resources}
        >
          {children}
        </TranslationsProvider>
      </body>
    </html>
  )
}

export async function generateStaticParams() {
  return i18n.locales.map((locale) => ({ lang: locale }))
}
