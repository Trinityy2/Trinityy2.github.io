/**
 * Personal content lives in typed TypeScript modules bundled at build time.
 * There is no CMS and no runtime fetching. See #72's Data layer decisions.
 */
export interface Profile {
  name: string
  handle: string
  role: string
  location: string
}

export const profile: Profile = {
  name: 'TOMO SUZUKI',
  handle: 'TRINITYY',
  role: 'Fullstack developer',
  location: 'Singapore',
}
