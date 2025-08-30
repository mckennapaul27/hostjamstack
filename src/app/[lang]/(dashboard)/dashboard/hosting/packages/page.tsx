'use client'

import { formatCurrency } from '@/lib/utils'
import { CheckIcon, ClockIcon } from '@heroicons/react/24/outline'
import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

// Define basic tiers structure - pricing will come from translations
const tiers = [
  {
    name: 'Growth',
    slug: 'growth',
    priceMonthly: 10,
  },
  {
    name: 'Pro',
    slug: 'pro',
    priceMonthly: 20,
  },
  {
    name: 'Enterprise',
    slug: 'enterprise',
    priceMonthly: null,
  },
]

// Mock purchased plan data
const purchasedPlan = {
  name: 'Growth',
  slug: 'growth',
  billingPeriod: 6, // 6 months
  monthlyPrice: 10,
  totalPrice: 54, // 6 months with 10% discount
  purchaseDate: '2024-01-15',
  expiryDate: '2024-07-15',
  status: 'active',
  nextBillingDate: '2024-07-15',
}

function HostingPackagesContent() {
  const [mounted, setMounted] = useState(false)
  const params = useParams()
  const router = useRouter()
  const lang = (params?.lang as string) || 'en'
  const { t, ready } = useTranslation(['pricing', 'common'])

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleUpgrade = (planSlug: string) => {
    router.push(`/${lang}/dashboard/hosting/checkout?plan=${planSlug}`)
  }

  const formatPrice = (price: number) => formatCurrency(price)

  const getBillingPeriodText = (months: number) => {
    if (months === 1)
      return t('pricing:checkout.billingPeriod.monthly', '1 Month')
    if (months === 6)
      return t('pricing:checkout.billingPeriod.sixMonths', '6 Months')
    if (months === 12)
      return t('pricing:checkout.billingPeriod.yearly', '12 Months')
    return `${months} months`
  }

  // Show loading state until translations are ready and component is mounted
  if (!mounted || !ready) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Hosting Packages</h1>
          <p className="text-gray-600">Loading...</p>
        </div>
        <div className="animate-pulse">
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <div className="mb-4 h-4 w-1/4 rounded bg-gray-200"></div>
            <div className="mb-2 h-6 w-1/2 rounded bg-gray-200"></div>
            <div className="h-4 w-1/3 rounded bg-gray-200"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          {t('pricing:hostingPackages.title', 'Hosting Packages')}
        </h1>
        <p className="text-gray-600">
          {t(
            'pricing:hostingPackages.description',
            'Manage your hosting plans and explore upgrade options',
          )}
        </p>
      </div>

      {/* Current Plan Section */}
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">
            {t('pricing:hostingPackages.currentPlan', 'Current Plan')}
          </h2>
          <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-800">
            <CheckIcon className="mr-1 h-4 w-4" />
            {t('pricing:hostingPackages.active', 'Active')}
          </span>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="mb-4">
              <h3 className="text-xl font-semibold text-gray-900">
                {purchasedPlan.name} Plan
              </h3>
              <p className="text-gray-600">
                {t(`pricing:tiers.${purchasedPlan.slug}.description`)}
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <dt className="text-sm font-medium text-gray-500">
                  {t('pricing:hostingPackages.billingPeriod', 'Billing Period')}
                </dt>
                <dd className="text-sm text-gray-900">
                  {getBillingPeriodText(purchasedPlan.billingPeriod)}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">
                  {t('pricing:hostingPackages.monthlyPrice', 'Monthly Price')}
                </dt>
                <dd className="text-sm text-gray-900">
                  {formatPrice(purchasedPlan.monthlyPrice)}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">
                  {t('pricing:hostingPackages.purchaseDate', 'Purchase Date')}
                </dt>
                <dd className="text-sm text-gray-900">
                  {new Date(purchasedPlan.purchaseDate).toLocaleDateString()}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">
                  {t('pricing:hostingPackages.nextBilling', 'Next Billing')}
                </dt>
                <dd className="text-sm text-gray-900">
                  {new Date(purchasedPlan.nextBillingDate).toLocaleDateString()}
                </dd>
              </div>
            </div>

            {/* Plan Features */}
            <div className="mt-6">
              <h4 className="mb-3 text-sm font-medium text-gray-900">
                {t('pricing:hostingPackages.planFeatures', 'Plan Features')}
              </h4>
              <ul className="space-y-2">
                {(
                  (t(`pricing:tiers.${purchasedPlan.slug}.highlights`, {
                    returnObjects: true,
                  }) as string[]) || []
                )
                  .slice(0, 4)
                  .map((feature: string, index: number) => (
                    <li key={index} className="flex items-start">
                      <CheckIcon className="mt-0.5 mr-2 h-4 w-4 text-green-500" />
                      <span className="text-sm text-gray-600">{feature}</span>
                    </li>
                  ))}
              </ul>
            </div>
          </div>

          <div className="rounded-lg bg-gray-50 p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">
                {formatPrice(purchasedPlan.totalPrice)}
              </div>
              <div className="text-sm text-gray-500">
                for {getBillingPeriodText(purchasedPlan.billingPeriod)}
              </div>
              <div className="mt-4 flex items-center justify-center text-sm text-gray-600">
                <ClockIcon className="mr-1 h-4 w-4" />
                {t('pricing:hostingPackages.renews', 'Renews')}{' '}
                {new Date(purchasedPlan.nextBillingDate).toLocaleDateString()}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Available Plans Section */}
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900">
            {t('pricing:hostingPackages.availablePlans', 'Available Plans')}
          </h2>
          <p className="text-gray-600">
            {t(
              'pricing:hostingPackages.upgradeDescription',
              'Upgrade your hosting plan for better performance and features',
            )}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {tiers.map((tier) => {
            const isCurrentPlan = tier.slug === purchasedPlan.slug
            const isDowngrade =
              tier.slug === 'growth' && purchasedPlan.slug !== 'growth'

            return (
              <div
                key={tier.slug}
                className={`relative rounded-lg border p-6 ${
                  isCurrentPlan
                    ? 'border-green-200 bg-green-50 ring-2 ring-green-500'
                    : 'border-gray-200 bg-white hover:border-purple-300'
                }`}
              >
                {isCurrentPlan && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="inline-flex items-center rounded-full bg-green-500 px-3 py-1 text-xs font-medium text-white">
                      {t('pricing:hostingPackages.currentPlan', 'Current Plan')}
                    </span>
                  </div>
                )}

                <div className="text-center">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {tier.name}
                  </h3>
                  <p className="mt-2 text-sm text-gray-600">
                    {t(`pricing:tiers.${tier.slug}.description`)}
                  </p>

                  <div className="mt-4">
                    {tier.priceMonthly ? (
                      <div className="text-3xl font-bold text-gray-900">
                        {formatPrice(tier.priceMonthly)}
                        <span className="text-sm font-normal text-gray-500">
                          /month
                        </span>
                      </div>
                    ) : (
                      <div className="text-3xl font-bold text-gray-900">
                        {t('pricing:features.values.custom', 'Custom')}
                      </div>
                    )}
                  </div>

                  <div className="mt-6">
                    {isCurrentPlan ? (
                      <button
                        disabled
                        className="w-full cursor-not-allowed rounded-lg bg-green-500 px-4 py-2 text-white"
                      >
                        {t(
                          'pricing:hostingPackages.currentPlan',
                          'Current Plan',
                        )}
                      </button>
                    ) : tier.slug === 'enterprise' ? (
                      <button
                        onClick={() => window.open('/contact', '_blank')}
                        className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-700 hover:bg-gray-50"
                      >
                        {t('pricing:ui.contactUs', 'Contact Us')}
                      </button>
                    ) : isDowngrade ? (
                      <button
                        disabled
                        className="w-full cursor-not-allowed rounded-lg border border-gray-300 bg-gray-100 px-4 py-2 text-gray-400"
                      >
                        {t('pricing:hostingPackages.downgrade', 'Downgrade')}
                      </button>
                    ) : (
                      <button
                        onClick={() => handleUpgrade(tier.slug)}
                        className="w-full rounded-lg bg-gray-950 px-4 py-2 text-white hover:bg-gray-800"
                      >
                        {t('pricing:hostingPackages.upgradeTo', 'Upgrade to')}{' '}
                        {tier.name}
                      </button>
                    )}
                  </div>

                  {/* Features Preview */}
                  <div className="mt-6 text-left">
                    <h4 className="mb-3 text-sm font-medium text-gray-900">
                      {t('pricing:hostingPackages.keyFeatures', 'Key Features')}
                    </h4>
                    <ul className="space-y-1">
                      {(
                        (t(`pricing:tiers.${tier.slug}.highlights`, {
                          returnObjects: true,
                        }) as string[]) || []
                      )
                        .slice(0, 3)
                        .map((feature: string, index: number) => (
                          <li
                            key={index}
                            className="flex items-start text-xs text-gray-600"
                          >
                            <CheckIcon className="mt-0.5 mr-1 h-3 w-3 flex-shrink-0 text-green-500" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      {(
                        (t(`pricing:tiers.${tier.slug}.highlights`, {
                          returnObjects: true,
                        }) as string[]) || []
                      ).length > 3 && (
                        <li className="text-xs text-gray-500">
                          +
                          {(
                            (t(`pricing:tiers.${tier.slug}.highlights`, {
                              returnObjects: true,
                            }) as string[]) || []
                          ).length - 3}{' '}
                          {t(
                            'pricing:hostingPackages.moreFeatures',
                            'more features',
                          )}
                        </li>
                      )}
                    </ul>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default function HostingPackagesPage() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Hosting Packages</h1>
          <p className="text-gray-600">Loading...</p>
        </div>
        <div className="animate-pulse">
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <div className="mb-4 h-4 w-1/4 rounded bg-gray-200"></div>
            <div className="mb-2 h-6 w-1/2 rounded bg-gray-200"></div>
            <div className="h-4 w-1/3 rounded bg-gray-200"></div>
          </div>
        </div>
      </div>
    )
  }

  return <HostingPackagesContent />
}
