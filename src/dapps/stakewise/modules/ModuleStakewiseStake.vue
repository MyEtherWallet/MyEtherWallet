<template>
  <div class="pt-8 pb-13 px-3 pa-sm-15">
    <v-row>
      <v-col
        :order="$vuetify.breakpoint.smAndDown ? 'last' : ''"
        cols="12"
        md="8"
        :class="$vuetify.breakpoint.smAndDown ? 'my-10' : 'pr-7'"
      >
        <mew6-white-sheet
          class="pa-md-15"
          :no-shadow="$vuetify.breakpoint.smAndDown"
        >
          <div class="mew-heading-2 mb-8">
            Stake {{ currencyName }} with Stakewise
          </div>

          <!-- ======================================================================================= -->
          <!-- Stake direction information -->
          <!-- ======================================================================================= -->
          <div class="d-flex align-center text-center">
            <div
              class="border-radius--8px backgroundGrey flex-grow-1 pa-5 d-flex flex-column align-center"
              style="width: 30%"
            >
              <div
                class="mew-caption textMedium--text font-weight-regular mb-2"
              >
                You give
              </div>
              <div class="stake-icon">
                <img src="@/assets/images/icons/icon-eth-gray.svg" alt="Eth" />
              </div>
              <div class="font-weight-bold mt-2">ETH</div>
            </div>
            <div class="px-5">
              <v-icon color="greenPrimary">mdi-arrow-right</v-icon>
            </div>
            <div
              class="border-radius--8px backgroundGrey flex-grow-1 pa-5 d-flex flex-column align-center"
              style="width: 30%"
            >
              <div class="mew-caption textLight--text font-weight-regular mb-2">
                You will get
              </div>
              <div class="stake-icon">
                <img
                  src="@/dapps/stakewise/assets/icon-stakewise-green.svg"
                  alt="Stakewise"
                />
              </div>
              <div class="font-weight-bold mt-2">sETH2</div>
            </div>
          </div>

          <!-- ======================================================================================= -->
          <!-- Amount to stake -->
          <!-- ======================================================================================= -->
          <div class="position--relative mt-15">
            <button-balance :loading="false" :balance="balanceInETH" />
            <mew-input
              type="number"
              :max-btn-obj="{
                title: 'Max',
                disabled: !hasEnoughBalance,
                method: setMax
              }"
              :image="iconEth"
              label="Amount to stake"
              placeholder="Enter amount"
              :value="stakeAmount"
              :error-messages="errorMessages"
              @input="setAmount"
            />
          </div>

          <!-- ======================================================================================= -->
          <!-- Stake status -->
          <!-- ======================================================================================= -->
          <div class="stake-status">
            <div class="d-flex justify-space-between mb-5">
              <div>
                <div class="mew-body">
                  Network Fee
                  <span
                    class="greenPrimary--text cursor--pointer"
                    @click="openSettings"
                  >
                    Edit
                  </span>
                </div>
              </div>
              <div class="text-right">
                <div class="">{{ ethTotalFee }} {{ currencyName }}</div>
                <div v-show="isEthNetwork" class="mew-body textLight--text">
                  $ {{ gasPriceFiat }}
                </div>
              </div>
            </div>
            <div class="d-flex justify-space-between mb-5">
              <div class="mew-body">Staking Fee</div>
              <div class="text-right">
                <div class="">{{ stakingFee }} {{ currencyName }}</div>
                <div v-show="isEthNetwork" class="mew-body textLight--text">
                  ${{ stakingFeeFiatValue }}
                </div>
              </div>
            </div>
            <div class="d-flex justify-space-between mb-5">
              <div class="mew-body">Total Staked</div>
              <div class="text-right">
                <div class="">{{ totalUserStaked }} {{ currencyName }}</div>
                <div v-show="isEthNetwork" class="mew-body textLight--text">
                  ${{ totalFiat }}
                </div>
              </div>
            </div>
          </div>

          <!-- ======================================================================================= -->
          <!-- Divier -->
          <!-- ======================================================================================= -->
          <v-divider class="mt-4 mb-9" />

          <!-- ======================================================================================= -->
          <!-- How stake works -->
          <!-- ======================================================================================= -->
          <div class="mt-3">
            <div class="font-weight-bold mb-4">How staking works</div>
            <ul class="textMedium--text">
              <li>
                Anyone can deposit any amount of {{ currencyName }} into the
                Stakewise pool. No minimum required.
              </li>
              <li>
                For each new deposit into the pool, Stakewise mints an equal
                amount of sETH2 (1 {{ currencyName }} = 1 sETH2).
              </li>
              <li>
                Holders of sETH2 will start accruing rETH2 rewards within 24
                hours of receiving the sETH2 token.
              </li>
              <li>Stakewise takes 10% of the staking reward.</li>
            </ul>

            <a
              href="https://www.mewtopia.com/rewards-and-risks-of-staking-crypto/"
              target="_blank"
            >
              <div class="greenPrimary--text mt-6">
                View StakeWise guide<v-icon
                  color="greenPrimary"
                  small
                  class="ml-2"
                >
                  mdi-open-in-new
                </v-icon>
              </div>
            </a>
          </div>

          <!-- ======================================================================================= -->
          <!-- Divier -->
          <!-- ======================================================================================= -->
          <v-divider class="mt-12 mb-5" />

          <!-- ======================================================================================= -->
          <!-- Start staking -->
          <!-- ======================================================================================= -->
          <div class="d-flex flex-column align-center">
            <mew-checkbox
              v-model="agreeToTerms"
              label="I have read and agreeed to Stakewise terms of
      service."
              :link="{
                title: 'Stakewise terms',
                url: 'https://stakewise.io/terms-and-conditions/'
              }"
            />
            <mew-button
              class="mt-8"
              title="Start staking"
              btn-size="xlarge"
              :disabled="!isValid"
              @click.native="stake"
            />
          </div>
        </mew6-white-sheet>
      </v-col>
      <v-col cols="12" md="4">
        <stakewise-apr class="mb-4" />
        <stakewise-staking compound-rewards class="mb-4" />
        <stakewise-rewards compound-rewards />
      </v-col>
    </v-row>
  </div>
</template>

<script>
import StakewiseApr from '../components/StakewiseApr';
import StakewiseStaking from '../components/StakewiseStaking';
import StakewiseRewards from '../components/StakewiseRewards';
import ButtonBalance from '@/core/components/AppButtonBalance';
import { fromWei } from 'web3-utils';
import { mapActions, mapGetters, mapState } from 'vuex';
import BigNumber from 'bignumber.js';
import stakeHandler from '../handlers/stakewiseStakeHandler';
import { formatFiatValue } from '@/core/helpers/numberFormatHelper';
import { debounce } from 'lodash';
import { ERROR, Toast } from '@/modules/toast/handler/handlerToast';
import { EventBus } from '@/core/plugins/eventBus';
const MIN_GAS_LIMIT = 150000;
export default {
  name: 'ModuleStakewiseStake',
  components: {
    StakewiseApr,
    StakewiseStaking,
    StakewiseRewards,
    ButtonBalance
  },
  data() {
    return {
      iconEth: require('@/assets/images/icons/icon-eth-gray.svg'),
      stakeAmount: '0',
      locGasPrice: '0',
      gasLimit: '21000',
      stakeHandler: {},
      agreeToTerms: false,
      estimateGasError: false
    };
  },
  computed: {
    ...mapGetters('wallet', ['balanceInETH']),
    ...mapGetters('stakewise', ['getStakingFee']),
    ...mapGetters('global', ['network', 'isEthNetwork', 'gasPriceByType']),
    ...mapGetters('external', ['fiatValue']),
    ...mapState('stakewise', ['validatorApr']),
    ...mapState('global', ['gasPriceType']),
    ...mapState('wallet', ['web3', 'address']),
    currencyName() {
      return this.network.type.currencyName;
    },
    stakingFee() {
      return BigNumber(this.stakeAmount).gt(0)
        ? BigNumber(this.stakeAmount).times(BigNumber(1).div(100)).toString()
        : '--';
    },
    stakingFeeFiatValue() {
      const fee = BigNumber(this.stakingFee);
      return fee.gt(0)
        ? formatFiatValue(fee.times(this.fiatValue).toString()).value
        : '--';
    },
    totalFiat() {
      const total = BigNumber(this.totalUserStaked);
      return total.gt(0)
        ? formatFiatValue(total.times(this.fiatValue).toString()).value
        : '--';
    },
    totalUserStaked() {
      const total = BigNumber(this.stakeAmount);
      return total.gt(0)
        ? total
            .minus(BigNumber(this.stakeAmount).times(BigNumber(1).div(100)))
            .toString()
        : '--';
    },
    ethTotalFee() {
      const gasPrice = BigNumber(this.locGasPrice).gt(0)
        ? BigNumber(this.locGasPrice)
        : BigNumber(this.gasPriceByType(this.gasPriceType));
      const gasLimit = BigNumber(this.gasLimit).gt('21000')
        ? this.gasLimit
        : MIN_GAS_LIMIT;
      return fromWei(BigNumber(gasPrice).times(gasLimit).toString());
    },
    gasPriceFiat() {
      const gasPrice = BigNumber(this.ethTotalFee);
      return gasPrice.gt(0)
        ? formatFiatValue(gasPrice.times(this.fiatValue).toString()).value
        : '--';
    },
    hasEnoughBalance() {
      return BigNumber(this.ethTotalFee)
        .plus(this.stakeAmount)
        .lte(this.balanceInETH);
    },
    isValid() {
      return (
        BigNumber(this.stakeAmount).gt(0) &&
        this.hasEnoughBalance &&
        this.agreeToTerms
      );
    },
    errorMessages() {
      if (!this.hasEnoughBalance) {
        return 'Not enough balance to send!';
      }
      if (this.estimateGasError) {
        return 'Issue with gas estimation, please check if you have enough balance!';
      }

      return '';
    }
  },
  watch: {
    locGasPrice(newVal) {
      this.stakeHandler._setGasPrice(newVal);
    },
    gasPriceType() {
      this.locGasPrice = this.gasPriceByType(this.gasPriceType);
    },
    stakeAmount(value) {
      if (BigNumber(value).lte(this.balanceInETH) && BigNumber(value).gt(0)) {
        this.setGasLimit();
      }
    }
  },
  mounted() {
    this.stakeHandler = new stakeHandler(
      this.web3,
      this.isEthNetwork,
      this.address
    );
    this.locGasPrice = this.gasPriceByType(this.gasPriceType);
  },
  methods: {
    ...mapActions('stakewise', ['addToPendingTxs']),
    setAmount: debounce(function (val) {
      const value = val ? val : 0;
      this.stakeHandler._setAmount(BigNumber(value).toString());
      this.stakeAmount = BigNumber(value).toString();
    }, 500),
    setGasLimit() {
      this.estimateGasError = false;
      this.stakeHandler
        .getTransactionFee()
        .then(res => {
          this.gasLimit = res;
          this.stakeHandler._setGasLimit(res);
        })
        .catch(() => {
          this.estimateGasError = true;
        });
    },
    setMax() {
      const max = BigNumber(this.balanceInETH).minus(
        BigNumber(this.ethTotalFee)
      );
      this.setAmount(max.toString());
    },
    stake() {
      this.stakeHandler
        .stake()
        .on('transactionHash', hash => {
          const info = {
            hash: hash,
            amount: this.totalUserStaked
          };
          this.addToPendingTxs(info).then(() => {
            // reset stakewise
            this.setAmount(0);
            this.stakeAmount = '0';
            this.locGasPrice = '0';
            this.gasLimit = '21000';
            this.agreeToTerms = false;
            this.estimateGasError = false;
          });
        })
        .catch(err => {
          Toast(err, {}, ERROR);
          this.setAmount(0);
        });
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
  border: 1px solid var(--v-greyLight-base) !important;
  border-radius: 50% !important;
  width: 52px;
  height: 52px;
  background-color: var(--v-whiteBackground-base);

  img {
    height: 30px;
  }
}

ul {
  li {
    margin-bottom: 12px;
    padding-left: 27px;

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
