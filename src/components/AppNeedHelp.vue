<template>
  <a :href="helpLink" target="_blank" class="block text-mew-green-text my-2">
    {{ title }}
  </a>
</template>

<script setup lang="ts">
defineProps({
  title: {
    type: String,
    required: true,
    default: 'Need help?',
  },
  helpLink: {
    type: String,
    required: true,
  },
})
</script>
