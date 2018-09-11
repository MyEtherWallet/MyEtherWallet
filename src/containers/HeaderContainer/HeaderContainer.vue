<template>
  <div class="header">

    <div
      :class="isPageOnTop == false ? 'active' : ''"
      class="scrollup-container">
      <scrollupbutton/>
    </div>

    <div class="wrap">
      <div
        ref="fixedHeader"
        :class="isPageOnTop == false ? 'tiny-header' : ''"
        class="fixed-header">
        <div class="page-container">
          <div class="header-container">
            <router-link
              to="/"
              @click.native="scrollTop()">
              <div class="top-logo">
                <img
                  :class="isPageOnTop == false ? 'logo-small' : ''"
                  class="logo-large"
                  src="~@/assets/images/logo.png">
              </div>
            </router-link>
            <div class="top-menu">

              <b-nav>
                <b-nav-item
                  to="/"
                  exact
                  @click="scrollTop()"> {{ $t("header.home") }}</b-nav-item>
                <b-nav-item to="/#about-mew">{{ $t("header.about") }}</b-nav-item>
                <b-nav-item to="/#faqs">{{ $t("common.faqs") }}</b-nav-item>
                <b-nav-item
                  v-show="online"
                  to="/#news">{{ $t("common.news") }}</b-nav-item>

                <div class="language-menu-container">
                  <div class="arrows">
                    <i
                      class="fa fa-angle-down"
                      aria-hidden="true"/>
                  </div>
                  <b-nav-item-dropdown
                    class="language-menu"
                    extra-toggle-classes="nav-link-custom"
                    right>
                    <template slot="button-content">
                      <div class="current-language-flag">
                        <img
                          :src="require(`@/assets/images/flags/${currentFlag}.svg`)"
                          class="show">
                        <p>{{ currentName }}</p>
                      </div>
                    </template>
                    <b-dropdown-item
                      v-for="language in supportedLanguages"
                      :active="$root._i18n.locale === language.flag"
                      :key="language.key"
                      :data-flag-name="language.flag"
                      @click="languageItemClicked">
                      {{ language.name }}
                    </b-dropdown-item>
                  </b-nav-item-dropdown>
                </div>
                <notification v-if="wallet !== null"/>
                <b-nav-item
                  v-if="wallet === null && $route.fullPath === '/'"
                  :class="isPageOnTop == true ? 'noshow' : ''"
                  class="get-free-wallet nopadding"
                  to="/create-wallet">
                  <div class="get-free-wallet-button">
                    Get a Free Wallet
                  </div>
                </b-nav-item>
                <b-nav-item-dropdown
                  v-if="wallet !== null"
                  right
                  no-caret
                  extra-toggle-classes="identicon-dropdown">
                  <template slot="button-content">
                    <blockie
                      :address="wallet.getAddressString()"
                      width="35px"
                      height="35px"/>
                  </template>
                  <b-dropdown-item @click="logout">
                    Log out
                  </b-dropdown-item>
                </b-nav-item-dropdown>
              </b-nav>

            </div>
            <div class="mobile-menu">
              <div class="mobile-menu-button">
                <div class="bar-1"/>
                <div class="bar-2"/>
                <div class="bar-3"/>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import store from 'store';
import { Misc } from '@/helpers';
import Blockie from '@/components/Blockie';
import Notification from '@/components/Notification';
import ScrollUpButton from '@/components/ScrollUpButton';

export default {
  components: {
    blockie: Blockie,
    notification: Notification,
    scrollupbutton: ScrollUpButton
  },
  data() {
    return {
      supportedLanguages: [
        { name: 'Deutsch', flag: 'de' },
        { name: 'Ελληνικά', flag: 'gr' },
        { name: 'English', flag: 'en' },
        { name: 'Español', flag: 'es' },
        { name: 'Farsi', flag: 'ir' },
        { name: 'Suomi', flag: 'fi' },
        { name: 'Magyar', flag: 'hu' },
        { name: 'Haitian Creole', flag: 'ht' },
        { name: 'Bahasa Indonesia', flag: 'id' },
        { name: 'Italiano', flag: 'it' },
        { name: '日本語', flag: 'ja' },
        { name: '한국어', flag: 'ko' },
        { name: 'Nederlands', flag: 'nl' },
        { name: 'Norsk Bokmål', flag: 'no' },
        { name: 'Polski', flag: 'pl' },
        { name: 'Português', flag: 'pt' },
        { name: 'Русский', flag: 'ru' },
        { name: 'ภาษาไทย', flag: 'th' },
        { name: 'Türkçe', flag: 'tr' },
        { name: 'Tiếng Việt', flag: 'vn' },
        { name: '简体中文', flag: 'zh-Hans' },
        { name: '繁體中文', flag: 'zh-Hant' }
      ],
      online: true,
      currentName: 'English',
      currentFlag: 'en',
      isPageOnTop: true
    };
  },
  computed: {
    ...mapGetters({
      wallet: 'wallet'
    })
  },
  watch: {
    online(newVal) {
      this.online = newVal;
    },
    notifications() {
      this.$children[6].$refs.notification.show();
    }
  },
  mounted() {
    if (this.$store.state.online) {
      this.online = true;
    } else {
      this.online = false;
    }

    if (Misc.doesExist(store.get('locale'))) {
      this.$root._i18n.locale = store.get('locale');
      this.currentFlag = store.get('locale');
    } else {
      store.set('locale', this.$root._i18n.locale);
      this.currentFlag = this.$root._i18n.locale;
    }

    // https://github.com/MyEtherWallet/MyEtherWallet/projects/2#card-12172489
    // trivial statement to convert dialects to primary language tags, with the exception of Chinese
    if (!/zh[-_]/.test(this.currentFlag)) {
      this.currentFlag = this.currentFlag.split(/[-_]/)[0];
    }

    /*    this.currentName = this.supportedLanguages.filter(
      item => item.flag === this.currentFlag
    )[0].name;*/

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
  methods: {
    languageItemClicked(e) {
      const flag = e.target.getAttribute('data-flag-name');

      this.$root._i18n.locale = flag;
      this.currentName = e.target.innerText.replace(/^\s+|\s+$|\s+(?=\s)/g, '');
      this.currentFlag = flag;
      store.set('locale', flag);
    },
    scrollTop() {
      window.scrollTo(0, 0);
    },
    logout() {
      this.$store.dispatch('clearWallet');
      this.$router.push('/');
    },
    showNotifications() {
      this.$children[6].$refs.notification.show();
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
