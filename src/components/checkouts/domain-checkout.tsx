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

interface DomainInfo {
  domainName: string
  available: boolean
  price?: number
  premium?: boolean
  renewalPrice?: number
  years?: number
}

function DomainCheckoutContent() {
  const [domainInfo, setDomainInfo] = useState<DomainInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [registrationPeriod, setRegistrationPeriod] = useState(1)
  const {
    t,
    i18n,
    // ready
  } = useTranslation('domains')
  const router = useRouter()
  const searchParams = useSearchParams()

  const domain = searchParams.get('domain')
  const priceParam = searchParams.get('price')
  const premiumParam = searchParams.get('premium')

  useEffect(() => {
    if (!domain) {
      router.push(`/${i18n.language}/domains`)
      return
    }

    // First try to use the data from URL params for initial load
    if (priceParam && registrationPeriod === 1) {
      setDomainInfo({
        domainName: domain,
        available: true,
        price: parseFloat(priceParam) * registrationPeriod,
        premium: premiumParam === 'true',
        renewalPrice: parseFloat(priceParam) * 1.2,
        years: registrationPeriod,
      })
      setLoading(false)
    } else {
      // Fall back to API call to get pricing or when years changed
      fetchDomainPricing(registrationPeriod)
    }
  }, [
    domain,
    priceParam,
    premiumParam,
    i18n.language,
    router,
    registrationPeriod,
  ])

  const fetchDomainPricing = async (years: number = 1) => {
    if (!domain) return

    try {
      setLoading(true)
      setError(null)

      // You could implement the name.com pricing API call here
      // For now, we'll use a fallback approach
      const response = await fetch('/api/namecom/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          keyword: domain,
          tlds: [domain.split('.').pop()],
        }),
      })

      const data = await response.json()

      if (data.error) {
        throw new Error(data.error)
      }

      const result = data.results?.find(
        (r: { domainName: string }) => r.domainName === domain,
      )
      if (result) {
        // Calculate multi-year pricing
        const yearlyPrice = result.price
        const totalPrice = yearlyPrice * years

        setDomainInfo({
          domainName: result.domainName,
          available: result.available,
          price: totalPrice,
          premium: result.premium,
          renewalPrice: yearlyPrice ? yearlyPrice * 1.2 : undefined,
          years: years,
        })
      } else {
        throw new Error('Domain not found')
      }
    } catch (err) {
      console.error('Error fetching domain pricing:', err)
      setError(t('checkout.error'))
    } finally {
      setLoading(false)
    }
  }

  const formatPrice = (price?: number) => {
    if (!price) return 'N/A'
    return `€${price.toFixed(2)}`
  }

  const handleContinue = () => {
    if (!domainInfo) return

    // Create URL with domain context
    const registerParams = new URLSearchParams({
      domain: domainInfo.domainName,
      price: domainInfo.price?.toString() || '0',
      years: registrationPeriod.toString(),
      premium: (domainInfo.premium || false).toString(),
    })

    const registerUrl = `/${i18n.language}/register?${registerParams.toString()}`
    router.push(registerUrl)
  }

  const handleBackToSearch = () => {
    router.push(`/${i18n.language}/domains`)
  }

  if (loading) {
    return (
      <div className="mt-16 flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-b-2 border-gray-900"></div>
          <p className="text-gray-600">
            {t('checkout.loading', 'Loading domain information...')}
          </p>
        </div>
      </div>
    )
  }

  if (error || !domainInfo) {
    return (
      <div className="mt-16 flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <ExclamationTriangleIcon className="mx-auto mb-4 h-12 w-12 text-red-500" />
          <p className="mb-4 text-red-600">
            {error ||
              t(
                'checkout.error',
                'Error loading domain information. Please try again.',
              )}
          </p>
          <Button onClick={handleBackToSearch} variant="outline">
            {t('checkout.backToSearch', '← Back to Domain Search')}
          </Button>
        </div>
      </div>
    )
  }

  if (!domainInfo.available) {
    return (
      <div className="mt-16 flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <ExclamationTriangleIcon className="mx-auto mb-4 h-12 w-12 text-orange-500" />
          <p className="mb-4 text-orange-600">
            Domain {domainInfo.domainName} is not available for registration
          </p>
          <Button onClick={handleBackToSearch} variant="outline">
            {t('checkout.backToSearch', '← Back to Domain Search')}
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
          onClick={handleBackToSearch}
          className="mb-6 text-sm text-gray-600 transition-colors hover:text-gray-900"
        >
          {t('checkout.backToSearch', '← Back to Domain Search')}
        </button>
        <Subheading>{t('checkout.subtitle', 'checkout')}</Subheading>
        <Heading as="h1" className="mt-2">
          {t('checkout.title', 'Domain Registration Checkout')}
        </Heading>
      </div>

      {/* Main Content */}
      <div className="mt-12 grid grid-cols-1 gap-8 pb-24 lg:grid-cols-3">
        {/* Domain Information */}
        <div className="lg:col-span-2">
          <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
            <h2 className="mb-6 text-xl font-semibold text-gray-900">
              {t('checkout.domainInfo.title', 'Domain Information')}
            </h2>

            <div className="mb-6 flex items-start gap-4 rounded-lg bg-green-50 p-4">
              <CheckCircleIcon className="mt-0.5 h-6 w-6 flex-shrink-0 text-green-600" />
              <div>
                <p className="font-medium text-green-800">
                  {domainInfo.domainName}
                </p>
                <p className="mt-1 text-sm text-green-700">
                  {t(
                    'checkout.domainInfo.available',
                    'Available for registration',
                  )}
                </p>
                {domainInfo.premium && (
                  <p className="mt-1 text-sm text-orange-700">
                    {t(
                      'checkout.domainInfo.premium',
                      'This is a premium domain',
                    )}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between border-b border-gray-200 py-3">
                <span className="text-gray-600">
                  {t('checkout.orderSummary.registrationPeriod')}
                </span>
                <select
                  value={registrationPeriod}
                  onChange={(e) =>
                    setRegistrationPeriod(parseInt(e.target.value))
                  }
                  className="rounded-md border border-gray-300 bg-white px-3 py-1 text-sm font-medium text-gray-900 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 focus:outline-none"
                  disabled={loading}
                >
                  <option value={1}>
                    {t('checkout.orderSummary.oneYear', '1 Year')}
                  </option>
                  <option value={2}>
                    {t('checkout.orderSummary.twoYears', '2 Years')}
                  </option>
                  <option value={3}>
                    {t('checkout.orderSummary.threeYears', '3 Years')}
                  </option>
                  <option value={4}>
                    {t('checkout.orderSummary.fourYears', '4 Years')}
                  </option>
                </select>
              </div>

              <div className="flex justify-between border-b border-gray-200 py-3">
                <span className="text-gray-600">
                  {t('checkout.orderSummary.price')}
                </span>
                <span className="font-medium">
                  {formatPrice(domainInfo.price)}
                </span>
              </div>

              <div className="flex justify-between border-b border-gray-200 py-3">
                <span className="text-gray-600">
                  {t('checkout.orderSummary.renewalPrice')}
                </span>
                <span className="font-medium text-gray-500">
                  {formatPrice(domainInfo.renewalPrice)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="sticky top-8 rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
            <h2 className="mb-6 text-xl font-semibold text-gray-900">
              {t('checkout.orderSummary.title', 'Order Summary')}
            </h2>

            <div className="mb-6 space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">
                  {t('checkout.orderSummary.domain')}
                </span>
                <div className="text-right">
                  <div className="font-medium">{domainInfo.domainName}</div>
                  {domainInfo.premium && (
                    <div className="text-xs text-orange-600">
                      {t('checkout.orderSummary.premium')}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600">
                  {t('checkout.orderSummary.registrationPeriod')}
                </span>
                <span className="font-medium">
                  {registrationPeriod === 1
                    ? t('checkout.orderSummary.oneYear', '1 Year')
                    : registrationPeriod === 2
                      ? t('checkout.orderSummary.twoYears', '2 Years')
                      : registrationPeriod === 3
                        ? t('checkout.orderSummary.threeYears', '3 Years')
                        : t('checkout.orderSummary.fourYears', '4 Years')}
                </span>
              </div>
            </div>

            <div className="mb-6 border-t border-gray-200 pt-4">
              <div className="mb-2 flex justify-between">
                <span className="text-gray-600">
                  {t('checkout.orderSummary.subtotal')}
                </span>
                <span className="font-medium">
                  {formatPrice(domainInfo.price)}
                </span>
              </div>

              {/* <div className="mb-2 flex justify-between">
                <span className="text-gray-600">
                  {t('checkout.orderSummary.taxes')}
                </span>
                <span className="text-sm text-gray-500">
                  {t('checkout.orderSummary.vatNotApplicable')}
                </span>
              </div> */}
            </div>

            <div className="mb-6 border-t border-gray-200 pt-4">
              <div className="flex justify-between text-lg font-semibold">
                <span>{t('checkout.orderSummary.total')}</span>
                <span>{formatPrice(domainInfo.price)}</span>
              </div>
            </div>

            <Button onClick={handleContinue} className="w-full">
              {t('checkout.continue', 'Continue to Account Setup')}
            </Button>
          </div>
        </div>
      </div>
    </main>
  )
}

export default function DomainCheckoutBody() {
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

  return <DomainCheckoutContent />
}
