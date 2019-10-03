<template>
  <div class="about-mew">
    <div class="wrap">
      <div class="top-section">
        <div class="circle">
          <img src="~@/assets/images/home/circle.png" alt />
        </div>
        <div id="about-mew" class="star-background">
          <div class="page-container">
            <div class="flex-col-1-1-vertical-center content">
              <div class="text-content">
                <h2>{{ $t('home.about-mew.title') }}</h2>
                <p class="color-white">{{ $t('home.about-mew.text') }}</p>
              </div>
              <div class="image-content">
                <img
                  alt="mew-icon"
                  class="mew-icon"
                  src="~@/assets/images/home/mew-icon.png"
                />
              </div>
              <div class="animation-content">
                <img
                  class="spaceman"
                  src="~@/assets/images/home/spaceman.png"
                  alt="Spaceman"
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
                <img src="~@/assets/images/home/icon-wallet.svg" alt />
              </div>
              <div class="text">
                <h3>{{ $t('home.join-mew.title') }}</h3>
                <p>{{ $t('home.join-mew.text') }}</p>
              </div>
            </dir>
            <dir class="content">
              <div class="image">
                <img src="~@/assets/images/home/icon-hardware.svg" alt />
              </div>
              <div class="text">
                <h3>{{ $t('home.hardware-support.title') }}</h3>
                <p>{{ $t('home.hardware-support.text') }}</p>
              </div>
            </dir>
            <dir class="content">
              <div class="image">
                <img src="~@/assets/images/home/icon-swap.svg" alt />
              </div>
              <div class="text">
                <h3>{{ $t('common.swap') }}</h3>
                <p>{{ $t('home.swap.text') }}</p>
              </div>
            </dir>
            <dir class="content">
              <div class="image">
                <img src="~@/assets/images/home/icon-mew-connect.svg" alt />
              </div>
              <div class="text">
                <h3>{{ $t('common.mewconnect.string') }}</h3>
                <p>{{ $t('common.mewconnect.desc') }}</p>
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
