<template>
  <div class="header">
    <div class="wrap">
      <div class="fixed-header">
        <div class="page-container">
          <div class="header-container">
            <router-link to="/" v-on:click.native="setHomepageSublink('homepage-home')">
              <div class="top-logo">
                <img class="logo-large" src="~@/assets/images/logo.png">
              </div>
            </router-link>
            <div class="top-menu">

              <b-nav>
                <b-nav-item><router-link to="/" v-on:click.native="setHomepageSublink('homepage-home')">Home</router-link></b-nav-item>
                <b-nav-item><router-link to="/" v-on:click.native="setHomepageSublink('homepage-about')">About</router-link></b-nav-item>
                <b-nav-item><router-link to="/" v-on:click.native="setHomepageSublink('homepage-faqs')">FAQs</router-link></b-nav-item>
                <b-nav-item><router-link to="/" v-on:click.native="setHomepageSublink('homepage-news')">News</router-link></b-nav-item>
                <div class="current-language-flag">
                  <img class="show" data-flag-name="gb" src="~@/assets/images/flags/gb.svg">
                  <img data-flag-name="kr" src="~@/assets/images/flags/kr.svg">
                  <img data-flag-name="jp" src="~@/assets/images/flags/jp.svg">
                  <img data-flag-name="cn" src="~@/assets/images/flags/cn.svg">
                  <img data-flag-name="ru" src="~@/assets/images/flags/ru.svg">
                  <img data-flag-name="de" src="~@/assets/images/flags/de.svg">
                  <img data-flag-name="de" src="~@/assets/images/flags/gb.svg">
                </div>
                <div class="language-menu-container">
                  <div class="arrows">
                    <i class="fa fa-angle-down" aria-hidden="true"></i>
                  </div>
                  <b-nav-item-dropdown class="language-menu" id="nav7_ddown" text="English" extra-toggle-classes="nav-link-custom" right>
                    <b-dropdown-item v-for="lang in supportedLanguages" v-bind:class="lang.status" v-bind:key="lang.key" v-on:click="languageItemClicked" v-bind:data-flag-name="lang.flag">{{lang.name}}</b-dropdown-item>
                  </b-nav-item-dropdown>
                </div>
              </b-nav>

            </div>
            <div class="mobile-menu">
              <div class="mobile-menu-button">
                <div class="bar-1"></div>
                <div class="bar-2"></div>
                <div class="bar-3"></div>
              </div>
            </div>

            <div class="notification">
              <img class="logo-large" src="~@/assets/images/icons/notification.svg">
              <div class="notification-dot"></div>
            </div>

            <router-link v-if="pageLocation === 'home'" to="/" class="nounderline">
              <div class="get-free-wallet">
                Get a Free Wallet
              </div>
            </router-link>

            <div v-show="pageLocation === 'tx'" class="blockies-image">
              <div class="blockies" id="header-blockies">
              </div>
              <div class="arrows">
                <i class="fa fa-angle-down" aria-hidden="true"></i>
              </div>
            </div>

          </div><!-- .header-container -->
        </div><!-- .page-container -->
      </div><!-- .fixed-header -->
    </div><!-- .wrap -->

  </div><!-- .header -->
</template>

<script>
// import { mapState } from 'vuex'
import makeBlockie from 'ethereum-blockies-base64'
export default {
  data () {
    return {
      supportedLanguages: [
        { name: 'Deutsch', flag: 'de', status: '' },
        { name: 'Ελληνικά', flag: '', status: '' },
        { name: 'English', flag: 'gb', status: 'active' },
        { name: 'Español', flag: '', status: '' },
        { name: 'Farsi', flag: '', status: '' },
        { name: 'Suomi', flag: '', status: '' },
        { name: 'Magyar', flag: '', status: '' },
        { name: 'Haitian Creole', flag: '', status: '' },
        { name: 'Bahasa Indonesia', flag: '', status: '' },
        { name: 'Italiano', flag: '', status: '' },
        { name: '日本語', flag: 'jp', status: '' },
        { name: '한국어', flag: 'kr', status: '' },
        { name: 'Nederlands', flag: '', status: '' },
        { name: 'Norsk Bokmål', flag: '', status: '' },
        { name: 'Polski', flag: '', status: '' },
        { name: 'Português', flag: '', status: '' },
        { name: 'Русский', flag: '', status: '' },
        { name: 'ภาษาไทย', flag: '', status: '' },
        { name: 'Türkçe', flag: '', status: '' },
        { name: 'Tiếng Việt', flag: '', status: '' },
        { name: '简体中文', flag: 'cn', status: '' },
        { name: '繁體中文', flag: 'cn', status: '' }
      ]
    }
  },
  methods: {
    setHomepageSublink: function (sublink) {
      this.$store.state.state.homepage.sublink = sublink
      var targetEl = document.querySelector('.' + this.$store.state.state.homepage.sublink)
      if (targetEl) {
        targetEl.scrollIntoView()
        this.$store.state.state.homepage.sublink = ''
      }
    },
    languageMenuClicked: function () {
      console.log('Clicked !!!!')
    },
    // Update language text
    languageItemClicked: function (e) {
      var allLanguages = document.getElementsByClassName('dropdown-item')

      for (let i = 0; i < allLanguages.length; i++) {
        allLanguages[i].classList.remove('active')
      }

      e.target.classList.add('active')
      var countryName = e.target.innerText
      document.querySelector('.language-menu a span').innerText = countryName

      // Hide current flag image
      var currentFlag = document.querySelector('.current-language-flag img.show')
      currentFlag.classList.remove('show')

      // Get flag name for clicked language
      var flag = e.target.getAttribute('data-flag-name')

      // Get flag image for the language and display it
      var newFlagImage = document.querySelector('[data-flag-name=' + flag + ']')
      newFlagImage.classList.add('show')
    }
  },
  computed: {
    pageLocation: function () {
      return this.$store.state.state.pageStates.pageLocation
    }
  },
  mounted () {
    // Scroll to top of the page
    // window.scrollTo(0, 0)
    // Check if user scrolled window, then change header style.
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

    var address = '0x18e4fd8b11ddcb27d39993a322f83fbb5f0a893f'
    var blockiesContainer = document.getElementById('header-blockies')
    const img = new Image()
    img.src = makeBlockie(address)
    blockiesContainer.appendChild(img)
  },
  beforeDestroy () {
    // Reset page location variable
    this.$store.state.state.pageStates.pageLocation = ''
  },
  beforeCreate () {
  }
}
</script>

<style lang="scss" scoped>
  @import "Header.scss";
</style>
