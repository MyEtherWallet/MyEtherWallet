<template>
  <v-sheet>
    <SideMenu />
    <div>contents</div>
  </v-sheet>
</template>

<script>
import SideMenu from './components/SideMenu';
export default {
  name: 'AccessWallet',
  components: { SideMenu },
  props: {
    //title: { default: '', type: String }
  }
};
</script>

<style lang="scss">
//@import '@/assets/styles/GlobalVariables';
</style>
