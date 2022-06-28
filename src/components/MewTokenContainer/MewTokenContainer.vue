<template>
  <!--
=====================================================================================
  Mew Token Container 
=====================================================================================
-->
  <div
    :style="'height:' + getSize + ';width:' + getSize"
    class="mew-token-container d-flex align-center justify-center"
  >
    <!--
=====================================================================================
 Loading State
=====================================================================================
-->
    <v-skeleton-loader
      class="token-skeleton"
      v-if="loading"
      :height="getSize"
      :width="getSize"
      type="avatar"
    />
    <!--
=====================================================================================
  Img
=====================================================================================
-->
    <img
      v-if="!loading && img"
      :height="getSize"
      :src="img || ethTokenPlaceholder"
      :alt="name"
      loading="lazy"
    >
    <!--
=====================================================================================
  Img Placeholder
=====================================================================================
-->
    <span
      :class="['d-flex align-center justify-center full-height textLight--text text-uppercase font-weight-medium', getFontClass]"
      v-if="!loading && !img"
    >
      {{ getPlaceholderText }}
    </span>
  </div>
</template>

<script>
import ethTokenPlaceholder from '@/assets/images/icons/eth.svg';

export default {
  name: 'MewTokenContainer',
  data() {
    return {
      ethTokenPlaceholder,
      sizeOptions: {
        small: 'small',
        medium: 'medium',
        large: 'large',
      },
    };
  },
  props: {
    /**
     * Turns on loading state if true.
     */
    loading: {
      type: Boolean,
      default: false,
    },
    /**
     * Accepts small, medium or large sizes.
     */
    size: {
      type: String,
      default: 'small',
    },
    /**
     * Token name. Used for placeholder if there is no icon img.
     */
    name: {
      type: String,
      default: 'MEW',
    },
    /**
     * Token Icon img src
     */
    img: {
      type: [String, Array],
      default: '',
    },
  },
  computed: {
    /**
     * @returns mew typography font class.
     * based on prop size.
     */
    getFontClass() {
      if (this.size.toLowerCase() === this.sizeOptions.small) {
        return 'mew-label';
      }

      if (this.size.toLowerCase() === this.sizeOptions.medium) {
        return 'mew-body';
      }

      return 'mew-heading-1';
    },
    /**
     * @returns placeholder text
     * which is the first two chars of the token name.
     */
    getPlaceholderText() {
      return this.name.slice(0, 2);
    },
    /**
     * @returns size in pxs.
     * returns large as default.
     */
    getSize() {
      if (this.size.toLowerCase() === this.sizeOptions.small) {
        return '24px';
      }

      if (this.size.toLowerCase() === this.sizeOptions.medium) {
        return '32px';
      }

      return '52px';
    },
  },
};
</script>
<style lang="scss" scoped>
.mew-token-container {
  background-color: var(--v-white-base);
  border-radius: 50%;
  box-shadow: inset 0px 0px 2px rgba(25, 33, 51, 0.16);
}
</style>
<style lang="scss">
/**
  * has to be global styles to override vuetify
  */
.mew-token-container {
  .token-skeleton {
    .v-skeleton-loader__avatar {
      background-color: var(--v-greyLight-base);
      max-height: 100%;
      max-width: 100%;
      height: 100%;
      width: 100%;
    }
  }
}
</style>