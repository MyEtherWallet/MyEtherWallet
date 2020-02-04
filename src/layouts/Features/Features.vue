<template>
  <div>
    <SideMenu class="sidemenu" />
    <v-container>
      <router-view />
    </v-container>
    <Footer />
  </div>
</template>

<script>
import SideMenu from './components/SideMenu';
import Footer from './components/Footer';

export default {
  name: 'Features',
  components: { Footer, SideMenu }
};
</script>

<style lang="scss" scoped>
.sidemenu {
  position: absolute;
  top: 0;
  left: 0;
}
</style>
