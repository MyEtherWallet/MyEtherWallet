<template>
  <v-sheet>
    <header-home />
    <router-view />
    <footer-home />
  </v-sheet>
</template>

<script>
import headerHome from './components/header/Header';
import footerHome from './components/footer/Footer';

import Toast from '@/components/toast';
export default {
  name: 'Navigation',
  components: {
    headerHome,
    footerHome
  },
  mounted() {
    Toast('hello!', {}, 'success');
  }
};
</script>
