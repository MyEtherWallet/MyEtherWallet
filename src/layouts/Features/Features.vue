<template>
  <div class="features">
    <div class="d-flex align-stretch">
      <SideMenu />
      <div class="wrapper">
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
  components: { SideMenu, Header, Footer }
};
</script>

<style lang="scss" scoped>
@import '@/assets/styles/GlobalVariables.scss';

.features {
  background-color: $primary-silver;
}

.wrapper {
  position: relative;
  width: 100%;
  height: 100vh;
  border-bottom: 60px solid white;
  padding-bottom: 60px;
}

.footer-wrapper {
  position: absolute;
  left: 0;
  right: 0;
  bottom: -55px;
}
</style>
