<template>
  <div>
    <cx-header v-if="isMewCx" />
    <div v-if="!isMewCx" class="header">
      <decision-tree />
      <router-link
        v-show="
          $route.fullPath === '/create-wallet' ||
            ($route.fullPath === '/access-my-wallet' && !isMewCx)
        "
        to="/getting-started"
      >
        <user-reminder-button />
      </router-link>
      <mobile-menu
        :opensettings="openSettings"
        :logout="logout"
        :build-type="buildType"
      />

      <!-- Modals ***************************************** -->
      <disconnected-modal ref="mewConnectDisconnected" />
      <settings-modal
        v-if="address !== null"
        ref="settings"
        :gas-price="gasPrice"
        :address="address"
      />
      <logout-modal ref="logout" />
      <issue-log-modal
        v-if="Object.keys.length > 0"
        ref="issuelog"
        :error="error"
        :resolver="resolver"
      />

      <!-- Desktop menu *********************************** -->
      <div class="fixed-header-wrap">
        <div
          ref="fixedHeader"
          :class="[
            !isPageOnTop && !isMobileMenuOpen && 'tiny-header',
            isMobileMenuOpen && 'fixed-header-border-bottom'
          ]"
          class="fixed-header"
        >
          <div
            :class="[
              (isMobileMenuOpen || !isPageOnTop) && 'mobile-menu-boxshadow',
              address !== null ? '' : 'page-container'
            ]"
          >
            <div class="header-container">
              <router-link
                aria-label="Home"
                to="/"
                @click.native="isMobileMenuOpen = false"
              >
                <div class="top-logo">
                  <img
                    :class="[
                      !isPageOnTop && !isMobileMenuOpen
                        ? `logo-small${!isMewCx ? '' : '-' + buildType}`
                        : '',
                      `logo-large${!isMewCx ? '' : '-' + buildType}`
                    ]"
                    :src="
                      require(`@/assets/images/short-hand-logo-${buildType}.png`)
                    "
                    alt
                  />
                </div>
              </router-link>
              <div class="top-menu">
                <b-nav>
                  <b-nav-item
                    href="https://ccswap.myetherwallet.com/#/"
                    target="_blank"
                    class="buy-eth"
                    rel="noopener noreferrer"
                  >
                    <img
                      alt
                      class="buy-eth-icon"
                      src="@/assets/images/icons/buy-eth.svg"
                    />
                    {{ $t('common.buy-eth') }}
                  </b-nav-item>

                  <b-nav-item-dropdown
                    v-if="!isMewCx"
                    id="my-nav-dropdown"
                    :text="$t('common.info')"
                    toggle-class="nav-link-custom"
                    right
                  >
                    <b-dropdown-item v-if="isHomePage" to="/#about-mew">
                      {{ $t('common.about') }}
                    </b-dropdown-item>
                    <b-dropdown-item to="/#faqs">{{
                      $t('common.faqs')
                    }}</b-dropdown-item>
                  </b-nav-item-dropdown>

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
                  <div v-show="!isMewCx" class="language-menu-container">
                    <div class="down-arrow"></div>
                    <b-nav-item-dropdown
                      class="language-menu"
                      extra-toggle-classes="nav-link-custom"
                      right
                    >
                      <template slot="button-content">
                        <div class="current-language-flag">
                          <img
                            v-if="currentFlag !== null"
                            :src="
                              require(`@/assets/images/flags/${currentFlag}.svg`)
                            "
                            alt
                            class="show"
                          />
                          <p>{{ currentName }}</p>
                        </div>
                      </template>
                      <b-dropdown-item
                        v-for="language in supportedLanguages"
                        :key="language.key"
                        :active="$root._i18n.locale === language.langCode"
                        :data-language-code="language.langCode"
                        :data-flag-name="language.flag"
                        @click="languageItemClicked(language)"
                        >{{ language.name }}</b-dropdown-item
                      >
                    </b-nav-item-dropdown>
                  </div>
                  <div class="notification-menu-container">
                    <notification
                      v-if="
                        $route.fullPath.includes('view-wallet-info') ||
                          $route.fullPath.includes('interface')
                      "
                      ref="notification"
                    />
                  </div>
                  <b-nav-item
                    v-if="showButtons && !isPageOnTop && !isMewCx"
                    :class="[
                      showGetFreeWallet ? 'show' : 'hide',
                      'get-free-wallet first-button nopadding'
                    ]"
                    to="/create-wallet"
                  >
                    <div class="get-free-wallet-button">
                      {{ $t('header.new-wallet') }}
                    </div>
                  </b-nav-item>
                  <b-nav-item
                    v-if="showButtons && !isPageOnTop && !isMewCx"
                    :class="[
                      showGetFreeWallet ? 'show' : 'hide',
                      'get-free-wallet nopadding'
                    ]"
                    to="/access-my-wallet"
                  >
                    <div class="access-button">
                      {{ $t('header.access') }}
                    </div>
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
                </b-nav>
              </div>
              <!-- .top-menu -->
            </div>
            <!-- .header-container -->
          </div>
          <!-- .page-container -->
        </div>
      </div>
      <!-- Desktop menu *********************************** -->
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import store from 'store';
import { Misc, Toast } from '@/helpers';
import Blockie from '@/components/Blockie';
import NotificationsContainer from '@/containers/NotificationsContainer';
import UserReminderButton from '@/components/UserReminderButton';
import SettingsModal from '@/components/SettingsModal';
import LogoutModal from '@/components/LogoutModal';
import IssueLogModal from '@/components/IssueLogModal';
import BigNumber from 'bignumber.js';
import MobileMenu from './components/MobileMenu';
import DisconnectedModal from '@/components/DisconnectedModal';
import DecisionTree from '@/components/DecisionTree';
import CxHeader from '@/layouts/ExtensionBrowserAction/components/CxHeader';
import supportedLang from './supportedLang';

const events = {
  issueModal: 'issueModal',
  mewConnectDisconnected: 'mewConnectDisconnected'
};

export default {
  components: {
    blockie: Blockie,
    notification: NotificationsContainer,
    'settings-modal': SettingsModal,
    'logout-modal': LogoutModal,
    'issue-log-modal': IssueLogModal,
    'user-reminder-button': UserReminderButton,
    'mobile-menu': MobileMenu,
    'disconnected-modal': DisconnectedModal,
    'decision-tree': DecisionTree,
    'cx-header': CxHeader
  },
  data() {
    const isMewCx = Misc.isMewCx();
    return {
      supportedLanguages: supportedLang,
      currentName: 'English',
      currentFlag: 'en',
      isPageOnTop: true,
      isMobileMenuOpen: false,
      isHomePage: true,
      showGetFreeWallet: false,
      gasPrice: '0',
      error: {},
      resolver: () => {},
      isMewCx: isMewCx,
      buildType: BUILD_TYPE
    };
  },
  computed: {
    ...mapState(['network', 'web3', 'account', 'gettingStartedDone']),
    showButtons() {
      if (
        this.address === null &&
        (this.$route.fullPath === '/' ||
          this.$route.fullPath === '/#about-mew' ||
          this.$route.fullPath === '/#faqs' ||
          this.$route.fullPath === '/convert-units' ||
          this.$route.fullPath === '/team')
      ) {
        return true;
      }
      return false;
    },
    explorerUrl() {
      return this.network.type.blockExplorerAddr.replace(
        '[[address]]',
        this.address
      );
    },
    serviceUrl() {
      return Misc.getService(this.network.type.blockExplorerAddr);
    },
    address() {
      return this.account.address;
    }
  },
  watch: {
    $route(newVal) {
      if (newVal.path.includes('interface')) {
        this.isHomePage = false;
      } else {
        this.isHomePage = true;
      }
    },
    address() {
      this.setHighGasPrice();
    },
    web3() {
      this.setHighGasPrice();
    }
  },
  created() {
    this.$eventHub.$on('open-settings', this.openSettings);
  },
  mounted() {
    if (Misc.doesExist(store.get('locale'))) {
      const storedLocale = this.supportedLanguages.find(item => {
        return item.langCode === store.get('locale');
      });
      this._i18n.locale = store.get('locale');
      this.currentFlag = storedLocale.flag;
    } else {
      const storedLocale = this.supportedLanguages.find(item => {
        return item.langCode === this._i18n.locale;
      });
      store.set('locale', storedLocale.langCode);
      this.currentFlag = storedLocale.flag;
    }

    this.currentName = this.supportedLanguages.find(
      item => item.flag === this.currentFlag
    ).name;

    // On load, if page is not on top, apply small menu and show scroll top button
    this.onPageScroll();

    // On scroll,  if page is not on top, apply small menu and show scroll top button
    window.onscroll = () => {
      this.onPageScroll();
    };

    this.$eventHub.$on('issueModal', (error, resolve) => {
      // eslint-disable-next-line
      let errorPop = store.get('errorPop') || 0;
      errorPop += 1;
      store.set('errorPop', errorPop);
      if (store.get('neverReport')) {
        resolve(false);
      } else {
        this.$refs.issuelog.$refs.issuelog.show();
        this.error = error;
        this.resolver = resolve;
      }
    });

    this.$eventHub.$on('mewConnectDisconnected', () => {
      this.isMobileMenuOpen = false;
      this.$refs.mewConnectDisconnected.$refs.disconnected.show();
      this.$refs.mewConnectDisconnected.$refs.disconnected.$on('hidden', () => {
        this.$router.push('/access-my-wallet');
      });
    });
  },
  beforeDestroy() {
    Object.values(events).forEach(evt => {
      this.$eventHub.$off(evt);
    });
    this.$eventHub.$off('open-settings');
  },
  methods: {
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
    openSettings() {
      this.$refs.settings.$refs.settings.show();
      this.$refs.settings.$refs.settings.$on('hidden', () => {
        this.isMobileMenuOpen = false;
      });
    },
    languageItemClicked(obj) {
      this.$i18n.locale = obj.langCode;
      this.currentName = obj.name;
      this.currentFlag = obj.flag;
      store.set('locale', obj.langCode);
    },
    logout() {
      this.$refs.logout.$refs.logout.show();
      this.$refs.logout.$refs.logout.$on('hidden', () => {
        this.isMobileMenuOpen = false;
      });
    },
    onPageScroll() {
      const topPos = this.$root.$el.getBoundingClientRect().top;
      this.isPageOnTop = !(topPos < -150);
      if (topPos < -150) {
        this.showGetFreeWallet = true;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'HeaderContainer.scss';
</style>
