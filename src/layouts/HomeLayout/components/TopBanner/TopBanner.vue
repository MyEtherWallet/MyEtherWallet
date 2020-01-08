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
              <div class="card-image flex-col-1-1-vertical-center">
                <img alt src="~@/assets/images/home/create-wallet.png" />
              </div>
              <div class="flex--column--space-between">
                <div>
                  <div class="title">
                    <h3>{{ $t('common.wallet.create-new') }}</h3>
                  </div>
                  <div class="card-content">
                    <p class="color-white content-text">
                      {{ $t('home.create-new-wallet.text') }}
                    </p>
                  </div>
                </div>
                <div class="card-content">
                  <p class="get-started button">
                    {{ $t('common.get-started') }}
                    <img alt src="~@/assets/images/icons/right-arrow.png" />
                  </p>
                </div>
              </div>
            </div>
          </router-link>
          <router-link to="/access-my-wallet" class="nounderline">
            <div class="card-block unlock-wallet">
              <div class="card-image flex-col-1-1-vertical-center">
                <img alt src="~@/assets/images/home/unlock-wallet.png" />
              </div>
              <div class="flex--column--space-between">
                <div>
                  <div class="title">
                    <h3>{{ $t('common.wallet.access-my') }}</h3>
                  </div>
                  <div class="card-content">
                    <p class="color-white content-text">
                      {{ $t('home.access-my-wallet.text') }}
                    </p>

                    <ul>
                      <li>{{ $t('home.access-my-wallet.opt-1') }}</li>
                      <li>{{ $t('home.access-my-wallet.opt-2') }}</li>
                      <li>{{ $t('home.access-my-wallet.opt-3') }}</li>
                    </ul>
                  </div>
                </div>
                <div class="card-content">
                  <p class="get-started button">
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
export default {
  data() {
    return {};
  }
};
</script>

<style lang="scss" scoped>
@import 'TopBanner-desktop.scss';
@import 'TopBanner-tablet.scss';
@import 'TopBanner-mobile.scss';
</style>
