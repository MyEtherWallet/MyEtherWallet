<template>
  <div class="mew-component--nft-manager">
    <div class="d-flex">
      <div class="flex-grow-1">
        <mew6-white-sheet>
          <interface-wrap title="NFT Manager">
            <mew-nft-tabs :items="items" is-vertical @onTab="getActive">
              <template
                v-for="(contract, idx) in showContracts"
                :slot="'tabItemContent' + (idx + 1)"
              >
                <!--                {{ contract }}-->
                <div :key="idx">
                  <div class="d-flex justify-space-between mb-5">
                    <h5 class="font-weight-bold">
                      {{ showContracts[tabActive].name }}
                    </h5>
                    <div>Total {{ showContracts[tabActive].count }}</div>
                  </div>
                  <div v-if="tokens.length === 0">
                    Loading
                  </div>
                  <div v-if="tokens.length !== 0">
                    <button @click="nextPage">next</button>
                    <button @click="priorPage">prior</button>
                    <v-card
                      v-for="(kitty, key) in tokens"
                      :key="key"
                      flat
                      color="tableHeader"
                      class="border-radius--5px pl-4 pr-6 py-0 mb-2 d-flex align-center justify-space-between"
                    >
                      <!--                      {{ kitty.image }}-->
                      <div class="d-flex align-center">
                        <img
                          height="100"
                          :src="kitty.image ? kitty.image : imageUrl(kitty.token_id)"
                          alt="Crypto Kitty"
                          @error="iconFallback"
                        />
                        <div class="ml-5">#{{ kitty.name }}</div>
                      </div>
                      <mew-button
                        :has-full-width="false"
                        btn-style="outline"
                        title="Send"
                        btn-size="large"
                      />
                    </v-card>
                  </div>
                </div>
              </template>
            </mew-nft-tabs>
          </interface-wrap>
        </mew6-white-sheet>
      </div>
      <div class="pa-4"></div>
      <div>
        <!--        <network />
        <div class="pa-4"></div>
        <swap />-->
      </div>
    </div>
  </div>
</template>

<script>
import NFT from '@/modules/nft';
import InterfaceWrap from '@/components/interface-wrap/InterfaceWrap';
import MewNftTabs from './NftLayout';
import { mapState } from 'vuex';

export default {
  components: {
    'interface-wrap': InterfaceWrap,
    'mew-nft-tabs': MewNftTabs
  },
  data() {
    return {
      nft: {},
      ready: false,
      items: [
        {
          name: 'CryptoKitties (3)'
        },
        {
          name: 'Gods Unchained (2)'
        },
        {
          name: 'CryptoFlowers (0)'
        },
        {
          name: 'MyCryptoHeros (1)'
        }
      ],
      CryptoKitties: [
        {
          image: require('@/assets/images/temp/cryptokitties1.svg'),
          number: '4534'
        },
        {
          image: require('@/assets/images/temp/cryptokitties2.svg'),
          number: '4537'
        },
        {
          image: require('@/assets/images/temp/cryptokitties3.svg'),
          number: '4589'
        }
      ],
      showContracts: [],
      showItems: [],
      tabActive: 1,
      tokens: []
    };
  },
  computed: {
    ...mapState('wallet', [
      'balance',
      'network',
      'gasPrice',
      'web3',
      'address',
      'usd'
    ]),
    ...mapState('global', ['online']),
    // tokens() {
    //   return this.nft.selectNftsToShow();
    // }
  },
  mounted() {
    console.log(this.network, this.address, this.web3); // todo remove dev item
    this.nft = new NFT({
      network: this.network,
      address: this.address,
      web3: this.web3
    });
    this.nft.init().then(res => {
      console.log(res); // todo remove dev item
      this.ready = true;
      // console.log(this.nft.getAvailableContracts()); // todo remove dev item
      const detailsRaw = this.nft.getAvailableContracts();
      this.showContracts = detailsRaw;
      this.items = detailsRaw.map(item => {
        return { name: `${item.name} (${item.count})` };
      });
      this.getActive(0);
      // this.showContracts = this.showContracts.map(item => {
      //   item.tokens = [];
      // });
    });
  },
  methods: {
    iconFallback(e) {
      console.log('err', e); // todo remove dev item
    },
    nextPage() {
      this.nft.nextPage().then(() => {
        this.tokens = this.nft.selectNftsToShow()
        console.log('this.tokens', this.tokens); // todo remove dev item
      })
    },
    priorPage(){
      this.nft.priorPage();
      this.tokens = this.nft.selectNftsToShow()
      console.log('this.tokens', this.tokens); // todo remove dev item
    },
    imageUrl(token_id){
      return this.nft.getImageUrl(token_id)
    },
    getActive(val) {
      this.tabActive = val;
      // console.log(val); // todo remove dev item
      // console.log('this.showContracts', this.showContracts); // todo remove dev item
      // console.log('getAvailableContracts', this.nft.getAvailableContracts()); // todo remove dev item
      if (this.showContracts.length === 0) {
        this.showContracts = this.nft.getAvailableContracts();
      }
      // this.showContracts = this.showContracts.map(item => {
      //   item.tokens = [];
      // });
      this.tokens = [];
      this.nft
        .setActiveContract(this.nft.getAvailableContracts()[val].contract)
        .then(res => {
          // console.log('setActiveContract', res); // todo remove dev item
          this.nft.getPageValues().then(result => {
            // console.log('getPageValues', result); // todo remove dev item
            if (result.tokens && Array.isArray(result.tokens)) {
              // this.showItems = result.tokens.map(item => {
              //   item.image = this.nft.getImageUrl(item.token_id);
              //   return item;
              // });
              this.tokens = this.nft.selectNftsToShow();
              // this.showContracts.forEach((item, idx) => {
              //   // console.log('showContracts', item); // todo remove dev item
              //   // if (!this.nft.getAvailableContracts()[val]) return false;
              //   if (
              //     item.contract.toLowerCase() ===
              //     this.nft.getAvailableContracts()[val].contract.toLowerCase()
              //   ) {
              //     const tokens = result.tokens.map(item => {
              //       item.image = this.nft.getImageUrl(item.token_id);
              //       return item;
              //     });
              //     this.$set(this, 'tokens', tokens);
              //   }
              // });
              this.$nextTick();
              // if (value) {
              //   console.log(
              //     'showitems',
              //     this.showItems,
              //     'show contracts',
              //     this.showContracts
              //   ); // todo remove dev item
              //   value.tokens = this.showItems;
              // }
            } else {
              this.showItems = [];
            }

            console.log('getAvailableContracts 2', this.nft.selectNftsToShow()); // todo remove dev item

            // const value = this.showContracts.find(item => {
            //   console.log('showContracts', item); // todo remove dev item
            //   if (!this.nft.getAvailableContracts()[val]) return false;
            //   return (
            //     item.contract.toLowerCase() ===
            //     this.nft.getAvailableContracts()[val].contract.toLowerCase()
            //   );
            // });
            // if (value) {
            //   value.tokens = this.showItems;
            // }
            // console.log('showItems', this.showItems); // todo remove dev item
          });
        });
    }
  }
};
</script>

<style lang="scss">
.mew-component--nft-manager {
  .v-tabs {
    .v-tabs-items {
      background-color: transparent !important;
    }
    .v-slide-group {
      border-right: 1px solid var(--v-inputBorder-base) !important;
      margin-right: 20px;
      padding-right: 10px;
    }
    .v-tab {
      text-align: left;
      font-weight: 400 !important;
      font-size: 14px !important;
      justify-content: flex-start;
    }
    .v-tab--active {
      font-weight: 600 !important;
      border-left: 4px solid var(--v-primary-base) !important;
    }
  }
}
</style>
