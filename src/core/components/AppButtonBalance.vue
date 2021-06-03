<template>
  <div class="mew-component--top-right-text">
    <v-skeleton-loader v-if="loading" type="text" width="100px" />
    <div v-else class="text primary--text">{{ balance }}</div>
  </div>
</template>

<script>
export default {
  components: {},
  props: {
    loading: {
      type: Boolean,
      default: true
    },
    balance: {
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
  right: 0px;
}

.text {
  font-size: 12px;
}
</style>
