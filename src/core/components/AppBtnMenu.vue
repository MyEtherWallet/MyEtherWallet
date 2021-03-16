<template>
  <v-btn icon :large="large" :x-large="xLarge" @click="menuMethod">
    <img
      src="@/assets/images/icons/icon-menu.svg"
      :height="height ? height : ''"
    />
  </v-btn>
</template>
<script>
export default {
  name: 'AppBtnMenu',
  props: {
    menuMethod: {
      type: Function,
      default: function () {
        return {};
      }
    },
    height: {
      type: String,
      default: undefined
    },
    large: {
      type: Boolean,
      default: false
    },
    xLarge: {
      type: Boolean,
      default: false
    }
  }
};
</script>
