export interface Experience {
  title: string
  organisation: string
  dates: string
  /**
   * Authored per entry, never derived from position. Deriving it would
   * produce nonsense the moment an entry is inserted mid-list.
   */
  level: number
  responsibilities: readonly string[]
  tags: readonly string[]
  /** Marks an entry as awaiting real history. Rendered unmistakably. */
  placeholder?: boolean
}

/**
 * PLACEHOLDER CAREER HISTORY.
 *
 * Every entry below is a shape, not a fact. They are here so the carousel has
 * something to carry and so the site does not look unfinished; they are not
 * anybody's real roles, and each renders with a visible marker saying so.
 *
 * Replace them with real titles, organisations, dates, responsibilities, tags
 * and level values, and drop the `placeholder` flag as you go. The carousel,
 * its dots and its counter all derive from this array's length, so adding or
 * removing entries needs no other edit.
 */
export const experience: readonly Experience[] = [
  {
    title: '[CURRENT ROLE]',
    organisation: '[Organisation]',
    dates: '[Year] — Now',
    level: 12,
    responsibilities: [
      '* [What you own here, in one line.]',
      '* [Something shipped, with the outcome.]',
      '* [Something you changed about how the team works.]',
    ],
    tags: ['[Tech]', '[Tech]', '[Tech]'],
    placeholder: true,
  },
  {
    title: '[PREVIOUS ROLE]',
    organisation: '[Organisation]',
    dates: '[Year] — [Year]',
    level: 8,
    responsibilities: [
      '* [What the job actually was.]',
      '* [The piece of work worth remembering.]',
    ],
    tags: ['[Tech]', '[Tech]'],
    placeholder: true,
  },
  {
    title: '[FIRST ROLE]',
    organisation: '[Organisation]',
    dates: '[Year] — [Year]',
    level: 4,
    responsibilities: ['* [Where it started, and what it taught you.]'],
    tags: ['[Tech]'],
    placeholder: true,
  },
]
