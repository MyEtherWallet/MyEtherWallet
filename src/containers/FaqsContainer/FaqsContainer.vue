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
              <div><h5>{{ $t("reused.customerSupport") }}</h5></div>
            </router-link>
          </div>
        </div><!-- .top-title -->
        <div class="grid-col-2 qa-cards">
          <faq-block v-for="(block, index) in blocks" :title="block.title" :articles="block.articles" :key="block.title + index"/>
        </div><!-- .qa-cards -->
      </div><!-- .page-container -->
    </div><!-- .wrap -->
  </div><!-- .about-mew -->
</template>

<script>
export default {
  data () {
    const self = this
    return {
      blocks: [
        {
          title: self.$t('faqs.gettingStarted'),
          articles: [
            {to: '/'},
            {to: '/'},
            {to: '/'},
            {to: '/'},
            {to: '/'},
            {to: '/'}
          ]
        },
        {
          title: self.$t('faqs.securityAndPhishing'),
          articles: [
            {to: '/'},
            {to: '/'},
            {to: '/'},
            {to: '/'},
            {to: '/'},
            {to: '/'}
          ]
        },
        {
          title: self.$t('faqs.transactions'),
          articles: [
            {to: '/'},
            {to: '/'},
            {to: '/'},
            {to: '/'},
            {to: '/'},
            {to: '/'}
          ]
        },
        {
          title: self.$t('faqs.privKeyandPass'),
          articles: [
            {to: '/'},
            {to: '/'},
            {to: '/'},
            {to: '/'},
            {to: '/'},
            {to: '/'}
          ]
        }
      ]
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "FaqsContainer.scss";
</style>
