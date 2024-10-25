<template>
  <div>
    <the-default-header />
    <v-main>
      <router-view />
    </v-main>
    <the-default-footer />
    <the-enkrypt-popup v-if="!isOfflineApp" :show="enkryptLandingPopup" />
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'TheDefaultView',
  components: {
    TheDefaultHeader: () => import('./components-default/TheDefaultHeader'),
    TheDefaultFooter: () => import('./components-default/TheDefaultFooter'),
    TheEnkryptPopup: () => import('./components-default/TheEnkryptPopup')
  },
  computed: {
    ...mapState('popups', ['enkryptLandingPopup']),
    ...mapState('wallet', ['isOfflineApp'])
  }
};
</script>
