import { parse as parseYaml } from 'yaml'

/**
 * A post as it arrives: a slug taken from the filename, and the file's raw
 * text. Kept separate from the parsed result so that the source of these —
 * the bundler's glob in production, fixtures in tests — is somebody else's
 * problem. See `parsePosts`.
 */
export interface PostSource {
  slug: string
  source: string
}

export interface Post {
  slug: string
  title: string
  date: string
  category: string
  description: string
  /** The Markdown body, frontmatter removed. */
  body: string
  /** Computed from the body, never authored — an authored estimate goes
   * stale the moment the post is edited. */
  readingMinutes: number
}

const FRONTMATTER_FENCE = '---'
const REQUIRED_FIELDS = ['title', 'date', 'category', 'description'] as const

/** A comfortable prose reading pace, in words per minute. */
const WORDS_PER_MINUTE = 200

interface Frontmatter {
  title: string
  date: string
  category: string
  description: string
  draft?: boolean
}

/**
 * Split the frontmatter block off the front of a file.
 *
 * Deliberately a small hand-rolled split rather than a general-purpose
 * frontmatter library: the one used previously relies on `eval` and emitted a
 * permanent build warning.
 */
function splitFrontmatter(slug: string, source: string): { front: string; body: string } {
  const text = source.trimStart()

  if (!text.startsWith(FRONTMATTER_FENCE)) {
    throw new Error(`Post "${slug}" has no frontmatter block.`)
  }

  const end = text.indexOf(`\n${FRONTMATTER_FENCE}`, FRONTMATTER_FENCE.length)

  if (end === -1) {
    throw new Error(`Post "${slug}" has an unterminated frontmatter block.`)
  }

  return {
    front: text.slice(FRONTMATTER_FENCE.length, end),
    body: text.slice(end + FRONTMATTER_FENCE.length + 1).replace(/^\s*\n/, ''),
  }
}

function readFrontmatter(slug: string, front: string): Frontmatter {
  const parsed: unknown = parseYaml(front)

  if (parsed === null || typeof parsed !== 'object') {
    throw new Error(`Post "${slug}" has frontmatter that is not a mapping.`)
  }

  const fields = parsed as Record<string, unknown>
  const missing = REQUIRED_FIELDS.filter((field) => typeof fields[field] !== 'string')

  // Loudly, and naming the file, rather than rendering a blank post.
  if (missing.length > 0) {
    throw new Error(`Post "${slug}" is missing required frontmatter: ${missing.join(', ')}.`)
  }

  return parsed as Frontmatter
}

function readingMinutes(body: string): number {
  const words = body.split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.round(words / WORDS_PER_MINUTE))
}

/**
 * Turn raw Markdown files into typed posts: newest first, drafts dropped.
 *
 * **The source is a parameter.** This module never reaches for the bundler's
 * glob itself — that is what makes fixture posts possible, and with the glob
 * inlined the project's single test seam would be unreachable.
 *
 * Drafts are removed here rather than at each call site, so "a draft appears
 * nowhere" is guaranteed in one place instead of being remembered in several.
 */
export function parsePosts(sources: readonly PostSource[]): Post[] {
  return sources
    .map(({ slug, source }) => {
      const { front, body } = splitFrontmatter(slug, source)
      const fields = readFrontmatter(slug, front)

      return {
        slug,
        title: fields.title,
        date: fields.date,
        category: fields.category,
        description: fields.description,
        draft: fields.draft === true,
        body,
        readingMinutes: readingMinutes(body),
      }
    })
    .filter((post) => !post.draft)
    .map(({ draft: _draft, ...post }) => post)
    .sort((a, b) => b.date.localeCompare(a.date))
}
