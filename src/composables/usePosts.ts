import matter from 'gray-matter'
import { marked } from 'marked'
import type { Tokens } from 'marked'
import hljs from 'highlight.js'

export interface PostFrontmatter {
  title: string
  date: string
  tags: string[]
  description: string
  cover_image?: string
  featured?: boolean
  draft?: boolean
}

export interface Post {
  slug: string
  frontmatter: PostFrontmatter
  readingTime: number
}

export interface TocHeading {
  id: string
  text: string
  level: number
}

export interface PostWithContent extends Post {
  html: string
  headings: TocHeading[]
}

const rawModules = import.meta.glob('../content/posts/*.md', {
  query: '?raw',
  import: 'default',
}) as Record<string, () => Promise<string>>

function slugFromPath(path: string): string {
  return path.replace(/^.*\//, '').replace(/\.md$/, '')
}

function calcReadingTime(text: string): number {
  const words = text.trim().split(/\s+/).length
  return Math.max(1, Math.ceil(words / 200))
}

function headingId(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

let markedConfigured = false

function configureMarked() {
  if (markedConfigured) return
  markedConfigured = true

  marked.use({
    renderer: {
      code(token: Tokens.Code): string {
        const lang = token.lang ?? ''
        const text = token.text
        const validLang = lang && hljs.getLanguage(lang) ? lang : 'plaintext'
        const highlighted = hljs.highlight(text, { language: validLang }).value
        const encoded = encodeURIComponent(text)
        return [
          `<div class="code-block-wrapper relative group my-6">`,
          `<button class="copy-btn absolute top-3 right-3 z-10 text-xs px-2.5 py-1 rounded`,
          ` bg-slate-700 text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity`,
          ` hover:bg-slate-600" data-code="${encoded}">Copy</button>`,
          `<pre class="hljs !rounded-xl !mt-0 overflow-x-auto">`,
          `<code class="hljs language-${validLang}">${highlighted}</code>`,
          `</pre></div>`,
        ].join('')
      },
      heading(token: Tokens.Heading): string {
        const text = token.text
        const depth = token.depth
        const id = headingId(text)
        return [
          `<h${depth} id="${id}" class="group flex items-center gap-2">`,
          `<a href="#${id}" class="heading-anchor opacity-0 group-hover:opacity-50`,
          ` transition-opacity text-primary-500 hover:opacity-100 no-underline !text-primary-500">`,
          `#</a>${text}</h${depth}>`,
        ].join('')
      },
    },
  })
}

function extractHeadings(markdown: string): TocHeading[] {
  const headings: TocHeading[] = []
  const re = /^(#{2,4})\s+(.+)$/gm
  let m: RegExpExecArray | null
  while ((m = re.exec(markdown)) !== null) {
    const raw = m[2].trim()
    headings.push({ level: m[1].length, text: raw, id: headingId(raw) })
  }
  return headings
}

export async function getPosts(): Promise<Post[]> {
  const posts: Post[] = []

  for (const [path, loader] of Object.entries(rawModules)) {
    const raw = await loader()
    const { data, content } = matter(raw)
    const frontmatter = data as PostFrontmatter
    if (frontmatter.draft) continue
    posts.push({
      slug: slugFromPath(path),
      frontmatter,
      readingTime: calcReadingTime(content),
    })
  }

  posts.sort((a, b) => {
    if (a.frontmatter.featured && !b.frontmatter.featured) return -1
    if (!a.frontmatter.featured && b.frontmatter.featured) return 1
    return new Date(b.frontmatter.date).getTime() - new Date(a.frontmatter.date).getTime()
  })

  return posts
}

export async function getPost(slug: string): Promise<PostWithContent | null> {
  const entry = Object.entries(rawModules).find(([p]) => slugFromPath(p) === slug)
  if (!entry) return null

  configureMarked()

  const raw = await entry[1]()
  const { data, content } = matter(raw)
  const html = await marked.parse(content)

  return {
    slug,
    frontmatter: data as PostFrontmatter,
    readingTime: calcReadingTime(content),
    html,
    headings: extractHeadings(content),
  }
}
