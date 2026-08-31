import { enableAutoUnmount } from '@vue/test-utils'
import { afterEach } from 'vitest'

/*
 * Unmount every wrapper between tests. The app registers a window `keydown`
 * listener for arrow-key travel; without this, each test's listener outlives
 * it and later keypresses drive routers belonging to finished tests.
 */
enableAutoUnmount(afterEach)
