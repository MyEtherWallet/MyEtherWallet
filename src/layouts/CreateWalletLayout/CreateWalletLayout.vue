<template>
  <div class="your-password">
    <tutorial-modal :skip="skip"></tutorial-modal>
    <by-json-page-title></by-json-page-title>
    <div class="wrap">
      <div class="page-container">
        <div class="nav-tab-user-input-box" v-show="!byJson && !byMnemonic">
          <b-tabs class="x100">
            <div class="progress-bar"></div>
            <b-tab title="By JSON File" active>
              <h3>{{ $t("createWallet.yourPw") }}</h3>
              <create-wallet-input v-model='password' :switcher="switcher" :param="'Json'"></create-wallet-input>
              <create-wallet-input-footer></create-wallet-input-footer>
            </b-tab>
            <b-tab title="By Mnemonic Phrase" >
              <h3>{{ $t("createWallet.yourPw") }}</h3>
              <create-wallet-input v-model='password' :switcher="switcher" :param="'Mnemonic'"></create-wallet-input>
              <create-wallet-input-footer></create-wallet-input-footer>
            </b-tab>
          </b-tabs>
        </div>
        <by-json-file-container v-if="byJson && !byMnemonic" :password="password"></by-json-file-container>
        <by-mnemonic-container v-if="!byJson && byMnemonic"></by-mnemonic-container>
      </div>
    </div>

    <by-json-page-footer></by-json-page-footer>

  </div>
</template>

<script>
export default {
  data () {
    return {
      byJson: false,
      byMnemonic: false,
      password: ''
    }
  },
  methods: {
    switcher: function (by) {
      const self = this
      if (by === 'Json') {
        self.byJson = true
        self.byMnemonic = false
      } else if (by === 'Mnemonic') {
        self.byJson = false
        self.byMnemonic = true
      } else {
        self.byJson = false
        self.byMnemonic = false
      }
    },
    skip: function () {
      localStorage.setItem('skipTutorial', true)
      this.$children[0].$refs.tutorial.hide()
    }
  },
  mounted: function () {
    let skipTutorial = localStorage.getItem('skipTutorial')
    if (skipTutorial === undefined || skipTutorial === null || skipTutorial === false) {
      this.$children[0].$refs.tutorial.show()
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "CreateWalletLayout.scss";
</style>
