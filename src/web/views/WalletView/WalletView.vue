<template>
  <v-sheet color="bg_wallet">
    <div class="d-flex align-stretch">
      <SideMenu class="box-shadow" />
      <div class="flex-grow-1 pb-10">
        <v-container>
          <Header />
          <router-view />
        </v-container>
      </div>
    </div>

    <Footer />
  </v-sheet>
</template>

<script>
import SideMenu from './components/SideMenu';
import Header from './components/Header';
import Footer from './components/Footer';

export default {
  components: { SideMenu, Header, Footer }
};
</script>
