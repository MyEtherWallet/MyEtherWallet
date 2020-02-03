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
  data: () => ({})
};
</script>

<style lang="scss">
@import '@/assets/styles/GlobalVariables.scss';
@import '@/assets/styles/GlobalStyles.scss';
</style>
