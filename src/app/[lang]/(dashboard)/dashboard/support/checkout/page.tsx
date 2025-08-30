'use client'

import { formatCurrency } from '@/lib/utils'
import { CheckIcon } from '@heroicons/react/24/outline'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
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

interface SupportPackage {
  name: string
  slug: string
  price: number
}

function DashboardSupportCheckoutContent() {
  const [packageInfo, setPackageInfo] = useState<SupportPackage | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const params = useParams()
  const router = useRouter()
  const searchParams = useSearchParams()
  const lang = (params?.lang as string) || 'en'
  const { t, ready } = useTranslation(['support-packages', 'common'])

  const packageSlug = searchParams.get('package')

  useEffect(() => {
    if (!packageSlug) {
      setError('No package specified')
      setLoading(false)
      return
    }

    // Find the package from the tiers
    const selectedTier = tiers.find((tier) => tier.slug === packageSlug)

    if (selectedTier) {
      setPackageInfo({
        name: selectedTier.name,
        slug: selectedTier.slug,
        price: selectedTier.price,
      })
      setLoading(false)
    } else {
      setError('Package not found')
      setLoading(false)
    }
  }, [packageSlug, lang, router])

  const formatPrice = (price: number) => formatCurrency(price)

  const handleContinueToPayment = () => {
    if (!packageInfo) return

    const paymentParams = new URLSearchParams({
      package: packageInfo.slug,
      price: packageInfo.price.toString(),
      name: packageInfo.name,
    })

    const paymentUrl = `/${lang}/dashboard/support/payment?${paymentParams.toString()}`
    router.push(paymentUrl)
  }

  const handleBackToPackages = () => {
    router.push(`/${lang}/dashboard/support/packages`)
  }

  if (loading || !ready) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {t('support-packages:checkout.title', 'Support Package Checkout')}
          </h1>
          <p className="text-gray-600">{t('common:loading', 'Loading...')}</p>
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

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {t('support-packages:checkout.title', 'Support Package Checkout')}
          </h1>
          <p className="text-red-600">{error}</p>
        </div>
        <button
          onClick={handleBackToPackages}
          className="inline-flex items-center text-purple-600 hover:text-purple-800"
        >
          {t(
            'support-packages:checkout.backToPackages',
            '← Back to Support Packages',
          )}
        </button>
      </div>
    )
  }

  if (!packageInfo) {
    return null
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <button
          onClick={handleBackToPackages}
          className="mb-4 inline-flex items-center text-purple-600 hover:text-purple-800"
        >
          {/* <ArrowLeftIcon className="mr-2 h-4 w-4" /> */}
          {t(
            'support-packages:checkout.backToPackages',
            '← Back to Support Packages',
          )}
        </button>
        <h1 className="text-2xl font-bold text-gray-900">
          {t('support-packages:checkout.title', 'Support Package Checkout')}
        </h1>
        <p className="text-gray-600">
          {t('support-packages:checkout.subtitle', 'checkout')}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Package Information */}
        <div className="space-y-6">
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">
              {t(
                'support-packages:checkout.packageInfo.title',
                'Package Information',
              )}
            </h2>

            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-gray-900">
                  {packageInfo.name}
                </h3>
                <p className="text-sm text-gray-600">
                  {t(`support-packages:tiers.${packageInfo.slug}.description`)}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <dt className="text-sm font-medium text-gray-500">
                    {t('support-packages:checkout.packageType', 'Package Type')}
                  </dt>
                  <dd className="text-sm text-gray-900">{packageInfo.name}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">
                    {t(
                      'support-packages:checkout.billing.type',
                      'Billing Type',
                    )}
                  </dt>
                  <dd className="text-sm text-gray-900">
                    {t(
                      'support-packages:checkout.billing.oneTime',
                      'One-time payment',
                    )}
                  </dd>
                </div>
              </div>

              <div>
                <dt className="text-sm font-medium text-gray-500">
                  {t('support-packages:checkout.price', 'Price')}
                </dt>
                <dd className="text-lg font-semibold text-gray-900">
                  {formatPrice(packageInfo.price)}
                </dd>
              </div>
            </div>
          </div>

          {/* Package Features */}
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <h3 className="mb-3 text-lg font-semibold text-gray-900">
              {t('support-packages:checkout.features', "What's included")}
            </h3>
            <ul className="space-y-2">
              {(
                (t(`support-packages:tiers.${packageInfo.slug}.highlights`, {
                  returnObjects: true,
                }) as string[]) || []
              ).map((feature: string, index: number) => (
                <li key={index} className="flex items-start">
                  <CheckIcon className="mt-0.5 mr-2 h-4 w-4 text-green-500" />
                  <span className="text-sm text-gray-600">{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Guarantee Notice */}
          <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
            <p className="text-sm text-amber-700">
              {t(
                'support-packages:checkout.guarantee',
                'Work begins after account creation and payment confirmation',
              )}
            </p>
          </div>
        </div>

        {/* Order Summary */}
        <div className="space-y-6">
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <h3 className="mb-4 text-lg font-semibold text-gray-900">
              {t(
                'support-packages:checkout.orderSummary.title',
                'Order Summary',
              )}
            </h3>

            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">
                  {t(
                    'support-packages:checkout.orderSummary.package',
                    'Package',
                  )}
                </span>
                <span className="font-medium">{packageInfo.name}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600">
                  {t(
                    'support-packages:checkout.orderSummary.deliveryTime',
                    'Delivery Time',
                  )}
                </span>
                <span className="font-medium">
                  {t(
                    'support-packages:checkout.orderSummary.withinDays',
                    '1-3 business days',
                  )}
                </span>
              </div>

              <div className="border-t border-gray-200 pt-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">
                    {t(
                      'support-packages:checkout.orderSummary.subtotal',
                      'Subtotal',
                    )}
                  </span>
                  <span className="font-medium">
                    {formatPrice(packageInfo.price)}
                  </span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">
                    {t('support-packages:checkout.orderSummary.taxes', 'Taxes')}
                  </span>
                  <span className="text-gray-500">
                    {t(
                      'support-packages:checkout.orderSummary.vatNotApplicable',
                      'VAT not applicable',
                    )}
                  </span>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-3">
                <div className="flex justify-between text-lg font-semibold">
                  <span className="text-gray-900">
                    {t('support-packages:checkout.orderSummary.total', 'Total')}
                  </span>
                  <span className="text-gray-900">
                    {formatPrice(packageInfo.price)}
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={handleContinueToPayment}
              className="mt-6 w-full rounded-lg bg-gray-950 px-4 py-3 text-base font-medium text-white shadow-md transition-colors hover:bg-gray-800"
            >
              {t(
                'common:auth.confirmation.continueToPayment',
                'Continue to Payment',
              )}
            </button>
          </div>

          {/* Billing Notice */}
          <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
            <h4 className="font-medium text-blue-900">
              {t('support-packages:checkout.billing.oneOff', 'One-time')}{' '}
              Payment
            </h4>
            <p className="mt-1 text-sm text-blue-700">
              {t(
                'support-packages:checkout.billing.noRecurring',
                'No recurring charges',
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function DashboardSupportCheckout() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Support Package Checkout
          </h1>
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

  return <DashboardSupportCheckoutContent />
}
