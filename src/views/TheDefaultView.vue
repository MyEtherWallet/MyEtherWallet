<template>
  <div>
    <the-default-header @openMobileMenu="handleOpen" />
    <v-main class="js-body">
      <router-view />
    </v-main>
    <the-default-footer />
    <the-mobile-menu :is-open="mobileOpen" @closeMobileMenu="handleClose" />
    <gdpr-banner />
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
    TheEnkryptPopup: () => import('./components-default/TheEnkryptPopup'),
    GdprBanner: () => import('./components-default/GDPRBanner')
  },
  data() {
    return {
      mobileOpen: false
    };
  },
  computed: {
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
