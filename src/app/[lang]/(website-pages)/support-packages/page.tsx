import { initTranslations } from '@/app/i18n'
import { Button } from '@/components/button'
import { Container } from '@/components/container'
import { Footer } from '@/components/footer'
import { Gradient, GradientBackground } from '@/components/gradient'
import { LogoCloud } from '@/components/logo-cloud'
import { Navbar } from '@/components/navbar'
import { Heading, Lead, Subheading } from '@/components/text'
import type { Metadata } from 'next'

type TierFeature = {
  section: string
  name: string
  value: boolean | string | number
}

export const metadata: Metadata = {
  title: 'Pricing',
  description:
    'Companies all over the world have closed millions of deals with Host Jamstack. Sign up today and start selling smarter.',
}

const tiers = [
  {
    name: 'Tiny Tweak' as const,
    slug: 'tiny-tweak',
    description: 'A single, quick hosting task.',
    price: 10,
    currency: 'EUR',
    billing: 'one-off',
    href: '#',
    cta: 'Buy Tiny Tweak',
    highlights: [
      { description: 'Trigger a redeploy' },
      { description: 'Add 1 DNS record' },
      { description: 'Add 1 env var' },
      { description: 'Add 1 redirect / rewrite' },
      { description: 'SSL check' },
      { description: 'No hosting included · No code changes', disabled: true },
    ],
    features: [] as TierFeature[],
  },
  {
    name: 'Quick Fix' as const,
    slug: 'quick-fix',
    description: 'Small setup fixes on an existing site.',
    price: 25,
    currency: 'EUR',
    billing: 'one-off',
    href: '#',
    cta: 'Buy Quick Fix',
    highlights: [
      { description: 'Connect 1 custom domain + SSL' },
      { description: 'Up to 3 env vars' },
      { description: 'Up to 3 redirects / rewrites' },
      { description: 'One deploy hook' },
      { description: 'Production health check' },
      { description: 'No hosting included' },
    ],
    features: [] as TierFeature[],
  },
  {
    name: 'First Deploy' as const,
    slug: 'first-deploy',
    description: 'Take a repo that already builds and put it live.',
    price: 50,
    currency: 'EUR',
    billing: 'one-off',
    href: '#',
    cta: 'Buy First Deploy',
    highlights: [
      { description: 'Create project from Git' },
      { description: 'Configure build / output' },
      { description: 'Attach 1 production domain + SSL' },
      { description: 'Up to 5 env vars & 5 redirects' },
      { description: 'Handover checklist' },
      { description: '3 months hosting included (fair-use)' },
    ],
    features: [] as TierFeature[],
  },
  {
    name: 'Launch Pack' as const,
    slug: 'launch-pack',
    description: 'Polished go-live for brochure/marketing sites.',
    price: 100,
    currency: 'EUR',
    billing: 'one-off',
    href: '#',
    cta: 'Buy Launch Pack (recommended)',
    highlights: [
      { description: 'Everything in First Deploy' },
      { description: 'Staging subdomain' },
      { description: 'Performance / cache headers' },
      { description: 'Custom 404 / 500 pages' },
      { description: 'Up to 10 redirects / rewrites' },
      { description: 'Basic deploy notifications' },
      { description: 'Go-live / rollback plan' },
      { description: '12 months hosting included (fair-use)' },
    ],
    features: [] as TierFeature[],
  },
  {
    name: 'Migration Mini' as const,
    slug: 'migration-mini',
    description: 'Move a small static site to modern hosting.',
    price: 250,
    currency: 'EUR',
    billing: 'one-off',
    href: '#',
    cta: 'Buy Migration Mini',
    highlights: [
      { description: 'Everything in Launch Pack' },
      { description: 'Migrate up to 10 pages' },
      { description: 'Preserve URLs where possible' },
      { description: 'Up to 20 301 redirects' },
      { description: 'Custom domain + SSL' },
      { description: 'Zero-downtime cutover' },
      { description: 'Contact form via serverless' },
      { description: 'Security headers' },
    ],
    features: [
      { section: 'Features', name: 'Accounts', value: 3 },
      { section: 'Features', name: 'Deal progress boards', value: 5 },
      { section: 'Features', name: 'Sourcing platforms', value: 'Select' },
      { section: 'Features', name: 'Contacts', value: 100 },
      { section: 'Features', name: 'AI assisted outreach', value: false },
      { section: 'Analysis', name: 'Competitor analysis', value: false },
      { section: 'Analysis', name: 'Dashboard reporting', value: false },
      { section: 'Analysis', name: 'Community insights', value: false },
      { section: 'Analysis', name: 'Performance analysis', value: false },
      { section: 'Support', name: 'Email support', value: true },
      { section: 'Support', name: '24 / 7 call center support', value: false },
      { section: 'Support', name: 'Dedicated account manager', value: false },
    ],
  },
]

async function Header({ lang }: { lang: string }) {
  const { t } = await initTranslations(lang, ['support-packages'])
  return (
    <Container className="mt-16">
      <Heading as="h1">{t('header.title')}</Heading>
      <Lead className="mt-6 max-w-3xl">{t('header.description')}</Lead>
    </Container>
  )
}

function PricingCards({ locale }: { locale: string }) {
  return (
    <div className="relative py-24">
      <Gradient className="absolute inset-x-2 top-48 bottom-0 rounded-4xl ring-1 ring-black/5 ring-inset" />
      <Container className="relative">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {tiers.map((tier, tierIndex) => (
            <PricingCard key={tierIndex} tier={tier} locale={locale} />
          ))}
        </div>
        <LogoCloud className="mt-24" />
      </Container>
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
  const { t } = await initTranslations(locale, ['support-packages'])

  // Map tier slug to camelCase for translation keys
  const tierKeyMap: { [key: string]: string } = {
    'tiny-tweak': 'tinyTweak',
    'quick-fix': 'quickFix',
    'first-deploy': 'firstDeploy',
    'launch-pack': 'launchPack',
    'migration-mini': 'migrationMini',
  }

  const tierKey = tierKeyMap[tier.slug] || tier.slug

  return (
    <div className="-m-2 grid grid-cols-1 rounded-4xl shadow-[inset_0_0_2px_1px_#ffffff4d] ring-1 ring-black/5 max-lg:mx-auto max-lg:w-full max-lg:max-w-md">
      <div className="grid grid-cols-1 rounded-4xl p-2 shadow-md shadow-black/5">
        <div className="rounded-3xl bg-white p-10 pb-9 shadow-2xl ring-1 ring-black/5">
          <Subheading>{tier.name}</Subheading>
          <p className="mt-2 text-sm/6 text-gray-950/75">
            {t(`tiers.${tierKey}.description`)}
          </p>
          <div className="mt-8 flex items-center gap-4">
            <div className="text-5xl font-medium text-gray-950">
              €{tier.price}
            </div>
            <div className="text-sm/5 text-gray-950/75">
              <p>EUR</p>
            </div>
          </div>
          <div className="mt-8">
            <Button href={tier.href}>{t('ui.buyNow')}</Button>
          </div>
          <div className="mt-8">
            <h3 className="text-sm/6 font-medium text-gray-950">
              {t('ui.features')}
            </h3>
            <ul className="mt-3 space-y-3">
              {(
                t(`tiers.${tierKey}.highlights`, {
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

async function FrequentlyAskedQuestions({ lang }: { lang: string }) {
  const { t } = await initTranslations(lang, ['support-packages'])
  const questions = [
    'oneOff',
    'hosting',
    'requirements',
    'speed',
    'services',
    'migration',
  ]

  return (
    <Container>
      <section id="faqs" className="mt-32">
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
      <PricingCards locale={awaitedParams.lang} />
      <FrequentlyAskedQuestions lang={awaitedParams.lang} />
      <Footer type="support" locale={awaitedParams.lang} />
    </main>
  )
}
