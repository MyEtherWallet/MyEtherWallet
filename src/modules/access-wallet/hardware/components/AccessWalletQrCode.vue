<template>
  <v-sheet
    :outlined="true"
    color="white"
    :rounded="true"
    :max-width="740"
    :min-width="475"
    :min-height="340"
  >
    <v-container>
      <v-row align="center" justify="center">
        <v-col cols="9">
          <p v-if="onXwallet" class="mew-heading-3 pa-3">
            Please use Pundi X Savings account to scan the QR code below.
          </p>
          <p v-else class="mew-heading-3">
            Please use FINNEY to scan the QR code below.
          </p>
          <v-row align="center" justify="center">
            <vue-qrcode :value="qrCode" :options="{ size: 186 }" />
          </v-row>
          <v-row v-show="onXwallet" align="center" justify="space-around">
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
          </v-row>
        </v-col>
      </v-row>
    </v-container>
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
