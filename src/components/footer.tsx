import { initTranslations } from '@/app/i18n'
import { PlusGrid, PlusGridItem, PlusGridRow } from '@/components/plus-grid'
import { Button } from './button'
import { Container } from './container'
import { Gradient } from './gradient'
import { Link } from './link'
import { Logo } from './logo'
import { Subheading } from './text'

function CallToAction({
  title,
  description,
  subtitle,
  button,
  link,
  getStarted,
}: {
  title: string
  description: string
  subtitle: string
  button: string
  link: string
  getStarted: string
}) {
  return (
    <div className="relative pt-20 pb-16 text-center sm:py-24">
      <hgroup>
        <Subheading>{getStarted}</Subheading>
        <p className="mt-6 text-3xl font-medium tracking-tight text-gray-950 sm:text-5xl">
          {title}
          <br />
          {description}
        </p>
      </hgroup>
      <p className="mx-auto mt-6 max-w-xs text-sm/6 text-gray-500">
        {subtitle}
      </p>
      <div className="mt-6">
        <Button className="w-full sm:w-auto" href={link}>
          {button}
        </Button>
      </div>
    </div>
  )
}

function SitemapHeading({ children }: { children: React.ReactNode }) {
  return <h3 className="text-sm/6 font-medium text-gray-950/50">{children}</h3>
}

function SitemapLinks({ children }: { children: React.ReactNode }) {
  return <ul className="mt-6 space-y-4 text-sm/6">{children}</ul>
}

function SitemapLink(props: React.ComponentPropsWithoutRef<typeof Link>) {
  return (
    <li>
      <Link
        {...props}
        className="font-medium text-gray-950 data-hover:text-gray-950/75"
      />
    </li>
  )
}

async function Sitemap({ locale }: { locale: string }) {
  const { t } = await initTranslations(locale, ['footer'])

  return (
    <>
      <div>
        <SitemapHeading>{t('sitemap.product')}</SitemapHeading>
        <SitemapLinks>
          <SitemapLink href="/hosting">{t('sitemap.hosting')}</SitemapLink>
          <SitemapLink href="/domains">{t('sitemap.domains')}</SitemapLink>
          <SitemapLink href="/support-packages">
            {t('sitemap.supportPackages')}
          </SitemapLink>
        </SitemapLinks>
      </div>
      <div>
        <SitemapHeading>{t('sitemap.company')}</SitemapHeading>
        <SitemapLinks>
          <SitemapLink href="/blog">{t('sitemap.blog')}</SitemapLink>
          <SitemapLink href="/company">{t('sitemap.company')}</SitemapLink>
          <SitemapLink href="#">{t('sitemap.helpCenter')}</SitemapLink>
        </SitemapLinks>
      </div>
      <div>
        <SitemapHeading>{t('sitemap.legal')}</SitemapHeading>
        <SitemapLinks>
          <SitemapLink href="/legal/terms-and-conditions">
            {t('sitemap.termsOfService')}
          </SitemapLink>
          <SitemapLink href="/legal/privacy-policy">
            {t('sitemap.privacyPolicy')}
          </SitemapLink>
          <SitemapLink href="/legal/refund-policy">
            {t('sitemap.refundPolicy')}
          </SitemapLink>
        </SitemapLinks>
      </div>
    </>
  )
}

async function Copyright({ locale }: { locale: string }) {
  const { t } = await initTranslations(locale, ['footer'])

  return (
    <div className="text-sm/6 text-gray-950">
      &copy; {new Date().getFullYear()} Host Jamstack. {t('copyright')}
    </div>
  )
}

async function CompanyDetails({ locale }: { locale: string }) {
  const { t } = await initTranslations(locale, ['footer'])

  return (
    <div className="text-sm/6 text-gray-950">
      <div className="font-medium">{t('companyDetails.name')}</div>
      <div>{t('companyDetails.companyNumber')}</div>
      <div>{t('companyDetails.address1')}</div>
      <div>{t('companyDetails.address2')}</div>
    </div>
  )
}

export async function Footer({
  locale,
  type = 'general',
}: {
  locale: string
  type?: 'hosting' | 'support' | 'domains' | 'general'
}) {
  const { t } = await initTranslations(locale, ['footer'])

  const ctaLinks = {
    support: '/support-packages',
    hosting: '/hosting',
    domains: '/domains',
    general: '/support-packages',
  }

  return (
    <footer>
      <Gradient className="relative">
        <div className="absolute inset-2 rounded-4xl bg-white/80" />
        <Container>
          <CallToAction
            getStarted={t('cta.getStarted')}
            title={t(`cta.${type}.title`)}
            subtitle={t(`cta.${type}.subtitle`)}
            description={t(`cta.${type}.description`)}
            button={t(`cta.${type}.button`)}
            link={ctaLinks[type]}
          />
          <PlusGrid className="pb-16">
            <PlusGridRow>
              <div className="grid grid-cols-2 gap-y-10 pb-6 lg:grid-cols-6 lg:gap-8">
                <div className="col-span-2 flex">
                  <PlusGridItem className="pt-6 lg:pb-6">
                    <Logo />
                  </PlusGridItem>
                </div>
                <div className="col-span-2 grid grid-cols-2 gap-x-8 gap-y-12 lg:col-span-4 lg:grid-cols-3 lg:pt-6">
                  <Sitemap locale={locale} />
                </div>
              </div>
            </PlusGridRow>
            <PlusGridRow className="flex flex-col justify-between sm:flex-row">
              <div className="flex flex-col gap-4 sm:flex-row sm:gap-8">
                <PlusGridItem className="py-3">
                  <CompanyDetails locale={locale} />
                </PlusGridItem>
              </div>
              <div className="flex">
                <PlusGridItem className="flex items-center gap-8 py-3">
                  <Copyright locale={locale} />
                </PlusGridItem>
              </div>
            </PlusGridRow>
          </PlusGrid>
        </Container>
      </Gradient>
    </footer>
  )
}
