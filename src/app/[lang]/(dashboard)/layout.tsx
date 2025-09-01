import { initTranslations } from '@/app/i18n'
import DashboardLayoutClient from '@/components/dashboard/dashboard-layout'
import DashboardWrapper from '@/components/dashboard/dashboard-wrapper'
import TranslationsProvider from '@/components/TranslationsProvider'
import { authOptions } from '@/utils/auth-helpers'
import { type Metadata } from 'next'
import { getServerSession } from 'next-auth'
import { notFound, redirect } from 'next/navigation'

export const metadata: Metadata = {
  title: 'Dashboard | HostJamstack',
  description: 'Manage your domains, hosting, and support packages',
}

interface DashboardLayoutProps {
  children: React.ReactNode
  params: Promise<{ lang: string }>
}

export default async function DashboardLayout({
  children,
  params,
}: DashboardLayoutProps) {
  const { lang } = await params

  // Redirect if language is not supported
  const supportedLanguages = ['en', 'es', 'fr', 'de', 'pl']
  if (!supportedLanguages.includes(lang)) {
    notFound()
  }

  // Check authentication
  const session = await getServerSession(authOptions)
  if (!session) {
    redirect(`/${lang}/login`)
  }

  // Initialize translations with the namespaces needed for dashboard pages
  const { resources } = await initTranslations(lang, [
    'common',
    'dashboard',
    'domains',
    'payment',
    'pricing',
    'support-packages',
  ])

  return (
    <DashboardWrapper session={session}>
      <TranslationsProvider
        namespaces={[
          'common',
          'dashboard',
          'domains',
          'payment',
          'pricing',
          'support-packages',
        ]}
        locale={lang}
        resources={resources}
      >
        <DashboardLayoutClient lang={lang}>{children}</DashboardLayoutClient>
      </TranslationsProvider>
    </DashboardWrapper>
  )
}
