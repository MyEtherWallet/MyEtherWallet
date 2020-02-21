<template>
  <div class="features">
    <div class="d-flex align-stretch">
      <SideMenu />
      <div class="wrapper">
        <v-container>
          <Header />
          <router-view />
          <div class="py-7" />
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
  width: 100%;
  border-bottom: 60px solid white;
}

.footer-wrapper {
  margin-bottom: -55px;
}
</style>
