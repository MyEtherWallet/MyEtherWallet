<template>
  <div class="mew6-component--super-button">
    <v-sheet
      :color="outlined ? 'transparent' : 'white'"
      class="text-transform--initial pa-10"
      :class="outlined ? 'outlined' : ''"
      :to="to"
    >
      <slot />
    </v-sheet>
  </div>
</template>

<script>
export default {
  props: {
    to: { default: () => {}, type: Object },
    outlined: { default: false, type: Boolean }
  },
  data() {
    return {};
  }
};
</script>

<style lang="scss" scoped>
.mew6-component--super-button {
  .v-sheet {
    border-radius: 10px;
  }
}
.mew6-component--super-button .outlined {
  border-left-color: white !important;
  border-right-color: white !important;
  border-top-color: white !important;
  border-bottom-color: white !important;
  border: 1px solid white;
}
</style>
