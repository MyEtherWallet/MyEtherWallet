<template functional>
  <div class="watch-only-container">
    <div class="wallets-container-header">
      <div class="header-title-container">
        <div class="title-balance">
          <h2>{{ parent.$t('mewcx.watch-wallets-only') }}</h2>
        </div>
        <div class="add-button" @click="props.openWatchOnlyModal">
          + {{ parent.$t('mewcx.add-more') }}
        </div>
      </div>
      <component
        :is="injections.components.NetworkPickerComponent"
        :network="props.network"
        :open-network-modal="props.openNetworkModal"
      />
    </div>
    <div
      v-show="props.watchOnlyAddresses.length > 0 || props.loading"
      class="wallets"
    >
      <component
        :is="injections.components.WalletInfoComponent"
        v-for="wallet in props.watchOnlyAddresses"
        :key="wallet.address"
        :usd="props.ethPrice"
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
      <h2>{{ parent.$t('mewcx.no-wallet-found') }}...</h2>
    </div>
    <div
      v-show="props.loading && props.watchOnlyAddresses.length === 0"
      class="wallets-info"
    >
      <h2>{{ parent.$t('mewcx.loading-wallets') }}...</h2>
    </div>
  </div>
</template>

<script>
import WalletInfoComponent from '../../components/WalletInfoComponent';
import NetworkPickerComponent from '../../components/NetworkPickerComponent';
export default {
  inject: {
    components: {
      default: {
        WalletInfoComponent,
        NetworkPickerComponent
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
