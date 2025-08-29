import { initTranslations } from '@/app/i18n'
import RegisterForm from '@/components/auth/register-form'
import { GradientBackground } from '@/components/gradient'
import TranslationsProvider from '@/components/TranslationsProvider'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Create Account',
  description: 'Create your account to complete your domain registration.',
}

export default async function Register({
  params,
  searchParams,
}: {
  params: Promise<{ lang: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const locale = (await params).lang
  const urlSearchParams = await searchParams

  // Initialize translations for the common namespace
  const { resources } = await initTranslations(locale, ['common'])

  // Extract domain context from URL parameters
  const domain = urlSearchParams.domain as string
  const domainPrice = urlSearchParams.price as string
  const years = urlSearchParams.years as string
  const premium = urlSearchParams.premium as string

  // Extract hosting context from URL parameters
  const plan = urlSearchParams.plan as string
  const planName = urlSearchParams.planName as string
  const hostingPrice = urlSearchParams.price as string
  const billingPeriod = urlSearchParams.billingPeriod as string
  const priceMonthly = urlSearchParams.priceMonthly as string

  // Extract support package context from URL parameters
  const supportPackage = urlSearchParams.supportPackage as string
  const packageName = urlSearchParams.packageName as string
  const supportPrice = urlSearchParams.price as string
  const currency = urlSearchParams.currency as string
  const billing = urlSearchParams.billing as string

  // Determine context type
  const isDomainContext = !!domain
  const isHostingContext = !!plan
  const isSupportContext = !!supportPackage

  return (
    <main className="overflow-hidden bg-gray-50">
      <GradientBackground />
      <TranslationsProvider
        namespaces={['common']}
        locale={locale}
        resources={resources}
      >
        <div className="isolate flex min-h-dvh items-center justify-center p-6 lg:p-8">
          <div className="w-full max-w-5xl">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
              {/* Context Display - Left Side on Large Screens */}
              {(isDomainContext || isHostingContext || isSupportContext) && (
                <ContextDisplay
                  locale={locale}
                  isDomainContext={isDomainContext}
                  isHostingContext={isHostingContext}
                  isSupportContext={isSupportContext}
                  domain={domain}
                  domainPrice={domainPrice}
                  years={years}
                  premium={premium}
                  planName={planName}
                  hostingPrice={hostingPrice}
                  billingPeriod={billingPeriod}
                  priceMonthly={priceMonthly}
                  packageName={packageName}
                  supportPrice={supportPrice}
                  currency={currency}
                  billing={billing}
                />
              )}

              {/* Registration Form - Takes remaining space */}
              <div
                className={
                  isDomainContext || isHostingContext || isSupportContext
                    ? 'lg:col-span-2'
                    : 'mx-auto max-w-md lg:col-span-3'
                }
              >
                <RegisterForm
                  locale={locale}
                  isDomainContext={isDomainContext}
                  isHostingContext={isHostingContext}
                  isSupportContext={isSupportContext}
                  domain={domain}
                  domainPrice={domainPrice}
                  years={years}
                  premium={premium}
                  plan={plan}
                  planName={planName}
                  hostingPrice={hostingPrice}
                  billingPeriod={billingPeriod}
                  priceMonthly={priceMonthly}
                  supportPackage={supportPackage}
                  packageName={packageName}
                  supportPrice={supportPrice}
                  currency={currency}
                  billing={billing}
                />
              </div>
            </div>
          </div>
        </div>
      </TranslationsProvider>
    </main>
  )
}

// Context Display Component (Server Component)
async function ContextDisplay({
  locale,
  isDomainContext,
  isHostingContext,
  isSupportContext,
  domain,
  domainPrice,
  years,
  premium,
  planName,
  hostingPrice,
  billingPeriod,
  priceMonthly,
  packageName,
  supportPrice,
  currency,
  billing,
}: {
  locale: string
  isDomainContext: boolean
  isHostingContext: boolean
  isSupportContext: boolean
  domain?: string
  domainPrice?: string
  years?: string
  premium?: string
  planName?: string
  hostingPrice?: string
  billingPeriod?: string
  priceMonthly?: string
  packageName?: string
  supportPrice?: string
  currency?: string
  billing?: string
}) {
  const { t } = await initTranslations(locale, ['common'])
  return (
    <div className="lg:col-span-1">
      <div className="rounded-xl border border-blue-200 bg-blue-50 p-6 shadow-sm">
        {isDomainContext && (
          <>
            <h3 className="text-base font-medium text-blue-900">
              {t('auth.register.domainContext')}
            </h3>
            <p className="mt-2 text-xl font-bold text-blue-900">{domain}</p>
            {domainPrice && years && (
              <div className="mt-4 space-y-2">
                <p className="text-sm text-blue-700">
                  <span className="font-medium">
                    {t('auth.register.price')}
                  </span>{' '}
                  €{domainPrice}
                </p>
                <p className="text-sm text-blue-700">
                  <span className="font-medium">
                    {t('auth.register.period')}
                  </span>{' '}
                  {years}{' '}
                  {parseInt(years) === 1
                    ? t('auth.register.year')
                    : t('auth.register.years')}
                </p>
                {premium === 'true' && (
                  <p className="text-sm font-medium text-orange-600">
                    {t('auth.register.premium')} Domain
                  </p>
                )}
              </div>
            )}
          </>
        )}

        {isHostingContext && (
          <>
            <h3 className="text-base font-medium text-blue-900">
              {t('auth.register.hostingContext')}
            </h3>
            <p className="mt-2 text-xl font-bold text-blue-900">
              {planName} {t('auth.register.plan')}
            </p>
            {hostingPrice && billingPeriod && (
              <div className="mt-4 space-y-2">
                <p className="text-sm text-blue-700">
                  <span className="font-medium">
                    {t('auth.register.totalPrice')}
                  </span>{' '}
                  €{hostingPrice}
                </p>
                <p className="text-sm text-blue-700">
                  <span className="font-medium">
                    {t('auth.register.billingPeriod')}
                  </span>{' '}
                  {billingPeriod === '1'
                    ? t('auth.confirmation.oneMonth')
                    : billingPeriod === '6'
                      ? t('auth.confirmation.sixMonths')
                      : billingPeriod === '12'
                        ? t('auth.confirmation.twelveMonths')
                        : `${billingPeriod} ${t('common:months')}`}
                </p>
                {priceMonthly && (
                  <p className="text-sm text-blue-700">
                    <span className="font-medium">
                      {t('auth.register.monthly')}
                    </span>{' '}
                    €{priceMonthly}/month
                  </p>
                )}
              </div>
            )}
          </>
        )}

        {isSupportContext && (
          <>
            <h3 className="text-base font-medium text-blue-900">
              {t('auth.register.supportContext')}
            </h3>
            <p className="mt-2 text-xl font-bold text-blue-900">
              {packageName}
            </p>
            {supportPrice && currency && (
              <div className="mt-4 space-y-2">
                <p className="text-sm text-blue-700">
                  <span className="font-medium">
                    {t('auth.register.price')}
                  </span>{' '}
                  €{supportPrice}
                </p>
                <p className="text-sm text-blue-700">
                  <span className="font-medium">{t('auth.register.type')}</span>{' '}
                  {billing === 'one-off'
                    ? t('auth.register.oneTimePayment')
                    : billing}
                </p>
                <p className="text-sm text-blue-700">
                  <span className="font-medium">
                    {t('auth.register.delivery')}
                  </span>{' '}
                  {t('auth.register.businessDays')}
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
