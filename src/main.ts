import '@assets/main.css'
import i18n from './i18n/index'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import '@assets/fonts/DMSans/DMSans.css';
import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(i18n)

app.mount('#app')
