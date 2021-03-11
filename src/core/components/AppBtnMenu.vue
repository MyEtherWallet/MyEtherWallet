<template>
  <v-btn icon @click="menuMethod">
    <img src="@/assets/images/icons/icon-menu.svg" />
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
    }
  }
};
</script>
