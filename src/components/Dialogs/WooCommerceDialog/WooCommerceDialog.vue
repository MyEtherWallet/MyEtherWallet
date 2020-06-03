<template>
  <div class="text-center">
    <v-dialog v-model="dialog" width="350px">
      <v-sheet color="bg_wallet" class="">
        <div class="text-center title-background">
          <div class="mew-heading-2 pt-12 pb-5 top-title">
            WooCommerce Videos
          </div>
          <div class="py-2 top-email">videos@woocommerce.com</div>
        </div>
        <div>
          <v-btn-toggle v-model="toggle_exclusive" mandatory>
            <v-btn>
              <v-icon>mdi-format-align-left</v-icon>
            </v-btn>
            <v-btn>
              <v-icon>mdi-format-align-center</v-icon>
            </v-btn>
            <v-btn>
              <v-icon>mdi-format-align-right</v-icon>
            </v-btn>
            <v-btn>
              <v-icon>mdi-format-align-justify</v-icon>
            </v-btn>
          </v-btn-toggle>
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
.title-background {
  background-image: linear-gradient(#ffffff, #d1d1d1);
}

.top-title {
  background-image: url('~@/assets/images/icons/logo-mew-small.png');
  background-position: right -30px top -30px;
  background-size: 90px;
  border-bottom: 1px solid #c9c9c9;
}

.top-email {
  border-top: 1px solid white;
}
</style>
