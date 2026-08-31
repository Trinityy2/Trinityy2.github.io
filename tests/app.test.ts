import { afterEach, describe, expect, it, vi } from 'vitest'

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
