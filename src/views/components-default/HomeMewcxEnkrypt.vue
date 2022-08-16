<template>
  <div>
    <v-container class="home--mewcx-enkrypt text-center py-15 px-5">
      <img
        src="@/assets/images/icons/logo-mew-dark.svg"
        alt="MEW logo"
        height="35"
      />

      <div
        class="block-bold block-title"
        :class="isMobile ? 'mobile my-9' : 'mt-10 mb-11'"
      >
        MEWcx is now Enkrypt
      </div>

      <div class="mb-15">
        <a href="https://www.enkrypt.com/" target="_blank">
          <mew-button
            class="extension-btn"
            color-theme="#7E44F2"
            style="border-radius: 100px !important"
            :btn-size="isMobile ? 'large' : 'xlarge'"
          >
            <div
              class="text-transform--none font-weight-bold"
              :class="isMobile ? 'mew-heading-3' : 'goto-btn'"
            >
              Go to Enkrypt.com
            </div>
          </mew-button>
        </a>
      </div>

      <img
        style="max-width: 800px; width: 100%"
        src="@/assets/images/snippets/enkrypt-interface.jpg"
        alt="Enkrypt interface"
      />
    </v-container>

    <div class="banner-content py-12 px-7 text-center">
      <div class="white--text banner-text mx-auto text-center mb-6">
        We've upgraded and improved everything that MEWcx had to offer! Install
        Enkrypt, our multichain browser extension!
      </div>
      <a href="https://www.enkrypt.com/" target="_blank">
        <mew-button
          color-theme="white"
          style="border-radius: 100px !important"
          btn-size="large"
        >
          <div class="text-transform--none black--text font-weight-bold">
            Go to Enkrypt.com
          </div>
        </mew-button>
      </a>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HomeMewcxEnkrypt',
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
.block-bold {
  font-weight: 900;
}
.block-title {
  font-size: 48px;
  &.mobile {
    font-size: 36px;
    line-height: 46px;
  }
}
.goto-btn {
  font-size: 24px;
}
.banner-content {
  background: linear-gradient(86.81deg, #c549ff -22.41%, #704bff 120.76%);
}
.banner-text {
  font-size: 20px;
  max-width: 600px;
}
</style>
