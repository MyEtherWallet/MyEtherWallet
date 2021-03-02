<template>
  <the-layout-wallet-grid :total-right-col-items="1">
    <template #leftColItem1>
      <mew-module
        class="d-flex flex-grow-1 pt-6 mew-component--nft-manager"
        :has-elevation="true"
        :has-indicator="true"
        title="NFT Manager"
      >
        <template #moduleBody>
          <mew-tabs class="mt-5" :items="items" is-vertical>
            <template #tabItemContent1>
              <div>
                <v-card
                  v-for="(kitty, key) in CryptoKitties"
                  :key="key"
                  flat
                  color="tableHeader"
                  class="border-radius--5px pl-4 pr-6 py-0 mb-2 d-flex align-center justify-space-between"
                >
                  <div class="d-flex align-center">
                    <img height="100" :src="kitty.image" alt="Crypto Kitty" />
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
            </template>
            <template #tabItemContent2>
              <div>
                <div class="d-flex justify-space-between mb-5">
                  <h5 class="font-weight-bold">Gods Unchained</h5>
                  <div>Total 3</div>
                </div>
                <div>
                  <v-card
                    v-for="(kitty, key) in CryptoKitties"
                    :key="key"
                    flat
                    color="tableHeader"
                    class="border-radius--5px pl-4 pr-6 py-0 mb-2 d-flex align-center justify-space-between"
                  >
                    <div class="d-flex align-center">
                      <img height="100" :src="kitty.image" alt="Crypto Kitty" />
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
              </div>
            </template>
            <template #tabItemContent3>
              <div>
                <div class="d-flex justify-space-between mb-5">
                  <h5 class="font-weight-bold">CryptoFlowers</h5>
                  <div>Total 3</div>
                </div>
                <div>
                  <v-card
                    v-for="(kitty, key) in CryptoKitties"
                    :key="key"
                    flat
                    color="tableHeader"
                    class="border-radius--5px pl-4 pr-6 py-0 mb-2 d-flex align-center justify-space-between"
                  >
                    <div class="d-flex align-center">
                      <img height="100" :src="kitty.image" alt="Crypto Kitty" />
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
              </div>
            </template>
            <template #tabItemContent4>
              <div>
                <div class="d-flex justify-space-between mb-5">
                  <h5 class="font-weight-bold">MyCryptoHeros</h5>
                  <div>Total 3</div>
                </div>
                <div>
                  <v-card
                    v-for="(kitty, key) in CryptoKitties"
                    :key="key"
                    flat
                    color="tableHeader"
                    class="border-radius--5px pl-4 pr-6 py-0 mb-2 d-flex align-center justify-space-between"
                  >
                    <div class="d-flex align-center">
                      <img height="100" :src="kitty.image" alt="Crypto Kitty" />
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
              </div>
            </template>
          </mew-tabs>
        </template>
      </mew-module>
    </template>
  </the-layout-wallet-grid>
</template>

<script>
import TheLayoutWalletGrid from '@/core/components/TheLayoutWalletGrid';
export default {
  components: {
    TheLayoutWalletGrid
  },
  data() {
    return {
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
      ]
    };
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
