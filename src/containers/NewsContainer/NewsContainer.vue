<template>
  <div class="news" id="news">
    <div class="wrap">
      <div class="page-container">
        <div class="top-title">
          <h2>{{ $t("news.title") }}</h2>
        </div>
        <div class="grid-col-3 news-container">
          <news-article v-for="item in articles" v-bind:key="item.id" :link="item.link" :title="item.title" :desc="item.desc" :fb="item.fb" :twitter="item.twitter" :readMore="item.readMore"></news-article>
        </div><!-- .news-container -->
      </div><!-- .page-container -->
    </div><!-- .wrap -->
  </div><!-- .about-mew -->
</template>

<script>
export default {
  data () {
    return {
      articles: [
        {
          title: this.$t('news.article1.title'),
          desc: this.$t('news.article1.desc'),
          link: '/',
          fb: 'https://facebook.com',
          twitter: 'https://twitter.com',
          readMore: this.$t('news.readMore')
        },
        {
          title: this.$t('news.article2.title'),
          desc: this.$t('news.article2.desc'),
          link: '/',
          fb: 'https://facebook.com',
          twitter: 'https://twitter.com',
          readMore: this.$t('news.readMore')
        },
        {
          title: this.$t('news.article3.title'),
          desc: this.$t('news.article3.desc'),
          link: '/',
          fb: 'https://facebook.com',
          twitter: 'https://twitter.com',
          readMore: this.$t('news.readMore')
        }
      ]
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "NewsContainer.scss";
</style>
