'use client'

import { formatCurrency } from '@/lib/utils'
import {
  CheckCircleIcon,
  MagnifyingGlassIcon,
  XCircleIcon,
} from '@heroicons/react/24/outline'

import { useParams } from 'next/navigation'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

interface DomainSearchResult {
  domainName: string
  available: boolean
  price?: number
  premium?: boolean
  purchasePrice?: number
}

export default function DomainSearchPage() {
  const params = useParams()
  const lang = (params?.lang as string) || 'en'
  const { t } = useTranslation('dashboard')

  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<DomainSearchResult[]>([])
  const [loading, setLoading] = useState(false)

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchQuery.trim()) return

    setLoading(true)
    try {
      const cleanInput = searchQuery.trim().toLowerCase()

      const response = await fetch('/api/namecom/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          keyword: cleanInput,
          tlds: [
            'com',
            'org',
            'net',
            'info',
            'biz',
            'co',
            'ai',
            'dev',
            'io',
            'app',
            'xyz',
          ],
        }),
      })

      const data: {
        results?: DomainSearchResult[]
        suggested?: DomainSearchResult[]
        error?: string
      } = await response.json()

      if (data.error) {
        console.error('Search error:', data.error)
        setSearchResults([])
      } else {
        // Combine both results and suggested results
        const allResults = [...(data.results || []), ...(data.suggested || [])]
        setSearchResults(allResults)
      }
    } catch (error) {
      console.error('Search failed:', error)
      setSearchResults([])
    } finally {
      setLoading(false)
    }
  }

  const handlePurchase = (
    domain: string,
    price?: number,
    premium?: boolean,
  ) => {
    // Redirect to dashboard domain checkout
    const checkoutUrl = `/${lang}/dashboard/domains/checkout?domain=${encodeURIComponent(domain)}&price=${price || 0}&premium=${premium || false}`
    window.location.href = checkoutUrl
  }

  const popularExtensions = [
    { ext: '.com', price: 12.99, descriptionKey: 'com' },
    { ext: '.co', price: 17.99, descriptionKey: 'co' },
    { ext: '.info', price: 3.99, descriptionKey: 'info' },
    { ext: '.org', price: 7.49, descriptionKey: 'org' },
    { ext: '.biz', price: 9.99, descriptionKey: 'biz' },
    {
      ext: '.ai',
      price: 179.98,
      descriptionKey: 'ai',
      premium: true,
    },
  ]

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          {t('domainSearch.title')}
        </h1>
        <p className="text-gray-600">{t('domainSearch.subtitle')}</p>
      </div>

      {/* Search Form */}
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <form onSubmit={handleSearch} className="space-y-4">
          <div>
            <label
              htmlFor="domain-search"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              {t('domainSearch.form.label')}
            </label>
            <div className="flex flex-col space-x-3 sm:flex-row">
              <div className="relative !mr-0 flex-1 sm:!mr-2">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  id="domain-search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full flex-1 rounded-lg border border-gray-300 py-3 pr-4 pl-10 text-lg focus:border-transparent focus:ring-2 focus:ring-purple-500"
                  placeholder={t('domainSearch.form.placeholder')}
                />
              </div>

              <button
                type="submit"
                disabled={loading || !searchQuery.trim()}
                className="mt-2 inline-flex items-center justify-center rounded-md border border-transparent bg-gray-950 px-4 py-2 text-base font-medium whitespace-nowrap text-white shadow-md transition-colors hover:bg-gray-800 sm:mt-0"
              >
                {loading
                  ? t('domainSearch.form.searching')
                  : t('domainSearch.form.searchButton')}
              </button>
            </div>
          </div>

          <div className="text-sm text-gray-500">
            {t('domainSearch.form.helpText')}
          </div>
        </form>
      </div>

      {/* Popular Extensions */}
      {!searchResults.length && (
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">
            {t('domainSearch.popularExtensions.title')}
          </h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {popularExtensions.map((item) => (
              <div
                key={item.ext}
                className="rounded-lg border border-gray-200 p-4 transition-colors hover:border-purple-300"
              >
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-lg font-medium text-gray-900">
                    {item.ext}
                  </span>
                  {item.premium && (
                    <span className="inline-flex items-center rounded bg-purple-100 px-2 py-0.5 text-xs font-medium text-purple-800">
                      {t('domainSearch.popularExtensions.premium')}
                    </span>
                  )}
                </div>
                <p className="mb-2 text-sm text-gray-500">
                  {t(
                    `domainSearch.popularExtensions.descriptions.${item.descriptionKey}`,
                  )}
                </p>
                <div className="text-sm font-medium text-gray-900">
                  {formatCurrency(item.price)}
                  {t('domainSearch.popularExtensions.perYear')}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Search Results */}
      {searchResults.length > 0 && (
        <div className="rounded-lg border border-gray-200 bg-white">
          <div className="border-b border-gray-200 px-6 py-4">
            <h2 className="text-lg font-semibold text-gray-900">
              {t('domainSearch.results.title', { query: searchQuery })}
            </h2>
          </div>
          <div className="divide-y divide-gray-200">
            {searchResults.map((result) => (
              <div
                key={result.domainName}
                className="flex items-center justify-between p-6"
              >
                <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                    {result.available ? (
                      <CheckCircleIcon className="mr-3 h-6 w-6 text-green-500" />
                    ) : (
                      <XCircleIcon className="mr-3 h-6 w-6 text-red-500" />
                    )}
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-lg font-medium text-gray-900">
                          {result.domainName}
                        </span>
                        {result.premium && (
                          <span className="inline-flex items-center rounded bg-purple-100 px-2 py-0.5 text-xs font-medium text-purple-800">
                            {t('domainSearch.popularExtensions.premium')}
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-gray-500">
                        {result.available
                          ? t('domainSearch.results.available')
                          : t('domainSearch.results.notAvailable')}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  {result.available && result.price && (
                    <div className="text-right">
                      <div className="text-lg font-medium text-gray-900">
                        {formatCurrency(result.price)}
                      </div>
                      <div className="text-sm text-gray-500">
                        {t('domainSearch.results.perYear')}
                      </div>
                    </div>
                  )}

                  {result.available ? (
                    <button
                      onClick={() =>
                        handlePurchase(
                          result.domainName,
                          result.price,
                          result.premium,
                        )
                      }
                      className="inline-flex items-center justify-center rounded-full border border-transparent bg-gray-950 px-4 py-2 text-base font-medium whitespace-nowrap text-white shadow-md transition-colors hover:bg-gray-800"
                    >
                      {t('domainSearch.results.buyNow')}
                    </button>
                  ) : (
                    <button
                      disabled
                      className="cursor-not-allowed rounded-lg bg-gray-300 px-4 py-2 font-medium text-gray-500"
                    >
                      {t('domainSearch.results.unavailable')}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Domain Transfer */}
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">
          {t('domainSearch.transfer.title')}
        </h2>
        <p className="mb-4 text-gray-600">
          {t('domainSearch.transfer.description')}
        </p>
        <button
          type="button"
          className="inline-flex items-center justify-center rounded-full border border-transparent bg-gray-950 px-4 py-2 text-base font-medium whitespace-nowrap text-white shadow-md transition-colors hover:bg-gray-800"
        >
          {t('domainSearch.transfer.button')}
        </button>
      </div>
    </div>
  )
}
