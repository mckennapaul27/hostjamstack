import { i18n } from '@/i18n-config'
import { type Resource, createInstance } from 'i18next'
import resourcesToBackend from 'i18next-resources-to-backend'
import { initReactI18next } from 'react-i18next/initReactI18next'
//

export const initTranslations = async (
  locale: string,
  namespaces: string[],
  i18nInstance?: ReturnType<typeof createInstance>,
  resources?: Resource,
) => {
  i18nInstance = i18nInstance || createInstance()

  i18nInstance.use(initReactI18next)

  if (!resources) {
    i18nInstance.use(
      resourcesToBackend(
        async (language: string, namespace: string) =>
          import(`@/locales/${language}/${namespace}.json`),
      ),
    )
  }

  await i18nInstance.init({
    lng: locale,
    resources,
    fallbackLng: i18n.defaultLocale,
    supportedLngs: i18n.locales,
    defaultNS: namespaces[0],
    fallbackNS: namespaces[0],
    ns: namespaces,
    preload: resources ? [] : i18n.locales,
  })

  return {
    i18n: i18nInstance,
    resources: i18nInstance.services.resourceStore.data,
    t: i18nInstance.t,
  }
}
