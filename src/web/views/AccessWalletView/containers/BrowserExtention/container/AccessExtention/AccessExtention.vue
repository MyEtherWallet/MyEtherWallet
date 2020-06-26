<template>
  <div class="bg_blue">
    <BlockTitle :data="titleData">
      <h5 class="white--text ma-0">
        Please select a browser from below.
      </h5>
    </BlockTitle>

    <v-sheet color="transparent" max-width="450px" class="mx-auto px-5">
      <mew6-flexible-btn>
        <div class="d-flex align-center justify-center flex-column">
          <div class="d-flex align-center">
            <img
              src="@/assets/images/icons/icon-mew-cx.png"
              alt="MEW Extention"
              height="79"
            />
            <v-icon class="clip mx-4">mdi-attachment</v-icon>
            <img
              src="@/assets/images/icons/logo-mew-small.png"
              alt="MEW Logo"
              height="80"
            />
          </div>
          <h5 class="font-weight-bold text-center mb-0 mt-7">
            Please use MEW on a secure (SSL/HTTPS) connection to connect.
          </h5>
          <mew6-confirm-btn>
            I agree MEW browser extention user
            <a target="_blank" href="https://myetherwallet.com"> Terms</a>.
          </mew6-confirm-btn>
          <mew6-std-btn
            :to="{ name: 'AccessWalletBrowserExtentionAccess', query: {} }"
          >
            Access my wallet
          </mew6-std-btn>
        </div>
      </mew6-flexible-btn>
    </v-sheet>
    <div class="spacer-y-medium" />
  </div>
</template>

<script>
import BlockTitle from '@/web/components/BlockTitle';

export default {
  name: 'CreateNewWallet',
  components: { BlockTitle },
  data() {
    return {
      titleData: {
        textProps: 'white--text',
        toptitle: '',
        title: 'Install browser extention',
        description: '',
        centered: true
      }
    };
  },
  methods: {
    openOverlay(name) {
      this.$store.commit('openOverlay', name);
    }
  }
};
</script>

<style lang="scss" scoped>
.clip {
  font-size: 37px !important;
  color: #bababa;
}
</style>
