<template>
  <div class="enkrypt-not-found-snackbar">
    <mew-popup
      :show="show"
      :has-buttons="false"
      :has-title="false"
      :has-padding="false"
      :left-btn="leftBtn"
      max-width="360"
      has-body-content
      class="popup"
    >
      <div
        class="enkrypt-not-found-content-container pb-6 px-6 height--full width--full d-flex flex-column"
      >
        <div class="d-flex align-center">
          <img
            alt="enkrypt logo"
            src="@/assets/images/icons/enkrypt/icon-enkrypt-colored.svg"
            height="20px"
          />
        </div>
        <div class="mew-heading-4 mt-5">
          Please install Enkrypt or enable it in your <br />
          browser
        </div>
        <div>
          <mew-button
            class="extension-btn mt-5 text-transform--none"
            :has-full-width="true"
            btn-size="large"
            color-theme="#7E44F2"
            style="border-radius: 40px !important"
            @click.native="downloadAndClose"
          >
            <img class="mr-3" width="25px" height="25px" :src="browserLogo" />
            {{ text }}
          </mew-button>
        </div>
      </div>
    </mew-popup>
  </div>
</template>

<script setup>
import { defineProps, defineEmits, computed } from 'vue';

import { useEnkryptMarketing } from '@/core/composables/enkryptMarketing';

const emit = defineEmits(['closeEnkryptMissingSnackbar']);

// injections
const { browserLogo, openEnkrypt } = useEnkryptMarketing();

// props
defineProps({
  show: {
    type: Boolean,
    default: false
  }
});

// computed
const leftBtn = computed(() => {
  return {
    text: 'Cancel',
    color: 'basic',
    method: emitClose
  };
});

// methods
const emitClose = () => {
  emit('closeEnkryptMissingSnackbar');
};

const downloadAndClose = () => {
  openEnkrypt();
  emitClose();
};
</script>

<style lang="scss" scoped>
.enkrypt-not-found-content-container {
  justify-content: space-evenly;
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
