<template>
  <div>
    <div class="d-flex">
      <div class="flex-grow-1">
        <mew6-white-sheet class="mew-component--eth-balance pa-7 pb-4">
          <div class="d-flex">
            <mew-module
              subtitle="My Eth Balance"
              title="24.842 ETH"
              caption="$4,032.35"
              :icon="require('@/assets/images/currencies/eth.png')"
              icon-align="left"
            />
            <div class="ml-auto">
              <div class="d-flex align-center">
                <mew-toggle-button
                  :button-group="chartButtons"
                  @onBtnClick="onBtnClick"
                />
                <mew-button
                  button-size="medium"
                  class="ml-4"
                  icon-type="mdi"
                  icon="mdi-dots-vertical"
                />
              </div>
              <div v-if="false">
                <v-btn-toggle
                  v-model="chartRange"
                  class="chart-button-group"
                  tile
                  group
                  dense
                  mandatory
                >
                  <v-btn value="1d">
                    1D
                  </v-btn>
                  <v-btn value="1w">
                    1W
                  </v-btn>
                  <v-btn value="1m">
                    1M
                  </v-btn>
                  <v-btn value="1y">
                    1Y
                  </v-btn>
                  <v-btn value="all">
                    All
                  </v-btn>
                </v-btn-toggle>
                <v-btn text icon class="ml-4">
                  <v-icon>mdi-dots-vertical</v-icon>
                </v-btn>
              </div>
            </div>
          </div>
          <ChartBalance
            :key="chartData.key"
            :data="chartData.data"
            class="mt-5"
          />
          <v-row class="align-center">
            <v-col class="d-flex align-center justify-center">
              <div class="font-weight-bold">ETH PRICE</div>
              <div class="ml-2 font-weight-regular text-color--mew-green">
                3.12%
              </div>
              <v-icon class="emerald--text body-2">mdi-arrow-up-bold</v-icon>
              <v-icon v-if="false" class="light_red--text body-2"
                >mdi-arrow-down-bold</v-icon
              >
              <div class="ml-5">$321.55 / 1 ETH</div>
            </v-col>
            <v-col class="text-right">
              <mew-button
                :has-full-width="false"
                title="Send Transaction"
                button-size="xlarge"
                @click.native="goTo('HomeAccessWallet')"
              />
            </v-col>
          </v-row>
        </mew6-white-sheet>
        <spacer />
        <div id="id-4e910eeead37ba158dafdbd93bb1d543">
          <mew6-white-sheet class="position--relative">
            <div
              class="bg-container"
              :class="$vuetify.theme.dark ? 'dark' : ''"
            />
            <v-sheet color="transparent" max-width="360px">
              <div class="pa-12">
                <div class="mew-subtitle mb-6">
                  My ETH balance is empty
                </div>
                <mew-button
                  :has-full-width="false"
                  title="Buy ETH with a credit card"
                  button-size="xlarge"
                />
                <div class="d-flex align-center mt-4">
                  <div>We accept credit card</div>
                  <img
                    v-if="!$vuetify.theme.dark"
                    class="ml-2 mr-1"
                    height="21"
                    src="@/assets/images/icons/icon-visa-dark.png"
                  />
                  <img
                    v-if="$vuetify.theme.dark"
                    class="ml-2 mr-2"
                    height="13"
                    src="@/assets/images/icons/icon-visa-white.png"
                  />
                  <img
                    height="18"
                    src="@/assets/images/icons/icon-mastercard-mew.png"
                  />
                </div>
                <div class="text-color--gray1 mt-12">
                  Tip: You can also send your ETH here from another wallet!
                </div>
              </div>
            </v-sheet>
          </mew6-white-sheet>
        </div>
        <spacer />
        <mew6-white-sheet>
          <div class="d-flex align-center">
            <mew-module
              subtitle="My Tokens Value"
              title="$3,132.25"
              :icon="require('@/assets/images/icons/icon-token-grey.png')"
              icon-align="left"
            >
              <template v-slot:rightHeaderContainer>
                <mew-button
                  class="ml-auto"
                  :has-full-width="false"
                  title="All tokens"
                  button-size="xsmall"
                  btn-style="transparent"
                  @click.native="goTo('HomeAccessWallet')"
                />
              </template>
            </mew-module>
          </div>
          <mew-table
            :has-color="false"
            :table-headers="tableHeaders"
            :table-data="tableData"
          />
        </mew6-white-sheet>
        <spacer />
        <div id="id-3c6d3124fa862b83b5d03c21da68c074">
          <mew6-white-sheet class="position--relative">
            <div
              class="bg-container"
              :class="$vuetify.theme.dark ? 'dark' : ''"
            />
            <v-sheet color="transparent" max-width="360px">
              <div class="pa-12">
                <div class="mew-subtitle mb-6">
                  My token list is empty
                </div>
                <mew-button
                  class="ml-auto ml-n3"
                  :has-full-width="false"
                  :title="'+ ' + 'Add custom tokens'"
                  button-size="xsmall"
                  btn-style="transparent"
                  @click.native="goTo('HomeAccessWallet')"
                />
              </div>
            </v-sheet>
            <div class="py-12" />
            <div class="py-5" />
          </mew6-white-sheet>
        </div>
      </div>
      <spacer />
      <div>
        <network />
        <spacer />
        <swap />
        <spacer />
        <banner-ads />
      </div>
    </div>
  </div>
</template>

<script>
import Spacer from '@/components/Common/Spacer';
import Network from '@/components/Network';
import Swap from '@/components/Swap';
import BannerAds from '@/components/BannerAds';
import staticData from './staticData.js';

export default {
  components: {
    spacer: Spacer,
    network: Network,
    swap: Swap,
    'banner-ads': BannerAds
  },
  data() {
    // return staticData;
  }
};
</script>
<style lang="scss" scoped>
#id-3c6d3124fa862b83b5d03c21da68c074 {
  .bg-container {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    background-image: url(~@/assets/images/backgrounds/bg-half-circle.png),
      url(~@/assets/images/backgrounds/bg-small-half-circle.png);
    background-position: right -16px bottom -26px, left -18px bottom -29px;
    background-size: 357px, 150px;

    &.dark {
      opacity: 0.3;
      filter: saturate(1) brightness(0.47) contrast(5);
    }
  }

  .block-title {
    line-height: 36px !important;
  }

  .top-button-icon {
    border-radius: 100%;
    background-color: #b4ece4;
    margin-right: 5px;
  }
}

#id-4e910eeead37ba158dafdbd93bb1d543 {
  .bg-container {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    background-image: url(~@/assets/images/backgrounds/bg-circle-triangle.png);
    background-position: right 60px bottom -1px;
    background-size: 245px;

    &.dark {
      opacity: 0.4;
      filter: saturate(1) brightness(0.47) contrast(3);
    }
  }
}
</style>
