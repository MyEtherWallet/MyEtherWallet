<template>
  <v-sheet
    color="white"
    :rounded="true"
    class="pa-5"
    width="100%"
    max-width="400px"
  >
    <p v-if="onXwallet" class="mew-heading-3 pa-3">
      Please use Pundi X Savings account to scan the QR code below.
    </p>
    <p v-else class="mew-heading-3 pa-3">
      Please use FINNEY to scan the QR code below.
    </p>
    <div align="center" justify="center" class="px-sm-12">
      <qr-code :data="qrCode" :height="300" :width="300" style="width: 100%" />
    </div>
    <div v-show="onXwallet" align="center" justify="space-around" class="mt-5">
      <a
        href="https://apps.apple.com/us/app/xwallet-by-pundi-x/id1321754661"
        target="_blank"
        class="mr-1"
      >
        <img
          src="@/assets/images/icons/button-app-store.svg"
          alt="Apple app store"
          height="35"
        />
      </a>
      <a
        href="https://play.google.com/store/apps/details?id=com.pundix.xwallet&hl=en_US"
        target="_blank"
      >
        <img
          src="@/assets/images/icons/button-play-store.svg"
          alt="Google play store"
          height="35"
        />
      </a>
    </div>
  </v-sheet>
</template>

<script>
export default {
  props: {
    qrCode: {
      type: String,
      default: ''
    },
    onXwallet: {
      type: Boolean,
      default: false
    }
  },
  data() {}
};
</script>
