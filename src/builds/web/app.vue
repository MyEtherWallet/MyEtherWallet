<template>
  <v-app>
    <HeaderContainer />
    <v-content>
      <router-view />
    </v-content>
    <FooterContainer />
    <GlobalElementsContainer />
  </v-app>
</template>

<script>
import HeaderContainer from '@/containers/HeaderContainer';
import FooterContainer from '@/containers/FooterContainer';
import GlobalElementsContainer from '@/containers/GlobalElementsContainer';

export default {
  name: 'App',
  components: { HeaderContainer, FooterContainer, GlobalElementsContainer },
  data: () => ({})
};
</script>

<style lang="scss">
@import '@/assets/styles/GlobalVariables.scss';
@import '@/assets/styles/GlobalStyles.scss';
</style>
