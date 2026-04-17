<template>
  <section id="projects" class="section">
    <div class="section-container mx-auto px-4 sm:px-6 lg:px-8">
      <h2 class="section-heading">Projects</h2>
      <p class="section-subheading">Things I've built in my spare time</p>

      <div class="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <ProjectCard v-for="project in projects" :key="project.title" :project="project" />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import ProjectCard from '@/components/ui/ProjectCard.vue'
import type { Project } from '@/components/ui/ProjectCard.vue'

const projects: Project[] = [
  {
    title: 'Personal Website',
    description: 'This site — built with Vue 3, TypeScript, Vite, and Tailwind CSS. Includes a markdown-powered blog with syntax highlighting.',
    tags: ['Vue 3', 'TypeScript', 'Tailwind', 'Vite'],
    githubUrl: 'https://github.com/Trinityy2/personal-website',
    demoUrl: 'https://trinityy2.github.io/personal-website',
    color: 'bg-gradient-to-r from-emerald-400 to-teal-500',
  },
  {
    title: 'Project Two',
    description: 'A short description of what this project does, the problem it solves, and what you learned building it.',
    tags: ['Node.js', 'PostgreSQL', 'Docker'],
    githubUrl: 'https://github.com/Trinityy2',
    color: 'bg-gradient-to-r from-violet-400 to-purple-600',
  },
  {
    title: 'Project Three',
    description: 'A short description of what this project does, the problem it solves, and what you learned building it.',
    tags: ['Python', 'FastAPI', 'AWS'],
    githubUrl: 'https://github.com/Trinityy2',
    color: 'bg-gradient-to-r from-amber-400 to-orange-500',
  },
]
</script>
