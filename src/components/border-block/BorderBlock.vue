<template>
  <div
    :class="[
      $vuetify.theme.dark ? 'box-shadow-dark' : 'box-shadow-light',
      smBorder ? 'sm-border' : '',
      mdBorder ? 'md-border' : '',
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
    mdBorder: {
      default: false,
      type: Boolean
    },
    smBorder: {
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
.sm-border {
  border: 1px solid var(--v-inputBorder-base);
  border-radius: 5px;
}
.md-border {
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
