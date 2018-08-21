<template>
  <div class="news">
    <div
      class="news-image"
      style="background-image: url(https://media.kasperskydaily.com/wp-content/uploads/sites/92/2016/09/06021623/bitcoin-easy-explanation-featured.jpg);"/>
    <div class="news-text">
      <h4>{{ title }}</h4>
      <p>
        {{ desc }}
      </p>
      <div class="links">
        <p><router-link :to="link">{{ readMore }}</router-link></p>
        <div>
          <a
            v-if="fb !== ''"
            :href="fb"
            target="_blank">
            <i
              class="fa fa-facebook"
              aria-hidden="true"/>
          </a>
          <a
            v-if="twitter !== ''"
            :href="twitter"
            target="_blank">
            <i
              class="fa fa-twitter"
              aria-hidden="true"/>
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: ''
    },
    desc: {
      type: String,
      default: ''
    },
    fb: {
      type: String,
      default: ''
    },
    twitter: {
      type: String,
      default: ''
    },
    readMore: {
      type: String,
      default: ''
    },
    link: {
      type: String,
      default: ''
    }
  },
  data() {
    return {};
  }
};
</script>

<style lang="scss" scoped>
@import 'NewsArticle.scss';
</style>
