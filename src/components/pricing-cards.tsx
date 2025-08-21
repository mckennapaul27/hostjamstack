import { initTranslations } from '@/app/i18n'
import { Button } from '@/components/button'
import { Gradient } from '@/components/gradient'
import { Subheading } from '@/components/text'
import { tiers } from './pricing-table'

export default async function PricingCards({ locale }: { locale: string }) {
  const { t } = await initTranslations(locale, ['pricing'])

  return (
    <div className="relative -mr-4 -ml-4 py-16 sm:-mr-0 sm:-ml-0">
      <Gradient className="absolute inset-x-2 top-48 bottom-0 rounded-4xl ring-1 ring-black/5 ring-inset" />

      <div className={'relative px-4 sm:px-6 lg:px-8'}>
        <div className="mx-auto max-w-2xl lg:max-w-7xl">
          {' '}
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {tiers.map((tier, tierIndex) => (
              <PricingCard key={tierIndex} tier={tier} t={t} />
            ))}
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

function PricingCard({ tier, t }: { tier: (typeof tiers)[number]; t: any }) {
  return (
    <div className="-m-2 grid grid-cols-1 rounded-4xl shadow-[inset_0_0_2px_1px_#ffffff4d] ring-1 ring-black/5 max-lg:mx-auto max-lg:w-full max-lg:max-w-md">
      <div className="grid grid-cols-1 rounded-4xl p-2 shadow-md shadow-black/5">
        <div className="rounded-3xl bg-white p-6 pb-9 shadow-2xl ring-1 ring-black/5 sm:p-10">
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
              {t(`tiers.${tier.slug}.highlights`, { returnObjects: true }).map(
                (highlight: string, featureIndex: number) => (
                  <FeatureItem key={featureIndex} description={highlight} />
                ),
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
