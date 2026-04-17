<template>
  <section id="experience" class="section bg-slate-50 dark:bg-slate-900/50">
    <div class="section-container mx-auto px-4 sm:px-6 lg:px-8">
      <h2 class="section-heading">Experience</h2>
      <p class="section-subheading">Where I've worked and what I've shipped</p>

      <div class="mt-12 space-y-6">
        <TimelineEntry v-for="entry in experience" :key="entry.company + entry.dates" :entry="entry" />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import TimelineEntry from '@/components/ui/TimelineEntry.vue'
import type { ExperienceEntry } from '@/components/ui/TimelineEntry.vue'

const experience: ExperienceEntry[] = [
  {
    title: 'Senior Software Engineer',
    company: 'Company Name',
    dates: 'Jan 2022 – Present',
    bullets: [
      'Led development of a microservices-based platform serving 50k+ daily active users, reducing p95 latency by 35%.',
      'Designed and implemented a real-time event-driven notification system using Azure Service Bus.',
      'Mentored a team of 4 junior engineers, introducing TDD practices that improved test coverage from 40% to 85%.',
    ],
    tags: ['Vue 3', 'Node.js', 'Azure', 'PostgreSQL', 'Docker'],
  },
  {
    title: 'Full-Stack Developer',
    company: 'Previous Company',
    dates: 'Jun 2019 – Dec 2021',
    bullets: [
      'Built and maintained a multi-tenant SaaS reporting platform processing 2M+ records daily.',
      'Migrated a legacy SQL Server database to PostgreSQL, improving query performance by 40%.',
      'Delivered a customer-facing REST API consumed by 15+ third-party integrations.',
    ],
    tags: ['React', 'C# / .NET', 'SQL Server', 'Redis'],
  },
  {
    title: 'Junior Developer',
    company: 'First Company',
    dates: 'Sep 2017 – May 2019',
    bullets: [
      'Developed internal tooling that reduced manual data entry time by 60%.',
      'Contributed to a greenfield e-commerce platform from initial design through to launch.',
    ],
    tags: ['JavaScript', 'Python', 'MySQL'],
  },
]
</script>
