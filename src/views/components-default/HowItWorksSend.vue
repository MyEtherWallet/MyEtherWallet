<template>
  <div>
    <div class="py-3 py-md-7" />
    <v-container class="pb-12 pb-lg-0">
      <v-row class="flex-column-reverse flex-lg-row">
        <v-col cols="12" lg="5" class="text-content pr-12 mt-4 mt-lg-0">
          <app-block-title
            no-page-title
            :data="titleData"
            class="mb-12 pl-12"
          />
          <div class="mb-4 d-flex">
            <div class="mr-3">
              <v-img src="@/assets/images/icons/icon-send-mew.svg" />
            </div>
            <div>
              <div class="mb-1 font-weight-bold subtitle-1">
                Send Transactions
              </div>
              <p>
                MEW gives you full control-send your funds to anyone, anywhere,
                at any time, without middlemen, minimums, or limits.
              </p>
            </div>
          </div>

          <div class="mb-4 d-flex">
            <div class="mr-3">
              <v-img src="@/assets/images/icons/icon-offline-mew.svg" />
            </div>
            <div>
              <div class="mb-1 font-weight-bold subtitle-1">NFT Manager</div>
              <p>
                View and manage all of your collectibles and domains in MEW’s
                NFT Manager
              </p>
            </div>
          </div>

          <div class="d-flex">
            <div class="mr-3">
              <v-img src="@/assets/images/icons/icon-nft-mew.svg" />
            </div>
            <div>
              <div class="mb-1 font-weight-bold subtitle-1">
                Work with other chains
              </div>
              <p>
                MEW supports additional Ethereum-compatible networks including
                Ethereum Classic (ETC), Binance Smart Chain (BSC) and Polygon,
                so that users can manage assets beyond the Ethereum mainnet.
              </p>
              <!-- <div class="d-flex align-center mt-10">
                <a
                  href="#"
                  class="mr-5 teal--text text-decoration--underline text--lighten-2 font-weight-medium"
                >
                  Watch tutorial
                </a>
              </div> -->
            </div>
          </div>
        </v-col>
        <v-col cols="12" lg="7">
          <v-img
            src="@/assets/images/snippets/send-tx-page.png"
            class="mt-n6"
          />
        </v-col>
      </v-row>
    </v-container>
    <div class="py-2 py-md-9" />
  </div>
</template>

<script>
import AppBlockTitle from '@/core/components/AppBlockTitle';

export default {
  components: { AppBlockTitle },
  data: () => ({
    titleData: {
      textProps: '',
      toptitle: '',
      title: 'Send ETH, ERC20 tokens & NFT',
      description: 'Send your funds with the press of a button.',
      centered: false
    }
  })
};
</script>
