import fs from 'fs'
import path from 'path'

export interface LegalArticle {
  title: string
  description: string
  slug: string
  publishedAt: string
  updatedAt: string
  language: string
  category: string
}

export interface LegalArticleWithContent extends LegalArticle {
  content: string
}

function getLegalArticlesPath(locale: string): string {
  console.log('locale', locale)
  // Always use English for legal articles regardless of requested locale
  return path.join(process.cwd(), 'legal-articles', 'en')
}

function readLegalArticleConfig(configPath: string): LegalArticle | null {
  try {
    const configContent = fs.readFileSync(configPath, 'utf-8')
    const config = JSON.parse(configContent)

    return {
      title: config.title,
      description: config.description,
      slug: config.slug,
      publishedAt: config.publishedAt,
      updatedAt: config.updatedAt,
      language: config.language || 'en',
      category: config.category || 'legal',
    }
  } catch (error) {
    console.error(`Error reading legal article config ${configPath}:`, error)
    return null
  }
}

export async function generateLegalArticlesIndex(
  locale: string,
): Promise<LegalArticle[]> {
  console.log('generateLegalArticlesIndex', locale)
  // Always fetch English legal articles regardless of requested locale
  const legalArticlesPath = getLegalArticlesPath('en')

  if (!fs.existsSync(legalArticlesPath)) {
    return []
  }

  const files = fs.readdirSync(legalArticlesPath)
  const legalArticles: LegalArticle[] = []

  for (const file of files) {
    if (file.endsWith('.json')) {
      const configPath = path.join(legalArticlesPath, file)
      const legalArticle = readLegalArticleConfig(configPath)

      if (legalArticle) {
        legalArticles.push(legalArticle)
      }
    }
  }

  // Sort by slug for consistent ordering
  legalArticles.sort((a, b) => a.slug.localeCompare(b.slug))

  return legalArticles
}

export async function getLegalArticleBySlug(
  slug: string,
  locale: string = 'en',
): Promise<LegalArticleWithContent | null> {
  console.log('getLegalArticleBySlug', slug, locale)
  // Always fetch English legal articles regardless of requested locale
  const legalArticlesPath = getLegalArticlesPath('en')
  const configPath = path.join(legalArticlesPath, `${slug}.json`)
  const mdxPath = path.join(legalArticlesPath, `${slug}.mdx`)

  if (!fs.existsSync(configPath) || !fs.existsSync(mdxPath)) {
    return null
  }

  const legalArticle = readLegalArticleConfig(configPath)
  if (!legalArticle) {
    return null
  }

  const content = fs.readFileSync(mdxPath, 'utf-8')

  return {
    ...legalArticle,
    content,
  }
}
