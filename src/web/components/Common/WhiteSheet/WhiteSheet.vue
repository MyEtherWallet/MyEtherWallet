<template>
  <v-sheet
    color="whiteSheetBackgroundColor"
    class="white-sheet"
    :class="sideinfo ? 'sideinfo' : ''"
    :style="{
      boxShadow: '0 0 20px' + $vuetify.theme.themes[theme].whiteSheetShadowColor
    }"
  >
    <slot />
  </v-sheet>
</template>

<script>
export default {
  props: {
    sideinfo: { default: false, type: Boolean }
  },
  computed: {
    theme() {
      return this.$vuetify.theme.dark ? 'dark' : 'light';
    }
  }
};
</script>

<style lang="scss" scoped>
.white-sheet {
  border-radius: 12px;
}

.sideinfo {
  width: 350px;
}
</style>
