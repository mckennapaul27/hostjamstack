'use client'

import { formatCurrency } from '@/lib/utils'
import { useCountries } from '@/utils/countries'
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

function DashboardDomainPaymentContent() {
  const [productInfo, setProductInfo] = useState<ProductInfo | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState('card')
  const params = useParams()
  const router = useRouter()
  const searchParams = useSearchParams()
  const lang = (params?.lang as string) || 'en'
  const { t } = useTranslation(['payment', 'domains', 'common'])
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { countries, loading: countriesLoading } = useCountries(lang as any)

  useEffect(() => {
    // Extract product info from URL parameters
    const domain = searchParams.get('domain')
    const price = searchParams.get('price')
    const years = searchParams.get('years')

    if (domain && price) {
      setProductInfo({
        name: domain,
        price: formatCurrency(parseFloat(price)),
        description: `${years || '1'} ${parseInt(years || '1') === 1 ? 'year' : 'years'}`,
      })
    }
  }, [searchParams])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Collect form data
    const formData = new FormData(e.target as HTMLFormElement)
    const billingData = {
      firstName: formData.get('firstName'),
      lastName: formData.get('lastName'),
      company: formData.get('company'),
      address: formData.get('address'),
      apartment: formData.get('apartment'),
      city: formData.get('city'),
      country: formData.get('country'),
      state: formData.get('state'),
      postalCode: formData.get('postalCode'),
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

  const handleBackToCheckout = () => {
    const domain = searchParams.get('domain')
    const price = searchParams.get('price')
    const premium = searchParams.get('premium')

    if (domain) {
      router.push(
        `/${lang}/dashboard/domains/checkout?domain=${encodeURIComponent(domain)}&price=${price || 0}&premium=${premium || false}`,
      )
    } else {
      router.push(`/${lang}/dashboard/domains/search`)
    }
  }

  if (!productInfo) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Domain Payment</h1>
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
          {t(
            'payment:domainPaymentDescription',
            'Enter your payment details to complete your domain registration',
          )}
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
                  {/* Credit Card/Debit Card Option */}
                  <div className="rounded-lg border border-gray-200 p-4">
                    <label className="flex cursor-pointer items-center">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="card"
                        checked={paymentMethod === 'card'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="h-4 w-4 text-purple-600 focus:ring-purple-500"
                      />
                      <span className="ml-3 text-sm font-medium text-gray-900">
                        {t('payment:method.card', 'Credit/Debit Card')}
                      </span>
                    </label>
                    {paymentMethod === 'card' && (
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
                    )}
                  </div>

                  {/* Skrill Option */}
                  <div className="rounded-lg border border-gray-200 p-4">
                    <label className="flex cursor-pointer items-center">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="skrill"
                        checked={paymentMethod === 'skrill'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="h-4 w-4 text-purple-600 focus:ring-purple-500"
                      />
                      <span className="ml-3 text-sm font-medium text-gray-900">
                        {t('payment:method.skrill', 'Skrill')}
                      </span>
                    </label>
                    {paymentMethod === 'skrill' && (
                      <div className="mt-3">
                        <img
                          src="/payment-icons/skrill.svg"
                          alt="Skrill"
                          className="h-6"
                        />
                      </div>
                    )}
                  </div>

                  {/* Paysafecard Option */}
                  <div className="rounded-lg border border-gray-200 p-4">
                    <label className="flex cursor-pointer items-center">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="paysafecard"
                        checked={paymentMethod === 'paysafecard'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="h-4 w-4 text-purple-600 focus:ring-purple-500"
                      />
                      <span className="ml-3 text-sm font-medium text-gray-900">
                        {t('payment:method.paysafecard', 'Paysafecard')}
                      </span>
                    </label>
                    {paymentMethod === 'paysafecard' && (
                      <div className="mt-3">
                        <img
                          src="/payment-icons/paysafecard.svg"
                          alt="Paysafecard"
                          className="h-6"
                        />
                      </div>
                    )}
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
                    {t('payment:redirecting', 'Redirecting to Payment...')}
                  </div>
                ) : (
                  `${t('payment:payButton', 'Continue to Payment')} - ${productInfo.price}`
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
                    {t(
                      'payment:summary.domainRegistration',
                      'Domain Registration',
                    )}
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

export default function DashboardDomainPayment() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Domain Payment</h1>
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

  return <DashboardDomainPaymentContent />
}
