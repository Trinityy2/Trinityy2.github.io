import '@fontsource/silkscreen/400.css'
import '@fontsource/silkscreen/700.css'
import '@fontsource/ibm-plex-mono/400.css'
import '@fontsource/ibm-plex-mono/500.css'
import '@fontsource/ibm-plex-mono/600.css'

import '@/assets/zones.css'
import '@/assets/base.css'

import { createApp } from 'vue'
import { createWebHistory } from 'vue-router'

import App from './App.vue'
import { bundledContent, SITE_CONTENT } from './content'
import { createAppRouter } from './router'

const app = createApp(App)

app.provide(SITE_CONTENT, bundledContent)
app.use(createAppRouter(createWebHistory(import.meta.env.BASE_URL), bundledContent))
app.mount('#app')
