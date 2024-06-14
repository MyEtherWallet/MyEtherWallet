<template>
  <!--
  =====================================================================================
    Mew Copy
  =====================================================================================
  -->
  <div class="mew-component-mew-copy">
    <v-tooltip content-class="tooltip-inner" color="textMedium--text" top>
      <template #activator="{ on }">
        <v-icon
          :small="isSmall"
          :class="['copy-icon cursor-pointer', className]"
          color="textMedium"
          v-on="on"
          @click="copyToClipboard"
        >
          mdi-content-copy
        </v-icon>
      </template>
      <span>{{ tooltip }}</span>
    </v-tooltip>
    <!--
  =====================================================================================
    Success toast
  =====================================================================================
  -->
    <mew-toast
      ref="toast"
      :duration="2000"
      toast-type="success"
      :text="successToast"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import copy from '@/core/helpers/copy.js';
import MewToast from './MewToast.vue';

const props = defineProps({
  /**
   * Pass a class to change the icon color (i.e error--text).
   */
  className: {
    type: String,
    default: ''
  },
  /**
   * Makes the icon smaller.
   */
  isSmall: {
    type: Boolean,
    default: false
  },
  /**
   * Pass the value you would like to copy.
   */
  copyValue: {
    type: String,
    default: ''
  },
  /**
   * The tooltip text.
   */
  tooltip: {
    type: String,
    default: 'Copy'
  },
  /**
   * The toast text after successfully copying.
   */
  successToast: {
    type: String,
    default: 'Copied!'
  }
});

// data
const toast = ref(null);

// method
const copyToClipboard = () => {
  copy(props.copyValue);
  document.activeElement.blur();
  toast.value.showToast();
};
</script>

<style lang="scss" scoped>
.v-icon.copy-icon {
  &:hover {
    color: var(--v-primary-base) !important;
  }
}
.mew-component-mew-copy {
  .v-icon.v-icon.v-icon--link {
    color: var(--v-textMediumWhite-base) !important;
  }
}
</style>
