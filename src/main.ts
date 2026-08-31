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
import { createAppRouter } from './router'

createApp(App).use(createAppRouter(createWebHistory(import.meta.env.BASE_URL))).mount('#app')
