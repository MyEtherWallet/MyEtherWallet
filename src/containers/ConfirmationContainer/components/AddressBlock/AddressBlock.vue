<template lang="html">
  <div class="address-container">
    <div class="identicon-container">
      <p>{{ direction | capitalize }} Address</p>
      <blockie 
        :address="address" 
        width="36px" 
        height="36px"/>
    </div>
    <div class="address">
      {{ address }}
    </div>
  </div>
</template>

<script>
import Blockie from '@/components/Blockie';
export default {
  components: {
    blockie: Blockie
  },
  props: {
    address: {
      type: String,
      default: ''
    },
    direction: {
      type: String,
      default: ''
    }
  }
};
</script>

<style lang="scss">
@import 'AddressBlock.scss';
</style>
