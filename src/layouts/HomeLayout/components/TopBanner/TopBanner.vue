<template>
  <div class="top-banner">
    <div class="wrap">
      <div class="page-container">
        <div class="flex-col-vertical-center banner">
          <div class="banner-text">
            <h1>{{ $t('home.tagline1') }}</h1>
            <h1>{{ $t('home.tagline2') }}</h1>
            <p>{{ $t('home.subheading') }}</p>
          </div>
          <div class="banner-image">
            <img alt src="~@/assets/images/home/big-spaceman.png" />
          </div>
        </div>
        <div class="grid-col-2 promo-cards">
          <router-link to="/create-wallet" class="nounderline">
            <div class="card-block create-wallet">
              <div class="flex-col-vertical-center">
                <div class="card-image">
                  <img alt src="~@/assets/images/home/create-wallet.png" />
                </div>
                <div class="card-content">
                  <h2 class="color-white">
                    {{ $t('common.wallet.create-new') }}
                  </h2>
                  <p class="color-white">
                    {{ $t('home.create-new-wallet.text') }}
                  </p>
                  <p class="button">
                    {{ $t('home.create-new-wallet.button') }}
                    <img alt src="~@/assets/images/icons/right-arrow.png" />
                  </p>
                </div>
              </div>
            </div>
          </router-link>
          <router-link
            :to="
              wallet === null || wallet === undefined
                ? '/access-my-wallet'
                : '/interface'
            "
            class="nounderline"
          >
            <div class="card-block unlock-wallet">
              <div class="flex-col-vertical-center">
                <div class="card-image">
                  <img alt src="~@/assets/images/home/unlock-wallet.png" />
                </div>
                <div class="card-content">
                  <h2 class="color-white">
                    {{ $t('common.wallet.access-my') }}
                  </h2>
                  <p class="color-white">
                    {{ $t('home.access-my-wallet.text') }}
                  </p>
                  <p class="button">
                    {{ $t('home.access-my-wallet.button') }}
                    <img alt src="~@/assets/images/icons/right-arrow.png" />
                  </p>
                </div>
              </div>
            </div>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
export default {
  data() {
    return {};
  },
  computed: {
    ...mapState(['wallet'])
  }
};
</script>

<style lang="scss" scoped>
@import 'TopBanner-desktop.scss';
@import 'TopBanner-tablet.scss';
@import 'TopBanner-mobile.scss';
</style>
