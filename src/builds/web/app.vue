<template>
  <v-app>
    <HeaderContainer />
    <v-content>
      <router-view />
    </v-content>
  </v-app>
</template>

<script>
import HeaderContainer from '@/containers/HeaderContainer';

export default {
  name: 'App',
  components: { HeaderContainer },
  data: () => ({
    //
  })
};
</script>

<style>
i {
  font-family: 'Material Icons';
}
</style>
