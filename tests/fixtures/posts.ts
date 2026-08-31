import type { PostSource } from '@/posts/parsePosts'

function source(front: string, body: string): string {
  return `---\n${front}\n---\n\n${body}`
}

export const newerPost: PostSource = {
  slug: 'the-newer-one',
  source: source(
    [
      'title: The Newer One',
      'date: 2026-08-01',
      'category: Notes',
      'description: Written second.',
    ].join('\n'),
    'Body of the newer post.'
  ),
}

export const olderPost: PostSource = {
  slug: 'the-older-one',
  source: source(
    [
      'title: The Older One',
      'date: 2026-01-15',
      'category: Notes',
      'description: Written first.',
    ].join('\n'),
    'Body of the older post.'
  ),
}

export const draftPost: PostSource = {
  slug: 'not-ready',
  source: source(
    [
      'title: Not Ready',
      'date: 2026-09-01',
      'category: Notes',
      'description: Still in progress.',
      'draft: true',
    ].join('\n'),
    'Half a thought.'
  ),
}

/** A post whose body is long enough to take more than a minute to read. */
export const longPost: PostSource = {
  slug: 'the-long-one',
  source: source(
    [
      'title: The Long One',
      'date: 2026-05-01',
      'category: Notes',
      'description: Goes on a bit.',
    ].join('\n'),
    Array.from({ length: 900 }, (_, i) => `word${i}`).join(' ')
  ),
}

export function manyPosts(count: number): PostSource[] {
  return Array.from({ length: count }, (_, i) => ({
    slug: `post-${i + 1}`,
    source: source(
      [
        `title: Post ${i + 1}`,
        // Later index means later date, so index 0 is the oldest.
        `date: 2026-01-${String(i + 1).padStart(2, '0')}`,
        'category: Notes',
        `description: Number ${i + 1}.`,
      ].join('\n'),
      'A short body.'
    ),
  }))
}
