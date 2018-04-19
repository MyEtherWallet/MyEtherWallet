<template>
  <div class="news">
    <div class="wrap">
      <div class="page-container">
        <div class="top-title">
          <h2>News Updated</h2>
        </div>
        <div class="grid-col-3 news-container">

          <div v-for="title in newsTitle" v-bind:key="title.id" class="news">
            <div class="news-image" style="background-image: url(https://media.kasperskydaily.com/wp-content/uploads/sites/92/2016/09/06021623/bitcoin-easy-explanation-featured.jpg);"></div>
            <div class="news-text">
              <h4>{{title}}</h4>
              <p>
                SAN FRANCISCO - Recently the founder of something called
                Ripple briefly became richer than Mark Zuckerberg.
                Another day an anonymous donor set up an $86 million…
              </p>
              <div class="links">
                <p><router-link to="/">Read More...</router-link></p>
                <div>
                  <a href="https://facebook.com" target="_blank">
                    <i class="fa fa-facebook" aria-hidden="true"></i>
                  </a>
                  <a href="https://twitter.com" target="_blank">
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
        'Your Cryptocurrency Masters Are Getting Hilariously Rich, and…',
        'Recently the founder of something called',
        'Another day an anonymous donor set up an $86 million…',
        'Another day an anonymous donor set up an $86 million…',
        'Another day an anonymous donor set up an $86 million…'
      ]
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "News.scss";
</style>
