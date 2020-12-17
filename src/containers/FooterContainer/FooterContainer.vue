<template>
  <div>
    <cx-footer v-if="isMewCx" />
    <div v-if="!isMewCx" class="footer">
      <!-- Modal -->
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
import CustomerSupport from '@/components/CustomerSupport';
import affiliates from './affiliates.js';
const version = VERSION;
import { Misc } from '@/helpers';
import CxFooter from '@/layouts/ExtensionBrowserAction/components/CxFooter';

export default {
  components: {
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
          href: 'mailto:support@xinfin.org'
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
              text: 'footer.send-offline',
              to: '/send-offline-helper'
            },
            {
              text: 'verifyMessage.title',
              to: '/verify-message'
            },
          ]
        },
        
  
      ],
      links: [
        {
          to: 'https://www.facebook.com/XinFinHybridBlockchain/',
          class: 'fa-facebook'
        },
        {
          to: 'https://twitter.com/XinFin_Official',
          class: 'fa-twitter'
        },
        {
          to: 'https://www.instagram.com/xinfin_hybridblockchain',
          class: 'fa-instagram'
        },
        {
          to: 'https://www.linkedin.com/company/xinfin/',
          class: 'fa-linkedin'
        },
        {
          to: 'https://www.github.com/XinFinOrg',
          class: 'fa-github'
        },
        {
          to: 'https://www.reddit.com/r/xinfin/',
          class: 'fa-reddit-alien'
        },
        {
          to: 'https://medium.com/xinfin',
          class: 'fa-medium'
        }
      ]
    };
  },
  computed: {
    ...mapState('main', ['ethDonationAddress'])
  },
  mounted() {},
  methods: {
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
</style>
