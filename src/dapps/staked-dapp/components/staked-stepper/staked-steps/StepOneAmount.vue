<template>
  <!--
    ===================================================
    Step one: Select Amount
    ===================================================
    -->
  <div>
    <div class="mx-auto mb-3" style="max-width: 550px">
      <!--
    ===================================================
    Select Amount to stake
    ===================================================
    -->
      <div class="mew-heading-2 py-8 text-center">
        Select ETH amount to stake
      </div>

      <border-block class="pt-9 pb-0 px-3 px-sm-5">
        <mew-select
          v-model="selectedItem"
          label="Staking amount"
          :items="selectItems"
          :error-messages="errorMessages"
          :buy-more-str="
            errorMessages ? (network.type.canBuy ? 'Buy more.' : null) : null
          "
          filter-placeholder="Search for Amount"
          is-custom
          outlined
          @buyMore="openBuySell"
          @input="setAmount"
        />
        <!--
    ===================================================
    Staking APR and fee
    ===================================================
    -->
        <div class="mt-12">
          <v-row>
            <v-col
              cols="6"
              md="6"
              class="py-1 text-uppercase textLight--text font-weight-bold"
            >
              Current APR
            </v-col>
            <v-col cols="6" md="6" class="py-1 text-right greenPrimary--text">
              {{ currentAprFormatted }}
            </v-col>
          </v-row>
          <v-row>
            <v-col
              cols="6"
              md="6"
              class="py-1 text-uppercase textLight--text font-weight-bold d-flex align-center"
            >
              <div class="staking-fee">Staking Fee</div>
              <mew-tooltip class="ml-1" :text="toolTipFee" max-width="320px" />
            </v-col>
            <v-col cols="6" md="6" class="py-1 text-right">
              {{ stakingFee }} ETH
            </v-col>
          </v-row>
        </div>

        <v-divider class="greyMedium my-6" />

        <!--
      ===================================================
      Deposit value growth forecast
      ===================================================
      -->
        <div>
          <div class="mew-heading-3 mb-8">Deposit value growth forecast</div>

          <div
            v-for="(forecast, idx) in depositForecast"
            :key="forecast + idx"
            class="mb-6"
          >
            <v-row>
              <v-col cols="6" md="6" class="py-1">{{
                forecast.duration
              }}</v-col>
              <v-col cols="6" md="6" class="py-1 text-right textLight--text">
                {{ forecast.balanceFiat }}
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="6" md="6" class="py-1 greenPrimary--text">{{
                forecast.earningsETH + ' ETH'
              }}</v-col>
              <v-col cols="6" md="6" class="py-1 text-right">{{
                forecast.balanceETH + ' ETH'
              }}</v-col>
            </v-row>
          </div>
        </div>
      </border-block>

      <!--
    ===================================================
    User information
    ===================================================
    -->
      <div
        class="bgWalletBlockDark px-6 px-sm-12 py-8 mt-6 border-radius--10px"
      >
        <ul class="user-info textMedium--text">
          <li>Your ETH is staked with our partner Staked.us</li>
          <li>Staked.us will create and maintain Eth2 validators for you</li>
          <li>Earn up to 6% annualized rewards</li>
        </ul>
      </div>
      <!--
    ===================================================
    Continue button
    ===================================================
    -->
      <mew-button
        class="mx-auto d-block mt-9"
        :loading="false"
        :has-full-width="$vuetify.breakpoint.smAndDown"
        btn-size="xlarge"
        :title="buttonText"
        :disabled="!hasEnoughBalance"
        @click.native="onContinue"
      />
    </div>
  </div>
</template>

<script>
import BigNumber from 'bignumber.js';
import { mapState, mapGetters } from 'vuex';

import {
  formatPercentageValue,
  formatFloatingPointValue
} from '@/core/helpers/numberFormatHelper';
import buyMore from '@/core/mixins/buyMore.mixin.js';
import handlerAnalyticsMixin from '@/modules/analytics-opt-in/handlers/handlerAnalytics.mixin';

export default {
  mixins: [buyMore, handlerAnalyticsMixin],
  props: {
    currentApr: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      toolTipFee:
        'In order to provide uninterrupted, reliable staking service and maintain your validators, Staked.us and MEW retain 13% of your rewards as a service fee. APR figures shown here already account for this fee. In addition, MEW will charge a one-time staking fee of 0.1 ETH for each 32 ETH you stake.',
      amount: 0,
      selectedItem: {}
    };
  },
  computed: {
    ...mapState('wallet', ['web3']),
    ...mapGetters('wallet', ['balanceInETH']),
    ...mapGetters('external', ['fiatValue']),
    ...mapGetters('global', ['network', 'getFiatValue']),
    stakingFee() {
      const val = BigNumber(this.amount).div(32);
      return BigNumber(val).times(0.1).toFixed();
    },
    networkImg() {
      return this.network.type.icon;
    },
    buttonText() {
      return !this.hasEnoughBalance
        ? 'Not enough funds'
        : 'Next: Withdrawal Address';
    },
    /**
     * Current APR Formatted
     * @returns string
     */
    currentAprFormatted() {
      if (this.currentApr > 0) {
        return formatPercentageValue(this.currentApr).value;
      }
      return '--';
    },
    /**
     * @returns array
     * Mew select dropdown items
     */
    selectItems() {
      const items = [];
      for (let i = 1; i <= 4000; i++) {
        if (i % 32 === 0) {
          items.push({
            name: i + ' ETH',
            value: i + '', //change to string to make mew select filter work
            img: this.networkImg,
            price: this.getFiatValue(new BigNumber(i).times(this.fiatValue))
          });
        }
      }
      return items;
    },
    /**
     * @returns array
     * Used to show error messages
     * Validates amount
     */
    errorMessages() {
      if (!this.hasEnoughBalance) {
        return 'Not enough funds. Staking requires 32 ETH per validator.';
      }
      return null;
    },
    /**
     * @returns boolean
     * Checks to make sure there is enough ETH balance to stake
     */
    hasEnoughBalance() {
      return BigNumber(this.balanceInETH).gte(this.amount);
    },
    /**
     * @returns array
     * Calculates the deposit growth forecast
     */
    depositForecast() {
      /**
       * 1 year Forecast
       */
      const oneYearEarnings = this.getEarnings(12);
      /**
       * 2 years forecast
       */
      const twoYearEarnings = this.getEarnings(24);
      /**
       * 3 years forecast
       */
      const threeYearEarnings = this.getEarnings(36);
      return [
        {
          duration: 'In 1 year',
          balanceFiat: this.getFiatValue(
            new BigNumber(this.amount)
              .plus(oneYearEarnings)
              .times(this.fiatValue)
          ),
          balanceETH: formatFloatingPointValue(
            new BigNumber(this.amount).plus(oneYearEarnings)
          ).value,
          earningsETH: formatFloatingPointValue(oneYearEarnings).value
        },
        {
          duration: 'In 2 years',
          balanceFiat: this.getFiatValue(
            new BigNumber(this.amount)
              .plus(twoYearEarnings)
              .times(this.fiatValue)
          ),
          balanceETH: formatFloatingPointValue(
            new BigNumber(this.amount).plus(twoYearEarnings)
          ).value,
          earningsETH: formatFloatingPointValue(twoYearEarnings).value
        },
        {
          duration: 'In 3 years',
          balanceFiat: this.getFiatValue(
            new BigNumber(this.amount)
              .plus(threeYearEarnings)
              .times(this.fiatValue)
          ),
          balanceETH: formatFloatingPointValue(
            new BigNumber(this.amount).plus(threeYearEarnings)
          ).value,
          earningsETH: formatFloatingPointValue(threeYearEarnings).value
        }
      ];
    }
  },
  methods: {
    /**
     * get earning based on months
     */
    getEarnings(months) {
      const apr = new BigNumber(this.currentApr)
        .dividedBy(100) // 12*100
        .times(months / 12)
        .toFixed();
      const yieldFees = BigNumber(apr).times(0.13);
      const stakeYields = new BigNumber(this.amount).times(
        BigNumber(apr).minus(yieldFees)
      );

      return stakeYields.toFixed();
    },
    /**
     * Emits onContinue to go to next step
     */
    onContinue() {
      this.trackDapp('StakedSetAmount');
      this.$emit('onContinue', { onStep: 1, amount: this.amount });
    },
    /**
     * Sets the amount
     * change from str -> integer to keep amount as integer
     */
    setAmount(item) {
      this.amount = parseInt(item.value);
    }
  }
};
</script>

<style lang="scss" scoped>
.user-info {
  list-style-type: '◆';
  li {
    padding-left: 15px;
    margin-bottom: 20px;

    &:last-child {
      margin-bottom: 0;
    }
  }
}
// Set line height to align center with tooltip icon
.staking-fee {
  line-height: 20px;
}
</style>
