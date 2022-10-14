<template>
  <div class="enkrypt-promo-snackbar">
    <v-snackbar
      :value="enkryptWalletSnackbar"
      max-width="380px"
      min-width="auto"
      :timeout="-1"
      light
      left
      rounded
      transition="scale-transition"
      class="pl-sm-5"
    >
      <!-- ============================================================================== -->
      <!-- Close button -->
      <!-- ============================================================================== -->
      <v-btn class="close-button" icon>
        <v-icon
          class="cursor--pointer"
          medium
          color="greyMedium"
          @click="closeSnackbar"
        >
          mdi-close
        </v-icon>
      </v-btn>

      <div class="pa-6">
        <img
          class="mb-6"
          alt="enkrypt logo"
          src="@/assets/images/icons/enkrypt/icon-enkrypt-colored.svg"
          height="20px"
        />

        <div class="mew-body mb-6 mb-sm-7">
          Access your wallet and switch accounts in seconds with our official
          browser extension
        </div>

        <div
          class="btn-container d-flex flex-column-reverse flex-sm-row justify-space-between align-center"
        >
          <mew-button
            class="ml-sm-n4 mt-1 mt-sm-0"
            color-theme="#939fb9"
            btn-style="transparent"
            @click.native="openHelpCenter"
            >Learn More</mew-button
          >
          <mew-button
            class="extension-btn"
            style="border-radius: 40px !important"
            color-theme="#7E44F2"
            @click.native="openEnkrypt"
          >
            <img
              class="mr-3"
              :src="browserLogo"
              alt="chrome"
              width="25px"
              height="25px"
            />
            <span class="font-weight-bold"> {{ text }} </span>
          </mew-button>
        </div>
      </div>
    </v-snackbar>
  </div>
</template>
<script>
import { mapActions, mapState } from 'vuex';
import moment from 'moment';

import enkryptMarketing from '@/core/mixins/enkryptMarketing.mixin';
export default {
  mixins: [enkryptMarketing],
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
  },
  methods: {
    ...mapActions('popups', [
      'showEnkryptWalletSnackbar',
      'closeEnkryptWalletSnackbar',
      'enkryptWalletSnackbarCounter'
    ]),
    closeSnackbar() {
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
        moment(new Date()).diff(this.enkryptWalletPopupClosed, 'days') >= 7 &&
        (this.enkryptWalletSnackbarClosed > 0 ||
          moment(new Date()).diff(this.enkryptWalletSnackbarClosed, 'days') >=
            7) &&
        this.enkryptWalletSnackbarCounter <= 3
      ) {
        this.showEnkryptWalletSnackbar();
      }
    }
  }
};
</script>

<style lang="scss">
.enkrypt-promo-snackbar {
  position: relative;
  .v-snack__content {
    padding: 0 !important;
  }
}
</style>

<style lang="scss" scoped>
.btn-container {
  width: 100%;
  height: 100%;
}

.close-button {
  position: absolute;
  top: 15px;
  right: 15px;
}
</style>
