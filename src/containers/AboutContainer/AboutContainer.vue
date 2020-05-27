<template>
  <div class="about-mew">
    <div class="wrap">
      <div class="top-section">
        <div class="circle"><img src="~@/assets/images/home/circle.png" /></div>
        <div id="about-mew" class="star-background">
          <div class="page-container">
            <div class="flex-col-1-1-vertical-center content">
              <!-- <div class="text-content">
                <h2>{{ $t('home.aboutTitle') }}</h2>
                <p class="color-white">{{ $t('home.aboutSubheading') }}</p>
              </div> -->
              <!-- <div class="image-content">
                <img
                  class="spaceman"
                  src="~@/assets/images/home/spaceman.png"
                />
                <img
                  class="mew-icon"
                  src="~@/assets/images/home/mew-icon.png"
                />
              </div> -->
            </div>
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
