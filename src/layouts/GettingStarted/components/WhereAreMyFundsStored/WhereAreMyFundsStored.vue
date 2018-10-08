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
          <div class="block-progressbar__sliding-switch-expender">
            <div class="title">
              <h4>What is Blockchain?</h4>
              <div class="sliding-switch sliding-switch-white">
                <label class="switch">
                  <input
                    type="checkbox"
                    @click="expenderContentShow = !expenderContentShow">
                  <span class="slider round"/>
                </label>
              </div>
            </div>
            <div
              v-if="expenderContentShow"
              class="content">
              <p>
                The term 'blockchain' refers to a public, decentalized spreadsheet, similar to a ledger.
                It's maintained by people all over the world, who remotely mine
                transaction to make them a park of the blockchain, permanently.
              </p>

              <p>
                When you use MEW, you are accessing the blockchain directly. We are not responsible
                for theft caused by user error. Please do your research, knowledge is power! Know
                more about Blockchain <a
                  href=""
                  target="_blank">here</a>.
              </p>
            </div>

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
    return {
      expenderContentShow: false
    };
  }
};
</script>

<style lang="scss" scoped>
@import '../BlockWithProgressBar-desktop.scss';
@import '../BlockWithProgressBar-tablet.scss';
@import '../BlockWithProgressBar-mobile.scss';
</style>
