<template>
  <v-tabs height="100px" hide-slider centered>
    <div class="tab-labels d-flex align-center">
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
.tab-labels {
  box-shadow: 0 5px 10px rgba(0, 0, 0, 0.1);
  height: 60px;
  margin: 10px 0;
  border-radius: 10px;
  overflow: hidden;
}
.v-tab {
  text-transform: initial;
  font-weight: 500;
  min-width: 120px;
  height: 100%;
  color: var(--v-dark_independence-base) !important;
}
.v-tab--active {
  background-color: var(--v-basic-base);
  color: white !important;
}
.tab-image {
  width: 100%;
}
</style>
