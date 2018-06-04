<template>
  <div class="news" id="pagelink-news">
    <div class="wrap">
      <div class="page-container">
        <div class="top-title">
          <h2>{{ $t("news.title") }}</h2>
        </div>
        <div class="grid-col-3 news-container">

          <div v-for="item in newsTitle" v-bind:key="item.id" class="news">
            <div class="news-image" style="background-image: url(https://media.kasperskydaily.com/wp-content/uploads/sites/92/2016/09/06021623/bitcoin-easy-explanation-featured.jpg);"></div>
            <div class="news-text">
              <h4>{{item.title}}</h4>
              <p>
                {{ item.desc }}
              </p>
              <div class="links">
                <p><router-link :to="item.link"></router-link></p>
                <div>
                  <a :href="item.fb" target="_blank">
                    <i class="fa fa-facebook" aria-hidden="true"></i>
                  </a>
                  <a :href="item.twitter" target="_blank">
                    <i class="fa fa-twitter" aria-hidden="true"></i>
                  </a>
                </div>
              </div>
            </div>
          </div>

        </div><!-- .news-container -->
      </div><!-- .page-container -->
    </div><!-- .wrap -->
  </div><!-- .about-mew -->
</template>

<script>
export default {
  data () {
    return {
      newsTitle: [
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
  @import "News.scss";
</style>
