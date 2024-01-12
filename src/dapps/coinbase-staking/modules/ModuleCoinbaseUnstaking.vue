<template>
  <div class="dapps-stakewise-stake pt-8 pb-13 px-3 pa-sm-15">
    <v-row>
      <v-col
        :order="$vuetify.breakpoint.smAndDown ? 'last' : ''"
        cols="12"
        md="8"
        :class="$vuetify.breakpoint.smAndDown ? 'my-10' : 'pr-7'"
      >
        <mew-sheet class="pa-15">
          <div class="mew-heading-2 textDark--text mb-8">
            Unstake ETH with Coinbase Staking
          </div>

          <!-- ======================================================================================= -->
          <!-- Stake direction information -->
          <!-- ======================================================================================= -->
          <div ref="input" class="d-flex align-center text-center">
            <div
              class="border-radius--8px bgWalletBlockDark flex-grow-1 pa-5 d-flex flex-column align-center"
              style="width: 30%"
            >
              <div
                class="mew-caption textMedium--text font-weight-regular mb-2"
              >
                You give
              </div>
              <div class="stake-icon">
                <img
                  src="@/assets/images/icons/icon-eth-gray.svg"
                  alt="Stakewise"
                />
              </div>
              <div class="font-weight-bold mt-2">MEWcbETH</div>
            </div>
            <div class="px-5">
              <v-icon color="greenPrimary">mdi-arrow-right</v-icon>
            </div>
            <div
              class="border-radius--8px bgWalletBlockDark flex-grow-1 pa-5 d-flex flex-column align-center"
              style="width: 30%"
            >
              <div
                class="mew-caption textMedium--text font-weight-regular mb-2"
              >
                You will get
              </div>
              <div class="stake-icon">
                <img src="@/assets/images/icons/icon-eth-gray.svg" alt="Eth" />
              </div>
              <div class="font-weight-bold mt-2">{{ currencyName }}</div>
            </div>
          </div>

          <!-- ======================================================================================= -->
          <!-- Amount to stake -->
          <!-- ======================================================================================= -->
          <div class="position--relative mt-15">
            <app-button-balance :loading="false" :balance="balanceInETH" />
            <mew-input
              type="number"
              :max-btn-obj="{
                title: 'Max',
                disabled: true,
                method: setMax
              }"
              :image="iconEth"
              label="Amount to unstake"
              placeholder="Enter amount"
              :value="stakeAmount"
              :error-messages="errorMessages"
              :buy-more-str="buyMoreStr"
              :disabled="true"
              @buyMore="openBuySell"
              @input="setAmount"
            />
          </div>

          <!-- ======================================================================================= -->
          <!-- Stake status -->
          <!-- ======================================================================================= -->
          <div class="stake-status">
            <div class="d-flex justify-space-between">
              <div>
                <div class="mew-body">
                  Network Fee
                  <span
                    class="ml-2 greenPrimary--text cursor--pointer"
                    @click="openSettings"
                  >
                    Edit
                  </span>
                </div>
              </div>
              <div class="text-right">
                <div class="">{{ ethTotalFee }} {{ currencyName }}</div>
                <div v-show="isEthNetwork" class="mew-body textLight--text">
                  {{ gasPriceFiat }}
                </div>
              </div>
            </div>
          </div>

          <!-- ======================================================================================= -->
          <!-- Divier -->
          <!-- ======================================================================================= -->
          <v-divider class="mt-8" />

          <!-- ======================================================================================= -->
          <!-- How stake works -->
          <!-- ======================================================================================= -->
          <div class="mt-6">
            <div class="font-weight-bold mb-2">How unstaking works</div>
            <ul class="textMedium--text">
              <li class="mb-2">Request amount to be unstaked</li>
              <li class="mb-2">
                Wait for the {{ currencyName }} to free up and be ready for
                claim (Status updates every 1PM UTC)
              </li>
              <li class="mb-2">Claim available stake</li>
            </ul>

            <div class="mt-6">
              <a
                href="https://help.myetherwallet.com/en/articles/6136823-stake-your-eth-using-stakewise"
                target="_blank"
              >
                <div class="greenPrimary--text">
                  View Coinbase Staking guide<v-icon
                    color="greenPrimary"
                    small
                    class="ml-2"
                  >
                    mdi-open-in-new
                  </v-icon>
                </div>
              </a>
            </div>
          </div>

          <!-- ======================================================================================= -->
          <!-- Divier -->
          <!-- ======================================================================================= -->
          <v-divider class="mt-9 mb-8" />

          <!-- ======================================================================================= -->
          <!-- Start staking -->
          <!-- ======================================================================================= -->
          <div class="d-flex flex-column align-center">
            <mew-checkbox
              v-model="agreeToTerms"
              label="I have read and agreed to Coinbase Staking terms of
      service."
              :link="{
                title: 'Coinbase terms',
                url: 'https://stakewise.io/terms-and-conditions/'
              }"
            />
            <mew-button
              class="mt-8"
              title="Unstake"
              btn-size="xlarge"
              :disabled="!isValid"
              @click.native="stake"
            />
          </div>
        </mew-sheet>
      </v-col>
      <v-col cols="12" md="4">
        <coinbase-staking-summary class="mb-4" />
      </v-col>
    </v-row>
  </div>
</template>

<script>
import handlerAnalytics from '@/modules/analytics-opt-in/handlers/handlerAnalytics.mixin';
import { fromWei } from 'web3-utils';
import { mapGetters, mapState } from 'vuex';
import BigNumber from 'bignumber.js';
import { debounce } from 'lodash';

import buyMore from '@/core/mixins/buyMore.mixin.js';
import { formatFloatingPointValue } from '@/core/helpers/numberFormatHelper';
import { ERROR, Toast } from '@/modules/toast/handler/handlerToast';
import { EventBus } from '@/core/plugins/eventBus';
import hasValidDecimals from '@/core/helpers/hasValidDecimals';

const MIN_GAS_LIMIT = 150000;
export default {
  name: 'ModuleCoinbaseUnstaking',
  components: {
    CoinbaseStakingSummary: () => import('../components/CoinbaseStakingSummary')
  },
  mixins: [buyMore, handlerAnalytics],
  data() {
    return {
      iconEth: require('@/assets/images/icons/icon-eth-gray.svg'),
      stakeAmount: '0',
      locGasPrice: '0',
      gasLimit: '21000',
      agreeToTerms: false,
      estimateGasError: false
    };
  },
  computed: {
    ...mapGetters('wallet', ['balanceInETH']),
    ...mapGetters('global', [
      'network',
      'isEthNetwork',
      'gasPriceByType',
      'getFiatValue'
    ]),
    ...mapGetters('external', ['fiatValue']),
    ...mapState('stakewise', ['validatorApr']),
    ...mapState('global', ['gasPriceType']),
    ...mapState('wallet', ['web3', 'address']),
    currencyName() {
      return this.network.type.currencyName;
    },
    ethTotalFee() {
      const gasPrice = BigNumber(this.locGasPrice).gt(0)
        ? BigNumber(this.locGasPrice)
        : BigNumber(this.gasPriceByType(this.gasPriceType));
      const gasLimit = BigNumber(this.gasLimit).gt('21000')
        ? this.gasLimit
        : MIN_GAS_LIMIT;
      const ethFee = fromWei(BigNumber(gasPrice).times(gasLimit).toFixed());
      return formatFloatingPointValue(ethFee).value;
    },
    gasPriceFiat() {
      const gasPrice = BigNumber(this.ethTotalFee);
      return gasPrice.gt(0)
        ? this.getFiatValue(gasPrice.times(this.fiatValue).toFixed())
        : '0';
    },
    hasEnoughBalanceToStake() {
      return BigNumber(this.ethTotalFee)
        .plus(this.stakeAmount)
        .lte(this.balanceInETH);
    },
    hasEnoughBalance() {
      return BigNumber(this.ethTotalFee).lte(this.balanceInETH);
    },
    isValid() {
      return (
        BigNumber(this.stakeAmount).gt(0) &&
        this.hasEnoughBalanceToStake &&
        this.agreeToTerms
      );
    },
    errorMessages() {
      if (!this.hasEnoughBalanceToStake || !this.hasEnoughBalance) {
        return 'Not enough ETH.';
      }

      if (this.estimateGasError) {
        return !this.hasEnoughBalanceToStake
          ? 'Issue with gas estimation. Please check if you have enough balance!'
          : '';
      }
      if (BigNumber(this.stakeAmount).lt(0)) {
        return 'Value cannot be negative';
      }
      if (
        BigNumber(this.stakeAmount).gt(0) &&
        hasValidDecimals(BigNumber(this.stakeAmount).toFixed(), 18)
      ) {
        return 'Invalid decimals. ETH can only have 18 decimals';
      }
      return '';
    },
    buyMoreStr() {
      return this.isEthNetwork && !this.hasEnoughBalanceToStake
        ? this.network.type.canBuy
          ? 'Buy more.'
          : ''
        : null;
    }
  },
  watch: {
    gasPriceType() {
      this.locGasPrice = this.gasPriceByType(this.gasPriceType);
    }
  },
  mounted() {
    this.locGasPrice = this.gasPriceByType(this.gasPriceType);
  },
  methods: {
    setAmount: debounce(function (val) {
      const value = val ? val : 0;
      this.stakeAmount = BigNumber(value).toFixed();
    }, 500),
    setMax() {
      if (this.hasEnoughBalanceToStake) {
        const max = BigNumber(this.balanceInETH).minus(
          BigNumber(this.ethTotalFee)
        );
        this.setAmount(max.toFixed());
      }
    },
    openSettings() {
      EventBus.$emit('openSettings');
    }
  }
};
</script>

<style lang="scss" scoped>
.stake-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--v-borderInput-base) !important;
  border-radius: 50% !important;
  width: 52px;
  height: 52px;
  background-color: var(--v-alwaysWhite-base);

  img {
    height: 30px;
  }
}

ul {
  li {
    list-style: none;
    margin-bottom: 12px;

    &:before {
      font-size: 11px;
      content: '◆';
      margin-left: -23px;
      margin-right: 10px;
      color: var(--v-greenPrimary-base);
    }
  }
}
</style>
