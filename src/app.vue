<template>
  <v-app>
    <v-main>
      <v-sheet>
        <router-view />
        <GlobalElementsContainer />
        <GlobalModalContainer />
        <GlobalOverlayContainer />
      </v-sheet>
    </v-main>
  </v-app>
</template>

<script>
import GlobalElementsContainer from '@/containers/GlobalElementsContainer';
import GlobalModalContainer from '@/containers/GlobalModalContainer';
import GlobalOverlayContainer from '@/containers/GlobalOverlayContainer';

export default {
  name: 'App',
  components: {
    GlobalElementsContainer,
    GlobalModalContainer,
    GlobalOverlayContainer
  }
};
</script>

<style lang="scss">
@import '@/assets/styles/GlobalStyles.scss';
@import '@myetherwallet/mew-components/src/assets/styles/global.scss';
</style>
