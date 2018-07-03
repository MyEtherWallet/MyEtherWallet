<template>
  <div class="team">

    <div class="wrap" style="overflow: hidden;">
      <div class="page-container">
        <infinite-slider duration="20s" delay="0s">
          <div class="slider-container">
            <div v-for="token in tokens" :key="token.symbol" class="token-container">
              <p class="token-text">{{token.symbol}}</p>
              <p class="token-text">${{token.quotes.USD.price}}</p>
              <p class="token-text percent-container">
                <span>{{token.quotes.USD.percent_change_24h }}%</span> <i :class="token.quotes.USD.percent_change_24h > 0 ? 'fa fa-arrow-up' : 'fa fa-arrow-down'" aria-hidden="true"></i>
              </p>
            </div>
          </div>
        </infinite-slider>

      </div><!-- .page-container -->
    </div><!-- .wrap -->

  </div><!-- .team -->
</template>

<script>
export default {
  props: ['tokens'],
  data () {
    return {
      set1: [],
      set2: [],
      rotationInterval: null,
      showSet: true
    }
  },
  methods: {
    rotate: function () {
      const self = this
      self.showSet = !self.showSet
    }
  },
  mounted: function () {
    const self = this
    self.rotationInterval = setInterval(self.rotate, 5000)
  },
  watch: {
    tokens: function (val) {
      const self = this
      self.set1 = self.tokens.slice(0, 9)
      self.set2 = self.tokens.slice(10, 19)
    }
  },
  beforeDestroy: function () {
    const self = this
    clearInterval(self.rotationInterval)
  }
}
</script>

<style lang="scss" scoped>
  @import "PriceBar.scss";
</style>
