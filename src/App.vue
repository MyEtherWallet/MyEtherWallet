<template>
  <div>
    <router-view />
    <the-toast />
  </div>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
import TheToast from './components/TheToast.vue'
import { useToastStore } from './stores/toastStore'
import { onMounted } from 'vue'
import { ToastType } from './types/notification'

const notificationsStore = useToastStore()

onMounted(() => {
  notificationsStore.addToastMessage({
    type: ToastType.Success,
    text: 'Message sent successfully.',
  })

  notificationsStore.addToastMessage({
    type: ToastType.Error,
    text: 'I am and error.',
  })

  notificationsStore.addToastMessage({
    type: ToastType.Warning,
    text: 'I am a warning',
  })

  notificationsStore.addToastMessage({
    type: ToastType.Info,
    text: 'I am very long info sentence that should be wrapped.',
    link: {
      title: 'Learn more',
      url: 'https://example.com',
    },
  })
})
</script>

<style scoped>
header {
  line-height: 1.5;
  max-height: 100vh;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
  margin-top: 2rem;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }

  nav {
    text-align: left;
    margin-left: -1rem;
    font-size: 1rem;

    padding: 1rem 0;
    margin-top: 1rem;
  }
}
</style>
