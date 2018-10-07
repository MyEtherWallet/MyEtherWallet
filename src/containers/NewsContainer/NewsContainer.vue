<template>
  <div 
    id="news" 
    class="news">
    <div class="wrap">
      <div class="page-container">
        <div class="top-title">
          <h2>{{ $t("common.news") }}</h2>
        </div>
        <div class="grid-col-3 news-container">
          <news-article 
            v-for="item in articles" 
            :key="item.id" 
            :link="item.link" 
            :title="item.title" 
            :desc="item.desc" 
            :fb="item.fb" 
            :twitter="item.twitter" 
            :read-more="item.readMore"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import NewsArticle from './components/NewsArticle';
export default {
  components: {
    'news-article': NewsArticle
  },
  data() {
    return {
      articles: [
        {
          title:
            'Your Cryptocurrency Masters Are Getting Hilariously Rich, and…',
          desc:
            'SAN FRANCISCO - Recently the founder of something called Ripple briefly became richer than Mark Zuckerberg. Another day an anonymous donor set up an $86 million…',
          link: '/',
          fb: '',
          twitter: '',
          readMore: 'Read More...'
        },
        {
          title: 'Recently the founder of something called',
          desc:
            'SAN FRANCISCO - Recently the founder of something called Ripple briefly became richer than Mark Zuckerberg. Another day an anonymous donor set up an $86 million…',
          link: '/',
          fb: '',
          twitter: '',
          readMore: 'Read More...'
        },
        {
          title: 'Another day an anonymous donor set up an $86 million…',
          desc:
            'SAN FRANCISCO - Recently the founder of something called Ripple briefly became richer than Mark Zuckerberg. Another day an anonymous donor set up an $86 million…',
          link: '/',
          fb: '',
          twitter: '',
          readMore: 'Read More...'
        }
      ]
    };
  }
};
</script>

<style lang="scss" scoped>
@import 'NewsContainer-desktop.scss';
@import 'NewsContainer-tablet.scss';
@import 'NewsContainer-mobile.scss';
</style>
