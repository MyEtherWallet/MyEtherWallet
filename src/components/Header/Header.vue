<template>
  <div class="header">
    <div class="wrap">
      <div class="page-container">
        <div class="header-container">
          <div class="top-logo">
            <img src="~@/assets/images/logo.png">
          </div>
          <div class="top-menu">
            <ul>
              <li><router-link to="/">Home</router-link></li>
              <li><a href="#pagelink-about-mew">About</a></li>
              <li><a href="#pagelink-faqs">FAQs</a></li>
              <li><a href="#pagelink-news">News</a></li>
              <li>
                <img class="country-flag" src="~@/assets/images/flags/gb.svg">
                <router-link to="/">English</router-link>
                <i class="fa fa-sort-desc" aria-hidden="true"></i>
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
    </div><!-- .wrap -->
  </div><!-- .header -->
</template>

<script>
export default {
  data () {
    return {
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "Header.scss";
</style>
