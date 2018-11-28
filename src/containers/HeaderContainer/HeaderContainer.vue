<template>
  <div class="header">
    <settings-modal ref="settings" />
    <notifications-modal ref="notifications" />
    <logout-modal ref="logout" />
    <div
      :class="isPageOnTop == false ? 'active' : ''"
      class="scrollup-container"
    >
      <scroll-up-button />
    </div>

    <div class="wrap">
      <div
        ref="fixedHeader"
        :class="isPageOnTop == false ? 'tiny-header' : ''"
        class="fixed-header"
      >
        <div
          :class="(isMobileMenuOpen || !isPageOnTop) && 'mobile-menu-boxshadow'"
          class="page-container"
        >
          <div class="header-container">
            <router-link to="/" @click.native="scrollTop();">
              <div class="top-logo">
                <img
                  :class="isPageOnTop == false ? 'logo-small' : ''"
                  class="logo-large"
                  src="~@/assets/images/logo.png"
                />
              </div>
            </router-link>
            <div class="top-menu">
              <b-nav>
                <b-nav-item to="/" exact @click="scrollTop();">
                  {{ $t('header.home') }}</b-nav-item
                >
                <b-nav-item to="/#about-mew">{{
                  $t('header.about')
                }}</b-nav-item>
                <b-nav-item to="/#faqs">{{ $t('common.faqs') }}</b-nav-item>
                <b-nav-item v-show="online" to="/#news">{{
                  $t('common.news')
                }}</b-nav-item>

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
                      :active="$root._i18n.locale === language.flag"
                      :key="language.key"
                      :data-language-code="language.langCode"
                      :data-flag-name="language.flag"
                      @click="languageItemClicked"
                    >
                      {{ language.name }}
                    </b-dropdown-item>
                  </b-nav-item-dropdown>
                </div>
                <notification v-if="wallet !== null" ref="notification" />
                <b-nav-item
                  v-if="wallet === null && $route.fullPath === '/'"
                  :class="isPageOnTop && 'noshow'"
                  class="get-free-wallet nopadding"
                  to="/create-wallet"
                >
                  <div class="get-free-wallet-button">Get a Free Wallet</div>
                </b-nav-item>
                <b-nav-item-dropdown
                  v-if="wallet !== null"
                  right
                  no-caret
                  extra-toggle-classes="identicon-dropdown"
                >
                  <template slot="button-content">
                    <blockie
                      :address="wallet.getAddressString()"
                      width="35px"
                      height="35px"
                    />
                  </template>
                  <b-dropdown-item @click="openSettings">
                    Settings
                  </b-dropdown-item>
                  <b-dropdown-item @click="logout"> Log out </b-dropdown-item>
                </b-nav-item-dropdown>
              </b-nav>
            </div>
            <!-- .top-menu -->
            <div class="mobile-menu">
              <div
                class="mobile-menu-button"
                @click="isMobileMenuOpen = !isMobileMenuOpen;"
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
        <div
          :class="isMobileMenuOpen && 'mobile-menu-open-height-change'"
          class="mobile-menu-content"
        >
          <div class="page-container">
            <ul>
              <li>
                <div @click="scrollTop();">{{ $t('header.home') }}</div>
              </li>
              <li>
                <a href="/#about-mew">{{ $t('header.about') }}</a>
              </li>
              <li>
                <a href="/#faqs">{{ $t('common.faqs') }}</a>
              </li>
              <li v-if="false">
                <a href="/#news">{{ $t('common.news') }}</a>
              </li>
            </ul>
          </div>
        </div>
        <!-- .mobile-menu-content -->
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
import SettingsModal from '@/components/SettingsModal';
import NotificationsModal from '@/components/NotificationsModal';
// import TxTopMenuPopup from '@/components/TxTopMenuPopup';
import LogoutModal from '@/components/LogoutModal';

export default {
  components: {
    blockie: Blockie,
    notification: Notification,
    'scroll-up-button': ScrollUpButton,
    'settings-modal': SettingsModal,
    'notifications-modal': NotificationsModal,
    // txpoppup: TxTopMenuPopup,
    'logout-modal': LogoutModal
  },
  data() {
    return {
      supportedLanguages: [
        { name: 'Deutsch', flag: 'de', langCode: 'en_EN' },
        { name: 'Ελληνικά', flag: 'gr', langCode: 'en_EN' },
        { name: 'English', flag: 'en', langCode: 'en_EN' },
        { name: 'Español', flag: 'es', langCode: 'es_ES' },
        { name: 'Farsi', flag: 'ir', langCode: 'en_EN' },
        { name: 'Suomi', flag: 'fi', langCode: 'en_EN' },
        { name: 'Magyar', flag: 'hu', langCode: 'en_EN' },
        { name: 'Haitian Creole', flag: 'ht', langCode: 'en_EN' },
        { name: 'Bahasa Indonesia', flag: 'id', langCode: 'en_EN' },
        { name: 'Italiano', flag: 'it', langCode: 'en_EN' },
        { name: '日本語', flag: 'ja', langCode: 'ja_JP' },
        { name: '한국어', flag: 'ko', langCode: 'ko_KR' },
        { name: 'Nederlands', flag: 'nl', langCode: 'en_EN' },
        { name: 'Norsk Bokmål', flag: 'no', langCode: 'en_EN' },
        { name: 'Polski', flag: 'pl', langCode: 'en_EN' },
        { name: 'Português', flag: 'pt', langCode: 'en_EN' },
        { name: 'Русский', flag: 'ru', langCode: 'ru_RU' },
        { name: 'ภาษาไทย', flag: 'th', langCode: 'en_EN' },
        { name: 'Türkçe', flag: 'tr', langCode: 'en_EN' },
        { name: 'Tiếng Việt', flag: 'vn', langCode: 'en_EN' },
        { name: '简体中文', flag: 'zh-Hans', langCode: 'zh_CN' },
        { name: '繁體中文', flag: 'zh-Hant', langCode: 'zh_CN' }
      ],
      currentName: 'English',
      currentFlag: 'en',
      isPageOnTop: true,
      isMobileMenuOpen: false
    };
  },
  computed: {
    ...mapGetters({
      wallet: 'wallet',
      online: 'online'
    })
  },
  // watch: {
  //   notifications() {
  //     this.$refs.notification.$refs.notification.show();
  //   }
  // },
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
    if (!/zh[-_]/.test(this.currentFlag)) {
      this.currentFlag = this.currentFlag.split(/[-_]/)[0];
    }

    this.currentName = this.supportedLanguages.filter(
      item => item.flag === this.currentFlag
    )[0].name;

    // On load, if page is not on top, apply small menu and show scroll top button
    this.onPageScroll();

    // On scroll,  if page is not on top, apply small menu and show scroll top button
    window.onscroll = () => {
      this.onPageScroll();
    };
  },
  methods: {
    openSettings() {
      this.$refs.settings.$refs.settings.show();
    },
    // openNotifications() {
    //   this.$children[1].$refs.notifications.show();
    // },
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
      //this.$store.dispatch('clearWallet');
      //this.$router.push('/');
    },
    showNotifications() {
      this.$refs.notifications.$refs.notification.show();
    },
    onPageScroll() {
      const topPos = this.$root.$el.getBoundingClientRect().top;
      this.isPageOnTop = !(topPos < -150);
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'HeaderContainer.scss';
</style>
