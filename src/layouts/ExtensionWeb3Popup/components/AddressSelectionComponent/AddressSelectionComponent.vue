<template functional>
  <div class="address-detail-container" @click="props.selectAccount(props.address)">
    <div class="check-mark-container">
      <i
        :class="[
          props.selectedAccount === props.address
            ? 'icon-selected'
            : 'icon-not-selected',
          'fa fa-check-circle fa-lg'
        ]"
      />
    </div>
    <div
      :class="[
        props.selectedAccount === props.address ? 'selected' : '',
        'address-detail'
      ]"
    >
      <component
        :is="injections.components.Blockie"
        :address="props.address"
        width="30px"
        height="30px"
      />
      <div class="address-text">
        <p>{{ props.address | concatAddr }}</p>
        <div class="balance">
          <span>Balance:</span>
          <span>{{ props.balance.substr(0, 7) }} {{ currency }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Blockie from '@/components/Blockie';
export default {
  inject: {
    components: {
      default: {
        Blockie
      }
    }
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
