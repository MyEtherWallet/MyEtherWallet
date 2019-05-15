<template>
  <div class="wallet-info-container">
    <div class="nickname-and-buttons"></div>
    <div class="wallet-info-content">
      <div class="address-and-balance">
        <div class="address-container">
          <blockie :address="address" width="30px" height="30px" />
          <div>
            Address
            {{ address }}
          </div>
          Copy
        </div>
        <div class="balance-container"></div>
      </div>
      <div class="tokens-container"></div>
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
    nickname: {
      type: String,
      default: 'Sample Name'
    },
    walletType: {
      type: String,
      default: 'watchOnly'
    },
    access: {
      type: Function,
      default: () => {}
    },
    detail: {
      type: Function,
      default: () => {}
    },
    edit: {
      type: Function,
      default: () => {}
    },
    balance: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      loading: false
    };
  }
};
</script>

<style lang="scss" scoped>
@import 'WalletInfoComponent.scss';
</style>
