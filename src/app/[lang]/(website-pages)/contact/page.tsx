import { initTranslations } from '@/app/i18n'
import ContactForm from '@/components/contact-form'
import { Container } from '@/components/container'
import { Footer } from '@/components/footer'
import { GradientBackground } from '@/components/gradient'
import { Navbar } from '@/components/navbar'
import { Heading, Lead } from '@/components/text'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact Us',
  description:
    "Get in touch with our team for any questions about hosting, domains, or support packages. We're here to help.",
}

async function ContactInfo({ lang }: { lang: string }) {
  const { t } = await initTranslations(lang, ['contact'])

  return (
    <div className="space-y-8">
      <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
        <h3 className="mb-6 text-lg font-semibold text-gray-900">
          {t('contact.title')}
        </h3>

        <div className="space-y-6">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-purple-100">
              <svg
                className="h-6 w-6 text-purple-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 2.25a9.75 9.75 0 100 19.5 9.75 9.75 0 000-19.5z"
                />
              </svg>
            </div>
            <div>
              <h4 className="font-medium text-gray-900">
                {t('contact.support.title')}
              </h4>
              <p className="mt-1 text-sm text-gray-600">
                {t('contact.support.description')}
              </p>
              <p className="mt-2 text-sm text-purple-600">
                {t('contact.support.hours')}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-blue-100">
              <svg
                className="h-6 w-6 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                />
              </svg>
            </div>
            <div>
              <h4 className="font-medium text-gray-900">
                {t('contact.sales.title')}
              </h4>
              <p className="mt-1 text-sm text-gray-600">
                {t('contact.sales.description')}
              </p>
              <p className="mt-2 text-sm text-blue-600">
                {t('contact.sales.hours')}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-green-100">
              <svg
                className="h-6 w-6 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
            <div>
              <h4 className="font-medium text-gray-900">
                {t('contact.partnerships.title')}
              </h4>
              <p className="mt-1 text-sm text-gray-600">
                {t('contact.partnerships.description')}
              </p>
              <p className="mt-2 text-sm text-green-600">
                {t('contact.partnerships.hours')}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Features section */}
      <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
        <h3 className="mb-6 text-lg font-semibold text-gray-900">
          {t('features.title')}
        </h3>

        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-yellow-400">
              <svg
                className="h-3 w-3 text-yellow-800"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div>
              <h4 className="font-medium text-gray-900">
                {t('features.fast.title')}
              </h4>
              <p className="text-sm text-gray-600">
                {t('features.fast.description')}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-green-400">
              <svg
                className="h-3 w-3 text-green-800"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div>
              <h4 className="font-medium text-gray-900">
                {t('features.secure.title')}
              </h4>
              <p className="text-sm text-gray-600">
                {t('features.secure.description')}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-purple-400">
              <svg
                className="h-3 w-3 text-purple-800"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-2 0c0 .993-.241 1.929-.668 2.754l-1.524-1.525a3.997 3.997 0 00.078-2.183l1.562-1.562C17.806 8.756 18 9.348 18 10zm-5.165 3.913l1.58 1.58A5.98 5.98 0 0110 16a5.976 5.976 0 01-4.415-1.507l1.58-1.58A3.996 3.996 0 0010 14c.740 0 1.442-.202 2.035-.546l.8.459z" />
              </svg>
            </div>
            <div>
              <h4 className="font-medium text-gray-900">
                {t('features.support.title')}
              </h4>
              <p className="text-sm text-gray-600">
                {t('features.support.description')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

async function Header({ lang }: { lang: string }) {
  const { t } = await initTranslations(lang, ['contact'])
  return (
    <Container className="mt-16">
      <Heading as="h1">{t('hero.title')}</Heading>
      <Lead className="mt-6 max-w-3xl">{t('hero.subtitle')}</Lead>
      <p className="mt-4 max-w-3xl text-sm/6 text-gray-600">
        {t('hero.description')}
      </p>
    </Container>
  )
}

export default async function Contact({
  params,
}: {
  params: Promise<{ lang: string }>
}) {
  const awaitedParams = await params

  return (
    <main className="overflow-hidden">
      <GradientBackground />
      <Container>
        <Navbar locale={awaitedParams.lang} />
      </Container>
      <Header lang={awaitedParams.lang} />

      <Container className="my-16">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Contact Form - Takes 2 columns on large screens */}
          <div className="lg:col-span-2">
            <ContactForm />
          </div>

          {/* Contact Info - Takes 1 column on large screens */}
          <div className="lg:col-span-1">
            <ContactInfo lang={awaitedParams.lang} />
          </div>
        </div>
      </Container>

      <Footer locale={awaitedParams.lang} />
    </main>
  )
}
