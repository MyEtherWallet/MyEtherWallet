<template>
  <v-btn icon depressed class="my-n3">
    <v-icon :class="color ? color + '--text' : ''" class="copy-icon">
      mdi-content-copy
    </v-icon>
  </v-btn>
</template>

<script>
export default {
  props: {
    color: { default: '', type: String },
    text: { default: '', type: String }
  },
  data() {
    return {};
  }
};
</script>

<style lang="scss" scoped>
.copy-icon {
  font-size: 16px !important;
}
</style>
