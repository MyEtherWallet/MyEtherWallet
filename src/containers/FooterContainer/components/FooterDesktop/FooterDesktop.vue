<template>
  <div class="pt-6">
    <v-container>
      <v-row>
        <v-col cols="2">
          <div class="subtitle-1 font-weight-bold mb-1">Tools</div>
          <v-list>
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
              <a href="https://www.mewtopia.com/" target="_blank">
                MEWtopia
              </a>
            </v-list-item>
          </v-list>
        </v-col>
        <v-col cols="2">
          <div class="subtitle-1 font-weight-bold mb-1">Hardware Wallets</div>
          <v-list>
            <v-list-item class="px-0">
              <a href="https://www.ledger.com/?r=fa4b" target="_blank">
                Ledger Wallet
              </a>
            </v-list-item>
            <v-list-item class="px-0">
              <a href="https://shiftcrypto.ch/?ref=mew" target="_blank">
                Digital Bitbox
              </a>
            </v-list-item>
            <v-list-item class="px-0">
              <a
                href="https://ether.cards/?utm_source=mew&utm_medium=cpm&utm_campaign=site"
                target="_blank"
              >
                Ether Card
              </a>
            </v-list-item>
            <v-list-item class="px-0">
              <a
                href="https://trezor.io/?offer_id=12&aff_id=2029"
                target="_blank"
              >
                Trezor
              </a>
            </v-list-item>
            <v-list-item class="px-0">
              <a href="http://lddy.no/a4im" target="_blank">
                KeepKey
              </a>
            </v-list-item>
            <v-list-item class="px-0">
              <a
                href="http://shop.sirinlabs.com/?rfsn=2397639.54fdf&utm_source=refersion&utm_medium=affiliate&utm_campaign=2397639.54fdf"
                target="_blank"
              >
                Finney
              </a>
            </v-list-item>
            <v-list-item class="px-0">
              <a
                href="https://billfodl.com/?afmc=2j&utm_campaign=2j&utm_source=leaddyno&utm_medium=affiliate"
                target="_blank"
              >
                Billfodl
              </a>
            </v-list-item>
          </v-list>
        </v-col>
        <v-col>
          <div class="subtitle-1 font-weight-bold mb-5">
            Love
            <img src="" />
            MEW? Donate.
          </div>
          <p>
            MEW is a open-source and free to the community. Your donations go a
            long way towards making that possible.
          </p>
          <a
            class="d-flex align-center mb-3"
            target="_blank"
            href="https://etherscan.io/address/0xDECAF9CD2367cdbb726E904cD6397eDFcAe6068D"
          >
            <img src="@/assets/images/Common/Icons/eth.svg" class="mr-3" />
            <div>
              <div>ETH Donation</div>
              <div class="overline">
                Address: 0xDECAF9CD2367cdbb726E904cD6397eDFcAe6068D
              </div>
            </div>
          </a>
          <a
            class="d-flex align-center"
            target="_blank"
            href="https://blockchain.info/address/1DECAF2uSpFTP4L1fAHR8GCLrPqdwdLse9"
          >
            <img src="@/assets/images/Common/Icons/btc.svg" class="mr-3" />
            <div>
              <div>BTC Donation</div>
              <div class="overline">
                Address: 1DECAF2uSpFTP4L1fAHR8GCLrPqdwdLse9
              </div>
            </div>
          </a>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
export default {
  name: 'FooterDesktop',
  components: {},
  data: () => ({})
};
</script>

<style lang="scss" scoped>
//@import '@/assets/styles/GlobalVariables';

a {
  text-decoration: none;
}
.v-list-item {
  min-height: 35px;
}
</style>
