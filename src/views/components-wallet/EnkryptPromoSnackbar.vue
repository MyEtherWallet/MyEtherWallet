<template>
  <div class="enkrypt-promo-snackbar">
    <v-snackbar
      :value="show"
      width="380px"
      height="200px"
      :timeout="-1"
      light
      left
      rounded
      transition="scale-transition"
      class="pl-5"
    >
      <div class="d-flex flex-column pa-6 justify-space-between height--full">
        <div class="d-flex justify-space-between align-center">
          <img
            alt="enkrypt logo"
            src="@/assets/images/icons/enkrypt/icon-enkrypt-colored.svg"
            height="20px"
          />
          <v-icon class="cursor--pointer" medium @click="closeSnackbar"
            >mdi-close</v-icon
          >
        </div>
        <div class="d-flex justify-space-between mew-body">
          Access your wallet and switch accounts in seconds with our official
          browser extension
        </div>
        <div class="btn-container d-flex justify-space-between align-center">
          <mew-button
            color-theme="#939fb9"
            btn-style="transparent"
            @click.native="openHelpCenter"
            >Learn More</mew-button
          >
          <mew-button
            color-theme="#7E44F2"
            class="extension-btn"
            @click.native="openEnkrypt"
          >
            <img
              class="mr-3"
              :src="browserLogo"
              alt="chrome"
              width="25px"
              height="25px"
            />
            Install Extension
          </mew-button>
        </div>
      </div>
    </v-snackbar>
  </div>
</template>
<script>
import { mapActions, mapState } from 'vuex';

import enkryptMarketing from '@/core/mixins/enkryptMarketing.mixin';
import moment from 'moment';
export default {
  mixins: [enkryptMarketing],
  data() {
    return {
      show: false
    };
  },
  computed: {
    ...mapState('popups', [
      'enkryptWalletPopup',
      'enkryptWalletPopupClosed',
      'enkryptWalletSnackbarClosed',
      'enkryptWalletSnackbar'
    ])
  },
  mounted() {
    this.checkIfShouldShow();
    // (temp) Force show
    this.show = true;
  },
  methods: {
    ...mapActions('popups', [
      'showEnkryptWalletSnackbar',
      'closeEnkryptWalletSnackbar',
      'enkryptWalletSnackbarCounter'
    ]),
    closeSnackbar() {
      this.show = false;
      this.closeEnkryptWalletSnackbar();
    },
    /**
     * checks if the enkrypt wallet ad has been shown
     * and if it has been 7 days since closing
     * and if snackbard has not been closed or 7 days since it was closed
     * and the snacknar has not been shown 3 times
     */
    checkIfShouldShow() {
      if (
        !this.enkryptWalletPopup &&
        moment(this.enkryptWalletPopupClosed).diff(new Date(), 'days') >= 7 &&
        (this.enkryptWalletSnackbarClosed > 0 ||
          moment(this.enkryptWalletSnackbarClosed).diff(new Date(), 'days') >=
            7) &&
        this.enkryptWalletSnackbarCounter <= 3
      ) {
        this.show = true;
        this.showEnkryptWalletSnackbar();
      }
    }
  }
};
</script>
<style lang="scss">
.enkrypt-promo-snackbar {
  .v-snack__content {
    padding: 0 !important;
    width: 100% !important;
    height: 100% !important;
  }
}
</style>
<style lang="scss" scoped>
.btn-container {
  width: 100%;
  height: 40px;
}
</style>
