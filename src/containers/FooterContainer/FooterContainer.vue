<template>
  <div class="footer">
    <div class="wrap">
      <div class="page-container">
        <div class="grid-col-1-1-1-2 footer-contents">
          <div v-for="(item, index) in footerContent" :class="item.class" :key="item.title + index">
            <div class="content-title">
              <h3 class="lite">{{item.title}}</h3>
              <p v-on:click="openContent(item.class)" class="open">
                <i class="fa fa-plus" aria-hidden="true"></i>
              </p>
              <p v-on:click="closeContent(item.class)" class="close">
                <i class="fa fa-minus" aria-hidden="true"></i>
              </p>
            </div>
            <div class="content-links mobile-hide">
              <router-link v-for="(content, index) in item.contents" v-if="content.to !== undefined" :to="content.to" :key="content.text+index"><p>{{ content.text }}</p></router-link>
              <a v-for="(content, index) in item.contents" v-if="content.to === undefined" :href="content.href" target="_blank" :key="content.text+index"><p>{{ content.text }}</p></a>
            </div>
          </div>
          <div class="donate-us">
            <div class="content-title">
              <h3 class="lite">
                {{ $t("footer.welcome") }}
                <img src="~@/assets/images/icons/heart.svg">
              </h3>
            </div>
            <div class="content-links">
              <p>{{ $t("footer.welcomeDes") }}</p>

              <a href="https://blockchain.info/address/1DECAF2uSpFTP4L1fAHR8GCLrPqdwdLse9" target="_blank">
                <p class="crypto-link" data-btc="1DECAF2uSpFTP4L1fAHR8GCLrPqdwdLse9">
                  <img src="~@/assets/images/icons/btc.svg">
                  &nbsp;Bitcoin Donation
                </p>
              </a>

              <a href="https://etherscan.io/address/0xDECAF9CD2367cdbb726E904cD6397eDFcAe6068D" target="_blank">
                <p class="crypto-link" data-eth="0xDECAF9CD2367cdbb726E904cD6397eDFcAe6068D">
                  <img src="~@/assets/images/icons/eth.svg">
                  &nbsp;Ethereum Donation
                </p>
              </a>

            </div>
          </div>
        </div>
        <div class="flex-space-between foot-note">
          <div class="links">
            <router-link v-for="(link, index) in lowerLinks" :key="link.title + index" :to="link.to"><span>{{ link.title }}</span></router-link>
          </div>
          <div class="copyright">
            <p>
              {{ $t("footer.copyright") }}
            </p>
          </div>
          <div class="social">
            <a v-for="link in links" :href="link.to" :key="link.class">
              <i :class="'fa '+ link.class"></i>
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      lowerLinks: [
        {
          title: this.$t('footer.feedback'),
          to: '/'
        },
        {
          title: this.$t('footer.privacy'),
          to: '/privacy-policy'
        },
        {
          title: this.$t('common.terms'),
          to: '/terms-of-conditions'
        }
      ],
      footerContent: [
        {
          class: 'e1',
          title: this.$t('footer.discover'),
          contents: [
            {
              text: this.$t('footer.units'),
              to: '/'
            },
            {
              text: this.$t('footer.txStat'),
              to: '/'
            },
            {
              text: this.$t('footer.debugs'),
              to: '/'
            },
            {
              text: this.$t('footer.extension'),
              to: '/'
            },
            {
              text: this.$t('footer.others'),
              to: '/'
            }
          ]
        },
        {
          class: 'e2',
          title: this.$t('footer.affiliates'),
          contents: [
            {
              text: this.$t('footer.ledger'),
              href: 'https://www.ledgerwallet.com/products/?utm_source=&utm_medium=affiliate&utm_campaign=fa4b&utm_content='
            },
            {
              text: this.$t('footer.digital'),
              href: 'https://digitalbitbox.com/?ref=mew'
            },
            {
              text: this.$t('footer.ethCard'),
              href: 'https://ether.cards/?utm_source=mew&utm_medium=cpm&utm_campaign=site'
            },
            {
              text: this.$t('footer.trezor'),
              href: 'https://trezor.io/?a=myetherwallet.com'
            },
            {
              text: this.$t('footer.bity'),
              href: 'https://bity.com/af/jshkb37v'
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
              text: this.$t('common.customerSupport'),
              to: '/'
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
    }
  },
  methods: {
    openContent (element) {
      var openButton = document.querySelector('.' + element + ' .open')
      var closeButton = document.querySelector('.' + element + ' .close')
      var content = document.querySelector('.' + element + ' .content-links')
      openButton.style.display = 'none'
      closeButton.style.display = 'block'
      content.classList.remove('mobile-hide')
    },
    closeContent (element) {
      var openButton = document.querySelector('.' + element + ' .open')
      var closeButton = document.querySelector('.' + element + ' .close')
      var content = document.querySelector('.' + element + ' .content-links')
      openButton.style.display = 'block'
      closeButton.style.display = 'none'
      content.classList.add('mobile-hide')
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "FooterContainer.scss";
</style>
