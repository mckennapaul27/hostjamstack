'use client'

import { Button } from '@/components/button'
import { Heading, Subheading } from '@/components/text'
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
  const [paymentMethod, setPaymentMethod] = useState('credit-card')
  const { t, i18n } = useTranslation(['common', 'payment'])
  const router = useRouter()
  const searchParams = useSearchParams()

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

    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Redirect to success page
    router.push(`/${i18n.language}/payment/success`)
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
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
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
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
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
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
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
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
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
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
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
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
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
                        className="mt-1 block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 pr-8 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                      >
                        <option value="US">{t('payment:countries.us')}</option>
                        <option value="GB">{t('payment:countries.gb')}</option>
                        <option value="DE">{t('payment:countries.de')}</option>
                        <option value="FR">{t('payment:countries.fr')}</option>
                        <option value="ES">{t('payment:countries.es')}</option>
                        <option value="IT">{t('payment:countries.it')}</option>
                        <option value="PL">{t('payment:countries.pl')}</option>
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
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
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
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
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
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div>
                <h2 className="mb-4 text-lg font-semibold text-gray-900">
                  {t('payment:method.title', 'Payment')}
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
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500"
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
                        {t('payment:card.number')}
                      </label>
                      <input
                        type="text"
                        id="cardNumber"
                        name="cardNumber"
                        placeholder="1234 5678 9012 3456"
                        required
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="nameOnCard"
                        className="block text-sm font-medium text-gray-700"
                      >
                        {t('payment:card.nameOnCard')}
                      </label>
                      <input
                        type="text"
                        id="nameOnCard"
                        name="nameOnCard"
                        required
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label
                          htmlFor="expiryDate"
                          className="block text-sm font-medium text-gray-700"
                        >
                          {t('payment:card.expiryDate')}
                        </label>
                        <input
                          type="text"
                          id="expiryDate"
                          name="expiryDate"
                          placeholder="MM/YY"
                          required
                          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="cvc"
                          className="block text-sm font-medium text-gray-700"
                        >
                          {t('payment:card.cvc')}
                        </label>
                        <input
                          type="text"
                          id="cvc"
                          name="cvc"
                          placeholder="123"
                          required
                          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                    {t('payment:processing', 'Processing Payment...')}
                  </div>
                ) : (
                  `${t('payment:payButton', 'Pay')} ${productInfo.price}`
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
            <div className="rounded-2xl border border-gray-200 bg-blue-50 p-6">
              <h2 className="mb-4 text-lg font-semibold text-gray-900">
                {t('payment:summary.title', 'Order Summary')}
              </h2>

              <div className="space-y-4">
                <div>
                  <Subheading className="text-blue-900">
                    {productType === 'hosting'
                      ? t('payment:summary.hostingPlan')
                      : productType === 'domain'
                        ? t('payment:summary.domainRegistration')
                        : t('payment:summary.supportPackage')}
                  </Subheading>
                  <p className="mt-1 text-blue-700">
                    {t('payment:summary.completePayment')}{' '}
                    <strong>{productInfo.name}</strong>
                  </p>
                  <p className="mt-1 text-sm text-blue-600">
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
