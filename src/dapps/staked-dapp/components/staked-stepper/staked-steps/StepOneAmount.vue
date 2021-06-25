<template>
  <!--
    ===================================================
    Step one: Select Amount
    ===================================================
    -->
  <div class="mx-auto pb-15" style="max-width: 550px">
    <!--
    ===================================================
    Select Amount to stake
    ===================================================
    -->
    <div class="mew-heading-2 py-12 text-center">
      Select ETH amount to stake
    </div>

    <mew-select
      v-model="amount"
      label="Staking amount"
      :items="selectItems"
      is-swap
      outlined
      @input="setAmount"
    />

    <!--
    ===================================================
    Staking APR and fee
    ===================================================
    -->
    <div class="mb-15">
      <v-row>
        <v-col
          cols="12"
          md="6"
          class="py-1 text-uppercase captionPrimary--text font-weight-bold"
        >
          Current APR
        </v-col>
        <v-col cols="12" md="6" class="py-1 text-right primary--text">
          {{ currentApr }}
        </v-col>
      </v-row>
      <v-row>
        <v-col
          cols="12"
          md="6"
          class="
            py-1
            text-uppercase
            captionPrimary--text
            font-weight-bold
            d-flex
            align-center
          "
        >
          Staking Fee
          <mew-tooltip class="ml-1" :text="toolTipFee" />
        </v-col>
        <v-col cols="12" md="6" class="py-1 text-right">
          0.72% <span class="textSecondary--text">0.3 ETH min</span>
        </v-col>
      </v-row>
    </div>

    <!--
    ===================================================
    Deposit value growth forecast
    ===================================================
    -->
    <div>
      <div class="mew-heading-3 mb-8">Deposit value growth forecast</div>

      <div
        v-for="(forecast, idx) in depositForecast"
        :key="forecase + idx"
        class="mb-6"
      >
        <v-row>
          <v-col cols="12" md="6" class="py-1">{{ forecast.duration }}</v-col>
          <v-col cols="12" md="6" class="py-1 text-right textSecondary--text">
            {{ forecast.balanceUSD }}
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" md="6" class="py-1 primary--text">{{
            forecast.earningsETH
          }}</v-col>
          <v-col cols="12" md="6" class="py-1 text-right">{{
            forecase.balanceETH
          }}</v-col>
        </v-row>
      </div>
    </div>

    <!--
    ===================================================
    User information
    ===================================================
    -->
    <div class="tableHeader px-12 py-8 mt-15 border-radius--10px">
      <ul class="user-info">
        <li>Your ETH is staked with our partner Staked.us</li>
        <li>Staked.us will create and maintain Eth2 validators for you</li>
        <li>Earn up to 21% Annualized rewards</li>
        <li class="warning--text text--darken-2">
          You can neither spend nor transfer your Eth2 funds until an unknown
          data in the future when transfers are enabled on the Eth2 chain
        </li>
      </ul>
    </div>
    <!--
    ===================================================
    Continue button
    ===================================================
    -->
    <mew-button
      class="mx-auto d-block mt-10"
      :loading="false"
      :has-full-width="false"
      btn-size="xlarge"
      title="Next: Eth2 address"
      @click.native="onContinue"
    />
  </div>
</template>

<script>
import BigNumber from 'bignumber.js';
import { mapState, mapGetters } from 'vuex';
import eth from '@/assets/images/currencies/eth.png';
import { formatFiatValue } from '@/core/helpers/numberFormatHelper';
// TODO: need to add rules on component side for mew select, add :disabled="!hasEnoughBalance" to mew button and
// get the deposit rates
export default {
  props: {
    currentApr: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      toolTipFee:
        '0.75% staking fee (or 0.3 ETH, whichever is higher) is covering staking until transfers are enabled on Eth2. Once transfers are enabled, you will have a choice to either continue staking your ETH for an additional fee, or withdraw your ETH and earned rewards and stop staking.',
      amount: {},
      eth: eth,
      depositForecast: [
        {
          duration: 'In 3 months',
          balanceUSD: ' $15,840.00',
          balanceETH: '34.1952 ETH',
          earningsETH: '2.1952 ETH'
        },
        {
          duration: 'In 1 year',
          balanceUSD: ' $15,840.00',
          balanceETH: '34.1952 ETH',
          earningsETH: '2.1952 ETH'
        },
        {
          duration: 'In 2 years',
          balanceUSD: ' $15,840.00',
          balanceETH: '34.1952 ETH',
          earningsETH: '2.1952 ETH'
        }
      ]
    };
  },
  computed: {
    ...mapState('wallet', ['web3']),
    ...mapGetters('wallet', ['balanceInETH']),
    ...mapGetters('external', ['networkTokenUSDMarket']),
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
            value: i,
            img: this.eth,
            price: formatFiatValue(
              new BigNumber(i).times(this.networkTokenUSDMarket.value)
            ).value
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
    rules() {
      return [
        this.hasEnoughBalance || this.$t('dappsStaked.error-not-enough-bal')
      ];
    },
    /**
     * @returns boolean
     * Checks to make sure there is enough ETH balance to stake
     */
    hasEnoughBalance() {
      return BigNumber(this.balanceInETH).gte(this.amount);
    }
  },
  methods: {
    /**
     * Emits onContinue to go to next step
     */
    onContinue() {
      this.$emit('onContinue', { onStep: 1, value: this.amount });
    },
    /**
     * Sets the amount
     */
    setAmount(item) {
      this.amount = item.value;
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
</style>
