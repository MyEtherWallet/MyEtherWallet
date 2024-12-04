<template>
  <div class="dapps-stakewise-stake pt-8 pb-13 px-3 pa-sm-15">
    <v-row align="center" justify="center">
      <v-col cols="10">
        <mew-warning-sheet
          class="mb-5"
          title="StakeWise V3 is now live on
        mainnet"
          description="The Stakewise integration on MEW is no longer accepting deposits. You can still unstake your ETH by redeeming your sETH2 and rETH2 tokens."
          :bottom="false"
        />
      </v-col>
      <v-col
        :order="$vuetify.breakpoint.smAndDown ? 'last' : ''"
        cols="12"
        md="10"
        :class="$vuetify.breakpoint.smAndDown ? 'my-10' : ''"
      >
        <mew-sheet class="pa-15">
          <div class="mew-heading-4 font-weight-bold">
            MEW will no longer be accepting new deposits in the integrated
            Stakewise app. Unstaking continues to be available. Users who staked
            with Stakewise via MEW have the following options:
          </div>
          <!-- ======================================================================================= -->
          <!-- How stake works -->
          <!-- ======================================================================================= -->
          <div class="mt-6">
            <ul class="textMedium--text">
              <li class="mb-2">
                <a
                  href="https://help.myetherwallet.com/en/articles/6136823-stake-your-eth-using-stakewise"
                  target="_blank"
                  >Unstake your ETH from Stakewise
                </a>
                in MEW and re-stake via one of our staking partners - Staked.us,
                for full validators staking, and Coinbase, for staking any
                amount with no minimum.
              </li>
              <li class="mb-2">
                Connect your wallet to the
                <a href="https://app.stakewise.io/" target="_blank"
                  >Stakewise web app</a
                >
                to view and continue managing your stake there.
              </li>
            </ul>
          </div>

          <!-- ======================================================================================= -->
          <!-- Divier -->
          <!-- ======================================================================================= -->
          <v-divider class="mt-9 mb-8" />
          <v-row>
            <v-col cols="6">
              <stakewise-staking
                class="mb-4"
                :tx-fee="txFee"
                :has-enough-balance="hasEnoughBalance"
                @set-max="setMax"
                @scroll="scroll"
                @redeem-to-eth="redeemToEth"
              />
            </v-col>
            <v-col cols="6">
              <stakewise-rewards
                v-if="isEthNetwork"
                :tx-fee="txFee"
                @set-max="setMax"
                @scroll="scroll"
                @redeem-to-eth="redeemToEth"
              />
            </v-col>
          </v-row>
        </mew-sheet>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import handlerAnalytics from '@/modules/analytics-opt-in/handlers/handlerAnalytics.mixin';
import { fromWei } from 'web3-utils';
import { mapActions, mapGetters, mapState } from 'vuex';
import BigNumber from 'bignumber.js';
import { debounce, isEmpty, clone, find } from 'lodash';

import buyMore from '@/core/mixins/buyMore.mixin.js';
import { formatFloatingPointValue } from '@/core/helpers/numberFormatHelper';
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

import stakeHandler from '../handlers/stakewiseStakeHandler';
import Swapper from '@/modules/swap/handlers/handlerSwap';

const MIN_GAS_LIMIT = 150000;
export default {
  name: 'ModuleStakewiseStake',
  components: {
    StakewiseStaking: () => import('../components/StakewiseStaking'),
    StakewiseRewards: () => import('../components/StakewiseRewards')
  },
  mixins: [buyMore, handlerAnalytics],
  data() {
    return {
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
    ...mapGetters('global', [
      'network',
      'isEthNetwork',
      'gasPriceByType',
      'getFiatValue'
    ]),
    ...mapGetters('external', ['fiatValue']),
    ...mapState('stakewise', ['validatorApr']),
    ...mapState('global', ['gasPriceType']),
    ...mapState('wallet', ['web3', 'address', 'instance']),
    ...mapState('stakewise', ['sethBalance', 'rethBalance']),
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
    hasEnoughBalanceToStake() {
      return BigNumber(this.ethTotalFee)
        .plus(this.stakeAmount)
        .lte(this.balanceInETH);
    },
    hasEnoughBalance() {
      return BigNumber(this.ethTotalFee).lte(this.balanceInETH);
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
    web3() {
      this.setup();
      this.setGasPrice();
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
    ...mapActions('global', ['updateGasPrice']),
    setAmount: debounce(function (val) {
      const value = val ? val : 0;
      this.stakeAmount = BigNumber(value).toFixed();
    }, 500),
    setup() {
      this.stakeAmount = '0';
      this.stakeHandler = {};
      this.stakeHandler = new stakeHandler(
        this.web3,
        this.isEthNetwork,
        this.address
      );
    },
    setGasPrice() {
      this.updateGasPrice().then(() => {
        this.locGasPrice = this.gasPriceByType(this.gasPriceType);
      });
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
    executeTrade(type) {
      const currentTradeCopy = clone(this.currentTrade);
      try {
        this.loading = false;
        this.swapper
          .executeTrade(this.currentTrade, this.confirmInfo)
          .then(res => {
            this.swapNotificationFormatter(res, currentTradeCopy);
          })
          .then(() => {
            this.trackDapp(
              `stakewiseRedeem${type === 'seth' ? 'Seth' : 'Reth'}Fail`
            );
            this.setAmount(0);
            this.compoundAmount = '0';
            this.locGasPrice = this.gasPriceByType(this.gasPriceType);
            this.gasLimit = '21000';
            this.agreeToTerms = false;
          })
          .catch(err => {
            this.trackDapp(
              `stakewiseRedeem${type === 'seth' ? 'Seth' : 'Reth'}Success`
            );
            this.loading = false;
            Toast(err.message, {}, ERROR);
          });
      } catch (err) {
        this.loading = false;
        this.instance.errorHandler(err.message, {}, ERROR);
        this.trackDapp(
          `stakewiseRedeem${type === 'seth' ? 'Seth' : 'Reth'}Fail`
        );
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
      this.trackDapp(`stakewiseRedeem${type === 'seth' ? 'Seth' : 'Reth'}`);
      await this.getQuote(eth, ETH_Token, balance);
      try {
        this.loading = true;
        await this.getTrade(eth, ETH_Token, type);
        this.confirmInfo = {
          from: eth.contract,
          to: ETH_Token.contract,
          fromType: eth.symbol,
          toType: ETH_Token.symbol,
          toTokenType: {
            isEth: true
          },
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
        await this.executeTrade(type);
      } catch (err) {
        this.loading = false;
        this.instance.errorHandler(err.message, {}, ERROR);
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
