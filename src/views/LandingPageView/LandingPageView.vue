<template>
  <v-sheet>
    <HeaderContainer />
    <router-view />
    <FooterContainer />
    <GlobalElementsContainer />
    <GlobalModalContainer />
    <GlobalOverlayContainer />
  </v-sheet>
</template>

<script>
import HeaderContainer from '@/containers/HeaderContainer';
import FooterContainer from '@/containers/FooterContainer';
import GlobalElementsContainer from '@/containers/GlobalElementsContainer';
import GlobalModalContainer from '@/containers/GlobalModalContainer';
import GlobalOverlayContainer from '@/containers/GlobalOverlayContainer';

export default {
  name: 'LandingPageView',
  components: {
    HeaderContainer,
    FooterContainer,
    GlobalElementsContainer,
    GlobalModalContainer,
    GlobalOverlayContainer
  }
};
</script>
