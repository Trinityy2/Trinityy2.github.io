---
title: "Five Vue 3 Patterns I Use in Every Project"
date: "2025-02-10"
tags: ["tech", "vue", "typescript"]
description: "After building several Vue 3 apps, these are the composable patterns, component conventions, and TypeScript tricks I reach for every single time."
featured: false
draft: false
---

## Introduction

Vue 3's Composition API is a genuine improvement over the Options API — not because the Options API was bad, but because composables are a better model for sharing stateful logic across components. After building a handful of real projects with it, some patterns have become muscle memory.

Here are five I use in every project.

## 1. Typed composable return values

Always define an explicit return type interface for composables that return reactive state. This makes IDE autocomplete reliable and prevents subtle bugs when the composable grows.

```ts
interface UseCounterReturn {
  count: Readonly<Ref<number>>
  increment: () => void
  reset: () => void
}

export function useCounter(initial = 0): UseCounterReturn {
  const count = ref(initial)
  const increment = () => count.value++
  const reset = () => (count.value = initial)
  return { count: readonly(count), increment, reset }
}
```

Exposing `count` as `readonly` prevents callers from mutating state directly — a mistake that's easy to make and hard to trace.

## 2. Async composables with loading and error state

Any composable that fetches data should expose `loading` and `error` alongside the data.

```ts
export function usePosts() {
  const posts = ref<Post[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetch() {
    loading.value = true
    error.value = null
    try {
      posts.value = await getPosts()
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Unknown error'
    } finally {
      loading.value = false
    }
  }

  return { posts: readonly(posts), loading: readonly(loading), error: readonly(error), fetch }
}
```

Components should never have to handle the try/catch themselves.

## 3. `useEventListener` — the composable you always forget to write

Manually calling `addEventListener` and `removeEventListener` in `onMounted`/`onUnmounted` is fine, but writing a reusable wrapper saves a lot of repetition.

```ts
export function useEventListener<K extends keyof WindowEventMap>(
  target: EventTarget,
  event: K,
  handler: (e: WindowEventMap[K]) => void,
  options?: AddEventListenerOptions,
) {
  onMounted(() => target.addEventListener(event, handler as EventListener, options))
  onUnmounted(() => target.removeEventListener(event, handler as EventListener, options))
}
```

Usage: `useEventListener(window, 'scroll', handleScroll, { passive: true })`

## 4. Provide / inject for deeply nested config

Prop drilling more than two levels is a code smell. For things like theme config, user preferences, or page-level context, `provide`/`inject` with a typed symbol is much cleaner.

```ts
// symbols.ts
export const ThemeKey: InjectionKey<Ref<'dark' | 'light'>> = Symbol('theme')

// parent
provide(ThemeKey, theme)

// deeply nested child
const theme = inject(ThemeKey)
```

Using an `InjectionKey<T>` typed symbol means TypeScript knows exactly what type you'll get back — no casting needed.

## 5. `defineModel` for two-way binding (Vue 3.4+)

Before `defineModel`, building a controlled input component meant boilerplate:

```ts
// Old way
const props = defineProps<{ modelValue: string }>()
const emit = defineEmits<{ 'update:modelValue': [string] }>()
```

Now:

```ts
// New way (Vue 3.4+)
const model = defineModel<string>()
```

That's it. `model.value` is the reactive value, and writing to it automatically emits the update. Use it everywhere.

---

That's the five. None of them are particularly original — they're distilled from reading the Vue docs carefully and making every mistake once. Hopefully you only have to make them zero times.
