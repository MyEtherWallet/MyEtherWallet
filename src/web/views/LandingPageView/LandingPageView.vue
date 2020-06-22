<template>
  <v-sheet light>
    <HeaderContainer />
    <router-view />
    <FooterContainer />
    <GlobalElementsContainer />
    <GlobalModalContainer />
    <GlobalOverlayContainer />
  </v-sheet>
</template>

<script>
import HeaderContainer from '@/web/containers/HeaderContainer';
import FooterContainer from '@/web/containers/FooterContainer';
import GlobalElementsContainer from '@/web/containers/GlobalElementsContainer';
import GlobalModalContainer from '@/web/containers/GlobalModalContainer';
import GlobalOverlayContainer from '@/web/containers/GlobalOverlayContainer';

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
