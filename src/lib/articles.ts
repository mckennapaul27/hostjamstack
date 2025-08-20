import fs from 'fs'
import path from 'path'

export interface ArticleAuthor {
  name: string
  bio?: string
}

export interface ArticleCategory {
  name: string
  slug: string
  description?: string
}

export interface ArticleTag {
  name: string
  slug: string
}

export interface Article {
  title: string
  description: string
  slug: string
  publishedAt: string
  updatedAt: string
  status: string
  category: ArticleCategory
  tags: ArticleTag[]
  author: ArticleAuthor
  featured: boolean
  readingTime: string
  wordCount: number
  language: string
  excerpt?: string
}

export interface ArticleWithContent extends Article {
  content: string
}

function getArticlesPath(locale: string): string {
  return path.join(process.cwd(), 'articles', locale)
}

function readArticleConfig(configPath: string): Article | null {
  try {
    const configContent = fs.readFileSync(configPath, 'utf-8')
    const config = JSON.parse(configContent)

    // Create excerpt from description if not provided
    const excerpt = config.excerpt || config.description

    return {
      title: config.title,
      description: config.description,
      slug: config.slug,
      publishedAt: config.publishedAt,
      updatedAt: config.updatedAt,
      status: config.status || 'published',
      category: config.category,
      tags: config.tags || [],
      author: {
        name: config.author?.name || config.author || 'HostJamstack Team',
        bio: config.author?.bio,
      },
      featured: config.featured || false,
      readingTime: config.readingTime || '5 min read',
      wordCount: config.wordCount || 0,
      language: config.language || 'en',
      excerpt,
    }
  } catch (error) {
    console.error(`Error reading article config ${configPath}:`, error)
    return null
  }
}

export async function generateArticlesIndex(
  locale: string,
): Promise<Article[]> {
  const articlesPath = getArticlesPath(locale)

  if (!fs.existsSync(articlesPath)) {
    return []
  }

  const files = fs.readdirSync(articlesPath)
  const articles: Article[] = []

  for (const file of files) {
    if (file.endsWith('.json') && file !== 'index.json') {
      const configPath = path.join(articlesPath, file)
      const article = readArticleConfig(configPath)

      if (article && article.status === 'published') {
        articles.push(article)
      }
    }
  }

  // Sort by publishedAt date (newest first)
  articles.sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
  )

  return articles
}

export async function getArticles(
  offset: number = 0,
  limit: number = 10,
  category?: string,
  locale: string = 'en',
): Promise<{ data: Article[]; total: number }> {
  const allArticles = await generateArticlesIndex(locale)

  let filteredArticles = allArticles

  if (category) {
    filteredArticles = allArticles.filter(
      (article) => article.category.slug === category,
    )
  }

  const paginatedArticles = filteredArticles.slice(offset, offset + limit)

  return {
    data: paginatedArticles,
    total: filteredArticles.length,
  }
}

export async function getFeaturedArticles(
  limit: number = 3,
  locale: string = 'en',
): Promise<{ data: Article[] }> {
  const allArticles = await generateArticlesIndex(locale)
  const featuredArticles = allArticles
    .filter((article) => article.featured)
    .slice(0, limit)

  return { data: featuredArticles }
}

export async function getArticlesCount(
  category?: string,
  locale: string = 'en',
): Promise<{ data: number }> {
  const allArticles = await generateArticlesIndex(locale)

  let count = allArticles.length

  if (category) {
    count = allArticles.filter(
      (article) => article.category.slug === category,
    ).length
  }

  return { data: count }
}

export async function getCategories(
  locale: string = 'en',
): Promise<{ data: ArticleCategory[] }> {
  const allArticles = await generateArticlesIndex(locale)
  const categoriesMap = new Map<string, ArticleCategory>()

  allArticles.forEach((article) => {
    if (!categoriesMap.has(article.category.slug)) {
      categoriesMap.set(article.category.slug, article.category)
    }
  })

  const categories = Array.from(categoriesMap.values())

  // Sort categories alphabetically
  categories.sort((a, b) => a.name.localeCompare(b.name))

  return { data: categories }
}

export async function getArticleBySlug(
  slug: string,
  locale: string = 'en',
): Promise<ArticleWithContent | null> {
  const articlesPath = getArticlesPath(locale)
  const configPath = path.join(articlesPath, `${slug}.json`)
  const mdxPath = path.join(articlesPath, `${slug}.mdx`)

  if (!fs.existsSync(configPath) || !fs.existsSync(mdxPath)) {
    return null
  }

  const article = readArticleConfig(configPath)
  if (!article) {
    return null
  }

  const content = fs.readFileSync(mdxPath, 'utf-8')

  return {
    ...article,
    content,
  }
}

// Utility function to update the index file (optional, for build-time generation)
export async function saveArticlesIndex(locale: string): Promise<void> {
  const articles = await generateArticlesIndex(locale)
  const indexPath = path.join(getArticlesPath(locale), 'index.json')

  fs.writeFileSync(indexPath, JSON.stringify(articles, null, 2))
}
