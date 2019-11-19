<template functional>
  <div class="dropdown-container network-picker">
    <span class="network-text">{{ parent.$t('mewcx.network') }}</span>
    <span class="current-network" @click="props.openNetworkModal">
      {{
        props.network.hasOwnProperty('type')
          ? props.network.type.name
          : parent.$t('common.currency.eth')
      }}
      -
      {{
        props.network.hasOwnProperty('service')
          ? props.network.service
          : 'mewapi.io'
      }}
      <i class="fa fa-caret-down" />
    </span>
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
