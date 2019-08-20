<template>
  <div class="address-detail-container" @click="selectAccount(address)">
    <div class="check-mark-container">
      <i
        :class="[
          selectedAccount === address ? 'icon-selected' : 'icon-not-selected',
          'fa fa-check-circle fa-lg'
        ]"
      />
    </div>
    <div
      :class="[selectedAccount === address ? 'selected' : '', 'address-detail']"
    >
      <blockie :address="address" width="30px" height="30px" />
      <div class="address-text">
        <p>{{ address | concatAddr }}</p>
        <div class="balance">
          <span>Balance:</span>
          <span>{{ balance.substr(0, 7) }} {{ currency }}</span>
        </div>
      </div>
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
    balance: {
      type: String,
      default: '0'
    },
    selectedAccount: {
      type: String,
      default: ''
    },
    selectAccount: {
      type: Function,
      default: () => {}
    },
    currency: {
      type: String,
      default: 'ETH'
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'AddressSelectionComponent.scss';
</style>
