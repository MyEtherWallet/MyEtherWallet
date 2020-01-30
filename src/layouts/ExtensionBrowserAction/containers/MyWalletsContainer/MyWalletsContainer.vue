<template functional>
  <div class="my-wallets-container">
    <div class="wallets-container-header">
      <div class="header-title-container">
        <div class="title-balance">
          <h2>{{ parent.$t('mewcx.my-wallets') }}</h2>
        </div>
        <div class="add-button" @click="props.addWallet">
          + {{ parent.$t('mewcx.add-more') }}
        </div>
      </div>
      <component
        :is="injections.components.NetworkPickerComponent"
        :network="props.network"
        :open-network-modal="props.openNetworkModal"
      />
    </div>
    <component
      :is="injections.components.TotalBalanceContainer"
      :network="props.network"
      :total-balance="props.totalBalance"
      :converted-balance="props.convertedBalance"
    />
    <div v-show="props.myWallets.length > 0 || props.loading" class="wallets">
      <component
        :is="injections.components.WalletInfoComponent"
        v-for="wallet in props.myWallets"
        :key="wallet.address"
        :usd="props.ethPrice"
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
      <h2>{{ parent.$t('mewcx.no-wallet-found') }}...</h2>
    </div>
    <div
      v-show="props.loading && props.myWallets.length === 0"
      class="wallets-info"
    >
      <h2>{{ parent.$t('mewcx.loading-wallets') }}...</h2>
    </div>
  </div>
</template>

<script>
import WalletInfoComponent from '../../components/WalletInfoComponent';
import NetworkPickerComponent from '../../components/NetworkPickerComponent';
import TotalBalanceContainer from '../../components/TotalBalanceContainer';
export default {
  inject: {
    components: {
      default: {
        WalletInfoComponent,
        NetworkPickerComponent,
        TotalBalanceContainer
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
