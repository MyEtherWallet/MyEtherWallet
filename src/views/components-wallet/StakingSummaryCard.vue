<template>
  <div>
    <mew-module
      has-elevation
      subtitle="My Staking Summary"
      :has-body-padding="false"
      class="bgWalletBlock"
    >
      <template #moduleBody>
        <div class="pt-4">
          <div class="staking-summary-table-header py-1">
            <v-row class="px-2 px-sm-8" no-gutters>
              <v-col
                cols="2"
                offset="2"
                class="staking-summary-table-header-item"
              >
                Rewards
              </v-col>
              <v-col
                cols="4"
                offset="4"
                offset-sm="2"
                class="staking-summary-table-header-item"
              >
                Staking Summary
              </v-col>
            </v-row>
          </div>
          <div class="staking-summary-table-body">
            <v-row v-if="showStaked" class="px-2 px-sm-8 py-4" no-gutters>
              <v-col cols="1">
                <img
                  src="@/assets/images/icons/dapps/icon-dapp-stake.svg"
                  alt="Staked Logo"
                  width="40px"
                />
              </v-col>
              <v-col cols="5" sm="4" offset="1">
                <div class="d-flex align-center mb-1">
                  <img
                    :src="network.type.icon"
                    alt="ETH Logo"
                    width="27px"
                    class="circular-image"
                  />
                  <span
                    :class="[
                      $vuetify.smAndUp ? 'mew-heading-2' : 'mew-heading-3',
                      'ml-2'
                    ]"
                  >
                    {{ stakedRewards.totalRewards | concatStr }} ETH
                  </span>
                </div>
                <div
                  class="mew-heading-4 font-weight-bold greyPrimary--text"
                  style="padding-left: 35px"
                >
                  {{ stakedRewardsFiat }}
                </div>
                <div
                  class="mew-body font-weight-bold greenPrimary--text"
                  style="padding-left: 35px"
                >
                  {{ stakedApy }}
                </div>
              </v-col>
              <v-col cols="5" sm="3" offset-sm="0">
                <div class="d-flex align-center mb-1">
                  <img
                    :src="network.type.icon"
                    alt="ETH Logo"
                    width="27px"
                    class="circular-image"
                  />
                  <span
                    :class="[
                      $vuetify.smAndUp ? 'mew-heading-2' : 'mew-heading-3',
                      'ml-2'
                    ]"
                  >
                    {{ stakedRewards.totalStaked | concatStr }} ETH
                  </span>
                </div>
                <div
                  class="mew-heading-4 font-weight-bold greyPrimary--text"
                  style="padding-left: 35px"
                >
                  {{ stakedAmountFiat }}
                </div>
              </v-col>
              <v-col
                cols="12"
                sm="2"
                offset="0"
                offset-sm="1"
                class="d-flex align-center justify-center justify-sm-end pt-3 pt-sm-0"
              >
                <mew-button
                  title="Stake more"
                  btn-style="outline"
                  btn-size="large"
                  @click.native="navigateToStaked"
                />
              </v-col>
            </v-row>
            <v-row
              v-if="showCbStake"
              :class="['px-2 px-sm-8 py-4', showStaked ? 'cb-item-border' : '']"
              no-gutters
            >
              <v-col cols="1">
                <img
                  src="@/assets/images/icons/dapps/icon-dapp-coinbase.svg"
                  alt="Staked Logo"
                  width="40px"
                />
              </v-col>
              <v-col cols="5" sm="4" offset="1">
                <div class="d-flex align-center mb-1">
                  <img
                    :src="network.type.icon"
                    alt="ETH Logo"
                    width="27px"
                    class="circular-image"
                  />
                  <span
                    :class="[
                      $vuetify.smAndUp ? 'mew-heading-2' : 'mew-heading-3',
                      'ml-2'
                    ]"
                  >
                    {{ cbStakeRewards.totalRewards | concatStr }} ETH
                  </span>
                </div>
                <div
                  class="mew-heading-4 font-weight-bold greyPrimary--text"
                  style="padding-left: 35px"
                >
                  {{ cbStakeRewardsFiat }}
                </div>
                <div
                  class="mew-body font-weight-bold greenPrimary--text"
                  style="padding-left: 35px"
                >
                  APY 4.00%
                </div>
              </v-col>
              <v-col cols="5" sm="3" offset-sm="0">
                <div class="d-flex align-center mb-1">
                  <img
                    :src="network.type.icon"
                    alt="ETH Logo"
                    width="27px"
                    class="circular-image"
                  />
                  <span
                    :class="[
                      $vuetify.smAndUp ? 'mew-heading-2' : 'mew-heading-3',
                      'ml-2'
                    ]"
                  >
                    {{ cbStakeRewards.totalStaked | concatStr }} ETH
                  </span>
                </div>
                <div
                  class="mew-heading-4 font-weight-bold greyPrimary--text"
                  style="padding-left: 35px"
                >
                  {{ cbStakeAmountFiat }}
                </div>
              </v-col>
              <v-col
                cols="12"
                sm="2"
                offset="0"
                offset-sm="1"
                class="d-flex align-center justify-center justify-sm-end pt-3 pt-sm-0"
              >
                <mew-button
                  title="Stake more"
                  btn-style="outline"
                  btn-size="large"
                  @click.native="navigateToCbStake"
                />
              </v-col>
            </v-row>
          </div>
        </div>
      </template>
    </mew-module>
  </div>
</template>

<script>
import BigNumber from 'bignumber.js';
import { mapGetters } from 'vuex';

import { formatPercentageValue } from '@/core/helpers/numberFormatHelper';
import { STAKED_ROUTE } from '@/dapps/staked-dapp/configsRoutes';
import { COINBASE_STAKING_ROUTES } from '@/dapps/coinbase-staking/configs';

export default {
  name: 'StakingSummaryCard',
  filters: {
    concatStr(val) {
      const newVal = `${val}`;
      // should probably be moved globablly
      if (newVal.length < 8) return newVal;
      return `${newVal.substr(0, 7)}...`;
    }
  },
  props: {
    stakedRewards: {
      type: Object,
      default: () => {}
    },
    cbStakeRewards: {
      type: Object,
      default: () => {}
    },
    ethPrice: {
      type: String,
      default: '0'
    },
    apr: {
      type: String,
      default: '0'
    }
  },
  computed: {
    ...mapGetters('global', ['network', 'getFiatValue']),
    showStaked() {
      return this.stakedRewards.totalStaked > 0;
    },
    showCbStake() {
      return this.cbStakeRewards.totalStaked > 0;
    },
    cbStakeAmountFiat() {
      return this.getFiatValue(
        BigNumber(this.cbStakeRewards.totalStaked).times(this.ethPrice)
      );
    },
    cbStakeRewardsFiat() {
      return this.getFiatValue(
        BigNumber(this.cbStakeRewards.totalRewards).times(this.ethPrice)
      );
    },
    stakedAmountFiat() {
      return this.getFiatValue(
        BigNumber(this.stakedRewards.totalStaked).times(this.ethPrice)
      );
    },
    stakedRewardsFiat() {
      return this.getFiatValue(
        BigNumber(this.stakedRewards.totalRewards).times(this.ethPrice)
      );
    },
    stakedApy() {
      if (this.apr > 0) {
        return `APY ${formatPercentageValue(this.apr).value}`;
      }
      return '---';
    }
  },
  methods: {
    navigateToStaked() {
      this.$router.push({ name: STAKED_ROUTE.STAKED.NAME });
    },
    navigateToCbStake() {
      this.$router.push({ name: COINBASE_STAKING_ROUTES.CORE.NAME });
    }
  }
};
</script>

<style lang="scss" scoped>
.staking-summary-table-header {
  height: 58px;
  border-bottom: 1px solid var(--v-asphalt100-base);
  align-content: center;

  .staking-summary-table-header-item {
    color: #76848b;
    font-weight: 500;
    font-size: 12px;
    text-transform: uppercase;
  }
}

.cb-item-border {
  border-top: 1px solid var(--v-asphalt100-base);
}

.circular-image {
  border-radius: 50%;
  border: 1px solid var(--v-asphalt100-base);
}
</style>
