import type { Locale } from '@/i18n-config'
import React from 'react'

export interface Country {
  code: string
  name: string
  value: string
}

/**
 * Load countries data for a specific locale
 * @param locale The locale to load countries for
 * @returns Array of countries
 */
export async function getCountries(locale: Locale): Promise<Country[]> {
  try {
    const countries = await import(`@/app/countries/${locale}/countries.json`)
    return countries.default || countries
  } catch (error) {
    console.error(`Failed to load countries for locale ${locale}:`, error)
    // Fallback to English if the locale file doesn't exist
    try {
      const countries = await import(`@/app/countries/en/countries.json`)
      return countries.default || countries
    } catch (fallbackError) {
      console.error('Failed to load fallback countries:', fallbackError)
      return []
    }
  }
}

/**
 * Hook to load countries data in React components
 */
export function useCountries(locale: Locale) {
  const [countries, setCountries] = React.useState<Country[]>([])
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    const loadCountries = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await getCountries(locale)
        setCountries(data)
      } catch (err) {
        setError('Failed to load countries')
        console.error('Error loading countries:', err)
      } finally {
        setLoading(false)
      }
    }

    loadCountries()
  }, [locale])

  return { countries, loading, error }
}
