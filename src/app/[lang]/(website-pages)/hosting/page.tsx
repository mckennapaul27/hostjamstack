import { initTranslations } from '@/app/i18n'
import { Button } from '@/components/button'
import { Container } from '@/components/container'
import { Footer } from '@/components/footer'
import { Gradient, GradientBackground } from '@/components/gradient'
import { Navbar } from '@/components/navbar'
import PricingTable, { tiers } from '@/components/pricing-table'
import { Heading, Lead, Subheading } from '@/components/text'

import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Pricing',
  description:
    'Companies all over the world have closed millions of deals with Radiant. Sign up today and start selling smarter.',
}

async function Header({ lang }: { lang: string }) {
  const { t } = await initTranslations(lang, ['hosting'])

  return (
    <Container className="mt-16">
      <Heading as="h1">{t('header.title')}</Heading>
      <Lead className="mt-6 max-w-3xl">{t('header.description')}</Lead>
    </Container>
  )
}

async function PricingCards({ locale }: { locale: string }) {
  return (
    <div className="relative py-16">
      <Gradient className="absolute inset-x-2 top-48 bottom-0 rounded-4xl ring-1 ring-black/5 ring-inset" />
      <div className={'relative px-4 sm:px-6 lg:px-8'}>
        <div className="mx-auto max-w-2xl lg:max-w-7xl">
          {' '}
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {tiers.map((tier, tierIndex) => (
              <PricingCard key={tierIndex} tier={tier} locale={locale} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

async function PricingCard({
  tier,
  locale,
}: {
  tier: (typeof tiers)[number]
  locale: string
}) {
  const { t } = await initTranslations(locale, ['pricing'])

  return (
    <div className="-m-2 grid grid-cols-1 rounded-4xl shadow-[inset_0_0_2px_1px_#ffffff4d] ring-1 ring-black/5 max-lg:mx-auto max-lg:w-full max-lg:max-w-md">
      <div className="grid grid-cols-1 rounded-4xl p-2 shadow-md shadow-black/5">
        <div className="rounded-3xl bg-white p-10 pb-9 shadow-2xl ring-1 ring-black/5">
          <Subheading>{tier.name}</Subheading>
          <p className="mt-2 text-sm/6 text-gray-950/75">
            {t(`tiers.${tier.slug}.description`)}
          </p>
          {tier.slug === 'enterprise' ? (
            <div className="mt-8 flex items-center gap-4">
              <div className="text-5xl font-medium text-gray-950">
                {t('features.values.custom')}
              </div>
            </div>
          ) : (
            <div className="mt-8 flex items-center gap-4">
              <div className="text-5xl font-medium text-gray-950">
                €{tier.priceMonthly}
              </div>
              <div className="text-sm/5 text-gray-950/75">
                <p>EUR</p>
              </div>
            </div>
          )}
          <div className="mt-8">
            <Button href={tier.href}>
              {tier.slug === 'enterprise' ? t('ui.contactUs') : t('ui.buyNow')}
            </Button>
          </div>
          <div className="mt-8">
            <h3 className="text-sm/6 font-medium text-gray-950">
              {t('ui.features')}
            </h3>
            <ul className="mt-3 space-y-3">
              {(
                t(`tiers.${tier.slug}.highlights`, {
                  returnObjects: true,
                }) as string[]
              ).map((highlight: string, featureIndex: number) => (
                <FeatureItem key={featureIndex} description={highlight} />
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

function FeatureItem({
  description,
  disabled = false,
}: {
  description: string
  disabled?: boolean
}) {
  return (
    <li
      data-disabled={disabled ? true : undefined}
      className="flex items-start gap-4 text-sm/6 text-gray-950/75 data-disabled:text-gray-950/25"
    >
      <span className="inline-flex h-6 items-center">
        <PlusIcon className="size-3.75 shrink-0 fill-gray-950/25" />
      </span>
      {disabled && <span className="sr-only">Not included:</span>}
      {description}
    </li>
  )
}

function PlusIcon(props: React.ComponentPropsWithoutRef<'svg'>) {
  return (
    <svg viewBox="0 0 15 15" aria-hidden="true" {...props}>
      <path clipRule="evenodd" d="M8 0H7v7H0v1h7v7h1V8h7V7H8V0z" />
    </svg>
  )
}

async function Testimonial({ lang }: { lang: string }) {
  const { t } = await initTranslations(lang, ['hosting', 'pricing'])
  return (
    <div className="mx-2 my-24 rounded-4xl bg-gray-900 bg-[url(/dot-texture.svg)] pt-72 pb-24 lg:pt-36">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-[384px_1fr_1fr]">
          {/* <div className="-mt-96 lg:-mt-52">
            <div className="-m-2 rounded-4xl bg-white/15 shadow-[inset_0_0_2px_1px_#ffffff4d] ring-1 ring-black/5 max-lg:mx-auto max-lg:max-w-xs">
              <div className="rounded-4xl p-2 shadow-md shadow-black/5">
                <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-pink-500 via-purple-600 to-purple-600 shadow-2xl outline outline-1 -outline-offset-1 outline-black/10">
                  <div className="flex aspect-3/4 w-full items-end bg-linear-to-t from-black from-25% p-8">
                    <div className="w-full text-center text-white">
                      <div className="mb-2 text-4xl font-bold">⚡</div>
                      <div className="text-sm font-medium">HostJamstack</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div> */}
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
                    {t('testimonial.role')}
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

async function FrequentlyAskedQuestions({ lang }: { lang: string }) {
  const { t } = await initTranslations(lang, ['hosting', 'pricing'])
  const questions = ['frameworks', 'speed', 'domain', 'support', 'migration']

  return (
    <Container>
      <section id="faqs" className="scroll-mt-8">
        <Subheading className="text-center">{t('faq.title')}</Subheading>
        <Heading as="div" className="mt-2 text-center">
          {t('faq.subtitle')}
        </Heading>
        <div className="mx-auto mt-16 mb-32 max-w-xl space-y-12">
          {questions.map((questionKey) => (
            <dl key={questionKey}>
              <dt className="text-sm font-semibold">
                {t(`faq.questions.${questionKey}.question`)}
              </dt>
              <dd className="mt-4 text-sm/6 text-gray-600">
                {t(`faq.questions.${questionKey}.answer`)}
              </dd>
            </dl>
          ))}
        </div>
      </section>
    </Container>
  )
}

export default async function Pricing({
  searchParams,
  params,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
  params: Promise<{ lang: string }>
}) {
  const awaitedParams = await params
  const awaitedSearchParams = await searchParams

  let tier =
    typeof awaitedSearchParams.tier === 'string'
      ? tiers.find(({ slug }) => slug === awaitedSearchParams.tier)!
      : tiers[0]

  return (
    <main className="overflow-hidden">
      <GradientBackground />
      <Container>
        <Navbar locale={awaitedParams.lang} />
      </Container>
      <Header lang={awaitedParams.lang} />
      <PricingCards locale={awaitedParams.lang} />
      <PricingTable selectedTier={tier} locale={awaitedParams.lang} />
      <Testimonial lang={awaitedParams.lang} />
      <FrequentlyAskedQuestions lang={awaitedParams.lang} />
      <Footer type="hosting" locale={awaitedParams.lang} />
    </main>
  )
}
