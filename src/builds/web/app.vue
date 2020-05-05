<template>
  <v-app>
    <v-content>
      <router-view />
    </v-content>
  </v-app>
</template>

<script>
export default {
  name: 'App',
  components: {},
  data() {
    return {};
  },
  mounted() {
    //this.$vuetify.theme.dark = false;
    //console.log(this.$vuetify.theme);
  }
};
</script>

<style lang="scss">
@import '@/assets/styles/GlobalVariables.scss';
@import '@/assets/styles/GlobalStyles.scss';
// this global stylesheet messes with the current v6 designs. so will have to fix everything first to match.
// @import '@myetherwallet/mew-components/src/assets/styles/global.scss';
</style>
