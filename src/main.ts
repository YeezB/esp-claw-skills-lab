import { createApp } from 'vue'
import { createPinia } from 'pinia'
import PrimeVue from 'primevue/config'
import DialogService from 'primevue/dialogservice'
import Lara from '@primeuix/themes/lara'

import App from './App.vue'
import router from './router'
import i18n from './i18n'

import 'highlight.js/styles/github-dark.css'
import './styles/variables.css'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(i18n)
app.use(PrimeVue, {
  theme: {
    preset: Lara,
    options: {
      darkModeSelector: ':root',
      cssLayer: false,
    },
  },
})
app.use(DialogService)

app.mount('#app')
