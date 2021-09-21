<template>
  <div v-if="isLoading" class="my-5">
    <div class="loading align-center px-5 py-3 rate d-none d-sm-flex">
      <v-container fluid class="d-flex flex-column align-center my-3">
        <img :src="currentPicture" height="30" class="my-4" />
        <div class="titlePrimary--text font-weight-medium py-5">
          Finding best rates...
        </div>
        <v-progress-linear indeterminate color="primary" />
      </v-container>
    </div>

    <div
      class="
        loading
        align-center
        px-5
        py-5
        border-radius--10px
        d-flex d-sm-none
      "
    >
      <div class="titlePrimary--text font-weight-medium mew-body">
        Finding best rates...
      </div>
      <v-spacer />
      <v-skeleton-loader type="avatar" />
    </div>
  </div>
</template>

<script>
import { _ } from 'web3-utils';

export default {
  name: 'SwapProviderMentions',
  props: {
    isLoading: {
      type: Boolean,
      default: false
    },
    checkLoading: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      currentPicture: null,
      partners: [
        { image: require('../assets/0x.png') },
        { image: require('../assets/paraswap.png') },
        { image: require('../assets/1inch.png') },
        { image: require('../assets/Changelly.png') }
      ]
    };
  },
  watch: {
    isLoading(value) {
      if (value) {
        let index = 0;
        const showProviders = () => {
          _.delay(
            () => {
              if (!this.checkLoading && index >= 4) {
                this.$emit('stopLoadingProviders', false);
              }

              this.currentPicture = this.partners[index]?.image;

              if (this.checkLoading && index >= 4) {
                index = 0;
              } else {
                index++;
              }

              if (index <= this.partners.length) {
                showProviders();
              }
            },
            index === 0 ? 0 : 600
          );
        };
        showProviders();
      }
    }
  }
};
</script>

<style lang="scss">
.modules--swap--components--swap-providers-list {
  .loading {
    .v-skeleton-loader__avatar {
      height: 25px !important;
      width: 25px !important;
    }
    .v-skeleton-loader__heading {
      height: 25px !important;
      width: 100px !important;
      border-radius: 15px !important;
    }
  }
}
</style>

<style lang="scss" scoped>
.rate-active {
  border: 1px solid var(--v-primary-base) !important;
  background-color: var(--v-superPrimary-base) !important;
}
.rate {
  min-height: 60px;
  border-radius: 8px;
  border: 1px solid var(--v-selectBorder-base);
}
</style>
