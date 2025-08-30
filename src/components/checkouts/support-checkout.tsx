'use client'

import { Button } from '@/components/button'
import { Heading, Subheading } from '@/components/text'
import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

// Support packages data - matching the tiers from the page
const supportPackages = [
  {
    name: 'Tiny Tweak',
    slug: 'tiny-tweak',
    description: 'A single, quick hosting task.',
    price: 10,
    currency: 'EUR',
    billing: 'one-off',
    highlights: [
      'Trigger a redeploy',
      'Add 1 DNS record',
      'Add 1 env var',
      'Add 1 redirect / rewrite',
      'SSL check',
      'No hosting included · No code changes',
    ],
  },
  {
    name: 'Quick Fix',
    slug: 'quick-fix',
    description: 'Small setup fixes on an existing site.',
    price: 25,
    currency: 'EUR',
    billing: 'one-off',
    highlights: [
      'Connect 1 custom domain + SSL',
      'Up to 3 env vars',
      'Up to 3 redirects / rewrites',
      'One deploy hook',
      'Production health check',
      'No hosting included',
    ],
  },
  {
    name: 'First Deploy',
    slug: 'first-deploy',
    description: 'Take a repo that already builds and put it live.',
    price: 50,
    currency: 'EUR',
    billing: 'one-off',
    highlights: [
      'Create project from Git',
      'Configure build / output',
      'Attach 1 production domain + SSL',
      'Up to 5 env vars & 5 redirects',
      'Handover checklist',
      '3 months hosting included (fair-use)',
    ],
  },
  {
    name: 'Launch Pack',
    slug: 'launch-pack',
    description: 'Polished go-live for brochure/marketing sites.',
    price: 100,
    currency: 'EUR',
    billing: 'one-off',
    highlights: [
      'Everything in First Deploy',
      'Staging subdomain',
      'Performance / cache headers',
      'Custom 404 / 500 pages',
      'Up to 10 redirects / rewrites',
      'Basic deploy notifications',
      'Go-live / rollback plan',
      '12 months hosting included (fair-use)',
    ],
  },
  {
    name: 'Migration Mini',
    slug: 'migration-mini',
    description: 'Move a small static site to modern hosting.',
    price: 250,
    currency: 'EUR',
    billing: 'one-off',
    highlights: [
      'Everything in Launch Pack',
      'Migrate up to 10 pages',
      'Preserve URLs where possible',
      'Up to 20 301 redirects',
      'Custom domain + SSL',
      'Zero-downtime cutover',
      'Contact form via serverless',
      'Security headers',
    ],
  },
]

interface SupportPackageInfo {
  name: string
  slug: string
  description: string
  price: number
  currency: string
  billing: string
  highlights: string[]
}

function SupportCheckoutContent() {
  const [packageInfo, setPackageInfo] = useState<SupportPackageInfo | null>(
    null,
  )
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { t, i18n } = useTranslation(['common', 'support-packages'])
  const router = useRouter()
  const searchParams = useSearchParams()

  const packageSlug = searchParams.get('package')

  useEffect(() => {
    if (!packageSlug) {
      router.push(`/${i18n.language}/support-packages`)
      return
    }

    // Find the package from the support packages
    const selectedPackage = supportPackages.find(
      (pkg) => pkg.slug === packageSlug,
    )

    if (selectedPackage) {
      setPackageInfo(selectedPackage)
      setLoading(false)
    } else {
      setError('Package not found')
      setLoading(false)
    }
  }, [packageSlug, i18n.language, router])

  const formatPrice = (price: number, currency: string = 'EUR') => {
    console.log(currency)
    return `€${price.toFixed(2)}`
  }

  const handleContinue = () => {
    if (!packageInfo) return

    // Create URL with support package context
    const registerParams = new URLSearchParams({
      supportPackage: packageInfo.slug,
      packageName: packageInfo.name,
      price: packageInfo.price.toString(),
      currency: packageInfo.currency,
      billing: packageInfo.billing,
    })

    const registerUrl = `/${i18n.language}/register?${registerParams.toString()}`
    router.push(registerUrl)
  }

  const handleBackToPackages = () => {
    router.push(`/${i18n.language}/support-packages`)
  }

  if (loading) {
    return (
      <div className="mt-16 flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-b-2 border-gray-900"></div>
          <p className="text-gray-600">{t('common:loading', 'Loading...')}</p>
        </div>
      </div>
    )
  }

  if (error || !packageInfo) {
    return (
      <div className="mt-16 flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <ExclamationTriangleIcon className="mx-auto mb-4 h-12 w-12 text-red-500" />
          <p className="mb-4 text-red-600">
            {error || t('common:error', 'An error occurred. Please try again.')}
          </p>
          <Button onClick={handleBackToPackages} variant="outline">
            {t(
              'support-packages:checkout.backToPackages',
              '← Back to Support Packages',
            )}
          </Button>
        </div>
      </div>
    )
  }

  return (
    <main className="overflow-hidden">
      {/* Header */}
      <div className="mt-16">
        <button
          onClick={handleBackToPackages}
          className="mb-6 text-sm text-gray-600 transition-colors hover:text-gray-900"
        >
          {t(
            'support-packages:checkout.backToPackages',
            '← Back to Support Packages',
          )}
        </button>
        <Subheading>
          {t('support-packages:checkout.subtitle', 'checkout')}
        </Subheading>
        <Heading as="h1" className="mt-2">
          {t('support-packages:checkout.title', 'Support Package Checkout')}
        </Heading>
      </div>

      {/* Main Content */}
      <div className="mt-12 grid grid-cols-1 gap-8 pb-24 lg:grid-cols-3">
        {/* Package Information */}
        <div className="lg:col-span-2">
          <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
            <h2 className="mb-6 text-xl font-semibold text-gray-900">
              {t(
                'support-packages:checkout.packageInfo.title',
                'Package Information',
              )}
            </h2>

            <div className="mb-6 flex items-start gap-4 rounded-lg bg-purple-50 p-4">
              <CheckCircleIcon className="mt-0.5 h-6 w-6 flex-shrink-0 text-purple-600" />
              <div>
                <p className="font-medium text-purple-800">
                  {packageInfo.name}
                </p>
                <p className="mt-1 text-sm text-purple-700">
                  {packageInfo.description}
                </p>
                <p className="mt-2 text-sm text-purple-600">
                  {t(
                    'support-packages:checkout.billing.oneOff',
                    'One-time payment',
                  )}{' '}
                  •{' '}
                  {t(
                    'support-packages:checkout.billing.noRecurring',
                    'No recurring charges',
                  )}
                </p>
              </div>
            </div>

            {/* Package Features */}
            <div className="mb-6">
              <h3 className="mb-3 font-medium text-gray-900">
                {t('support-packages:checkout.features', "What's included")}:
              </h3>
              <ul className="space-y-2">
                {packageInfo.highlights.map((highlight, index) => {
                  // Check if this is a disabled/excluded feature
                  const isDisabled =
                    highlight.includes('No ') || highlight.includes('· No ')

                  return (
                    <li
                      key={index}
                      className={`flex items-start gap-2 text-sm ${
                        isDisabled ? 'text-gray-400' : 'text-gray-600'
                      }`}
                    >
                      <CheckCircleIcon
                        className={`mt-0.5 h-4 w-4 flex-shrink-0 ${
                          isDisabled ? 'text-gray-300' : 'text-green-500'
                        }`}
                      />
                      {highlight}
                      {isDisabled && (
                        <span className="ml-1 text-xs text-gray-400">
                          (not included)
                        </span>
                      )}
                    </li>
                  )
                })}
              </ul>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between border-b border-gray-200 py-3">
                <span className="text-gray-600">
                  {t('support-packages:checkout.packageType', 'Package Type')}
                </span>
                <span className="font-medium">{packageInfo.name}</span>
              </div>

              <div className="flex justify-between border-b border-gray-200 py-3">
                <span className="text-gray-600">
                  {t('support-packages:checkout.billing.type', 'Billing Type')}
                </span>
                <span className="font-medium">
                  {t(
                    'support-packages:checkout.billing.oneTime',
                    'One-time payment',
                  )}
                </span>
              </div>

              <div className="flex justify-between border-b border-gray-200 py-3">
                <span className="text-gray-600">
                  {t('support-packages:checkout.price', 'Price')}
                </span>
                <span className="font-medium">
                  {formatPrice(packageInfo.price, packageInfo.currency)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="sticky top-8 rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
            <h2 className="mb-6 text-xl font-semibold text-gray-900">
              {t(
                'support-packages:checkout.orderSummary.title',
                'Order Summary',
              )}
            </h2>

            <div className="mb-6 space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">
                  {t(
                    'support-packages:checkout.orderSummary.package',
                    'Package',
                  )}
                </span>
                <div className="text-right">
                  <div className="font-medium">{packageInfo.name}</div>
                  <div className="text-xs text-gray-500">
                    {t('support-packages:checkout.billing.oneOff', 'One-time')}
                  </div>
                </div>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600">
                  {t(
                    'support-packages:checkout.orderSummary.deliveryTime',
                    'Delivery Time',
                  )}
                </span>
                <span className="text-sm text-gray-500">
                  {t(
                    'support-packages:checkout.orderSummary.withinDays',
                    '1-3 business days',
                  )}
                </span>
              </div>
            </div>

            <div className="mb-6 border-t border-gray-200 pt-4">
              <div className="mb-2 flex justify-between">
                <span className="text-gray-600">
                  {t(
                    'support-packages:checkout.orderSummary.subtotal',
                    'Subtotal',
                  )}
                </span>
                <span className="font-medium">
                  {formatPrice(packageInfo.price, packageInfo.currency)}
                </span>
              </div>

              {/* <div className="mb-2 flex justify-between">
                <span className="text-gray-600">
                  {t('support-packages:checkout.orderSummary.taxes', 'Taxes')}
                </span>
                <span className="text-sm text-gray-500">
                  {t(
                    'support-packages:checkout.orderSummary.vatNotApplicable',
                    'VAT not applicable',
                  )}
                </span>
              </div> */}
            </div>

            <div className="mb-6 border-t border-gray-200 pt-4">
              <div className="flex justify-between text-lg font-semibold">
                <span>
                  {t('support-packages:checkout.orderSummary.total', 'Total')}
                </span>
                <span>
                  {formatPrice(packageInfo.price, packageInfo.currency)}
                </span>
              </div>
            </div>

            <Button onClick={handleContinue} className="w-full">
              {t(
                'support-packages:checkout.continue',
                'Continue to Account Setup',
              )}
            </Button>

            <div className="mt-4 text-center">
              <p className="text-xs text-gray-500">
                {t(
                  'support-packages:checkout.guarantee',
                  'Work begins after account creation and payment confirmation',
                )}
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

export default function SupportCheckoutBody() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="mt-16 flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-b-2 border-gray-900"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return <SupportCheckoutContent />
}
