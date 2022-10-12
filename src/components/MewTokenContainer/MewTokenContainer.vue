<template>
  <!-- ===================================================================================== -->
  <!-- Mew Token Container -->
  <!-- ===================================================================================== -->
  <div
    class="mew-token-container d-flex align-center justify-center"
    :class="tokenBorder ? 'token-border' : ''"
    :style="{ height: `${getSize}`, width: `${getSize}` }"
  >
    <!-- ===================================================================================== -->
    <!-- Loading State -->
    <!-- ===================================================================================== -->
    <v-skeleton-loader
      v-if="loading"
      class="token-skeleton"
      :height="getSize"
      :width="getSize"
      type="avatar"
    />

    <!-- ===================================================================================== -->
    <!-- Img -->
    <!-- ===================================================================================== -->
    <img
      v-if="!loading && img"
      :style="{ height: `${getSize}`, width: `${getSize}` }"
      :src="img || ethTokenPlaceholder"
      :alt="name"
      loading="lazy"
    />

    <!-- ===================================================================================== -->
    <!-- Img Placeholder -->
    <!-- ===================================================================================== -->
    <span
      v-if="!loading && !img"
      :class="[
        'd-flex align-center justify-center full-height textLight--text text-uppercase font-weight-medium',
        getFontClass
      ]"
    >
      {{ getPlaceholderText }}
    </span>
  </div>
</template>

<script>
import ethTokenPlaceholder from '@/assets/images/icons/eth.svg';

export default {
  name: 'MewTokenContainer',
  props: {
    /**
     * Turns on loading state if true.
     */
    loading: {
      type: Boolean,
      default: false
    },
    /**
     * Accepts small, medium or large sizes.
     */
    size: {
      type: String,
      default: 'small'
    },
    // borderSize: {
    //   type: String,
    //   default: '',
    // },
    /**
     * Token name. Used for placeholder if there is no icon img.
     */
    name: {
      type: String,
      default: 'MEW'
    },
    /**
     * Token Icon img src
     */
    img: {
      type: [String, Array],
      default: ''
    },
    /**
     * Add border
     */
    tokenBorder: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      ethTokenPlaceholder,
      sizeOptions: {
        small: 'small',
        medium: 'medium',
        large: 'large'
      }
    };
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

      if (this.size.toLowerCase() === this.sizeOptions.large) {
        return '52px';
      }

      return this.size;
    }
  }
};
</script>

<style lang="scss">
/**
  * has to be global styles to override vuetify
  */
.mew-token-container {
  overflow: hidden;
  background-color: var(--v-white-base);
  border-radius: 50%;
  box-shadow: inset 0px 0px 2px rgba(0, 0, 0, 0.3);

  &.token-border {
    box-shadow: 0px 1px 3px rgba(0, 0, 0, 0.6);
  }

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
