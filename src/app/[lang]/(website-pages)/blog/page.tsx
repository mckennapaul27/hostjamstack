import { Button } from '@/components/button'
import { Container } from '@/components/container'
import { Footer } from '@/components/footer'
import { GradientBackground } from '@/components/gradient'
import { Link } from '@/components/link'
import { Navbar } from '@/components/navbar'
import { Heading, Lead, Subheading } from '@/components/text'
import {
  getArticles,
  getArticlesCount,
  getCategories,
  getFeaturedArticles,
  type Article,
  type ArticleCategory,
} from '@/lib/articles'
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import {
  CheckIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronUpDownIcon,
} from '@heroicons/react/16/solid'
import { clsx } from 'clsx'
import dayjs from 'dayjs'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

export const metadata: Metadata = {
  title: 'Blog',
  description:
    'Stay informed with product updates, company news, and insights on how to deploy and host JAMstack applications safely and securely.',
}

const postsPerPage = 5

async function FeaturedPosts({ locale }: { locale: string }) {
  let { data: featuredPosts } = await getFeaturedArticles(3, locale)

  if (featuredPosts.length === 0) {
    return
  }

  return (
    <div className="mt-16 bg-linear-to-t from-gray-100 pb-14">
      <Container>
        <h2 className="text-2xl font-medium tracking-tight">Featured</h2>
        <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-3">
          {featuredPosts.map((post: Article) => (
            <div
              key={post.slug}
              className="relative flex flex-col rounded-3xl bg-white p-2 shadow-md ring-1 shadow-black/5 ring-black/5"
            >
              {/* Placeholder for main image - you can add this later if needed */}
              <div className="flex flex-1 flex-col p-8">
                <div className="text-sm/5 text-gray-700">
                  {dayjs(post.publishedAt).format('dddd, MMMM D, YYYY')}
                </div>
                <div className="mt-2 text-base/7 font-medium">
                  <Link href={`/blog/${post.slug}`}>
                    <span className="absolute inset-0" />
                    {post.title}
                  </Link>
                </div>
                <div className="mt-2 flex-1 text-sm/6 text-gray-500">
                  {post.excerpt}
                </div>
                <div className="mt-6 flex items-center gap-3">
                  <div className="text-sm/5 text-gray-700">
                    {post.author.name}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </div>
  )
}

async function Categories({
  selected,
  locale,
}: {
  selected?: string
  locale: string
}) {
  let { data: categories } = await getCategories(locale)

  if (categories.length === 0) {
    return
  }

  return (
    <div className="flex flex-wrap items-center justify-between gap-2">
      <Menu>
        <MenuButton className="flex items-center justify-between gap-2 font-medium">
          {categories.find(({ slug }: ArticleCategory) => slug === selected)
            ?.name || 'All categories'}
          <ChevronUpDownIcon className="size-4 fill-gray-900" />
        </MenuButton>
        <MenuItems
          anchor="bottom start"
          className="min-w-40 rounded-lg bg-white p-1 shadow-lg ring-1 ring-gray-200 [--anchor-gap:6px] [--anchor-offset:-4px] [--anchor-padding:10px]"
        >
          <MenuItem>
            <Link
              href="/blog"
              data-selected={selected === undefined ? true : undefined}
              className="group grid grid-cols-[1rem_1fr] items-center gap-2 rounded-md px-2 py-1 data-focus:bg-gray-950/5"
            >
              <CheckIcon className="hidden size-4 group-data-selected:block" />
              <p className="col-start-2 text-sm/6">All categories</p>
            </Link>
          </MenuItem>
          {categories.map((category: ArticleCategory) => (
            <MenuItem key={category.slug}>
              <Link
                href={`/blog?category=${category.slug}`}
                data-selected={category.slug === selected ? true : undefined}
                className="group grid grid-cols-[16px_1fr] items-center gap-2 rounded-md px-2 py-1 data-focus:bg-gray-950/5"
              >
                <CheckIcon className="hidden size-4 group-data-selected:block" />
                <p className="col-start-2 text-sm/6">{category.name}</p>
              </Link>
            </MenuItem>
          ))}
        </MenuItems>
      </Menu>
      {/* <Button variant="outline" href="/blog/feed.xml" className="gap-1">
        <RssIcon className="size-4" />
        RSS Feed
      </Button> */}
    </div>
  )
}

async function Posts({
  page,
  category,
  locale,
}: {
  page: number
  category?: string
  locale: string
}) {
  let { data: posts } = await getArticles(
    (page - 1) * postsPerPage,
    page * postsPerPage,
    category,
    locale,
  )

  if (posts.length === 0 && (page > 1 || category)) {
    notFound()
  }

  if (posts.length === 0) {
    return <p className="mt-6 text-gray-500">No posts found.</p>
  }

  return (
    <div className="mt-6">
      {posts.map((post: Article) => (
        <div
          key={post.slug}
          className="relative grid grid-cols-1 border-b border-b-gray-100 py-10 first:border-t first:border-t-gray-200 max-sm:gap-3 sm:grid-cols-3"
        >
          <div>
            <div className="text-sm/5 max-sm:text-gray-700 sm:font-medium">
              {dayjs(post.publishedAt).format('dddd, MMMM D, YYYY')}
            </div>
            <div className="mt-2.5 flex items-center gap-3">
              <div className="text-sm/5 text-gray-700">{post.author.name}</div>
            </div>
          </div>
          <div className="sm:col-span-2 sm:max-w-2xl">
            <h2 className="text-sm/5 font-medium">{post.title}</h2>
            <p className="mt-3 text-sm/6 text-gray-500">{post.excerpt}</p>
            <div className="mt-4">
              <Link
                href={`/blog/${post.slug}`}
                className="flex items-center gap-1 text-sm/5 font-medium"
              >
                <span className="absolute inset-0" />
                Read more
                <ChevronRightIcon className="size-4 fill-gray-400" />
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

async function Pagination({
  page,
  category,
  locale,
}: {
  page: number
  category?: string
  locale: string
}) {
  function url(page: number) {
    let params = new URLSearchParams()

    if (category) params.set('category', category)
    if (page > 1) params.set('page', page.toString())

    return params.size !== 0 ? `/blog?${params.toString()}` : '/blog'
  }

  let totalPosts = (await getArticlesCount(category, locale)).data
  let hasPreviousPage = page - 1
  let previousPageUrl = hasPreviousPage ? url(page - 1) : undefined
  let hasNextPage = page * postsPerPage < totalPosts
  let nextPageUrl = hasNextPage ? url(page + 1) : undefined
  let pageCount = Math.ceil(totalPosts / postsPerPage)

  if (pageCount < 2) {
    return
  }

  return (
    <div className="mt-6 flex items-center justify-between gap-2">
      <Button
        variant="outline"
        href={previousPageUrl}
        disabled={!previousPageUrl}
      >
        <ChevronLeftIcon className="size-4" />
        Previous
      </Button>
      <div className="flex gap-2 max-sm:hidden">
        {Array.from({ length: pageCount }, (_, i) => (
          <Link
            key={i + 1}
            href={url(i + 1)}
            data-active={i + 1 === page ? true : undefined}
            className={clsx(
              'size-7 rounded-lg text-center text-sm/7 font-medium',
              'data-hover:bg-gray-100',
              'data-active:shadow-sm data-active:ring-1 data-active:ring-black/10',
              'data-active:data-hover:bg-gray-50',
            )}
          >
            {i + 1}
          </Link>
        ))}
      </div>
      <Button variant="outline" href={nextPageUrl} disabled={!nextPageUrl}>
        Next
        <ChevronRightIcon className="size-4" />
      </Button>
    </div>
  )
}

export default async function Blog({
  searchParams,
  params,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
  params: Promise<{ lang: string }>
}) {
  let searchParamsResolved = await searchParams
  let { lang } = await params
  let page =
    'page' in searchParamsResolved
      ? typeof searchParamsResolved.page === 'string' &&
        parseInt(searchParamsResolved.page) > 1
        ? parseInt(searchParamsResolved.page)
        : notFound()
      : 1

  let category =
    typeof searchParamsResolved.category === 'string'
      ? searchParamsResolved.category
      : undefined

  return (
    <main className="overflow-hidden">
      <GradientBackground />
      <Container>
        <Navbar />
        <Subheading className="mt-16">Blog</Subheading>
        <Heading as="h1" className="mt-2">
          What&apos;s happening at Host Jamstack.
        </Heading>
        <Lead className="mt-6 max-w-3xl">
          Stay informed with product updates, company news, and insights on how
          to deploy and host JAMstack applications safely and securely.
        </Lead>
      </Container>
      {page === 1 && !category && <FeaturedPosts locale={lang} />}
      <Container className="mt-16 pb-24">
        <Categories selected={category} locale={lang} />
        <Posts page={page} category={category} locale={lang} />
        <Pagination page={page} category={category} locale={lang} />
      </Container>
      <Footer />
    </main>
  )
}
