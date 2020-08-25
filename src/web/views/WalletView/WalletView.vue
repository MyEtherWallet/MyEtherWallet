<template>
  <v-sheet color="bg_wallet">
    <div class="d-flex align-stretch">
      <SideMenu class="box-shadow" />
      <div class="flex-grow-1 d-flex flex-column justify-space-between">
        <v-container>
          <Header />
          <router-view />
        </v-container>

        <Footer class="mt-10" />
      </div>
    </div>

    <GlobalElementsContainer />
    <GlobalModalContainer />
    <GlobalOverlayContainer />
  </v-sheet>
</template>

<script>
import SideMenu from './components/SideMenu';
import Header from './components/Header';
import Footer from './components/Footer';
import GlobalElementsContainer from '@/web/containers/GlobalElementsContainer';
import GlobalModalContainer from '@/web/containers/GlobalModalContainer';
import GlobalOverlayContainer from '@/web/containers/GlobalOverlayContainer';

export default {
  components: {
    SideMenu,
    Header,
    Footer,
    GlobalElementsContainer,
    GlobalModalContainer,
    GlobalOverlayContainer
  }
};
</script>
