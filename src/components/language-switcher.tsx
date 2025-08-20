'use client'

import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from '@headlessui/react'
import { ChevronDownIcon, GlobeAltIcon } from '@heroicons/react/24/outline'
import { motion } from 'framer-motion'
import { usePathname, useRouter } from 'next/navigation'
import { useTranslation } from 'react-i18next'
import { i18n as i18nConfig, isValidLocale } from '../i18n-config'

const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'pl', name: 'Polski', flag: '🇵🇱' },
]

export function LanguageSwitcher() {
  const router = useRouter()
  const pathname = usePathname()
  const { i18n } = useTranslation()

  const currentLocale = i18n.language
  const currentLanguage =
    languages.find((lang) => lang.code === currentLocale) || languages[0]

  const handleLocaleChange = (newLocale: string) => {
    console.log('🌍 Language change requested:', {
      currentLocale,
      newLocale,
      pathname,
      defaultLocale: i18nConfig.defaultLocale,
      prefixDefault: i18nConfig.prefixDefault,
    })

    // set cookie for next-i18n-router
    const days = 30
    const date = new Date()
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000)
    const expires = date.toUTCString()
    document.cookie = `NEXT_LOCALE=${newLocale};expires=${expires};path=/`

    // Extract the path without any locale prefix
    const segments = pathname.split('/').filter(Boolean)
    let pathWithoutLocale = '/'

    // Check if the first segment is a locale
    const firstSegment = segments[0]
    const isFirstSegmentLocale = firstSegment
      ? isValidLocale(firstSegment)
      : false

    if (isFirstSegmentLocale) {
      // Remove the locale segment and rebuild the path
      const remainingSegments = segments.slice(1)
      pathWithoutLocale =
        remainingSegments.length > 0 ? `/${remainingSegments.join('/')}` : '/'
    } else {
      // No locale prefix, use the full pathname
      pathWithoutLocale = pathname
    }

    // Build new path with new locale
    const newPath = `/${newLocale}${pathWithoutLocale === '/' ? '' : pathWithoutLocale}`

    console.log('🔀 Path analysis:', {
      segments,
      firstSegment,
      isFirstSegmentLocale,
      pathWithoutLocale,
      newPath,
    })

    router.push(newPath)
    router.refresh()
  }

  return (
    <Disclosure as="div" className="relative">
      <DisclosureButton className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-gray-950 transition-colors data-hover:bg-black/5">
        <GlobeAltIcon className="size-4" />
        <span className="hidden sm:inline">{currentLanguage.name}</span>
        <span className="sm:hidden">{currentLanguage.flag}</span>
        <ChevronDownIcon className="ui-open:rotate-180 size-4 transition-transform" />
      </DisclosureButton>

      <DisclosurePanel className="absolute right-0 z-50 mt-2 w-48 origin-top-right rounded-lg bg-white shadow-lg ring-1 ring-black/5 focus:outline-none">
        <div className="py-1">
          {languages.map((language, index) => (
            <motion.button
              key={language.code}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.15,
                ease: 'easeOut',
                delay: index * 0.05,
              }}
              onClick={() => handleLocaleChange(language.code)}
              className={`flex w-full items-center gap-3 px-4 py-2 text-sm transition-colors hover:bg-gray-50 ${
                currentLocale === language.code
                  ? 'bg-gray-50 font-medium text-gray-900'
                  : 'text-gray-700'
              }`}
            >
              <span className="text-lg">{language.flag}</span>
              <span>{language.name}</span>
              {currentLocale === language.code && (
                <span className="ml-auto text-xs text-gray-500">✓</span>
              )}
            </motion.button>
          ))}
        </div>
      </DisclosurePanel>
    </Disclosure>
  )
}
