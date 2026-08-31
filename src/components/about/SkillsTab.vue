<script setup lang="ts">
  import {
    DEEP_EXPERIENCE_YEARS,
    skillCallout,
    skillGroups,
    skillsPreamble,
    type Skill,
  } from '@/data/skills'

  /** Below the depth threshold an entry renders muted, so a reader can tell
   * deep experience from passing familiarity without reading the numbers. */
  function isDeep(skill: Skill): boolean {
    return skill.years >= DEEP_EXPERIENCE_YEARS
  }

  function yearsLabel(skill: Skill): string {
    return `${skill.years} ${skill.years === 1 ? 'YR' : 'YRS'}`
  }
</script>

<template>
  <div class="skills">
    <p class="skills__preamble">{{ skillsPreamble }}</p>

    <div class="skills__groups">
      <section
        v-for="(group, index) in skillGroups"
        :key="group.name"
        class="skills__group"
      >
        <h2 class="skills__group-name">{{ group.name }}</h2>

        <ul class="skills__list">
          <li
            v-for="skill in group.skills"
            :key="skill.name"
            class="skills__entry"
            :class="{ 'skills__entry--shallow': !isDeep(skill) }"
          >
            <span class="skills__entry-head">
              <span class="skills__entry-name">{{ skill.name }}</span>
              <span class="skills__entry-years">{{ yearsLabel(skill) }}</span>
            </span>
            <span class="skills__bar">
              <span class="skills__bar-fill" :style="{ width: `${skill.weight}%` }"></span>
            </span>
          </li>
        </ul>

        <!-- The callout is a note about the languages, so it lives in that
             column rather than spanning the grid — as in the design. -->
        <div v-if="index === 0" class="skills__callout">
          <p class="skills__callout-label">{{ skillCallout.label }}</p>
          <p class="skills__callout-value">{{ skillCallout.value }}</p>
          <p class="skills__callout-note">{{ skillCallout.note }}</p>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
  .skills {
    display: flex;
    flex-direction: column;
    gap: var(--space-2);
  }

  .skills__preamble {
    font-size: 13px;
    color: var(--zone-muted);
  }

  .skills__groups {
    display: grid;
    grid-template-columns: 1fr;
    gap: 18px;
    align-items: start;
  }

  .skills__group {
    display: flex;
    flex-direction: column;
    gap: 11px;
  }

  .skills__group-name {
    border: var(--border-width) solid var(--zone-accent);
    color: var(--zone-accent);
    font-size: 10px;
    padding: var(--space-1) 10px;
    text-align: center;
  }

  .skills__list {
    margin: 0;
    padding: 0 0 0 var(--space-2);
    margin-left: 14px;
    list-style: none;
    border-left: var(--border-width) dashed var(--zone-line);
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .skills__entry {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .skills__entry-head {
    display: flex;
    justify-content: space-between;
    gap: 12px;
    font-size: 12px;
    color: var(--zone-ink);
  }

  .skills__entry-years {
    flex: 0 0 auto;
    font-family: var(--font-display);
    font-size: 9px;
    color: var(--zone-accent);
  }

  .skills__bar {
    display: block;
    height: 6px;
    background: var(--zone-line);
  }

  .skills__bar-fill {
    display: block;
    height: 6px;
    background: var(--zone-ink);
  }

  .skills__entry--shallow .skills__entry-head,
  .skills__entry--shallow .skills__entry-years {
    color: var(--zone-muted);
  }

  .skills__entry--shallow .skills__bar-fill {
    background: var(--zone-muted);
  }

  .skills__callout {
    margin-top: 4px;
    border: var(--border-width) solid var(--zone-accent);
    padding: 13px 14px;
    display: flex;
    flex-direction: column;
    gap: 7px;
  }

  .skills__callout-label {
    font-family: var(--font-display);
    font-size: 10px;
    color: var(--zone-accent);
  }

  .skills__callout-value {
    font-size: 13px;
    color: var(--zone-ink);
  }

  .skills__callout-note {
    font-size: 11px;
    line-height: 1.6;
    color: var(--zone-muted);
  }

  @media (min-width: 900px) {
    .skills__groups {
      grid-template-columns: repeat(3, 1fr);
    }
  }
</style>
