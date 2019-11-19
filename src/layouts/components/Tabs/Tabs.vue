<template>
  <v-tabs color="deep-purple accent-4" centered>
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

<style lang="scss" scoped>
@import '@/assets/styles/GlobalVariables';
.v-tab {
  text-transform: initial;
  font-weight: 700;
  color: $disabled--2;
  min-width: 120px;
}
</style>
