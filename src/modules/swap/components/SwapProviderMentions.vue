<template>
  <div class="my-5">
    <div class="loading align-center px-5 py-3 rate d-none d-sm-flex">
      <v-container
        fluid
        class="d-flex flex-column align-center justify-center my-3"
      >
        <v-carousel
          v-model="currentIndex"
          cycle
          height="60"
          interval="800"
          hide-delimiter-background
          hide-delimiters
          :show-arrows="false"
        >
          <v-carousel-item
            v-for="(provider, i) in providers"
            :key="i"
            transition="slide-x-reverse-transition"
          >
            <v-row align-center justify-center class="fill-height">
              <v-img :src="provider.image" height="30" class="my-4" contain />
            </v-row>
          </v-carousel-item>
        </v-carousel>
        <div class="textDark--text font-weight-medium py-5">
          Finding best rates...
        </div>
      </v-container>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SwapProviderMentions',
  data() {
    return {
      currentIndex: null,
      providers: [
        { image: require('../assets/0x.png') },
        { image: require('../assets/paraswap.png') },
        { image: require('../assets/1inch.png') },
        { image: require('../assets/Changelly.png') }
      ]
    };
  },
  watch: {
    currentIndex(index) {
      if (index === this.providers.length - 1) {
        setTimeout(() => {
          this.$emit('showProviders', true);
        }, 800);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.rate-active {
  background-color: var(--v-greyLight-base) !important;
}
.rate {
  min-height: 60px;
}
</style>
