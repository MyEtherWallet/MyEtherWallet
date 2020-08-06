<template>
  <v-sheet color="walletBg">
    <div class="d-flex align-stretch">
      <side-menu class="box-shadow" />
      <div class="flex-grow-1 d-flex flex-column justify-space-between">
        <v-container>
          <wallet-header />
          <router-view />
        </v-container>

        <wallet-footer class="mt-10" />
      </div>
    </div>

    <global-elements-container />
    <global-modal-container />
    <global-overlay-container />
  </v-sheet>
</template>

<script>
import sideMenu from './components/side-menu/SideMenu';
import walletHeader from './components/header/Header';
import walletFooter from './components/footer/Footer';
import globalElementsContainer from '@/containers/GlobalElementsContainer/GlobalElementsContainer';
import globalModalContainer from '@/containers/GlobalModalContainer/GlobalModalContainer';
import globalOverlayContainer from '@/containers/GlobalOverlayContainer/GlobalOverlayContainer';

export default {
  components: {
    walletFooter,
    sideMenu,
    walletHeader,
    globalElementsContainer,
    globalModalContainer,
    globalOverlayContainer
  }
};
</script>
