import { describe, expect, it } from 'vitest'

import { mountApp } from './helpers/mountApp'

describe('the About zone', () => {
  it('renders the profile name at the root path', async () => {
    const app = await mountApp('/')

    expect(app.text()).toContain('TOMO SUZUKI')
  })
})
