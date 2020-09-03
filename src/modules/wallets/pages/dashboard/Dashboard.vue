<template>
  <div class="d-flex mew-component--dashboard">
    <div class="flex-grow-1">
      <mew6-white-sheet class="mew-component--eth-balance pa-7 pb-4">
        <div class="d-flex">
          <mew-module
            class="block-title"
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
                style="border-radius: 100% !important"
                class="options-btn ml-2"
                button-size="small"
                icon-type="mdi"
                icon="mdi-dots-vertical"
                btn-style="transparent"
                color-theme="secondary"
              />
            </div>
          </div>
        </div>
        <chart :key="chart1d.key" :data="chart1d.data" class="mt-5" />
        <v-row class="align-center">
          <v-col class="d-flex align-center justify-center">
            <div class="font-weight-bold">ETH PRICE</div>
            <div class="ml-2 font-weight-regular text-color--mew-green">
              3.12%
            </div>
            <v-icon class="primary--text body-2">mdi-arrow-up-bold</v-icon>
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

      <div class="pa-4"></div>

      <div class="mew-component--no-eth-balance">
        <mew6-white-sheet class="position--relative">
          <div
            class="bg-container"
            :class="$vuetify.theme.dark ? 'dark' : ''"
          />
          <v-sheet color="transparent" max-width="360px">
            <div class="pa-12">
              <h2 class="mb-6">My ETH balance is empty</h2>
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

      <div class="pa-4"></div>

      <mew6-white-sheet class="mew-component--my-token-value">
        <div class="d-flex align-center pa-7 pb-4">
          <mew-module
            class="block-title"
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
                button-size="small"
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
      <div class="pa-4"></div>
      <div class="mew-component--empty-token-list">
        <mew6-white-sheet class="position--relative">
          <div
            class="bg-container"
            :class="$vuetify.theme.dark ? 'dark' : ''"
          />
          <v-sheet color="transparent" max-width="360px">
            <div class="pa-12">
              <h2 class="mb-6">My token list is empty</h2>
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
    <div class="pa-4"></div>
    <div>
      <network />
      <div class="pa-4"></div>
      <swap />
      <div class="pa-4"></div>
      <banner-ads />
    </div>
  </div>
</template>

<script>
import network from '@/modules/wallets/components/network/Network';
import swap from '@/modules/wallets/components/swap/Swap';
import bannerAds from '@/modules/wallets/components/banner-ads/BannerAds';
import staticData from './staticData.js';
import chart from '@/modules/wallets/components/chart/Chart';

export default {
  components: {
    chart,
    swap,
    network,
    bannerAds
  },
  data() {
    return staticData;
  },
  methods: {
    onBtnClick() {}
  }
};
</script>

<style lang="scss">
.mew-component--dashboard {
  .mew-toggle-btn {
    .v-btn {
      padding: 8px !important;
      height: initial !important;
      margin-right: 4px !important;
    }
    .v-btn--active:before {
      opacity: 0 !important;
    }
  }
  .block-title > div > div > div {
    align-items: flex-start !important;
  }
  .left-wrapper {
    > div:nth-child(2) {
      > span:nth-child(1) {
        margin-bottom: 5px;
      }
      > span:nth-child(2) {
        margin-bottom: 5px;
      }
    }
    .left-icon {
      padding-right: 5px !important;
      img {
        height: 45px;
      }
    }
  }
}
.mew-component--eth-balance {
  .options-btn.v-btn {
    padding: 0 !important;
    width: 35px !important;
    height: 35px !important;
    min-width: 35px !important;

    .icon {
      margin: 0 !important;
      padding: 0 !important;
    }
  }
  .theme--dark.v-sheet {
    background-color: var(--v-mewBg-base);
    border-color: var(--v-mewBg-base);
  }
  .block-title {
    margin-left: 10px;
    .header-wrapper {
      padding: 0 !important;
    }
    .left-wrapper {
      padding-left: 0 !important;
    }
  }
}

.mew-component--no-eth-balance {
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

.mew-component--my-token-value {
  .theme--dark.v-sheet {
    background-color: var(--v-mewBg-base);
    border-color: var(--v-mewBg-base);
  }
  .block-title {
    margin-left: 10px;
    .header-wrapper {
      padding: 0 !important;
    }
    .left-wrapper {
      padding-left: 0 !important;
    }
    .right-wrapper {
      padding: 0 !important;
      margin-right: 10px;
    }
  }
}

.mew-component--empty-token-list {
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
}
</style>
