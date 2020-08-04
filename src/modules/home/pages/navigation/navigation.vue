<template>
  <v-sheet>
    <header-home />
    <router-view />
    <footer-home />
  </v-sheet>
</template>

<script>
import headerHome from './components/header';
import footerHome from './components/footer';

export default {
  name: 'Navigation',
  components: {
    headerHome,
    footerHome
  }
};
</script>
