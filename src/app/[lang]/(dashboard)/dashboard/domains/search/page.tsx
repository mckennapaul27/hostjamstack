'use client'

import { purchaseDomain, searchDomains } from '@/lib/dashboard-api'
import { formatCurrency } from '@/lib/utils'
import {
  CheckCircleIcon,
  MagnifyingGlassIcon,
  XCircleIcon,
} from '@heroicons/react/24/outline'
import { useSession } from 'next-auth/react'
import { useParams } from 'next/navigation'
import { useState } from 'react'

interface DomainSearchResult {
  domain: string
  available: boolean
  price: number
  currency: string
  premium?: boolean
}

export default function DomainSearchPage() {
  const { data: session } = useSession()
  const params = useParams()
  const lang = (params?.lang as string) || 'en'
  console.log('lang in domains/search page', lang)

  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<DomainSearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [purchasing, setPurchasing] = useState<string | null>(null)

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchQuery.trim() || !session?.rawJwt) return

    setLoading(true)
    try {
      const results = await searchDomains(session.rawJwt, searchQuery)
      console.log('results in domains/search page', results)

      // Mock results for development
      const mockResults: DomainSearchResult[] = [
        {
          domain: `${searchQuery}.com`,
          available: true,
          price: 12.99,
          currency: 'EUR',
        },
        {
          domain: `${searchQuery}.net`,
          available: false,
          price: 14.99,
          currency: 'EUR',
        },
        {
          domain: `${searchQuery}.org`,
          available: true,
          price: 16.99,
          currency: 'EUR',
        },
        {
          domain: `${searchQuery}.io`,
          available: true,
          price: 45.99,
          currency: 'EUR',
          premium: true,
        },
        {
          domain: `${searchQuery}.dev`,
          available: true,
          price: 39.99,
          currency: 'EUR',
          premium: true,
        },
        {
          domain: `${searchQuery}.app`,
          available: false,
          price: 25.99,
          currency: 'EUR',
        },
        {
          domain: `${searchQuery}.co`,
          available: true,
          price: 29.99,
          currency: 'EUR',
        },
        {
          domain: `${searchQuery}.xyz`,
          available: true,
          price: 8.99,
          currency: 'EUR',
        },
      ]

      setSearchResults(mockResults)
    } catch (error) {
      console.error('Search failed:', error)
    } finally {
      setLoading(false)
    }
  }

  const handlePurchase = async (domain: string) => {
    if (!session?.rawJwt) return

    setPurchasing(domain)
    try {
      const result = await purchaseDomain(session.rawJwt, domain, 1)
      console.log('Purchase initiated:', result)
      // Redirect to payment or show success
    } catch (error) {
      console.error('Purchase failed:', error)
    } finally {
      setPurchasing(null)
    }
  }

  const popularExtensions = [
    { ext: '.com', price: 12.99, description: 'Most popular choice' },
    { ext: '.net', price: 14.99, description: 'Great for tech companies' },
    { ext: '.org', price: 16.99, description: 'Perfect for organizations' },
    {
      ext: '.io',
      price: 45.99,
      description: 'Popular with startups',
      premium: true,
    },
    {
      ext: '.dev',
      price: 39.99,
      description: 'Perfect for developers',
      premium: true,
    },
    { ext: '.app', price: 25.99, description: 'Great for applications' },
  ]

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Search Domains</h1>
        <p className="text-gray-600">
          Find and register the perfect domain for your project
        </p>
      </div>

      {/* Search Form */}
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <form onSubmit={handleSearch} className="space-y-4">
          <div>
            <label
              htmlFor="domain-search"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Enter your domain name
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
                  placeholder="yourdomain"
                />
              </div>

              <button
                type="submit"
                disabled={loading || !searchQuery.trim()}
                className="mt-2 inline-flex items-center justify-center rounded-md border border-transparent bg-gray-950 px-4 py-2 text-base font-medium whitespace-nowrap text-white shadow-md transition-colors hover:bg-gray-800 sm:mt-0"
              >
                {loading ? 'Searching...' : 'Search'}
              </button>
            </div>
          </div>

          <div className="text-sm text-gray-500">
            Enter a domain name without the extension (e.g.,
            &quot;mywebsite&quot; not &quot;mywebsite.com&quot;)
          </div>
        </form>
      </div>

      {/* Popular Extensions */}
      {!searchResults.length && (
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">
            Popular Extensions
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
                      Premium
                    </span>
                  )}
                </div>
                <p className="mb-2 text-sm text-gray-500">{item.description}</p>
                <div className="text-sm font-medium text-gray-900">
                  {formatCurrency(item.price)}/year
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
              Search Results for &quot;{searchQuery}&quot;
            </h2>
          </div>
          <div className="divide-y divide-gray-200">
            {searchResults.map((result) => (
              <div
                key={result.domain}
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
                          {result.domain}
                        </span>
                        {result.premium && (
                          <span className="inline-flex items-center rounded bg-purple-100 px-2 py-0.5 text-xs font-medium text-purple-800">
                            Premium
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-gray-500">
                        {result.available ? 'Available' : 'Not available'}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  {result.available && (
                    <div className="text-right">
                      <div className="text-lg font-medium text-gray-900">
                        {formatCurrency(result.price, result.currency)}
                      </div>
                      <div className="text-sm text-gray-500">per year</div>
                    </div>
                  )}

                  {result.available ? (
                    <button
                      onClick={() => handlePurchase(result.domain)}
                      disabled={purchasing === result.domain}
                      className="inline-flex items-center justify-center rounded-full border border-transparent bg-gray-950 px-4 py-2 text-base font-medium whitespace-nowrap text-white shadow-md transition-colors hover:bg-gray-800 disabled:bg-gray-400"
                    >
                      {purchasing === result.domain
                        ? 'Processing...'
                        : 'Buy Now'}
                    </button>
                  ) : (
                    <button
                      disabled
                      className="cursor-not-allowed rounded-lg bg-gray-300 px-4 py-2 font-medium text-gray-500"
                    >
                      Unavailable
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
          Transfer Existing Domain
        </h2>
        <p className="mb-4 text-gray-600">
          Already own a domain? Transfer it to HostJamstack to manage everything
          in one place.
        </p>
        <button
          type="button"
          className="inline-flex items-center justify-center rounded-full border border-transparent bg-gray-950 px-4 py-2 text-base font-medium whitespace-nowrap text-white shadow-md transition-colors hover:bg-gray-800"
        >
          Transfer Domain
        </button>
      </div>
    </div>
  )
}
