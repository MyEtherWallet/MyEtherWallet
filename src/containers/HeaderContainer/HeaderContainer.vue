<template>
  <div>
    <div class="floating-buttons-container">
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
    </div>
    <cx-header v-if="isMewCx" />
    <div v-if="!isMewCx" class="header">
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
        :address="address"
      />
      <logout-modal ref="logout" />
      <issue-log-modal ref="issuelog" :error="error" :resolver="resolver" />

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
          <div class="v6-header">
            <div>
              Dear MEW users! After October 4th, 2022, MEW version 5 will no
              longer be available online. Our current, official version of MEW
              can be found at
              <a href="https://www.myetherwallet.com/" target="_blank"
                >https://www.myetherwallet.com</a
              >
              If you haven't used it yet, please do so now to make sure you
              don't experience any issues with wallet access after the
              sunsetting of MEW 5.
              <br />
              <br />
              Keep in mind, you will still be able to download older versions of
              MEW, including MEW 5, from our Github page and run them from your
              computer.
            </div>
          </div>
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
                    <b-dropdown-item
                      v-show="network.type.name === 'ETH'"
                      :href="'https://www.ethvm.com/address/' + address"
                      target="_blank"
                      rel="noopener noreferrer"
                      >{{ $t('header.ethvm') }} ({{
                        network.type.name
                      }})</b-dropdown-item
                    >
                    <b-dropdown-item :href="explorerUrl" target="_blank">
                      {{ serviceUrl }} ({{ network.type.name }})
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
    <welcome-modal ref="welcome" :first-time-ru="firstTimeRu" />
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import store from 'store';
import { Misc } from '@/helpers';
import Blockie from '@/components/Blockie';
import NotificationsContainer from '@/containers/NotificationsContainer';
import UserReminderButton from '@/components/UserReminderButton';
import SettingsModal from '@/components/SettingsModal';
import LogoutModal from '@/components/LogoutModal';
import IssueLogModal from '@/components/IssueLogModal';
import MobileMenu from './components/MobileMenu';
import DisconnectedModal from '@/components/DisconnectedModal';
import DecisionTree from '@/components/DecisionTree';
import CxHeader from '@/layouts/ExtensionBrowserAction/components/CxHeader';
import supportedLang from './supportedLang';
import WelcomeModal from '@/components/WelcomeModal';

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
    'cx-header': CxHeader,
    'welcome-modal': WelcomeModal
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
      error: {},
      resolver: () => {},
      isMewCx: isMewCx,
      buildType: BUILD_TYPE,
      firstTimeRu: false
    };
  },
  computed: {
    ...mapState('main', [
      'network',
      'web3',
      'account',
      'gettingStartedDone',
      'locale',
      'tempHide'
    ]),
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
    locale() {
      this.getCurrentLang();
    }
  },
  created() {
    this.$eventHub.$on('open-settings', this.openSettings);
  },
  mounted() {
    this.getCurrentLang();

    // On load, if page is not on top, apply small menu and show scroll top button
    this.onPageScroll();

    // On scroll,  if page is not on top, apply small menu and show scroll top button
    window.onscroll = () => {
      this.onPageScroll();
    };

    this.$eventHub.$on('issueModal', (error, resolve) => {
      let errorPop = store.get('errorPop') || 0;
      errorPop += 1;
      store.set('errorPop', errorPop);
      if (this.tempHide) {
        resolve(false);
      } else {
        this.error = error;
        this.resolver = resolve;
        this.$refs.issuelog.$refs.issuelog.show();
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
    ...mapActions('main', ['setLocale', 'setGasPrice', 'setEthGasPrice']),
    getCurrentLang() {
      const storedLocale = this.supportedLanguages.find(item => {
        return item.langCode === this.locale;
      });

      this._i18n.locale = this.locale;
      this.currentFlag = storedLocale.flag;
      this.currentName = storedLocale.name;
    },
    openSettings() {
      this.$refs.settings.$refs.settings.show();
      this.$refs.settings.$refs.settings.$on('hidden', () => {
        this.isMobileMenuOpen = false;
      });
    },
    languageItemClicked(obj) {
      if (obj.langCode === 'ru_RU' && !store.get('notFirstTimeRU')) {
        this.firstTimeRu = true;
        this.$refs.welcome.$refs.welcome.show();
      }

      this.$refs.welcome.$refs.welcome.$on('hidden', () => {
        this.firstTimeRu = false;
        store.set('notFirstTimeRU', true);
      });

      this.$i18n.locale = obj.langCode;
      this.currentName = obj.name;
      this.currentFlag = obj.flag;
      this.setLocale({ locale: obj.langCode, save: true });
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
.v6-header {
  text-align: center;
  background-color: $light-orange-3;
  padding: 8px !important;
  color: $dark-blue-2 !important;

  a {
    color: $dark-blue-2 !important;
    text-decoration: underline;
  }
  div {
    margin: auto;
    max-width: 850px;
  }
}
</style>
