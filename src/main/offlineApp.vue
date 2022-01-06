<template>
  <v-app class="walletBg">
    <router-view />
    <module-toast />
    <module-global-modals />
  </v-app>
</template>

<script>
import ModuleToast from '@/modules/toast/ModuleToast.vue';
import ModuleGlobalModals from '@/modules/global-modals/ModuleGlobalModals';

export default {
  name: 'App',
  components: { ModuleToast, ModuleGlobalModals },
  mounted() {}
};
</script>

<style lang="scss">
@import '@/assets/styles/GlobalStyles.scss';
@import '@myetherwallet/mew-components/src/assets/styles/global.scss';
</style>
