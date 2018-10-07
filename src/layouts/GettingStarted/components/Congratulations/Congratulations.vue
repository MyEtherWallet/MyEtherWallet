<template>
  <div class="what-is-mew">

    <div class="block-progressbar">
      <dir class="block-progressbar__container">
        <div class="block-progressbar__title">
          Congratulations!
        </div>
        <div class="block-progressbar__progressbar">
          <div :class="progressBarValue"/>
        </div>
        <div class="block-progressbar__content text-cented">

          <img src="~@/assets/images/icons/drink.svg">

          <p>
            You have read through our warning slides, and you're ready to
            dive in. If you want to know more, please head to our
            <a href="">Help Center</a>. We have many articles to assist you!
          </p>

          <router-link to="/create-wallet">
            <div class="mid-round-button-green-filled-green-border">Get Started</div>
          </router-link>

        </div>
      </dir>
    </div>

  </div>
</template>

<script>
export default {
  props: {
    progressBarValue: {
      type: String,
      default: ''
    }
  },
  data() {
    return {};
  }
};
</script>

<style lang="scss" scoped>
@import '../BlockWithProgressBar-desktop.scss';
@import '../BlockWithProgressBar-tablet.scss';
@import '../BlockWithProgressBar-mobile.scss';
</style>
