import type { NextRequest } from 'next/server'

import { i18nRouter } from 'next-i18n-router'
import { i18n } from './i18n-config'

// version provided by https://i18nexus.com/tutorials/nextjs/react-i18next
export function middleware(request: NextRequest) {
  // console.log('🔥 MIDDLEWARE CALLED 🔥', request.nextUrl.pathname)
  const pathname = request.nextUrl.pathname
  // console.log('pathname in middleware', pathname)

  // Skip middleware for static files and images
  // Check for file extensions that should be served directly
  const staticFileExtensions = [
    '.png',
    '.jpg',
    '.jpeg',
    '.gif',
    '.svg',
    '.ico',
    '.webp',
    '.avif',
    '.css',
    '.js',
    '.json',
    '.xml',
    '.txt',
    '.pdf',
    '.woff',
    '.woff2',
    '.ttf',
    '.eot',
    '.mp4',
    '.webm',
    '.mp3',
    '.wav',
  ]

  const hasStaticExtension = staticFileExtensions.some((ext) =>
    pathname.toLowerCase().endsWith(ext),
  )

  // Skip for files with static extensions or specific paths
  if (
    hasStaticExtension ||
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/api/') ||
    pathname === '/favicon.ico' ||
    pathname === '/robots.txt' ||
    pathname === '/sitemap.xml' ||
    pathname === '/manifest.json'
  ) {
    // console.log('Skipping middleware for static file:', pathname)
    return
  }

  // console.log('Calling i18nRouter for:', pathname)
  const result = i18nRouter(request, i18n)
  // console.log('i18nRouter result:', result)
  return result
}

// applies this middleware only to files in the app directory
// version provided by https://i18nexus.com/tutorials/nextjs/react-i18next
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
