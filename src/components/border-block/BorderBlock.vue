<template>
  <div
    :class="[
      $vuetify.theme.dark ? 'box-shadow-dark' : 'box-shadow-light',
      smBorderRadius ? 'sm-border-radius' : '',
      mdBorderRadius ? 'md-border-radius' : '',
      smShadow ? 'sm-shadow' : '',
      mdShadow ? 'md-shadow' : ''
    ]"
  >
    <slot />
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
    mdShadow: {
      default: false,
      type: Boolean
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
</style>
