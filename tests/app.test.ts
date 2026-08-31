import { describe, expect, it } from 'vitest'

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
