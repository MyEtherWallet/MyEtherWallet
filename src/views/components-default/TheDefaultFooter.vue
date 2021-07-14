<template>
  <div class="mew-component--home-footer titlePrimary--text">
    <div class="desktop-content d-none d-lg-block">
      <v-container class="pt-12 pb-6">
        <v-row>
          <v-col v-for="(f, fkey) in footers" :key="fkey" cols="3">
            <div class="subtitle-1 font-weight-bold mb-1">{{ f.title }}</div>
            <v-list>
              <v-list-item v-for="(d, dkey) in f.data" :key="dkey" class="px-0">
                <router-link
                  v-if="d.routerLink"
                  :to="{ name: d.routerLink, query: d.query }"
                >
                  {{ d.label }}
                </router-link>
                <a v-if="d.link" :href="d.link" target="_blank">
                  {{ d.label }}
                </a>
              </v-list-item>
            </v-list>
          </v-col>
          <v-col cols="3">
            <div class="subtitle-1 font-weight-bold mb-5 d-flex align-center">
              {{ $t('home.footer.heading') }}
            </div>
            <p>{{ $t('home.footer.text') }}</p>
            <a
              class="color--inherit d-flex align-center mb-3"
              target="_blank"
              :href="`https://etherscan.io/address/${ethDonationAddress}`"
            >
              <mew-icon
                icon-name="eth"
                icon-type="mew"
                :img-height="35"
                class="mr-2"
              />
              <div>
                <div>ETH Donation</div>
                <div v-show="false" class="overline">
                  Address: {{ ethDonationAddress }}
                </div>
              </div>
            </a>
            <a
              class="color--inherit d-flex align-center"
              target="_blank"
              :href="`https://blockchain.info/address/${btcDonationAddress}`"
            >
              <mew-icon
                icon-name="btc"
                icon-type="mew"
                :img-height="35"
                class="mr-2"
              />
              <div>
                <div>BTC Donation</div>
                <div v-show="false" class="overline">
                  Address: {{ btcDonationAddress }}
                </div>
              </div>
            </a>
          </v-col>
        </v-row>
        <div class="d-flex align-center mt-12">
          <div class="d-flex align-center mx-n6">
            <div class="d-flex align-center line-height-small">
              <div class="px-6 border-right">
                <a
                  class="color--inherit"
                  href="mailto:support@myetherwallet.com"
                  target="_blank"
                >
                  Feedback
                </a>
              </div>
              <div class="px-6 border-right">
                <router-link :to="{ name: ROUTES_HOME.PRIVACY_POLICY.NAME }">
                  Privacy
                </router-link>
              </div>
              <div class="px-6">
                <router-link :to="{ name: ROUTES_HOME.TERMS_OF_SERVICE.NAME }">
                  Terms
                </router-link>
              </div>
            </div>
          </div>
          <v-spacer />
          <div class="social-icons d-flex align-center">
            <a
              v-for="(i, key) in socialIcons"
              :key="key"
              :href="i.link"
              target="_blank"
              class="ml-4"
            >
              <mew-icon v-if="i.icon" :img-height="20" :icon-name="i.icon" />
              <img
                v-if="i.iconImage"
                :src="i.iconImage"
                alt="Social"
                height="15"
              />
            </a>
          </div>
        </div>
      </v-container>
      <v-sheet color="titlePrimary" class="py-2">
        <v-container>
          <div class="d-flex align-center">
            <p class="cyan--text text--lighten-3 ma-0">v{{ version }}</p>
            <v-spacer />
            <p class="teal--text text--lighten-1 ma-0">
              ©2021 MyEtherWallet. All rights reserved. Pricing taken from
              <a
                class="cyan--text text--lighten-3"
                href="https://www.coingecko.com/en"
                target="_blank"
                >CoinGecko</a
              >.
            </p>
            <v-spacer />
            <v-sheet width="150" color="transparent">
              <!-- <v-select
                v-model="select"
                append-icon="mdi-chevron-down"
                :items="languages"
                item-text="name"
                item-value="value"
                return-object
                single-line
                dark
              ></v-select> -->
            </v-sheet>
          </div>
        </v-container>
      </v-sheet>
    </div>

    <div class="mobile-content d-block d-lg-none">
      <v-expansion-panels accordion>
        <v-expansion-panel v-for="(mf, mfkey) in footers" :key="mfkey">
          <v-expansion-panel-header>
            <v-container>
              <v-sheet color="transparent" max-width="500px" class="mx-auto">
                <h3>{{ mf.title }}</h3>
              </v-sheet>
            </v-container>
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            <v-container>
              <v-sheet color="transparent" max-width="500px" class="mx-auto">
                <ul>
                  <li v-for="(md, mdkey) in mf.data" :key="mdkey">
                    <router-link
                      v-if="md.routerLink"
                      :to="{ name: md.routerLink, query: md.query }"
                    >
                      {{ md.label }}
                    </router-link>
                    <a v-if="md.link" :href="md.link" target="_blank">
                      {{ md.label }}
                    </a>
                  </li>
                </ul>
              </v-sheet>
            </v-container>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>

      <v-container class="py-12">
        <v-sheet color="transparent" max-width="500px" class="mx-auto">
          <div>
            <h3 class="mb-3 d-flex align-center">
              {{ $t('home.footer.heading') }}
            </h3>
            <p>{{ $t('home.footer.text') }}</p>
            <a
              class="color--inherit d-flex align-center mb-1"
              target="_blank"
              :href="`https://etherscan.io/address/${ethDonationAddress}`"
            >
              <mew-icon
                icon-name="eth"
                icon-type="mew"
                :img-height="35"
                class="mr-2"
              />
              <div>
                <div>ETH Donation</div>
                <div v-show="false" class="overline">
                  Address: {{ ethDonationAddress }}
                </div>
              </div>
            </a>
            <a
              class="color--inherit d-flex align-center"
              target="_blank"
              :href="`https://blockchain.info/address/${btcDonationAddress}`"
            >
              <mew-icon
                icon-name="btc"
                icon-type="mew"
                :img-height="35"
                class="mr-2"
              />
              <div>
                <div>BTC Donation</div>
                <div v-show="false" class="overline">
                  Address: {{ btcDonationAddress }}
                </div>
              </div>
            </a>
          </div>

          <div
            class="social-icons d-flex align-center justify-space-between mt-12"
          >
            <a
              v-for="(i, key) in socialIcons"
              :key="key"
              :href="i.link"
              target="_blank"
            >
              <mew-icon :img-height="23" :icon-name="i.icon" />
            </a>
          </div>

          <div class="d-flex mt-10">
            <div class="d-flex align-center line-height-small mx-auto">
              <div class="px-2 px-lg-6 border-right">
                <a
                  class="color--inherit"
                  href="mailto:support@myetherwallet.com"
                  target="_blank"
                >
                  Feedback
                </a>
              </div>
              <div class="px-2 px-lg-6 border-right">
                <a
                  class="color--inherit"
                  href="https://www.myetherwallet.com/privacy-policy"
                  >Privacy</a
                >
              </div>
              <div class="px-2 px-lg-6">
                <a
                  class="color--inherit"
                  href="https://www.myetherwallet.com/terms-and-conditions"
                >
                  Terms
                </a>
              </div>
            </div>
          </div>
        </v-sheet>
      </v-container>

      <v-sheet color="titlePrimary" class="py-9">
        <v-container>
          <v-sheet color="transparent" max-width="500px" class="mx-auto">
            <div class="d-flex align-center justify-space-between">
              <p class="cyan--text text--lighten-3 ma-0">v{{ version }}</p>
              <v-sheet width="150" color="transparent">
                <!-- <v-select
                  v-model="select"
                  append-icon="mdi-chevron-down"
                  :items="languages"
                  item-text="name"
                  item-value="value"
                  return-object
                  single-line
                  dark
                ></v-select> -->
              </v-sheet>
            </div>
            <v-sheet color="transparent" max-width="300px" class="mx-auto">
              <p class="teal--text text--lighten-1 mt-6 mb-0 text-center">
                ©2021 MyEtherWallet. All rights reserved. Pricing taken from
                <a
                  class="cyan--text text--lighten-3"
                  href="https://www.coingecko.com/en"
                  target="_blank"
                  >Coingecko</a
                >.
              </p>
            </v-sheet>
          </v-sheet>
        </v-container>
      </v-sheet>
    </div>
  </div>
</template>

<script>
import { ROUTES_HOME } from '@/core/configs/configRoutes';

export default {
  name: 'TheDefaultFooter',
  data: () => ({
    // eslint-disable-next-line
    ethDonationAddress: ETH_DONATION_ADDRESS,
    // eslint-disable-next-line
    btcDonationAddress: BTC_DONATION_ADDRESS,
    version: VERSION,
    footers: [
      {
        title: 'Affiliate Hardware Wallets',
        data: [
          { label: 'Ledger', link: 'https://www.ledger.com/?r=fa4b' },
          { label: 'Bitbox', link: 'https://shiftcrypto.ch/?ref=mew' },
          {
            label: 'Ether Cards',
            link: 'https://ether.cards/?utm_source=mew&utm_medium=cpm&utm_campaign=site'
          },
          { label: 'Trezor', link: 'https://trezor.io/' },
          { label: 'KeepKey', link: 'http://lddy.no/a4im' },
          {
            label: 'Finney',
            link: 'http://shop.sirinlabs.com/?rfsn=2397639.54fdf&utm_source=refersion&utm_medium=affiliate&utm_campaign=2397639.54fdf'
          },
          {
            label: 'Billfodl',
            link: 'https://billfodl.com/?afmc=2j&utm_campaign=2j&utm_source=leaddyno&utm_medium=affiliate'
          }
        ]
      },
      {
        title: 'MEW',
        data: [
          { label: 'About us', routerLink: 'CompanyPage' },
          { label: 'How it works', routerLink: 'HowItWorks' },
          { label: 'Team', routerLink: 'TeamPage' },
          { label: 'Help center', link: 'https://kb.myetherwallet.com/' },
          {
            label: 'Customer support',
            link: 'mailto:support@myetherwallet.com'
          },
          { label: 'MEWtopia', link: 'https://www.mewtopia.com/' },
          { label: 'Press Kit', routerLink: 'PressKit' },
          { label: 'Security Policy', routerLink: 'SecurityPolicy' }
        ]
      },
      {
        title: 'Tools',
        data: [
          { label: 'MEW wallet', routerLink: 'Dashboard' },
          {
            label: 'MEW CX',
            link: 'https://chrome.google.com/webstore/detail/mew-cx/nlbmnnijcnlegkjjpcfjclmcfggfefdm?utm_source=chrome-ntp-icon'
          },
          {
            label: 'Verify message',
            routerLink: 'Tools',
            query: { tool: 'verify' }
          }
          /*
          ,
          {
            label: 'Send offline help',
            routerLink: 'Tools',
            query: { tool: 'offline' }
          },
          {
            label: 'Transaction status',
            routerLink: 'SendTX'
          },
          {
            label: 'Watch only address',
            routerLink: 'Tools',
            query: { tool: 'watch' }
          },
          { label: 'Submit Dapp', routerLink: 'Home' },
          {
            label: 'Convert units',
            routerLink: 'Tools',
            query: { tool: 'convert' }
          }
          */
        ]
      }
    ],
    // select: 'en',
    // languages: [
    //   {
    //     name: 'English',
    //     value: 'en',
    //     flag: require('@/assets/images/flags/uk.png')
    //   },
    //   {
    //     name: 'Russian',
    //     value: 'ru',
    //     flag: require('@/assets/images/flags/russia.png')
    //   },
    //   {
    //     name: 'Germany',
    //     value: 'ge',
    //     flag: require('@/assets/images/flags/germany.png')
    //   },
    //   {
    //     name: 'Chinese',
    //     value: 'ch',
    //     flag: require('@/assets/images/flags/china.png')
    //   },
    //   {
    //     name: 'Korean',
    //     value: 'kr',
    //     flag: require('@/assets/images/flags/korea.png')
    //   },
    //   {
    //     name: 'Japanese',
    //     value: 'jp',
    //     flag: require('@/assets/images/flags/japan.png')
    //   }
    // ],
    socialIcons: [
      {
        link: 'https://www.facebook.com/MyEtherWallet',
        icon: 'facebook'
      },
      {
        link: 'https://twitter.com/myetherwallet',
        icon: 'twitter'
      },
      {
        link: 'https://www.instagram.com/myetherwallet/',
        icon: 'instagram'
      },
      {
        link: 'https://www.linkedin.com/company/myetherwallet',
        icon: 'linkedin'
      },
      {
        link: 'https://github.com/myetherwallet',
        icon: 'github'
      },
      {
        link: 'https://www.reddit.com/r/MyEtherWallet/',
        icon: 'reddit'
      },
      {
        link: 'https://www.youtube.com/channel/UCQU5QbObwmaHNEMsuX3uQKA',
        icon: 'youtube'
      },
      {
        link: 'https://medium.com/@myetherwallet',
        icon: 'medium'
      },
      {
        link: 'https://t.me/myetherwallet',
        iconImage: require('@/assets/images/icons/icon-telegram.svg')
      }
    ],
    ROUTES_HOME: ROUTES_HOME
  })
};
</script>

<style lang="scss" scoped>
a {
  text-decoration: none;
}
.v-list-item {
  min-height: 35px;
}
.border-right {
  border-right: 1px solid black;
}
.line-height-small {
  > div {
    line-height: 11px;
  }
}
</style>

<style lang="scss">
.mew-component--home-footer {
  a {
    color: var(--v-titlePrimary-base) !important;
  }
  .v-select__selection {
    color: #80deea !important;
    width: 100%;
    text-align: right;
  }

  .v-text-field > .v-input__control > .v-input__slot:before,
  .v-text-field > .v-input__control > .v-input__slot:after,
  .v-select.v-text-field input,
  .v-text-field__details {
    display: none;
  }

  .v-text-field .v-input__append-inner {
    margin-left: -15px;
  }

  .v-text-field,
  .v-input__slot {
    margin: 0;
    padding: 0;
  }
  .v-select .v-icon {
    color: #80deea !important;
  }

  .mobile-content {
    ul {
      li {
        padding: 0.8rem 0;
        user-select: none;
      }
    }

    .v-item-group {
      border-bottom: 1px solid rgb(224 224 224);
    }

    .v-expansion-panel-header {
      padding: 25px 0rem !important;
      //padding: 23px 24px !important;
    }

    .v-sheet,
    .v-expansion-panel:before {
      box-shadow: none !important;
    }
    .v-expansion-panel-header__icon {
      //display: none !important;
      position: absolute;
      right: 20px;
      top: 0;
      bottom: 0;
    }
  }
}
</style>
