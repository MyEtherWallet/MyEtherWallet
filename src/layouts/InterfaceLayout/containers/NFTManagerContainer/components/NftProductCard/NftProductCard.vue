<template>
  <div>
    <div>{{ data.title }}</div>
    <div>{{ data.itemName }}</div>
  </div>
</template>

<script>
export default {
  components: {},
  props: {
    data: {
      type: Object,
      default: function() {
        return {};
      }
    }
  },
  data() {
    return {};
  }
};
</script>

<style lang="scss" scoped></style>
