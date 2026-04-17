<template>
  <header
    class="fixed inset-x-0 top-0 z-50 border-b border-slate-200/80 bg-white/80 backdrop-blur-md transition-colors duration-200 dark:border-slate-800/80 dark:bg-slate-950/80"
  >
    <div class="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6 lg:px-8">
      <!-- Logo / Name -->
      <RouterLink
        to="/"
        class="text-lg font-semibold tracking-tight text-slate-900 transition-colors hover:text-primary-600 dark:text-white dark:hover:text-primary-400"
      >
        {{ name }}
      </RouterLink>

      <!-- Desktop nav -->
      <nav class="hidden items-center gap-1 md:flex" aria-label="Main navigation">
        <a
          v-for="link in navLinks"
          :key="link.label"
          :href="link.href"
          class="rounded-md px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
          :class="{ 'text-primary-600 dark:text-primary-400': activeSection === link.section }"
        >
          {{ link.label }}
        </a>
        <RouterLink
          to="/blog"
          class="rounded-md px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
        >
          Blog
        </RouterLink>
      </nav>

      <!-- Right controls -->
      <div class="flex items-center gap-2">
        <!-- Theme toggle -->
        <button
          @click="themeStore.toggleTheme()"
          class="btn-ghost rounded-lg p-2"
          :aria-label="themeStore.theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'"
        >
          <SunIcon v-if="themeStore.theme === 'dark'" class="h-5 w-5" />
          <MoonIcon v-else class="h-5 w-5" />
        </button>

        <!-- Mobile hamburger -->
        <button
          @click="mobileOpen = !mobileOpen"
          class="btn-ghost rounded-lg p-2 md:hidden"
          aria-label="Toggle menu"
          :aria-expanded="mobileOpen"
        >
          <XMarkIcon v-if="mobileOpen" class="h-5 w-5" />
          <Bars3Icon v-else class="h-5 w-5" />
        </button>
      </div>
    </div>

    <!-- Mobile menu -->
    <Transition
      enter-active-class="transition duration-150 ease-out"
      enter-from-class="-translate-y-2 opacity-0"
      enter-to-class="translate-y-0 opacity-100"
      leave-active-class="transition duration-100 ease-in"
      leave-from-class="translate-y-0 opacity-100"
      leave-to-class="-translate-y-2 opacity-0"
    >
      <div
        v-if="mobileOpen"
        class="border-t border-slate-200 bg-white px-4 pb-4 dark:border-slate-800 dark:bg-slate-950 md:hidden"
      >
        <nav class="flex flex-col gap-1 pt-2" aria-label="Mobile navigation">
          <a
            v-for="link in navLinks"
            :key="link.label"
            :href="link.href"
            @click="mobileOpen = false"
            class="rounded-md px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
          >
            {{ link.label }}
          </a>
          <RouterLink
            to="/blog"
            @click="mobileOpen = false"
            class="rounded-md px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
          >
            Blog
          </RouterLink>
        </nav>
      </div>
    </Transition>
  </header>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useThemeStore } from '@/stores/theme'
import { useActiveSection } from '@/composables/useActiveSection'

// Inline minimal icon components to avoid a heavy icon library dependency
const SunIcon = {
  template: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z"/></svg>`,
}
const MoonIcon = {
  template: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z"/></svg>`,
}
const Bars3Icon = {
  template: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"/></svg>`,
}
const XMarkIcon = {
  template: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12"/></svg>`,
}

const name = 'Tomohito Suzuki'

const navLinks = [
  { label: 'About',      href: '/#about',      section: 'about' },
  { label: 'Skills',     href: '/#skills',     section: 'skills' },
  { label: 'Experience', href: '/#experience', section: 'experience' },
  { label: 'Projects',   href: '/#projects',   section: 'projects' },
  { label: 'Contact',    href: '/#contact',    section: 'contact' },
]

const themeStore = useThemeStore()
const mobileOpen = ref(false)
const { activeSection } = useActiveSection(['about', 'skills', 'experience', 'projects', 'contact'])
</script>
