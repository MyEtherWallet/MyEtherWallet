<template>
  <div class="features">
    <SideMenu class="left-sidemenu" />
    <v-container>
      <Header />
      <div class="d-flex">
        <div class="feature-content">
          <router-view />
        </div>
        <Spacer />
        <SideInfo />
      </div>
      <Footer />
    </v-container>
  </div>
</template>

<script>
import Spacer from '@/components/Common/Spacer';
import SideMenu from './components/SideMenu';
import SideInfo from './components/SideInfo';
import Header from './components/Header';
import Footer from './components/Footer';

export default {
  name: 'Features',
  components: { Spacer, SideMenu, SideInfo, Header, Footer }
};
</script>

<style lang="scss" scoped>
@import '@/assets/styles/GlobalVariables.scss';

.features {
  background-color: $primary-silver;
  height: 100%;
}

.left-sidemenu {
  position: absolute;
  top: 0;
  left: 0;
}

.feature-content {
  flex-grow: 1;
}
</style>
