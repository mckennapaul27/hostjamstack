'use client'

import { XMarkIcon } from '@heroicons/react/24/outline'
import { AnimatePresence, motion } from 'framer-motion'
import Link from 'next/link'
import { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from './button'

// Simple wrapper component that only renders when translations are ready
function CookieBannerContent() {
  const { t } = useTranslation('common')

  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Check if user has already made a choice about cookies
    const hasAcceptedCookies = localStorage.getItem('cookies-accepted')
    if (!hasAcceptedCookies) {
      setIsVisible(true)
    }
  }, [])

  const acceptCookies = useCallback(() => {
    localStorage.setItem('cookies-accepted', 'true')
    setIsVisible(false)
  }, [])

  const declineCookies = useCallback(() => {
    localStorage.setItem('cookies-accepted', 'false')
    setIsVisible(false)
  }, [])

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="fixed right-0 bottom-0 left-0 z-50 border-t border-gray-200 bg-white/95 shadow-lg backdrop-blur-sm"
        >
          <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex-1">
                <p className="text-sm text-gray-700">
                  {t(
                    'cookieBanner.message',
                    'We use cookies to enhance your browsing experience, serve personalized content, and analyze our traffic. By clicking "Accept All", you consent to our use of cookies.',
                  )}{' '}
                  <Link
                    href="/legal/privacy-policy"
                    className="font-medium text-indigo-600 underline hover:text-indigo-500"
                  >
                    {t('cookieBanner.learnMore', 'Learn more')}
                  </Link>
                </p>
              </div>

              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  onClick={declineCookies}
                  className="text-gray-600 hover:text-gray-800"
                >
                  {t('cookieBanner.decline', 'Decline')}
                </Button>

                <Button variant="primary" onClick={acceptCookies}>
                  {t('cookieBanner.acceptAll', 'Accept All')}
                </Button>

                <button
                  onClick={declineCookies}
                  className="cursor-pointer p-1 text-gray-400 transition-colors hover:text-gray-600"
                  aria-label={t('cookieBanner.close', 'Close cookie banner')}
                >
                  <XMarkIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default function CookieBanner() {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    // Small delay to ensure i18n is fully initialized
    const timer = setTimeout(() => {
      setIsLoaded(true)
    }, 100)

    return () => clearTimeout(timer)
  }, [])

  if (!isLoaded) {
    return null
  }

  return <CookieBannerContent />
}
