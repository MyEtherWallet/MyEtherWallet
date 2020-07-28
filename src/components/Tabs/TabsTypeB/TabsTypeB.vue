<template>
  <v-tabs height="75px" centered class="mew6-component--tabs-type-b">
    <div class="tab-labels d-flex align-center">
      <v-tab v-for="(t, key) in tabs" :key="key">{{ t.label }}</v-tab>
    </div>
    <v-tab-item v-for="(t, key) in tabs" :key="key">
      <component :is="t.content"></component>
    </v-tab-item>
  </v-tabs>
</template>

<script>
export default {
  components: {},
  props: { tabs: { default: () => [], type: Array } }
};
</script>

<style lang="scss" scoped>
.tab-labels {
  height: 100%;
}
.v-tab {
  text-transform: initial;
  font-weight: 400;
  min-width: 100px;
  height: 100%;
  color: var(--v-dark_independence-base) !important;
}
.v-tab--active {
  color: var(--v-basic-base) !important;
  font-weight: 500;
}
</style>

<style lang="scss">
.mew6-component--tabs-type-b {
  .v-tabs-slider-wrapper {
    height: 4px !important;
  }
  .v-slide-group__content {
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  }
}
</style>
