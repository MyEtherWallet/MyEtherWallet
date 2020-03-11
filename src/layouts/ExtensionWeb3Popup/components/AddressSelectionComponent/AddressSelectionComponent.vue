<template>
  <div
    class="address-detail-container"
    @click="selectAccount(address ? address : walletType)"
  >
    <div class="check-mark-container">
      <i
        :class="[
          selectedAccount === address || selectedAccount === walletType
            ? 'icon-selected'
            : 'icon-not-selected',
          'fa fa-check-circle fa-lg'
        ]"
      />
    </div>
    <div
      :class="[
        selectedAccount === address || selectedAccount === walletType
          ? 'selected'
          : '',
        'address-detail'
      ]"
    >
      <blockie
        v-if="walletType === 'wallet'"
        :address="address"
        width="30px"
        height="30px"
      />
      <div class="address-text">
        <div v-if="walletType === 'wallet'">
          <p v-f="nickname !== ''">
            <b>{{ nickname }}</b>
          </p>
          <p>{{ address | concatAddr }}</p>
          <div class="balance">
            <span>{{ $t('common.balance.string') }}:</span>
            <span>{{ balance.substr(0, 7) }} {{ currency }}</span>
          </div>
        </div>
        <div v-else>
          <p>{{ $t('mewcx.use-burner') }}!</p>
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
    nickname: {
      type: String,
      default: ''
    },
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
    },
    walletType: {
      type: String,
      default: 'wallet'
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'AddressSelectionComponent.scss';
</style>
