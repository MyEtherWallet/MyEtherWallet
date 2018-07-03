<template>
  <div class="header">
    <div class="wrap">
      <div class="fixed-header">
        <div class="page-container">
          <div class="header-container">
            <router-link to="/" v-on:click.native="scrollTop()">
              <div class="top-logo">
                <img class="logo-large" src="~@/assets/images/logo.png">
              </div>
            </router-link>
            <div class="top-menu">

              <b-nav>
                <b-nav-item to="/" exact @click="scrollTop()"> {{ $t("header.home") }} </b-nav-item>
                <b-nav-item to="/#about-mew">{{ $t("header.about") }}</b-nav-item>
                <b-nav-item to="/#faqs">{{ $t("reused.faqs") }}</b-nav-item>
                <b-nav-item to="/#news" v-show="online">{{ $t("reused.news") }}</b-nav-item>

                <div class="current-language-flag">
                  <img class="show" :src="require(`@/assets/images/flags/${currentFlag}.svg`)">
                </div>

                <div class="language-menu-container">
                  <div class="arrows">
                    <i class="fa fa-angle-down" aria-hidden="true"></i>
                  </div>
                  <b-nav-item-dropdown class="language-menu" :text="currentName" extra-toggle-classes="nav-link-custom" right>
                    <b-dropdown-item v-on:click="languageItemClicked" v-for="language in supportedLanguages" :active="$root._i18n.locale === language.flag" :key="language.key" :data-flag-name="language.flag">
                      {{language.name}}
                    </b-dropdown-item>
                  </b-nav-item-dropdown>
                </div>
                <b-nav-item-dropdown right no-caret v-if="wallet !== null" extra-toggle-classes="identicon-dropdown">
                  <template slot="button-content">
                    <blockie :address='"0x"+wallet.getAddress().toString("hex")' width="35px" height="35px" />
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
export default {
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
    languageItemClicked: function (e) {
      const self = this
      let flag = e.target.getAttribute('data-flag-name')

      self.$root._i18n.locale = flag
      self.currentName = e.target.innerText.replace(/^\s+|\s+$|\s+(?=\s)/g, '')
      self.currentFlag = flag
      localStorage.setItem('locale', flag)
    },
    scrollTop: function () {
      window.scrollTo(0, 0)
    },
    logout: function () {
      const self = this
      self.$store.dispatch('clearWallet')
      self.$router.push('/')
    },
    toggleLogoutDropdown: function () {
      console.log(this.$children[7])
      this.$children[7].toggle()
    }
  },
  mounted: function () {
    const self = this
    if (self.$store.state.online) {
      self.online = true
    } else {
      self.online = false
    }

    if (localStorage.getItem('locale') !== null) {
      self.$root._i18n.locale = localStorage.getItem('locale')
      self.currentFlag = localStorage.getItem('locale')
    } else {
      localStorage.setItem('locale', self.$root._i18n.locale)
      self.currentFlag = self.$root._i18n.locale
    }

    self.currentName = self.supportedLanguages.filter(item => item.flag === self.currentFlag)[0].name

    window.onscroll = function (e) {
      var element = document.querySelector('body')
      var header = document.querySelector('.fixed-header')
      var logoLarge = document.querySelector('.logo-large')
      var topPos = element.getBoundingClientRect().top
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
    online: function (newVal) {
      const self = this
      self.online = newVal
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
