import DashboardLayoutClient from '@/components/dashboard/dashboard-layout'
import DashboardWrapper from '@/components/dashboard/dashboard-wrapper'
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

  return (
    <DashboardWrapper session={session}>
      <DashboardLayoutClient lang={lang}>{children}</DashboardLayoutClient>
    </DashboardWrapper>
  )
}
