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
          <div class="mew-heading-2 textDark--text mb-8">
            Stake {{ currencyName }} with Stakewise
          </div>

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
              <div
                class="mew-caption textMedium--text font-weight-regular mb-2"
              >
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
                disabled: !hasEnoughBalanceToStake,
                method: setMax
              }"
              :image="iconEth"
              label="Amount to stake"
              placeholder="Enter amount"
              :value="stakeAmount"
              :error-messages="errorMessages"
              :buy-more-str="buyMoreStr"
              @buyMore="openMoonpay"
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
                  $ {{ gasPriceFiat }}
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
          <div class="mt-6" @click="$vuetify.goTo(target)">
            <div class="font-weight-bold mb-2">How staking works</div>
            <ul class="textMedium--text">
              <li class="mb-2">
                Anyone can deposit any amount of {{ currencyName }} into the
                Stakewise pool. No minimum required.
              </li>
              <li class="mb-2">
                For each new deposit into the pool, Stakewise mints an equal
                amount of sETH2 (1 {{ currencyName }} = 1 sETH2).
              </li>
              <li class="mb-2">
                Holders of sETH2 will start accruing rETH2 rewards within 24
                hours of receiving the sETH2 token.
              </li>
              <li>Stakewise takes 10% of the staking reward.</li>
            </ul>

            <div class="mt-6">
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
              label="I have read and agreed to Stakewise terms of
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
        </mew-sheet>
      </v-col>
      <v-col cols="12" md="4">
        <stakewise-apr class="mb-4" />
        <stakewise-staking
          class="mb-4"
          compound-rewards
          :tx-fee="txFee"
          :has-enough-balance="hasEnoughBalance"
          @set-max="setMax"
          @scroll="scroll"
          @redeem-to-eth="redeemToEth"
        />
        <stakewise-rewards
          compound-rewards
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
import { fromWei } from 'web3-utils';
import { mapActions, mapGetters, mapState } from 'vuex';
import BigNumber from 'bignumber.js';
import stakeHandler from '../handlers/stakewiseStakeHandler';
import Swapper from '@/modules/swap/handlers/handlerSwap';
import buyMore from '@/core/mixins/buyMore.mixin.js';
import {
  formatFiatValue,
  formatFloatingPointValue
} from '@/core/helpers/numberFormatHelper';
import { debounce, isEmpty, clone, find } from 'lodash';
import { ERROR, Toast } from '@/modules/toast/handler/handlerToast';
import { EventBus } from '@/core/plugins/eventBus';
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
const MIN_GAS_LIMIT = 150000;
export default {
  name: 'ModuleStakewiseStake',
  components: {
    StakewiseApr,
    StakewiseStaking,
    StakewiseRewards,
    ButtonBalance
  },
  mixins: [buyMore],
  data() {
    return {
      iconEth: require('@/assets/images/icons/icon-eth-gray.svg'),
      stakeAmount: '0',
      locGasPrice: '0',
      gasLimit: '21000',
      stakeHandler: {},
      agreeToTerms: false,
      estimateGasError: false,
      swapper: null,
      currentTrade: null,
      availableQuotes: [],
      selectedProvider: {},
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
    ...mapGetters('wallet', ['balanceInETH']),
    ...mapGetters('global', ['network', 'isEthNetwork', 'gasPriceByType']),
    ...mapGetters('external', ['fiatValue']),
    ...mapState('stakewise', ['validatorApr']),
    ...mapState('global', ['gasPriceType']),
    ...mapState('wallet', ['web3', 'address']),
    ...mapState('stakewise', ['sethBalance', 'rethBalance']),
    currencyName() {
      return this.network.type.currencyName;
    },
    totalUserStaked() {
      const total = BigNumber(this.stakeAmount);
      const totalStaked = total
        .minus(BigNumber(this.stakeAmount).times(BigNumber(1).div(100)))
        .toFixed();
      return total.gt(0) ? formatFloatingPointValue(totalStaked).value : '0';
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
        ? formatFiatValue(gasPrice.times(this.fiatValue).toFixed()).value
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
      if (!this.hasEnoughBalanceToStake) {
        return 'Not enough ETH.';
      }

      if (this.estimateGasError) {
        return 'Issue with gas estimation. Please check if you have enough balance!';
      }
      if (BigNumber(this.stakeAmount).lt(0)) {
        return 'Value cannot be negative';
      }
      if (
        BigNumber(this.stakeAmount).gt(0) &&
        !stakeHandler.helpers.hasValidDecimals(
          BigNumber(this.stakeAmount).toFixed(),
          18
        )
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
    txFee() {
      const gasLimit = BigNumber(this.gasLimit).gt('21000')
        ? this.gasLimit
        : MIN_GAS_LIMIT;
      const txFee = BigNumber(this.locGasPrice).times(gasLimit).toFixed();
      return txFee;
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
      const val = value ? value : 0;
      this.stakeHandler._setAmount(BigNumber(val).toFixed());

      if (BigNumber(value).lte(this.balanceInETH) && BigNumber(value).gt(0)) {
        this.setGasLimit();
      }
    },
    address() {
      this.setup();
    },
    isEthNetwork() {
      this.setup();
    }
  },
  mounted() {
    this.setup();
    this.locGasPrice = this.gasPriceByType(this.gasPriceType);
    this.swapper = new Swapper(this.web3, this.network.type.name);
  },
  methods: {
    ...mapActions('stakewise', ['addToPendingTxs', 'addToPendingTxsGoerli']),
    ...mapActions('notifications', ['addNotification']),
    setAmount: debounce(function (val) {
      const value = val ? val : 0;
      this.stakeAmount = BigNumber(value).toFixed();
    }, 500),
    setup() {
      this.stakeHandler = new stakeHandler(
        this.web3,
        this.isEthNetwork,
        this.address
      );
    },
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
      if (this.hasEnoughBalanceToStake) {
        const max = BigNumber(this.balanceInETH).minus(
          BigNumber(this.ethTotalFee)
        );
        this.setAmount(max.toFixed());
      }
    },
    stake() {
      this.stakeHandler
        .stake()
        .on('transactionHash', hash => {
          const info = {
            hash: hash,
            amount: this.totalUserStaked
          };
          const addTx = this.isEthNetwork
            ? this.addToPendingTxs
            : this.addToPendingTxsGoerli;
          addTx(info).then(() => {
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
    },
    scroll() {
      this.$vuetify.goTo(this.target);
    },
    setupTrade(trade) {
      if (trade instanceof Error || !trade) {
        return;
      }
      this.currentTrade = trade;
      this.currentTrade.gasPrice = this.locGasPrice;
    },
    async getQuote(from, to, balance) {
      if (
        balance !== '' &&
        balance > 0 &&
        !isEmpty(from) &&
        !isEmpty(to) &&
        !isEmpty(from?.symbol) &&
        !isEmpty(to?.symbol)
      ) {
        return await this.swapper
          .getAllQuotes({
            fromT: from,
            toT: to,
            fromAmount: new BigNumber(balance).times(
              new BigNumber(10).pow(new BigNumber(from.decimals))
            )
          })
          .then(async quotes => {
            this.availableQuotes = await quotes.map(q => {
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
            .times(this.sethBalance)
            .toFixed(),
          fromUsdVal: BigNumber(eth.price ? eth.price : 0)
            .times(this.sethBalance)
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
