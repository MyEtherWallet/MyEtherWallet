<template>
  <div class="home--enkrypt" :class="isMobile ? '' : 'bg'">
    <v-container class="product-info-container">
      <v-row class="justify-space-between">
        <v-col
          cols="12"
          md="5"
          class="product-contexts"
          :style="
            isMobile
              ? 'padding-top: 70px'
              : 'padding-top: 100px; padding-bottom: 100px'
          "
        >
          <img
            src="@/assets/images/icons/icon-enkrypt-full-logo.svg"
            alt="Enkrypt"
            height="28"
            class="mb-4"
          />
          <div class="text-title mb-5">
            Enkrypt - MEW's mulitchain browser extension
          </div>
          <div class="text-subtitle mb-10">
            Use thousands of web3 apps across multiple networks, buy crypto,
            swap tokens, and manage your NFTs. Welcome to the multichain future.
          </div>

          <a
            href="https://chrome.google.com/webstore/category/extensions"
            target="_blank"
          >
            <mew-button
              class="download-button"
              color-theme="#7E44F2"
              style="border-radius: 100px !important"
              btn-size="large"
            >
              <img
                src="@/assets/images/icons/icon-chrome.svg"
                alt="Chrome"
                height="25"
                class="mr-2"
              />
              <span class="font-weight-bold"> Get the extension </span>
            </mew-button>
          </a>
        </v-col>

        <v-col cols="12" md="7" class="product-images">
          <img
            class="cx-previews"
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
export default {
  name: 'HomeEnkrypt',
  components: {},
  data: () => ({}),
  computed: {
    isMobile() {
      return this.$vuetify.breakpoint.smAndDown;
    }
  }
};
</script>

<style lang="scss" scoped>
.home--enkrypt {
  margin-top: -88px;
  background-color: var(--v-backgroundGrey-base);

  &.bg {
    background-image: url('~@/assets/images/snippets/snippet-circle-blue.svg');
    background-position: top -626px right -304px;
    background-size: 1130px;
  }
}
.product-info-container {
}
.product-contexts {
  .text-title {
    font-size: 48px;
    font-weight: 700;
    line-height: 64px;
    letter-spacing: 0px;
  }
  .text-subtitle {
    font-size: 18px;
  }
  .download-button {
    img {
      border: 2px solid white;
      border-radius: 50%;
    }
  }
}

.product-images {
  position: relative;
  .cx-previews {
  }
}
</style>
