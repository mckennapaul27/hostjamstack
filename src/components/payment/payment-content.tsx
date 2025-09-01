'use client'

import { Button } from '@/components/button'
import { Heading, Subheading } from '@/components/text'
import { useCountries } from '@/utils/countries'
import { ChevronDownIcon } from '@heroicons/react/16/solid'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

interface PaymentContentProps {
  productType: 'hosting' | 'domain' | 'support'
}

interface ProductInfo {
  name: string
  price: string
  description: string
}

function PaymentContentInner({ productType }: PaymentContentProps) {
  const [productInfo, setProductInfo] = useState<ProductInfo | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState('card')
  const { t, i18n } = useTranslation(['common', 'payment'])
  const router = useRouter()
  const searchParams = useSearchParams()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { countries, loading: countriesLoading } = useCountries(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    i18n.language as any,
  )

  useEffect(() => {
    // Extract product info from URL parameters
    if (productType === 'hosting') {
      const planName = searchParams.get('planName')
      const price = searchParams.get('price')
      const billingPeriod = searchParams.get('billingPeriod')

      setProductInfo({
        name: `${planName} Plan`,
        price: `€${price}`,
        description: `${billingPeriod === '1' ? '1 month' : billingPeriod === '6' ? '6 months' : billingPeriod === '12' ? '12 months' : `${billingPeriod} months`}`,
      })
    } else if (productType === 'domain') {
      const domain = searchParams.get('domain')
      const price = searchParams.get('price')
      const years = searchParams.get('years')

      setProductInfo({
        name: domain || 'Domain',
        price: `€${price}`,
        description: `${years} ${parseInt(years || '1') === 1 ? 'year' : 'years'}`,
      })
    } else if (productType === 'support') {
      const packageName = searchParams.get('packageName')
      const price = searchParams.get('price')

      setProductInfo({
        name: packageName || 'Support Package',
        price: `€${price}`,
        description: 'One-time service',
      })
    }
  }, [productType, searchParams])

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
      router.push(`/${i18n.language}/payment/success`)
    } catch (error) {
      console.error('Payment initiation failed:', error)
      setIsLoading(false)
    }
  }

  if (!productInfo) {
    return (
      <div className="mx-auto max-w-4xl py-16">
        <div className="text-center">
          <p className="text-gray-600">{t('common:loading', 'Loading...')}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-6xl py-16">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Payment Form */}
        <div className="order-2 lg:order-1">
          <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
            <Heading as="h1" className="mb-8">
              {t('payment:checkout.title', 'Complete Your Purchase')}
            </Heading>

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
                      {t('payment:billing.firstName')}
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
                      {t('payment:billing.lastName')}
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
                      {t('payment:billing.company')}
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
                      {t('payment:billing.address')}
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
                      {t('payment:billing.apartment')}
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
                      {t('payment:billing.city')}
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
                      {t('payment:billing.country')}
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
                      {t('payment:billing.state')}
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
                      {t('payment:billing.postalCode')}
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
                      {t('payment:billing.phone')}
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
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                    {t('payment:redirecting', 'Redirecting to Payment...')}
                  </div>
                ) : (
                  `${t('payment:continueToPayment', 'Continue to Payment')} - ${productInfo.price}`
                )}
              </Button>

              {/* <p className="mt-4 text-center text-sm text-gray-500">
                <span className="inline-flex items-center">
                  🔒 {t('payment:securityNotice')}
                </span>
              </p> */}
            </form>
          </div>
        </div>

        {/* Order Summary */}
        <div className="order-1 lg:order-2">
          <div className="sticky top-8">
            <div className="rounded-2xl border border-gray-200 bg-purple-50 p-6">
              <h2 className="mb-4 text-lg font-semibold text-gray-900">
                {t('payment:summary.title', 'Order Summary')}
              </h2>

              <div className="space-y-4">
                <div>
                  <Subheading className="text-purple-900">
                    {productType === 'hosting'
                      ? t('payment:summary.hostingPlan')
                      : productType === 'domain'
                        ? t('payment:summary.domainRegistration')
                        : t('payment:summary.supportPackage')}
                  </Subheading>
                  <p className="mt-1 text-purple-700">
                    {t('payment:summary.completePayment')}{' '}
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

export default function PaymentContent({ productType }: PaymentContentProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="mx-auto max-w-4xl py-16">
        <div className="text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-b-2 border-gray-900"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return <PaymentContentInner productType={productType} />
}
