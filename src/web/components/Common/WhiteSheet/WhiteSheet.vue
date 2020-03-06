<template>
  <v-sheet
    color="white"
    class="white-sheet"
    :class="sideinfo ? 'sideinfo' : ''"
  >
    <slot />
  </v-sheet>
</template>

<script>
export default {
  props: {
    sideinfo: { default: false, type: Boolean }
  }
};
</script>

<style lang="scss" scoped>
.white-sheet {
  border-radius: 12px;
  box-shadow: 0 0 20px #0000000f;
}

.sideinfo {
  width: 350px;
}
</style>
