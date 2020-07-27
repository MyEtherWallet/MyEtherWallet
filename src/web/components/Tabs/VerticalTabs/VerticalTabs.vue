<template>
  <div class="mew-component--vertical-tabs">
    <v-tabs vertical>
      <v-tab v-for="(t, key) in tabs" :key="key"> {{ t.label }} </v-tab>
      <v-tab-item v-for="(t, key) in tabs" :key="key">
        <component :is="t.content"></component>
      </v-tab-item>
    </v-tabs>
  </div>
</template>

<script>
export default {
  components: {},
  props: { tabs: { default: () => [], type: Array } }
};
</script>

<style lang="scss" scoped></style>

<style lang="scss">
.mew-component--vertical-tabs {
  .v-tab {
    text-align: left;
    display: block;
    height: initial !important;
    padding: 15px 20px;
    text-transform: initial;
  }
  .v-tabs-slider-wrapper {
    width: 4px !important;
    padding: 11px 0px;
  }
  .v-tab--active {
    color: var(--v-text_default-base) !important;
  }
  .v-tabs--vertical > .v-tabs-bar .v-tabs-bar__content {
    border-right: 2px solid var(--v-primary_silver-base);
    padding-right: 40px;
    margin-right: 40px;
  }
}
</style>
