<template>
  <v-app>
    <v-main>
      <v-sheet>
        <router-view />
      </v-sheet>
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: 'App'
};
</script>

<style lang="scss">
@import '@/assets/styles/GlobalStyles.scss';
@import '@myetherwallet/mew-components/src/assets/styles/global.scss';
</style>
