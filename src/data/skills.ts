export interface Skill {
  name: string
  years: number
  /**
   * How full the bar is, 0–100. Authored rather than derived: a bar is a
   * claim about depth, and depth does not always track years.
   */
  weight: number
}

export interface SkillGroup {
  name: string
  skills: readonly Skill[]
}

export interface SkillCallout {
  label: string
  value: string
  note: string
}

/**
 * Three years is where passing familiarity becomes depth. Below it, an entry
 * renders muted so a reader can tell the two apart at a glance.
 */
export const DEEP_EXPERIENCE_YEARS = 3

/** Whether an entry counts as depth rather than passing familiarity. */
export function isDeep(skill: Skill): boolean {
  return skill.years >= DEEP_EXPERIENCE_YEARS
}

export function yearsLabel(skill: Skill): string {
  return `${skill.years} ${skill.years === 1 ? 'YR' : 'YRS'}`
}

export const skillGroups: readonly SkillGroup[] = [
  {
    name: 'LANGUAGES',
    skills: [
      { name: 'Python', years: 7, weight: 70 },
      { name: 'TypeScript', years: 7, weight: 70 },
      { name: 'Golang', years: 2, weight: 20 },
    ],
  },
  {
    name: 'FRAMEWORKS',
    skills: [
      { name: 'FastAPI', years: 4, weight: 40 },
      { name: 'Vue.js', years: 4, weight: 40 },
      { name: 'Next.js', years: 1, weight: 10 },
      { name: 'React Native', years: 1, weight: 10 },
    ],
  },
  {
    name: 'INFRASTRUCTURE',
    skills: [
      { name: 'Git', years: 10, weight: 100 },
      { name: 'CI/CD pipelines', years: 7, weight: 70 },
      { name: 'Databases', years: 7, weight: 70 },
      { name: 'Containers', years: 7, weight: 70 },
      { name: 'Orchestrators', years: 7, weight: 70 },
      { name: 'Cloud platforms', years: 6, weight: 60 },
    ],
  },
]

export const skillsPreamble = '* Numbers are years of use, not ego.'

export const skillCallout: SkillCallout = {
  label: 'PREFERRED AI',
  value: 'Claude & Claude Code',
  note: '* Reads the codebase before it opens its mouth.',
}
