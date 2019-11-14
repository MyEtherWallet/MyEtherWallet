<template functional>
  <div class="watch-only-container">
    <div class="wallets-container-header">
      <div class="header-title-container">
        <div class="title-balance">
          <h2>{{ parent.$t('mewCX.watch-wallets-only') }}</h2>
        </div>
        <div class="add-button" @click="props.openWatchOnlyModal">
          + {{ parent.$t('mewCX.add-more') }}
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
      <h2>{{ parent.$t('mewCX.no-wallet-found') }}...</h2>
    </div>
    <div
      v-show="props.loading && props.watchOnlyAddresses.length === 0"
      class="wallets-info"
    >
      <h2>{{ parent.$t('mewCX.loading-wallets') }}...</h2>
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
