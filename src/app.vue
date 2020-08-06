<template>
  <v-app>
    <v-main>
      <v-sheet>
        <router-view />
        <global-modal-container />
      </v-sheet>
    </v-main>
  </v-app>
</template>

<script>
import globalModalContainer from '@/containers/GlobalModalContainer/GlobalModalContainer';

export default {
  name: 'App',
  components: {
    globalModalContainer
  }
};
</script>

<style lang="scss">
@import '@/assets/styles/GlobalStyles.scss';
@import '@myetherwallet/mew-components/src/assets/styles/global.scss';
</style>
