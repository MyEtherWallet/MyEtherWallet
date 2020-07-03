<template>
  <v-tabs vertical>
    <v-tab v-for="(t, key) in tabs" :key="key"> {{ t.label }} </v-tab>

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

<style lang="scss" scoped></style>
