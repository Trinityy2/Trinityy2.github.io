/**
 * Personal content lives in typed TypeScript modules bundled at build time.
 * There is no CMS and no runtime fetching. See #72's Data layer decisions.
 *
 * Everything here is real and carries across from the design prototype as-is.
 */
export interface ProfileStats {
  /** The game's vocabulary for a biography: level, health, and a start year. */
  lv: string
  hp: string
  since: string
}

export interface Profile {
  name: string
  handle: string
  role: string
  location: string
  stats: ProfileStats
  /** The line the dialogue box types out, one character at a time. */
  bio: string
  /** The asides beneath the dialogue box. */
  notes: readonly string[]
}

export const profile: Profile = {
  name: 'TOMO SUZUKI',
  handle: 'TRINITYY',
  role: 'Fullstack developer',
  location: 'Singapore',
  stats: {
    lv: '31',
    hp: '20 / 20',
    since: '2019',
  },
  bio: '* A fullstack developer who fell down here in 2019. Armed with a keyboard, mostly harmless.',
  notes: [
    '* Currently at Red Dot AI — backend, frontend, and everything wired in between.',
    '* Based in Singapore. Available for the occasional side quest.',
  ],
}
