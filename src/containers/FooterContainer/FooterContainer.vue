<template>
  <div class="footer">
    <!-- Modal -->
    <feedback-modal />
    <div class="wrap">
      <div class="page-container">
        <div class="grid-col-1-1-1-2 footer-contents">
          <div
            v-for="(item, index) in footerContent"
            :ref="item.class"
            :class="item.class"
            :key="item.title + index"
          >
            <div class="content-title" @click="toggler(item.class)">
              <h3 class="lite">{{ item.title }}</h3>
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
                  v-for="(content, index) in item.contents"
                  :key="content.text + index"
                  class="content"
                >
                  <div v-if="content.text === $t('common.customerSupport')">
                    <customer-support :no-icon="true" />
                  </div>
                  <router-link
                    v-else-if="content.to !== undefined"
                    :to="content.to"
                  >
                    <p>{{ content.text }}</p>
                  </router-link>
                  <a
                    v-else-if="content.to === undefined"
                    :href="content.href"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <p>{{ content.text }}</p>
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div class="donate-us">
            <div class="content-title">
              <h3 class="lite">
                {{ $t('footer.love') }}
                <img src="~@/assets/images/icons/heart.svg" />
                {{ $t('footer.donate') }}
              </h3>
            </div>
            <div class="links">
              <p>{{ $t('footer.welcomeDes') }}</p>

              <a
                :href="'https://etherscan.io/address/' + ethDonationAddress"
                target="_blank"
                rel="noopener noreferrer"
              >
                <p :data-eth="ethDonationAddress" class="crypto-link">
                  <img src="~@/assets/images/icons/eth.svg" /> &nbsp;Ethereum
                  Donation
                </p>
              </a>

              <a
                href="https://blockchain.info/address/1DECAF2uSpFTP4L1fAHR8GCLrPqdwdLse9"
                target="_blank"
                rel="noopener noreferrer"
              >
                <p
                  class="crypto-link no-padding"
                  data-btc="1DECAF2uSpFTP4L1fAHR8GCLrPqdwdLse9"
                >
                  <img src="~@/assets/images/icons/btc.svg" /> &nbsp;Bitcoin
                  Donation
                </p>
              </a>
            </div>
          </div>
        </div>
        <div class="flex-space-between foot-note">
          <div class="links">
            <div v-for="(link, index) in lowerLinks" :key="link.title + index">
              <router-link v-if="link.hasOwnProperty('to')" :to="link.to">
                <span>{{ link.title }}</span>
              </router-link>
              <a
                v-else
                :href="link.href"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span>{{ link.title }}</span>
              </a>
            </div>
          </div>
          <div class="copyright">
            <p>
              {{ $t('footer.pricingP') }}
              <a
                href="https://coingecko.com/"
                target="_blank"
                rel="noopener noreferrer"
                >CoinGecko</a
              >
              <br />
              {{ $t('footer.copyright') }}
            </p>
          </div>
          <div class="social">
            <a
              v-for="link in links"
              :href="link.to"
              :key="link.class"
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
</template>

<script>
import { mapGetters } from 'vuex';
import FeedbackModal from '@/components/FeedbackModal';
import CustomerSupport from '@/components/CustomerSupport';
const version = VERSION;

export default {
  components: {
    'feedback-modal': FeedbackModal,
    'customer-support': CustomerSupport
  },
  data() {
    return {
      version: version,
      lowerLinks: [
        {
          title: this.$t('footer.feedback'),
          href: 'mailto:support@myetherwallet.com'
        },
        {
          title: this.$t('footer.privacy'),
          to: '/privacy-policy'
        },
        {
          title: this.$t('common.terms'),
          to: '/terms-and-conditions'
        },
        {
          title: `v${version}`,
          href: `https://github.com/MyEtherWallet/MyEtherWallet/releases/tag/v${version}`
        }
      ],
      footerContent: [
        {
          class: 'e1',
          title: this.$t('footer.discover'),
          contents: [
            {
              text: this.$t('footer.units'),
              to: '/convert-units'
            },
            // {
            //   text: this.$t('footer.advanced'),
            //   to: '/advanced-tools'
            // },
            {
              text: this.$t('footer.extension'),
              href:
                'https://chrome.google.com/webstore/detail/myetherwallet/nlbmnnijcnlegkjjpcfjclmcfggfefdm?hl=en'
            },
            {
              text: this.$t('footer.sendOffline'),
              to: '/send-offline-helper'
            }
          ]
        },
        {
          class: 'e2',
          title: this.$t('footer.affiliates'),
          contents: [
            {
              text: this.$t('footer.ledger'),
              href: 'https://www.ledger.com?r=fa4b'
            },
            {
              text: this.$t('footer.finney'),
              href:
                'http://shop.sirinlabs.com?rfsn=2397639.54fdf&utm_source=refersion&utm_medium=affiliate&utm_campaign=2397639.54fdf'
            },
            {
              text: this.$t('footer.digital'),
              href: 'https://digitalbitbox.com/?ref=mew'
            },
            {
              text: this.$t('footer.ethCard'),
              href:
                'https://ether.cards/?utm_source=mew&utm_medium=cpm&utm_campaign=site'
            },
            {
              text: 'KeepKey',
              href: 'http://keepkey.go2cloud.org/aff_c?offer_id=1&aff_id=5561'
            },
            {
              text: this.$t('footer.trezor'),
              href: 'https://trezor.io/?offer_id=12&aff_id=2029'
            },
            {
              text: this.$t('footer.bity'),
              href: 'https://bity.com/af/jshkb37v'
            },
            {
              text: this.$t('footer.billfodl'),
              href:
                'https://billfodl.com/?afmc=2j&utm_campaign=2j&utm_source=leaddyno&utm_medium=affiliate'
            }
          ]
        },
        {
          class: 'e3',
          title: this.$t('footer.mew'),
          contents: [
            {
              text: this.$t('footer.about'),
              to: '/#about-mew'
            },
            {
              text: this.$t('footer.team'),
              to: '/team'
            },
            {
              text: this.$t('common.faqs'),
              to: '/#faqs'
            },
            {
              text: this.$t('common.vintage'),
              href: 'https://vintage.myetherwallet.com'
            },
            {
              text: this.$t('common.customerSupport'),
              href: 'mailto:support@myetherwallet.com'
            },
            {
              text: 'Help Center',
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
        }
      ]
    };
  },
  computed: {
    ...mapGetters({
      ethDonationAddress: 'ethDonationAddress'
    })
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
