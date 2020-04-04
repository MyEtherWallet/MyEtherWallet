<template>
  <v-theme-provider root>
    <v-sheet
      color="componentBackgroundColor1"
      class="white-sheet"
      :class="sideinfo ? 'sideinfo' : ''"
      :style="{
        boxShadow:
          '0 0 15px' + $vuetify.theme.themes[theme].componentShadowColor1
      }"
    >
      <slot />
    </v-sheet>
  </v-theme-provider>
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
