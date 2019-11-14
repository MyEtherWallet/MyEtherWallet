<template functional>
  <div class="network-picker">
    <p class="network-text">NETWORK</p>
    <p class="current-network" @click="props.openNetworkModal">
      {{
        props.network.hasOwnProperty('type') ? props.network.type.name : 'ETH'
      }}
      -
      {{
        props.network.hasOwnProperty('service')
          ? props.network.service
          : 'mewapi.io'
      }}
      <i class="fa fa-caret-down" />
    </p>
  </div>
</template>

<script>
export default {
  props: {
    network: {
      type: Object,
      default: () => {
        return {};
      }
    },
    openNetworkModal: {
      type: Function,
      default: () => {}
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'NetworkPickerComponent.scss';
</style>
