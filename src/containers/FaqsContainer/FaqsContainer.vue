<template>
  <div class="faqs"></div>
</template>

<script>
import CustomerSupport from '@/components/CustomerSupport';
export default {
  components: {
    'customer-support': CustomerSupport
  },
  data() {
    return {
      faqs: {
        faq1: {
          open: false,
          title: this.$t('home.howToCreateWalletTitle'),
          content: this.$t('home.howToCreateWalletDesc'),
          linkText: this.$t('home.here'),
          link:
            'https://xinfin.network/getting-started/creating-a-new-wallet-on-myetherwallet.html'
        },
        faq2: {
          open: false,
          title: this.$t('home.whatIsMewConnectTitle'),
          content: this.$t('home.whatIsMewConnectDesc'),
          linkText: this.$t('home.here'),
          link:
            'https://xinfin.network/mewconnect/mew-connect-user-guide.html'
        },
        faq3: {
          open: false,
          title: this.$t('home.workingWOtherWalletsTitle'),
          content: this.$t('home.workingWOtherWalletsDesc'),
          linkText: this.$t('home.here'),
          link:
            'https://xinfin.network/getting-started/accessing-your-new-eth-wallet.html'
        },
        faq4: {
          open: false,
          title: this.$t('home.howToSendTxTitle'),
          content: this.$t('home.howToSendTxDesc'),
          linkText: this.$t('home.here'),
          link:
            'https://xinfin.network/transactions/how-to-send-transaction.html'
        },
        faq5: {
          open: false,
          title: this.$t('home.forgotPasswordPrivKeyTitle'),
          content: this.$t('home.forgotPasswordPrivKeyDesc'),
          linkText: this.$t('home.here'),
          link:
            'https://xinfin.network/private-keys-passwords/lost-eth-private-key.html'
        }
      }
    };
  },
  methods: {
    openFAQ: function(faqToOpen) {
      this.faqs[faqToOpen].open = !this.faqs[faqToOpen].open;
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'FaqsContainer-desktop.scss';
@import 'FaqsContainer-tablet.scss';
@import 'FaqsContainer-mobile.scss';
</style>
