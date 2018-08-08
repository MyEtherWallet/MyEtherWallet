<template>
  <div class="what-is-mew">

    <div class="block-progressbar">
      <dir class="block-progressbar__container">
        <div class="block-progressbar__title">
          About MyEtherWallet
        </div>
        <div class="block-progressbar__progressbar">
          <div :class="progressBarValue"></div>
        </div>
        <div class="block-progressbar__content">
          <h4>Where are my funds stored?</h4>
          <p>
            Your tokens and coins are not on MyEtherWallet. Just like
            they aren't on your hardware wallet, on MetaMask, or on
            blockchain explorers. All funds on the blockchain itself.
            This means that we do not control them. We are only a doorway
            to interact with them.
          </p>
          <div class="block-progressbar__warning">
            WARNING: MyEtherWallet Does Not Control Your Funds. You Do!
          </div>
        </div>
      </dir>
    </div>

  </div>
</template>

<script>

export default {
  props: ['progressBarValue'],
  components: {
  },
  data () {
    return {

    }
  }
}
</script>

<style lang="scss" scoped>
  @import "../BlockWithProgressBar.scss";
</style>
