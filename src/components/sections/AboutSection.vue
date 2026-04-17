<template>
  <section id="about" class="section bg-slate-50 dark:bg-slate-900/50">
    <div class="section-container mx-auto px-4 sm:px-6 lg:px-8">
      <h2 class="section-heading">About Me</h2>
      <p class="section-subheading">A bit about who I am beyond the code</p>

      <div class="mt-12 grid grid-cols-1 gap-12 md:grid-cols-2">
        <!-- Bio -->
        <div class="space-y-4 text-slate-600 dark:text-slate-300">
          <p class="leading-relaxed">
            I'm a software developer based in Melbourne with a background in full-stack development
            and data integration. I graduated from Monash University with a Bachelor of Information
            Technology and have spent the years since building and maintaining software at
            FirstWave Cloud Technology — a cybersecurity and network management company.
          </p>
          <p class="leading-relaxed">
            My experience spans both sides of the stack: from building web interfaces to designing
            data pipelines that process and normalise large volumes of network telemetry. I've also
            had the opportunity to teach — as a PASS Mentor at Monash — which shaped how I think
            about explaining technical concepts clearly.
          </p>
          <p class="leading-relaxed">
            Outside of software I've got broad interests — sport, travel, and a bit of gaming to
            decompress. I believe the best engineers stay curious well beyond their own field.
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
