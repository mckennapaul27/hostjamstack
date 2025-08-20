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
    href: '#',
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
    href: '#',
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
    href: '#',
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

export default function PricingTable({
  selectedTier,
}: {
  selectedTier: (typeof tiers)[number]
}) {
  return (
    <Container className="!px-0 py-24">
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
