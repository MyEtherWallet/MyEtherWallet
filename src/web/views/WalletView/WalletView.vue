<template>
  <v-sheet color="bg_wallet">
    <div class="d-flex align-stretch">
      <SideMenu class="box-shadow" />
      <div class="flex-grow-1 d-flex flex-column justify-space-between">
        <v-container>
          <Header />
          <router-view />
        </v-container>

        <Footer class="mt-10" />
      </div>
    </div>
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
