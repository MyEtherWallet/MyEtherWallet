<template>
  <div class="mew-component--home-footer titlePrimary--text">
    <v-container class="pt-12 pb-6">
      <v-row>
        <v-col cols="2">
          <div class="subtitle-1 font-weight-bold mb-1">Tools</div>
          <v-list class="titlePrimary--text">
            <v-list-item class="px-0">Verify Message</v-list-item>
            <v-list-item class="px-0">Txn Status</v-list-item>
            <v-list-item class="px-0">View Wallet Info</v-list-item>
            <v-list-item class="px-0">MyEtherWallet CX</v-list-item>
            <v-list-item class="px-0">Send Offline Helper</v-list-item>
            <v-list-item class="px-0">Submit Dapp</v-list-item>
            <v-list-item class="px-0">All Tools</v-list-item>
          </v-list>
        </v-col>
        <v-col cols="2">
          <div class="subtitle-1 font-weight-bold mb-1">MEW</div>
          <v-list>
            <v-list-item class="px-0">How It Works</v-list-item>
            <v-list-item class="px-0">Company</v-list-item>
            <v-list-item class="px-0">Why MEW</v-list-item>
            <v-list-item class="px-0">Team</v-list-item>
            <v-list-item class="px-0">Help Center</v-list-item>
            <v-list-item class="px-0">Support</v-list-item>
            <v-list-item class="px-0">
              <a
                class="color--inherit"
                href="https://www.mewtopia.com/"
                target="_blank"
              >
                MEWtopia
              </a>
            </v-list-item>
          </v-list>
        </v-col>
        <v-col cols="2">
          <div class="subtitle-1 font-weight-bold mb-1">Hardware Wallets</div>
          <v-list>
            <v-list-item class="px-0">
              <a
                class="color--inherit"
                href="https://www.ledger.com/?r=fa4b"
                target="_blank"
              >
                Ledger Wallet
              </a>
            </v-list-item>
            <v-list-item class="px-0">
              <a
                class="color--inherit"
                href="https://shiftcrypto.ch/?ref=mew"
                target="_blank"
              >
                Digital Bitbox
              </a>
            </v-list-item>
            <v-list-item class="px-0">
              <a
                class="color--inherit"
                href="https://ether.cards/?utm_source=mew&utm_medium=cpm&utm_campaign=site"
                target="_blank"
              >
                Ether Card
              </a>
            </v-list-item>
            <v-list-item class="px-0">
              <a
                class="color--inherit"
                href="https://trezor.io/?offer_id=12&aff_id=2029"
                target="_blank"
              >
                Trezor
              </a>
            </v-list-item>
            <v-list-item class="px-0">
              <a
                class="color--inherit"
                href="http://lddy.no/a4im"
                target="_blank"
              >
                KeepKey
              </a>
            </v-list-item>
            <v-list-item class="px-0">
              <a
                class="color--inherit"
                href="http://shop.sirinlabs.com/?rfsn=2397639.54fdf&utm_source=refersion&utm_medium=affiliate&utm_campaign=2397639.54fdf"
                target="_blank"
              >
                Finney
              </a>
            </v-list-item>
            <v-list-item class="px-0">
              <a
                class="color--inherit"
                href="https://billfodl.com/?afmc=2j&utm_campaign=2j&utm_source=leaddyno&utm_medium=affiliate"
                target="_blank"
              >
                Billfodl
              </a>
            </v-list-item>
          </v-list>
        </v-col>
        <v-col>
          <div class="subtitle-1 font-weight-bold mb-5 d-flex align-center">
            Love
            <mew-icon
              class="mx-1"
              icon-name="love"
              icon-type="mew"
              :img-height="30"
            />
            MEW? Donate!
          </div>
          <p>
            MEW is a open-source and free to the community. Your donations go a
            long way towards making that possible.
          </p>
          <a
            class="color--inherit d-flex align-center mb-3"
            target="_blank"
            href="https://etherscan.io/address/0xDECAF9CD2367cdbb726E904cD6397eDFcAe6068D"
          >
            <mew-icon
              icon-name="eth"
              icon-type="mew"
              :img-height="35"
              class="mr-2"
            />

            <div>
              <div class="mb-n2">ETH Donation</div>
              <div class="overline">
                Address: 0xDECAF9CD2367cdbb726E904cD6397eDFcAe6068D
              </div>
            </div>
          </a>
          <a
            class="color--inherit d-flex align-center"
            target="_blank"
            href="https://blockchain.info/address/1DECAF2uSpFTP4L1fAHR8GCLrPqdwdLse9"
          >
            <mew-icon
              icon-name="btc"
              icon-type="mew"
              :img-height="35"
              class="mr-2"
            />
            <div>
              <div class="mb-n2">BTC Donation</div>
              <div class="overline">
                Address: 1DECAF2uSpFTP4L1fAHR8GCLrPqdwdLse9
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
              <a
                class="color--inherit"
                href="https://www.myetherwallet.com/privacy-policy"
                >Privacy</a
              >
            </div>
            <div class="px-6">
              <a
                class="color--inherit"
                href="https://www.myetherwallet.com/terms-and-conditions"
              >
                Terms
              </a>
            </div>
          </div>
        </div>
        <v-spacer />
        <div class="social-icons d-flex align-center">
          <a
            v-for="(i, key) in icons"
            :key="key"
            :href="i.link"
            target="_blank"
            class="ml-4"
          >
            <mew-icon :img-height="20" :icon-name="i.icon" />
          </a>
        </div>
      </div>
    </v-container>

    <v-sheet color="titlePrimary" class="py-2">
      <v-container>
        <div class="d-flex align-center">
          <p class="cyan--text text--lighten-3 ma-0">V6.0.0-beta.3</p>
          <v-spacer />
          <p class="teal--text text--lighten-1 ma-0">
            ©2019 MyEtherWallet. All rights reserved. Pricing taken from
            <a class="cyan--text text--lighten-3" href="/">CoinMarketCap</a>.
          </p>
          <v-spacer />
          <v-sheet width="150" color="transparent">
            <v-select
              v-model="select"
              append-icon="mdi-chevron-down"
              :items="languages"
              item-text="name"
              item-value="value"
              return-object
              single-line
              dark
            ></v-select>
          </v-sheet>
        </div>
      </v-container>
    </v-sheet>
  </div>
</template>

<script>
export default {
  data: () => ({
    select: 'en',
    languages: [
      {
        name: 'English',
        value: 'en',
        flag: require('@/assets/images/flags/uk.png')
      },
      {
        name: 'Russian',
        value: 'ru',
        flag: require('@/assets/images/flags/russia.png')
      },
      {
        name: 'Germany',
        value: 'ge',
        flag: require('@/assets/images/flags/germany.png')
      },
      {
        name: 'China',
        value: 'ch',
        flag: require('@/assets/images/flags/china.png')
      },
      {
        name: 'Korean',
        value: 'kr',
        flag: require('@/assets/images/flags/korea.png')
      },
      {
        name: 'Japanese',
        value: 'jp',
        flag: require('@/assets/images/flags/japan.png')
      }
    ],
    icons: [
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
      }
    ]
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
}
</style>
