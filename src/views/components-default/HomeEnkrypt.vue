<template>
  <div class="home--enkrypt" :class="bgStyle">
    <v-container class="product-info-container">
      <v-row class="justify-space-between">
        <!-- ============================================================================= -->
        <!-- Left section -->
        <!-- ============================================================================= -->
        <v-col
          cols="12"
          md="5"
          class="product-contexts position-relative"
          :style="
            isMobile
              ? 'padding-top: 70px; padding-bottom: 70px'
              : 'padding-top: 100px; padding-bottom: 100px'
          "
        >
          <img
            src="@/assets/images/icons/enkrypt/icon-enkrypt-colored.svg"
            alt="Enkrypt"
            height="28"
            class="mb-4"
          />
          <div class="text-title mb-5">
            Introducing MEW’s multichain wallet extension
          </div>
          <div class="text-subtitle mb-md-10" style="color: #60666d">
            Easily access all you favorite apps across Ethereum and Polkadot
            chains, buy crypto, swap tokens, and manage your NFTs. Welcome to
            the multichain future.
          </div>

          <div class="text-center text-md-left">
            <img
              class="cx-previews-mobile d-inline d-md-none"
              src="@/assets/images/snippets/snippet-cx-previews.png"
              alt="Enkrypt"
            />
            <div>
              <mew-button
                class="extension-btn"
                color-theme="#7E44F2"
                style="border-radius: 100px !important"
                btn-size="large"
                @click.native="openEnkrypt"
              >
                <img
                  :src="browserLogo"
                  :alt="browser"
                  height="25"
                  class="mr-2"
                />
                <span class="font-weight-bold">
                  Install for {{ browser }}
                </span>
              </mew-button>
              <a
                class="text-decoration-underline textSecondary--text ml-5"
                href="https://www.enkrypt.com"
                target="_blank"
                >Learn more</a
              >
            </div>
          </div>
        </v-col>

        <!-- ============================================================================= -->
        <!-- Right section -->
        <!-- ============================================================================= -->
        <v-col cols="12" md="7" class="d-none d-md-block position-relative">
          <img
            src="@/assets/images/snippets/snippet-cx-previews.png"
            alt="Enkrypt"
            :style="
              isMobile
                ? 'width: 100%; margin-top: 0px'
                : 'width: 100%; margin-top: 33px'
            "
          />
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import enkryptMarketing from '@/core/mixins/enkryptMarketing.mixin.js';
export default {
  name: 'HomeEnkrypt',
  components: {},
  mixins: [enkryptMarketing],
  data: () => ({}),
  computed: {
    bgStyle() {
      if (
        this.$vuetify.breakpoint.mdAndUp &&
        this.$vuetify.breakpoint.width < 2300
      ) {
        return 'bgLarge';
      }
      if (this.$vuetify.breakpoint.width >= 2300) {
        return 'bgXLarge';
      }
      return 'bgSmall';
    }
  }
};
</script>

<style lang="css">
.extension-btn {
  background: conic-gradient(
    from 186.32deg at 112.5% -13.75%,
    #c549ff -284.63deg,
    #704bff 0deg,
    #c549ff 75.37deg,
    #704bff 360deg
  ) !important;

  box-shadow: 0px 25px 10px rgba(89, 0, 255, 0.01),
    0px 14px 8px rgba(89, 0, 255, 0.05), 0px 6px 6px rgba(89, 0, 255, 0.09),
    0px 2px 3px rgba(89, 0, 255, 0.1), 0px 0px 0px rgba(89, 0, 255, 0.1);
  border-radius: 32px !important;
}
</style>

<style lang="scss" scoped>
.home--enkrypt {
  background-color: #eeeeee;
  &.bgSmall {
    background-image: url('~@/assets/images/snippets/snippet-circle-blue.svg');
    background-position: top 191px right calc(50% - 415px);
    background-size: 725px;
  }
  &.bgLarge {
    background-image: url('~@/assets/images/snippets/snippet-circle-blue.svg');
    background-position: top -933px right calc(50% - 717px);
    background-size: 1468px;
  }
  &.bgXLarge {
    background-image: url('~@/assets/images/snippets/snippet-circle-blue.svg');
    background-position: top -515px right calc(50% - 550px);
    background-size: 994px;
  }
}
.product-contexts {
  .text-title {
    font-size: 32px;
    font-weight: 700;
    line-height: 44px;
    letter-spacing: 0px;
  }
  .text-subtitle {
    font-size: 18px;
  }
}
.cx-previews-mobile {
  width: 85vw;
}
.position-relative {
  position: relative;
}
.no-line-height {
  line-height: 0;
}
</style>
