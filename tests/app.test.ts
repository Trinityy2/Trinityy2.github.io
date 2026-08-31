import { flushPromises } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { parsePosts } from '@/posts/parsePosts'

import { draftPost, longPost, manyPosts, newerPost, olderPost } from './fixtures/posts'
import { flushRouter, mountApp } from './helpers/mountApp'

describe('the About zone', () => {
  it('renders the profile name at the root path', async () => {
    const app = await mountApp('/')

    expect(app.text()).toContain('TOMO SUZUKI')
  })
})

describe('travelling to a zone by URL', () => {
  it('renders the Work zone and applies its palette', async () => {
    const app = await mountApp('/work')

    expect(app.find('[data-zone]').attributes('data-zone')).toBe('work')
  })

  it('marks the travelled-to node as the current one in the header', async () => {
    const app = await mountApp('/work')

    expect(app.find('nav a[aria-current="page"]').text()).toContain('WORK')
  })
})

describe('the header preview', () => {
  it('shows what is at a node while hovering it, and hides it on leaving', async () => {
    const app = await mountApp('/')
    const workNode = app.findAll('nav a')[1]

    expect(app.text()).not.toContain('Puzzles solved')

    await workNode.trigger('mouseenter')
    expect(app.text()).toContain('Puzzles solved')

    await workNode.trigger('mouseleave')
    expect(app.text()).not.toContain('Puzzles solved')
  })
})

function press(key: string) {
  window.dispatchEvent(new KeyboardEvent('keydown', { key }))
}

describe('arrow-key travel', () => {
  it('moves forward through the zones in order', async () => {
    const app = await mountApp('/')

    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }))
    await flushRouter(app)

    expect(app.find('[data-zone]').attributes('data-zone')).toBe('work')
  })

  it('moves back through the zones in order', async () => {
    const app = await mountApp('/blog')

    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft' }))
    await flushRouter(app)

    expect(app.find('[data-zone]').attributes('data-zone')).toBe('work')
  })
})

describe('arrow-key travel at the ends of the route', () => {
  it('stops dead at the last zone, adding no history entry', async () => {
    const app = await mountApp('/work')

    press('ArrowRight')
    await flushRouter(app)
    expect(app.find('[data-zone]').attributes('data-zone')).toBe('blog')

    // Two presses past the end. Were either to wrap or to re-push, the back
    // below would land somewhere other than where we actually came from.
    press('ArrowRight')
    await flushRouter(app)
    press('ArrowRight')
    await flushRouter(app)
    expect(app.find('[data-zone]').attributes('data-zone')).toBe('blog')

    app.vm.$router.back()
    await flushRouter(app)
    expect(app.find('[data-zone]').attributes('data-zone')).toBe('work')
  })

  it('stops dead at the first zone, adding no history entry', async () => {
    const app = await mountApp('/work')

    press('ArrowLeft')
    await flushRouter(app)
    expect(app.find('[data-zone]').attributes('data-zone')).toBe('about')

    press('ArrowLeft')
    await flushRouter(app)
    press('ArrowLeft')
    await flushRouter(app)
    expect(app.find('[data-zone]').attributes('data-zone')).toBe('about')

    app.vm.$router.back()
    await flushRouter(app)
    expect(app.find('[data-zone]').attributes('data-zone')).toBe('work')
  })
})

describe('an unknown path', () => {
  it('lands on the root rather than a dead end', async () => {
    const app = await mountApp('/somewhere-that-never-existed')

    expect(app.vm.$route.path).toBe('/')
    expect(app.find('[data-zone]').attributes('data-zone')).toBe('about')
  })
})

describe('browser history', () => {
  it('returns to the previous zone on back', async () => {
    const app = await mountApp('/')

    press('ArrowRight')
    await flushRouter(app)
    expect(app.find('[data-zone]').attributes('data-zone')).toBe('work')

    app.vm.$router.back()
    await flushRouter(app)
    expect(app.find('[data-zone]').attributes('data-zone')).toBe('about')
  })
})

describe('the About tabs', () => {
  it('switches content in place, without navigating', async () => {
    const app = await mountApp('/')

    expect(app.text()).not.toContain('LANGUAGES')

    await app.findAll('[role="tab"]')[1].trigger('click')

    expect(app.text()).toContain('LANGUAGES')
    expect(app.vm.$route.path).toBe('/')
  })

  it('marks the active tab as selected', async () => {
    const app = await mountApp('/')

    expect(app.find('[role="tab"][aria-selected="true"]').text()).toContain('BIO')

    await app.findAll('[role="tab"]')[2].trigger('click')

    expect(app.find('[role="tab"][aria-selected="true"]').text()).toContain('EXTRAS')
  })
})

describe('the typed bio', () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  it('types out over time rather than arriving complete', async () => {
    vi.useFakeTimers()
    const app = await mountApp('/')

    expect(app.text()).not.toContain('mostly harmless.')

    await vi.advanceTimersByTimeAsync(5000)
    await app.vm.$nextTick()

    expect(app.text()).toContain('mostly harmless.')
  })

  it('retypes when the Bio tab is returned to', async () => {
    vi.useFakeTimers()
    const app = await mountApp('/')

    await vi.advanceTimersByTimeAsync(5000)
    await app.vm.$nextTick()
    expect(app.text()).toContain('mostly harmless.')

    await app.findAll('[role="tab"]')[1].trigger('click')
    await app.findAll('[role="tab"]')[0].trigger('click')

    expect(app.text()).not.toContain('mostly harmless.')
  })

  it('renders complete and still when reduced motion is preferred', async () => {
    vi.useFakeTimers()
    vi.stubGlobal(
      'matchMedia',
      vi.fn().mockReturnValue({ matches: true, addEventListener: vi.fn(), removeEventListener: vi.fn() })
    )

    const app = await mountApp('/')

    // No timers advanced: the visitor asked not to wait on an animation.
    expect(app.text()).toContain('mostly harmless.')

    vi.unstubAllGlobals()
  })
})

describe('the stat panel', () => {
  it("shows the profile's real LV, HP and year", async () => {
    const app = await mountApp('/')
    const stats = app.find('dl').text()

    expect(stats).toContain('31')
    expect(stats).toContain('20 / 20')
    expect(stats).toContain('2019')
  })
})

describe('the Skills tab', () => {
  it('renders the three groups with bars proportional to the data', async () => {
    const app = await mountApp('/')
    await app.findAll('[role="tab"]')[1].trigger('click')

    const groups = app.findAll('.skills__group-name').map((g) => g.text())
    expect(groups).toEqual(['LANGUAGES', 'FRAMEWORKS', 'INFRASTRUCTURE'])

    const barFor = (name: string) =>
      app
        .findAll('.skills__entry')
        .find((entry) => entry.text().startsWith(name))
        ?.find('.skills__bar-fill')
        .attributes('style')

    // Ten years of Git fills the bar; two years of Golang fills a fifth of it.
    expect(barFor('Git')).toBe('width: 100%;')
    expect(barFor('Golang')).toBe('width: 20%;')
  })
})

describe('the Extras tab', () => {
  it('renders hobby cards, likes and dislikes', async () => {
    const app = await mountApp('/')
    await app.findAll('[role="tab"]')[2].trigger('click')

    const text = app.text()
    expect(text).toContain('SKATING')
    expect(text).toContain('ATK 5 · DEF 2')
    expect(text).toContain('LIKES')
    expect(text).toContain('DISLIKES')
    expect(text).toContain('* Mushrooms')
  })
})

describe('the zone transition', () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  it('does not resolve the route until the overlay is opaque', async () => {
    vi.useFakeTimers()
    const app = await mountApp('/')

    press('ArrowRight')
    await flushPromises()
    await app.vm.$nextTick()

    // The overlay is fading down and the zone has NOT changed behind it.
    expect(app.find('[data-covering]').attributes('data-covering')).toBe('true')
    expect(app.find('[data-zone]').attributes('data-zone')).toBe('about')

    // jsdom fires no transitionend, so this is the fallback doing the work —
    // the same path a backgrounded tab takes.
    await vi.advanceTimersByTimeAsync(250)
    await flushRouter(app)

    expect(app.find('[data-zone]').attributes('data-zone')).toBe('work')
  })

  it('lifts the overlay once the swap has happened', async () => {
    vi.useFakeTimers()
    const app = await mountApp('/')

    press('ArrowRight')
    await vi.advanceTimersByTimeAsync(250)
    await flushRouter(app)

    expect(app.find('[data-covering]').attributes('data-covering')).toBe('false')
  })
})

describe('the zone transition, continued', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
    vi.useRealTimers()
  })

  it('resets entrance state, so nothing is mid-flight when the overlay lifts', async () => {
    vi.useFakeTimers()
    const app = await mountApp('/')

    await vi.advanceTimersByTimeAsync(5000)
    await app.vm.$nextTick()
    expect(app.text()).toContain('mostly harmless.')

    press('ArrowRight')
    await vi.advanceTimersByTimeAsync(250)
    await flushRouter(app)
    press('ArrowLeft')
    await vi.advanceTimersByTimeAsync(250)
    await flushRouter(app)

    // Back in the void, the bio is typing again from the start rather than
    // arriving already finished.
    expect(app.find('[data-zone]').attributes('data-zone')).toBe('about')
    expect(app.text()).not.toContain('mostly harmless.')
  })

  it('holds header clicks behind the same gate as arrow keys', async () => {
    vi.useFakeTimers()
    const app = await mountApp('/')

    await app.findAll('nav a')[2].trigger('click')
    await flushPromises()
    await app.vm.$nextTick()

    expect(app.find('[data-covering]').attributes('data-covering')).toBe('true')
    expect(app.find('[data-zone]').attributes('data-zone')).toBe('about')

    await vi.advanceTimersByTimeAsync(250)
    await flushRouter(app)

    expect(app.find('[data-zone]').attributes('data-zone')).toBe('blog')
  })

  it('navigates instantly, and still completes, under reduced motion', async () => {
    vi.stubGlobal(
      'matchMedia',
      vi.fn().mockReturnValue({ matches: true, addEventListener: vi.fn(), removeEventListener: vi.fn() })
    )
    const app = await mountApp('/')

    press('ArrowRight')
    // No transitionend dispatched and no timers advanced: there is no fade to
    // wait on, so the gate resolves on its own.
    await flushPromises()
    await app.vm.$nextTick()

    expect(app.find('[data-zone]').attributes('data-zone')).toBe('work')
  })
})

describe('the experience carousel', () => {
  it('shows one encounter at a time, with its authored level', async () => {
    const app = await mountApp('/work', {
      experience: [
        {
          title: 'FIRST ROLE',
          organisation: 'Somewhere',
          dates: '2024 — Now',
          level: 12,
          responsibilities: ['* Did the first thing.'],
          tags: ['Alpha'],
        },
        {
          title: 'SECOND ROLE',
          organisation: 'Elsewhere',
          dates: '2020 — 2024',
          level: 7,
          responsibilities: ['* Did the second thing.'],
          tags: ['Beta'],
        },
      ],
    })

    expect(app.text()).toContain('FIRST ROLE')
    expect(app.text()).toContain('LV 12')
    expect(app.text()).not.toContain('SECOND ROLE')
  })
})

function encounters(count: number) {
  return Array.from({ length: count }, (_, i) => ({
    title: `ROLE ${i + 1}`,
    organisation: 'Somewhere',
    dates: '2020 — 2024',
    level: 10 - i,
    responsibilities: [`* Did thing ${i + 1}.`],
    tags: ['Alpha'],
  }))
}

describe('stepping through encounters', () => {
  it('steps through the entries and tracks position', async () => {
    const app = await mountApp('/work', { experience: encounters(3) })
    const [previous, next] = app.findAll('button')

    expect(app.find('.work__counter').text()).toBe('1 / 3')

    await next.trigger('click')
    expect(app.text()).toContain('ROLE 2')
    expect(app.find('.work__counter').text()).toBe('2 / 3')

    await previous.trigger('click')
    expect(app.text()).toContain('ROLE 1')
    expect(app.find('.work__counter').text()).toBe('1 / 3')
  })

  it('disables the controls at each end rather than leaving them dead', async () => {
    const app = await mountApp('/work', { experience: encounters(2) })
    const [previous, next] = app.findAll('button')

    expect(previous.attributes('disabled')).toBeDefined()
    expect(next.attributes('disabled')).toBeUndefined()

    await next.trigger('click')

    expect(app.find('.work__counter').text()).toBe('2 / 2')
    expect(previous.attributes('disabled')).toBeUndefined()
    expect(next.attributes('disabled')).toBeDefined()

    // Clicking the dead control changes nothing.
    await next.trigger('click')
    expect(app.find('.work__counter').text()).toBe('2 / 2')
  })

  it('degrades to a single entry with both controls dead', async () => {
    const app = await mountApp('/work', { experience: encounters(1) })
    const [previous, next] = app.findAll('button')

    expect(app.find('.work__counter').text()).toBe('1 / 1')
    expect(app.findAll('.work__dot')).toHaveLength(1)
    expect(previous.attributes('disabled')).toBeDefined()
    expect(next.attributes('disabled')).toBeDefined()
  })

  it('derives dots and counter from the data, at any length', async () => {
    const app = await mountApp('/work', { experience: encounters(7) })

    expect(app.findAll('.work__dot')).toHaveLength(7)
    expect(app.find('.work__counter').text()).toBe('1 / 7')
  })
})

describe('the bundled career history', () => {
  it('marks every placeholder entry as needing replacement', async () => {
    const app = await mountApp('/work')

    expect(app.text()).toContain('PLACEHOLDER')
  })
})

describe('the blog landing', () => {
  it('lists posts newest first and leaves drafts out entirely', async () => {
    const app = await mountApp('/blog', {
      posts: parsePosts([olderPost, draftPost, newerPost]),
    })

    const titles = app.findAll('.post-card__title').map((t) => t.text())
    expect(titles).toEqual(['The Newer One', 'The Older One'])
    expect(app.text()).not.toContain('Not Ready')
  })
})

describe('the blog landing, continued', () => {
  it('computes reading time from the post itself', async () => {
    const app = await mountApp('/blog', { posts: parsePosts([longPost]) })

    // 900 words at 200 words a minute.
    expect(app.find('.post-card__meta').text()).toContain('5 min')
  })

  it('shows at most four posts, and fewer when there are fewer', async () => {
    const many = await mountApp('/blog', { posts: parsePosts(manyPosts(6)) })
    expect(many.findAll('.post-card')).toHaveLength(4)

    const few = await mountApp('/blog', { posts: parsePosts(manyPosts(2)) })
    expect(few.findAll('.post-card')).toHaveLength(2)
  })

  it('turns the filename into the post URL', async () => {
    const app = await mountApp('/blog', { posts: parsePosts([newerPost]) })

    expect(app.find('.post-card').attributes('href')).toBe('/blog/the-newer-one')
  })

  it('says nothing has been written when there are no posts', async () => {
    const app = await mountApp('/blog', { posts: [] })

    expect(app.text()).toContain('Nothing has been written')
    expect(app.findAll('.post-card')).toHaveLength(0)
  })
})

describe('parsing a post', () => {
  it('fails loudly, naming the file, when a required field is missing', () => {
    const incomplete = {
      slug: 'half-written',
      source: '---\ntitle: Half Written\ndate: 2026-01-01\n---\n\nBody.',
    }

    expect(() => parsePosts([incomplete])).toThrow(
      /half-written.*missing required frontmatter.*category.*description/
    )
  })

  it('fails loudly when there is no frontmatter at all', () => {
    expect(() => parsePosts([{ slug: 'bare', source: 'Just a body.' }])).toThrow(
      /bare.*no frontmatter/
    )
  })
})

describe('the blog reader', () => {
  it('renders a post in full at its own URL', async () => {
    const app = await mountApp('/blog/the-older-one', {
      posts: parsePosts([newerPost, olderPost]),
    })

    expect(app.vm.$route.path).toBe('/blog/the-older-one')
    expect(app.find('.reader__title').text()).toBe('The Older One')
    expect(app.text()).toContain('Body of the older post.')
  })
})

describe('the blog reader, continued', () => {
  it('maps to the Blog node in the header', async () => {
    const app = await mountApp('/blog/the-older-one', {
      posts: parsePosts([newerPost, olderPost]),
    })

    expect(app.find('[data-zone]').attributes('data-zone')).toBe('blog')
    expect(app.find('[aria-label="Zones"] a[aria-current="page"]').text()).toContain('BLOG')
  })

  it('lists all entries, marking the one being read', async () => {
    const app = await mountApp('/blog/the-older-one', {
      posts: parsePosts([newerPost, olderPost]),
    })

    const entries = app.findAll('.reader__entry')
    expect(entries).toHaveLength(2)
    expect(app.text()).toContain('ALL ENTRIES · 2')
    expect(app.find('.reader__entry--current .reader__entry-title').text()).toBe('The Older One')
  })

  it('links to the adjacent posts', async () => {
    const app = await mountApp('/blog/the-older-one', {
      posts: parsePosts([newerPost, olderPost]),
    })

    const adjacent = app.findAll('.reader__adjacent-link').map((l) => l.attributes('href'))
    expect(adjacent).toEqual(['/blog/the-newer-one'])
  })

  it('omits the entry list and adjacent links entirely at a single post', async () => {
    const app = await mountApp('/blog/the-newer-one', { posts: parsePosts([newerPost]) })

    expect(app.find('.reader__title').text()).toBe('The Newer One')
    expect(app.findAll('.reader__entry')).toHaveLength(0)
    expect(app.findAll('.reader__adjacent-link')).toHaveLength(0)
    expect(app.text()).not.toContain('ALL ENTRIES')
  })

  it('sends an unknown slug back to the landing rather than rendering blank', async () => {
    const app = await mountApp('/blog/never-written', { posts: parsePosts([newerPost]) })
    await flushRouter(app)

    expect(app.vm.$route.path).toBe('/blog')
  })

  it('cannot open a draft', async () => {
    const app = await mountApp('/blog/not-ready', {
      posts: parsePosts([newerPost, draftPost]),
    })
    await flushRouter(app)

    expect(app.vm.$route.path).toBe('/blog')
    expect(app.text()).not.toContain('Not Ready')
  })
})
