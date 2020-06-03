<template>
  <div class="text-center">
    <v-dialog v-model="dialog" width="350px">
      <v-sheet color="bg_wallet" class="mew-logo">
        <div class="text-center pt-10 pb-10">
          <div class="mew-heading-3">WooCommerce Videos</div>
          <div>videos@woocommerce.com</div>
        </div>
      </v-sheet>
    </v-dialog>
  </div>
</template>

<script>
export default {
  props: {
    show: { default: false, type: Boolean }
  },
  data() {
    return { dialog: true };
  },
  watch: {
    show(val) {
      this.dialog = val;
    }
  }
};
</script>

<style lang="scss" scoped>
.mew-logo {
  background-image: url('~@/assets/images/icons/logo-mew-small.png');
  background-position: 10px 10px;
  background-size: 70px;
}
</style>
