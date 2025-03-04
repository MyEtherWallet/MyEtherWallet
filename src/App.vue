<template>
  <div>
    <router-view />
    <module-toast />
  </div>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
import ModuleToast from './modules/toast/ModuleToast.vue'
</script>
