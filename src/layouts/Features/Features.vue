<template>
  <div
    class="features"
    :style="{
      backgroundColor: $vuetify.theme.themes[theme].backgroundColor
    }"
  >
    <div class="d-flex align-stretch">
      <SideMenu />
      <div
        class="wrapper dark"
        :style="{
          borderBottomColor: $vuetify.theme.themes[theme].footerBackgroundColor
        }"
      >
        <v-container>
          <Header />
          <router-view />
        </v-container>

        <v-container class="footer-wrapper">
          <Footer />
        </v-container>
      </div>
    </div>
  </div>
</template>

<script>
import SideMenu from './components/SideMenu';
import Header from './components/Header';
import Footer from './components/Footer';

export default {
  name: 'Features',
  components: { SideMenu, Header, Footer },
  computed: {
    theme() {
      return this.$vuetify.theme.dark ? 'dark' : 'light';
    }
  }
};
</script>

<style lang="scss" scoped>
@import '@/assets/styles/GlobalVariables.scss';

.wrapper {
  position: relative;
  width: 100%;
  border-bottom: 60px solid;
  padding-bottom: 40px;

  &.dark {
    box-shadow: 0 10px 20px black;
  }
}

.footer-wrapper {
  position: absolute;
  left: 0;
  right: 0;
  bottom: -55px;
}
</style>
