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
import TheDefaultHeader from './components-default/TheDefaultHeader';
import TheDefaultFooter from './components-default/TheDefaultFooter';
import TheEnkryptPopup from './components-default/TheEnkryptPopup';
import { mapState } from 'vuex';
export default {
  name: 'TheDefaultView',
  components: {
    TheDefaultHeader,
    TheDefaultFooter,
    TheEnkryptPopup
  },
  computed: {
    ...mapState('popups', ['enkryptLandingPopup']),
    ...mapState('wallet', ['isOfflineApp'])
  }
};
</script>
