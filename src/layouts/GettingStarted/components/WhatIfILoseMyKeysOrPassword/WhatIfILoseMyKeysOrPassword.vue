<template>
  <div class="what-is-mew">

    <div class="block-progressbar">
      <dir class="block-progressbar__container">
        <div class="block-progressbar__title">
          About Security
        </div>
        <div class="block-progressbar__progressbar">
          <div :class="progressBarValue"/>
        </div>
        <div class="block-progressbar__content">
          <h4>What if I lose my keys or password?</h4>
          <p>
            We can not recover your information for you. If you lose your information,
            it's <span>GONE FOREVER</span>. MEW doesn't store any data. After you've
            received your keys and set up a password, we strongly suggest you:
          </p>

          <ul>
            <li>Write Your Keys And Password Down. Keep Them Safe.</li>
            <li>Don't Store Your Keys And Password on Your Computer or Phone.</li>
          </ul>

          <div class="block-progressbar__warning hidden"/>
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
