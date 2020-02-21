<template>
  <div class="features">
    <SideMenu class="left-sidemenu" />
    <v-container>
      <Header />
      <router-view />
    </v-container>
    <Footer v-if="false" class="component-footer" />
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
  height: 100%;
  position: relative;
}

.left-sidemenu {
  position: absolute;
  top: 0;
  left: 0;
}

.component-footer {
  position: absolute;
  bottom: 0px;
  left: 0px;
}
</style>
