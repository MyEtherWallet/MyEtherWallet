<template>
  <div class="header">
    <div class="wrap">
      <div class="fixed-header">
        <div class="page-container">
          <div class="header-container">
            <div class="top-logo">
              <img class="logo-large" src="~@/assets/images/logo.png">
            </div>
            <div class="top-menu">

              <b-nav pills>
                <b-nav-item active>Active</b-nav-item>
                <b-nav-item>Link</b-nav-item>
                <b-nav-item-dropdown id="nav7_ddown" text="Dropdown" extra-toggle-classes="nav-link-custom" right>
                  <b-dropdown-item>one</b-dropdown-item>
                  <b-dropdown-item>two</b-dropdown-item>
                  <b-dropdown-divider></b-dropdown-divider>
                  <b-dropdown-item>three</b-dropdown-item>
                </b-nav-item-dropdown>
              </b-nav>

              <ul>
                <li><router-link to="/">Home</router-link></li>
                <li><a href="#pagelink-about-mew">About</a></li>
                <li><a href="#pagelink-faqs">FAQs</a></li>
                <li><a href="#pagelink-news">News</a></li>
                <li class="menu__languages">
                  <div class="menu-button__languages">
                    <img class="country-flag" src="~@/assets/images/flags/gb.svg">
                    English
                    <i class="fa fa-chevron-down" aria-hidden="true"></i>
                  </div>
                  <div class="sub-menu__languages">
                    <div class="menu-wrap">
                      <ul class="custom-scroll-bar">
                        <li class="selected">English</li>
                        <li>Korean</li>
                        <li>Japanese</li>
                        <li>Japanese</li>
                        <li>Japanese</li>
                        <li>Japanese</li>
                        <li>Japanese</li>
                      </ul>
                    </div>
                  </div>
                </li>
              </ul>
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
