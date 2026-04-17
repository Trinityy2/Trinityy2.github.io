<template>
  <section id="skills" class="section">
    <div class="section-container mx-auto px-4 sm:px-6 lg:px-8">
      <h2 class="section-heading">Skills</h2>
      <p class="section-subheading">Technologies and tools I work with</p>

      <div class="mt-12 space-y-10">
        <div v-for="group in skillGroups" :key="group.title">
          <h3 class="mb-4 text-sm font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500">
            {{ group.title }}
          </h3>
          <div class="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            <SkillCard
              v-for="skill in group.skills"
              :key="skill.name"
              :skill="skill"
            />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import SkillCard from '@/components/ui/SkillCard.vue'
import type { Skill } from '@/components/ui/SkillCard.vue'

interface SkillGroup {
  title: string
  skills: Skill[]
}

const skillGroups: SkillGroup[] = [
  {
    title: 'Frontend',
    skills: [
      { name: 'Vue 3',       icon: '💚', level: 90 },
      { name: 'TypeScript',  icon: '🔷', level: 85 },
      { name: 'React',       icon: '⚛️',  level: 75 },
      { name: 'Tailwind CSS',icon: '🎨', level: 90 },
      { name: 'Vite',        icon: '⚡', level: 85 },
    ],
  },
  {
    title: 'Backend',
    skills: [
      { name: 'Node.js',     icon: '🟢', level: 85 },
      { name: 'Python',      icon: '🐍', level: 80 },
      { name: 'C# / .NET',   icon: '🔵', level: 75 },
      { name: 'REST APIs',   icon: '🔌', level: 90 },
      { name: 'GraphQL',     icon: '🕸️', level: 70 },
    ],
  },
  {
    title: 'Databases',
    skills: [
      { name: 'PostgreSQL',  icon: '🐘', level: 85 },
      { name: 'SQL Server',  icon: '🗃️', level: 80 },
      { name: 'MongoDB',     icon: '🍃', level: 70 },
      { name: 'Redis',       icon: '🔴', level: 65 },
    ],
  },
  {
    title: 'Cloud & DevOps',
    skills: [
      { name: 'Azure',       icon: '☁️', level: 75 },
      { name: 'AWS',         icon: '🟠', level: 65 },
      { name: 'Docker',      icon: '🐳', level: 80 },
      { name: 'GitHub Actions', icon: '⚙️', level: 80 },
      { name: 'CI/CD',       icon: '🚀', level: 80 },
    ],
  },
  {
    title: 'Architecture & Practices',
    skills: [
      { name: 'Microservices', icon: '🧩', level: 75 },
      { name: 'Event-Driven', icon: '📡', level: 70 },
      { name: 'DDD',          icon: '📐', level: 70 },
      { name: 'TDD',          icon: '✅', level: 80 },
      { name: 'Clean Code',   icon: '✨', level: 85 },
    ],
  },
]
</script>
