<template>
  <div class="cx-menu-container">
    <div class="deprecation-notice">
      MEW CX is no longer being maintained by the MEW team.<br />

      While it will continue to work, eventually it may develop errors and
      security issues since it's not being updated. <br />
      We recommend downloading our new multichain browser wallet Enkrypt here:
      <a href="https://www.enkrypt.com" target="_blank"
        >https://www.enkrypt.com</a
      >
      <br />and migrating your wallet using this guide:
      <a
        href="https://help.myetherwallet.com/en/articles/6434663-migrating-from-mew-cx-to-enkrypt"
        target="_blank"
      >
        https://help.myetherwallet.com/en/articles/6434663-migrating-from-mew-cx-to-enkrypt</a
      >
    </div>
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
            <div class="notification-menu-container">
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
            </div>
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
        <b-dropdown
          v-if="!address"
          ref="cxNetworkDropdown"
          class="cx-network-picker"
          no-caret
          right
          menu-class="cx-dropdown-menu"
        >
          <template v-slot:button-content>
            <div class="network-picker-title">
              <i
                class="color"
                :style="{ backgroundColor: colors[network.type.name] }"
              />
              <p class="network-title">
                {{ network.type.name + ' network' }}
              </p>
              <p class="network-service">{{ network.service }}</p>
              <i
                :class="[
                  'fa network-caret',
                  networkOpen ? 'fa-angle-up' : 'fa-angle-down'
                ]"
              />
            </div>
          </template>
          <div
            v-for="(networkName, idx) in Object.keys(Networks)"
            :key="networkName"
            class="network-selection-container"
            @click="toggleList(idx + 1)"
          >
            <div>
              <i
                class="color"
                :style="{ backgroundColor: colors[networkName] }"
              />
              <p class="network-title">
                {{ networkName }}
              </p>
              <i
                :class="[
                  'fa network-caret',
                  networkShow === idx + 1 ? 'fa-minus' : 'fa-plus'
                ]"
              />
            </div>
            <transition name="showContents">
              <div
                v-if="networkShow === idx + 1"
                class="network-service-container"
              >
                <div
                  v-for="netList in Networks[networkName]"
                  :key="netList.service + networkName"
                  :class="[
                    'network-service',
                    netList.service === network.service &&
                    netList.type.name === network.type.name
                      ? 'active'
                      : ''
                  ]"
                  @click.stop="updateNetwork(netList)"
                >
                  {{ netList.service }}
                </div>
              </div>
            </transition>
          </div>
        </b-dropdown>
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
import { mapState, mapActions } from 'vuex';
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
    return {
      isMewCx: isMewCx,
      gasPrice: '0',
      networkOpen: false,
      networkShow: 0,
      colors: {
        KOV: '#adc101',
        ETH: '#0e97c0',
        GOERLI: '#adc101',
        ROP: '#adc101',
        RIN: '#adc101'
      }
    };
  },
  computed: {
    ...mapState('main', ['account', 'web3', 'network', 'Networks']),
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
  watch: {
    web3() {
      this.setHighGasPrice();
    }
  },
  mounted() {
    this.$refs.cxNetworkDropdown.$on('show', () => {
      this.networkOpen = true;
    });
    this.$refs.cxNetworkDropdown.$on('hide', () => {
      this.networkOpen = false;
    });
  },
  methods: {
    ...mapActions('main', ['switchNetwork', 'setWeb3Instance']),
    toggleList(num) {
      if (num === this.networkShow) {
        this.networkShow = 0;
      } else {
        this.networkShow = num;
      }
    },
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
    },
    updateNetwork(network) {
      this.switchNetwork(network).then(() => {
        window.chrome.storage.sync.set({
          defNetwork: JSON.stringify({
            service: network.service,
            key: network.type.name
          })
        });
        this.setWeb3Instance();
        this.$refs.cxNetworkDropdown.hide();
      });
    }
  }
};
</script>

<style lang="scss">
@import '~@/scss/GlobalVariables';

.cx-network-picker {
  .btn {
    border: none;
    border-radius: 0;
    background-color: $light-green-1;
  }
}

.cx-dropdown-menu {
  margin: 0 !important;
  width: 100% !important;
  margin: 0 !important;
  border: none !important;
  transform: translate3d(0px, 64px, 0px) !important;

  .show {
    margin: 0 !important;
    width: 100% !important;
    margin: 0 !important;
    border: none !important;
    transform: translate3d(0px, 64px, 0px) !important;
  }

  .show {
    .btn {
      background-color: $mew-green !important;
    }
  }
}

.deprecation-notice {
  background-color: #fff6e6;
  padding: 30px;
  text-align: center;
}
</style>

<style lang="scss" scoped>
@import 'CxHeader.scss';
</style>
