'use client'

import { formatCurrency } from '@/lib/utils'
import { CheckIcon, ClockIcon } from '@heroicons/react/24/outline'
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

// Mock purchased package data for demonstration
const purchasedPackage = {
  name: 'Quick Fix',
  slug: 'quickFix',
  price: 25,
  purchaseDate: '2024-01-10',
  completionDate: '2024-01-12',
  status: 'completed',
  deliveryTime: '1-3 business days',
}

function SupportPackagesContent() {
  const [mounted, setMounted] = useState(false)
  const params = useParams()
  const router = useRouter()
  const lang = (params?.lang as string) || 'en'
  const { t, ready } = useTranslation(['support-packages', 'common'])

  useEffect(() => {
    setMounted(true)
  }, [])

  const handlePurchase = (packageSlug: string) => {
    router.push(`/${lang}/dashboard/support/checkout?package=${packageSlug}`)
  }

  const formatPrice = (price: number) => formatCurrency(price)

  // Show loading state until translations are ready and component is mounted
  if (!mounted || !ready) {
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

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          {t('support-packages:header.title', 'Support Packages')}
        </h1>
        <p className="text-gray-600">
          {t(
            'support-packages:header.description',
            'Done-for-you deployments for non-technical builders. Hosting included on Launch & Migration packs. Contact us to discuss your project.',
          )}
        </p>
      </div>

      {/* Current Package Section */}
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">
            Recent Purchase
          </h2>
          <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-800">
            <CheckIcon className="mr-1 h-4 w-4" />
            Completed
          </span>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="mb-4">
              <h3 className="text-xl font-semibold text-gray-900">
                {purchasedPackage.name} Package
              </h3>
              <p className="text-gray-600">
                {t(
                  `support-packages:tiers.${purchasedPackage.slug}.description`,
                )}
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <dt className="text-sm font-medium text-gray-500">
                  {t('support-packages:checkout.billing.type', 'Billing Type')}
                </dt>
                <dd className="text-sm text-gray-900">
                  {t(
                    'support-packages:checkout.billing.oneTime',
                    'One-time payment',
                  )}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">
                  {t('support-packages:checkout.price', 'Price')}
                </dt>
                <dd className="text-sm text-gray-900">
                  {formatPrice(purchasedPackage.price)}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">
                  Purchase Date
                </dt>
                <dd className="text-sm text-gray-900">
                  {new Date(purchasedPackage.purchaseDate).toLocaleDateString()}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">
                  Completion Date
                </dt>
                <dd className="text-sm text-gray-900">
                  {new Date(
                    purchasedPackage.completionDate,
                  ).toLocaleDateString()}
                </dd>
              </div>
            </div>

            {/* Package Features */}
            <div className="mt-6">
              <h4 className="mb-3 text-sm font-medium text-gray-900">
                {t('support-packages:checkout.features', "What's included")}
              </h4>
              <ul className="space-y-2">
                {(
                  (t(
                    `support-packages:tiers.${purchasedPackage.slug}.highlights`,
                    {
                      returnObjects: true,
                    },
                  ) as string[]) || []
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
              <div className="text-3xl font-bold text-gray-900">
                {formatPrice(purchasedPackage.price)}
                <span className="text-sm font-normal text-gray-500">
                  {' '}
                  {t('support-packages:ui.oneOff', 'one-off')}
                </span>
              </div>
              <div className="mt-4 flex items-center justify-center text-sm text-gray-600">
                <ClockIcon className="mr-1 h-4 w-4" />
                Completed{' '}
                {new Date(purchasedPackage.completionDate).toLocaleDateString()}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Available Packages Section */}
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900">
            Available Packages
          </h2>
          <p className="text-gray-600">
            Get professional deployment assistance for your next project
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {tiers.map((tier) => {
            const isRecent = tier.slug === purchasedPackage.slug

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
                      Recently Purchased
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
                        Recently Purchased
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
                      Key Features
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
                          more features
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
