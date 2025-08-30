'use client'

import { formatCurrency } from '@/lib/utils'
import { ArrowLeftIcon, CheckCircleIcon } from '@heroicons/react/24/outline'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
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

function DashboardDomainCheckoutContent() {
  const [domainInfo, setDomainInfo] = useState<DomainInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [registrationPeriod, setRegistrationPeriod] = useState(1)
  const params = useParams()
  const router = useRouter()
  const searchParams = useSearchParams()
  const lang = (params?.lang as string) || 'en'
  const { t } = useTranslation(['domains', 'payment', 'common'])

  const domain = searchParams.get('domain')
  const priceParam = searchParams.get('price')
  const premiumParam = searchParams.get('premium')

  useEffect(() => {
    if (!domain) {
      router.push(`/${lang}/dashboard/domains/search`)
      return
    }

    // Use the data from URL params for initial load
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
      // Refetch pricing when years changed
      fetchDomainPricing(registrationPeriod)
    }
  }, [domain, priceParam, premiumParam, router, lang, registrationPeriod])

  const fetchDomainPricing = async (years: number = 1) => {
    if (!domain) return

    try {
      setLoading(true)
      setError(null)

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
      setError(
        t(
          'domains:checkout.error',
          'Error loading domain information. Please try again.',
        ),
      )
    } finally {
      setLoading(false)
    }
  }

  const formatPrice = (price?: number) => {
    if (!price) return 'N/A'
    return formatCurrency(price)
  }

  const handleContinue = () => {
    if (!domainInfo) return

    // Redirect to dashboard payment page
    const paymentParams = new URLSearchParams({
      domain: domainInfo.domainName,
      price: domainInfo.price?.toString() || '0',
      years: registrationPeriod.toString(),
      premium: (domainInfo.premium || false).toString(),
    })

    const paymentUrl = `/${lang}/dashboard/domains/payment?${paymentParams.toString()}`
    router.push(paymentUrl)
  }

  const handleBackToSearch = () => {
    router.push(`/${lang}/dashboard/domains/search`)
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {t('domains:checkout.title', 'Domain Registration Checkout')}
          </h1>
          <p className="text-gray-600">
            {t('domains:checkout.loading', 'Loading domain information...')}
          </p>
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

  if (error || !domainInfo) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Domain Checkout</h1>
          <p className="text-red-600">{error || 'Domain not found'}</p>
        </div>
        <button
          onClick={handleBackToSearch}
          className="inline-flex items-center text-purple-600 hover:text-purple-800"
        >
          <ArrowLeftIcon className="mr-2 h-4 w-4" />
          Back to Domain Search
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <button
          onClick={handleBackToSearch}
          className="mb-4 inline-flex items-center text-purple-600 hover:text-purple-800"
        >
          {/* <ArrowLeftIcon className="mr-2 h-4 w-4" /> */}
          {t('domains:checkout.backToSearch', 'Back to Domain Search')}
        </button>
        <h1 className="text-2xl font-bold text-gray-900">
          {t('domains:checkout.title', 'Domain Registration Checkout')}
        </h1>
        <p className="text-gray-600">
          {t('domains:checkout.subtitle', 'Complete your domain registration')}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Domain Information */}
        <div className="lg:col-span-2">
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">
              {t('domains:checkout.domainInfo.title', 'Domain Information')}
            </h2>

            <div className="mb-4 flex items-center">
              <CheckCircleIcon className="mr-3 h-6 w-6 text-green-500" />
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-xl font-medium text-gray-900">
                    {domainInfo.domainName}
                  </span>
                  {domainInfo.premium && (
                    <span className="inline-flex items-center rounded bg-purple-100 px-2 py-0.5 text-xs font-medium text-purple-800">
                      {t(
                        'domains:checkout.orderSummary.premium',
                        'Premium Domain',
                      )}
                    </span>
                  )}
                </div>
                <div className="text-sm text-green-600">
                  {t(
                    'domains:checkout.domainInfo.available',
                    'Available for registration',
                  )}
                </div>
              </div>
            </div>

            {domainInfo.premium && (
              <div className="mb-4 rounded-lg bg-purple-50 p-4">
                <p className="text-sm text-purple-800">
                  {t(
                    'domains:checkout.domainInfo.premium',
                    'This is a premium domain with special pricing.',
                  )}
                </p>
              </div>
            )}

            {/* Registration Period */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                {t(
                  'domains:checkout.orderSummary.registrationPeriod',
                  'Registration Period',
                )}
              </label>
              <select
                value={registrationPeriod}
                onChange={(e) =>
                  setRegistrationPeriod(parseInt(e.target.value))
                }
                className="block w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-purple-500"
              >
                <option value={1}>
                  {t('domains:checkout.orderSummary.oneYear', '1 Year')}
                </option>
                <option value={2}>
                  {t('domains:checkout.orderSummary.twoYears', '2 Years')}
                </option>
                <option value={3}>
                  {t('domains:checkout.orderSummary.threeYears', '3 Years')}
                </option>
                <option value={4}>
                  {t('domains:checkout.orderSummary.fourYears', '4 Years')}
                </option>
                <option value={5}>5 Years</option>
              </select>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">
              {t('domains:checkout.orderSummary.title', 'Order Summary')}
            </h2>

            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">
                  {t('domains:checkout.orderSummary.domain', 'Domain')}
                </span>
                <span className="font-medium">{domainInfo.domainName}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600">
                  {t(
                    'domains:checkout.orderSummary.registrationPeriod',
                    'Registration Period',
                  )}
                </span>
                <span className="font-medium">
                  {registrationPeriod}{' '}
                  {registrationPeriod === 1
                    ? t('common:auth.register.year', 'Year')
                    : t('common:auth.register.years', 'Years')}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600">
                  {t('domains:checkout.orderSummary.price', 'Price')}
                </span>
                <span className="font-medium">
                  {formatPrice(domainInfo.price)}
                </span>
              </div>

              {domainInfo.renewalPrice && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">
                    {t(
                      'domains:checkout.orderSummary.renewalPrice',
                      'Renewal Price',
                    )}
                  </span>
                  <span className="text-gray-500">
                    {formatPrice(domainInfo.renewalPrice)}/year
                  </span>
                </div>
              )}

              <hr className="my-4" />

              <div className="flex justify-between">
                <span className="text-gray-600">
                  {t('domains:checkout.orderSummary.subtotal', 'Subtotal')}
                </span>
                <span className="font-medium">
                  {formatPrice(domainInfo.price)}
                </span>
              </div>

              {/* <div className="flex justify-between text-sm">
                <span className="text-gray-500">{t('domains:checkout.orderSummary.taxes', 'Taxes')}</span>
                <span className="text-gray-500">{t('domains:checkout.orderSummary.vatNotApplicable', 'VAT not applicable')}</span>
              </div> */}

              <hr className="my-4" />

              <div className="flex justify-between text-lg font-semibold">
                <span>{t('domains:checkout.orderSummary.total', 'Total')}</span>
                <span>{formatPrice(domainInfo.price)}</span>
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

export default function DashboardDomainCheckout() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Domain Checkout</h1>
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

  return <DashboardDomainCheckoutContent />
}
