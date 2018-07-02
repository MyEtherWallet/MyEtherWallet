<template>
  <div class="team">

    <div class="wrap" style="overflow: hidden;">
      <div class="page-container">
        <infinite-slider duration="15s" delay="0s">
          <div style="display: flex; align-items: center; justify-content: center; margin: 20px 0;">
            <div v-for="token in tokens" :key="token.symbol" style="flex: 33; padding: 0 60px; color: #fff; border-right: 1px solid white;">
              <p style="color: #fff; font-size: 10px;">{{token.symbol}}</p>
              <p style="color: #fff; font-size: 10px;">${{token.quotes.USD.price}}</p>
              <span style="color: #fff; font-size: 10px;">
                {{token.quotes.USD.percent_change_24h }}% <i :class="token.quotes.USD.percent_change_24h > 0 ? 'fa fa-arrow-up' : 'fa fa-arrow-down'" aria-hidden="true"></i>
              </span>
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
