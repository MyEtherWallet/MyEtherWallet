<template>
  <div class="expandHeader py-5">
    <v-container class="d-flex align-center">
      <router-link :to="{ name: 'Home', query: {} }">
        <v-img src="@/assets/images/icons/logo-mew.png" max-width="130" />
      </router-link>
      <v-spacer></v-spacer>
      <home-menu class="menu-items" />
      <v-spacer></v-spacer>
      <mew-button
        class="px-2"
        title="MEW tools"
        color-theme="white"
        :has-full-width="false"
        button-size="large"
        btn-style="outline"
        icon="mdi-view-module"
        icon-type="mdi"
        icon-align="left"
      />
    </v-container>
  </div>
</template>

<script>
import homeMenu from '../menu/Menu';

export default {
  name: 'Header',
  components: { homeMenu },
  data: () => ({})
};
</script>

<style lang="scss" scoped>
.menu-items {
  max-width: 500px;
}
</style>
