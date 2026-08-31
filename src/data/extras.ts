export interface Hobby {
  name: string
  /** Flavour stats, in the game's vocabulary rather than a real measure. */
  stat: string
  note: string
}

export const hobbies: readonly Hobby[] = [
  {
    name: 'SKATING',
    stat: 'ATK 5 · DEF 2',
    note: '* Bruises everywhere. Falls a lot. Gets up more.',
  },
  {
    name: 'GAMING',
    stat: 'ATK 7 · DEF 3',
    note: '* Undertale, obviously. Pacifist run first — then the other one.',
  },
  {
    name: 'COOKING',
    stat: 'HP +8',
    note: '* Mostly successful. Recovers 8 HP. Sometimes 0.',
  },
]

export const likes: readonly string[] = [
  '* Espresso. Main ingredient for power up potions.',
  '* Cold weather. Snowboarding, a plus.',
  '* Music. It fills you with determination.',
]

export const dislikes: readonly string[] = [
  "* Meetings that should've been docs",
  '* Hot weather',
  "* Losing (who doesn't?)",
  '* Mushrooms',
]
