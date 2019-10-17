<template functional>
  <div class="watch-only-container">
    <div class="wallets-container-header">
      <div class="header-title-container">
        <div class="title-balance">
          <h2>Watch Only Wallets</h2>
        </div>
        <div class="add-button" @click="props.openWatchOnlyModal">
          + Add More
        </div>
      </div>
      <div class="dropdown-container">
        <span class="network-text">NETWORK</span>
        <span class="current-network" @click="props.openNetworkModal">
          {{ props.network.type.name }} - {{ props.network.service }}
        </span>
      </div>
    </div>
    <div
      v-show="props.watchOnlyAddresses.length > 0 || props.loading"
      class="wallets"
    >
      <component
        v-for="wallet in props.watchOnlyAddresses"
        :is="injections.components.WalletInfoComponent"
        :usd="props.ethPrice"
        :key="wallet.address"
        :address="wallet.address"
        :balance="wallet.balance"
        :wallet="wallet.wallet"
        :wallet-type="wallet.type"
      />
    </div>
    <div
      v-show="props.watchOnlyAddresses.length === 0 && !props.loading"
      class="wallets-info"
    >
      <h2>No Wallet found...</h2>
    </div>
    <div
      v-show="props.loading && props.watchOnlyAddresses.length === 0"
      class="wallets-info"
    >
      <h2>Loading Wallets...</h2>
    </div>
  </div>
</template>

<script>
import WalletInfoComponent from '../../components/WalletInfoComponent';
export default {
  inject: {
    components: {
      default: {
        WalletInfoComponent
      }
    }
  },
  props: {
    ethPrice: {
      type: Number,
      default: 0
    },
    watchOnlyAddresses: {
      type: Array,
      default: () => {
        return [];
      }
    },
    openWatchOnlyModal: {
      type: Function,
      default: () => {}
    },
    openNetworkModal: {
      type: Function,
      default: () => {}
    },
    network: {
      type: Object,
      default: () => {
        return {};
      }
    },
    loading: {
      type: Boolean,
      default: false
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'WatchOnlyWalletsContainer.scss';
@import '../ExtensionWalletContainer/ExtensionWalletContainer.scss';
</style>
