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
      { name: 'JavaScript',   icon: '🟨', level: 85 },
      { name: 'TypeScript',   icon: '🔷', level: 80 },
      { name: 'Vue 3',        icon: '💚', level: 85 },
      { name: 'HTML / CSS',   icon: '🎨', level: 85 },
      { name: 'Tailwind CSS', icon: '🌊', level: 80 },
    ],
  },
  {
    title: 'Backend',
    skills: [
      { name: 'Python',       icon: '🐍', level: 85 },
      { name: 'Node.js',      icon: '🟢', level: 75 },
      { name: 'REST APIs',    icon: '🔌', level: 85 },
      { name: 'SQL',          icon: '🗄️',  level: 85 },
      { name: 'ETL Pipelines',icon: '🔄', level: 80 },
    ],
  },
  {
    title: 'Databases',
    skills: [
      { name: 'PostgreSQL',   icon: '🐘', level: 80 },
      { name: 'MySQL',        icon: '🐬', level: 80 },
      { name: 'SQL Server',   icon: '🗃️',  level: 75 },
      { name: 'MongoDB',      icon: '🍃', level: 65 },
    ],
  },
  {
    title: 'Networking & Security',
    skills: [
      { name: 'Network Mgmt', icon: '🌐', level: 75 },
      { name: 'Cybersecurity',icon: '🔐', level: 70 },
      { name: 'Linux',        icon: '🐧', level: 75 },
      { name: 'TCP/IP',       icon: '📡', level: 70 },
    ],
  },
  {
    title: 'DevOps & Tools',
    skills: [
      { name: 'Git',           icon: '🌿', level: 85 },
      { name: 'Docker',        icon: '🐳', level: 75 },
      { name: 'GitHub Actions',icon: '⚙️', level: 75 },
      { name: 'CI/CD',         icon: '🚀', level: 75 },
      { name: 'Agile / Scrum', icon: '📋', level: 80 },
    ],
  },
]
</script>
