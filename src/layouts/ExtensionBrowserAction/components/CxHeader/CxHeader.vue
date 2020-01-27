<template>
  <div class="cx-menu-container">
    <settings-modal
      v-if="address !== null"
      ref="settings"
      :gas-price="gasPrice"
      :address="address"
    />
    <logout-modal ref="logout" />
    <div class="cx-menu d-flex">
      <b-nav class="cx-header">
        <b-nav-item to="/">
          <div class="d-flex logo-block">
            <img
              :src="require(`@/assets/images/short-hand-logo-mewcx.png`)"
              alt
              height="50"
            />
            <p>{{ $t('mewcx.chrome-cx') }}</p>
          </div>
        </b-nav-item>
        <div class="spacer"></div>
        <div class="d-flex">
          <div class="d-flex menu-items">
            <a href="https://ccswap.myetherwallet.com/#/" target="_blank">
              <div class="d-flex buy-eth">
                <img
                  alt
                  class="buy-eth-icon"
                  src="@/assets/images/icons/buy-eth.svg"
                  height="24"
                />
                <p>{{ $t('mewcx.buy-eth') }}</p>
              </div>
            </a>
            <b-nav-item-dropdown
              v-if="address !== null"
              right
              no-caret
              class="tx-history-menu"
            >
              <template slot="button-content">
                <p>{{ $t('interface.tx-history') }}</p>
              </template>
              <b-dropdown-item :href="explorerUrl" target="_blank">
                <p>{{ serviceUrl }} ({{ network.type.name }})</p>
              </b-dropdown-item>
              <b-dropdown-item
                v-show="network.type.name === 'ETH'"
                :href="'https://ethplorer.io/address/' + address"
                target="_blank"
                rel="noopener noreferrer"
                >{{ $t('header.ethplorer') }} ({{
                  $tc('common.token', 2)
                }})</b-dropdown-item
              >
            </b-nav-item-dropdown>
            <b-nav-item>
              <notification
                v-if="
                  $route.fullPath.includes('view-wallet-info') ||
                    $route.fullPath.includes('interface')
                "
                ref="notification"
              />
              <extension-notification
                v-if="
                  !$route.fullPath.includes('view-wallet-info') &&
                    !$route.fullPath.includes('interface')
                "
              />
            </b-nav-item>
            <b-nav-item-dropdown
              v-if="address !== null"
              right
              no-caret
              extra-toggle-classes="identicon-dropdown"
              class="settings-menu"
            >
              <template slot="button-content">
                <div class="settings-container">
                  <blockie
                    :address="address"
                    width="35px"
                    height="35px"
                    class="blockie-image"
                  />
                  <i class="fa fa-angle-down" aria-hidden="true" />
                </div>
              </template>
              <b-dropdown-item @click="openSettings">{{
                $t('interface.settings')
              }}</b-dropdown-item>
              <b-dropdown-item @click="logout">{{
                $t('interface.logout')
              }}</b-dropdown-item>
            </b-nav-item-dropdown>
          </div>
        </div>
      </b-nav>
    </div>
  </div>
</template>

<script>
import ExtensionNotification from '@/layouts/ExtensionBrowserAction/containers/ExtensionNotification';
import NotificationsContainer from '@/containers/NotificationsContainer';
import SettingsModal from '@/components/SettingsModal';
import LogoutModal from '@/components/LogoutModal';
import { Misc, Toast } from '@/helpers';
import { mapState } from 'vuex';
import Blockie from '@/components/Blockie';
import BigNumber from 'bignumber.js';

export default {
  components: {
    'extension-notification': ExtensionNotification,
    notification: NotificationsContainer,
    'settings-modal': SettingsModal,
    'logout-modal': LogoutModal,
    blockie: Blockie
  },
  data() {
    const isMewCx = Misc.isMewCx();
    return { isMewCx: isMewCx, gasPrice: '0' };
  },
  computed: {
    ...mapState('main', ['account', 'web3', 'network']),
    address() {
      return this.account.address;
    },
    explorerUrl() {
      return this.network.type.blockExplorerAddr.replace(
        '[[address]]',
        this.address
      );
    },
    serviceUrl() {
      return Misc.getService(this.network.type.blockExplorerAddr);
    }
  },
  methods: {
    openSettings() {
      this.$refs.settings.$refs.settings.show();
      this.$refs.settings.$refs.settings.$on('hidden', () => {
        this.isMobileMenuOpen = false;
      });
    },
    logout() {
      this.$refs.logout.$refs.logout.show();
      this.$refs.logout.$refs.logout.$on('hidden', () => {
        this.isMobileMenuOpen = false;
      });
    },
    setHighGasPrice() {
      this.web3.eth
        .getGasPrice()
        .then(res => {
          this.gasPrice = new BigNumber(res).toString();
        })
        .catch(e => {
          Toast.responseHandler(e, Toast.ERROR);
        });
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'CxHeader.scss';
</style>
