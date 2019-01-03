<template>
  <div class="price-bar">
    <div class="wrap" style="overflow: hidden;">
      <div class="page-container">
        <div class="slider-container">
          <transition :duration="{ enter: 800, leave: 800 }" name="first-set">
            <div v-if="!hidden">
              <div
                v-for="token in token1"
                :key="token.symbol"
                class="token-container"
              >
                <p class="token-text">{{ token.symbol }}</p>
                <p class="token-text">${{ token.quotes.USD.price }}</p>
                <p class="token-text percent-container">
                  <span>{{ token.quotes.USD.percent_change_24h }}%</span>
                  <i
                    :class="
                      token.quotes.USD.percent_change_24h > 0
                        ? 'fa fa-arrow-up'
                        : 'fa fa-arrow-down'
                    "
                    aria-hidden="true"
                  />
                </p>
              </div>
            </div>
            <div v-else>
              <div
                v-for="token in token2"
                :key="token.symbol"
                class="token-container"
              >
                <p class="token-text">{{ token.symbol }}</p>
                <p class="token-text">${{ token.quotes.USD.price }}</p>
                <p class="token-text percent-container">
                  <span>{{ token.quotes.USD.percent_change_24h }}%</span>
                  <i
                    :class="
                      token.quotes.USD.percent_change_24h > 0
                        ? 'fa fa-arrow-up'
                        : 'fa fa-arrow-down'
                    "
                    aria-hidden="true"
                  />
                </p>
              </div>
            </div>
          </transition>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
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
  watch: {
    tokens(newVal) {
      if (newVal.length > 0) {
        this.token1 = newVal.slice(0, 8);
        this.token2 = newVal.slice(9, 17);
      }
    }
  },
  mounted() {
    setInterval(() => {
      this.hidden = !this.hidden;
    }, 3000);
  }
};
</script>

<style lang="scss" scoped>
@import 'PriceBar.scss';
</style>
