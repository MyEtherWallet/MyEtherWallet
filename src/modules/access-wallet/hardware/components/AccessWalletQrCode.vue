<template>
  <v-sheet color="white" :rounded="true" class="pa-5">
    <p v-if="onXwallet" class="mew-heading-3 pa-3">
      Please use Pundi X Savings account to scan the QR code below.
    </p>
    <p v-else class="mew-heading-3">
      Please use FINNEY to scan the QR code below.
    </p>
    <div align="center" justify="center">
      <vue-qrcode
        :value="qrCode"
        :options="{ size: 200 }"
        style="width: 100%"
      />
    </div>
    <div v-show="onXwallet" align="center" justify="space-around">
      <a
        href="https://apps.apple.com/us/app/xwallet-by-pundi-x/id1321754661"
        target="_blank"
      >
        <img
          src="@/assets/images/icons/button-app-store.png"
          alt="Apple app store"
          height="50"
        />
      </a>
      <a
        href="https://play.google.com/store/apps/details?id=com.pundix.xwallet&hl=en_US"
      >
        <img
          src="@/assets/images/icons/button-play-store.png"
          alt="Google play store"
          height="50"
        />
      </a>
    </div>
  </v-sheet>
</template>

<script>
import vueQrcode from '@xkeshi/vue-qrcode';

export default {
  components: { vueQrcode },
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
