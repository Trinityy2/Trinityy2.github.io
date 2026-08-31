import type { Zone } from '@/types/zone'

export interface ZoneRoute {
  /** Drives the shell's `data-zone`, and so every colour in the zone. */
  zone: Zone
  path: string
  /** The header node's label. */
  label: string
  /** The zone's name, shown in the footer bar. */
  title: string
  /** The header tooltip's first line, shown on hover. */
  preview: string
  /** The header tooltip's second line. */
  previewMeta: string
}

/**
 * The three zones, in travel order.
 *
 * This array is the single source for both the routes and the header: the
 * router generates its routes from it, and the header derives node order,
 * labels and previews from it. Arrow-key travel is movement along this array,
 * which is why it does not wrap — index -1 and index 3 do not exist.
 */
export const zoneRoutes: readonly ZoneRoute[] = [
  {
    zone: 'about',
    path: '/',
    label: 'ABOUT',
    title: 'THE BEGINNINGS',
    preview: "* Who you're talking to.",
    previewMeta: 'FULLSTACK · SINGAPORE',
  },
  {
    zone: 'work',
    path: '/work',
    label: 'WORK',
    title: 'THE CHALLENGE',
    preview: '* Puzzles solved, things shipped.',
    // The prototype counted encounters here. The count is not invented until
    // the career data is real — see #77.
    previewMeta: 'ENCOUNTERS · CAREER HISTORY',
  },
  {
    zone: 'blog',
    path: '/blog',
    label: 'BLOG',
    title: 'THE THOUGHTS',
    preview: '* Longer thoughts, colder climate.',
    // Likewise the post count, which derives from the posts themselves — #78.
    previewMeta: 'POSTS · LONGER THOUGHTS',
  },
]
