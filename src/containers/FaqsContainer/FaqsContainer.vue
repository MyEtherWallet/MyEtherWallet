<template>
  <div class="faqs">
    <div
      id="faqs"
      class="wrap">
      <div class="page-container">
        <div class="flex-col-vertical-bottom top-title">
          <div class="title">
            <h2>{{ $t("common.faqs") }}</h2>
            <h5>
              {{ $t("home.faqsSubheading") }}
              <a href="https://kb.myetherwallet.com/">{{ $t("home.faqsSeeMore") }}</a>
            </h5>
          </div>
          <customer-support/>
        </div>

        <div class="qa-cards">
          <ul class="qa__contents">
            <li>
              <div
                class="qa__contents--title"
                @click="openFAQ('faq1')">
                <h3>Balances not loading or showing on MyEtherWallet</h3>
                <div class="show-more-buttons">
                  <span
                    v-if="showFAQs.faq1 == false"
                    class="show-more">+</span>
                  <span
                    v-if="showFAQs.faq1 == true"
                    class="show-less">-</span>
                </div>
              </div>
              <div
                v-if="showFAQs.faq1"
                class="qa__contents--content">
                <faq-balances-not-loading/>
              </div>
            </li>
            <li>
              <div
                class="qa__contents--title"
                @click="openFAQ('faq2')">
                <h3>Does MyEtherWallet support Bitcoin or other coins (LTC STEEM ZEC)?</h3>
                <div class="show-more-buttons">
                  <span
                    v-if="showFAQs.faq2 == false"
                    class="show-more">+</span>
                  <span
                    v-if="showFAQs.faq2 == true"
                    class="show-less">-</span>
                </div>
              </div>
              <div
                v-if="showFAQs.faq2"
                class="qa__contents--content">
                <faq-does-myetherwallet-support-bitcoin/>
              </div>
            </li>
            <li>
              <div
                class="qa__contents--title"
                @click="openFAQ('faq3')">
                <h3>ETH or Tokens sent to or from exchange haven't shown up</h3>
                <div class="show-more-buttons">
                  <span
                    v-if="showFAQs.faq3 == false"
                    class="show-more">+</span>
                  <span
                    v-if="showFAQs.faq3 == true"
                    class="show-less">-</span>
                </div>
              </div>
              <div
                v-if="showFAQs.faq3"
                class="qa__contents--content">
                <faq-eth-or-tokens-sent-to/>
              </div>
            </li>
            <li>
              <div
                class="qa__contents--title"
                @click="openFAQ('faq4')">
                <h3>Where Can I Buy / Sell / Trade / Exchange my ETH or Tokens?</h3>
                <div class="show-more-buttons">
                  <span
                    v-if="showFAQs.faq4 == false"
                    class="show-more">+</span>
                  <span
                    v-if="showFAQs.faq4 == true"
                    class="show-less">-</span>
                </div>
              </div>
              <div
                v-if="showFAQs.faq4"
                class="qa__contents--content">
                <faq-where-can-i-buy-sell/>
              </div>
            </li>
            <li>
              <div
                class="qa__contents--title"
                @click="openFAQ('faq5')">
                <h3>What Is An ICO?</h3>
                <div class="show-more-buttons">
                  <span
                    v-if="showFAQs.faq5 == false"
                    class="show-more">+</span>
                  <span
                    v-if="showFAQs.faq5 == true"
                    class="show-less">-</span>
                </div>
              </div>
              <div
                v-if="showFAQs.faq5"
                class="qa__contents--content">
                <faq-what-is-an-ico/>
              </div>
            </li>
          </ul>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
import CustomerSupport from '@/components/CustomerSupport';
import {
  BalancesNotLoadingOrShowingOnMyEtherWallet,
  EthOrTokensSentToOrFromExchangeHaventShownUp,
  DoesMyEtherWalletSupportBitcoinOrOtherCoins,
  WhereCanIBuySellTradeExchangeMyEthOrTokens,
  WhatIsAnIco
} from '@/components/FaqContents';

export default {
  components: {
    'faq-balances-not-loading': BalancesNotLoadingOrShowingOnMyEtherWallet,
    'faq-eth-or-tokens-sent-to': EthOrTokensSentToOrFromExchangeHaventShownUp,
    'faq-does-myetherwallet-support-bitcoin': DoesMyEtherWalletSupportBitcoinOrOtherCoins,
    'faq-where-can-i-buy-sell': WhereCanIBuySellTradeExchangeMyEthOrTokens,
    'faq-what-is-an-ico': WhatIsAnIco,
    'customer-support': CustomerSupport
  },
  data() {
    return {
      showFAQs: {
        faq1: false,
        faq2: false,
        faq3: false,
        faq4: false,
        faq5: false
      }
    };
  },
  methods: {
    openFAQ: function(faqToOpen) {
      const currentState = this.showFAQs[faqToOpen];
      this.showFAQs[faqToOpen] = !currentState;
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'FaqsContainer-desktop.scss';
@import 'FaqsContainer-tablet.scss';
@import 'FaqsContainer-mobile.scss';
</style>
