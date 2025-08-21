import { NextRequest, NextResponse } from 'next/server'

interface DomainSearchRequest {
  keyword: string
  tlds?: string[]
}

interface DomainResult {
  domainName: string
  available: boolean
  price?: number
  premium?: boolean
  purchasePrice?: number
  purchaseType?: string
  status?: string
}

interface SearchResponse {
  results: DomainResult[]
  suggested?: DomainResult[]
}

// Utility function to sanitize domain input
function sanitizeDomainInput(input: string): {
  cleanDomain: string
  isFullDomain: boolean
} {
  let domain = input.trim().toLowerCase()

  // Remove protocols
  domain = domain.replace(/^https?:\/\//, '')
  domain = domain.replace(/^ftp:\/\//, '')
  domain = domain.replace(/^ftps:\/\//, '')

  // Remove www. prefix
  domain = domain.replace(/^www\./, '')

  // Remove trailing slash and any path
  domain = domain.split('/')[0]

  // Remove query parameters and fragments
  domain = domain.split('?')[0].split('#')[0]

  // Remove port numbers
  domain = domain.split(':')[0]

  // Remove any remaining whitespace
  domain = domain.trim()

  // Check if this is a full domain (contains a dot and looks like a domain)
  const isFullDomain = domain.includes('.') && domain.split('.').length >= 2

  return {
    cleanDomain: domain,
    isFullDomain: isFullDomain,
  }
}

export async function POST(request: NextRequest) {
  try {
    let {
      keyword,
      tlds = ['com', 'org', 'net', 'info', 'biz', 'ai'],
    }: DomainSearchRequest = await request.json()

    const { cleanDomain, isFullDomain } = sanitizeDomainInput(keyword)

    console.log('Received request:', { keyword, tlds })
    console.log('Sanitized:', { cleanDomain, isFullDomain })

    if (!cleanDomain || cleanDomain.trim() === '') {
      return NextResponse.json(
        { error: 'Domain keyword is required' },
        { status: 400 },
      )
    }

    // Hardcoded name.com API credentials
    const username = process.env.NAMECOM_USERNAME_PROD
    const token = process.env.NAMECOM_TOKEN_PROD
    const apiUrl = process.env.NAMECOM_URL_PROD

    // Create Basic Auth header
    const auth = Buffer.from(`${username}:${token}`).toString('base64')

    const results: DomainResult[] = []

    if (isFullDomain) {
      // User provided a full domain name, check only that domain
      const domainName = cleanDomain

      try {
        const response = await fetch(
          `${apiUrl}/core/v1/domains:checkAvailability`,
          {
            method: 'POST',
            headers: {
              Authorization: `Basic ${auth}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              domainNames: [domainName],
            }),
          },
        )

        if (!response.ok) {
          const errorText = await response.text()
          console.error(
            `Failed to check ${domainName}: ${response.status} ${response.statusText}`,
            errorText,
          )
        } else {
          const data = await response.json()

          if (data.results && Array.isArray(data.results)) {
            for (const result of data.results) {
              const isAvailable =
                result.purchasable === true &&
                result.purchaseType === 'registration'
              const isPremium = result.premium === true
              const isTaken =
                result.purchasable === false ||
                result.purchaseType === 'backorder'

              results.push({
                domainName: result.domainName,
                available: isAvailable,
                price: result.purchasePrice || undefined,
                premium: isPremium,
                purchasePrice: result.purchasePrice || undefined,
                purchaseType: result.purchaseType,
                status: isTaken
                  ? 'taken'
                  : isAvailable
                    ? 'available'
                    : 'unknown',
              })
            }
          }
        }
      } catch (error) {
        console.error(`Error checking ${domainName}:`, error)
        results.push({
          domainName,
          available: false,
          premium: false,
          status: 'error',
        })
      }
    } else {
      // User provided just a keyword, check multiple TLDs
      for (const tld of tlds) {
        const domainName = `${cleanDomain}.${tld}`

        try {
          // Try the Core API endpoint format
          const response = await fetch(
            `${apiUrl}/core/v1/domains:checkAvailability`,
            {
              method: 'POST',
              headers: {
                Authorization: `Basic ${auth}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                domainNames: [domainName],
              }),
            },
          )

          if (!response.ok) {
            const errorText = await response.text()
            console.error(
              `Failed to check ${domainName}: ${response.status} ${response.statusText}`,
              errorText,
            )
            continue
          }

          const data = await response.json()

          // Process the response based on name.com API format
          if (data.results && Array.isArray(data.results)) {
            for (const result of data.results) {
              // More detailed interpretation of the API response
              const isAvailable =
                result.purchasable === true &&
                result.purchaseType === 'registration'
              const isPremium = result.premium === true
              const isTaken =
                result.purchasable === false ||
                result.purchaseType === 'backorder'

              // console.log(`Domain ${result.domainName} analysis:`, {
              //   purchasable: result.purchasable,
              //   purchaseType: result.purchaseType,
              //   premium: result.premium,
              //   isAvailable,
              //   isPremium,
              //   isTaken,
              // })

              results.push({
                domainName: result.domainName,
                available: isAvailable,
                price: result.purchasePrice || undefined,
                premium: isPremium,
                purchasePrice: result.purchasePrice || undefined,
                purchaseType: result.purchaseType,
                status: isTaken
                  ? 'taken'
                  : isAvailable
                    ? 'available'
                    : 'unknown',
              })
            }
          }
        } catch (error) {
          console.error(`Error checking ${domainName}:`, error)
          // Add unavailable result for this domain
          results.push({
            domainName,
            available: false,
            premium: false,
            status: 'error',
          })
        }
      }
    }

    // Try to get domain suggestions using the Search endpoint
    let suggested: DomainResult[] = []
    try {
      const searchResponse = await fetch(`${apiUrl}/core/v1/domains:search`, {
        method: 'POST',
        headers: {
          Authorization: `Basic ${auth}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          keyword: cleanDomain,
          tlds: tlds,
        }),
      })

      if (searchResponse.ok) {
        const searchData = await searchResponse.json()

        if (searchData.results && Array.isArray(searchData.results)) {
          suggested = searchData.results
            .slice(0, 5)
            .map(
              (result: {
                domainName: string
                purchasable: boolean
                purchaseType: string
                premium: boolean
                purchasePrice: number | null
              }) => ({
                domainName: result.domainName,
                available:
                  result.purchasable === true &&
                  result.purchaseType === 'registration',
                price: result.purchasePrice || undefined,
                premium: result.premium || false,
                purchasePrice: result.purchasePrice || undefined,
                purchaseType: result.purchaseType,
                status: result.purchasable === false ? 'taken' : 'available',
              }),
            )
        }
      }
    } catch (error) {
      console.error('Error getting domain suggestions:', error)
      // Continue without suggestions if this fails
    }

    const responseData: SearchResponse = {
      results,
      ...(suggested.length > 0 && { suggested }),
    }

    return NextResponse.json(responseData)
  } catch (error) {
    console.error('Domain search error:', error)
    return NextResponse.json(
      { error: 'Failed to search domains' },
      { status: 500 },
    )
  }
}
