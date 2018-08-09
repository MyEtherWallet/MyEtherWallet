<template>
  <div class="create-wallet-warnings">

    <div class="wrap">
      <what-is-mew :progressBarValue="'__20percent'"            class="cww cww-1 active" ref="cww-1" />
      <where-my-funds-stored :progressBarValue="'__40percent'"  class="cww cww-2" ref="cww-2" />
      <what-if-i-lose-key :progressBarValue="'__60percent'"     class="cww cww-3" ref="cww-3" />
      <some-helpful-tips :progressBarValue="'__80percent'"      class="cww cww-4" ref="cww-4" />
      <congratulations :progressBarValue="'__100percent'"       class="cww cww-5" ref="cww-5" />

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
            <a href="" v-on:click.prevent="mouseScrollDown">AAA</a>
          </div>
          <div class="create-wallet-warnings__copyright">
            <p>© 2018 MyEtherWallet. All rights reserved.</p>
          </div>
        </div>
      </div>

    </div>

  </div>
</template>

<script>
import WhatIsMyEtherWallet from './components/WhatIsMyEtherWallet'
import WhereAreMyFundsStored from './components/WhereAreMyFundsStored'
import WhatIfILoseMyKeysOrPassword from './components/WhatIfILoseMyKeysOrPassword'
import SomeHelpfulTips from './components/SomeHelpfulTips'
import Congratulations from './components/Congratulations'

export default {
  components: {
    'what-is-mew': WhatIsMyEtherWallet,
    'where-my-funds-stored': WhereAreMyFundsStored,
    'what-if-i-lose-key': WhatIfILoseMyKeysOrPassword,
    'some-helpful-tips': SomeHelpfulTips,
    'congratulations': Congratulations

  },
  data () {
    return {
      cwwCount: this.$refs.length,
      cwwCurrent: 0
    }
  },
  methods: {
    mouseScrollDown: function () {
      console.log(this.$refs)
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "CreateWalletWarningLayout.scss";
</style>
