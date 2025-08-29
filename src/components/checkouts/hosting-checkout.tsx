'use client'

import { Button } from '@/components/button'
import { tiers } from '@/components/pricing-table'
import { Heading, Subheading } from '@/components/text'
import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

interface HostingPlan {
  name: string
  slug: string
  description: string
  priceMonthly: number
  billingPeriod: number // months
  highlights: { description: string }[]
}

function HostingCheckoutContent() {
  const [planInfo, setPlanInfo] = useState<HostingPlan | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [billingPeriod, setBillingPeriod] = useState(1) // months: 1, 6, 12
  const { t, i18n } = useTranslation(['common', 'pricing', 'hosting'])
  const router = useRouter()
  const searchParams = useSearchParams()

  const planSlug = searchParams.get('plan')

  useEffect(() => {
    if (!planSlug) {
      router.push(`/${i18n.language}/hosting`)
      return
    }

    // Find the plan from the tiers
    const selectedTier = tiers.find((tier) => tier.slug === planSlug)

    if (selectedTier) {
      setPlanInfo({
        name: selectedTier.name,
        slug: selectedTier.slug,
        description: selectedTier.description,
        priceMonthly: selectedTier.priceMonthly,
        billingPeriod: billingPeriod,
        highlights: selectedTier.highlights,
      })
      setLoading(false)
    } else {
      setError('Plan not found')
      setLoading(false)
    }
  }, [planSlug, billingPeriod, i18n.language, router])

  const calculateTotal = () => {
    if (!planInfo) return 0

    let discount = 0
    if (billingPeriod === 6) discount = 0.1 // 10% discount for 6 months
    if (billingPeriod === 12) discount = 0.2 // 20% discount for 12 months

    const totalPrice = planInfo.priceMonthly * billingPeriod
    return totalPrice * (1 - discount)
  }

  const formatPrice = (price: number) => {
    return `€${price.toFixed(2)}`
  }

  const getBillingPeriodText = (months: number) => {
    if (months === 1)
      return t('pricing:checkout.billingPeriod.monthly', '1 Month')
    if (months === 6)
      return t('pricing:checkout.billingPeriod.sixMonths', '6 Months')
    if (months === 12)
      return t('pricing:checkout.billingPeriod.yearly', '12 Months (1 Year)')
    return `${months} ${t('common:months', 'Months')}`
  }

  const getDiscountText = (months: number) => {
    if (months === 6)
      return t('pricing:checkout.discount.sixMonths', '10% discount')
    if (months === 12)
      return t('pricing:checkout.discount.yearly', '20% discount')
    return null
  }

  const handleContinue = () => {
    if (!planInfo) return

    // Create URL with hosting context
    const registerParams = new URLSearchParams({
      plan: planInfo.slug,
      planName: planInfo.name,
      price: calculateTotal().toString(),
      billingPeriod: billingPeriod.toString(),
      priceMonthly: planInfo.priceMonthly.toString(),
    })

    const registerUrl = `/${i18n.language}/register?${registerParams.toString()}`
    router.push(registerUrl)
  }

  const handleBackToPlans = () => {
    router.push(`/${i18n.language}/hosting`)
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

  if (error || !planInfo) {
    return (
      <div className="mt-16 flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <ExclamationTriangleIcon className="mx-auto mb-4 h-12 w-12 text-red-500" />
          <p className="mb-4 text-red-600">
            {error || t('common:error', 'An error occurred. Please try again.')}
          </p>
          <Button onClick={handleBackToPlans} variant="outline">
            {t('pricing:checkout.backToPlans', '← Back to Hosting Plans')}
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
          onClick={handleBackToPlans}
          className="mb-6 text-sm text-gray-600 transition-colors hover:text-gray-900"
        >
          {t('pricing:checkout.backToPlans', '← Back to Hosting Plans')}
        </button>
        <Subheading>{t('pricing:checkout.subtitle', 'checkout')}</Subheading>
        <Heading as="h1" className="mt-2">
          {t('pricing:checkout.title', 'Hosting Plan Checkout')}
        </Heading>
      </div>

      {/* Main Content */}
      <div className="mt-12 grid grid-cols-1 gap-8 pb-24 lg:grid-cols-3">
        {/* Plan Information */}
        <div className="lg:col-span-2">
          <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
            <h2 className="mb-6 text-xl font-semibold text-gray-900">
              {t('pricing:checkout.planInfo.title', 'Plan Information')}
            </h2>

            <div className="mb-6 flex items-start gap-4 rounded-lg bg-blue-50 p-4">
              <CheckCircleIcon className="mt-0.5 h-6 w-6 flex-shrink-0 text-blue-600" />
              <div>
                <p className="font-medium text-blue-800">
                  {planInfo.name} Plan
                </p>
                <p className="mt-1 text-sm text-blue-700">
                  {t(
                    `pricing:tiers.${planInfo.slug}.description`,
                    planInfo.description,
                  )}
                </p>
              </div>
            </div>

            {/* Plan Features */}
            <div className="mb-6">
              <h3 className="mb-3 font-medium text-gray-900">
                {t('pricing:checkout.features', 'Plan Features')}:
              </h3>
              <ul className="space-y-2">
                {planInfo.highlights.map((highlight, index) => {
                  // Get translated highlight from pricing translations
                  const translatedHighlight = t(
                    `pricing:tiers.${planInfo.slug}.highlights.${index}`,
                    highlight.description,
                  )
                  return (
                    <li
                      key={index}
                      className="flex items-start gap-2 text-sm text-gray-600"
                    >
                      <CheckCircleIcon className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-500" />
                      {translatedHighlight}
                    </li>
                  )
                })}
              </ul>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between border-b border-gray-200 py-3">
                <span className="text-gray-600">
                  {t('pricing:checkout.billingPeriod.label', 'Billing Period')}
                </span>
                <select
                  value={billingPeriod}
                  onChange={(e) => setBillingPeriod(parseInt(e.target.value))}
                  className="rounded-md border border-gray-300 bg-white px-3 py-1 text-sm font-medium text-gray-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                >
                  <option value={1}>
                    {t('pricing:checkout.billingPeriod.monthly', '1 Month')}
                  </option>
                  <option value={6}>
                    {t('pricing:checkout.billingPeriod.sixMonths', '6 Months')}{' '}
                    - {t('pricing:checkout.discount.sixMonths', '10% off')}
                  </option>
                  <option value={12}>
                    {t('pricing:checkout.billingPeriod.yearly', '12 Months')} -{' '}
                    {t('pricing:checkout.discount.yearly', '20% off')}
                  </option>
                </select>
              </div>

              <div className="flex justify-between border-b border-gray-200 py-3">
                <span className="text-gray-600">
                  {t('pricing:checkout.monthlyPrice', 'Monthly Price')}
                </span>
                <span className="font-medium">
                  {formatPrice(planInfo.priceMonthly)}
                </span>
              </div>

              {billingPeriod > 1 && (
                <div className="flex justify-between border-b border-gray-200 py-3">
                  <span className="text-gray-600">
                    {t('pricing:checkout.subtotal', 'Subtotal')} (
                    {billingPeriod} {t('common:months', 'months')})
                  </span>
                  <span className="font-medium text-gray-500">
                    {formatPrice(planInfo.priceMonthly * billingPeriod)}
                  </span>
                </div>
              )}

              {getDiscountText(billingPeriod) && (
                <div className="flex justify-between border-b border-gray-200 py-3">
                  <span className="text-gray-600">
                    {t('pricing:checkout.discount.label', 'Discount')}
                  </span>
                  <span className="font-medium text-green-600">
                    -{getDiscountText(billingPeriod)}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="sticky top-8 rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
            <h2 className="mb-6 text-xl font-semibold text-gray-900">
              {t('pricing:checkout.orderSummary.title', 'Order Summary')}
            </h2>

            <div className="mb-6 space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">
                  {t('pricing:checkout.orderSummary.plan', 'Plan')}
                </span>
                <div className="text-right">
                  <div className="font-medium">{planInfo.name}</div>
                </div>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600">
                  {t('pricing:checkout.billingPeriod.label', 'Billing Period')}
                </span>
                <span className="font-medium">
                  {getBillingPeriodText(billingPeriod)}
                </span>
              </div>
            </div>

            <div className="mb-6 border-t border-gray-200 pt-4">
              <div className="mb-2 flex justify-between">
                <span className="text-gray-600">
                  {t('pricing:checkout.orderSummary.subtotal', 'Subtotal')}
                </span>
                <span className="font-medium">
                  {formatPrice(planInfo.priceMonthly * billingPeriod)}
                </span>
              </div>

              {getDiscountText(billingPeriod) && (
                <div className="mb-2 flex justify-between">
                  <span className="text-gray-600">
                    {t('pricing:checkout.discount.label', 'Discount')}
                  </span>
                  <span className="text-green-600">
                    -
                    {formatPrice(
                      planInfo.priceMonthly * billingPeriod - calculateTotal(),
                    )}
                  </span>
                </div>
              )}

              {/* <div className="mb-2 flex justify-between">
                <span className="text-gray-600">
                  {t('pricing:checkout.orderSummary.taxes', 'Taxes')}
                </span>
                <span className="text-sm text-gray-500">
                  {t(
                    'pricing:checkout.orderSummary.vatNotApplicable',
                    'VAT not applicable',
                  )}
                </span>
              </div> */}
            </div>

            <div className="mb-6 border-t border-gray-200 pt-4">
              <div className="flex justify-between text-lg font-semibold">
                <span>{t('pricing:checkout.orderSummary.total', 'Total')}</span>
                <span>{formatPrice(calculateTotal())}</span>
              </div>
              {billingPeriod > 1 && (
                <p className="mt-1 text-sm text-gray-500">
                  {formatPrice(calculateTotal() / billingPeriod)}/month
                </p>
              )}
            </div>

            <Button onClick={handleContinue} className="w-full">
              {t('pricing:checkout.continue', 'Continue to Account Setup')}
            </Button>
          </div>
        </div>
      </div>
    </main>
  )
}

export default function HostingCheckoutBody() {
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

  return <HostingCheckoutContent />
}
