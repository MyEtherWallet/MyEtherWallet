<template>
  <div class="features">
    <SideMenu class="left-sidemenu" />
    <v-container>
      <div>top</div>
      <div class="d-flex">
        <div class="feature-content">
          <router-view />
        </div>
        <div class="right-side-info-bar">side</div>
      </div>
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

.right-side-info-bar {
  width: 200px;
}
</style>
