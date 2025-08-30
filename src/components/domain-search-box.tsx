'use client'

import { clsx } from 'clsx'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from './button'
import { Container } from './container'
import { Heading, Subheading } from './text'

const domainExtensions = [
  { extension: '.com', price: '€12.99', period: 'Year' },
  { extension: '.co', price: '€17.99', period: 'Year' },
  { extension: '.info', price: '€3.99', period: 'Year' },
  { extension: '.org', price: '€7.49', period: 'Year' },
  { extension: '.biz', price: '€9.99', period: 'Year' },
  { extension: '.ai', price: '€179.98', period: 'Year' },
]

interface DomainResult {
  domainName: string
  available: boolean
  price?: number
  premium?: boolean
  purchasePrice?: number
}

interface SearchResponse {
  results: DomainResult[]
  suggested?: DomainResult[]
  error?: string
}

export function DomainSearchBox({ className = '' }: { className?: string }) {
  const { t, i18n } = useTranslation('domains')
  const router = useRouter()
  const [domainInput, setDomainInput] = useState('')
  const [searchResults, setSearchResults] = useState<DomainResult[]>([])
  const [suggestedResults, setSuggestedResults] = useState<DomainResult[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)

  const handleSearch = async () => {
    if (!domainInput.trim()) return

    setIsSearching(true)
    setHasSearched(false)

    try {
      const cleanInput = domainInput.trim().toLowerCase()

      const response = await fetch('/api/namecom/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          keyword: cleanInput,
          tlds: ['com', 'org', 'net', 'info', 'biz', 'co', 'ai'],
        }),
      })

      const data: SearchResponse = await response.json()

      if (data.error) {
        console.error('Search error:', data.error)
        setSearchResults([])
        setSuggestedResults([])
      } else {
        setSearchResults(data.results || [])
        setSuggestedResults(data.suggested || [])
      }
    } catch (error) {
      console.error('Failed to search domains:', error)
      setSearchResults([])
      setSuggestedResults([])
    } finally {
      setIsSearching(false)
      setHasSearched(true)
    }
  }

  const formatPrice = (price?: number) => {
    if (!price) return 'N/A'
    return `€${price.toFixed(2)}`
  }

  const getExtensionColor = (extension: string) => {
    switch (extension) {
      case '.com':
        return 'text-purple-400'
      case '.co':
        return 'text-red-400'
      case '.info':
        return 'text-orange-400'
      case '.org':
        return 'text-green-400'
      case '.biz':
        return 'text-cyan-400'
      case '.net':
        return 'text-purple-400'
      case '.ai':
        return 'text-pink-400'
      default:
        return 'text-gray-400'
    }
  }

  // Helper function to properly parse domain names with multi-part TLDs
  const parseDomainName = (fullDomain: string) => {
    const parts = fullDomain.split('.')
    if (parts.length === 2) {
      // Simple case: example.com
      return {
        name: parts[0],
        extension: `.${parts[1]}`,
      }
    } else if (parts.length >= 3) {
      // Multi-part TLD case: example.co.uk
      return {
        name: parts[0],
        extension: `.${parts.slice(1).join('.')}`,
      }
    } else {
      // Fallback
      return {
        name: fullDomain,
        extension: '',
      }
    }
  }

  return (
    <div className={clsx('mx-2 mt-2 rounded-4xl bg-gray-900 py-32', className)}>
      <Container>
        <div className="text-center">
          <Subheading dark>{t('search.subtitle')}</Subheading>
          <Heading as="h2" dark className="mx-auto mt-2 max-w-none">
            {t('search.title')}
          </Heading>

          {/* Search Form */}
          <div className="mx-auto mt-12 max-w-2xl">
            <div className="flex flex-col items-center gap-3 sm:flex-row">
              {/* Domain Input */}
              <div className="relative w-full flex-1">
                <input
                  type="text"
                  value={domainInput}
                  onChange={(e) => setDomainInput(e.target.value)}
                  placeholder={t('search.placeholder')}
                  className={clsx(
                    'block w-full rounded-lg border border-transparent shadow-sm ring-1 ring-white/20',
                    'bg-white/10 px-4 py-3 text-base text-white placeholder-white/60',
                    'focus:border-transparent focus:ring-2 focus:ring-purple-500 focus:outline-none',
                    'backdrop-blur-sm',
                  )}
                  onKeyDown={(e) =>
                    e.key === 'Enter' && !isSearching && handleSearch()
                  }
                  disabled={isSearching}
                />
              </div>

              {/* Search Button */}
              <Button
                onClick={handleSearch}
                disabled={isSearching || !domainInput.trim()}
                className={clsx(
                  'cursor-pointer rounded-md bg-white !py-3 !leading-[24px] !text-gray-900 shadow-md ring-1 ring-white/20',
                  'hover:!bg-white/90 disabled:cursor-not-allowed disabled:!bg-white/50',
                )}
              >
                {isSearching
                  ? t('search.searchingButton')
                  : t('search.searchButton')}
              </Button>
            </div>

            {/* Helper text */}
            <p className="mt-3 text-sm text-white/60">
              {t('search.helperText')}
            </p>
          </div>

          {/* Search Results */}
          {hasSearched && (
            <div className="mx-auto mt-16 max-w-6xl">
              {searchResults.length > 0 ? (
                <>
                  <div className="mb-8">
                    <h3 className="mb-6 text-xl font-semibold text-white">
                      {t('search.results.title')}
                    </h3>
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      {searchResults.map((result) => {
                        const { name, extension } = parseDomainName(
                          result.domainName,
                        )
                        return (
                          <div
                            key={result.domainName}
                            className={clsx(
                              'rounded-lg p-6 text-center backdrop-blur-sm transition-all',
                              result.available
                                ? 'bg-green-500/20 ring-1 ring-green-400/30 hover:bg-green-500/30'
                                : 'bg-red-500/20 ring-1 ring-red-400/30',
                            )}
                          >
                            <div className="mb-2">
                              <span className="text-lg font-semibold text-white">
                                {name}
                              </span>
                              <span
                                className={clsx(
                                  'text-lg font-bold',
                                  getExtensionColor(extension),
                                )}
                              >
                                {extension}
                              </span>
                            </div>

                            <div className="mb-3">
                              <span
                                className={clsx(
                                  'inline-block rounded-full px-3 py-1 text-sm font-medium',
                                  result.available
                                    ? 'bg-green-500/30 text-green-200'
                                    : 'bg-red-500/30 text-red-200',
                                )}
                              >
                                {result.available
                                  ? t('search.results.available')
                                  : t('search.results.unavailable')}
                              </span>
                              {result.premium && (
                                <span className="ml-2 inline-block rounded-full bg-yellow-500/30 px-3 py-1 text-sm font-medium text-yellow-200">
                                  {t('search.results.premium')}
                                </span>
                              )}
                            </div>

                            {result.available && result.price && (
                              <div className="text-white">
                                <span className="text-lg font-semibold">
                                  {formatPrice(result.price)}
                                </span>
                                {/* <span className="text-sm text-white/70">
                                  /year
                                </span> */}
                              </div>
                            )}

                            {result.available && (
                              <button
                                onClick={() => {
                                  const checkoutUrl = `/${i18n.language}/checkout/domain?domain=${encodeURIComponent(result.domainName)}&price=${result.price || 0}&premium=${result.premium || false}`
                                  router.push(checkoutUrl)
                                }}
                                className="mt-4 w-full cursor-pointer rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900 focus:outline-none"
                              >
                                {t('search.results.buyNow')}
                              </button>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  {/* Suggested Domains */}
                  {suggestedResults.length > 0 && (
                    <div className="mb-8">
                      <h3 className="mb-6 text-xl font-semibold text-white">
                        {t('search.results.suggestedTitle')}
                      </h3>
                      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {suggestedResults.map((result) => {
                          const { name, extension } = parseDomainName(
                            result.domainName,
                          )
                          return (
                            <div
                              key={result.domainName}
                              className={clsx(
                                'rounded-lg p-6 text-center backdrop-blur-sm transition-all',
                                result.available
                                  ? 'bg-purple-500/20 ring-1 ring-purple-400/30 hover:bg-purple-500/30'
                                  : 'bg-gray-500/20 ring-1 ring-gray-400/30',
                              )}
                            >
                              <div className="mb-2">
                                <span className="text-lg font-semibold text-white">
                                  {name}
                                </span>
                                <span
                                  className={clsx(
                                    'text-lg font-bold',
                                    getExtensionColor(extension),
                                  )}
                                >
                                  {extension}
                                </span>
                              </div>

                              <div className="mb-3">
                                <span
                                  className={clsx(
                                    'inline-block rounded-full px-3 py-1 text-sm font-medium',
                                    result.available
                                      ? 'bg-purple-500/30 text-purple-200'
                                      : 'bg-gray-500/30 text-gray-200',
                                  )}
                                >
                                  {result.available
                                    ? t('search.results.available')
                                    : t('search.results.unavailable')}
                                </span>
                                {result.premium && (
                                  <span className="ml-2 inline-block rounded-full bg-yellow-500/30 px-3 py-1 text-sm font-medium text-yellow-200">
                                    {t('search.results.premium')}
                                  </span>
                                )}
                              </div>

                              {result.available && result.price && (
                                <div className="text-white">
                                  <span className="text-lg font-semibold">
                                    {formatPrice(result.price)}
                                  </span>
                                  {/* <span className="text-sm text-white/70">
                                    /year
                                  </span> */}
                                </div>
                              )}

                              {result.available && (
                                <button
                                  onClick={() => {
                                    const checkoutUrl = `/${i18n.language}/checkout/domain?domain=${encodeURIComponent(result.domainName)}&price=${result.price || 0}&premium=${result.premium || false}`
                                    router.push(checkoutUrl)
                                  }}
                                  className="mt-4 w-full cursor-pointer rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900 focus:outline-none"
                                >
                                  {t('search.results.buyNow')}
                                </button>
                              )}
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center text-white/70">
                  <p className="text-lg">{t('search.results.noResults')}</p>
                  <p className="mt-2 text-sm">
                    {t('search.results.noResultsHelper')}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Domain Extension Cards - Show only when no search has been performed */}
          {!hasSearched && (
            <div className="mx-auto mt-16 grid max-w-4xl grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
              {domainExtensions.map(({ extension, price }) => (
                <div
                  key={extension}
                  className={clsx(
                    'rounded-lg bg-white/10 p-4 text-center backdrop-blur-sm',
                    'cursor-pointer ring-1 ring-white/20 transition-colors hover:bg-white/20',
                    'group',
                  )}
                  onClick={() =>
                    setDomainInput((prev) => {
                      const cleanPrev = prev.trim()
                      if (cleanPrev.includes('.')) {
                        return cleanPrev.split('.')[0] + extension
                      }
                      return cleanPrev + extension
                    })
                  }
                >
                  <div
                    className={clsx(
                      'mb-1 text-xl font-bold',
                      getExtensionColor(extension),
                    )}
                  >
                    {extension}
                  </div>
                  <div className="text-sm text-white">
                    <span className="font-semibold">{price}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Container>
    </div>
  )
}
