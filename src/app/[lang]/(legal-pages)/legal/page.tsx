import { initTranslations } from '@/app/i18n'
import { Container } from '@/components/container'
import { Footer } from '@/components/footer'
import { GradientBackground } from '@/components/gradient'
import { Link } from '@/components/link'
import { Navbar } from '@/components/navbar'
import { Heading, Lead, Subheading } from '@/components/text'
import {
  generateLegalArticlesIndex,
  type LegalArticle,
} from '@/lib/legal-articles'
import { ChevronRightIcon } from '@heroicons/react/16/solid'
import dayjs from 'dayjs'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Legal Documents | HostJamstack',
  description:
    'Access all legal documents for HostJamstack services including Terms and Conditions, Privacy Policy, and Refund Policy.',
}

async function Header({ lang }: { lang: string }) {
  const { t } = await initTranslations(lang, ['legal'])
  return (
    <Container className="mt-16">
      <Heading as="h1">{t('header.title')}</Heading>
      <Lead className="mt-6 max-w-3xl">{t('header.description')}</Lead>
      {/* {lang !== 'en' && (
        <div className="mt-6 rounded-lg border border-amber-200 bg-amber-50 p-4">
          <p className="text-sm text-amber-800">
            <strong>{t('header.languageNotice.note')}</strong>{' '}
            {t('header.languageNotice.text')}
          </p>
        </div>
      )} */}
    </Container>
  )
}

async function CompanyInfo({ lang }: { lang: string }) {
  const { t } = await initTranslations(lang, ['legal'])
  return (
    <Container className="mt-16">
      <div className="rounded-2xl bg-gray-50 p-8">
        <Subheading className="mb-6">{t('companyInfo.title')}</Subheading>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div>
            <h3 className="mb-2 text-sm font-semibold text-gray-950">
              {t('companyInfo.sections.legalEntity.title')}
            </h3>
            <p className="text-sm/6 text-gray-600">
              <strong>
                {t('companyInfo.sections.legalEntity.companyName')}
              </strong>
              <br />
              {t('companyInfo.sections.legalEntity.companyNumber')}
            </p>
          </div>
          <div>
            <h3 className="mb-2 text-sm font-semibold text-gray-950">
              {t('companyInfo.sections.registeredAddress.title')}
            </h3>
            <p className="text-sm/6 text-gray-600">
              Trakia, bl 216, Vh B, ap 8<br />
              Plovdiv, Bulgaria
            </p>
          </div>
          <div>
            <h3 className="mb-2 text-sm font-semibold text-gray-950">
              {t('companyInfo.sections.contact.title')}
            </h3>
            <p className="text-sm/6 text-gray-600">
              {t('companyInfo.sections.contact.email')}
              <br />
              {t('companyInfo.sections.contact.website')}
            </p>
          </div>
          <div>
            <h3 className="mb-2 text-sm font-semibold text-gray-950">
              {t('companyInfo.sections.governingLaw.title')}
            </h3>
            <p className="text-sm/6 text-gray-600">
              {t('companyInfo.sections.governingLaw.law')}
              <br />
              {t('companyInfo.sections.governingLaw.compliance')}
            </p>
          </div>
        </div>
      </div>
    </Container>
  )
}

async function LegalDocumentCard({
  article,
  lang,
}: {
  article: LegalArticle
  lang: string
}) {
  const { t } = await initTranslations(lang, ['legal'])
  const getIcon = (slug: string) => {
    switch (slug) {
      case 'terms-and-conditions':
        return '📋'
      case 'privacy-policy':
        return '🔒'
      case 'refund-policy':
        return '💰'
      default:
        return '📄'
    }
  }

  const getDescription = (slug: string) => {
    const descriptions = t('documents.descriptions', {
      returnObjects: true,
    }) as Record<string, string>
    return descriptions[slug] || article.description
  }

  return (
    <Link
      href={`/${lang}/legal/${article.slug}`}
      className="group block rounded-2xl border border-gray-200 p-6 transition-all hover:border-gray-300 hover:shadow-lg"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="mb-3 flex items-center gap-3">
            <span className="text-2xl">{getIcon(article.slug)}</span>
            <h3 className="text-lg font-semibold text-gray-950 transition-colors group-hover:text-gray-700">
              {article.title}
            </h3>
          </div>
          <p className="mb-4 text-sm/6 text-gray-600">
            {getDescription(article.slug)}
          </p>
          <p className="text-xs text-gray-500">
            {t('documents.lastUpdated')}{' '}
            {dayjs(article.updatedAt).format('MMMM D, YYYY')}
          </p>
        </div>
        <ChevronRightIcon className="mt-1 ml-4 size-5 text-gray-400 transition-colors group-hover:text-gray-600" />
      </div>
    </Link>
  )
}

async function LegalDocuments({ lang }: { lang: string }) {
  const { t } = await initTranslations(lang, ['legal'])
  // Always fetch English legal articles since they're only available in English
  const legalArticles = await generateLegalArticlesIndex('en')

  return (
    <Container className="mt-16 pb-16">
      <Subheading className="mb-8">{t('documents.title')}</Subheading>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">
        {legalArticles.map((article) => (
          <LegalDocumentCard key={article.slug} article={article} lang={lang} />
        ))}
      </div>

      {legalArticles.length === 0 && (
        <div className="py-12 text-center">
          <p className="text-gray-500">{t('documents.noDocuments')}</p>
        </div>
      )}
    </Container>
  )
}

async function ImportantNotice({ lang }: { lang: string }) {
  const { t } = await initTranslations(lang, ['legal'])
  return (
    <Container className="mb-24">
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-8">
        <h3 className="mb-4 text-lg font-semibold text-amber-900">
          {t('importantNotice.title')}
        </h3>
        <div className="space-y-4 text-sm/6 text-amber-800">
          <p>
            <strong>{t('importantNotice.sections.effectiveDate.label')}</strong>{' '}
            {t('importantNotice.sections.effectiveDate.text')}
          </p>
          <p>
            <strong>{t('importantNotice.sections.updates.label')}</strong>{' '}
            {t('importantNotice.sections.updates.text')}
          </p>
          <p>
            <strong>{t('importantNotice.sections.questions.label')}</strong>{' '}
            {t('importantNotice.sections.questions.text')}
          </p>
          {/* <p>
            <strong>{t('importantNotice.sections.language.label')}</strong>{' '}
            {t('importantNotice.sections.language.text')}
          </p> */}
        </div>
      </div>
    </Container>
  )
}

export default async function LegalIndex({
  params,
}: {
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params

  // Initialize translations for legal namespace

  return (
    <main className="overflow-hidden">
      <GradientBackground />
      <Container>
        <Navbar locale={lang} />
      </Container>
      <Header lang={lang} />
      <CompanyInfo lang={lang} />
      <LegalDocuments lang={lang} />
      <ImportantNotice lang={lang} />
      <Footer locale={lang} />
    </main>
  )
}
