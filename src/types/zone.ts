export const ZONES = ['about', 'work', 'blog'] as const

export type Zone = (typeof ZONES)[number]
