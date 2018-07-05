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

      </div>
    </div>

  </div>
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
    rotate () {
      this.showSet = !this.showSet
    }
  },
  mounted () {
    this.rotationInterval = setInterval(this.rotate, 5000)
  },
  watch: {
    tokens (val) {
      this.set1 = this.tokens.slice(0, 9)
      this.set2 = this.tokens.slice(10, 19)
    }
  },
  beforeDestroy () {
    clearInterval(this.rotationInterval)
  }
}
</script>

<style lang="scss" scoped>
  @import "PriceBar.scss";
</style>
