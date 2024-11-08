import './assets/main.css'
import i18n from './i18n/index'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import {
  init as sentryInit,
  browserTracingIntegration,
  replayIntegration,
} from '@sentry/vue'

import App from './App.vue'
import router from './router'

const app = createApp(App)

const dsn = import.meta.env.VITE_SENTRY_DSN

if (dsn) {
  sentryInit({
    app,
    dsn,
    integrations: [browserTracingIntegration({ router }), replayIntegration()],
    // Tracing
    tracesSampleRate: 1.0, //  Capture 100% of the transactions
    // Set 'tracePropagationTargets' to control for which URLs distributed tracing should be enabled
    tracePropagationTargets: [
      'localhost',
      /^https?:\/\/myetherwallet\.com/,
      /^https?:\/\/www\.myetherwallet\.com/,
    ],
    // Session Replay
    replaysSessionSampleRate: 0.1, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
    replaysOnErrorSampleRate: 1.0, // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
  })
}

app.use(createPinia())
app.use(router).use(i18n)

app.mount('#app')
