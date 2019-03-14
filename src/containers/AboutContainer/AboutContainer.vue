<template>
  <div class="about-mew">
    <div class="wrap">
      <div class="top-section">
        <div class="circle"><img src="~@/assets/images/home/circle.png" /></div>
        <div id="about-mew" class="star-background">
          <div class="page-container">
            <div class="flex-col-1-1-vertical-center content">
              <div class="text-content">
                <h2>{{ $t('home.aboutTitle') }}</h2>
                <p class="color-white">{{ $t('home.aboutSubheading') }}</p>
              </div>
              <div class="image-content">
                <img
                  class="spaceman"
                  src="~@/assets/images/home/spaceman.png"
                />
                <img
                  class="mew-icon"
                  src="~@/assets/images/home/mew-icon.png"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="bottom-section">
        <div class="page-container">
          <div class="grid-col-2 mew-features">
            <dir class="content">
              <div class="image">
                <img src="~@/assets/images/home/icon-wallet.svg" />
              </div>
              <div class="text">
                <h3>{{ $t('home.aboutMewWallet') }}</h3>
                <p>{{ $t('home.aboutMewWalletDesc') }}</p>
              </div>
            </dir>
            <dir class="content">
              <div class="image">
                <img src="~@/assets/images/home/icon-hardware.svg" />
              </div>
              <div class="text">
                <h3>{{ $t('home.aboutHardwareWallet') }}</h3>
                <p>{{ $t('home.aboutHardwareWalletDesc') }}</p>
              </div>
            </dir>
            <dir class="content">
              <div class="image">
                <img src="~@/assets/images/home/icon-swap.svg" />
              </div>
              <div class="text">
                <h3>{{ $t('common.swap') }}</h3>
                <p>{{ $t('home.aboutSwapDesc') }}</p>
              </div>
            </dir>
            <dir class="content">
              <div class="image">
                <img src="~@/assets/images/home/icon-mew-connect.svg" />
              </div>
              <div class="text">
                <h3>{{ $t('common.mewConnect') }}</h3>
                <p>{{ $t('home.aboutMewConnectDesc') }}</p>
              </div>
            </dir>
          </div>
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
@import 'AboutContainer-desktop.scss';
@import 'AboutContainer-tablet.scss';
@import 'AboutContainer-mobile.scss';
</style>
