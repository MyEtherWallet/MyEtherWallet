<template>
  <div class="mew-component--nft-manager">
    <div class="d-flex">
      <div class="flex-grow-1">
        <mew6-white-sheet>
          <interface-wrap title="NFT Manager">
            <!--            <v-tabs
              :vertical="true">
              <v-tab
                class="mew-heading-2"
                v-for="(item, i) in items"
                :key="item + i"
              >
                {{i}}
              </v-tab>
            </v-tabs>
            <div>
              <div class="d-flex justify-space-between mb-5">
                <h5 class="font-weight-bold">CryptoKitties</h5>
                <div>Total 3</div>
              </div>
              <div>
                <v-card
                  v-for="(kitty, key) in CryptoKitties"
                  :key="key"
                  flat
                  color="tableHeader"
                  class="border-radius&#45;&#45;5px pl-4 pr-6 py-0 mb-2 d-flex align-center justify-space-between"
                >
                  <div class="d-flex align-center">
                    <img
                      height="100"
                      :src="kitty.image"
                      alt="Crypto Kitty"
                    />
                    <div class="ml-5">#{{ kitty.number }}</div>
                  </div>
                  <mew-button
                    :has-full-width="false"
                    btn-style="outline"
                    title="Send"
                    btn-size="large"
                  />
                </v-card>
              </div>
            </div>-->
            <mew-nft-tabs :items="items" is-vertical @onTab="getActive">
              <template #tabItemContent>
                <div>
                  <div class="d-flex justify-space-between mb-5">
                    <h5 class="font-weight-bold">
                      {{ showContracts[tabActive].name }}
                    </h5>
                    <div>Total {{ showContracts[tabActive].count }}</div>
                  </div>
                  <div>
                    {{showItems}}
                    <v-card
                      v-for="(kitty, key) in showItems"
                      :key="key"
                      flat
                      color="tableHeader"
                      class="border-radius--5px pl-4 pr-6 py-0 mb-2 d-flex align-center justify-space-between"
                    >
                      {{ kitty }}
                      <div class="d-flex align-center">
                        <img
                          height="100"
                          :src="kitty.image"
                          alt="Crypto Kitty"
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
      tabActive: 1
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
    tokens() {}
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
      console.log(this.nft.getAvailableContracts()); // todo remove dev item
      const detailsRaw = this.nft.getAvailableContracts();
      this.showContracts = detailsRaw;
      this.items = detailsRaw.map(item => {
        return { name: `${item.name} (${item.count})` };
      });
    });
  },
  methods: {
    getActive(val) {
      this.tabActive = val;
      console.log(val); // todo remove dev item
      console.log(this.nft.getAvailableContracts()[val]); // todo remove dev item
      this.nft
        .setActiveContract(this.nft.getAvailableContracts()[val].contract)
        .then(res => {
          console.log('setActiveContract', res); // todo remove dev item
          this.nft.getPageValues().then(result => {
            console.log('getPageValues', result); // todo remove dev item
            this.showItems = result.tokens.map(item => {
              item.image = this.nft.getImageUrl(item.token_id);
              return item;
            });
            console.log('showItems', this.showItems); // todo remove dev item
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
