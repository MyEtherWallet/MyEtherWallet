<template>
  <div class="enkrypt-not-found-snackbar">
    <v-snackbar
      :value="show"
      vertical
      width="360px"
      min-width="360px"
      height="212px"
      right
      light
      transition="scale-transition"
      :timeout="-1"
      multi-line
    >
      <div
        class="enkrypt-not-found-content-container pa-6 height--full width--full d-flex flex-column"
      >
        <div class="d-flex justify-space-between align-center">
          <img
            alt="enkrypt logo"
            src="@/assets/images/icons/enkrypt/icon-enkrypt-colored.svg"
            height="20px"
          />
          <v-icon class="cursor--pointer" medium @click="emitClose"
            >mdi-close</v-icon
          >
        </div>
        <div class="mew-heading-4">
          Please install Enkrypt or enable it in your <br />
          browser
        </div>
        <div>
          <mew-button
            class="extension-btn mt-5"
            :has-full-width="true"
            btn-size="large"
            color-theme="#7E44F2"
            @click.native="openEnkrypt"
          >
            <img class="mr-3" width="25px" height="25px" :src="browserLogo" />
            Get the Enkrypt Extension
          </mew-button>
        </div>
      </div>
    </v-snackbar>
  </div>
</template>

<script>
import enkryptMarketing from '@/core/mixins/enkryptMarketing.mixin.js';
export default {
  mixins: [enkryptMarketing],
  props: {
    show: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {};
  },
  computed: {},
  mounted() {},
  methods: {
    emitClose() {
      this.$emit('closeEnkryptMissingSnackbar');
    }
  }
};
</script>

<style lang="css" scoped>
.enkrypt-not-found-content-container {
  justify-content: space-evenly;
}

.extension-btn {
  background: conic-gradient(
    from 186.32deg at 112.5% -13.75%,
    #c549ff -284.63deg,
    #704bff 0deg,
    #c549ff 75.37deg,
    #704bff 360deg
  ) !important;

  box-shadow: 0px 25px 10px rgba(89, 0, 255, 0.01),
    0px 14px 8px rgba(89, 0, 255, 0.05), 0px 6px 6px rgba(89, 0, 255, 0.09),
    0px 2px 3px rgba(89, 0, 255, 0.1), 0px 0px 0px rgba(89, 0, 255, 0.1);
  border-radius: 32px !important;
}
</style>

<style lang="scss">
.enkrypt-not-found-snackbar {
  .v-snack {
    right: 80px !important;
  }

  .v-snack__content {
    padding: 0 !important;
    width: 100% !important;
  }
}
</style>
