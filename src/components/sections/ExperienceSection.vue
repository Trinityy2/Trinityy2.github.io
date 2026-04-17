<template>
  <section id="experience" class="section bg-slate-50 dark:bg-slate-900/50">
    <div class="section-container mx-auto px-4 sm:px-6 lg:px-8">
      <h2 class="section-heading">Experience</h2>
      <p class="section-subheading">Where I've worked and what I've learned</p>

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
    title: 'Software Developer',
    company: 'FirstWave Cloud Technology',
    dates: '2020 – Present · Melbourne, Australia',
    bullets: [
      'Develop and maintain features across the full stack of FirstWave\'s network security management platform.',
      'Build and optimise data integration pipelines for ingesting, transforming, and normalising network telemetry at scale.',
      'Collaborate closely with cross-functional teams to deliver reliable, production-ready software in an agile environment.',
    ],
    tags: ['JavaScript', 'Python', 'REST APIs', 'SQL', 'Data Integration'],
  },
  {
    title: 'Intern Software Engineer — Data Integration',
    company: 'FirstWave Cloud Technology',
    dates: '2019 – 2020 · Melbourne, Australia',
    bullets: [
      'Developed ETL pipelines to ingest and normalise network event data from multiple third-party sources.',
      'Built internal tooling to automate data validation, error reporting, and pipeline monitoring.',
      'Gained hands-on experience with large-scale data workflows and production data systems.',
    ],
    tags: ['Python', 'SQL', 'ETL', 'Data Pipelines'],
  },
  {
    title: 'Teaching Associate (PASS Mentor)',
    company: 'Monash University',
    dates: '2018 – 2019 · Melbourne, Australia',
    bullets: [
      'Facilitated weekly Peer-Assisted Study Sessions for undergraduate Information Technology students.',
      'Supported student learning across programming fundamentals, data structures, and software development subjects.',
    ],
    tags: ['Teaching', 'Computer Science', 'Programming'],
  },
  {
    title: 'IT & Communications',
    company: 'MINDEF Communications Organisation',
    dates: 'Singapore',
    bullets: [
      'Supported communications and IT operations in a highly structured, mission-critical environment.',
      'Developed an understanding of secure systems, network infrastructure, and operational discipline.',
    ],
    tags: ['Networking', 'Communications', 'IT Operations'],
  },
]
</script>
