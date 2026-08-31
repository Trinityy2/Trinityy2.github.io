import { inject, type InjectionKey } from 'vue'

import { experience as bundledExperience, type Experience } from '@/data/experience'
import { skillGroups as bundledSkillGroups, type SkillGroup } from '@/data/skills'
import { bundledPosts } from '@/posts/bundled'
import type { Post } from '@/posts/parsePosts'

/**
 * The content the app renders, as an injectable value.
 *
 * Production never overrides this — the defaults are the bundled data
 * modules. It exists so the app-seam test can drive the same components with
 * fixture content: the carousel's behaviour at one entry and at many is not
 * otherwise reachable, since the real array has a fixed length.
 *
 * This is the same reasoning that makes the post source a parameter rather
 * than an internal glob call (#72, Blog pipeline).
 */
export interface SiteContent {
  experience: readonly Experience[]
  skillGroups: readonly SkillGroup[]
  posts: readonly Post[]
}

export const SITE_CONTENT: InjectionKey<SiteContent> = Symbol('site-content')

/** The real, bundled content. Also the default when nothing is provided. */
export const bundledContent: SiteContent = {
  experience: bundledExperience,
  skillGroups: bundledSkillGroups,
  posts: bundledPosts,
}

export function useSiteContent(): SiteContent {
  return inject(SITE_CONTENT, bundledContent)
}
