<script setup lang="ts">
  import { dislikes, hobbies, likes } from '@/data/extras'
</script>

<template>
  <div class="extras">
    <div class="extras__hobbies">
      <article v-for="hobby in hobbies" :key="hobby.name" class="extras__hobby">
        <h2 class="extras__hobby-name">{{ hobby.name }}</h2>
        <p class="extras__hobby-stat">{{ hobby.stat }}</p>
        <p class="extras__hobby-note">{{ hobby.note }}</p>
      </article>
    </div>

    <div class="extras__opinions">
      <section class="extras__opinion">
        <h2 class="extras__opinion-name extras__opinion-name--likes">LIKES</h2>
        <ul class="extras__opinion-list">
          <li v-for="like in likes" :key="like">{{ like }}</li>
        </ul>
      </section>

      <section class="extras__opinion">
        <h2 class="extras__opinion-name extras__opinion-name--dislikes">DISLIKES</h2>
        <ul class="extras__opinion-list extras__opinion-list--muted">
          <li v-for="dislike in dislikes" :key="dislike">{{ dislike }}</li>
        </ul>
      </section>
    </div>
  </div>
</template>

<style scoped>
  .extras {
    display: flex;
    flex-direction: column;
    gap: 14px;
  }

  .extras__hobbies,
  .extras__opinions {
    display: grid;
    grid-template-columns: 1fr;
    gap: 12px;
  }

  .extras__hobby {
    border: var(--border-width) solid var(--zone-line);
    padding: 14px;
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  /* The first hobby is the one being led with, so it takes the zone ink. */
  .extras__hobby:first-child {
    border-color: var(--zone-ink);
  }

  .extras__hobby-name {
    font-size: 11px;
    color: var(--zone-ink);
  }

  .extras__hobby:first-child .extras__hobby-name {
    color: var(--zone-accent);
  }

  .extras__hobby-stat {
    font-family: var(--font-display);
    font-size: 9px;
    color: var(--zone-muted);
  }

  .extras__hobby-note {
    font-size: 12px;
    line-height: 1.6;
    color: var(--zone-body);
  }

  .extras__opinion {
    border: var(--border-width) solid var(--zone-line);
    padding: var(--space-2);
    display: flex;
    flex-direction: column;
    gap: 9px;
  }

  .extras__opinion-name {
    font-size: 10px;
    letter-spacing: 1px;
  }

  .extras__opinion-name--likes {
    color: var(--zone-accent);
  }

  .extras__opinion-name--dislikes {
    color: var(--soul-red);
  }

  .extras__opinion-list {
    margin: 0;
    padding: 0;
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 6px;
    font-size: 12px;
    line-height: 1.5;
    color: var(--zone-ink);
  }

  .extras__opinion-list--muted {
    color: var(--zone-body);
  }

  @media (min-width: 900px) {
    .extras__hobbies {
      grid-template-columns: repeat(3, 1fr);
    }

    .extras__opinions {
      grid-template-columns: 1fr 1fr;
    }
  }
</style>
