<template>
  <div>
    <HeaderContainer />
    <router-view />
    <FooterContainer />
    <GlobalElementsContainer />
    <GlobalModalContainer />
  </div>
</template>

<script>
import HeaderContainer from '@/containers/HeaderContainer';
import FooterContainer from '@/containers/FooterContainer';
import GlobalElementsContainer from '@/containers/GlobalElementsContainer';
import GlobalModalContainer from '@/containers/GlobalModalContainer';

export default {
  name: 'LandingPages',
  components: {
    HeaderContainer,
    FooterContainer,
    GlobalElementsContainer,
    GlobalModalContainer
  }
};
</script>
