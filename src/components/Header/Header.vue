<template>
  <div class="header">
    <div class="wrap">
      <div class="fixed-header">
        <div class="page-container">
          <div class="header-container">
            <router-link to="/">
              <div class="top-logo">
                <img class="logo-large" src="~@/assets/images/logo.png">
              </div>
            </router-link>
            <div class="top-menu">

              <b-nav>
                <b-nav-item v-bind:to="'/'">Home</b-nav-item>
                <b-nav-item href="#pagelink-about-mew">About</b-nav-item>
                <b-nav-item href="#pagelink-faqs">FAQs</b-nav-item>
                <b-nav-item href="#pagelink-news">News</b-nav-item>
                <div class="current-language-flag">
                  <img class="show" data-flag-name="gb" src="~@/assets/images/flags/gb.svg">
                  <img data-flag-name="kr" src="~@/assets/images/flags/kr.svg">
                  <img data-flag-name="jp" src="~@/assets/images/flags/jp.svg">
                  <img data-flag-name="cn" src="~@/assets/images/flags/cn.svg">
                  <img data-flag-name="ru" src="~@/assets/images/flags/ru.svg">
                  <img data-flag-name="de" src="~@/assets/images/flags/de.svg">
                </div>
                <b-nav-item-dropdown class="language-menu" id="nav7_ddown" text="English" extra-toggle-classes="nav-link-custom" right>
                  <b-dropdown-item class="active" v-on:click="languageItemClicked" data-flag-name="gb">English</b-dropdown-item>
                  <b-dropdown-item v-on:click="languageItemClicked" data-flag-name="kr">Korean</b-dropdown-item>
                  <b-dropdown-item v-on:click="languageItemClicked" data-flag-name="jp">Japanese</b-dropdown-item>
                  <b-dropdown-item v-on:click="languageItemClicked" data-flag-name="cn">Chinese</b-dropdown-item>
                  <b-dropdown-item v-on:click="languageItemClicked" data-flag-name="ru">Russian</b-dropdown-item>
                  <b-dropdown-item v-on:click="languageItemClicked" data-flag-name="de">German</b-dropdown-item>
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
          </div><!-- .header-container -->
        </div><!-- .page-container -->
      </div><!-- .fixed-header -->
    </div><!-- .wrap -->
  </div><!-- .header -->
</template>

<script>
export default {
  data () {
    return {
    }
  },
  methods: {
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
