<template>
  <div class="faqs">
    <div class="wrap" id="pagelink-faqs">
      <div class="page-container">
        <div class="flex-col-vertical-bottom top-title">
          <div class="title">
            <h2>{{ $t("reused.faqs") }}</h2>
            <h5>
              {{ $t("faqs.subheading") }}
              <router-link to="/">{{ $t("faqs.seeMore") }}</router-link>
            </h5>
          </div>
          <div class="support">
            <router-link to="/">
              <div><img src="~@/assets/images/home/bell.png"></div>
              <div><h5>{{ $t("faqs.customerSupport") }}</h5></div>
            </router-link>
          </div>
        </div><!-- .top-title -->
        <div class="grid-col-2 qa-cards">
          <div class="card-block">
            <h4 class="title">{{ $t("faqs.gettingStarted") }}</h4>
            <div class="questions">
              <router-link v-for="(item, index) in gettingStartedArticles" :to="item.to" :key="item+index+'gettingStarted'"><p>{{ $t(`${"faqs.article" + (index + 1)}`) }}</p></router-link>
            </div>
          </div>
          <div class="card-block">
            <h4 class="title">{{ $t("faqs.securityAndPhishing") }}</h4>
            <div class="questions">
              <router-link v-for="(item, index) in gettingStartedArticles" :to="item.to" :key="item+index+'securityAndPhishing'"><p>{{ $t(`${"faqs.article" + (index + 1)}`) }}</p></router-link>
            </div>
          </div>
          <div class="card-block">
            <h4 class="title">{{ $t("faqs.transactions") }}</h4>
            <div class="questions">
              <router-link v-for="(item, index) in gettingStartedArticles" :to="item.to" :key="item+index+'transactions'"><p>{{ $t(`${"faqs.article" + (index + 1)}`) }}</p></router-link>
            </div>
          </div>
          <div class="card-block">
            <h4 class="title">{{ $t("faqs.privKeyandPass") }}</h4>
            <div class="questions">
              <router-link v-for="(item, index) in gettingStartedArticles" :to="item.to" :key="item+index+'privKeyandPass'"><p>{{ $t(`${"faqs.article" + (index + 1)}`) }}</p></router-link>
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
      gettingStartedArticles: [
        {to: '/'},
        {to: '/'},
        {to: '/'},
        {to: '/'},
        {to: '/'},
        {to: '/'}
      ]
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "FAQs.scss";
</style>
