import { initTranslations } from '@/app/i18n'
import { Button } from '@/components/button'
import { Container } from '@/components/container'
import { Footer } from '@/components/footer'
import { GradientBackground } from '@/components/gradient'
import { Link } from '@/components/link'
import { Navbar } from '@/components/navbar'
import { Heading, Subheading } from '@/components/text'
import {
  generateLegalArticlesIndex,
  getLegalArticleBySlug,
  type LegalArticleWithContent,
} from '@/lib/legal-articles'
import { ChevronLeftIcon } from '@heroicons/react/16/solid'
import dayjs from 'dayjs'
import type { Metadata } from 'next'
import { MDXRemote } from 'next-mdx-remote/rsc'
import { notFound } from 'next/navigation'

// MDX components for styling (same as blog)
const mdxComponents = {
  h1: ({ children }: { children: React.ReactNode }) => (
    <h1 className="mt-12 mb-10 text-3xl/8 font-medium tracking-tight text-gray-950 first:mt-0 last:mb-0">
      {children}
    </h1>
  ),
  h2: ({ children }: { children: React.ReactNode }) => (
    <h2 className="mt-12 mb-10 text-2xl/8 font-medium tracking-tight text-gray-950 first:mt-0 last:mb-0">
      {children}
    </h2>
  ),
  h3: ({ children }: { children: React.ReactNode }) => (
    <h3 className="mt-12 mb-10 text-xl/8 font-medium tracking-tight text-gray-950 first:mt-0 last:mb-0">
      {children}
    </h3>
  ),
  p: ({ children }: { children: React.ReactNode }) => (
    <p className="my-10 text-base/8 first:mt-0 last:mb-0">{children}</p>
  ),
  blockquote: ({ children }: { children: React.ReactNode }) => (
    <blockquote className="my-10 border-l-2 border-l-gray-300 pl-6 text-base/8 text-gray-950 first:mt-0 last:mb-0">
      {children}
    </blockquote>
  ),
  ul: ({ children }: { children: React.ReactNode }) => (
    <ul className="my-6 list-disc pl-4 text-base/8 marker:text-gray-400">
      {children}
    </ul>
  ),
  ol: ({ children }: { children: React.ReactNode }) => (
    <ol className="my-6 list-decimal pl-4 text-base/8 marker:text-gray-400">
      {children}
    </ol>
  ),
  li: ({ children }: { children: React.ReactNode }) => (
    <li className="my-2 pl-2">{children}</li>
  ),
  strong: ({ children }: { children: React.ReactNode }) => (
    <strong className="font-semibold text-gray-950">{children}</strong>
  ),
  code: ({
    children,
    className,
  }: {
    children: React.ReactNode
    className?: string
  }) => {
    // Check if this is inline code or a code block
    const isCodeBlock = className?.includes('language-') || false

    if (isCodeBlock) {
      // This is a code block (```language), render as pre
      return (
        <pre className="my-8 overflow-x-auto rounded-lg bg-gray-950 p-6 text-sm leading-relaxed">
          <code className="font-mono text-gray-100">{children}</code>
        </pre>
      )
    }

    // This is inline code
    return (
      <code className="mx-1 rounded bg-gray-100 px-1.5 py-0.5 font-mono text-sm text-gray-950">
        {children}
      </code>
    )
  },
  pre: ({ children }: { children: React.ReactNode }) => (
    <pre className="my-8 overflow-x-auto rounded-lg bg-gray-950 p-6 text-sm leading-relaxed">
      <code className="font-mono text-gray-100">{children}</code>
    </pre>
  ),
  a: ({ href, children }: { href?: string; children: React.ReactNode }) => (
    <Link
      href={href || '#'}
      className="font-medium text-gray-950 underline decoration-gray-400 underline-offset-4 data-hover:decoration-gray-600"
    >
      {children}
    </Link>
  ),
  hr: () => <hr className="my-8 border-t border-gray-200" />,
  img: ({ src, alt }: { src?: string; alt?: string }) => (
    <img src={src} alt={alt || ''} className="my-8 w-full rounded-2xl" />
  ),
}

export async function generateStaticParams() {
  // Generate params for all supported locales and their respective legal articles
  const locales = ['en', 'es', 'de', 'fr', 'pl'] // All supported locales
  const params: { lang: string; slug: string }[] = []

  // Get legal articles for each locale (with fallback to English)
  for (const locale of locales) {
    const legalArticles = await generateLegalArticlesIndex(locale)

    for (const article of legalArticles) {
      params.push({
        lang: locale,
        slug: article.slug,
      })
    }
  }

  return params
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; lang: string }>
}): Promise<Metadata> {
  const { slug, lang } = await params
  // Fetch localized version with fallback to English
  const legalArticle = await getLegalArticleBySlug(slug, lang)

  return legalArticle
    ? {
        title: `${legalArticle.title} | HostJamstack`,
        description: legalArticle.description,
        openGraph: {
          title: `${legalArticle.title} | HostJamstack`,
          description: legalArticle.description,
          type: 'article',
          publishedTime: legalArticle.publishedAt,
          modifiedTime: legalArticle.updatedAt,
        },
        twitter: {
          card: 'summary_large_image',
          title: `${legalArticle.title} | HostJamstack`,
          description: legalArticle.description,
        },
      }
    : {}
}

function extractMDXContent(content: string): string {
  // Remove frontmatter from MDX content if present
  const frontmatterRegex = /^---[\s\S]*?\n---\s*\n/
  return content.replace(frontmatterRegex, '').trim()
}

export default async function LegalPage({
  params,
}: {
  params: Promise<{ slug: string; lang: string }>
}) {
  const { slug, lang } = await params

  // Initialize translations for legal namespace
  const { t } = await initTranslations(lang, ['legal'])

  // Fetch localized version with fallback to English
  const legalArticle: LegalArticleWithContent | null =
    await getLegalArticleBySlug(slug, lang)

  if (!legalArticle) notFound()

  // Extract MDX content without frontmatter
  const mdxContent = extractMDXContent(legalArticle.content)

  return (
    <main className="overflow-hidden">
      <GradientBackground />
      <Container>
        <Navbar locale={lang} />
        <Subheading className="mt-16">
          {t('documentDetail.breadcrumb')}
        </Subheading>
        <Heading as="h1" className="mt-2">
          {legalArticle.title}
        </Heading>
        <div className="mt-16 grid grid-cols-1 gap-8 pb-24">
          <div className="flex flex-wrap items-center gap-8 max-lg:justify-between">
            <div className="flex items-center gap-3">
              <div className="text-sm/5 text-gray-700">
                {t('documentDetail.lastUpdated')}{' '}
                {dayjs(legalArticle.updatedAt).format('MMMM D, YYYY')}
              </div>
            </div>
            {legalArticle.language !== lang && (
              <div className="rounded-full bg-amber-50 px-3 py-1 text-sm/5 text-amber-600">
                {t('documentDetail.fallbackToEnglish')}
              </div>
            )}
          </div>
          <div className="text-gray-700">
            <div className="max-w-4xl">
              {/* Company Notice */}
              <div className="mb-12 rounded-lg bg-gray-50 p-6 text-sm/6">
                <p className="mb-2 font-medium text-gray-950">
                  {t('documentDetail.companyNotice.title')}
                </p>
                <p className="text-gray-600">
                  {t('documentDetail.companyNotice.text')}
                </p>
              </div>

              {/* MDX Content */}
              <div className="prose prose-lg max-w-none">
                <MDXRemote source={mdxContent} components={mdxComponents} />
              </div>

              <div className="mt-16 border-t border-gray-200 pt-8">
                <Button variant="outline" href={`/${lang}/legal`}>
                  <ChevronLeftIcon className="size-4" />
                  {t('documentDetail.backToDocuments')}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Container>
      <Footer locale={lang} />
    </main>
  )
}
