<template>
  <v-bottom-sheet v-model="bottomSheetShow" :hide-overlay="hideOverlay">
    <v-sheet class="text-center py-7 position--relative">
      <slot />
      <v-btn
        icon
        color="text_default"
        class="close-button"
        @click="bottomSheetShow = !bottomSheetShow"
      >
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-sheet>
  </v-bottom-sheet>
</template>

<script>
export default {
  components: {},
  props: {
    show: { default: false, type: Boolean },
    hideOverlay: { default: false, type: Boolean }
  },
  data() {
    return { bottomSheetShow: false };
  },
  mounted() {
    this.bottomSheetShow = this.show;
  }
};
</script>

<style lang="scss" scoped>
.close-button {
  position: absolute;
  right: 30px;
  top: 0;
  bottom: 0;
  margin: auto 0;
}
</style>
