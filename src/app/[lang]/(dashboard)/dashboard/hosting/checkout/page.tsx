'use client'

import { formatCurrency } from '@/lib/utils'
import { CheckIcon } from '@heroicons/react/24/outline'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

// Define basic tiers structure - content will come from translations
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

interface HostingPlan {
  name: string
  slug: string
  priceMonthly: number | null
  billingPeriod: number
}

function DashboardHostingCheckoutContent() {
  const [planInfo, setPlanInfo] = useState<HostingPlan | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [billingPeriod, setBillingPeriod] = useState(1) // months: 1, 6, 12
  const params = useParams()
  const router = useRouter()
  const searchParams = useSearchParams()
  const lang = (params?.lang as string) || 'en'
  const { t, ready } = useTranslation(['pricing', 'common'])

  const planSlug = searchParams.get('plan')

  useEffect(() => {
    if (!planSlug) {
      router.push(`/${lang}/dashboard/hosting/packages`)
      return
    }

    // Find the plan from the tiers
    const selectedTier = tiers.find((tier) => tier.slug === planSlug)

    if (selectedTier) {
      setPlanInfo({
        name: selectedTier.name,
        slug: selectedTier.slug,
        priceMonthly: selectedTier.priceMonthly,
        billingPeriod: billingPeriod,
      })
      setLoading(false)
    } else {
      setError('Plan not found')
      setLoading(false)
    }
  }, [planSlug, billingPeriod, lang, router])

  const calculateTotal = () => {
    if (!planInfo || !planInfo.priceMonthly) return 0

    let discount = 0
    if (billingPeriod === 6) discount = 0.1 // 10% discount for 6 months
    if (billingPeriod === 12) discount = 0.2 // 20% discount for 12 months

    const totalPrice = planInfo.priceMonthly * billingPeriod
    return totalPrice * (1 - discount)
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

  const getDiscountText = (months: number) => {
    if (months === 6) return t('pricing:checkout.discount.sixMonths', '10% off')
    if (months === 12) return t('pricing:checkout.discount.yearly', '20% off')
    return null
  }

  const handleContinue = () => {
    if (!planInfo) return

    // Redirect to dashboard payment page
    const paymentParams = new URLSearchParams({
      plan: planInfo.slug,
      planName: planInfo.name,
      price: calculateTotal().toString(),
      billingPeriod: billingPeriod.toString(),
      priceMonthly: planInfo.priceMonthly?.toString() || '0',
    })

    const paymentUrl = `/${lang}/dashboard/hosting/payment?${paymentParams.toString()}`
    router.push(paymentUrl)
  }

  const handleBackToPackages = () => {
    router.push(`/${lang}/dashboard/hosting/packages`)
  }

  if (loading || !ready) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {t('pricing:checkout.title', 'Hosting Plan Checkout')}
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

  if (error || !planInfo) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Hosting Checkout</h1>
          <p className="text-red-600">{error || 'Plan not found'}</p>
        </div>
        <button
          onClick={handleBackToPackages}
          className="inline-flex items-center text-purple-600 hover:text-purple-800"
        >
          {/* <ArrowLeftIcon className="mr-2 h-4 w-4" /> */}
          {t('pricing:checkout.backToPlans', 'Back to Hosting Plans')}
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <button
          onClick={handleBackToPackages}
          className="mb-4 inline-flex items-center text-purple-600 hover:text-purple-800"
        >
          {/* <ArrowLeftIcon className="mr-2 h-4 w-4" /> */}
          {t('pricing:checkout.backToPlans', 'Back to Hosting Plans')}
        </button>
        <h1 className="text-2xl font-bold text-gray-900">
          {t('pricing:checkout.title', 'Hosting Plan Checkout')}
        </h1>
        <p className="text-gray-600">Complete your hosting plan upgrade</p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Plan Information */}
        <div className="lg:col-span-2">
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">
              {t('pricing:checkout.planInfo.title', 'Plan Information')}
            </h2>

            <div className="mb-4 flex items-center">
              <CheckIcon className="mr-3 h-6 w-6 text-green-500" />
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-xl font-medium text-gray-900">
                    {planInfo.name} Plan
                  </span>
                </div>
                <div className="text-sm text-green-600">
                  Available for upgrade
                </div>
              </div>
            </div>

            <p className="mb-6 text-gray-600">
              {t(`pricing:tiers.${planInfo.slug}.description`)}
            </p>

            {/* Billing Period */}
            <div className="mb-6">
              <label className="mb-2 block text-sm font-medium text-gray-700">
                {t('pricing:checkout.billingPeriod.label', 'Billing Period')}
              </label>
              <select
                value={billingPeriod}
                onChange={(e) => setBillingPeriod(parseInt(e.target.value))}
                className="block w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-purple-500"
              >
                <option value={1}>
                  {t('pricing:checkout.billingPeriod.monthly', '1 Month')}
                </option>
                <option value={6}>
                  {t('pricing:checkout.billingPeriod.sixMonths', '6 Months')}
                </option>
                <option value={12}>
                  {t('pricing:checkout.billingPeriod.yearly', '12 Months')}
                </option>
              </select>
              {getDiscountText(billingPeriod) && (
                <p className="mt-1 text-sm text-green-600">
                  {getDiscountText(billingPeriod)} applied!
                </p>
              )}
            </div>

            {/* Plan Features */}
            <div>
              <h3 className="mb-3 text-sm font-medium text-gray-900">
                {t('pricing:checkout.features', 'Plan Features')}
              </h3>
              <ul className="space-y-2">
                {(
                  (t(`pricing:tiers.${planInfo.slug}.highlights`, {
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
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">
              {t('pricing:checkout.orderSummary.title', 'Order Summary')}
            </h2>

            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">
                  {t('pricing:checkout.orderSummary.plan', 'Plan')}
                </span>
                <span className="font-medium">{planInfo.name}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600">
                  {t('pricing:checkout.billingPeriod.label', 'Billing Period')}
                </span>
                <span className="font-medium">
                  {getBillingPeriodText(billingPeriod)}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600">
                  {t('pricing:checkout.monthlyPrice', 'Monthly Price')}
                </span>
                <span className="font-medium">
                  {formatPrice(planInfo.priceMonthly || 0)}
                </span>
              </div>

              {billingPeriod > 1 && getDiscountText(billingPeriod) && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">
                    {t('pricing:checkout.discount.label', 'Discount')}
                  </span>
                  <span className="text-green-600">
                    {getDiscountText(billingPeriod)}
                  </span>
                </div>
              )}

              <hr className="my-4" />

              <div className="flex justify-between">
                <span className="text-gray-600">
                  {t('pricing:checkout.orderSummary.subtotal', 'Subtotal')}
                </span>
                <span className="font-medium">
                  {formatPrice(calculateTotal())}
                </span>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-gray-500">
                  {t('pricing:checkout.orderSummary.taxes', 'Taxes')}
                </span>
                <span className="text-gray-500">
                  {t(
                    'pricing:checkout.orderSummary.vatNotApplicable',
                    'VAT not applicable',
                  )}
                </span>
              </div>

              <hr className="my-4" />

              <div className="flex justify-between text-lg font-semibold">
                <span>{t('pricing:checkout.orderSummary.total', 'Total')}</span>
                <span>{formatPrice(calculateTotal())}</span>
              </div>
            </div>

            <button
              onClick={handleContinue}
              className="mt-6 w-full rounded-lg bg-gray-950 px-4 py-3 text-base font-medium text-white shadow-md transition-colors hover:bg-gray-800"
            >
              {t(
                'common:auth.confirmation.continueToPayment',
                'Continue to Payment',
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function DashboardHostingCheckout() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Hosting Checkout</h1>
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

  return <DashboardHostingCheckoutContent />
}
