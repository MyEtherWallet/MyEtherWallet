<template>
  <div class="header">
    <settings-modal
      v-if="wallet !== null"
      ref="settings"
      :gas-price="gasPrice"
    />
    <notifications-modal ref="notifications" />
    <logout-modal ref="logout" />
    <issue-log-modal ref="issuelog" />
    <logout-warning-modal ref="logoutWarningModal" />

    <div
      :class="isPageOnTop == false ? 'active' : ''"
      class="scrollup-container"
    >
      <router-link
        v-show="
          $route.fullPath === '/create-wallet' ||
            $route.fullPath === '/access-my-wallet'
        "
        to="/getting-started"
      >
        <user-reminder-button />
      </router-link>
      <scroll-up-button />
    </div>
    <div
      :class="isMobileMenuOpen && 'mobile-menu-open'"
      class="mobile-menu-underblock"
    />
    <!-- Fixed position mobile menu starts here ------------- -->
    <div
      :class="isMobileMenuOpen && 'mobile-menu-open-height-change'"
      class="mobile-menu-content"
    >
      <div class="page-container">
        <ul>
          <li>
            <router-link
              to="/"
              @click.native="
                scrollTop();
                isMobileMenuOpen = false;
              "
            >
              {{ $t('header.home') }}
            </router-link>
          </li>
          <li v-if="isHomePage">
            <router-link
              to="/#about-mew"
              @click.native="isMobileMenuOpen = false"
            >
              {{ $t('header.about') }}
            </router-link>
          </li>
          <li>
            <a
              href="https://kb.myetherwallet.com"
              target="_blank"
              @click="isMobileMenuOpen = false"
              >Help Center</a
            >
          </li>
          <li>
            <div class="mobile-language-menu-container">
              <b-nav-item-dropdown
                class="mobile-language-menu"
                extra-toggle-classes="nav-link-custom"
                right
              >
                <template slot="button-content">
                  <div class="current-language-flag">
                    <p>{{ currentName }}</p>
                    <img
                      :src="require(`@/assets/images/flags/${currentFlag}.svg`)"
                      class="show"
                    />
                  </div>
                </template>
                <b-dropdown-item
                  v-for="language in supportedLanguages"
                  :active="$root._i18n.locale === language.flag"
                  :key="language.key"
                  :data-language-code="language.langCode"
                  :data-flag-name="language.flag"
                  @click="languageItemClicked"
                  >{{ language.name }}</b-dropdown-item
                >
              </b-nav-item-dropdown>
              <div class="arrows">
                <i class="fa fa-angle-right" aria-hidden="true" />
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
    <!-- .mobile-menu-content -->
    <!-- Fixed position mobile menu ends here ------------- -->
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
                <img
                  :class="!isPageOnTop && !isMobileMenuOpen ? 'logo-small' : ''"
                  class="beta-tag"
                  src="~@/assets/images/beta.png"
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
                <b-nav-item v-if="isHomePage" to="/#about-mew">
                  {{ $t('header.about') }}
                </b-nav-item>
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
                    'get-free-wallet nopadding'
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
                        :address="wallet.getAddressString()"
                        width="35px"
                        height="35px"
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
            <div class="mobile-menu">
              <div
                class="mobile-menu-button"
                @click="isMobileMenuOpen = !isMobileMenuOpen"
              >
                <div class="bar-1" />
                <div class="bar-2" />
                <div class="bar-3" />
              </div>
            </div>
            <!-- .mobile-menu -->
          </div>
          <!-- .header-container -->
        </div>
        <!-- .page-container -->
      </div>
      <!-- .fixed-header -->
    </div>
    <!-- .wrap -->
  </div>
  <!-- .header -->
</template>

<script>
import { mapGetters } from 'vuex';
import store from 'store';
import { Misc } from '@/helpers';
import Blockie from '@/components/Blockie';
import Notification from '@/components/Notification';
import ScrollUpButton from '@/components/ScrollUpButton';
import UserReminderButton from '@/components/UserReminderButton';
import SettingsModal from '@/components/SettingsModal';
import NotificationsModal from '@/components/NotificationsModal';
import LogoutModal from '@/components/LogoutModal';
import LogoutWarningModal from '@/components/LogoutWarningModal';
import IssueLogModal from '@/components/IssueLogModal';
import BigNumber from 'bignumber.js';

export default {
  components: {
    blockie: Blockie,
    notification: Notification,
    'scroll-up-button': ScrollUpButton,
    'settings-modal': SettingsModal,
    'notifications-modal': NotificationsModal,
    'logout-modal': LogoutModal,
    'logout-warning-modal': LogoutWarningModal,
    'issue-log-modal': IssueLogModal,
    'user-reminder-button': UserReminderButton
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
        // { name: '简体中文', flag: 'zh-Hans', langCode: 'zh_CS' }
        { name: '繁體中文', flag: 'zh-Hant', langCode: 'zh_CN' }
      ],
      currentName: 'English',
      currentFlag: 'en',
      isPageOnTop: true,
      isMobileMenuOpen: false,
      isHomePage: true,
      showGetFreeWallet: false,
      gasPrice: '0'
    };
  },
  computed: {
    ...mapGetters({
      wallet: 'wallet',
      online: 'online',
      web3: 'web3'
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
      this.web3.eth
        .getGasPrice()
        .then(res => {
          this.gasPrice = new BigNumber(res).toString();
        })
        .catch(err => {
          // eslint-disable-next-line no-console
          console.error(err);
        });
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

    // https://github.com/MyEtherWallet/MyEtherWallet/projects/2#card-12172489
    // trivial statement to convert dialects to primary language tags, with the exception of Chinese
    // if (!/zh[-_]/.test(this.currentFlag)) {
    //   this.currentFlag = this.currentFlag.split(/[-_]/)[0];
    // }

    this.currentName = this.supportedLanguages.find(
      item => item.flag === this.currentFlag
    ).name;

    // On load, if page is not on top, apply small menu and show scroll top button
    this.onPageScroll();

    // On scroll,  if page is not on top, apply small menu and show scroll top button
    window.onscroll = () => {
      this.onPageScroll();
    };
  },
  created() {
    function dummyErrorHandler() {}

    try {
      window.addEventListener(
        'popstate',
        event => {
          if (
            this.wallet !== null &&
            !event.target.location.hash.includes('interface')
          )
            this.$refs.logoutWarningModal.$refs.logoutWarningModal.show();
        },
        false
      );
    } catch (err) {
      dummyErrorHandler(err);
    }
  },
  methods: {
    openSettings() {
      this.$refs.settings.$refs.settings.show();
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
    },
    showNotifications() {
      this.$refs.notifications.$refs.notification.show();
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
