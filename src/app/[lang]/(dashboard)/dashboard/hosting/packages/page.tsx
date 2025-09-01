'use client'

import type { HostingPackage } from '@/lib/dashboard-api'
import { demoApiProvider } from '@/lib/demo-api-provider'
import { formatCurrency } from '@/lib/utils'
import { CheckIcon, ClockIcon } from '@heroicons/react/24/outline'
import { useSession } from 'next-auth/react'
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

function HostingPackagesContent() {
  const { data: session } = useSession()
  const [mounted, setMounted] = useState(false)
  const [hostingPackages, setHostingPackages] = useState<HostingPackage[]>([])
  const [loading, setLoading] = useState(true)
  const params = useParams()
  const router = useRouter()
  const lang = (params?.lang as string) || 'en'
  const { t, ready } = useTranslation(['pricing', 'common', 'dashboard'])

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const fetchHostingPackages = async () => {
      if (!session?.rawJwt) return

      try {
        const data = await demoApiProvider.getHostingPackages(
          session.rawJwt,
          session.user?.email,
        )
        setHostingPackages(data)
      } catch (error) {
        console.error('Failed to fetch hosting packages:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchHostingPackages()
  }, [session?.rawJwt, session?.user?.email])

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

      {/* Active Hosting Packages */}
      <div className="space-y-6">
        <h2 className="text-lg font-semibold text-gray-900">
          {t('dashboard:hostingPackages.activePackages')}
        </h2>

        {hostingPackages.length > 0 ? (
          <div className="space-y-4">
            {hostingPackages.map((hostingPackage) => (
              <div
                key={hostingPackage._id}
                className="rounded-lg border border-gray-200 bg-white p-6"
              >
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {hostingPackage.packageName}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {t('dashboard:hostingPackages.created')}{' '}
                      {new Date(hostingPackage.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-800">
                    <CheckIcon className="mr-1 h-4 w-4" />
                    {t('dashboard:hostingPackages.active')}
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                  <div className="lg:col-span-2">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <dt className="text-sm font-medium text-gray-500">
                          {t('dashboard:hostingPackages.billingCycle')}
                        </dt>
                        <dd className="text-sm text-gray-900">
                          {hostingPackage.billingCycle === 'yearly'
                            ? t('dashboard:hostingPackages.annual')
                            : t('dashboard:hostingPackages.monthly')}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500">
                          {t('dashboard:hostingPackages.price')}
                        </dt>
                        <dd className="text-sm text-gray-900">
                          €{hostingPackage.price.toFixed(2)}/
                          {hostingPackage.billingCycle === 'yearly'
                            ? t('dashboard:hostingPackages.year')
                            : t('dashboard:hostingPackages.month')}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500">
                          {t('dashboard:hostingPackages.nextBilling')}
                        </dt>
                        <dd className="text-sm text-gray-900">
                          {new Date(
                            hostingPackage.nextBillingDate,
                          ).toLocaleDateString()}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500">
                          {t('dashboard:hostingPackages.autoRenew')}
                        </dt>
                        <dd className="text-sm text-gray-900">
                          {hostingPackage.autoRenew
                            ? t('dashboard:hostingPackages.enabled')
                            : t('dashboard:hostingPackages.disabled')}
                        </dd>
                      </div>
                    </div>

                    {/* Plan Features */}
                    <div className="mt-6">
                      <h4 className="mb-3 text-sm font-medium text-gray-900">
                        {t('dashboard:hostingPackages.features')}
                      </h4>
                      <ul className="grid grid-cols-1 gap-2 md:grid-cols-2">
                        {hostingPackage.features.map((feature, index) => (
                          <li key={index} className="flex items-start">
                            <CheckIcon className="mt-0.5 mr-2 h-4 w-4 flex-shrink-0 text-green-500" />
                            <span className="text-sm text-gray-600">
                              {feature}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="rounded-lg bg-gray-50 p-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900">
                        €{hostingPackage.price.toFixed(2)}
                      </div>
                      <div className="text-sm text-gray-500">
                        {t('dashboard:hostingPackages.per')}{' '}
                        {hostingPackage.billingCycle === 'yearly'
                          ? t('dashboard:hostingPackages.year')
                          : t('dashboard:hostingPackages.month')}
                      </div>
                      <div className="mt-4 space-y-2">
                        <div className="flex items-center justify-center text-sm text-gray-600">
                          <ClockIcon className="mr-1 h-4 w-4" />
                          {t('dashboard:hostingPackages.renews')}{' '}
                          {new Date(
                            hostingPackage.nextBillingDate,
                          ).toLocaleDateString()}
                        </div>

                        {/* Usage Stats */}
                        <div className="space-y-1 pt-2 text-xs text-gray-500">
                          <div>
                            {t('dashboard:hostingPackages.storage')}:{' '}
                            {hostingPackage.currentUsage.storage}GB /{' '}
                            {hostingPackage.storage}GB
                          </div>
                          <div>
                            {t('dashboard:hostingPackages.bandwidth')}:{' '}
                            {hostingPackage.currentUsage.bandwidth}GB /{' '}
                            {hostingPackage.bandwidth}GB
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-lg border border-gray-200 bg-white p-8 text-center">
            <p className="text-gray-500">
              {t('dashboard:hostingPackages.noPackages')}
            </p>
          </div>
        )}
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
            // Check if this tier is already purchased
            const isCurrentPlan =
              tier.slug === 'growth' && hostingPackages.length > 0
            const isDowngrade = false

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
                          /{t('dashboard:hostingPackages.month')}
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
