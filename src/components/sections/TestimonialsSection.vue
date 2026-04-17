<template>
  <section id="testimonials" class="section bg-slate-50 dark:bg-slate-900/50">
    <div class="section-container mx-auto px-4 sm:px-6 lg:px-8">
      <h2 class="section-heading">What People Say</h2>
      <p class="section-subheading">Kind words from people I've worked with</p>

      <div class="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2">
        <TestimonialCard v-for="t in testimonials" :key="t.name" :testimonial="t" />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import TestimonialCard from '@/components/ui/TestimonialCard.vue'
import type { Testimonial } from '@/components/ui/TestimonialCard.vue'

const testimonials: Testimonial[] = [
  {
    quote: 'One of the most thorough engineers I\'ve worked with. They always think about the bigger picture — architecture, maintainability, and the end user — all at once.',
    name: 'Colleague Name',
    title: 'Engineering Manager',
    company: 'Company Name',
  },
  {
    quote: 'Incredibly reliable and proactive. They took ownership of our database migration project end-to-end and delivered it with zero downtime. Impressive.',
    name: 'Another Colleague',
    title: 'Senior Developer',
    company: 'Previous Company',
  },
]
</script>
