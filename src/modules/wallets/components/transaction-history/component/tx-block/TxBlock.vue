<template>
  <div class="mew-component--tx-block">
    <div>
      <mew-blockie :address="address" width="30px" height="30px" />
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  props: {
    address: {
      type: String,
      default: ''
    },
    amount: {
      type: String,
      default: ''
    },
    time: {
      type: String,
      default: ''
    },
    direction: {
      type: String,
      default: ''
    }
  },
  data() {
    return {};
  }
};
</script>

<style lang="scss"></style>
