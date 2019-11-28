<template>
  <v-app>
    <ModalContainer />
    <HeaderContainer />
    <v-content>
      <router-view />
    </v-content>
    <FooterContainer />
    <GlobalElementsContainer />
  </v-app>
</template>

<script>
import ModalContainer from '@/containers/ModalContainer';
import HeaderContainer from '@/containers/HeaderContainer';
import FooterContainer from '@/containers/FooterContainer';
import GlobalElementsContainer from '@/containers/GlobalElementsContainer';

export default {
  name: 'App',
  components: {
    ModalContainer,
    HeaderContainer,
    FooterContainer,
    GlobalElementsContainer
  },
  data: () => ({})
};
</script>

<style lang="scss">
@import '@/assets/styles/GlobalVariables.scss';
@import '@/assets/styles/GlobalStyles.scss';
</style>
