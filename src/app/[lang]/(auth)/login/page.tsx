import { initTranslations } from '@/app/i18n'
import LoginForm from '@/components/auth/login-form'
import { GradientBackground } from '@/components/gradient'
import TranslationsProvider from '@/components/TranslationsProvider'
import type { Metadata } from 'next'
import { Suspense } from 'react'

export const metadata: Metadata = {
  title: 'Login',
  description: 'Sign in to your account to continue.',
}

export default async function Login({
  params,
}: {
  params: Promise<{ lang: string }>
}) {
  const awaitedParams = await params
  const locale = awaitedParams.lang

  // Initialize translations for the common namespace
  const { resources } = await initTranslations(locale, ['common'])

  return (
    <main className="overflow-hidden bg-gray-50">
      <GradientBackground />
      <TranslationsProvider
        namespaces={['common']}
        locale={locale}
        resources={resources}
      >
        <Suspense fallback={<LoginFormSkeleton />}>
          <LoginForm locale={locale} />
        </Suspense>
      </TranslationsProvider>
    </main>
  )
}

// Loading skeleton for the login form
function LoginFormSkeleton() {
  return (
    <div className="isolate flex min-h-dvh items-center justify-center p-6 lg:p-8">
      <div className="w-full max-w-md rounded-xl bg-white shadow-md ring-1 ring-black/5">
        <div className="p-7 sm:p-11">
          <div className="flex items-start">
            <div className="h-8 w-8 animate-pulse rounded bg-gray-200" />
          </div>
          <div className="mt-8 h-6 w-32 animate-pulse rounded bg-gray-200" />
          <div className="mt-1 h-4 w-48 animate-pulse rounded bg-gray-200" />

          <div className="mt-8 space-y-3">
            <div className="h-4 w-12 animate-pulse rounded bg-gray-200" />
            <div className="h-10 w-full animate-pulse rounded-lg bg-gray-200" />
          </div>

          <div className="mt-8 space-y-3">
            <div className="h-4 w-16 animate-pulse rounded bg-gray-200" />
            <div className="h-10 w-full animate-pulse rounded-lg bg-gray-200" />
          </div>

          <div className="mt-8 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-4 w-4 animate-pulse rounded bg-gray-200" />
              <div className="h-4 w-24 animate-pulse rounded bg-gray-200" />
            </div>
            <div className="h-4 w-32 animate-pulse rounded bg-gray-200" />
          </div>

          <div className="mt-8">
            <div className="h-10 w-full animate-pulse rounded-lg bg-gray-200" />
          </div>
        </div>

        <div className="m-1.5 rounded-lg bg-gray-50 py-4 text-center ring-1 ring-black/5">
          <div className="mx-auto h-4 w-48 animate-pulse rounded bg-gray-200" />
        </div>
      </div>
    </div>
  )
}
