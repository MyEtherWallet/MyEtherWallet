<template>
  <v-sheet color="bg_wallet">
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
import SideMenu from './components/SideMenu';
import Header from './components/Header';
import Footer from './components/Footer';
import GlobalElementsContainer from '@/containers/GlobalElementsContainer';
import GlobalModalContainer from '@/containers/GlobalModalContainer';
import GlobalOverlayContainer from '@/containers/GlobalOverlayContainer';

export default {
  components: {
    'wallet-header': Header,
    'wallet-footer': Footer,
    'side-menu': SideMenu,
    'global-elements-container': GlobalElementsContainer,
    'global-modal-container': GlobalModalContainer,
    'global-overlay-container': GlobalOverlayContainer
  }
};
</script>
