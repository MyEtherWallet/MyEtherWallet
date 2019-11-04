<template>
  <v-card class="link-box mx-auto" max-width="400">
    <slot />
  </v-card>
</template>

<script>
export default {
  name: 'LinkBox',
  components: {}
};
</script>

<style lang="scss" scoped>
@import '@/assets/styles/GlobalVariables';
</style>
