<template>
  <div class="about-mew">
    <div class="wrap">
      <div class="page-container">
        <div class="flex-col-vertical-bottom top-title">
          <div class="title">
            <h2>FAQs</h2>
            <h5>
              Have not found the question that you are looking for?
              <router-link to="/">See More…</router-link>
            </h5>
          </div>
          <div class="support">
            <router-link to="/">
              <div><img src="~@/assets/images/home/bell.png"></div>
              <div><h5>Customer Support</h5></div>
            </router-link>
          </div>
        </div><!-- .top-title -->
        <div class="grid-col-2 qa-cards">
          <div class="card">
            <h4 class="title">Getting Started With MEW</h4>
            <div class="questions">
              <p>What is MEW?</p>
              <p>How to create a wallet?</p>
              <p>How to properly save and backup your wallet</p>
              <p>How to access your wallet</p>
              <p>Protecting yourself and your funds</p>
              <p>Checking the balance of your account</p>
            </div>
          </div>
          <div class="card">
            <h4 class="title">Security And Phishing</h4>
            <div class="questions">
              <p>What is MEW?</p>
              <p>How to create a wallet?</p>
              <p>How to properly save and backup your wallet</p>
              <p>How to access your wallet</p>
              <p>Protecting yourself and your funds</p>
              <p>Checking the balance of your account</p>
            </div>
          </div>
          <div class="card">
            <h4 class="title">Transactions</h4>
            <div class="questions">
              <p>What is MEW?</p>
              <p>How to create a wallet?</p>
              <p>How to properly save and backup your wallet</p>
              <p>How to access your wallet</p>
              <p>Protecting yourself and your funds</p>
              <p>Checking the balance of your account</p>
            </div>
          </div>
          <div class="card">
            <h4 class="title">Private Keys And Passwords</h4>
            <div class="questions">
              <p>What is MEW?</p>
              <p>How to create a wallet?</p>
              <p>How to properly save and backup your wallet</p>
              <p>How to access your wallet</p>
              <p>Protecting yourself and your funds</p>
              <p>Checking the balance of your account</p>
            </div>
          </div>
        </div><!-- .qa-cards -->
      </div><!-- .page-container -->
    </div><!-- .wrap -->
  </div><!-- .about-mew -->
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
  @import "FAQs.scss";
</style>
