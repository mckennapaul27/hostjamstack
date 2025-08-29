import { initTranslations } from '@/app/i18n'
import { Button } from '@/components/button'
import { Container } from '@/components/container'
import { Link } from '@/components/link'
import { Subheading } from '@/components/text'
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import {
  CheckIcon,
  ChevronUpDownIcon,
  MinusIcon,
} from '@heroicons/react/16/solid'

export const tiers = [
  {
    name: 'Growth' as const,
    slug: 'growth',
    description:
      'The perfect starting place for your web app or personal project.',
    priceMonthly: 10,
    href: '/checkout/hosting?plan=growth',
    highlights: [
      { description: 'Import your repo, deploy in seconds' },
      { description: 'Automatic CI/CD' },
      { description: 'Web Application Firewall' },
      { description: 'Global, automated CDN' },
      { description: 'Fluid compute' },
      { description: 'DDoS Mitigation' },
      { description: 'Traffic & performance insights' },
    ],
    features: [
      {
        section: 'Delivery Network',
        name: 'Edge Requests',
        value: '1M /month included',
      },
      {
        section: 'Delivery Network',
        name: 'Fast Data Transfer',
        value: '100 GB /month included',
      },
      {
        section: 'Content, Caching & Optimization',
        name: 'ISR Reads',
        value: '1M /month included',
      },
      {
        section: 'Content, Caching & Optimization',
        name: 'ISR Writes',
        value: '200,000 /month included',
      },
      {
        section: 'Content, Caching & Optimization',
        name: 'Storage Size',
        value: '1 GB / month',
      },
      {
        section: 'Content, Caching & Optimization',
        name: 'Simple Operations',
        value: '10,000 included',
      },
      {
        section: 'Content, Caching & Optimization',
        name: 'Advanced Operations',
        value: '2,000 included',
      },
      {
        section: 'Content, Caching & Optimization',
        name: 'Blob Data Transfer',
        value: '10 GB included',
      },
      {
        section: 'Content, Caching & Optimization',
        name: 'Image Transformations',
        value: '5,000 / month included',
      },
      {
        section: 'Content, Caching & Optimization',
        name: 'Edge Config Reads',
        value: '100,000 / month included',
      },
      {
        section: 'Content, Caching & Optimization',
        name: 'Edge Config Writes',
        value: '100 writes / month included',
      },
      {
        section: 'Compute',
        name: 'Active CPU',
        value: '4 hours / month included',
      },
      {
        section: 'Compute',
        name: 'Provisioned Memory',
        value: '360 GB-hrs included / month',
      },
      { section: 'Compute', name: 'Invocations', value: '1M / month included' },
      { section: 'Support', name: 'Email support', value: true },
      { section: 'Support', name: '24 / 7 call center support', value: false },
      { section: 'Support', name: 'Dedicated account manager', value: false },
    ],
  },
  {
    name: 'Pro' as const,
    slug: 'pro',
    description:
      'Everything you need to build and scale your app and business.',
    priceMonthly: 20,
    href: '/checkout/hosting?plan=pro',
    highlights: [
      { description: 'Everything in Growth, plus:' },
      { description: '10x more included usage' },
      { description: 'Observability tools' },
      { description: 'Faster builds' },
      { description: 'Cold start prevention' },
      { description: 'Advanced WAF Protection' },
      { description: 'Email support' },
    ],
    features: [
      {
        section: 'Delivery Network',
        name: 'Edge Requests',
        value: '10M /month included',
      },
      {
        section: 'Delivery Network',
        name: 'Fast Data Transfer',
        value: '1 TB /month included',
      },
      {
        section: 'Content, Caching & Optimization',
        name: 'ISR Reads',
        value: '10M /month included',
      },
      {
        section: 'Content, Caching & Optimization',
        name: 'ISR Writes',
        value: '2M /month included',
      },
      {
        section: 'Content, Caching & Optimization',
        name: 'Storage Size',
        value: '5 GB / month',
      },
      {
        section: 'Content, Caching & Optimization',
        name: 'Simple Operations',
        value: '100,000 included',
      },
      {
        section: 'Content, Caching & Optimization',
        name: 'Advanced Operations',
        value: '10,000 included',
      },
      {
        section: 'Content, Caching & Optimization',
        name: 'Blob Data Transfer',
        value: '100 GB included',
      },
      {
        section: 'Content, Caching & Optimization',
        name: 'Image Transformations',
        value: '10,000 / month included',
      },
      {
        section: 'Content, Caching & Optimization',
        name: 'Edge Config Reads',
        value: '1m / month included',
      },
      {
        section: 'Content, Caching & Optimization',
        name: 'Edge Config Writes',
        value: '1000 writes / month included',
      },
      {
        section: 'Compute',
        name: 'Active CPU',
        value: '16 hours / month included',
      },
      {
        section: 'Compute',
        name: 'Provisioned Memory',
        value: '1440 GB-hrs included / month',
      },
      { section: 'Compute', name: 'Invocations', value: '1M / month included' },
      { section: 'Support', name: 'Email support', value: true },
      { section: 'Support', name: '24 / 7 call center support', value: true },
      { section: 'Support', name: 'Dedicated account manager', value: false },
    ],
  },
  {
    name: 'Enterprise' as const,
    slug: 'enterprise',
    description:
      'Critical security, performance, observability, platform SLAs, and support.',
    priceMonthly: 100,
    href: '/contact',
    highlights: [
      { description: 'Everything in Pro, plus:' },
      { description: 'Guest & Team access controls' },
      { description: 'SCIM & Directory Sync' },
      { description: 'Managed WAF Rulesets' },
      { description: 'Multi-region compute & failover' },
      { description: '99.99% SLA' },
      { description: 'Advanced Support' },
    ],
    features: [
      { section: 'Delivery Network', name: 'Edge Requests', value: 'Custom' },
      {
        section: 'Delivery Network',
        name: 'Fast Data Transfer',
        value: 'Custom',
      },
      {
        section: 'Content, Caching & Optimization',
        name: 'ISR Reads',
        value: 'Custom',
      },
      {
        section: 'Content, Caching & Optimization',
        name: 'ISR Writes',
        value: 'Custom',
      },
      {
        section: 'Content, Caching & Optimization',
        name: 'Storage Size',
        value: 'Custom',
      },
      {
        section: 'Content, Caching & Optimization',
        name: 'Simple Operations',
        value: 'Custom',
      },
      {
        section: 'Content, Caching & Optimization',
        name: 'Advanced Operations',
        value: 'Custom',
      },
      {
        section: 'Content, Caching & Optimization',
        name: 'Blob Data Transfer',
        value: 'Custom',
      },
      {
        section: 'Content, Caching & Optimization',
        name: 'Image Transformations',
        value: 'Custom',
      },
      {
        section: 'Content, Caching & Optimization',
        name: 'Edge Config Reads',
        value: 'Custom',
      },
      {
        section: 'Content, Caching & Optimization',
        name: 'Edge Config Writes',
        value: 'Custom',
      },
      { section: 'Compute', name: 'Active CPU', value: 'Custom' },
      { section: 'Compute', name: 'Provisioned Memory', value: 'Custom' },
      { section: 'Compute', name: 'Invocations', value: 'Custom' },
      { section: 'Support', name: 'Email support', value: true },
      { section: 'Support', name: '24 / 7 call center support', value: true },
      { section: 'Support', name: 'Dedicated account manager', value: true },
    ],
  },
]

export default async function PricingTable({
  selectedTier,
  locale,
}: {
  selectedTier: (typeof tiers)[number]
  locale: string
}) {
  const { t } = await initTranslations(locale, ['pricing'])

  // Create a mapping for section translations
  const getSectionTranslation = (section: string) => {
    switch (section) {
      case 'Delivery Network':
        return t('features.sections.deliveryNetwork')
      case 'Content, Caching & Optimization':
        return t('features.sections.contentCaching')
      case 'Compute':
        return t('features.sections.compute')
      case 'Support':
        return t('features.sections.support')
      default:
        return section
    }
  }

  // Create a mapping for feature name translations
  const getFeatureNameTranslation = (name: string) => {
    const nameMap: { [key: string]: string } = {
      'Edge Requests': t('features.names.edgeRequests'),
      'Fast Data Transfer': t('features.names.fastDataTransfer'),
      'ISR Reads': t('features.names.isrReads'),
      'ISR Writes': t('features.names.isrWrites'),
      'Storage Size': t('features.names.storageSize'),
      'Simple Operations': t('features.names.simpleOperations'),
      'Advanced Operations': t('features.names.advancedOperations'),
      'Blob Data Transfer': t('features.names.blobDataTransfer'),
      'Image Transformations': t('features.names.imageTransformations'),
      'Edge Config Reads': t('features.names.edgeConfigReads'),
      'Edge Config Writes': t('features.names.edgeConfigWrites'),
      'Active CPU': t('features.names.activeCpu'),
      'Provisioned Memory': t('features.names.provisionedMemory'),
      Invocations: t('features.names.invocations'),
      'Email support': t('features.names.emailSupport'),
      '24 / 7 call center support': t('features.names.callCenterSupport'),
      'Dedicated account manager': t('features.names.dedicatedAccountManager'),
    }
    return nameMap[name] || name
  }

  // Create a function to translate feature values
  const getFeatureValueTranslation = (value: string | boolean) => {
    if (typeof value === 'boolean' || value === undefined) {
      return value
    }

    if (value === 'Custom') {
      return t('features.values.custom')
    }

    // Handle patterns like "1M /month included", "100 GB /month included", etc.
    if (value.includes('included')) {
      const parts = value.split(' ')
      const translatedParts = parts.map((part) => {
        if (part === 'included') return t('features.values.included')
        if (part === '/month') return `/${t('features.values.month')}`
        return part
      })
      return translatedParts.join(' ')
    }

    // Handle patterns like "1 GB / month", "5 GB / month"
    if (value.includes('/ month')) {
      return value.replace('/ month', ` / ${t('features.values.month')}`)
    }

    // Handle patterns like "100 writes / month included"
    if (value.includes('writes') && value.includes('month')) {
      return value
        .replace('writes', t('features.values.writes', 'writes'))
        .replace('/ month', ` / ${t('features.values.month')}`)
        .replace('included', t('features.values.included'))
    }

    return value
  }

  return (
    <Container className="!px-0 py-24">
      <table className="w-full text-left">
        <caption className="sr-only">{t('ui.pricingPlanComparison')}</caption>
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
                          href={`?tier=${tier.slug}`}
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
                {t('ui.getStarted')}
              </Button>
            </td>
          </tr>
          <tr className="max-sm:hidden">
            <th className="p-0" scope="row">
              <span className="sr-only">{t('ui.getStarted')}</span>
            </th>
            {tiers.map((tier) => (
              <td
                key={tier.slug}
                data-selected={selectedTier === tier ? true : undefined}
                className="px-0 pt-4 pb-0 data-selected:table-cell max-sm:hidden"
              >
                <Button variant="outline" href={tier.href}>
                  {t('ui.getStarted')}
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
                    {getSectionTranslation(section)}
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
                      {getFeatureNameTranslation(name)}
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
                                {t('ui.includedIn')} {tier.name}
                              </span>
                            </>
                          ) : value === false || value === undefined ? (
                            <>
                              <MinusIcon className="size-4 fill-gray-400" />
                              <span className="sr-only">
                                {t('ui.notIncludedIn')} {tier.name}
                              </span>
                            </>
                          ) : (
                            <div className="text-sm/6">
                              {getFeatureValueTranslation(value)}
                            </div>
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
