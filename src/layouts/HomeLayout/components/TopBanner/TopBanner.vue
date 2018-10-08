<template>
  <div class="top-banner">
    <div class="wrap">
      <div class="page-container">
        <div class="flex-col-vertical-center banner">
          <div class="banner-text">
            <h1>{{ $t("home.title1") }}</h1>
            <h1>{{ $t("home.title2") }}</h1>
            <p>
              {{ $t("home.subheading") }}
            </p>
          </div>
          <div class="banner-image">
            <img src="~@/assets/images/home/top-banner.jpg">
          </div>
        </div>
        <div class="grid-col-2 promo-cards">
          <router-link 
            to="/create-wallet" 
            class="nounderline">
            <div class="card-block create-wallet">
              <div class="flex-col-vertical-center">
                <div class="card-image">
                  <img src="~@/assets/images/home/create-wallet.png">
                </div>
                <div class="card-content">
                  <h2 class="color-white">{{ $t("common.getAFreeWallet") }}</h2>
                  <p class="color-white">
                    {{ $t("home.obtainAddress") }}
                  </p>
                  <p class="button">
                    {{ $t("home.getStarted") }}
                    <img src="~@/assets/images/icons/right-arrow.png">
                  </p>
                </div>
              </div>
            </div>
          </router-link>
          <router-link 
            :to="$store.state.wallet === null || $store.state.wallet === undefined ? '/access-my-wallet' : '/interface'" 
            class="nounderline">
            <div class="card-block unlock-wallet">
              <div class="flex-col-vertical-center">
                <div class="card-image">
                  <img src="~@/assets/images/home/unlock-wallet.png">
                </div>
                <div class="card-content">
                  <h2 class="color-white">{{ $t("common.accessMyWallet") }}</h2>
                  <p class="color-white">
                    {{ $t("home.accessMyWalletDesc") }}
                  </p>
                  <p class="button">
                    {{ $t("home.accessNow") }}
                    <img src="~@/assets/images/icons/right-arrow.png">
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
