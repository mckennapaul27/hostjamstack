import { initTranslations } from '@/app/i18n'
import { Button } from '@/components/button'
import { Container } from '@/components/container'
import { Footer } from '@/components/footer'
import { GradientBackground } from '@/components/gradient'
import { Link } from '@/components/link'
import { Navbar } from '@/components/navbar'
import { Heading, Subheading } from '@/components/text'
import {
  generateArticlesIndex,
  getArticleBySlug,
  type ArticleWithContent,
} from '@/lib/articles'
import { ChevronLeftIcon } from '@heroicons/react/16/solid'
import dayjs from 'dayjs'
import 'dayjs/locale/de'
import 'dayjs/locale/es'
import 'dayjs/locale/fr'
import 'dayjs/locale/pl'
import type { Metadata } from 'next'
import { MDXRemote } from 'next-mdx-remote/rsc'
import { notFound } from 'next/navigation'

// Helper function to set dayjs locale
function setDayjsLocale(locale: string) {
  switch (locale) {
    case 'es':
      dayjs.locale('es')
      break
    case 'fr':
      dayjs.locale('fr')
      break
    case 'de':
      dayjs.locale('de')
      break
    case 'pl':
      dayjs.locale('pl')
      break
    default:
      dayjs.locale('en')
  }
}

// MDX components for styling
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
  // Generate params for all locales and all articles
  const locales = ['en'] // Add more locales as needed
  const params: { lang: string; slug: string }[] = []

  for (const locale of locales) {
    const articles = await generateArticlesIndex(locale)
    for (const article of articles) {
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
  const post = await getArticleBySlug(slug, lang)

  return post
    ? {
        title: post.title,
        description: post.excerpt || post.description,
        openGraph: {
          title: post.title,
          description: post.excerpt || post.description,
          type: 'article',
          publishedTime: post.publishedAt,
          modifiedTime: post.updatedAt,
          authors: [post.author.name],
        },
        twitter: {
          card: 'summary_large_image',
          title: post.title,
          description: post.excerpt || post.description,
        },
      }
    : {}
}

function extractMDXContent(content: string): string {
  // Remove frontmatter from MDX content
  const frontmatterRegex = /^---[\s\S]*?\n---\s*\n/
  return content.replace(frontmatterRegex, '').trim()
}

export default async function BlogPost({
  params,
}: {
  params: Promise<{ slug: string; lang: string }>
}) {
  const { slug, lang } = await params

  // Initialize translations for blog namespace
  const { t } = await initTranslations(lang, ['blog'])

  // Set dayjs locale for date formatting
  setDayjsLocale(lang)

  const post: ArticleWithContent | null = await getArticleBySlug(slug, lang)

  if (!post) notFound()

  // Extract MDX content without frontmatter
  const mdxContent = extractMDXContent(post.content)

  return (
    <main className="overflow-hidden">
      <GradientBackground />
      <Container>
        <Navbar locale={lang} />
        <Subheading className="mt-16">
          {dayjs(post.publishedAt).format('dddd, MMMM D, YYYY')}
        </Subheading>
        <Heading as="h1" className="mt-2">
          {post.title}
        </Heading>
        <div className="mt-16 grid grid-cols-1 gap-8 pb-24 lg:grid-cols-[15rem_1fr] xl:grid-cols-[15rem_1fr_15rem]">
          <div className="flex flex-wrap items-center gap-8 max-lg:justify-between lg:flex-col lg:items-start">
            <div className="flex items-center gap-3">
              <div className="text-sm/5 text-gray-700">{post.author.name}</div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link
                href={`/${lang}/blog?category=${post.category.slug}`}
                className="rounded-full border border-dotted border-gray-300 bg-gray-50 px-2 text-sm/6 font-medium text-gray-500"
              >
                {post.category.name}
              </Link>
              {post.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag.slug}
                  className="rounded-full border border-dotted border-gray-300 bg-gray-50 px-2 text-sm/6 font-medium text-gray-500"
                >
                  {tag.name}
                </span>
              ))}
            </div>
          </div>
          <div className="text-gray-700">
            <div className="max-w-2xl xl:mx-auto">
              {/* Reading time and word count */}
              <div className="mb-8 flex items-center gap-4 text-sm text-gray-500">
                <span>{post.readingTime}</span>
                <span>•</span>
                <span>
                  {post.wordCount.toLocaleString()} {t('postDetail.words')}
                </span>
              </div>

              {/* MDX Content */}
              <div className="prose prose-lg max-w-none">
                <MDXRemote source={mdxContent} components={mdxComponents} />
              </div>

              <div className="mt-10">
                <Button variant="outline" href={`/${lang}/blog`}>
                  <ChevronLeftIcon className="size-4" />
                  {t('postDetail.backToBlog')}
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
