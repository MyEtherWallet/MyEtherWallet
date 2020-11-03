<template>
  <div
    :class="[
      smBorderRadius ? 'sm-border-radius' : '',
      mdBorderRadius ? 'md-border-radius' : '',
      smShadow ? 'sm-shadow' : '',
      mdShadow ? 'md-shadow' : '',
      maxHeight ? 'py-1 pr-1' : ''
    ]"
  >
    <div :style="cssVars" class="custom-scroll-bar max-height">
      <slot />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    smBorderRadius: {
      default: false,
      type: Boolean
    },
    mdBorderRadius: {
      default: false,
      type: Boolean
    },
    smShadow: {
      default: false,
      type: Boolean
    },
    mdShadow: {
      default: false,
      type: Boolean
    },
    maxHeight: {
      default: '',
      type: String
    }
  },
  data() {
    return {};
  },
  computed: {
    cssVars() {
      return {
        '--max-height': this.maxHeight
      };
    }
  }
};
</script>

<style lang="scss" scoped>
.sm-border-radius {
  border: 1px solid var(--v-inputBorder-base);
  border-radius: 5px;
}
.md-border-radius {
  border: 1px solid var(--v-inputBorder-base);
  border-radius: 10px;
}
.sm-shadow {
  box-shadow: 0 5px 15px var(--v-boxShadow-base) !important;
}
.md-shadow {
  box-shadow: 0 10px 15px var(--v-boxShadow-base) !important;
}

.max-height {
  max-height: var(--max-height);
  overflow: auto;
}
</style>
