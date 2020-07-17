<template>
  <div>
    <div
      class="divider-line position--relative d-flex align-center justify-center"
    >
      <div v-if="text" class="middle-text font-weight-bold">{{ text }}</div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    text: {
      default: '',
      type: String
    }
  }
};
</script>

<style lang="scss" scoped>
.divider-line {
  border-bottom: 1px solid #e6e6e6;
}
.middle-text {
  color: #e6e6e6;
  background-color: white;
  margin-bottom: -12px;
  padding: 0 10px;
}
</style>
