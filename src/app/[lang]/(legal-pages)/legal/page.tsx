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

function Header({ lang }: { lang: string }) {
  return (
    <Container className="mt-16">
      <Heading as="h1">Legal Documents</Heading>
      <Lead className="mt-6 max-w-3xl">
        Important legal information for using HostJamstack services. Please read
        these documents carefully as they contain important information about
        your rights and responsibilities.
      </Lead>
      {lang !== 'en' && (
        <div className="mt-6 rounded-lg border border-amber-200 bg-amber-50 p-4">
          <p className="text-sm text-amber-800">
            <strong>Note:</strong> Legal documents are available in English
            only. All content below is displayed in English regardless of your
            selected language.
          </p>
        </div>
      )}
    </Container>
  )
}

function CompanyInfo() {
  return (
    <Container className="mt-16">
      <div className="rounded-2xl bg-gray-50 p-8">
        <Subheading className="mb-6">Company Information</Subheading>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div>
            <h3 className="mb-2 text-sm font-semibold text-gray-950">
              Legal Entity
            </h3>
            <p className="text-sm/6 text-gray-600">
              <strong>DRP Solutions ltd</strong>
              <br />
              Company number: 208392740
            </p>
          </div>
          <div>
            <h3 className="mb-2 text-sm font-semibold text-gray-950">
              Registered Address
            </h3>
            <p className="text-sm/6 text-gray-600">
              Trakia, bl 216, Vh B, ap 8<br />
              Plovdiv, Bulgaria
            </p>
          </div>
          <div>
            <h3 className="mb-2 text-sm font-semibold text-gray-950">
              Contact
            </h3>
            <p className="text-sm/6 text-gray-600">
              Email: hello@hostjamstack.com
              <br />
              Website: hostjamstack.com
            </p>
          </div>
          <div>
            <h3 className="mb-2 text-sm font-semibold text-gray-950">
              Governing Law
            </h3>
            <p className="text-sm/6 text-gray-600">
              Bulgarian Law
              <br />
              EU/GDPR Compliant
            </p>
          </div>
        </div>
      </div>
    </Container>
  )
}

function LegalDocumentCard({
  article,
  lang,
}: {
  article: LegalArticle
  lang: string
}) {
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
    switch (slug) {
      case 'terms-and-conditions':
        return 'Terms of service for using HostJamstack hosting, support, and domain services.'
      case 'privacy-policy':
        return 'How we collect, use, and protect your personal information in compliance with GDPR.'
      case 'refund-policy':
        return 'Refund terms and conditions for our different service types and billing models.'
      default:
        return article.description
    }
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
            Last updated: {dayjs(article.updatedAt).format('MMMM D, YYYY')}
          </p>
        </div>
        <ChevronRightIcon className="mt-1 ml-4 size-5 text-gray-400 transition-colors group-hover:text-gray-600" />
      </div>
    </Link>
  )
}

async function LegalDocuments({ locale }: { locale: string }) {
  // Always fetch English legal articles since they're only available in English
  const legalArticles = await generateLegalArticlesIndex('en')

  return (
    <Container className="mt-16 pb-24">
      <Subheading className="mb-8">Available Documents</Subheading>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">
        {legalArticles.map((article) => (
          <LegalDocumentCard
            key={article.slug}
            article={article}
            lang={locale}
          />
        ))}
      </div>

      {legalArticles.length === 0 && (
        <div className="py-12 text-center">
          <p className="text-gray-500">No legal documents available.</p>
        </div>
      )}
    </Container>
  )
}

function ImportantNotice() {
  return (
    <Container className="mt-16">
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-8">
        <h3 className="mb-4 text-lg font-semibold text-amber-900">
          Important Notice
        </h3>
        <div className="space-y-4 text-sm/6 text-amber-800">
          <p>
            <strong>Effective Date:</strong> All legal documents are effective
            as of December 20, 2024.
          </p>
          <p>
            <strong>Updates:</strong> We may update these documents from time to
            time. We will notify you of material changes via email or website
            announcement.
          </p>
          <p>
            <strong>Questions:</strong> If you have questions about any of these
            documents, please contact us at hello@hostjamstack.com.
          </p>
          <p>
            <strong>Language:</strong> These documents are provided in English
            only. In case of conflicts between translations, the English version
            prevails.
          </p>
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

  return (
    <main className="overflow-hidden">
      <GradientBackground />
      <Container>
        <Navbar />
      </Container>
      <Header lang={lang} />
      <CompanyInfo />
      <LegalDocuments locale={lang} />
      <ImportantNotice />
      <Footer />
    </main>
  )
}
