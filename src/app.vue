<template>
  <v-app>
    <v-main>
      <v-sheet>
        <router-view />
        <global-elements-container />
        <global-modal-container />
        <global-overlay-container />
      </v-sheet>
    </v-main>
  </v-app>
</template>

<script>
import globalElementsContainer from '@/containers/GlobalElementsContainer/GlobalElementsContainer';
import globalModalContainer from '@/containers/GlobalModalContainer/GlobalModalContainer';
import globalOverlayContainer from '@/containers/GlobalOverlayContainer/GlobalOverlayContainer';

export default {
  name: 'App',
  components: {
    globalElementsContainer,
    globalModalContainer,
    globalOverlayContainer
  }
};
</script>

<style lang="scss">
@import '@/assets/styles/GlobalStyles.scss';
@import '@myetherwallet/mew-components/src/assets/styles/global.scss';
</style>
