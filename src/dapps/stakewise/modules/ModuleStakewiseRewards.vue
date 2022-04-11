<template>
  <div class="pt-8 pb-13 px-3 pa-sm-15">
    <v-row>
      <v-col
        :order="$vuetify.breakpoint.smAndDown ? 'last' : ''"
        cols="12"
        md="8"
        :class="$vuetify.breakpoint.smAndDown ? 'my-10' : 'pr-7'"
      >
        <mew-sheet class="pa-md-15">
          <div class="mew-heading-2 textDark--text mb-8">Compound Rewards</div>

          <!-- ======================================================================================= -->
          <!-- Stake direction information -->
          <!-- ======================================================================================= -->
          <div ref="input" class="d-flex align-center text-center">
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
              <div
                class="mew-caption textMedium--text font-weight-regular mb-2"
              >
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
            <button-balance :loading="loadingBalance" :balance="rethBalance" />
            <mew-input
              type="number"
              :max-btn-obj="maxBtnObj"
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
                <div class="">{{ ethTotalFee }} ETH</div>
                <div class="mew-label textLight--text">${{ gasPriceFiat }}</div>
              </div>
            </div>
          </div>

          <!-- ======================================================================================= -->
          <!-- Divier -->
          <!-- ======================================================================================= -->
          <v-divider class="mt-11" />

          <!-- ======================================================================================= -->
          <!-- How compounding works -->
          <!-- ======================================================================================= -->
          <div class="mt-6">
            <div class="font-weight-bold mb-2">How Compounding works</div>
            <div class="textMedium--text mb-5">
              To increase your staking balance and maximize your rewards, you
              can transfer your rETH2 rewards balance to the sETH2 staking pool.
            </div>

            <a
              href="https://www.mewtopia.com/rewards-and-risks-of-staking-crypto/"
              target="_blank"
            >
              <div class="greenPrimary--text">
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
          <v-divider class="mt-9 mb-8" />

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
        </mew-sheet>
      </v-col>
      <v-col cols="12" md="4">
        <stakewise-apr class="mb-4" />
        <stakewise-staking
          class="mb-4"
          :tx-fee="txFee"
          @set-max="setMax"
          @scroll="scroll"
          @redeem-to-eth="redeemToEth"
        />
        <stakewise-rewards
          :tx-fee="txFee"
          @set-max="setMax"
          @scroll="scroll"
          @redeem-to-eth="redeemToEth"
        />
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
import {
  formatFiatValue,
  formatFloatingPointValue
} from '@/core/helpers/numberFormatHelper';
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
  SETH2_Token,
  RETH2_Token,
  ETH_Token
} from '@/dapps/stakewise/handlers/configs.js';
const MIN_GAS_LIMIT = 300000;

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
      loadingBalance: true,
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
    ...mapGetters('global', ['network', 'isEthNetwork', 'gasPriceByType']),
    ...mapGetters('external', ['fiatValue']),
    ...mapState('wallet', ['web3', 'address']),
    ...mapState('stakewise', ['rethBalance', 'sethBalance']),
    ...mapState('global', ['gasPriceType']),
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
      if (!token) {
        return RETH2_Token;
      }
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
    gasPrice() {
      return BigNumber(this.locGasPrice).gt(0)
        ? BigNumber(this.locGasPrice)
        : BigNumber(this.gasPriceByType(this.gasPriceType));
    },
    ethTotalFee() {
      const gasLimit = BigNumber(this.gasLimit).gt('21000')
        ? this.gasLimit
        : MIN_GAS_LIMIT;
      const ethFee = fromWei(
        BigNumber(this.gasPrice).times(gasLimit).toFixed()
      );
      return formatFloatingPointValue(ethFee).value;
    },
    gasPriceFiat() {
      const gasPrice = BigNumber(this.ethTotalFee);
      return gasPrice.gt(0)
        ? formatFiatValue(gasPrice.times(this.fiatValue).toFixed()).value
        : '0';
    },
    hasEnoughBalance() {
      return BigNumber(this.ethTotalFee).lte(this.balanceInETH);
    },
    isValid() {
      return (
        BigNumber(this.compoundAmount).gt(0) &&
        this.hasEnoughBalance &&
        this.agreeToTerms &&
        this.errorMessages === '' &&
        this.isEthNetwork
      );
    },
    txFee() {
      const gasLimit = BigNumber(this.gasLimit).gt('21000')
        ? this.gasLimit
        : MIN_GAS_LIMIT;
      const txFee = BigNumber(this.gasPrice).times(gasLimit).toFixed();
      return txFee;
    },
    overMaximum() {
      return BigNumber(this.compoundAmount).gt(this.rethBalance);
    },
    errorMessages() {
      if (BigNumber(this.compoundAmount).eq(0)) {
        return '';
      }
      if (BigNumber(this.compoundAmount).lt(0)) {
        return 'Value cannot be negative';
      }
      if (this.overMaximum) {
        return 'Exceeds rETH2 balance';
      }
      if (
        !isEmpty(this.selectedProvider) &&
        BigNumber(this.selectedProvider.minFrom).gt(this.compoundAmount)
      ) {
        return 'Not enough rETH2!';
      }

      if (
        BigNumber(this.compoundAmount).gt(0) &&
        !stakeHandler.helpers.hasValidDecimals(
          BigNumber(this.compoundAmount).toFixed(),
          18
        )
      ) {
        return 'Invalid decimals. ETH can only have 18 decimals';
      }
      return '';
    },
    target() {
      const value = this['element'];
      if (!isNaN(value)) {
        return Number(value);
      }
      return value;
    },
    element() {
      return this.$refs.input;
    },
    maxBtnObj() {
      return {
        title: 'Max',
        disabled: BigNumber(this.rethBalance).lte(0),
        method: this.setMax
      };
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
    },
    isEthNetwork() {
      this.setup();
    },
    address() {
      this.setup();
    }
  },
  mounted() {
    this.locGasPrice = this.gasPriceByType(this.gasPriceType);
    this.swapper = new Swapper(this.web3, this.network.type.name);
    this.setup();
  },
  methods: {
    ...mapActions('notifications', ['addNotification']),
    setAmount: debounce(function (val) {
      const value = val ? val : 0;
      this.compoundAmount = BigNumber(value).toFixed();
      this.stakeHandler._setAmount(BigNumber(value).toFixed());
      this.getQuote(this.hasReth, this.hasSeth, this.compoundAmount);
    }, 500),
    setup() {
      this.stakeHandler = new stakeHandler(
        this.web3,
        this.isEthNetwork,
        this.address
      );
      this.loadingBalance = false;
    },
    setMax() {
      const max = BigNumber(this.rethBalance);
      this.setAmount(max.toFixed());
    },
    setupTrade(trade) {
      if (trade instanceof Error || !trade) {
        return;
      }
      this.currentTrade = trade;
      this.currentTrade.gasPrice = this.gasPrice;
    },
    getQuote(from, to, balance) {
      if (
        balance !== '' &&
        balance > 0 &&
        !isEmpty(from) &&
        !isEmpty(to) &&
        !isEmpty(from?.symbol) &&
        !isEmpty(to?.symbol)
      ) {
        return this.swapper
          .getAllQuotes({
            fromT: from,
            toT: to,
            fromAmount: new BigNumber(balance).times(
              new BigNumber(10).pow(new BigNumber(from.decimals))
            )
          })
          .then(quotes => {
            this.availableQuotes = quotes.map(q => {
              q.rate = new BigNumber(q.amount)
                .dividedBy(new BigNumber(balance))
                .toFixed();
              this.selectedProvider = q;
              return q;
            });
          })
          .catch(err => {
            this.loading = false;
            Toast(err, {}, ERROR);
          });
      }
    },
    async getTrade(from, to, type) {
      const balance = type === 'seth' ? this.sethBalance : this.rethBalance;
      try {
        const trade = await this.swapper.getTrade({
          fromAddress: this.address,
          toAddress: this.address,
          provider: this.availableQuotes[0].provider,
          fromT: from,
          toT: to,
          quote: this.availableQuotes[0],
          fromAmount: new BigNumber(balance).times(
            new BigNumber(10).pow(new BigNumber(from.decimals))
          )
        });
        if (trade instanceof Promise) {
          trade
            .then(tradeResponse => {
              this.setupTrade(tradeResponse);
            })
            .catch(err => {
              this.loading = false;
              Toast(err, {}, ERROR);
            });
        } else {
          this.setupTrade(trade);
        }
      } catch (err) {
        this.loading = false;
        Toast(err, {}, ERROR);
      }
    },
    async showConfirm() {
      try {
        this.loading = true;
        await this.getTrade(this.hasReth, this.hasSeth, 'reth');
        this.confirmInfo = {
          from: this.hasReth.contract,
          to: this.hasSeth.contract,
          fromType: this.hasReth.symbol,
          toType: this.hasSeth.symbol,
          fromImg: this.hasReth.img,
          toImg: this.hasSeth.img,
          fromVal: this.rethBalance,
          toVal: this.rethBalance,
          fromUsdVal: BigNumber(this.hasReth.price ? this.hasReth.price : 0)
            .times(this.rethBalance)
            .toFixed(),
          toUsdVal: BigNumber(this.hasSeth.price ? this.hasSeth.price : 0)
            .times(this.rethBalance)
            .toFixed(),
          validUntil: new Date().getTime() + 10 * 60 * 1000,
          selectedProvider: this.selectedProvider,
          txFee: this.txFee,
          gasPriceType: this.gasPriceType
        };
        this.executeTrade();
      } catch (err) {
        this.loading = false;
        Toast(err.message, {}, ERROR);
      }
    },
    executeTrade() {
      const currentTradeCopy = clone(this.currentTrade);
      try {
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
      } catch (err) {
        this.loading = false;
        Toast(err.message, {}, ERROR);
      }
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
    async redeemToEth(type, balance) {
      const eth = type === 'seth' ? this.hasSeth : this.hasReth;
      await this.getQuote(eth, ETH_Token, balance);
      try {
        this.loading = true;
        await this.getTrade(eth, ETH_Token, type);
        this.confirmInfo = {
          from: eth.contract,
          to: ETH_Token.contract,
          fromType: eth.symbol,
          toType: ETH_Token.symbol,
          fromImg: eth.img,
          toImg: ETH_Token.img,
          fromVal: balance,
          toVal: balance,
          toUsdVal: BigNumber(ETH_Token.price ? ETH_Token.price : 0)
            .times(this.rethBalance)
            .toFixed(),
          fromUsdVal: BigNumber(eth.price ? eth.price : 0)
            .times(this.rethBalance)
            .toFixed(),
          validUntil: new Date().getTime() + 10 * 60 * 1000,
          selectedProvider: this.selectedProvider,
          txFee: this.txFee,
          gasPriceType: this.gasPriceType
        };
        await this.executeTrade();
      } catch (err) {
        this.loading = false;
        Toast(err.message, {}, ERROR);
      }
    },
    openSettings() {
      EventBus.$emit('openSettings');
    },
    scroll() {
      this.$vuetify.goTo(this.target);
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
