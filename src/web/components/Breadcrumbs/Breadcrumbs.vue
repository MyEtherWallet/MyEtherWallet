<template>
  <div
    id="id-1ce09f2641edde7fee0d8ec392015a45"
    class="d-flex align-center pb-7"
  >
    <v-icon class="icon-home mr-2" color="emerald lighten-1"
      >mdi-home-outline</v-icon
    >
    <v-breadcrumbs :items="items">
      <template v-slot:divider>
        <v-icon class="icon-arrow" color="emerald">mdi-greater-than</v-icon>
      </template>
    </v-breadcrumbs>
  </div>
</template>

<script>
export default {
  props: {
    items: {
      default: function () {
        return [];
      },
      type: Array
    }
  },
  data: () => ({})
};
</script>

<style lang="scss">
#id-1ce09f2641edde7fee0d8ec392015a45 {
  .v-breadcrumbs__divider {
    padding: 0 5px;
  }
  .v-breadcrumbs__item--disabled {
    color: var(--v-text_default-base);
  }
}
</style>

<style lang="scss" scoped>
.v-breadcrumbs {
  padding: 0;
}

.icon-home {
  font-size: 20px !important;
}

.icon-arrow {
  font-size: 14px !important;
}
</style>
