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
        <v-sheet width="300px" color="transparent" class="mx-auto">
          <div
            class="d-flex align-center justify-center pt-7 pb-4 mew-component--woo-commerce"
          >
            <v-btn-toggle v-model="toggle_exclusive" mandatory>
              <v-btn small class="btn text-transform--initial">
                Card
              </v-btn>
              <v-btn small class="btn text-transform--initial">
                Bitcoin
              </v-btn>
            </v-btn-toggle>
          </div>
          <div>
            <v-text-field
              label="Card number"
              height="20px"
              outlined
              prepend-inner-icon="mdi-credit-card-outline"
              hide-details
            ></v-text-field>
          </div>
          <div class="d-flex">
            <v-text-field
              label="MM/YY"
              height="20px"
              outlined
              prepend-inner-icon="mdi-calendar-blank"
              hide-details
            ></v-text-field>
            <v-text-field
              label="CVC"
              height="20px"
              outlined
              prepend-inner-icon="mdi-lock-outline"
              hide-details
            ></v-text-field>
          </div>
          <div class="remember px-3 mt-5">
            <v-checkbox v-model="checkbox1" label="Remember me"></v-checkbox>
          </div>
          <div class="py-8 d-flex align-center justify-center">
            <mew-button title="Pay $12.22" />
          </div>
        </v-sheet>
      </v-sheet>
    </v-dialog>
  </div>
</template>

<script>
export default {
  props: {
    open: { default: false, type: Boolean },
    close: {
      default: function () {
        return {};
      },
      type: Function
    }
  },
  data() {
    return { dialog: false, toggle_exclusive: false, checkbox1: false };
  },
  watch: {
    open(val) {
      if (val == true) {
        this.dialog = val;
      }
    },
    dialog(val) {
      if (val == false) {
        this.$store.commit('closeModal', 'walletWooCommerce');
      }
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

.mew-component--woo-commerce .btn {
  min-width: 100px !important;
}

.remember {
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 5px;
}
</style>
