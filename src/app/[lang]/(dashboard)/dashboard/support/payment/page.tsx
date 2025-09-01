'use client'

import { formatCurrency } from '@/lib/utils'
import { useCountries } from '@/utils/countries'
import { ChevronDownIcon } from '@heroicons/react/16/solid'
import { ArrowLeftIcon } from '@heroicons/react/24/outline'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

interface ProductInfo {
  packageName: string
  packageSlug: string
  price: number
}

function DashboardSupportPaymentContent() {
  const [productInfo, setProductInfo] = useState<ProductInfo | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const params = useParams()
  const router = useRouter()
  const searchParams = useSearchParams()
  const lang = (params?.lang as string) || 'en'
  const { t, ready } = useTranslation(['payment', 'support-packages', 'common'])
  const { countries, loading: countriesLoading } = useCountries(lang as any)

  useEffect(() => {
    const packageName = searchParams.get('name')
    const packageSlug = searchParams.get('package')
    const price = searchParams.get('price')

    if (packageName && packageSlug && price) {
      setProductInfo({
        packageName,
        packageSlug,
        price: parseFloat(price),
      })
    }
  }, [searchParams])

  const formatPrice = (price: number) => formatCurrency(price)

  const handleBackToCheckout = () => {
    const packageSlug = searchParams.get('package')

    if (packageSlug) {
      router.push(`/${lang}/dashboard/support/checkout?package=${packageSlug}`)
    } else {
      router.push(`/${lang}/dashboard/support/packages`)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Collect form data
    const formData = new FormData(e.target as HTMLFormElement)
    const billingData = {
      firstName: formData.get('firstName'),
      lastName: formData.get('lastName'),
      email: formData.get('email'),
      company: formData.get('company'),
      address: formData.get('address'),
      city: formData.get('city'),
      postalCode: formData.get('postalCode'),
      country: formData.get('country'),
      phone: formData.get('phone'),
      paymentMethod: formData.get('paymentMethod'),
    }

    try {
      // TODO: Replace with actual payment gateway redirect
      // For now, redirect to external payment gateway (placeholder)
      const paymentGatewayUrl = 'https://payment.example.com/checkout'

      // In a real implementation, you would:
      // 1. Send billing data to your backend
      // 2. Create a payment session
      // 3. Redirect to the payment provider

      // Simulate redirect delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // For demo purposes, redirect to success page
      router.push(`/${lang}/dashboard/payment/success`)
    } catch (error) {
      console.error('Payment initiation failed:', error)
      setIsLoading(false)
    }
  }

  if (!ready) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Payment</h1>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!productInfo) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {t('payment:title', 'Payment')}
          </h1>
          <p className="text-red-600">
            {t('payment:errors.noProductInfo', 'No product information found')}
          </p>
        </div>
        <button
          onClick={() => router.push(`/${lang}/dashboard/support/packages`)}
          className="inline-flex items-center text-purple-600 hover:text-purple-800"
        >
          <ArrowLeftIcon className="mr-2 h-4 w-4" />
          {t('common:navigation.back', 'Back')}
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <button
          onClick={handleBackToCheckout}
          className="mb-4 inline-flex items-center text-purple-600 hover:text-purple-800"
        >
          <ArrowLeftIcon className="mr-2 h-4 w-4" />
          {t('payment:navigation.backToCheckout', 'Back to checkout')}
        </button>
        <h1 className="text-2xl font-bold text-gray-900">
          {t('payment:title', 'Payment')}
        </h1>
        <p className="text-gray-600">
          {t('payment:subtitle', 'Complete your purchase')}
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Payment Form */}
          <div className="space-y-6">
            {/* Billing Information */}
            <div className="rounded-lg border border-gray-200 bg-white p-6">
              <h2 className="mb-4 text-lg font-semibold text-gray-900">
                {t('payment:billing.title', 'Billing Information')}
              </h2>

              <div className="grid grid-cols-1 gap-4">
                <div className="grid grid-cols-2 gap-4">
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
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700"
                  >
                    {t('payment:billing.email', 'Email address')}
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-purple-500 focus:ring-1 focus:ring-purple-500 focus:outline-none"
                  />
                </div>

                <div>
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

                <div>
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

                <div className="grid grid-cols-2 gap-4">
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
                </div>

                <div className="grid grid-cols-2 gap-4">
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
                        disabled={countriesLoading}
                        className="mt-1 block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 pr-8 shadow-sm focus:border-purple-500 focus:ring-1 focus:ring-purple-500 focus:outline-none disabled:opacity-50"
                      >
                        {countriesLoading ? (
                          <option value="">
                            {t('common:loading', 'Loading...')}
                          </option>
                        ) : (
                          countries.map((country) => (
                            <option key={country.code} value={country.code}>
                              {country.name}
                            </option>
                          ))
                        )}
                      </select>
                      <ChevronDownIcon className="absolute top-1/2 right-2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    </div>
                  </div>
                  <div>
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
            </div>

            {/* Payment Method */}
            <div className="rounded-lg border border-gray-200 bg-white p-6">
              <h2 className="mb-4 text-lg font-semibold text-gray-900">
                {t('payment:method.title', 'Payment Method')}
              </h2>

              <div className="space-y-4">
                {/* Credit Card/Debit Card Option */}
                <div className="rounded-lg border border-gray-200 p-4">
                  <label className="flex cursor-pointer items-center">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="card"
                      defaultChecked
                      className="h-4 w-4 text-purple-600 focus:ring-purple-500"
                    />
                    <span className="ml-3 text-sm font-medium text-gray-900">
                      {t('payment:method.card', 'Credit/Debit Card')}
                    </span>
                  </label>
                  <div className="mt-3 flex items-center space-x-2">
                    <img
                      src="/payment-icons/visa.svg"
                      alt="Visa"
                      className="h-6"
                    />
                    <img
                      src="/payment-icons/mastercard.svg"
                      alt="Mastercard"
                      className="h-6"
                    />
                    <img
                      src="/payment-icons/apple.svg"
                      alt="Apple Pay"
                      className="h-6"
                    />
                  </div>
                </div>

                {/* Skrill Option */}
                <div className="rounded-lg border border-gray-200 p-4">
                  <label className="flex cursor-pointer items-center">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="skrill"
                      className="h-4 w-4 text-purple-600 focus:ring-purple-500"
                    />
                    <span className="ml-3 text-sm font-medium text-gray-900">
                      {t('payment:method.skrill', 'Skrill')}
                    </span>
                  </label>
                  <div className="mt-3">
                    <img
                      src="/payment-icons/skrill.svg"
                      alt="Skrill"
                      className="h-6"
                    />
                  </div>
                </div>

                {/* Paysafecard Option */}
                <div className="rounded-lg border border-gray-200 p-4">
                  <label className="flex cursor-pointer items-center">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="paysafecard"
                      className="h-4 w-4 text-purple-600 focus:ring-purple-500"
                    />
                    <span className="ml-3 text-sm font-medium text-gray-900">
                      {t('payment:method.paysafecard', 'Paysafecard')}
                    </span>
                  </label>
                  <div className="mt-3">
                    <img
                      src="/payment-icons/paysafecard.svg"
                      alt="Paysafecard"
                      className="h-6"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            <div className="rounded-lg border border-gray-200 bg-white p-6">
              <h2 className="mb-4 text-lg font-semibold text-gray-900">
                {t('payment:summary.title', 'Order Summary')}
              </h2>

              <div className="space-y-4">
                <div className="rounded-lg border border-purple-200 bg-purple-50 p-4">
                  <h3 className="font-medium text-purple-900">
                    {t('support-packages:checkout.packageType', 'Package Type')}
                  </h3>
                  <p className="mt-1 text-purple-700">
                    {t(
                      'payment:summary.completePayment',
                      'Complete payment for',
                    )}{' '}
                    <strong>{productInfo.packageName}</strong>
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">
                      {t(
                        'support-packages:checkout.orderSummary.package',
                        'Package',
                      )}
                    </span>
                    <span className="font-medium">
                      {productInfo.packageName}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-600">
                      {t(
                        'support-packages:checkout.billing.type',
                        'Billing Type',
                      )}
                    </span>
                    <span className="font-medium">
                      {t(
                        'support-packages:checkout.billing.oneTime',
                        'One-time payment',
                      )}
                    </span>
                  </div>

                  <div className="border-t border-gray-200 pt-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">
                        {t(
                          'support-packages:checkout.orderSummary.subtotal',
                          'Subtotal',
                        )}
                      </span>
                      <span className="font-medium">
                        {formatPrice(productInfo.price)}
                      </span>
                    </div>

                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">
                        {t(
                          'support-packages:checkout.orderSummary.taxes',
                          'Taxes',
                        )}
                      </span>
                      <span className="text-gray-500">
                        {t(
                          'support-packages:checkout.orderSummary.vatNotApplicable',
                          'VAT not applicable',
                        )}
                      </span>
                    </div>
                  </div>

                  <div className="border-t border-gray-200 pt-2">
                    <div className="flex justify-between text-lg font-semibold">
                      <span className="text-gray-900">
                        {t(
                          'support-packages:checkout.orderSummary.total',
                          'Total',
                        )}
                      </span>
                      <span className="text-gray-900">
                        {formatPrice(productInfo.price)}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full rounded-lg bg-gray-950 px-4 py-3 text-base font-medium text-white shadow-md transition-colors hover:bg-gray-800 disabled:opacity-50"
                >
                  {isLoading
                    ? t('payment:redirecting', 'Redirecting to Payment...')
                    : t('payment:continueToPayment', 'Continue to Payment')}
                </button>
              </div>
            </div>

            {/* Security Notice */}
            <div className="rounded-lg border border-green-200 bg-green-50 p-4">
              <h4 className="font-medium text-green-900">
                {t('payment:security.title', 'Secure Payment')}
              </h4>
              <p className="mt-1 text-sm text-green-700">
                {t(
                  'payment:security.description',
                  'Your payment information is encrypted and secure.',
                )}
              </p>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}

export default function DashboardSupportPayment() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Payment</h1>
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

  return <DashboardSupportPaymentContent />
}
