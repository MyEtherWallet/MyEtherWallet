<template>
  <div class="team">

    <div class="wrap">
      <div class="page-container">
        <transition name="set1fade">
          <div class="items-container" id="set1" v-show="set1.length > 0 && showSet">
            <div class="item" v-for="token in set1" :key="token.symbol">
              <p class="coin-name">{{token.symbol}}</p>
              <p>${{token.quotes.USD.price}}</p>
              <p>{{token.quotes.USD.percent_change_24h }}% <i :class="token.quotes.USD.percent_change_24h > 0 ? 'fa fa-arrow-up' : 'fa fa-arrow-down'" aria-hidden="true"></i></p>
            </div>
          </div>
        </transition>
        <transition name="set2fade">
          <div class="items-container" id="set2" v-show="set2.length > 0 && !showSet">
            <div class="item" v-for="token in set2" :key="token.symbol">
              <p class="coin-name">{{token.symbol}}</p>
              <p>${{token.quotes.USD.price}}</p>
              <p>{{token.quotes.USD.percent_change_24h }}% <i :class="token.quotes.USD.percent_change_24h > 0 ? 'fa fa-arrow-up' : 'fa fa-arrow-down'" aria-hidden="true"></i></p>
            </div>
          </div>
        </transition>
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
