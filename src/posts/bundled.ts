import { parsePosts, type Post, type PostSource } from './parsePosts'

/**
 * The one place the bundler's glob is called.
 *
 * `parsePosts` deliberately does not do this itself — it takes its input as a
 * parameter so fixture posts can be supplied. Keeping the glob here is what
 * separates "where posts come from" from "what a post is".
 */
const files = import.meta.glob('./content/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>

const sources: PostSource[] = Object.entries(files).map(([path, source]) => ({
  // The filename is the slug, so the URL is controlled by naming the file.
  slug: path.replace(/^.*\//, '').replace(/\.md$/, ''),
  source,
}))

export const bundledPosts: readonly Post[] = parsePosts(sources)
