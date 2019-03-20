<template>
  <div class="header">
    <!-- Modals ***************************************** -->
    <disconnected-modal ref="mewConnectDisconnected" />
    <settings-modal
      v-if="wallet !== null"
      ref="settings"
      :gas-price="gasPrice"
      :address="account.address"
    />
    <notifications-modal ref="notifications" />
    <logout-modal ref="logout" />
    <issue-log-modal
      v-if="Object.keys.length > 0"
      ref="issuelog"
      :error="error"
      :resolver="resolver"
    />
    <!-- Modals ***************************************** -->
    <!-- Scroll up button ******************************* -->
    <div class="scroll-up-button">
      <div
        :class="isPageOnTop == false ? 'active' : ''"
        class="scrollup-container"
      >
        <router-link
          v-show="
            ($route.fullPath === '/create-wallet' ||
              $route.fullPath === '/access-my-wallet') &&
              !gettingStartedDone
          "
          to="/getting-started"
        >
          <user-reminder-button />
        </router-link>
        <scroll-up-button />
      </div>
    </div>
    <!-- Scroll up button ******************************* -->
    <mobile-menu :opensettings="openSettings" :logout="logout" />

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
        <div v-if="$route.fullPath === '/'" class="vintage-header">
          Missing the vintage MEW?
          <a rel="noopener noreferrer" href="https://vintage.myetherwallet.com"
            >Click here to go back!</a
          >
        </div>
        <div
          :class="[
            (isMobileMenuOpen || !isPageOnTop) && 'mobile-menu-boxshadow',
            wallet !== null ? '' : 'page-container'
          ]"
        >
          <div class="header-container">
            <router-link
              to="/"
              @click.native="
                scrollTop();
                isMobileMenuOpen = false;
              "
            >
              <div class="top-logo">
                <img
                  :class="!isPageOnTop && !isMobileMenuOpen ? 'logo-small' : ''"
                  class="logo-large"
                  src="~@/assets/images/short-hand-logo.png"
                />
              </div>
            </router-link>
            <div class="top-menu">
              <b-nav>
                <b-nav-item
                  v-if="isHomePage"
                  to="/"
                  exact
                  @click="scrollTop()"
                  >{{ $t('header.home') }}</b-nav-item
                >
                <b-nav-item v-if="isHomePage" to="/#about-mew">{{
                  $t('header.about')
                }}</b-nav-item>
                <b-nav-item to="/#faqs">{{ $t('common.faqs') }}</b-nav-item>
                <div class="language-menu-container">
                  <div class="arrows">
                    <i class="fa fa-angle-down" aria-hidden="true" />
                  </div>
                  <b-nav-item-dropdown
                    class="language-menu"
                    extra-toggle-classes="nav-link-custom"
                    right
                  >
                    <template slot="button-content">
                      <div class="current-language-flag">
                        <img
                          :src="
                            require(`@/assets/images/flags/${currentFlag}.svg`)
                          "
                          class="show"
                        />
                        <p>{{ currentName }}</p>
                      </div>
                    </template>
                    <b-dropdown-item
                      v-for="language in supportedLanguages"
                      :active="$root._i18n.locale === language.langCode"
                      :key="language.key"
                      :data-language-code="language.langCode"
                      :data-flag-name="language.flag"
                      @click="languageItemClicked"
                      >{{ language.name }}</b-dropdown-item
                    >
                  </b-nav-item-dropdown>
                </div>
                <div v-if="wallet !== null" class="notification-menu-container">
                  <notification ref="notification" />
                </div>
                <b-nav-item
                  v-if="showButtons && !isPageOnTop"
                  :class="[
                    showGetFreeWallet ? 'show' : 'hide',
                    'get-free-wallet first-button nopadding'
                  ]"
                  to="/create-wallet"
                >
                  <div class="get-free-wallet-button">New Wallet</div>
                </b-nav-item>
                <b-nav-item
                  v-if="showButtons && !isPageOnTop"
                  :class="[
                    showGetFreeWallet ? 'show' : 'hide',
                    'get-free-wallet nopadding'
                  ]"
                  to="/access-my-wallet"
                >
                  <div class="access-button">Access</div>
                </b-nav-item>
                <b-nav-item-dropdown
                  v-if="wallet !== null"
                  right
                  no-caret
                  extra-toggle-classes="identicon-dropdown"
                >
                  <template slot="button-content">
                    <div class="settings-container">
                      <blockie
                        :address="account.address"
                        width="35px"
                        height="35px"
                        class="blockie-image"
                      />
                      <i class="fa fa-angle-down" aria-hidden="true" />
                    </div>
                  </template>
                  <b-dropdown-item @click="openSettings"
                    >Settings</b-dropdown-item
                  >
                  <b-dropdown-item @click="logout">Log out</b-dropdown-item>
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
  <!-- .header -->
</template>

<script>
import { mapGetters } from 'vuex';
import store from 'store';
import { Misc, Toast } from '@/helpers';
import Blockie from '@/components/Blockie';
import Notification from '@/components/Notification';
import ScrollUpButton from '@/components/ScrollUpButton';
import UserReminderButton from '@/components/UserReminderButton';
import SettingsModal from '@/components/SettingsModal';
import NotificationsModal from '@/components/NotificationsModal';
import LogoutModal from '@/components/LogoutModal';
import IssueLogModal from '@/components/IssueLogModal';
import BigNumber from 'bignumber.js';
import MobileMenu from './components/MobileMenu';
import DisconnectedModal from '@/components/DisconnectedModal';

const events = {
  issueModal: 'issueModal',
  mewConnectDisconnected: 'mewConnectDisconnected'
};

export default {
  components: {
    blockie: Blockie,
    notification: Notification,
    'scroll-up-button': ScrollUpButton,
    'settings-modal': SettingsModal,
    'notifications-modal': NotificationsModal,
    'logout-modal': LogoutModal,
    'issue-log-modal': IssueLogModal,
    'user-reminder-button': UserReminderButton,
    'mobile-menu': MobileMenu,
    'disconnected-modal': DisconnectedModal
  },
  data() {
    return {
      supportedLanguages: [
        // { name: 'Deutsch', flag: 'de', langCode: 'de_DL' },
        // { name: 'Ελληνικά', flag: 'gr', langCode: 'gr_GR' },
        { name: 'English', flag: 'en', langCode: 'en_US' },
        { name: 'Español', flag: 'es', langCode: 'es_ES' },
        // { name: 'Farsi', flag: 'ir', langCode: 'ir_IR' },
        // { name: 'Suomi', flag: 'fi', langCode: 'fi_FI' },
        // { name: 'Magyar', flag: 'hu', langCode: 'hu_HU' },
        // { name: 'Haitian Creole', flag: 'ht', langCode: 'ht_HT' },
        // { name: 'Bahasa Indonesia', flag: 'id', langCode: 'id_ID' },
        // { name: 'Italiano', flag: 'it', langCode: 'it_IT' },
        { name: '日本語', flag: 'ja', langCode: 'ja_JP' },
        { name: '한국어', flag: 'ko', langCode: 'ko_KR' },
        // { name: 'Nederlands', flag: 'nl', langCode: 'nl_NL' },
        // { name: 'Norsk Bokmål', flag: 'no', langCode: 'no_NO' },
        // { name: 'Polski', flag: 'pl', langCode: 'pl_PL' },
        // { name: 'Português', flag: 'pt', langCode: 'pt_PT' },
        { name: 'Русский', flag: 'ru', langCode: 'ru_RU' },
        // { name: 'ภาษาไทย', flag: 'th', langCode: 'th_TH' },
        // { name: 'Türkçe', flag: 'tr', langCode: 'tr_TR' },
        // { name: 'Tiếng Việt', flag: 'vn', langCode: 'vn_VN' },
        { name: '简体中文', flag: 'zh-Hans', langCode: 'zh_CN' },
        { name: '繁體中文', flag: 'tw', langCode: 'zh_TW' }
      ],
      currentName: 'English',
      currentFlag: 'en',
      isPageOnTop: true,
      isMobileMenuOpen: false,
      isHomePage: true,
      showGetFreeWallet: false,
      gasPrice: '0',
      error: {},
      resolver: () => {},
      showGettingStarted: ''
    };
  },
  computed: {
    ...mapGetters({
      wallet: 'wallet',
      online: 'online',
      web3: 'web3',
      account: 'account',
      gettingStartedDone: 'gettingStartedDone'
    }),
    showButtons() {
      if (
        this.wallet === null &&
        (this.$route.fullPath === '/' ||
          this.$route.fullPath === '/#about-mew' ||
          this.$route.fullPath === '/#faqs' ||
          this.$route.fullPath === '/convert-units' ||
          this.$route.fullPath === '/team')
      ) {
        return true;
      }
      return false;
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
    wallet() {
      this.setHighGasPrice();
    },
    web3() {
      this.setHighGasPrice();
    }
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

    // this.disconnectMewConnectModal();

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
    // this.$eventHub.$off('issueModal');
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
    languageItemClicked(e) {
      const code = e.target.getAttribute('data-language-code');
      const flag = e.target.getAttribute('data-flag-name');

      this._i18n.locale = code;
      this.currentName = e.target.innerText.replace(/^\s+|\s+$|\s+(?=\s)/g, '');
      this.currentFlag = flag;
      store.set('locale', code);
    },
    scrollTop() {
      window.scrollTo(0, 0);
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
