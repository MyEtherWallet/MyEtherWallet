<template>
  <v-tabs centered class="mew-component--tabs">
    <slot />
  </v-tabs>
</template>

<script>
export default {
  name: 'Tabs',
  components: {},
  props: {}
};
</script>

<style lang="scss">
@import '@/assets/styles/GlobalVariables';

.mew-component--tabs {
  .v-tab {
    text-transform: initial;
    font-weight: 700;
    min-width: 120px;
  }
}
</style>
