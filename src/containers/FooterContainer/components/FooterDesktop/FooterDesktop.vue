<template>
  <div class="dark_space--text">
    <v-container class="pt-12 pb-6">
      <v-row>
        <v-col cols="2">
          <div class="subtitle-1 font-weight-bold mb-1">Tools</div>
          <v-list class="dark_space--text">
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
            <mew-icon icon-name="love" icon-type="mew" :img-height="30" />
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
              <div>ETH Donation</div>
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
              <div>BTC Donation</div>
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
        <div class="social-icons">
          <a
            v-for="(i, key) in icons"
            :key="key"
            :href="i.link"
            target="_blank"
          >
            <mew-button
              icon-align="left"
              :icon="i.icon"
              icon-type="mew"
              btn-style="transparent"
              button-size="small"
            />
          </a>
        </div>
      </div>
    </v-container>
    <FootNote />
  </div>
</template>

<script>
import FootNote from './components/FootNote';

export default {
  components: { FootNote },
  data: () => ({
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
