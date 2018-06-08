<template>
  <div class="your-password">
    <!-- <create-wallet-modal></cr  eate-wallet-modal> -->
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
        <by-json-file-container v-show="byJson && !byMnemonic"></by-json-file-container>
        <by-mnemonic-container v-show="!byJson && byMnemonic"></by-mnemonic-container>
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
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "CreateWalletLayout.scss";
</style>
