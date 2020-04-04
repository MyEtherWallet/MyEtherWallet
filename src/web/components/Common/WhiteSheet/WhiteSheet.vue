<template>
  <v-theme-provider root>
    <v-sheet
      color="bg_white_sheet"
      class="border-radius--10px box-shadow"
      :class="sideinfo ? 'sideinfo' : ''"
    >
      <slot />
    </v-sheet>
  </v-theme-provider>
</template>

<script>
export default {
  props: {
    sideinfo: { default: false, type: Boolean }
  }
};
</script>

<style lang="scss" scoped>
.sideinfo {
  width: 350px;
}
</style>
