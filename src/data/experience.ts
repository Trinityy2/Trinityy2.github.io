export interface Experience {
  title: string
  organisation: string
  dates: string
  /**
   * Authored per entry, never derived from position. Deriving it would
   * produce nonsense the moment an entry is inserted mid-list.
   *
   * These are flavour, in the game's vocabulary rather than a real measure —
   * they climb with seniority and mean nothing outside the fiction.
   */
  level: number
  responsibilities: readonly string[]
  tags: readonly string[]
  /** Marks an entry as awaiting real history. Rendered unmistakably. */
  placeholder?: boolean
}

/**
 * Real career history, newest first, condensed from the CV.
 *
 * Kept deliberately terse: the carousel shows one encounter at a time and the
 * card is not a CV page. Each line is one thing done, in the site's voice.
 * The full detail lives in the CV; this is the version you read standing up.
 *
 * The carousel, its dots and its counter all derive from this array's length,
 * so adding or removing entries needs no other edit.
 */
export const experience: readonly Experience[] = [
  {
    title: 'SOFTWARE ENGINEER',
    organisation: 'Persol / GIC, Singapore',
    dates: 'Feb 2026 — Jul 2026',
    level: 14,
    responsibilities: [
      '* Built a modular end-to-end testing framework, AI-assisted, test-first throughout.',
      '* Wired CI/CD in GitHub Actions — custom workflows, self-hosted runners, event triggers.',
      '* Turned prompts into implementation plans and scaffolding, without letting the code rot.',
      '* Held scope and stakeholders together well enough to hit a contract deadline.',
    ],
    tags: ['GitHub Actions', 'TDD', 'E2E Testing', 'Context Engineering'],
  },
  {
    title: 'SOFTWARE DEVELOPER',
    organisation: 'Circles.Life, Singapore',
    dates: 'Jul 2024 — Oct 2025',
    level: 12,
    responsibilities: [
      '* Ran the sprints as scrum master. Commit-vs-delivery up 40%, velocity up 25%.',
      '* Built Golang microservices and React front-ends, designs through to components.',
      '* Extended the logging and telemetry, and watched Grafana for things going wrong.',
      '* Tuned Postgres and MongoDB — indexing, pagination, and schemas that made sense.',
    ],
    tags: ['Golang', 'TypeScript', 'React', 'Postgres', 'MongoDB', 'Grafana'],
  },
  {
    title: 'SOFTWARE DEVELOPER',
    organisation: 'FirstWave Cloud Technology, Australia',
    dates: 'Sep 2019 — Nov 2023',
    level: 9,
    responsibilities: [
      '* Automated onboarding with a Python microservice. 97% faster, and the platforms team stopped doing it by hand entirely.',
      '* Broke a synchronous monolith into async microservices with FastAPI and Docker.',
      '* Scripted CI/CD for services and databases with Ansible, Alembic and Bitbucket Pipelines.',
      '* Built AWS data pipelines with external vendors — EC2, S3, and IAM to keep the keys straight.',
    ],
    tags: ['Python', 'FastAPI', 'Docker', 'AWS', 'Ansible', 'MySQL'],
  },
  {
    title: 'TEACHING ASSOCIATE',
    organisation: 'Monash University, Australia',
    dates: 'Feb 2017 — Nov 2018',
    level: 4,
    responsibilities: [
      '* Ran weekly labs for students with wildly different amounts of code behind them.',
      '* Wrote the worksheets, slides and in-class tasks that made the hard parts land.',
      '* Mostly: listened first, then helped.',
    ],
    tags: ['Teaching', 'Python', 'Java'],
  },
  {
    title: 'BACHELOR OF INFORMATION TECHNOLOGY',
    organisation: 'Monash University, Australia',
    dates: 'Feb 2016 — Feb 2019',
    level: 1,
    responsibilities: [
      '* Final year: led a team building a French-learning site for Language Tub, in CakePHP.',
      '* Planned the work, wrote the documentation, shipped it. Distinction.',
    ],
    tags: ['CakePHP', 'Team Lead'],
  },
]
