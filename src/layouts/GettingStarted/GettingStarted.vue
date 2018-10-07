<template>
  <div class="create-wallet-warnings">

    <div
      v-if="cwwCurrent != '0'" 
      class="back-button" 
      @click="mouseScrollUp">
      &lt; Back
    </div>

    <div class="wrap">

      <div class="nav-dots">
        <p><i
          class="fa fa-angle-up"
          aria-hidden="true"/></p>
        <ul>
          <li :class="cwwCurrent == 0 ? 'active' : ''"/>
          <li :class="cwwCurrent == 1 ? 'active' : ''"/>
          <li :class="cwwCurrent == 2 ? 'active' : ''"/>
          <li :class="cwwCurrent == 3 ? 'active' : ''"/>
          <li :class="cwwCurrent == 4 ? 'active' : ''"/>
        </ul>
        <p><i
          class="fa fa-angle-down"
          aria-hidden="true"/></p>
      </div>

      <what-is-mew
        ref="cww1"
        :progress-bar-value="'__20percent'"
        class="cww cww1"/>
      <where-my-funds-stored
        ref="cww2"
        :progress-bar-value="'__40percent'"
        class="cww cww2 positionBottom"/>
      <what-if-i-lose-key
        ref="cww3"
        :progress-bar-value="'__60percent'"
        class="cww cww3 positionBottom"/>
      <some-helpful-tips
        ref="cww4"
        :progress-bar-value="'__80percent'"
        class="cww cww4 positionBottom"/>
      <congratulations
        ref="cww5"
        :progress-bar-value="'__100percent'"
        class="cww cww5 positionBottom"/>

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

    <div 
      v-if="cwwCurrent != '4'"
      class="next-button" 
      @click="mouseScrollDown">
      Next
    </div>

  </div>
</template>

<script>
import WhatIsMyEtherWallet from './components/WhatIsMyEtherWallet';
import WhereAreMyFundsStored from './components/WhereAreMyFundsStored';
import WhatIfILoseMyKeysOrPassword from './components/WhatIfILoseMyKeysOrPassword';
import SomeHelpfulTips from './components/SomeHelpfulTips';
import Congratulations from './components/Congratulations';

export default {
  components: {
    'what-is-mew': WhatIsMyEtherWallet,
    'where-my-funds-stored': WhereAreMyFundsStored,
    'what-if-i-lose-key': WhatIfILoseMyKeysOrPassword,
    'some-helpful-tips': SomeHelpfulTips,
    congratulations: Congratulations
  },
  data() {
    return {
      cwwCurrent: 0,
      cwwRefs: ['cww1', 'cww2', 'cww3', 'cww4', 'cww5'],
      scrollListener: function() {}
    };
  },
  mounted: function() {
    this.scrollListener = e => {
      if (e.deltaY < 0) {
        this.mouseScrollUp();
      }
      if (e.deltaY > 0) {
        this.mouseScrollDown();
      }
    };

    window.addEventListener('wheel', this.scrollListener);
  },
  beforeDestroy() {
    window.removeEventListener('wheel', this.scrollListener);
  },
  methods: {
    mouseScrollDown: function() {
      if (this.cwwCurrent < this.cwwRefs.length - 1) {
        this.cwwCurrent++;
        this.$refs[this.cwwRefs[this.cwwCurrent - 1]].$el.classList.add(
          'positionTop'
        );
        this.$refs[this.cwwRefs[this.cwwCurrent]].$el.classList.remove(
          'positionBottom'
        );
      }
    },
    mouseScrollUp: function() {
      if (this.cwwCurrent > 0) {
        this.cwwCurrent--;
        this.$refs[this.cwwRefs[this.cwwCurrent + 1]].$el.classList.add(
          'positionBottom'
        );
        this.$refs[this.cwwRefs[this.cwwCurrent]].$el.classList.remove(
          'positionTop'
        );
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'GettingStarted-desktop.scss';
@import 'GettingStarted-tablet.scss';
@import 'GettingStarted-mobile.scss';
</style>
