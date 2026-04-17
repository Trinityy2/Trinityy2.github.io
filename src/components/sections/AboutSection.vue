<template>
  <section id="about" class="section bg-slate-50 dark:bg-slate-900/50">
    <div class="section-container mx-auto px-4 sm:px-6 lg:px-8">
      <h2 class="section-heading">About Me</h2>
      <p class="section-subheading">A bit about who I am beyond the code</p>

      <div class="mt-12 grid grid-cols-1 gap-12 md:grid-cols-2">
        <!-- Bio -->
        <div class="space-y-4 text-slate-600 dark:text-slate-300">
          <p class="leading-relaxed">
            I'm a software engineer with a passion for building things that are fast, reliable, and a
            pleasure to use. My background spans full-stack web development, relational databases,
            and distributed systems — I enjoy working across the stack and thinking about how the
            pieces fit together.
          </p>
          <p class="leading-relaxed">
            Over the years I've worked on everything from greenfield SaaS products to large-scale
            data migration projects. I care deeply about code quality, developer experience, and
            shipping software that genuinely solves problems.
          </p>
          <p class="leading-relaxed">
            When I'm not writing code I'm usually found on a football pitch, at the gym, or deep in
            a good book. I believe the best engineers have rich lives outside of tech — it keeps
            the thinking fresh.
          </p>
        </div>

        <!-- Interests -->
        <div>
          <h3 class="mb-6 text-lg font-semibold text-slate-900 dark:text-white">Outside of work</h3>
          <div class="grid grid-cols-2 gap-4 sm:grid-cols-3">
            <div
              v-for="interest in interests"
              :key="interest.label"
              class="card flex flex-col items-center gap-2 p-4 text-center transition-shadow hover:shadow-md"
            >
              <span class="text-3xl" role="img" :aria-label="interest.label">{{ interest.emoji }}</span>
              <span class="text-sm font-medium text-slate-700 dark:text-slate-300">{{ interest.label }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const interests = [
  { emoji: '⚽', label: 'Football' },
  { emoji: '🏋️', label: 'Gym' },
  { emoji: '📚', label: 'Reading' },
  { emoji: '🎮', label: 'Gaming' },
  { emoji: '✈️', label: 'Travel' },
  { emoji: '🎵', label: 'Music' },
]
</script>
