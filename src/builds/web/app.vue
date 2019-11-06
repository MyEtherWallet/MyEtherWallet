<template>
  <v-app>
    <HeaderContainer />
    <v-content>
      <router-view />
    </v-content>
    <FooterContainer />
  </v-app>
</template>

<script>
import HeaderContainer from '@/containers/HeaderContainer';
import FooterContainer from '@/containers/FooterContainer';

export default {
  name: 'App',
  components: { HeaderContainer, FooterContainer },
  data: () => ({
    //
  })
};
</script>

<style lang="scss">
@import '@/assets/styles/GlobalVariables.scss';
@import '@/assets/styles/GlobalStyles.scss';
</style>
