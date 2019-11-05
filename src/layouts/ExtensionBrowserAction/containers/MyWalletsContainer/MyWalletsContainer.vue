<template functional>
  <div class="my-wallets-container">
    <div class="wallets-container-header">
      <div class="header-title-container">
        <div class="title-balance">
          <h2>{{ $t('mewCx.my-wallets') }}</h2>
        </div>
        <div class="add-button" @click="props.addWallet">
          + {{ $t('mewCx.add-more') }}
        </div>
      </div>
      <component
        :is="injections.components.NetworkPickerComponent"
        :network="props.network"
        :open-network-modal="props.openNetworkModal"
      />
    </div>
    <div class="total-balance-container">
      <div class="title-name">
        {{ $t('common.balance.total') }}
      </div>
      <div class="balance-container">
        <p class="actual-balance">
          {{ props.totalBalance }} <span>{{ props.network.type.name }} </span>
        </p>
        <p v-if="props.network.type.name === 'ETH'" class="converted-balance">
          {{ props.convertedBalance }}
        </p>
      </div>
    </div>
    <div v-show="props.myWallets.length > 0 || props.loading" class="wallets">
      <component
        v-for="wallet in props.myWallets"
        :is="injections.components.WalletInfoComponent"
        :usd="props.ethPrice"
        :key="wallet.address"
        :address="wallet.address"
        :balance="wallet.balance"
        :wallet="wallet.wallet"
        :nickname="wallet.nickname"
        :wallet-type="wallet.type"
        :access="props.togglePasswordModal"
        :detail="props.togglePasswordModal"
      />
    </div>
    <div
      v-show="props.myWallets.length === 0 && !props.loading"
      class="wallets-info"
    >
      <h2>{{ $t('mewCx.no-wallet-found') }}...</h2>
    </div>
    <div
      v-show="props.loading && props.myWallets.length === 0"
      class="wallets-info"
    >
      <h2>{{ $t('mewCx.loading-wallets') }}...</h2>
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
    myWallets: {
      type: Array,
      default: () => {
        return [];
      }
    },
    togglePasswordModal: {
      type: Function,
      default: () => {}
    },
    addWallet: {
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
    },
    totalBalance: {
      type: String,
      default: '0'
    },
    convertedBalance: {
      type: String,
      default: '$ 0'
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'MyWalletsContainer.scss';
@import '../ExtensionWalletContainer/ExtensionWalletContainer.scss';
</style>
