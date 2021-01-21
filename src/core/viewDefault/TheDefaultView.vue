<template>
  <v-sheet>
    <the-default-header />
    <router-view />
    <the-default-footer />
  </v-sheet>
</template>

<script>
import TheDefaultHeader from './components/TheDefaultHeader';
import TheDefaultFooter from './components/TheDefaultFooter';

export default {
  name: 'TheDefaultView',
  components: {
    TheDefaultHeader,
    TheDefaultFooter
  }
};
</script>
