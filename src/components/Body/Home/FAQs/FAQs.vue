<template>
  <div class="faqs">
    <div class="wrap" id="pagelink-faqs">
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
              <div><img src="~@/assets/images/icons/help-center.png"></div>
              <div><h5>Customer Support</h5></div>
            </router-link>
          </div>
        </div><!-- .top-title -->
        <div class="grid-col-2 qa-cards">
          <div class="card-block">
            <h4 class="title">Getting Started With MEW</h4>
            <div class="questions">
              <router-link to="/"><p>What is MEW?</p></router-link>
              <router-link to="/"><p>How to create a wallet?</p></router-link>
              <router-link to="/"><p>How to properly save and backup your wallet</p></router-link>
              <router-link to="/"><p>How to access your wallet</p></router-link>
              <router-link to="/"><p>Protecting yourself and your funds</p></router-link>
              <router-link to="/"><p>Checking the balance of your account</p></router-link>
            </div>
          </div>
          <div class="card-block">
            <h4 class="title">Security And Phishing</h4>
            <div class="questions">
              <router-link to="/"><p>What is MEW?</p></router-link>
              <router-link to="/"><p>How to create a wallet?</p></router-link>
              <router-link to="/"><p>How to properly save and backup your wallet</p></router-link>
              <router-link to="/"><p>How to access your wallet</p></router-link>
              <router-link to="/"><p>Protecting yourself and your funds</p></router-link>
              <router-link to="/"><p>Checking the balance of your account</p></router-link>
            </div>
          </div>
          <div class="card-block">
            <h4 class="title">Transactions</h4>
            <div class="questions">
              <router-link to="/"><p>What is MEW?</p></router-link>
              <router-link to="/"><p>How to create a wallet?</p></router-link>
              <router-link to="/"><p>How to properly save and backup your wallet</p></router-link>
              <router-link to="/"><p>How to access your wallet</p></router-link>
              <router-link to="/"><p>Protecting yourself and your funds</p></router-link>
              <router-link to="/"><p>Checking the balance of your account</p></router-link>
            </div>
          </div>
          <div class="card-block">
            <h4 class="title">Private Keys And Passwords</h4>
            <div class="questions">
              <router-link to="/"><p>What is MEW?</p></router-link>
              <router-link to="/"><p>How to create a wallet?</p></router-link>
              <router-link to="/"><p>How to properly save and backup your wallet</p></router-link>
              <router-link to="/"><p>How to access your wallet</p></router-link>
              <router-link to="/"><p>Protecting yourself and your funds</p></router-link>
              <router-link to="/"><p>Checking the balance of your account</p></router-link>
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
