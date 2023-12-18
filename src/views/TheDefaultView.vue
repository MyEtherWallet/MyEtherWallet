<template>
  <div>
    <the-default-header @openMobileMenu="handleOpen" />
    <v-main class="js-body">
      <new-look-banner />
      <router-view />
    </v-main>
    <the-default-footer />
    <the-enkrypt-popup v-if="!isOfflineApp" :show="enkryptLandingPopup" />
    <the-mobile-menu :is-open="mobileOpen" @closeMobileMenu="handleClose" />
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'TheDefaultView',
  components: {
    TheDefaultHeader: () => import('./components-default/TheDefaultHeader'),
    TheMobileMenu: () => import('./components-default/TheMobileMenu'),
    NewLookBanner: () => import('./components-default/NewLookBanner'),
    TheDefaultFooter: () => import('./components-default/TheDefaultFooter'),
    TheEnkryptPopup: () => import('./components-default/TheEnkryptPopup')
  },
  data() {
    return {
      mobileOpen: false
    };
  },
  computed: {
    ...mapState('popups', ['enkryptLandingPopup']),
    ...mapState('wallet', ['isOfflineApp'])
  },
  methods: {
    handleOpen() {
      this.mobileOpen = true;
    },
    handleClose() {
      this.mobileOpen = false;
    }
  }
};
</script>
