import { initTranslations } from '@/app/i18n'
import { Container } from '@/components/container'
import { DomainSearchBox } from '@/components/domain-search-box'
import { Footer } from '@/components/footer'
import { GradientBackground } from '@/components/gradient'
import { Navbar } from '@/components/navbar'
import { Heading, Lead, Subheading } from '@/components/text'
import type { Metadata } from 'next'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>
}): Promise<Metadata> {
  const { lang } = await params
  const { t } = await initTranslations(lang, ['domains'])

  return {
    title: t('page.title'),
    description: t('page.description'),
  }
}

async function Header({ t }: { t: (key: string) => string }) {
  return (
    <Container className="mt-16">
      <Heading as="h1">{t('header.title')}</Heading>
      <Lead className="mt-6 max-w-3xl">{t('header.description')}</Lead>
    </Container>
  )
}

async function DomainExtensionsBlurb({ t }: { t: (key: string) => string }) {
  return (
    <div className="bg-gray-50 py-24">
      <Container>
        <div className="mx-auto max-w-4xl text-center">
          <Heading as="h2" className="text-gray-900">
            {t('extensions.title')}
          </Heading>
          <Lead className="mt-6 text-gray-600">
            {t('extensions.description')}
          </Lead>
          <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            <div className="rounded-lg bg-white px-4 py-3 shadow-sm ring-1 ring-gray-200">
              <span className="text-sm font-medium text-gray-900">.com</span>
            </div>
            <div className="rounded-lg bg-white px-4 py-3 shadow-sm ring-1 ring-gray-200">
              <span className="text-sm font-medium text-gray-900">.net</span>
            </div>
            <div className="rounded-lg bg-white px-4 py-3 shadow-sm ring-1 ring-gray-200">
              <span className="text-sm font-medium text-gray-900">.org</span>
            </div>
            <div className="rounded-lg bg-white px-4 py-3 shadow-sm ring-1 ring-gray-200">
              <span className="text-sm font-medium text-gray-900">.app</span>
            </div>
            <div className="rounded-lg bg-white px-4 py-3 shadow-sm ring-1 ring-gray-200">
              <span className="text-sm font-medium text-gray-900">.tech</span>
            </div>
            <div className="rounded-lg bg-white px-4 py-3 shadow-sm ring-1 ring-gray-200">
              <span className="text-sm font-medium text-gray-900">.design</span>
            </div>
          </div>
          <p className="mt-8 text-sm text-gray-500">
            {t('extensions.pricing')}
          </p>
        </div>
      </Container>
    </div>
  )
}

async function Testimonial({ t }: { t: (key: string) => string }) {
  return (
    <div className="mx-2 mb-24 rounded-4xl bg-gray-900 bg-[url(/dot-texture.svg)] pt-72 pb-24 lg:pt-36">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-[384px_1fr_1fr]">
          <div className="flex max-lg:mt-16 lg:col-span-2 lg:px-16">
            <figure className="mx-auto flex max-w-xl flex-col gap-16 max-lg:text-center">
              <blockquote>
                <p className="relative text-3xl tracking-tight text-white lg:text-4xl">
                  <span
                    aria-hidden="true"
                    className="absolute -translate-x-full"
                  >
                    &quot;
                  </span>
                  {t('testimonial.quote')}
                  <span aria-hidden="true" className="absolute">
                    &quot;
                  </span>
                </p>
              </blockquote>
              <figcaption className="mt-auto">
                <p className="text-sm/6 font-medium text-white">
                  {t('testimonial.author')}
                </p>
                <p className="text-sm/6 font-medium">
                  <span className="bg-linear-to-r from-[#fff1be] from-28% via-[#ee87cb] via-70% to-[#b060ff] bg-clip-text text-transparent">
                    {t('testimonial.company')}
                  </span>
                </p>
              </figcaption>
            </figure>
          </div>
        </div>
      </Container>
    </div>
  )
}

async function FrequentlyAskedQuestions({ t }: { t: (key: string) => string }) {
  return (
    <Container>
      <section id="faqs" className="scroll-mt-8">
        <Subheading className="text-center">{t('faq.title')}</Subheading>
        <Heading as="div" className="mt-2 text-center">
          {t('faq.subtitle')}
        </Heading>
        <div className="mx-auto mt-16 mb-32 max-w-xl space-y-12">
          <dl>
            <dt className="text-sm font-semibold">
              {t('faq.questions.registration.question')}
            </dt>
            <dd className="mt-4 text-sm/6 text-gray-600">
              {t('faq.questions.registration.answer')}
            </dd>
          </dl>
          <dl>
            <dt className="text-sm font-semibold">
              {t('faq.questions.dns.question')}
            </dt>
            <dd className="mt-4 text-sm/6 text-gray-600">
              {t('faq.questions.dns.answer')}
            </dd>
          </dl>
          <dl>
            <dt className="text-sm font-semibold">
              {t('faq.questions.expiration.question')}
            </dt>
            <dd className="mt-4 text-sm/6 text-gray-600">
              {t('faq.questions.expiration.answer')}
            </dd>
          </dl>
          <dl>
            <dt className="text-sm font-semibold">
              {t('faq.questions.transfer.question')}
            </dt>
            <dd className="mt-4 text-sm/6 text-gray-600">
              {t('faq.questions.transfer.answer')}
            </dd>
          </dl>
          <dl>
            <dt className="text-sm font-semibold">
              {t('faq.questions.privacy.question')}
            </dt>
            <dd className="mt-4 text-sm/6 text-gray-600">
              {t('faq.questions.privacy.answer')}
            </dd>
          </dl>
        </div>
      </section>
    </Container>
  )
}

export default async function Domains({
  params,
}: {
  params: Promise<{ lang: string }>
}) {
  const awaitedParams = await params

  // Initialize translations for domains namespace
  const { t } = await initTranslations(awaitedParams.lang, ['domains'])

  return (
    <main className="overflow-hidden">
      <GradientBackground />
      <Container>
        <Navbar locale={awaitedParams.lang} />
      </Container>
      <Header t={t} />
      <DomainSearchBox className="mt-24" />
      <DomainExtensionsBlurb t={t} />
      <Testimonial t={t} />
      <FrequentlyAskedQuestions t={t} />
      <Footer locale={awaitedParams.lang} type="domains" />
    </main>
  )
}
