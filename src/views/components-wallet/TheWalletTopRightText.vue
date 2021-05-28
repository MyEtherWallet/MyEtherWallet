<template>
  <div class="mew-component--top-right-text">
    <v-skeleton-loader v-if="loading" type="text" width="120px" />
    <div v-else class="text">{{ text }}</div>
  </div>
</template>

<script>
export default {
  components: {},
  props: {
    loading: {
      type: Boolean,
      default: false
    },
    text: {
      type: String,
      default: ''
    }
  },
  data() {
    return {};
  }
};
</script>

<style lang="scss" scoped>
.mew-component--top-right-text {
  position: absolute;
  top: -23px;
  right: 8px;
}

.text {
  font-size: 12px;
}
</style>
