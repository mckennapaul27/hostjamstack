import { initTranslations } from '@/app/i18n'
import { Button } from '@/components/button'
import { Container } from '@/components/container'
import { DomainSearchBox } from '@/components/domain-search-box'
import { Footer } from '@/components/footer'
import { Gradient } from '@/components/gradient'
import { LogoCloudFrameworks } from '@/components/logo-cloud-frameworks'
import { Navbar } from '@/components/navbar'
import PricingCards from '@/components/pricing-cards'
import PricingTable, { tiers } from '@/components/pricing-table'
import { Screenshot } from '@/components/screenshot'
import { Testimonials } from '@/components/testimonials'
import { Heading, Subheading } from '@/components/text'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  description:
    'Deploy your Next.js, Astro, Vite or other JAMstack apps with automatic SSL, CDN, and performance optimization. Premium hosting for makers who want to ship safely and scale effortlessly.',
}

async function Hero({ locale }: { locale: string }) {
  const { t } = await initTranslations(locale, ['home'])
  return (
    <div className="relative">
      <Gradient className="absolute inset-2 bottom-0 rounded-4xl ring-1 ring-black/5 ring-inset" />
      <Container className="relative">
        <Navbar locale={locale} />
        <div className="pt-16 pb-24 sm:pt-24 sm:pb-32 md:pt-32 md:pb-48">
          <h1 className="font-display text-6xl/[0.9] font-medium tracking-tight text-balance text-gray-950 sm:text-8xl/[0.8] md:text-9xl/[0.8]">
            {t('hero.title')}
          </h1>
          <p className="mt-8 max-w-lg text-xl/7 font-medium text-gray-950/75 sm:text-2xl/8">
            {t('hero.description')}
          </p>
          <div className="mt-12 flex flex-col gap-x-6 gap-y-4 sm:flex-row">
            <Button href="/hosting">{t('hero.seePricing')}</Button>
            <Button href="/support-packages" variant="secondary">
              {t('hero.supportPackages')}
            </Button>
          </div>
        </div>
      </Container>
    </div>
  )
}

async function FeatureSection({ lang }: { lang: string }) {
  const { t } = await initTranslations(lang, ['home'])
  return (
    <div className="overflow-hidden">
      <Container className="pb-24">
        <Heading as="h2" className="max-w-3xl">
          {t('features.title')}
        </Heading>
        <Screenshot
          width={1216}
          height={768}
          src="/screenshots/app-2.png"
          className="mt-16 h-144 sm:h-auto sm:w-304"
        />
      </Container>
    </div>
  )
}

export default async function Home({
  params,
  searchParams,
}: {
  params: Promise<{ lang: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const awaitedParams = await params
  const awaitedSearchParams = await searchParams

  // Initialize translations for the home namespace
  const { t } = await initTranslations(awaitedParams.lang, ['home', 'domains'])

  let tier =
    typeof awaitedSearchParams.tier === 'string'
      ? tiers.find(({ slug }) => slug === awaitedSearchParams.tier)!
      : tiers[0]

  return (
    <div className="overflow-hidden">
      <Hero locale={awaitedParams.lang} />
      <main>
        <Container className="mt-10">
          <LogoCloudFrameworks />
        </Container>
        <div className="bg-linear-to-b from-white from-50% to-gray-100 pt-32">
          <FeatureSection lang={awaitedParams.lang} />
          <Container>
            <Subheading>{t('pricing.subtitle')}</Subheading>
            <Heading as="h3" className="mt-2 max-w-3xl">
              {t('pricing.title')}
            </Heading>
            <PricingCards locale={awaitedParams.lang} />
            <PricingTable selectedTier={tier} locale={awaitedParams.lang} />
          </Container>
          {/* <BentoSection /> */}
        </div>
        {/* <DarkBentoSection /> */}
        <div className="px-2">
          <DomainSearchBox />
        </div>
      </main>
      <Testimonials />
      <Footer locale={awaitedParams.lang} />
    </div>
  )
}
