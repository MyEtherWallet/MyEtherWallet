<template>
  <div
    class="features"
    :style="{
      backgroundColor: $vuetify.theme.themes[theme].backgroundColor
    }"
  >
    <div class="d-flex align-stretch">
      <SideMenu class="side-menu-element" />
      <div
        class="wrapper"
        :style="{
          borderBottomColor: $vuetify.theme.themes[theme].footerBackgroundColor
        }"
      >
        <v-container class="position--relative">
          <Header />
          <router-view />
        </v-container>
      </div>
    </div>
    <Footer />
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

.side-menu-element {
  box-shadow: 0 0 20px #0000002f;
}

.wrapper {
  position: relative;
  width: 100%;
}
</style>
