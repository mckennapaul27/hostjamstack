'use client'

import { formatCurrency } from '@/lib/utils'
import { ChevronDownIcon } from '@heroicons/react/16/solid'
import { ArrowLeftIcon } from '@heroicons/react/24/outline'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

interface ProductInfo {
  name: string
  price: string
  description: string
}

function DashboardHostingPaymentContent() {
  const [productInfo, setProductInfo] = useState<ProductInfo | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState('credit-card')
  const params = useParams()
  const router = useRouter()
  const searchParams = useSearchParams()
  const lang = (params?.lang as string) || 'en'
  const { t } = useTranslation(['payment', 'pricing', 'common'])

  useEffect(() => {
    // Extract product info from URL parameters
    const planName = searchParams.get('planName')
    const price = searchParams.get('price')
    const billingPeriod = searchParams.get('billingPeriod')

    if (planName && price) {
      const billingText =
        billingPeriod === '1'
          ? '1 month'
          : billingPeriod === '6'
            ? '6 months'
            : billingPeriod === '12'
              ? '12 months'
              : `${billingPeriod} months`

      setProductInfo({
        name: `${planName} Plan`,
        price: formatCurrency(parseFloat(price)),
        description: billingText,
      })
    }
  }, [searchParams])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Redirect to dashboard success page
    router.push(`/${lang}/dashboard/payment/success`)
  }

  const handleBackToCheckout = () => {
    const plan = searchParams.get('plan')

    if (plan) {
      router.push(`/${lang}/dashboard/hosting/checkout?plan=${plan}`)
    } else {
      router.push(`/${lang}/dashboard/hosting/packages`)
    }
  }

  if (!productInfo) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Hosting Payment</h1>
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

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <button
          onClick={handleBackToCheckout}
          className="mb-4 inline-flex items-center text-purple-600 hover:text-purple-800"
        >
          <ArrowLeftIcon className="mr-2 h-4 w-4" />
          {t('payment:backToCheckout', 'Back to Checkout')}
        </button>
        <h1 className="text-2xl font-bold text-gray-900">
          {t('payment:checkout.title', 'Complete Your Purchase')}
        </h1>
        <p className="text-gray-600">
          Enter your payment details to complete your hosting plan upgrade
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Payment Form */}
        <div className="lg:col-span-2">
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Billing Information */}
              <div>
                <h2 className="mb-4 text-lg font-semibold text-gray-900">
                  {t('payment:billing.title', 'Billing Information')}
                </h2>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="firstName"
                      className="block text-sm font-medium text-gray-700"
                    >
                      {t('payment:billing.firstName', 'First name')}
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      required
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-purple-500 focus:ring-1 focus:ring-purple-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="lastName"
                      className="block text-sm font-medium text-gray-700"
                    >
                      {t('payment:billing.lastName', 'Last name')}
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      required
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-purple-500 focus:ring-1 focus:ring-purple-500 focus:outline-none"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label
                      htmlFor="company"
                      className="block text-sm font-medium text-gray-700"
                    >
                      {t('payment:billing.company', 'Company')} (
                      {t('common:optional', 'optional')})
                    </label>
                    <input
                      type="text"
                      id="company"
                      name="company"
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-purple-500 focus:ring-1 focus:ring-purple-500 focus:outline-none"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label
                      htmlFor="address"
                      className="block text-sm font-medium text-gray-700"
                    >
                      {t('payment:billing.address', 'Address')}
                    </label>
                    <input
                      type="text"
                      id="address"
                      name="address"
                      required
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-purple-500 focus:ring-1 focus:ring-purple-500 focus:outline-none"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label
                      htmlFor="apartment"
                      className="block text-sm font-medium text-gray-700"
                    >
                      {t('payment:billing.apartment', 'Apartment, suite, etc.')}{' '}
                      ({t('common:optional', 'optional')})
                    </label>
                    <input
                      type="text"
                      id="apartment"
                      name="apartment"
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-purple-500 focus:ring-1 focus:ring-purple-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="city"
                      className="block text-sm font-medium text-gray-700"
                    >
                      {t('payment:billing.city', 'City')}
                    </label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      required
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-purple-500 focus:ring-1 focus:ring-purple-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="country"
                      className="block text-sm font-medium text-gray-700"
                    >
                      {t('payment:billing.country', 'Country')}
                    </label>
                    <div className="relative">
                      <select
                        id="country"
                        name="country"
                        required
                        className="mt-1 block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 pr-8 shadow-sm focus:border-purple-500 focus:ring-1 focus:ring-purple-500 focus:outline-none"
                      >
                        <option value="US">
                          {t('payment:countries.us', 'United States')}
                        </option>
                        <option value="GB">
                          {t('payment:countries.gb', 'United Kingdom')}
                        </option>
                        <option value="DE">
                          {t('payment:countries.de', 'Germany')}
                        </option>
                        <option value="FR">
                          {t('payment:countries.fr', 'France')}
                        </option>
                        <option value="ES">
                          {t('payment:countries.es', 'Spain')}
                        </option>
                        <option value="IT">
                          {t('payment:countries.it', 'Italy')}
                        </option>
                        <option value="PL">
                          {t('payment:countries.pl', 'Poland')}
                        </option>
                      </select>
                      <ChevronDownIcon className="absolute top-1/2 right-2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    </div>
                  </div>
                  <div>
                    <label
                      htmlFor="state"
                      className="block text-sm font-medium text-gray-700"
                    >
                      {t('payment:billing.state', 'State / Province')}
                    </label>
                    <input
                      type="text"
                      id="state"
                      name="state"
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-purple-500 focus:ring-1 focus:ring-purple-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="postalCode"
                      className="block text-sm font-medium text-gray-700"
                    >
                      {t('payment:billing.postalCode', 'Postal code')}
                    </label>
                    <input
                      type="text"
                      id="postalCode"
                      name="postalCode"
                      required
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-purple-500 focus:ring-1 focus:ring-purple-500 focus:outline-none"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label
                      htmlFor="phone"
                      className="block text-sm font-medium text-gray-700"
                    >
                      {t('payment:billing.phone', 'Phone')} (
                      {t('common:optional', 'optional')})
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-purple-500 focus:ring-1 focus:ring-purple-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div>
                <h2 className="mb-4 text-lg font-semibold text-gray-900">
                  {t('payment:method.title', 'Payment Method')}
                </h2>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <label className="flex cursor-pointer items-center">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="credit-card"
                        checked={paymentMethod === 'credit-card'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="h-4 w-4 text-purple-600 focus:ring-purple-500"
                      />
                      <span className="ml-2 text-sm font-medium text-gray-900">
                        {t('payment:method.creditCard', 'Credit card')}
                      </span>
                    </label>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label
                        htmlFor="cardNumber"
                        className="block text-sm font-medium text-gray-700"
                      >
                        {t('payment:card.number', 'Card number')}
                      </label>
                      <input
                        type="text"
                        id="cardNumber"
                        name="cardNumber"
                        placeholder="1234 5678 9012 3456"
                        required
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-purple-500 focus:ring-1 focus:ring-purple-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="nameOnCard"
                        className="block text-sm font-medium text-gray-700"
                      >
                        {t('payment:card.nameOnCard', 'Name on card')}
                      </label>
                      <input
                        type="text"
                        id="nameOnCard"
                        name="nameOnCard"
                        required
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-purple-500 focus:ring-1 focus:ring-purple-500 focus:outline-none"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label
                          htmlFor="expiryDate"
                          className="block text-sm font-medium text-gray-700"
                        >
                          {t(
                            'payment:card.expiryDate',
                            'Expiration date (MM/YY)',
                          )}
                        </label>
                        <input
                          type="text"
                          id="expiryDate"
                          name="expiryDate"
                          placeholder="MM/YY"
                          required
                          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-purple-500 focus:ring-1 focus:ring-purple-500 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="cvc"
                          className="block text-sm font-medium text-gray-700"
                        >
                          {t('payment:card.cvc', 'CVC')}
                        </label>
                        <input
                          type="text"
                          id="cvc"
                          name="cvc"
                          placeholder="123"
                          required
                          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-purple-500 focus:ring-1 focus:ring-purple-500 focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full rounded-lg bg-gray-950 px-4 py-3 text-base font-medium text-white shadow-md transition-colors hover:bg-gray-800 disabled:bg-gray-400"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                    {t('payment:processing', 'Processing Payment...')}
                  </div>
                ) : (
                  `${t('payment:payButton', 'Pay')} ${productInfo.price}`
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="sticky top-8">
            <div className="rounded-lg border border-gray-200 bg-purple-50 p-6">
              <h2 className="mb-4 text-lg font-semibold text-gray-900">
                {t('payment:summary.title', 'Order Summary')}
              </h2>

              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-purple-900">
                    {t('payment:summary.hostingPlan', 'Hosting Plan')}
                  </h3>
                  <p className="mt-1 text-purple-700">
                    {t(
                      'payment:summary.completePayment',
                      'Complete payment for',
                    )}{' '}
                    <strong>{productInfo.name}</strong>
                  </p>
                  <p className="mt-1 text-sm text-purple-600">
                    {productInfo.price} for {productInfo.description}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function DashboardHostingPayment() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Hosting Payment</h1>
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

  return <DashboardHostingPaymentContent />
}
