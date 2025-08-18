import { Button } from '@/components/button'
import { Container } from '@/components/container'
import { Footer } from '@/components/footer'
import { Gradient, GradientBackground } from '@/components/gradient'
import { Link } from '@/components/link'
import { LogoCloud } from '@/components/logo-cloud'
import { Navbar } from '@/components/navbar'
import { Heading, Lead, Subheading } from '@/components/text'
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import {
  CheckIcon,
  ChevronUpDownIcon,
  MinusIcon,
} from '@heroicons/react/16/solid'
import type { Metadata } from 'next'

type TierFeature = {
  section: string
  name: string
  value: boolean | string | number
}

export const metadata: Metadata = {
  title: 'Pricing',
  description:
    'Companies all over the world have closed millions of deals with Radiant. Sign up today and start selling smarter.',
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

function Header() {
  return (
    <Container className="mt-16">
      <Heading as="h1">Packages (one-off, per site)</Heading>
      <Lead className="mt-6 max-w-3xl">
        Done-for-you deployments for non-technical builders. Hosting included on
        Launch & Migration packs. Contact us to discuss your project.
      </Lead>
    </Container>
  )
}

function PricingCards() {
  return (
    <div className="relative py-24">
      <Gradient className="absolute inset-x-2 top-48 bottom-0 rounded-4xl ring-1 ring-black/5 ring-inset" />
      <Container className="relative">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {tiers.map((tier, tierIndex) => (
            <PricingCard key={tierIndex} tier={tier} />
          ))}
        </div>
        <LogoCloud className="mt-24" />
      </Container>
    </div>
  )
}

function PricingCard({ tier }: { tier: (typeof tiers)[number] }) {
  return (
    <div className="-m-2 grid grid-cols-1 rounded-4xl shadow-[inset_0_0_2px_1px_#ffffff4d] ring-1 ring-black/5 max-lg:mx-auto max-lg:w-full max-lg:max-w-md">
      <div className="grid grid-cols-1 rounded-4xl p-2 shadow-md shadow-black/5">
        <div className="rounded-3xl bg-white p-10 pb-9 shadow-2xl ring-1 ring-black/5">
          <Subheading>{tier.name}</Subheading>
          <p className="mt-2 text-sm/6 text-gray-950/75">{tier.description}</p>
          <div className="mt-8 flex items-center gap-4">
            <div className="text-5xl font-medium text-gray-950">
              €{tier.price}
            </div>
            <div className="text-sm/5 text-gray-950/75">
              <p>EUR</p>
            </div>
          </div>
          <div className="mt-8">
            <Button href={tier.href}>Buy now</Button>
          </div>
          <div className="mt-8">
            <h3 className="text-sm/6 font-medium text-gray-950">Features</h3>
            <ul className="mt-3 space-y-3">
              {tier.highlights.map((props, featureIndex) => (
                <FeatureItem key={featureIndex} {...props} />
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

function PricingTable({
  selectedTier,
}: {
  selectedTier: (typeof tiers)[number]
}) {
  return (
    <Container className="py-24">
      <table className="w-full text-left">
        <caption className="sr-only">Pricing plan comparison</caption>
        <colgroup>
          <col className="w-3/5 sm:w-2/5" />
          <col
            data-selected={selectedTier === tiers[0] ? true : undefined}
            className="w-2/5 data-selected:table-column max-sm:hidden sm:w-1/5"
          />
          <col
            data-selected={selectedTier === tiers[1] ? true : undefined}
            className="w-2/5 data-selected:table-column max-sm:hidden sm:w-1/5"
          />
          <col
            data-selected={selectedTier === tiers[2] ? true : undefined}
            className="w-2/5 data-selected:table-column max-sm:hidden sm:w-1/5"
          />
        </colgroup>
        <thead>
          <tr className="max-sm:hidden">
            <td className="p-0" />
            {tiers.map((tier) => (
              <th
                key={tier.slug}
                scope="col"
                data-selected={selectedTier === tier ? true : undefined}
                className="p-0 data-selected:table-cell max-sm:hidden"
              >
                <Subheading as="div">{tier.name}</Subheading>
              </th>
            ))}
          </tr>
          <tr className="sm:hidden">
            <td className="p-0">
              <div className="relative inline-block">
                <Menu>
                  <MenuButton className="flex items-center justify-between gap-2 font-medium">
                    {selectedTier.name}
                    <ChevronUpDownIcon className="size-4 fill-gray-900" />
                  </MenuButton>
                  <MenuItems
                    anchor="bottom start"
                    className="min-w-(--button-width) rounded-lg bg-white p-1 shadow-lg ring-1 ring-gray-200 [--anchor-gap:6px] [--anchor-offset:-4px] [--anchor-padding:10px]"
                  >
                    {tiers.map((tier) => (
                      <MenuItem key={tier.slug}>
                        <Link
                          scroll={false}
                          href={`/pricing?tier=${tier.slug}`}
                          data-selected={
                            tier === selectedTier ? true : undefined
                          }
                          className="group flex items-center gap-2 rounded-md px-2 py-1 data-focus:bg-gray-200"
                        >
                          {tier.name}
                          <CheckIcon className="hidden size-4 group-data-selected:block" />
                        </Link>
                      </MenuItem>
                    ))}
                  </MenuItems>
                </Menu>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center">
                  <ChevronUpDownIcon className="size-4 fill-gray-900" />
                </div>
              </div>
            </td>
            <td colSpan={3} className="p-0 text-right">
              <Button variant="outline" href={selectedTier.href}>
                Get started
              </Button>
            </td>
          </tr>
          <tr className="max-sm:hidden">
            <th className="p-0" scope="row">
              <span className="sr-only">Get started</span>
            </th>
            {tiers.map((tier) => (
              <td
                key={tier.slug}
                data-selected={selectedTier === tier ? true : undefined}
                className="px-0 pt-4 pb-0 data-selected:table-cell max-sm:hidden"
              >
                <Button variant="outline" href={tier.href}>
                  Get started
                </Button>
              </td>
            ))}
          </tr>
        </thead>
        {[...new Set(tiers[0].features.map(({ section }) => section))].map(
          (section) => (
            <tbody key={section} className="group">
              <tr>
                <th
                  scope="colgroup"
                  colSpan={4}
                  className="px-0 pt-10 pb-0 group-first-of-type:pt-5"
                >
                  <div className="-mx-4 rounded-lg bg-gray-50 px-4 py-3 text-sm/6 font-semibold">
                    {section}
                  </div>
                </th>
              </tr>
              {tiers[0].features
                .filter((feature) => feature.section === section)
                .map(({ name }) => (
                  <tr
                    key={name}
                    className="border-b border-gray-100 last:border-none"
                  >
                    <th
                      scope="row"
                      className="px-0 py-4 text-sm/6 font-normal text-gray-600"
                    >
                      {name}
                    </th>
                    {tiers.map((tier) => {
                      let value = tier.features.find(
                        (feature) =>
                          feature.section === section && feature.name === name,
                      )?.value

                      return (
                        <td
                          key={tier.slug}
                          data-selected={
                            selectedTier === tier ? true : undefined
                          }
                          className="p-4 data-selected:table-cell max-sm:hidden"
                        >
                          {value === true ? (
                            <>
                              <CheckIcon className="size-4 fill-green-600" />
                              <span className="sr-only">
                                Included in {tier.name}
                              </span>
                            </>
                          ) : value === false || value === undefined ? (
                            <>
                              <MinusIcon className="size-4 fill-gray-400" />
                              <span className="sr-only">
                                Not included in {tier.name}
                              </span>
                            </>
                          ) : (
                            <div className="text-sm/6">{value}</div>
                          )}
                        </td>
                      )
                    })}
                  </tr>
                ))}
            </tbody>
          ),
        )}
      </table>
    </Container>
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

function Testimonial() {
  return (
    <div className="mx-2 my-24 rounded-4xl bg-gray-900 bg-[url(/dot-texture.svg)] pt-72 pb-24 lg:pt-36">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-[384px_1fr_1fr]">
          <div className="-mt-96 lg:-mt-52">
            <div className="-m-2 rounded-4xl bg-white/15 shadow-[inset_0_0_2px_1px_#ffffff4d] ring-1 ring-black/5 max-lg:mx-auto max-lg:max-w-xs">
              <div className="rounded-4xl p-2 shadow-md shadow-black/5">
                <div className="overflow-hidden rounded-3xl shadow-2xl outline outline-1 -outline-offset-1 outline-black/10">
                  <img
                    alt=""
                    src="/testimonials/tina-yards.jpg"
                    className="aspect-3/4 w-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="flex max-lg:mt-16 lg:col-span-2 lg:px-16">
            <figure className="mx-auto flex max-w-xl flex-col gap-16 max-lg:text-center">
              <blockquote>
                <p className="relative text-3xl tracking-tight text-white before:absolute before:-translate-x-full before:content-['“'] after:absolute after:content-['”'] lg:text-4xl">
                  Thanks to Radiant, we&apos;re finding new leads that we never
                  would have found with legal methods.
                </p>
              </blockquote>
              <figcaption className="mt-auto">
                <p className="text-sm/6 font-medium text-white">Tina Yards</p>
                <p className="text-sm/6 font-medium">
                  <span className="bg-linear-to-r from-[#fff1be] from-28% via-[#ee87cb] via-70% to-[#b060ff] bg-clip-text text-transparent">
                    VP of Sales, Protocol
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

function FrequentlyAskedQuestions() {
  return (
    <Container>
      <section id="faqs" className="mt-32">
        <Subheading className="text-center">
          Frequently asked questions
        </Subheading>
        <Heading as="div" className="mt-2 text-center">
          Your questions answered.
        </Heading>
        <div className="mx-auto mt-16 mb-32 max-w-xl space-y-12">
          <dl>
            <dt className="text-sm font-semibold">
              1) Is it really a one-off payment?
            </dt>
            <dd className="mt-4 text-sm/6 text-gray-600">
              Yes. Each pack is a single payment. Packs with hosting keep your
              site live for the stated period. Near the end you can renew with
              another one-off, switch to monthly cover, or move elsewhere.
            </dd>
          </dl>
          <dl>
            <dt className="text-sm font-semibold">
              2) What does “hosting included” and “fair-use” mean?
            </dt>
            <dd className="mt-4 text-sm/6 text-gray-600">
              Hosting covers typical small-site usage. As guidance:
              ~50&nbsp;GB/month bandwidth, ~250k function calls per month, and
              reasonable build activity. If you consistently exceed this, we’ll
              flag it early and propose options before any extra costs apply.
            </dd>
          </dl>
          <dl>
            <dt className="text-sm font-semibold">
              3) What do you need from me to start?
            </dt>
            <dd className="mt-4 text-sm/6 text-gray-600">
              Read access to your Git repo, domain registrar/DNS access (or
              permission for us to manage it), and any required secrets (API
              keys, SMTP). For migrations: current host details and priority
              URLs. We support Next.js, Astro, Vite and plain static sites.
            </dd>
          </dl>
          <dl>
            <dt className="text-sm font-semibold">
              4) How fast can you get me live?
            </dt>
            <dd className="mt-4 text-sm/6 text-gray-600">
              Most projects go live within a few business days once we have
              access and your domain is ready. DNS changes can take a short time
              to propagate. We’ll confirm timelines up front.
            </dd>
          </dl>
          <dl>
            <dt className="text-sm font-semibold">
              5) Do you handle domains, email and databases?
            </dt>
            <dd className="mt-4 text-sm/6 text-gray-600">
              Domains/DNS/SSL — yes. Email — we don’t host it; we’ll configure
              DNS for Microsoft 365 or Google Workspace. Databases — we don’t
              host them; we’ll integrate your site with a hosted DB/CMS you
              choose and set the environment variables.
            </dd>
          </dl>
          <dl>
            <dt className="text-sm font-semibold">6) Can I move away later?</dt>
            <dd className="mt-4 text-sm/6 text-gray-600">
              Absolutely. No lock-in. You own the code, content and domain. We
              provide plain-speaking handover docs and can assist with transfer
              if you need it.
            </dd>
          </dl>
        </div>
      </section>
    </Container>
  )
}

export default async function Pricing({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  let params = await searchParams
  let tier =
    typeof params.tier === 'string'
      ? tiers.find(({ slug }) => slug === params.tier)!
      : tiers[0]

  return (
    <main className="overflow-hidden">
      <GradientBackground />
      <Container>
        <Navbar />
      </Container>
      <Header />
      <PricingCards />
      {/* <PricingTable selectedTier={tier} />
      <Testimonial /> */}
      <FrequentlyAskedQuestions />
      <Footer />
    </main>
  )
}
