<template>
  <div  class="news">
    <div class="news-image" style="background-image: url(https://media.kasperskydaily.com/wp-content/uploads/sites/92/2016/09/06021623/bitcoin-easy-explanation-featured.jpg);"></div>
    <div class="news-text">
      <h4>{{title}}</h4>
      <p>
        {{ desc }}
      </p>
      <div class="links">
        <p><router-link :to="link">{{readMore}}</router-link></p>
        <div>
          <a :href="fb" v-if="fb !== ''" target="_blank">
            <i class="fa fa-facebook" aria-hidden="true"></i>
          </a>
          <a :href="twitter" v-if="twitter !== ''" target="_blank">
            <i class="fa fa-twitter" aria-hidden="true"></i>
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['title', 'desc', 'fb', 'twitter', 'readMore', 'link'],
  data () {
    return {
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "NewsArticle.scss";
</style>
