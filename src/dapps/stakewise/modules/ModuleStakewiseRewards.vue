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
          <div class="mew-heading-2 mb-8">Compound Rewards</div>

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
                <img
                  src="@/dapps/stakewise/assets/icon-stakewise-red.svg"
                  alt="Stakewise rETH2"
                />
              </div>
              <div class="font-weight-bold mt-2">rETH2</div>
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
                  alt="Stakewise sETH2"
                />
              </div>
              <div class="font-weight-bold mt-2">sETH2</div>
            </div>
          </div>

          <!-- ======================================================================================= -->
          <!-- Amount to stake -->
          <!-- ======================================================================================= -->
          <div class="position--relative mt-15">
            <button-balance :loading="false" :balance="rethBalance" />
            <mew-input
              type="number"
              :max-btn-obj="{
                title: 'Max',
                disabled: false,
                method: setMax
              }"
              :image="iconStakewise"
              label="Amount to compound"
              :value="compoundAmount"
              placeholder="Enter amount"
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
                <div class="">{{ ethTotalFee }} ETH</div>
                <div class="mew-label textLight--text">${{ gasPriceFiat }}</div>
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
              <div class="mew-body">Total</div>
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
          <!-- How compounding works -->
          <!-- ======================================================================================= -->
          <div class="mt-3">
            <div class="font-weight-bold mb-4">How Compounding works</div>
            <div class="textMedium--text">
              To increase your staking balance and maximize your rewards, you
              can transfer your rETH2 rewards balance to the sETH2 staking pool.
            </div>

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
          <!-- Start -->
          <!-- ======================================================================================= -->
          <div class="d-flex flex-column align-center">
            <mew-checkbox
              v-model="agreeToTerms"
              label="I have read and agreed to Stakewise terms of service."
              :link="{
                title: 'Stakewise terms',
                url: 'https://stakewise.io/terms-and-conditions/'
              }"
            />
            <mew-button
              class="mt-8"
              title="Compound Rewards"
              btn-size="xlarge"
              :loading="loading"
              :disabled="!isValid"
              @click.native="showConfirm"
            />
          </div>
        </mew6-white-sheet>
      </v-col>
      <v-col cols="12" md="4">
        <stakewise-apr class="mb-4" />
        <stakewise-staking class="mb-4" />
        <stakewise-rewards :set-max="setMax" />
      </v-col>
    </v-row>
  </div>
</template>

<script>
import StakewiseApr from '../components/StakewiseApr';
import StakewiseStaking from '../components/StakewiseStaking';
import StakewiseRewards from '../components/StakewiseRewards';
import ButtonBalance from '@/core/components/AppButtonBalance';
import Swapper from '@/modules/swap/handlers/handlerSwap';
import stakeHandler from '../handlers/stakewiseStakeHandler';
import BigNumber from 'bignumber.js';
import { debounce } from 'lodash';
import { mapGetters, mapState, mapActions } from 'vuex';
import { find, clone, isEmpty } from 'lodash';
import { fromWei } from 'web3-utils';
import { EventBus } from '@/core/plugins/eventBus';
import { formatFiatValue } from '@/core/helpers/numberFormatHelper';
import { ERROR, Toast } from '@/modules/toast/handler/handlerToast';
import Notification, {
  NOTIFICATION_TYPES,
  NOTIFICATION_STATUS
} from '@/modules/notifications/handlers/handlerNotification';
import {
  SETH2_MAINNET_CONTRACT,
  SETH2_GOERLI_CONTRACT,
  RETH2_MAINNET_CONTRACT,
  RETH2_GOERLI_CONTRACT,
  SETH2_Token
} from '@/dapps/stakewise/handlers/configs.js';
const MIN_GAS_LIMIT = 150000;
export default {
  name: 'ModuleStakewiseRewards',
  components: {
    StakewiseApr,
    StakewiseStaking,
    StakewiseRewards,
    ButtonBalance
  },
  data() {
    return {
      iconStakewise: require('@/dapps/stakewise/assets/icon-stakewise-red.svg'),
      compoundAmount: '0',
      locGasPrice: '0',
      gasLimit: '21000',
      availableQuotes: [],
      selectedProvider: {},
      stakeHandler: {},
      currentTrade: null,
      swapper: null,
      loading: false,
      agreeToTerms: false,
      confirmInfo: {
        to: '',
        from: '',
        fromImg: '',
        toImg: '',
        fromType: '',
        toType: '',
        validUntil: 0,
        selectedProvider: '',
        txFee: ''
      }
    };
  },
  computed: {
    ...mapGetters('wallet', ['balanceInETH', 'tokensList']),
    ...mapGetters('stakewise', ['getStakingFee']),
    ...mapGetters('global', ['network', 'isEthNetwork', 'gasPriceByType']),
    ...mapGetters('external', ['fiatValue']),
    ...mapState('wallet', ['web3', 'address']),
    ...mapState('stakewise', ['validatorApr']),
    ...mapState('global', ['gasPriceType']),
    currencyName() {
      return this.network.type.currencyName;
    },
    stakingFee() {
      return BigNumber(this.compoundAmount).gt(0)
        ? BigNumber(this.compoundAmount).times(BigNumber(1).div(100)).toString()
        : '--';
    },
    stakingFeeFiatValue() {
      const fee = BigNumber(this.compoundAmount);
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
      const total = BigNumber(this.compoundAmount);
      return total.gt(0)
        ? total
            .minus(BigNumber(this.compoundAmount).times(BigNumber(1).div(100)))
            .toString()
        : '--';
    },
    reth2Contract() {
      return this.isEthNetwork ? RETH2_MAINNET_CONTRACT : RETH2_GOERLI_CONTRACT;
    },
    seth2Contract() {
      return this.isEthNetwork ? SETH2_MAINNET_CONTRACT : SETH2_GOERLI_CONTRACT;
    },
    hasReth() {
      const token = find(
        this.tokensList,
        item => item.contract.toLowerCase() === this.reth2Contract.toLowerCase()
      );
      return token;
    },
    hasSeth() {
      const token = find(
        this.tokensList,
        item => item.contract.toLowerCase() === this.seth2Contract.toLowerCase()
      );
      if (!token) {
        return SETH2_Token;
      }
      return token;
    },
    rethBalance() {
      return this.hasReth ? this.hasReth.balancef : '0';
    },
    gasPrice() {
      return BigNumber(this.locGasPrice).gt(0)
        ? BigNumber(this.locGasPrice)
        : BigNumber(this.gasPriceByType(this.gasPriceType));
    },
    ethTotalFee() {
      const gasLimit = BigNumber(this.gasLimit).gt('21000')
        ? this.gasLimit
        : MIN_GAS_LIMIT;
      return fromWei(BigNumber(this.gasPrice).times(gasLimit).toString());
    },
    gasPriceFiat() {
      const gasPrice = BigNumber(this.ethTotalFee);
      return gasPrice.gt(0)
        ? formatFiatValue(gasPrice.times(this.fiatValue).toString()).value
        : '--';
    },
    hasEnoughBalance() {
      return BigNumber(this.ethTotalFee).lte(this.balanceInETH);
    },
    isValid() {
      return (
        BigNumber(this.compoundAmount).gt(0) &&
        this.hasEnoughBalance &&
        this.agreeToTerms &&
        this.errorMessages === ''
      );
    },
    txFee() {
      const gasLimit = BigNumber(this.gasLimit).gt('21000')
        ? this.gasLimit
        : MIN_GAS_LIMIT;
      return BigNumber(this.gasPrice).times(gasLimit).toString();
    },
    hasMinimum() {
      // amount > min && this.balance > networkFee
      if (!isEmpty(this.selectedProvider)) {
        return (
          BigNumber(this.selectedProvider.minFrom).lt(this.compoundAmount) &&
          BigNumber(this.compoundAmount).gt(this.txFee)
        );
      }
      return false;
    },
    overMaximum() {
      return BigNumber(this.compoundAmount).gt(this.rethBalance);
    },
    errorMessages() {
      if (this.overMaximum) {
        return 'Exceeds RETH balance';
      }
      if (this.hasMinimum) {
        return 'Not enough RETH!';
      }
      return '';
    }
  },
  watch: {
    gasPriceType() {
      this.locGasPrice = this.gasPriceByType(this.gasPriceType);
    },
    compoundAmount(value) {
      if (BigNumber(value).lte(this.balanceInETH) && BigNumber(value).gt(0)) {
        this.setGasLimit();
      }
    }
  },
  mounted() {
    this.locGasPrice = this.gasPriceByType(this.gasPriceType);
    this.swapper = new Swapper(this.web3, this.network.type.name);
    this.stakeHandler = new stakeHandler(
      this.web3,
      this.isEthNetwork,
      this.address
    );
  },
  methods: {
    ...mapActions('notifications', ['addNotification']),
    setAmount: debounce(function (val) {
      const value = val ? val : 0;
      this.compoundAmount = BigNumber(value).toString();
      this.getQuote();
    }, 500),
    setMax() {
      const max = BigNumber(this.rethBalance);
      this.setAmount(max.toString());
    },
    setupTrade(trade) {
      if (trade instanceof Error || !trade) {
        return;
      }
      this.currentTrade = trade;
      this.currentTrade.gasPrice = this.gasPrice;
    },
    getQuote: debounce(function () {
      if (
        this.rethBalance !== '' &&
        this.rethBalance > 0 &&
        !isEmpty(this.hasReth) &&
        !isEmpty(this.hasSeth) &&
        !isEmpty(this.hasReth?.symbol) &&
        !isEmpty(this.hasSeth?.symbol)
      ) {
        return this.swapper
          .getAllQuotes({
            fromT: this.hasReth,
            toT: this.hasSeth,
            fromAmount: new BigNumber(this.rethBalance).times(
              new BigNumber(10).pow(new BigNumber(this.hasReth.decimals))
            )
          })
          .then(quotes => {
            this.availableQuotes = quotes.map(q => {
              q.rate = new BigNumber(q.amount)
                .dividedBy(new BigNumber(this.rethBalance))
                .toString();
              this.selectedProvider = q;
              return q;
            });
          })
          .catch(err => {
            this.loading = false;
            Toast(err, {}, ERROR);
          });
      }
    }, 500),
    async getTrade() {
      const trade = await this.swapper.getTrade({
        fromAddress: this.address,
        toAddress: this.address,
        provider: this.availableQuotes[0].provider,
        fromT: this.hasReth,
        toT: this.hasSeth,
        quote: this.availableQuotes[0],
        fromAmount: new BigNumber(this.rethBalance).times(
          new BigNumber(10).pow(new BigNumber(this.hasReth.decimals))
        )
      });
      if (trade instanceof Promise) {
        trade.then(tradeResponse => {
          this.setupTrade(tradeResponse);
        });
      } else {
        this.setupTrade(trade);
      }
    },
    async showConfirm() {
      this.loading = true;
      await this.getTrade();
      this.confirmInfo = {
        from: this.hasReth.contract,
        to: this.hasSeth.contract,
        fromType: this.hasReth.symbol,
        toType: this.hasSeth.symbol,
        fromImg: this.hasReth.img,
        toImg: this.hasSeth.img,
        fromVal: this.rethBalance,
        toVal: this.rethBalance,
        toUsdVal: BigNumber(this.hasSeth.price ? this.hasSeth.price : 0)
          .times(this.rethBalance)
          .toFixed(),
        fromUsdVal: BigNumber(this.hasReth.price ? this.hasReth.price : 0)
          .times(this.rethBalance)
          .toFixed(),
        validUntil: new Date().getTime() + 10 * 60 * 1000,
        selectedProvider: this.selectedProvider,
        txFee: this.txFee,
        gasPriceType: this.gasPriceType
      };
      this.executeTrade();
    },
    executeTrade() {
      const currentTradeCopy = clone(this.currentTrade);
      this.loading = false;
      this.swapper
        .executeTrade(this.currentTrade, this.confirmInfo)
        .then(res => {
          this.swapNotificationFormatter(res, currentTradeCopy);
        })
        .then(() => {
          this.setAmount(0);
          this.compoundAmount = '0';
          this.locGasPrice = '0';
          this.gasLimit = '21000';
          this.agreeToTerms = false;
        })
        .catch(err => {
          this.loading = false;
          Toast(err.message, {}, ERROR);
        });
    },
    swapNotificationFormatter(obj, currentTrade) {
      obj.hashes.forEach((hash, idx) => {
        const notif = Object.assign(
          {
            hash,
            from: this.address,
            type: NOTIFICATION_TYPES.SWAP,
            network: this.network.type.name,
            status: NOTIFICATION_STATUS.PENDING,
            fromTxData: {
              currency: this.confirmInfo.fromType,
              amount: this.confirmInfo.fromVal,
              icon: this.confirmInfo.fromImg
            },
            toTxData: {
              currency: this.confirmInfo.toType,
              amount: this.confirmInfo.toVal,
              icon: this.confirmInfo.toImg,
              to: this.confirmInfo.to
                ? this.confirmInfo.to
                : currentTrade.transactions[idx].to
            },
            swapObj: obj
          },
          currentTrade.transactions[idx]
        );
        this.addNotification(new Notification(notif));
      });
    },
    openSettings() {
      EventBus.$emit('openSettings');
    },
    setGasLimit() {
      this.stakeHandler
        .getTransactionFee()
        .then(res => {
          this.gasLimit = res;
          this.stakeHandler._setGasLimit(res);
        })
        .catch(err => {
          Toast(err, {}, ERROR);
        });
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
