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
                <span>{{ token.quotes.USD.percent_change_24h }}%</span>
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
    <!-- <div class="wrap" style="overflow: hidden;">
      <div class="page-container">
        <div class="slider-container">
          <transition name="first-set">
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
          </transition>
          <transition name="second-set">
            <div v-if="hidden">
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
    </div>-->
  </div>
</template>
<script>
import SliderBar from '@/components/SliderBar';
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
  }
};
</script>

<style lang="scss" scoped>
@import 'PriceBar.scss';
</style>
