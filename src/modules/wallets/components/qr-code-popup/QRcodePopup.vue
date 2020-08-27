<template>
  <v-tooltip right open-delay="0">
    <template v-slot:activator="{ on }">
      <div v-on="on"><slot /></div>
    </template>
    <div class="pa-5 text-center">
      <div class="titlePrimary--text subtitle-1 font-weight-bold mb-2">
        {{ title }}
      </div>
      <vue-qr-code :value="value" :options="{ size: 140 }"></vue-qr-code>
      <v-card flat max-width="160px" class="monospace mt-1">
        {{ value }}
      </v-card>
    </div>
  </v-tooltip>
</template>

<script>
import vueQrCode from '@xkeshi/vue-qrcode';

export default {
  components: { vueQrCode },
  props: {
    title: {
      type: String,
      default: ''
    },
    value: {
      type: String,
      default: ''
    }
  },
  data() {
    return {};
  },
  methods: {}
};
</script>

<style lang="scss" scoped>
.v-tooltip__content {
  opacity: 1 !important;
  background-color: var(--v-mewBg-base);
}

.theme--light .v-tooltip__content {
  box-shadow: 0 0 20px #00000040;
}
.theme--dark .v-tooltip__content {
  box-shadow: 0 0 20px #ffffff40;
}
</style>
