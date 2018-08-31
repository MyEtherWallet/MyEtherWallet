<template>
  <div class="faqs">
    <div class="wrap">

      <div class="qa-cards">
        <ul class="qa__contents">
          <li>
            <div
              class="qa__contents--title"
              @click="openFAQ('faq1')">
              <h3>Balances not loading or showing on MyEtherWallet</h3>
              <div class="show-more-buttons">
                <span
                  v-if="openedFAQ('faq1')"
                  class="show-more">+</span>
                <span
                  v-if="!openedFAQ('faq1')"
                  class="show-less">-</span>
              </div>
            </div>
            <div
              v-if="openedFAQ('faq1')"
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
                  v-if="openedFAQ('faq2')"
                  class="show-more">+</span>
                <span
                  v-if="!openedFAQ('faq2')"
                  class="show-less">-</span>
              </div>
            </div>
            <div
              v-if="openedFAQ('faq2')"
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
                  v-if="openedFAQ('faq3')"
                  class="show-more">+</span>
                <span
                  v-if="!openedFAQ('faq3')"
                  class="show-less">-</span>
              </div>
            </div>
            <div
              v-if="openedFAQ('faq3')"
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
                  v-if="openedFAQ('faq4')"
                  class="show-more">+</span>
                <span
                  v-if="!openedFAQ('faq4')"
                  class="show-less">-</span>
              </div>
            </div>
            <div
              v-if="openedFAQ('faq4')"
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
                  v-if="openedFAQ('faq5')"
                  class="show-more">+</span>
                <span
                  v-if="!openedFAQ('faq5')"
                  class="show-less">-</span>
              </div>
            </div>
            <div
              v-if="openedFAQ('faq5')"
              class="qa__contents--content">
              <faq-what-is-an-ico/>
            </div>
          </li>

          <li>
            <div
              class="qa__contents--title"
              @click="openFAQ('faq6')">
              <h3>How to buy Ethereum(ETH) with USD?</h3>
              <div class="show-more-buttons">
                <span
                  v-if="openedFAQ('faq6')"
                  class="show-more">+</span>
                <span
                  v-if="!openedFAQ('faq6')"
                  class="show-less">-</span>
              </div>
            </div>
            <div
              v-if="openedFAQ('faq6')"
              class="qa__contents--content">
              <faq-how-to-buy-ethereum-with-usd/>
            </div>
          </li>
          <li>
            <div
              class="qa__contents--title"
              @click="openFAQ('faq7')">
              <h3>Couldn't everybody put in random private keys, look for a balance, and send to
              their own address?</h3>
              <div class="show-more-buttons">
                <span
                  v-if="openedFAQ('faq7')"
                  class="show-more">+</span>
                <span
                  v-if="!openedFAQ('faq7')"
                  class="show-less">-</span>
              </div>
            </div>
            <div
              v-if="openedFAQ('faq7')"
              class="qa__contents--content">
              <faq-couldnt-everybody-put-in-random-private-keys/>
            </div>
          </li>
          <li>
            <div
              class="qa__contents--title"
              @click="openFAQ('faq8')">
              <h3>What happens if MyEtherWallet goes down?</h3>
              <div class="show-more-buttons">
                <span
                  v-if="openedFAQ('faq8')"
                  class="show-more">+</span>
                <span
                  v-if="!openedFAQ('faq8')"
                  class="show-less">-</span>
              </div>
            </div>
            <div
              v-if="openedFAQ('faq8')"
              class="qa__contents--content">
              <faq-what-happens-if-my-ether-wallet-goes-down/>
            </div>
          </li>
          <li>
            <div
              class="qa__contents--title"
              @click="openFAQ('faq9')">
              <h3>How do I interact with a Multisig Contract?</h3>
              <div class="show-more-buttons">
                <span
                  v-if="openedFAQ('faq9')"
                  class="show-more">+</span>
                <span
                  v-if="!openedFAQ('faq9')"
                  class="show-less">-</span>
              </div>
            </div>
            <div
              v-if="openedFAQ('faq9')"
              class="qa__contents--content">
              <faq-how-do-i-interact-with-a-multisig-contract/>
            </div>
          </li>
          <li>
            <div
              class="qa__contents--title"
              @click="openFAQ('faq10')">
              <h3>Check the current block number on MyEtherWallet</h3>
              <div class="show-more-buttons">
                <span
                  v-if="openedFAQ('faq10')"
                  class="show-more">+</span>
                <span
                  v-if="!openedFAQ('faq10')"
                  class="show-less">-</span>
              </div>
            </div>
            <div
              v-if="openedFAQ('faq10')"
              class="qa__contents--content">
              <faq-check-the-current-block-number-on-my-ether-wallet/>
            </div>
          </li>
          <li>
            <div
              class="qa__contents--title"
              @click="openFAQ('faq11')">
              <h3>When I unlock via keystore file, it freezes my browser</h3>
              <div class="show-more-buttons">
                <span
                  v-if="openedFAQ('faq11')"
                  class="show-more">+</span>
                <span
                  v-if="!openedFAQ('faq11')"
                  class="show-less">-</span>
              </div>
            </div>
            <div
              v-if="openedFAQ('faq11')"
              class="qa__contents--content">
              <faq-when-i-unlock-via-keystore-file-it-freezes-my-browser/>
            </div>
          </li>
          <li>
            <div
              class="qa__contents--title"
              @click="openFAQ('faq12')">
              <h3>Withdrawing DAO tokens</h3>
              <div class="show-more-buttons">
                <span
                  v-if="openedFAQ('faq12')"
                  class="show-more">+</span>
                <span
                  v-if="!openedFAQ('faq12')"
                  class="show-less">-</span>
              </div>
            </div>
            <div
              v-if="openedFAQ('faq12')"
              class="qa__contents--content">
              <faq-withdrawing-dao-tokens/>
            </div>
          </li>
          <li>
            <div
              class="qa__contents--title"
              @click="openFAQ('faq13')">
              <h3>Why don't you make me move my mouse to generate a seed?</h3>
              <div class="show-more-buttons">
                <span
                  v-if="openedFAQ('faq13')"
                  class="show-more">+</span>
                <span
                  v-if="!openedFAQ('faq13')"
                  class="show-less">-</span>
              </div>
            </div>
            <div
              v-if="openedFAQ('faq13')"
              class="qa__contents--content">
              <faq-why-dont-you-make-me-move-my-mouse-to-generate-a-seed/>
            </div>
          </li>

        </ul>
      </div>

    </div>
  </div>
</template>

<script>
import {
  BalancesNotLoadingOrShowingOnMyEtherWallet,
  EthOrTokensSentToOrFromExchangeHaventShownUp,
  DoesMyEtherWalletSupportBitcoinOrOtherCoins,
  WhereCanIBuySellTradeExchangeMyEthOrTokens,
  WhatIsAnIco,
  HowToBuyEthereumWithUSD,
  CouldntEverybodyPutInRandomPrivateKeys,
  WhatHappensIfMyEtherWalletGoesDown,
  HowDoIInteractWithAMultisigContract,
  CheckTheCurrentBlockNumberOnMyEtherWallet,
  WhenIUnlockViaKeystoreFileItFreezesMyBrowser,
  WithdrawingDAOTokens,
  WhyDontYouMakeMeMoveMyMouseToGenerateASeed
} from '@/components/FaqContents';

export default {
  components: {
    'faq-balances-not-loading': BalancesNotLoadingOrShowingOnMyEtherWallet,
    'faq-eth-or-tokens-sent-to': EthOrTokensSentToOrFromExchangeHaventShownUp,
    'faq-does-myetherwallet-support-bitcoin': DoesMyEtherWalletSupportBitcoinOrOtherCoins,
    'faq-where-can-i-buy-sell': WhereCanIBuySellTradeExchangeMyEthOrTokens,
    'faq-what-is-an-ico': WhatIsAnIco,
    'faq-how-to-buy-ethereum-with-usd': HowToBuyEthereumWithUSD,
    'faq-couldnt-everybody-put-in-random-private-keys': CouldntEverybodyPutInRandomPrivateKeys,
    'faq-what-happens-if-my-ether-wallet-goes-down': WhatHappensIfMyEtherWalletGoesDown,
    'faq-how-do-i-interact-with-a-multisig-contract': HowDoIInteractWithAMultisigContract,
    'faq-check-the-current-block-number-on-my-ether-wallet': CheckTheCurrentBlockNumberOnMyEtherWallet,
    'faq-when-i-unlock-via-keystore-file-it-freezes-my-browser': WhenIUnlockViaKeystoreFileItFreezesMyBrowser,
    'faq-withdrawing-dao-tokens': WithdrawingDAOTokens,
    'faq-why-dont-you-make-me-move-my-mouse-to-generate-a-seed': WhyDontYouMakeMeMoveMyMouseToGenerateASeed
  },
  data() {
    return {
      expanded: []
    };
  },
  computed: {
    openedFAQ(faqToOpen) {
      console.log('openedFAQ', faqToOpen); // todo remove dev item
      return this.expanded.indexOf(faqToOpen) > -1;
    }
  },
  methods: {
    openFAQ: function(faqToOpen) {
      console.log('openedFAQ', faqToOpen); // todo remove dev item
      if (this.expanded.indexOf(faqToOpen) > -1) {
        const idx = this.expanded.indexOf(faqToOpen);
        this.expanded.splice(idx, 1);
      } else {
        this.expanded.push(faqToOpen);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'FAQs.scss';
</style>
