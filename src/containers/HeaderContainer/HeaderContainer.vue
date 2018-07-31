<template>
  <div class="header">
    <div class="wrap">
      <div class="fixed-header" ref="fixedHeader">
        <div class="page-container">
          <div class="header-container">
            <router-link to="/" v-on:click.native="scrollTop()">
              <div class="top-logo">
                <img class="logo-large" src="~@/assets/images/logo.png" ref="logoLarge">
              </div>
            </router-link>
            <div class="top-menu">

              <b-nav>
                <b-nav-item to="/" exact @click="scrollTop()"> {{ $t("header.home") }} </b-nav-item>
                <b-nav-item to="/#about-mew">{{ $t("header.about") }}</b-nav-item>
                <b-nav-item to="/#faqs">{{ $t("common.faqs") }}</b-nav-item>
                <b-nav-item to="/#news" v-show="online">{{ $t("common.news") }}</b-nav-item>

                <div class="language-menu-container">
                  <div class="arrows">
                    <i class="fa fa-angle-down" aria-hidden="true"></i>
                  </div>
                  <b-nav-item-dropdown class="language-menu" extra-toggle-classes="nav-link-custom" right>
                    <template slot="button-content">
                      <div class="current-language-flag">
                        <!-- <img class="show" :src="require(`@/assets/images/flags/${currentFlag}.svg`)"> -->
                        <p>{{ currentName }}</p>
                      </div>
                    </template>
                    <b-dropdown-item v-on:click="languageItemClicked" v-for="language in supportedLanguages" :active="$root._i18n.locale === language.flag" :key="language.key" :data-flag-name="language.flag">
                      {{language.name}}
                    </b-dropdown-item>
                  </b-nav-item-dropdown>
                </div>
                <notification v-if="wallet !== null"></notification>
                <b-nav-item to="/create-wallet" v-if="wallet === null && $route.fullPath === '/'">
                  <div class="get-free-wallet">
                    Get a Free Wallet
                 </div>
                </b-nav-item>
                <b-nav-item-dropdown right no-caret v-if="wallet !== null" extra-toggle-classes="identicon-dropdown">
                  <template slot="button-content">
                    <blockie :address='wallet.getAddressString()' width="35px" height="35px" />
                  </template>
                  <b-dropdown-item @click="logout">
                    Log out
                  </b-dropdown-item>
                </b-nav-item-dropdown>
              </b-nav>

            </div>
            <div class="mobile-menu">
              <div class="mobile-menu-button">
                <div class="bar-1"></div>
                <div class="bar-2"></div>
                <div class="bar-3"></div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import store from 'store'
import Blockie from '@/components/Blockie'
import Notification from '@/components/Notification'

export default {
  components: {
    'blockie': Blockie,
    'notification': Notification
  },
  data () {
    return {
      supportedLanguages: [
        {name: 'Deutsch', flag: 'de'},
        {name: 'Ελληνικά', flag: 'gr'},
        {name: 'English', flag: 'gb'},
        {name: 'Español', flag: 'es'},
        {name: 'Farsi', flag: 'ir'},
        {name: 'Suomi', flag: 'fi'},
        {name: 'Magyar', flag: 'hu'},
        {name: 'Haitian Creole', flag: 'ht'},
        {name: 'Bahasa Indonesia', flag: 'id'},
        {name: 'Italiano', flag: 'it'},
        {name: '日本語', flag: 'jp'},
        {name: '한국어', flag: 'kr'},
        {name: 'Nederlands', flag: 'nl'},
        {name: 'Norsk Bokmål', flag: 'no'},
        {name: 'Polski', flag: 'pl'},
        {name: 'Português', flag: 'pt'},
        {name: 'Русский', flag: 'ru'},
        {name: 'ภาษาไทย', flag: 'th'},
        {name: 'Türkçe', flag: 'tr'},
        {name: 'Tiếng Việt', flag: 'vn'},
        {name: '简体中文', flag: 'cn-sim'},
        {name: '繁體中文', flag: 'cn-tr'}
      ],
      online: true,
      currentName: 'English',
      currentFlag: 'gb'
    }
  },
  methods: {
    languageItemClicked (e) {
      let flag = e.target.getAttribute('data-flag-name')

      this.$root._i18n.locale = flag
      this.currentName = e.target.innerText.replace(/^\s+|\s+$|\s+(?=\s)/g, '')
      this.currentFlag = flag
      store.set('locale', flag)
    },
    scrollTop () {
      window.scrollTo(0, 0)
    },
    logout () {
      this.$store.dispatch('clearWallet')
      this.$router.push('/')
    },
    showNotifications () {
      this.$children[6].$refs.notification.show()
    }
  },
  mounted () {
    const self = this
    if (this.$store.state.online) {
      this.online = true
    } else {
      this.online = false
    }

    if (store.get('locale') !== null) {
      this.$root._i18n.locale = store.get('locale')
      this.currentFlag = store.get('locale')
    } else {
      store.set('locale', this.$root._i18n.locale)
      this.currentFlag = this.$root._i18n.locale
    }

    this.currentName = this.supportedLanguages.filter(item => item.flag === this.currentFlag)[0].name
    window.onscroll = function (e) {
      const header = self.$refs.fixedHeader
      const logoLarge = self.$refs.logoLarge
      const topPos = self.$root.$el.getBoundingClientRect().top
      if (topPos < -150) {
        header.classList.add('tiny-header')
        logoLarge.classList.add('logo-small')
      } else {
        header.classList.remove('tiny-header')
        logoLarge.classList.remove('logo-small')
      }
    }
  },
  watch: {
    online (newVal) {
      this.online = newVal
    },
    notifications (newVal) {

    }
  },
  computed: {
    ...mapGetters({
      wallet: 'wallet'
    })
  }
}
</script>

<style lang="scss" scoped>
  @import "HeaderContainer.scss";
</style>
