<template>
  <div>
    <cx-footer v-if="isMewCx" />
    <div v-if="!isMewCx" class="footer">
      <!-- Modal -->
      <feedback-modal />
      <div class="wrap">
        <div class="page-container">
          <div class="grid-col-1-1-1-2 footer-contents">
            <div
              v-for="(item, index) in footerContent"
              :ref="item.class"
              :key="item.title + index"
              :class="item.class"
            >
              <div class="content-title" @click="toggler(item.class)">
                <h3 class="lite">{{ $t(item.title) }}</h3>
                <p class="open" @click="openContent(item.class)">
                  <i class="fa fa-plus" aria-hidden="true" />
                </p>
                <p class="close" @click="closeContent(item.class)">
                  <i class="fa fa-minus" aria-hidden="true" />
                </p>
              </div>
              <div class="content-links">
                <div class="content-links-animation-block">
                  <div
                    v-for="(content, idx) in item.contents"
                    :key="content.text + idx"
                    class="content"
                  >
                    <div v-if="content.text === 'common.cstm-support'">
                      <customer-support :no-icon="true" />
                    </div>
                    <router-link
                      v-else-if="content.to !== undefined"
                      :to="content.to"
                    >
                      <p>{{ $t(content.text) }}</p>
                    </router-link>
                    <a
                      v-else-if="content.to === undefined"
                      :href="content.href"
                      :aria-label="content.text"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <p v-if="item.class === 'e2'">
                        {{ $t(`${content.text}`) }}
                      </p>
                      <p v-else>{{ $t(content.text) }}</p>
                    </a>
                  </div>
                </div>
              </div>
            </div>
            <div class="donate-us">
              <div class="content-title">
                <i18n path="footer.title.love" tag="h3">
                  <img
                    slot="heart"
                    src="~@/assets/images/icons/heart.svg"
                    alt
                  />
                </i18n>
              </div>
              <div class="links">
                <p>{{ $t('footer.donation.desc') }}</p>

                <a
                  :href="'https://etherscan.io/address/' + ethDonationAddress"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <div
                    :data-eth="ethDonationAddress"
                    class="crypto-link d-flex align-items-center"
                  >
                    <img
                      class="mr-2"
                      src="~@/assets/images/currency/eth.svg"
                      alt
                    />
                    <div>{{ $t('footer.donation.ether') }}</div>
                  </div>
                </a>

                <a
                  href="https://blockchain.info/address/1DECAF2uSpFTP4L1fAHR8GCLrPqdwdLse9"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <div
                    class="crypto-link no-padding d-flex align-items-center"
                    data-btc="1DECAF2uSpFTP4L1fAHR8GCLrPqdwdLse9"
                  >
                    <img
                      class="mr-2"
                      src="~@/assets/images/currency/btc.svg"
                      alt
                    />
                    <div>{{ $t('footer.donation.bitcoin') }}</div>
                  </div>
                </a>
              </div>
            </div>
          </div>
          <div class="flex-space-between foot-note">
            <div class="links">
              <div
                v-for="(link, index) in lowerLinks"
                :key="link.title + index"
              >
                <router-link v-if="link.hasOwnProperty('to')" :to="link.to">
                  <span>{{ $t(link.title) }}</span>
                </router-link>
                <a
                  v-else
                  :href="link.href"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span>{{ $t(link.title) }}</span>
                </a>
              </div>
            </div>
            <div class="copyright">
              <p>
                {{ $t('footer.pricing-p') }}
                <a
                  href="https://coingecko.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  >{{ $t('footer.coingecko') }}</a
                >
                <br />
                {{ $t('footer.copyright') }}
              </p>
            </div>
            <div class="social">
              <a
                v-for="link in links"
                :key="link.class"
                :href="link.to"
                :aria-label="link.to"
                rel="noopener noreferrer"
                target="_blank"
              >
                <i :class="'fa ' + link.class" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import FeedbackModal from '@/components/FeedbackModal';
import CustomerSupport from '@/components/CustomerSupport';
import affiliates from './affiliates.js';
const version = VERSION;
import { Misc } from '@/helpers';
import CxFooter from '@/layouts/ExtensionBrowserAction/components/CxFooter';

export default {
  components: {
    'feedback-modal': FeedbackModal,
    'customer-support': CustomerSupport,
    'cx-footer': CxFooter
  },
  data() {
    const isMewCx = Misc.isMewCx();
    return {
      isMewCx: isMewCx,
      version: version,
      lowerLinks: [
        {
          title: 'footer.feedback',
          href: 'mailto:support@myetherwallet.com'
        },
        {
          title: 'footer.privacy',
          to: '/privacy-policy'
        },
        {
          title: 'common.terms',
          to: '/terms-of-service'
        },
        {
          title: `v${version}`,
          href: `https://github.com/MyEtherWallet/MyEtherWallet/releases/tag/v${version}`
        }
      ],
      footerContent: [
        {
          class: 'e1',
          title: 'footer.title.discover',
          contents: [
            {
              text: 'convertUnits.page.title',
              to: '/convert-units'
            },
            // {
            //   text:'footer.advanced'),
            //   to: '/advanced-tools'
            // },
            {
              text: 'footer.mew-connect',
              href: 'https://mewconnect.myetherwallet.com/#/'
            },
            {
              text: 'footer.extension',
              href: 'https://www.mewcx.com'
            },
            {
              text: 'buyHardwareWallet.page.title',
              to: '/hardware-wallet-affiliates'
            },
            {
              text: 'footer.send-offline',
              to: '/send-offline-helper'
            },
            {
              text: 'verifyMessage.title',
              to: '/verify-message'
            },
            {
              text: 'footer.view-wallet-info',
              to: '/view-wallet-info'
            },
            {
              text: 'dappsSubmission.banner-submit.submit-dapp',
              to: '/dapp-submission'
            }
          ]
        },
        {
          class: 'e2',
          title: 'footer.title.affiliates',
          contents: affiliates
        },
        {
          class: 'e3',
          title: 'footer.title.mew',
          contents: [
            {
              text: 'footer.about',
              to: '/#about-mew'
            },
            {
              text: 'footer.team',
              to: '/team'
            },
            {
              text: 'common.faqs',
              to: '/#faqs'
            },
            {
              text: 'common.mewtopia',
              href: 'https://www.mewtopia.com'
            },
            {
              text: 'common.cstm-support',
              href: 'mailto:support@myetherwallet.com'
            },
            {
              text: 'common.help-center',
              href: 'https://kb.myetherwallet.com'
            }
          ]
        }
      ],
      links: [
        {
          to: 'https://www.facebook.com/myetherwallet',
          class: 'fa-facebook'
        },
        {
          to: 'https://www.twitter.com/@myetherwallet',
          class: 'fa-twitter'
        },
        {
          to: 'https://www.instagram.com/myetherwallet',
          class: 'fa-instagram'
        },
        {
          to: 'https://www.linkedin.com/company/myetherwallet',
          class: 'fa-linkedin'
        },
        {
          to: 'https://www.github.com/myetherwallet',
          class: 'fa-github'
        },
        {
          to: 'https://www.reddit.com/r/myetherwallet',
          class: 'fa-reddit-alien'
        },
        {
          to: 'https://www.medium.com/@myetherwallet',
          class: 'fa-medium'
        },
        {
          to: 'https://vk.com/public190491855',
          class: 'fa-vk'
        }
      ]
    };
  },
  computed: {
    ...mapState(['ethDonationAddress'])
  },
  mounted() {
    if (Misc.isMewCx()) {
      this.footerContent[0].contents = this.footerContent[0].contents.filter(
        item => {
          if (item.to !== '/send-offline-helper') return item;
        }
      );

      this.footerContent[2].contents = this.footerContent[2].contents.filter(
        item => {
          if (item.to !== '/#about-mew' && item.to !== '/#faqs') return item;
        }
      );
    }
  },
  methods: {
    openFeedbackModal() {
      this.$children[0].$refs.feedback.show();
    },
    openContent(element) {
      const openButton = document.querySelector('.' + element + ' .open');
      const closeButton = document.querySelector('.' + element + ' .close');
      const content = document.querySelector('.' + element + ' .content-links');
      openButton.style.display = 'none';
      closeButton.style.display = 'block';
      content.classList.remove('mobile-hide');
    },
    closeContent(element) {
      const openButton = document.querySelector('.' + element + ' .open');
      const closeButton = document.querySelector('.' + element + ' .close');
      const content = document.querySelector('.' + element + ' .content-links');
      openButton.style.display = 'block';
      closeButton.style.display = 'none';
      content.classList.add('mobile-hide');
    },
    toggler(ref) {
      const el = this.$refs[ref][0];
      el.classList.toggle('content-open');
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'FooterContainer-desktop.scss';
@import 'FooterContainer-tablet.scss';
@import 'FooterContainer-mobile.scss';
</style>
