'use client'

import { initTranslations } from '@/app/i18n'
import {
  createInstance,
  type i18n as I18nInstance,
  type Resource,
} from 'i18next'
import { type ReactNode, useEffect, useState } from 'react'
import { I18nextProvider } from 'react-i18next'

interface TranslationsProviderProps {
  children: ReactNode
  locale: string
  namespaces: string[]
  resources?: Resource
}

export default function TranslationsProvider({
  children,
  locale,
  namespaces,
  resources,
}: TranslationsProviderProps) {
  const [i18nInstance, setI18nInstance] = useState<I18nInstance | null>(null)

  useEffect(() => {
    const initI18n = async () => {
      const i18n = createInstance()
      await initTranslations(locale, namespaces, i18n, resources)
      setI18nInstance(i18n)
    }

    initI18n()
  }, [locale, namespaces, resources])

  if (!i18nInstance) {
    return <>{children}</>
  }

  return <I18nextProvider i18n={i18nInstance}>{children}</I18nextProvider>
}
