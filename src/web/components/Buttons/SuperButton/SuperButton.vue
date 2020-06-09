<template>
  <div class="mew6-component--super-button">
    <v-sheet class="text-transform--initial pa-10" :to="to">
      <slot />
    </v-sheet>
  </div>
</template>

<script>
export default {
  props: { to: { default: () => {}, type: Object } },
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
</style>
