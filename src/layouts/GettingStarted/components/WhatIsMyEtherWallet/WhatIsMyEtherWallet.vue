<template>
  <div class="what-is-mew">

    <div class="block-progressbar">
      <dir class="block-progressbar__container">
        <div class="block-progressbar__title">
          About MyEtherWallet
        </div>
        <div class="block-progressbar__progressbar">
          <div :class="progressBarValue"/>
        </div>
        <div class="block-progressbar__content">
          <h4>What is MyEtherWallet?</h4>
          <p>
            MyEtherWallet(MEW) is a free, open-source, client-side interface.
            MEW allows you to interact directly with the blockchain, while
            remaining in full control of your keys and funds.
          </p>
          <p>
            Did you read that? YOU are the one who is in control. MEW is not
            a bank or exchange, we are an interface. This means we don't hold
            your keys or information, but it also means we can't access accounts,
            recover keys, reset passwords, or reverse transactions.
          </p>
          <div class="block-progressbar__warning">
            WARNING: You And Only You Are Responsible For Your Security.
          </div>
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
