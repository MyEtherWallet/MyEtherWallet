<template>
  <v-tooltip right open-delay="0">
    <template v-slot:activator="{ on }">
      <div v-on="on"><slot /></div>
    </template>
    <div class="pa-5 text-center">
      <div class="subtitle-1 font-weight-bold mb-0">{{ title }}</div>
      <VueQrcode :value="value" :options="{ size: 140 }"></VueQrcode>
      <v-card flat max-width="160px" class="monospace mt-1">
        {{ value }}
      </v-card>
    </div>
  </v-tooltip>
</template>

<script>
import VueQrcode from '@xkeshi/vue-qrcode';

export default {
  components: { VueQrcode },
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
.theme--light .v-tooltip__content {
  color: #383838;
  background: white;
  box-shadow: 0 0 20px #00000040;
  opacity: 1 !important;
}
.theme--dark .v-tooltip__content {
  color: White;
  background: black;
  box-shadow: 0 0 20px #ffffff40;
  opacity: 1 !important;
}
</style>
