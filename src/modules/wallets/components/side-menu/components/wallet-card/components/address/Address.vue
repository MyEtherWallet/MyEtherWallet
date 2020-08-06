<template>
  <div class="component--address d-flex align-center">
    <div class="monospace full-address">{{ address }}</div>
    <div class="monospace last-four">{{ getLastFour(address) }}</div>
  </div>
</template>

<script>
export default {
  props: {
    address: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      iconColor: 'white'
    };
  },
  methods: {
    getLastFour(address) {
      return address.substr(address.length - 4);
    }
  }
};
</script>

<style lang="scss" scoped>
.component--address * {
  color: white;
}

.full-address {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 165px;
}

.last-four {
  margin-left: -4px;
}
</style>
