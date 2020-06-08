<template>
  <v-tabs hide-slider centered class="mew6-component--tabs">
    <div class="tabs-label d-flex align-center">
      <v-tab v-for="(t, key) in tabs" :key="key">{{ t.label }}</v-tab>
    </div>
    <v-tab-item v-for="(t, key) in tabs" :key="key">
      <img :src="t.background" class="tab-image" />
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
.tabs-label {
  box-shadow: 0 5px 10px rgba(0, 0, 0, 0.3);
}

.v-tab {
  text-transform: initial;
  font-weight: 600;
  min-width: 120px;
  height: 100px;
  color: var(--v-dark_independence-base) !important;
}

.v-tab--active {
  background-color: var(--v-basic-base);
  color: white !important;
}

.tab-image {
  padding-top: 50px;
  width: 100%;
}
</style>

<style lang="scss"></style>
