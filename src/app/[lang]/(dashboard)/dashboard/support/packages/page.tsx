'use client'

import type { PurchasedSupportPackage } from '@/lib/dashboard-api'
import { demoApiProvider } from '@/lib/demo-api-provider'
import { formatCurrency } from '@/lib/utils'
import { CheckIcon, ClockIcon } from '@heroicons/react/24/outline'
import { useSession } from 'next-auth/react'
import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

// Define basic tiers structure - content will come from translations
const tiers = [
  {
    name: 'Tiny Tweak',
    slug: 'tinyTweak',
    price: 10,
  },
  {
    name: 'Quick Fix',
    slug: 'quickFix',
    price: 25,
  },
  {
    name: 'First Deploy',
    slug: 'firstDeploy',
    price: 50,
  },
  {
    name: 'Launch Pack',
    slug: 'launchPack',
    price: 100,
  },
  {
    name: 'Migration Mini',
    slug: 'migrationMini',
    price: 250,
  },
]

function SupportPackagesContent() {
  const { data: session } = useSession()
  const [mounted, setMounted] = useState(false)
  const [supportPackages, setSupportPackages] = useState<
    PurchasedSupportPackage[]
  >([])
  const [loading, setLoading] = useState(true)
  const params = useParams()
  const router = useRouter()
  const lang = (params?.lang as string) || 'en'
  const { t, ready } = useTranslation([
    'dashboard',
    'support-packages',
    'common',
  ])

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const fetchSupportPackages = async () => {
      if (!session?.rawJwt) return

      try {
        const data = await demoApiProvider.getPurchasedSupportPackages(
          session.rawJwt,
          session.user?.email,
        )
        setSupportPackages(data)
      } catch (error) {
        console.error('Failed to fetch support packages:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchSupportPackages()
  }, [session?.rawJwt, session?.user?.email])

  const handlePurchase = (packageSlug: string) => {
    router.push(`/${lang}/dashboard/support/checkout?package=${packageSlug}`)
  }

  const formatPrice = (price: number) => formatCurrency(price)

  // Show loading state until translations are ready and component is mounted
  if (!mounted || !ready) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {t('dashboard:supportPackages.title')}
          </h1>
          <p className="text-gray-600">
            {t('dashboard:supportPackages.loading')}
          </p>
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
          {t('dashboard:supportPackages.title')}
        </h1>
        <p className="text-gray-600">
          {t(
            'support-packages:header.description',
            'Done-for-you deployments for non-technical builders. Hosting included on Launch & Migration packs. Contact us to discuss your project.',
          )}
        </p>
      </div>

      {/* Purchased Support Packages */}
      <div className="space-y-6">
        <h2 className="text-lg font-semibold text-gray-900">
          {t('dashboard:supportPackages.yourPackages')}
        </h2>

        {supportPackages.length > 0 ? (
          <div className="space-y-4">
            {supportPackages.map((supportPackage) => (
              <div
                key={supportPackage._id}
                className="rounded-lg border border-gray-200 bg-white p-6"
              >
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {supportPackage.packageName}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {t('dashboard:supportPackages.usedFor')}{' '}
                      {supportPackage.domainName}
                    </p>
                  </div>
                  <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-800">
                    <CheckIcon className="mr-1 h-4 w-4" />
                    {supportPackage.status}
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                  <div className="lg:col-span-2">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <dt className="text-sm font-medium text-gray-500">
                          {t('dashboard:supportPackages.billingType')}
                        </dt>
                        <dd className="text-sm text-gray-900">
                          {t('dashboard:supportPackages.oneTimePayment')}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500">
                          {t('dashboard:supportPackages.price')}
                        </dt>
                        <dd className="text-sm text-gray-900">
                          €{supportPackage.price.toFixed(2)}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500">
                          {t('dashboard:supportPackages.purchaseDate')}
                        </dt>
                        <dd className="text-sm text-gray-900">
                          {new Date(
                            supportPackage.purchaseDate,
                          ).toLocaleDateString()}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500">
                          {t('dashboard:supportPackages.completionDate')}
                        </dt>
                        <dd className="text-sm text-gray-900">
                          {new Date(
                            supportPackage.completionDate,
                          ).toLocaleDateString()}
                        </dd>
                      </div>
                    </div>

                    {/* Package Features */}
                    <div className="mt-6">
                      <h4 className="mb-3 text-sm font-medium text-gray-900">
                        {t('dashboard:supportPackages.packageFeatures')}
                      </h4>
                      <ul className="space-y-2">
                        {supportPackage.features.map((feature, index) => (
                          <li key={index} className="flex items-start">
                            <CheckIcon className="mt-0.5 mr-2 h-4 w-4 text-green-500" />
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
                      <div className="text-3xl font-bold text-gray-900">
                        €{supportPackage.price.toFixed(2)}
                        <span className="text-sm font-normal text-gray-500">
                          {' '}
                          {t('dashboard:supportPackages.oneOff')}
                        </span>
                      </div>
                      <div className="mt-4 flex items-center justify-center text-sm text-gray-600">
                        <ClockIcon className="mr-1 h-4 w-4" />
                        {t('dashboard:supportPackages.completed')}{' '}
                        {new Date(
                          supportPackage.completionDate,
                        ).toLocaleDateString()}
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
              {t('dashboard:supportPackages.noPackages')}
            </p>
          </div>
        )}
      </div>

      {/* Available Packages Section */}
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900">
            {t('dashboard:supportPackages.availablePackages')}
          </h2>
          <p className="text-gray-600">
            {t('dashboard:supportPackages.availableDescription')}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {tiers.map((tier) => {
            const isRecent = false // Demo mode

            return (
              <div
                key={tier.slug}
                className={`relative rounded-lg border p-6 ${
                  isRecent
                    ? 'border-green-200 bg-green-50'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                {isRecent && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="inline-flex items-center rounded-full bg-green-500 px-3 py-1 text-xs font-medium text-white">
                      {t('dashboard:supportPackages.recentlyPurchased')}
                    </span>
                  </div>
                )}

                <div className="text-center">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {tier.name}
                  </h3>
                  <p className="mt-2 text-sm text-gray-600">
                    {t(`support-packages:tiers.${tier.slug}.description`)}
                  </p>

                  <div className="mt-4">
                    <div className="text-3xl font-bold text-gray-900">
                      {formatPrice(tier.price)}
                      <span className="text-sm font-normal text-gray-500">
                        {' '}
                        {t('support-packages:ui.oneOff', 'one-off')}
                      </span>
                    </div>
                  </div>

                  <div className="mt-6">
                    {isRecent ? (
                      <button
                        disabled
                        className="w-full cursor-not-allowed rounded-lg bg-green-500 px-4 py-2 text-white"
                      >
                        {t('dashboard:supportPackages.recentlyPurchased')}
                      </button>
                    ) : (
                      <button
                        onClick={() => handlePurchase(tier.slug)}
                        className="w-full rounded-lg bg-gray-950 px-4 py-2 text-white hover:bg-gray-800"
                      >
                        {t(
                          `support-packages:tiers.${tier.slug}.cta`,
                          'Buy Now',
                        )}
                      </button>
                    )}
                  </div>

                  {/* Features Preview */}
                  <div className="mt-6 text-left">
                    <h4 className="mb-3 text-sm font-medium text-gray-900">
                      {t('dashboard:supportPackages.keyFeatures')}
                    </h4>
                    <ul className="space-y-1">
                      {(
                        (t(`support-packages:tiers.${tier.slug}.highlights`, {
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
                        (t(`support-packages:tiers.${tier.slug}.highlights`, {
                          returnObjects: true,
                        }) as string[]) || []
                      ).length > 3 && (
                        <li className="text-xs text-gray-500">
                          +
                          {(
                            (t(
                              `support-packages:tiers.${tier.slug}.highlights`,
                              {
                                returnObjects: true,
                              },
                            ) as string[]) || []
                          ).length - 3}{' '}
                          {t('dashboard:supportPackages.moreFeatures')}
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

export default function SupportPackagesPage() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Support Packages</h1>
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

  return <SupportPackagesContent />
}
