<template>
  <div class="header">
    <div class="wrap">
      <div class="fixed-header">
        <div class="page-container">
          <div class="header-container">
            <router-link to="/" v-on:click.native="setHomepageSublink('homepage-home')">
              <div class="top-logo">

                <img class="logo-large" src="static/images/logo.png">

              </div>
            </router-link>
            <div class="top-menu">

              <b-nav>
                <b-nav-item><router-link to="/" v-on:click.native="setHomepageSublink('homepage-home')">Home</router-link></b-nav-item>
                <b-nav-item href="#/eth">ETH</b-nav-item>
                <b-nav-item href="#/neo">NEO</b-nav-item>
                <b-nav-item href="#/luv">LUV</b-nav-item>
                <b-nav-item><router-link to="/" v-on:click.native="setHomepageSublink('homepage-about')">About</router-link></b-nav-item>
                <b-nav-item><router-link to="/" v-on:click.native="setHomepageSublink('homepage-faqs')">FAQs</router-link></b-nav-item>
                </b-nav>

            </div>
            <div class="mobile-menu">
              <div class="mobile-menu-button">
                <div class="bar-1"></div>
                <div class="bar-2"></div>
                <div class="bar-3"></div>
              </div>
            </div>

            <router-link to="/" class="nounderline">
              <div class="get-free-wallet">
                Get a Free Wallet
              </div>
            </router-link>

          </div><!-- .header-container -->
        </div><!-- .page-container -->
      </div><!-- .fixed-header -->
    </div><!-- .wrap -->

  </div><!-- .header -->
</template>

<script>
// import { mapState } from 'vuex'

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
  }
}
</script>

<style lang="scss" scoped>
  @import "Header.scss";
</style>
