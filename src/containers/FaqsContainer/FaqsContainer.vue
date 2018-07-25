<template>
  <div class="faqs">
    <div class="wrap" id="faqs">
      <div class="page-container">
        <div class="flex-col-vertical-bottom top-title">
          <div class="title">
            <h2>{{ $t("reused.faqs") }}</h2>
            <h5>
              {{ $t("faqs.subheading") }}
              <a href="https://kb.myetherwallet.com/">{{ $t("faqs.seeMore") }}</a>
            </h5>
          </div>
          <div class="support">
            <router-link to="/">
              <div><img src="~@/assets/images/icons/help-center.svg"></div>
              <div><h5>{{ $t("reused.customerSupport") }}</h5></div>
            </router-link>
          </div>
        </div>
        <div class="grid-col-2 qa-cards">
          <faq-block v-for="(block, index) in blocks" :title="block.title" :articles="block.articles" :key="block.title + index"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import FaqBlock from './components/FaqBlock'

export default {
  components: {
    'faq-block': FaqBlock
  },
  data () {
    return {
      blocks: [
        {
          title: this.$t('faqs.gettingStarted'),
          articles: [
            {to: 'https://kb.myetherwallet.com/getting-started/getting-started-new.html', title: 'Getting Started on MyEtherWallet.com'},
            {to: 'https://kb.myetherwallet.com/getting-started/creating-a-new-wallet-on-myetherwallet.html', title: 'How To Create a Wallet'},
            {to: 'https://kb.myetherwallet.com/getting-started/backing-up-your-new-wallet.html', title: 'How to Properly Save & Back Up Your wallet'},
            {to: 'https://kb.myetherwallet.com/getting-started/accessing-your-new-eth-wallet.html', title: 'How to Access Your Wallet'},
            {to: 'https://kb.myetherwallet.com/getting-started/protecting-yourself-and-your-funds.html', title: 'Protecting Yourself and Your Funds'},
            {to: 'https://kb.myetherwallet.com/getting-started/myetherwallet-help-and-quicktips.html', title: 'MyEtherWallet\'s QuickTips'}
          ]
        },
        {
          title: this.$t('faqs.securityAndPhishing'),
          articles: [
            {to: 'https://kb.myetherwallet.com/security/securing-your-ethereum.html', title: 'Protecting Yourself and Your Funds'},
            {to: 'https://kb.myetherwallet.com/security/phish-hacks-thefts-and-stolen-funds-due-to-phishing.html', title: 'Phish, Hacks, Thefts & stolen funds due to phishing messages on Slack / Reddit / Google Ads'},
            {to: 'https://kb.myetherwallet.com/security/what-to-do-if-youve-had-your-funds-stolen.html', title: 'What to do if you\'ve had your funds stolen?'},
            {to: 'https://kb.myetherwallet.com/security/turning-of-2fa-on-myetherwallet.html', title: 'Can I turn on 2FA for MyEtherWallet?'},
            {to: 'https://kb.myetherwallet.com/security/ethereum-two-people-same-private-key.html', title: 'Ensuring MyEtherWallet doesn\'t give different people the same private key'},
            {to: 'https://kb.myetherwallet.com/security/how-can-we-trust-myetherwallet.html', title: 'How can we trust MyEtherWallet?'}
          ]
        },
        {
          title: this.$t('faqs.transactions'),
          articles: [
            {to: 'https://kb.myetherwallet.com/gas/what-is-gas-ethereum.html', title: 'What is Gas?'},
            {to: 'https://kb.myetherwallet.com/transactions/what-is-nonce.html', title: 'What is Nonce?'},
            {to: 'https://kb.myetherwallet.com/transactions/transactions-not-showing-or-pending.html', title: 'Transactions are Not Showing Up or Pending Forever'},
            {to: 'https://kb.myetherwallet.com/transactions/transaction-failed-out-of-gas.html', title: 'Transaction Failed - Out of Gas'},
            {to: 'https://kb.myetherwallet.com/transactions/transaction-fee-not-refunded.html', title: 'Transaction Failed - TX Fee not Refunded'},
            {to: 'https://kb.myetherwallet.com/transactions/check-status-of-ethereum-transaction.html', title: 'Checking or Replacing a TX After it\'s Been Sent'}
          ]
        },
        {
          title: this.$t('faqs.privKeyandPass'),
          articles: [
            {to: 'https://kb.myetherwallet.com/private-keys-passwords/lost-eth-private-key.html', title: 'Lost Private Key'},
            {to: 'https://kb.myetherwallet.com/private-keys-passwords/lost-ethereum-wallet-password.html', title: 'Lost Password'},
            {to: 'https://kb.myetherwallet.com/private-keys-passwords/accessing-different-address-same-private-key-ether.html', title: 'Private Key opens a different account / two addresses'},
            {to: 'https://kb.myetherwallet.com/private-keys-passwords/private-key-not-working.html', title: 'Private Key Not Working'},
            {to: 'https://kb.myetherwallet.com/private-keys-passwords/difference-beween-private-key-and-keystore-file.html', title: 'Differences between wallet types (e.g. private key vs keystore)'},
            {to: 'https://kb.myetherwallet.com/private-keys-passwords/missing-characters-of-private-key.html', title: 'Missing characters from private key'}
          ]
        }
      ]
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "FaqsContainer.scss";
</style>
