<template>
  <v-tabs centered class="component-tabs">
    <slot />
  </v-tabs>
</template>

<script>
export default {
  name: 'Tabs',
  components: {},
  props: {
    //title: { default: '', type: String }
  }
};
</script>

<style lang="scss">
@import '@/assets/styles/GlobalVariables';

.component-tabs {
  .v-tab {
    text-transform: initial;
    font-weight: 700;
    color: $disabled--2;
    min-width: 120px;
  }
  .v-tab--active {
    color: rgb(0, 57, 69);
  }
}
</style>
