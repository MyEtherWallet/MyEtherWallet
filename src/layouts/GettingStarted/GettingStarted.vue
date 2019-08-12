<template>
  <div class="create-wallet-warnings">
    <div v-if="cwwCurrent != '0'" class="back-button" @click="mouseScrollUp">
      &lt; {{ $t('common.back') }}
    </div>

    <div class="wrap">
      <div class="nav-dots">
        <p>
          <i class="fa fa-angle-up" aria-hidden="true" />
        </p>
        <ul>
          <li :class="cwwCurrent === 0 ? 'active' : ''" />
          <li :class="cwwCurrent === 1 ? 'active' : ''" />
          <li :class="cwwCurrent === 2 ? 'active' : ''" />
          <li :class="cwwCurrent === 3 ? 'active' : ''" />
          <li :class="cwwCurrent === 4 ? 'active' : ''" />
          <li :class="cwwCurrent === 5 ? 'active' : ''" />
        </ul>
        <p>
          <i class="fa fa-angle-down" aria-hidden="true" />
        </p>
      </div>

      <what-is-mew
        ref="cww1"
        :progress-bar-value="'__20percent'"
        class="cww cww1"
      />
      <where-my-funds-stored
        ref="cww2"
        :progress-bar-value="'__40percent'"
        class="cww cww2 positionBottom"
      />
      <what-if-i-lose-key
        ref="cww3"
        :progress-bar-value="'__60percent'"
        class="cww cww3 positionBottom"
      />
      <some-helpful-tips
        ref="cww4"
        :progress-bar-value="'__80percent'"
        class="cww cww4 positionBottom"
      />
      <what-is-upside
        ref="cww5"
        :progress-bar-value="'__90percent'"
        class="cww cww5 positionBottom"
      />
      <congratulations
        ref="cww6"
        :progress-bar-value="'__100percent'"
        class="cww cww6 positionBottom"
      />

      <div class="create-wallet-warnings__footer-container">
        <div class="create-wallet-warnings__continue-button">
          <standard-button
            v-if="cwwCurrent != '0'"
            :options="backButton"
            @click.native="mouseScrollUp"
          />
          <standard-button
            v-if="cwwCurrent !== 5"
            :options="nextButton"
            @click.native="mouseScrollDown"
          />
          <standard-button
            v-if="cwwCurrent == 5"
            :options="getStartedButton"
            @click.native="done"
          />
        </div>
        <div class="create-wallet-warnings__footer">
          <div class="create-wallet-warnings__links">
            <router-link class="footer-color" to="/">
              {{ $t('header.home') }}
            </router-link>
            <router-link class="footer-color" to="/privacy-policy">
              {{ $t('footer.privacy') }}
            </router-link>
            <router-link class="footer-color" to="/terms-and-conditions">
              {{ $t('common.terms') }}
            </router-link>
          </div>
          <div class="create-wallet-warnings__copyright">
            <p class="footer-color">{{ $t('footer.copyright') }}</p>
          </div>
        </div>
      </div>
    </div>

    <div v-if="cwwCurrent !== 5" class="next-button" @click="mouseScrollDown">
      {{ $t('common.next') }}
    </div>
  </div>
</template>

<script>
import WhatIsMyEtherWallet from './components/WhatIsMyEtherWallet';
import WhereAreMyFundsStored from './components/WhereAreMyFundsStored';
import WhatIfILoseMyKeysOrPassword from './components/WhatIfILoseMyKeysOrPassword';
import SomeHelpfulTips from './components/SomeHelpfulTips';
import WhatIsUpside from './components/WhatIsUpside';
import Congratulations from './components/Congratulations';
import StandardButton from '@/components/Buttons/StandardButton';
import store from 'store';

export default {
  components: {
    'what-is-mew': WhatIsMyEtherWallet,
    'where-my-funds-stored': WhereAreMyFundsStored,
    'what-if-i-lose-key': WhatIfILoseMyKeysOrPassword,
    'some-helpful-tips': SomeHelpfulTips,
    'what-is-upside': WhatIsUpside,
    congratulations: Congratulations,
    'standard-button': StandardButton
  },
  data() {
    return {
      cwwCurrent: 0,
      cwwRefs: ['cww1', 'cww2', 'cww3', 'cww4', 'cww5', 'cww6'],
      nextButton: {
        title: this.$t('common.next'),
        buttonStyle: 'green',
        rightArrow: true,
        noMinWidth: false
      },
      backButton: {
        title: this.$t('common.back'),
        buttonStyle: 'green-transparent',
        rightArrow: false,
        noMinWidth: true,
        buttonDisabled: false
      },
      getStartedButton: {
        title: 'Get Started',
        buttonStyle: 'green',
        rightArrow: false,
        noMinWidth: true,
        buttonDisabled: false
      }
    };
  },
  methods: {
    done() {
      store.set('skipTutorial', 'done');
      this.$router.push({ path: 'create-wallet' }, () => {}, () => {});
      this.$store.dispatch('gettingStartedDone');
    },
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
