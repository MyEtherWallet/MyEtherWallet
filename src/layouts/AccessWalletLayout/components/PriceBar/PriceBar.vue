<template>
  <div class="price-bar">
    <div class="wrap">
      <div class="page-container">
        <slider-bar duration="20s" delay="1s">
          <div class="slider-container">
            <div
              v-for="token in tokens"
              :key="token.symbol"
              class="token-container"
            >
              <p>{{ token.symbol }}</p>
              <p>${{ token.quotes.USD.price }}</p>
              <p class="percent-container">
                <span
                  >{{
                    roundPercentage(token.quotes.USD.percent_change_24h)
                  }}%</span
                >
                <i
                  :class="[
                    token.quotes.USD.percent_change_24h > 0
                      ? 'fa-arrow-up'
                      : 'fa-arrow-down',
                    'fa'
                  ]"
                />
              </p>
            </div>
          </div>
        </slider-bar>
      </div>
    </div>
  </div>
</template>
<script>
import SliderBar from '@/components/SliderBar';
import BigNumber from 'bignumber.js';
export default {
  components: {
    'slider-bar': SliderBar
  },
  props: {
    tokens: {
      type: Array,
      default: function() {
        return [];
      }
    }
  },
  data() {
    return {
      token1: [],
      token2: [],
      hidden: true
    };
  },
  mounted() {
    setInterval(() => {
      this.hidden = !this.hidden;
    }, 3000);
  },
  methods: {
    roundPercentage(num) {
      return new BigNumber(num).toFixed(2);
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'PriceBar.scss';
</style>
