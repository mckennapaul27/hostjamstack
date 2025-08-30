import { initTranslations } from '@/app/i18n'
import { Button } from '@/components/button'
import { Container } from '@/components/container'
import { Footer } from '@/components/footer'
import { GradientBackground } from '@/components/gradient'
import { Navbar } from '@/components/navbar'
import { Heading, Subheading } from '@/components/text'
import { CheckCircleIcon } from '@heroicons/react/24/outline'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Registration Complete',
  description: 'Your account has been created successfully.',
}

export default async function Confirmation({
  params,
  searchParams,
}: {
  params: Promise<{ lang: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const locale = (await params).lang
  const urlSearchParams = await searchParams

  // Initialize translations for the common namespace
  const { t } = await initTranslations(locale, ['common'])

  // Extract context from URL parameters
  const domain = urlSearchParams.domain as string
  const domainPrice = urlSearchParams.price as string
  const years = urlSearchParams.years as string
  const premium = urlSearchParams.premium as string

  const plan = urlSearchParams.plan as string
  const planName = urlSearchParams.planName as string
  const hostingPrice = urlSearchParams.price as string
  const billingPeriod = urlSearchParams.billingPeriod as string
  const priceMonthly = urlSearchParams.priceMonthly as string

  const supportPackage = urlSearchParams.supportPackage as string
  const packageName = urlSearchParams.packageName as string
  const supportPrice = urlSearchParams.price as string
  const currency = urlSearchParams.currency as string
  const billing = urlSearchParams.billing as string

  // Determine context type
  const isDomainContext = !!domain
  const isHostingContext = !!plan
  const isSupportContext = !!supportPackage

  const getNextStepUrl = () => {
    // For now, we'll create a simple payment page URL
    // Later this can be more sophisticated
    if (isDomainContext) {
      const params = new URLSearchParams()
      if (domain) params.set('domain', domain)
      if (domainPrice) params.set('price', domainPrice)
      if (years) params.set('years', years)
      if (premium) params.set('premium', premium)
      return `/${locale}/payment/domain?${params.toString()}`
    }

    if (isHostingContext) {
      const params = new URLSearchParams()
      if (plan) params.set('plan', plan)
      if (planName) params.set('planName', planName)
      if (hostingPrice) params.set('price', hostingPrice)
      if (billingPeriod) params.set('billingPeriod', billingPeriod)
      if (priceMonthly) params.set('priceMonthly', priceMonthly)
      return `/${locale}/payment/hosting?${params.toString()}`
    }

    if (isSupportContext) {
      const params = new URLSearchParams()
      if (supportPackage) params.set('supportPackage', supportPackage)
      if (packageName) params.set('packageName', packageName)
      if (supportPrice) params.set('price', supportPrice)
      if (currency) params.set('currency', currency)
      if (billing) params.set('billing', billing)
      return `/${locale}/payment/support?${params.toString()}`
    }

    return `/${locale}/dashboard`
  }

  return (
    <main className="overflow-hidden">
      <GradientBackground />
      <Container>
        <Navbar locale={locale} />
      </Container>
      <Container>
        <div className="mx-auto max-w-2xl py-16 text-center">
          <div className="mb-8 flex justify-center">
            <CheckCircleIcon className="h-16 w-16 text-green-500" />
          </div>

          <Subheading className="text-green-600">
            {t('auth.confirmation.title')}
          </Subheading>
          <Heading as="h1" className="mt-2">
            {t('auth.confirmation.welcome')}
          </Heading>

          <div className="mt-8 rounded-lg bg-white p-6 text-left shadow-sm ring-1 ring-black/5">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">
              {t('auth.confirmation.nextSteps')}
            </h2>

            {isDomainContext && (
              <div className="mb-4 rounded-lg bg-purple-50 p-4">
                <h3 className="font-medium text-purple-900">
                  {t('auth.confirmation.domainPurchase')}
                </h3>
                <p className="mt-1 text-purple-700">
                  {t('auth.confirmation.completePayment')}{' '}
                  <strong>{domain}</strong>
                </p>
                <p className="mt-1 text-sm text-purple-600">
                  €{domainPrice} for {years}{' '}
                  {parseInt(years || '1') === 1
                    ? t('auth.register.year')
                    : t('auth.register.years')}
                  {premium === 'true' && (
                    <span className="ml-2 font-medium text-orange-600">
                      ({t('auth.register.premium')} Domain)
                    </span>
                  )}
                </p>
              </div>
            )}

            {isHostingContext && (
              <div className="mb-4 rounded-lg bg-purple-50 p-4">
                <h3 className="font-medium text-purple-900">
                  {t('auth.confirmation.hostingPlan')}
                </h3>
                <p className="mt-1 text-purple-700">
                  {t('auth.confirmation.completePayment')}{' '}
                  <strong>{planName} Plan</strong>
                </p>
                <p className="mt-1 text-sm text-purple-600">
                  €{hostingPrice} for{' '}
                  {billingPeriod === '1'
                    ? '1 month'
                    : billingPeriod === '6'
                      ? '6 months'
                      : billingPeriod === '12'
                        ? '12 months'
                        : `${billingPeriod} months`}
                  {priceMonthly && (
                    <span className="ml-2">(€{priceMonthly}/month)</span>
                  )}
                </p>
              </div>
            )}

            {isSupportContext && (
              <div className="mb-4 rounded-lg bg-purple-50 p-4">
                <h3 className="font-medium text-purple-900">
                  {t('auth.confirmation.supportPackage')}
                </h3>
                <p className="mt-1 text-purple-700">
                  {t('auth.confirmation.completePayment')}{' '}
                  <strong>{packageName}</strong>
                </p>
                <p className="mt-1 text-sm text-purple-600">
                  €{supportPrice} • {t('auth.confirmation.oneTimePayment')}
                </p>
              </div>
            )}

            <div className="space-y-3 text-sm text-gray-600">
              <p>✓ {t('auth.confirmation.accountCreated')}</p>
              <p>✓ {t('auth.confirmation.confirmationEmail')}</p>
              <p>✓ {t('auth.confirmation.completePaymentActivate')}</p>
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Button href={getNextStepUrl()} className="flex-1 sm:flex-none">
              {t('auth.confirmation.continueToPayment')}
            </Button>
            <Button
              href={`/${locale}/dashboard`}
              variant="outline"
              className="flex-1 sm:flex-none"
            >
              {t('auth.confirmation.goToDashboard')}
            </Button>
          </div>

          <p className="mt-6 text-sm text-gray-500">
            {t('auth.confirmation.needHelp')}{' '}
            <a
              href="mailto:support@hostjamstack.com"
              className="text-purple-600 hover:text-purple-500"
            >
              support@hostjamstack.com
            </a>
          </p>
        </div>
      </Container>
      <Footer locale={locale} />
    </main>
  )
}
