<template>
  <div class="faqs">
    <div id="faqs" class="wrap">
      <div class="page-container">
        <div class="flex-col-vertical-bottom top-title">
          <div class="title">
            <h2>{{ $t('common.faqs') }}</h2>
            <h5>
              {{ $t('home.faqsSubheading') }}
              <a
                target="_blank"
                rel="noopener noreferrer"
                href="https://kb.myetherwallet.com/"
              >
                {{ $t('home.faqsSeeMore') }}
              </a>
            </h5>
          </div>
          <customer-support />
        </div>

        <div class="qa-cards">
          <ul class="qa__contents">
            <li v-for="prop in Object.keys(faqs)" :key="prop">
              <div class="qa__contents--title" @click="openFAQ(prop)">
                <h3>{{ faqs[prop].title }}</h3>
                <div class="show-more-buttons">
                  <div
                    :class="faqs[prop].open ? 'faq-open' : ''"
                    class="animated-button"
                  >
                    <div class="bar bar1"></div>
                    <div class="bar bar2"></div>
                  </div>
                  <span
                    v-if="false"
                    :class="faqs[prop].open ? 'show-less' : 'show-more'"
                  >
                    {{ faqs[prop].open ? '-' : '+' }}
                  </span>
                </div>
              </div>
              <div
                :class="faqs[prop].open ? 'faq-open' : ''"
                class="qa__contents--content"
              >
                <div class="qa-text">
                  {{ faqs[prop].content }}
                  <a :href="faqs[prop].link" target="_blank">
                    {{ faqs[prop].linkText }}
                  </a>
                </div>
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
            'https://kb.myetherwallet.com/getting-started/creating-a-new-wallet-on-myetherwallet.html'
        },
        faq2: {
          open: false,
          title: this.$t('home.whatIsMewConnectTitle'),
          content: this.$t('home.whatIsMewConnectDesc'),
          linkText: this.$t('home.here'),
          link: 'https://mewconnect.myetherwallet.com/'
        },
        faq3: {
          open: false,
          title: this.$t('home.workingWOtherWalletsTitle'),
          content: this.$t('home.workingWOtherWalletsDesc'),
          linkText: this.$t('home.here'),
          link:
            'https://kb.myetherwallet.com/getting-started/accessing-your-new-eth-wallet.html'
        },
        faq4: {
          open: false,
          title: this.$t('home.howToSendTxTitle'),
          content: this.$t('home.howToSendTxDesc'),
          linkText: this.$t('home.here'),
          link:
            'https://kb.myetherwallet.com/transactions/how-to-send-transaction.html'
        },
        faq5: {
          open: false,
          title: this.$t('home.forgotPasswordPrivKeyTitle'),
          content: this.$t('home.forgotPasswordPrivKeyDesc'),
          linkText: this.$t('home.here'),
          link:
            'https://kb.myetherwallet.com/private-keys-passwords/lost-eth-private-key.html'
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
@import 'FaqsContainer.scss';
</style>
