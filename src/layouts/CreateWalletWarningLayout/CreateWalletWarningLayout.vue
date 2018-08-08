<template>
  <div class="create-wallet-warnings">
    <div class="wrap">
      <what-is-mew :progressBarValue="'__20percent'"></what-is-mew>
    </div>

    <div class="create-wallet-warnings__footer-container">
      <div class="create-wallet-warnings__mouse-scroll">
        <img src="~@/assets/images/icons/mouse.svg">
        <p>Scroll</p>
      </div>
      <div class="create-wallet-warnings__footer">
        <div class="create-wallet-warnings__links">
          <router-link to="/">Home</router-link>
          <router-link to="/">Privacy</router-link>
          <router-link to="/">Terms</router-link>
        </div>
        <div class="create-wallet-warnings__copyright">
          <p>© 2018 MyEtherWallet. All rights reserved.</p>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import WhatIsMyEtherWallet from './components/WhatIsMyEtherWallet'

export default {
  components: {
    'what-is-mew': WhatIsMyEtherWallet
  },
  data () {
    return {

    }
  }
}
</script>

<style lang="scss" scoped>
  @import "CreateWalletWarningLayout.scss";
</style>
