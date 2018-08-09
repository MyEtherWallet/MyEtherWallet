<template>
  <div class="create-wallet-warnings">

    <div class="wrap">
      <what-is-mew            :progressBarValue="'__20percent'"   class="cww cww1"                        ref="cww1" />
      <where-my-funds-stored  :progressBarValue="'__40percent'"   class="cww cww2 positionBottom"         ref="cww2" />
      <what-if-i-lose-key     :progressBarValue="'__60percent'"   class="cww cww3 positionBottom"         ref="cww3" />
      <some-helpful-tips      :progressBarValue="'__80percent'"   class="cww cww4 positionBottom"         ref="cww4" />
      <congratulations        :progressBarValue="'__100percent'"  class="cww cww5 positionBottom"         ref="cww5" />

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
      cwwCurrent: 0,
      cwwRefs: [
        'cww1',
        'cww2',
        'cww3',
        'cww4',
        'cww5'
      ]
    }
  },
  methods: {
    mouseScrollDown: function () {
      if (this.cwwCurrent < this.cwwRefs.length - 1) {
        this.cwwCurrent++
        this.$refs[this.cwwRefs[this.cwwCurrent - 1]].$el.classList.add('positionTop')
        this.$refs[this.cwwRefs[this.cwwCurrent]].$el.classList.remove('positionBottom')
      }
    },
    mouseScrollUp: function () {
      if (this.cwwCurrent > 0) {
        this.cwwCurrent--
        this.$refs[this.cwwRefs[this.cwwCurrent + 1]].$el.classList.add('positionBottom')
        this.$refs[this.cwwRefs[this.cwwCurrent]].$el.classList.remove('positionTop')
      }
    }
  },
  mounted: function () {
    var _this = this

    window.addEventListener('wheel', function (e) {
      if (e.deltaY < 0) {
        _this.mouseScrollUp()
      }
      if (e.deltaY > 0) {
        _this.mouseScrollDown()
      }
    })
  }
}
</script>

<style lang="scss" scoped>
  @import "CreateWalletWarningLayout.scss";
</style>
