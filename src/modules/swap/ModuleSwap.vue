<template>
  <div class="mew-component--swap">
    <swap-network-settings-modal
      :open-settings="openSettings"
      :close="closeGasPrice"
      :gas-price-modal="gasPriceModal"
    />
    <swap-confirmation-modal
      :to="confirmInfo.to"
      :from="confirmInfo.from"
      :from-img="confirmInfo.fromImg"
      :from-type="confirmInfo.fromType"
      :to-type="confirmInfo.toType"
      :to-img="confirmInfo.toImg"
      :show="confirmInfo.show"
      :from-val="confirmInfo.fromVal"
      :to-val="confirmInfo.toVal"
      :send="executeTrade"
      :provider="selectedProvider"
      :tx-fee="totalFees"
      :close="closeSwapConfirmation"
    />

    <mew6-white-sheet>
      <mew-module
        :has-elevation="true"
        :has-indicator="true"
        class="d-flex flex-grow-1 pt-6"
        title="Swap"
      >
        <template #moduleBody>
          <!--
            =====================================================================================
              From / Amount to Swap / To / Amount to Recieve
            =====================================================================================
            -->
          <v-row class="align-center justify-space-between">
            <v-col cols="12">
              <v-skeleton-loader v-if="isLoading" type="text" width="375px" />
              <div v-else class="available-balance text-right">
                {{ availableBalanceHint }}
              </div>
            </v-col>
            <v-col cols="12" sm="5" class="pb-0 pb-sm-3">
              <mew-select
                :value="fromTokenType"
                :items="fromTokens"
                label="From"
                @input="setFromToken" />
              <mew-input
                label="amount to swap"
                placeholder="Enter amount to swap"
                :value="tokenInValue"
                type="number"
                :persistent-hint="true"
                :error-messages="amountErrorMessage"
                :disabled="initialLoad"
                @input="setTokenInValue"
            /></v-col>

            <v-col cols="12" sm="2" class="pt-0 pt-sm-3">
              <div class="d-flex align-center justify-center">
                <img :src="swapIcon" height="35" />
              </div>
            </v-col>
            <v-col cols="12" sm="5">
              <mew-select
                ref="toToken"
                :value="toTokenType"
                :items="toTokens"
                label="To"
                @input="setToToken"
              />
              <mew-input
                label="you'll receive"
                placeholder=""
                type="number"
                disabled
                :value="tokenOutValue"
              />
            </v-col>
          </v-row>
          <!--
            =====================================================================================
              Address Book
            =====================================================================================
            -->
          <module-address-book
            v-show="showToAddress"
            :is-valid-address-func="isValidToAddress"
            @setAddress="setToAddress"
          />
          <!--
            =====================================================================================
             BTC options
            =====================================================================================
            -->
          <div v-if="isToBtc" class="pa-6 wrapped-btc-text">
            <p class="mew-heading-3">
              <v-icon class="icon" size="20" color="#0B2840">
                mdi-information-outline</v-icon
              >Did you know? You can store your Bitcoin on Ethereum
            </p>
            <p>
              To swap to BTC you need a Bitcoin wallet, but you can swap to
              wrapped Bitcoin instead and store it in your Ethereum wallet.
            </p>
            <v-divider />
            <v-expansion-panels flat>
              <v-expansion-panel>
                <v-expansion-panel-header color="transparent">
                  How can I get wrapped Bitcoin?
                </v-expansion-panel-header>
                <v-expansion-panel-content color="transparent">
                  <div>
                    <p>
                      When you swap to Bitcoin, it is moved to the Bitcoin
                      blockchain, & requires a Bitcoin wallet. In order to keep
                      Bitcoin in MyEtherWallet, you can swap to
                      <span class="font-italic">wrapped</span> Bitcoin instead.
                      Wrapped Bitcoin is an Ethereum token, with a value
                      approximately equal to 1 BTC. Wrapped Bitcoins can be
                      stored in MEW, and can be used as any other Ethereum
                      asset: you can swap it to oether tokens, use it as
                      collateral in DeFi apps, etc. There are multiple kinds of
                      wrapped Bitcoins, but they roughly do the same thing.
                      <a target="_blank" rel="noopener noreferrer"
                        >Learn more about Wrapped Bitcoin.</a
                      >
                    </p>
                    <div class="d-flex align-center">
                      <mew-button
                        v-for="btn in wrappedBtc"
                        :key="btn"
                        class="px-2 mx-1"
                        :title="`Swap to ${btn}`"
                        color-theme="primary"
                        :has-full-width="false"
                        btn-size="xlarge"
                        btn-style="outline"
                        @click.native="setWrappedBtc(btn)"
                      />
                    </div>
                  </div>
                </v-expansion-panel-content>
              </v-expansion-panel>
            </v-expansion-panels>
          </div>
          <!--
            =====================================================================================
             Providers List
            =====================================================================================
            -->
          <swap-providers-list
            :step="step"
            :available-quotes="availableQuotes"
            :set-provider="setProvider"
            :to-token-symbol="toTokenType.symbol"
            :to-token-icon="toTokenType.img"
            :message="providersMessage"
          />
          <!--
            =====================================================================================
             Swap Fee
            =====================================================================================
          -->
          <swap-fee
            v-if="!hasAmountErrors && step > 0"
            :show-fee="showSwapFee"
            :getting-fee="loadingFee"
            :error="feeError"
            :total-fees="totalFees"
            :open-gas-price-modal="openGasPriceModal"
          />
          <div class="text-center">
            <mew-button
              title="Swap"
              :has-full-width="false"
              :disabled="step < 2 || feeError != ''"
              btn-size="xlarge"
              @click.native="showConfirm()"
            />
          </div>
        </template>
      </mew-module>
    </mew6-white-sheet>
  </div>
</template>

<script>
import ModuleAddressBook from '@/modules/address-book/ModuleAddressBook';
import SwapIcon from '@/assets/images/icons/icon-swap.svg';
import SwapProvidersList from './components/SwapProvidersList.vue';
import SwapFee from './components/SwapFee.vue';
import SwapNetworkSettingsModal from './components/SwapNetworkSettingsModal.vue';
import SwapConfirmationModal from './components/SwapConfirmationModal.vue';
import Swapper from './handlers/handlerSwap';
import { toBN, fromWei, toWei, _ } from 'web3-utils';
import { mapGetters, mapState, mapActions } from 'vuex';
import Notification from '@/modules/notifications/handlers/handlerNotification';
import BigNumber from 'bignumber.js';
import { EventBus } from '@/core/plugins/eventBus';
const ETH_TOKEN = '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee';
const DAI_TOKEN = '0x6b175474e89094c44da98b954eedeac495271d0f';
const MIN_GAS_WEI = '800000000000000';
export default {
  name: 'ModuleSwap',
  components: {
    ModuleAddressBook,
    SwapProvidersList,
    SwapFee,
    SwapNetworkSettingsModal,
    SwapConfirmationModal
  },
  props: {
    fromToken: {
      type: String,
      default: ETH_TOKEN
    },
    toToken: {
      type: String,
      default: DAI_TOKEN
    },
    amount: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      step: 0,
      confirmInfo: {
        to: '',
        from: '',
        fromImg: '',
        toImg: '',
        fromType: '',
        toType: '',
        validUntil: 0,
        show: false
      },
      wrappedBtc: ['renBTC', 'wBTC', 'PBTC'],
      swapper: null,
      toTokenType: {},
      fromTokenType: {},
      tokenInValue: this.amount,
      tokenOutValue: null,
      availableTokens: [],
      availableQuotes: [],
      currentTrade: null,
      allTrades: [],
      isLoading: false,
      loadingFee: false,
      feeError: '',
      defaults: {
        fromToken: this.fromToken
      },
      exPannel: [
        {
          name: 'Transaction Fee',
          subtext: '$0.00',
          tooltip:
            'Transaction fee is automatically calculated. If you want to customize the Transaction fee, you can do it here.'
        }
      ],
      swapIcon: SwapIcon,
      fromTokens: [],
      toTokens: [],
      providersMessage: {
        title: 'Loading Tokens Data',
        subtitle: ''
      },
      addressValue: {},
      gasPriceModal: false,
      selectedProvider: {}
    };
  },
  computed: {
    ...mapState('wallet', ['web3', 'address', 'balance']),
    ...mapGetters('global', ['network', 'gasPrice']),
    ...mapGetters('wallet', ['balanceInETH', 'tokensList', 'initialLoad']),
    totalFees() {
      return toBN(this.totalGasLimit).mul(toBN(this.gasPrice)).toString();
    },
    totalGasLimit() {
      if (this.currentTrade) {
        let totalGas = toBN(0);
        this.currentTrade.transactions.forEach(tx => {
          totalGas = totalGas.add(toBN(tx.gas));
        });
        return totalGas.toString();
      }
      return '0';
    },
    toAddress() {
      if (this.toTokenType.isEth) return this.address;
      return this.addressValue.value;
    },
    isToAddressValid() {
      if (this.toTokenType.isEth) return true;
      return this.addressValue.isValid;
    },
    /**
     * Checks whether the swap is to BTC
     */
    isToBtc() {
      return (
        this.fromTokenType.symbol === this.network.type.currencyName &&
        this.toTokenType.symbol === 'BTC'
      );
    },
    showToAddress() {
      if (typeof this.toTokenType.isEth === 'undefined') return false;
      return !this.toTokenType.isEth;
    },
    /**
     * @returns BigNumber of the available balance for the From Token
     */
    availableBalance() {
      if (!this.initialLoad && this.fromTokenType.value) {
        if (this.fromTokenType.value !== 'Ethereum') {
          const hasBalance = this.tokensList.find(
            token => token.symbol === this.fromTokenType.symbol
          );
          return hasBalance && hasBalance.balance && hasBalance.decimals
            ? this.getTokenBalance(hasBalance.balance, hasBalance.decimals)
            : new BigNumber(0);
        }
        return BigNumber.max(
          new BigNumber(this.balanceInETH).minus(fromWei(MIN_GAS_WEI)),
          0
        );
      }
      return new BigNumber(0);
    },
    /**
     * @return string for the available balance
     * Used in hint for the From token amount
     * Amount is rounded
     */
    availableBalanceHint() {
      if (!this.initialLoad && this.fromTokenType.value) {
        return `${this.availableBalance.toFixed()} ${
          this.fromTokenType.symbol
        }`;
      }
      return '';
    },

    /**
     * Determines whether or not to show swap fee panel
     * Fee is shown if provider was selected and no errors are passed
     */
    showSwapFee() {
      return (
        this.step >= 2 && this.availableBalance.gt(0) && this.feeError === ''
      );
    },

    /**
     * Return true Input Amount Error or input is empty
     * Used to determine whether or not to fetch provider's list and show transaction fee
     */
    hasAmountErrors() {
      return (
        !this.tokenInValue ||
        this.amountErrorMessage !== '' ||
        this.tokenInValue === ''
      );
    },
    /**
     * Method validates input for the From token amount against user input
     * Used to show error messages for the amount input component
     */
    amountErrorMessage() {
      if (!this.initialLoad && !this.isLoading) {
        if (this.availableBalance.lte(0)) {
          return this.fromTokenType.value === 'Ethereum'
            ? 'your available ETH balance is 0'
            : 'you do not own this token';
        }
        if (
          this.fromTokenType.value !== 'Ethereum' &&
          this.availableBalance.lte(fromWei(MIN_GAS_WEI))
        ) {
          return 'you do not have enough ETH to cover transaction fee for a swap';
        }
        if (this.tokenInValue && this.tokenInValue !== '') {
          if (new BigNumber(this.tokenInValue).eq(0)) {
            return `swap amount must be greater than 0`;
          }
          if (this.availableBalance.lt(new BigNumber(this.tokenInValue))) {
            return `your balance is lower (${this.availableBalanceHint})`;
          }
        }
      }
      return '';
    }
  },
  watch: {
    totalFees: {
      handler: function () {
        this.checkFeeBalance();
      },
      immediate: true
    },
    defaults: {
      handler: function () {
        this.setDefaults();
      },
      deep: true,
      immediate: true
    }
  },
  beforeMount() {
    if (Object.keys(this.$route.query).length > 0) {
      const { fromToken, toToken, amount } = this.$route.query;
      this.defaults = {
        fromToken,
        toToken
      };
      this.tokenInValue = `${amount}`;
    }
  },
  mounted() {
    this.isLoading = true;
    this.swapper = new Swapper(this.web3);
    this.swapper
      .getAllTokens()
      .then(tokens => {
        this.availableTokens = tokens;
        /* Add Correct Values for the MewSelect*/
        this.availableTokens.toTokens.forEach(token => {
          token.subtext = token.symbol;
          token.value = token.name;
        });
        this.availableTokens.fromTokens.forEach(token => {
          token.subtext = token.symbol;
          token.value = token.name;
        });
      })
      .then(() => {
        this.setDefaults();
        this.isLoading = false;
      });
  },
  methods: {
    ...mapActions('notifications', ['addNotification']),
    openGasPriceModal() {
      this.gasPriceModal = true;
    },
    getTokenFromAddress(address) {
      if (!this.availableTokens.toTokens) return {};
      for (const t of this.availableTokens.toTokens) {
        if (t.contract_address === address) return t;
      }
      return {};
    },
    setDefaults() {
      this.fromTokens = this.availableTokens.fromTokens;
      this.toTokens = this.availableTokens.toTokens;
      setImmediate(() => {
        this.fromTokenType = this.getTokenFromAddress(this.defaults.fromToken);
        this.toTokenType = this.getTokenFromAddress(this.defaults.toToken);
        this.setTokenInValue(this.tokenInValue);
      });
    },
    setToAddress(value, isValid) {
      this.addressValue = {
        value,
        isValid
      };
    },
    setFromToken(value) {
      this.fromTokenType = value;
      this.setTokenInValue(this.tokenInValue);
    },
    setToToken(value) {
      this.toTokenType = value;
      this.setTokenInValue(this.tokenInValue);
    },
    setTokenInValue: _.debounce(function (value) {
      if (this.isLoading || this.initialLoad) return;
      this.tokenInValue = value;
      this.availableQuotes.forEach(q => {
        q.isSelected = false;
      });
      this.availableQuotes = [];
      this.allTrades = [];
      this.step = 0;
      if (
        !value ||
        this.hasAmountErrors ||
        this.fromTokenType.value === this.toTokenType.value
      ) {
        this.providersMessage = {
          title: 'Select token and enter amount to see rates',
          subtitle:
            'MEW finds the best price for you across multiple Dexs and Exchange services.'
        };
        return;
      }
      if (
        value ||
        !this.hasAmountErrors ||
        this.fromTokenType.value !== this.toTokenType.value
      ) {
        this.providersMessage = {
          title: '',
          subtitle: ''
        };
      }

      this.feeError = '';
      this.swapper
        .getAllQuotes({
          fromT: this.fromTokenType,
          toT: this.toTokenType,
          fromAmount: new BigNumber(this.tokenInValue).times(
            new BigNumber(10).pow(new BigNumber(this.fromTokenType.decimals))
          )
        })
        .then(quotes => {
          quotes = quotes.map(q => {
            q.rate = new BigNumber(q.amount)
              .dividedBy(new BigNumber(this.tokenInValue))
              .toString();
            q.isSelected = false;
            return q;
          });
          this.availableQuotes = quotes;
          if (quotes.length) {
            this.tokenOutValue = quotes[0].amount;
            this.step = 1;
          } else {
            this.providersMessage = {
              title:
                'There are no available Providers at this time, please try another pair.',
              subtitle: ''
            };
          }
        });
    }, 500),
    setProvider(idx) {
      this.availableQuotes.forEach((q, _idx) => {
        if (_idx === idx) {
          q.isSelected = event;
          this.tokenOutValue = q.amount;
          this.getTrade(idx);
          this.selectedProvider = q;
        }
      });
    },
    getTrade: _.debounce(function (idx) {
      if (!this.isToAddressValid) return;
      this.step = 1;
      this.feeError = '';
      if (this.allTrades[idx]) {
        this.currentTrade = this.allTrades[idx];
        this.exPannel[0].subtext = `${fromWei(this.totalFees)} ${
          this.network.type.name
        }`;
        this.step = 2;
        this.checkFeeBalance();
        return;
      }
      this.loadingFee = true;

      this.swapper
        .getTrade({
          fromAddress: this.address,
          toAddress: this.toAddress,
          provider: this.availableQuotes[idx].provider,
          fromT: this.fromTokenType,
          toT: this.toTokenType,
          quote: this.availableQuotes[idx],
          fromAmount: new BigNumber(this.tokenInValue).times(
            new BigNumber(10).pow(new BigNumber(this.fromTokenType.decimals))
          )
        })
        .then(trade => {
          this.currentTrade = trade;
          this.exPannel[0].subtext = `${fromWei(this.totalFees)} ${
            this.network.type.name
          }`;
          this.allTrades[idx] = trade;
          this.step = 2;
          this.loadingFee = false;
          this.checkFeeBalance();
        })
        .catch(e => {
          if (e) {
            this.feeError = 'This provider is not available.';
          }
        });
    }, 500),
    showConfirm() {
      this.confirmInfo = {
        from: this.address,
        to: this.toAddress,
        fromType: this.fromTokenType.symbol,
        toType: this.toTokenType.symbol,
        fromImg: this.fromTokenType.img,
        toImg: this.toTokenType.img,
        fromVal: this.tokenInValue,
        toVal: this.tokenOutValue,
        validUntil: new Date().getTime() + 10 * 60 * 1000,
        show: true
      };
    },
    isValidToAddress(address) {
      return this.swapper.isValidToAddress({
        provider: this.availableQuotes[0].provider,
        toT: this.toTokenType,
        address
      });
    },

    executeTrade() {
      this.confirmInfo.show = false;
      this.swapper
        .executeTrade(this.currentTrade)
        .then(res => {
          this.swapNotificationFormatter(res);
        })
        .catch(err => {
          this.swapNotificationFormatter(err, true);
        });
    },
    getTokenBalance(balance, decimals) {
      return new BigNumber(balance.toString()).div(
        new BigNumber(10).pow(decimals)
      );
    },
    swapNotificationFormatter(obj, isError) {
      obj.hashes.forEach((hash, idx) => {
        const notification = {
          transactionHash: !isError ? hash : '',
          transactionFee: fromWei(this.totalFees),
          to: this.currentTrade.transactions[idx].to,
          from: this.confirmInfo.from,
          gas: this.currentTrade.transactions[idx].gas,
          gasPrice: this.currentTrade.transactions[idx].gasPrice,
          gasLimit: this.totalGasLimit,
          data: this.currentTrade.transactions[idx].data,
          value: this.currentTrade.transactions[idx].value,
          type: 'SWAP',
          read: false,
          network: this.network.type.name,
          date: new Date().getTime(),
          status: isError ? 'FAILED' : 'PENDING',
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
              : this.currentTrade.transactions[idx].to
          },
          swapObj: obj,
          errMessage: isError ? hash : ''
        };
        this.addNotification(new Notification(notification));
      });
    },
    checkFeeBalance() {
      this.feeError = '';
      const balanceAfterFees = toBN(this.balance).sub(toBN(this.totalFees));
      const isNotEnoughEth =
        this.fromTokenType.value === 'Ethereum'
          ? balanceAfterFees.sub(toBN(toWei(this.tokenInValue))).isNeg()
          : balanceAfterFees.isNeg();
      if (isNotEnoughEth) {
        const message = `This provider  transaction fee is ${this.exPannel[0].subtext}, which exceed's your ${this.balanceInETH} ETH wallet balance.`;
        const ethError = `${message} Try to swap a smaller ETH amount to use this provider.`;
        this.feeError =
          this.fromTokenType.value === 'Ethereum' ? ethError : message;
      }
    },
    openSettings() {
      EventBus.$emit('toggleSettings');
      this.gasPriceModal = false;
    },
    closeGasPrice() {
      this.gasPriceModal = false;
    },
    closeSwapConfirmation() {
      this.confirmInfo.show = false;
    },
    setWrappedBtc(symbol) {
      const foundToken = this.toTokens.find(
        item => item.symbol.toLowerCase() === symbol.toLowerCase()
      );
      this.setToToken(foundToken);
    }
  }
};
</script>

<style lang="scss" scoped>
.v-input--selection-controls {
  padding: 0;
  margin: 0;
}

.invert {
  filter: invert(100%);
}

.border-radius--10px::before {
  border-radius: 10px !important;
}

.available-balance {
  width: 39%;
}

.icon {
  margin-right: 6px;
}

.wrapped-btc-text {
  border-radius: 5px;
  background-color: var(--v-selectorBg-lighten1);
}
</style>

<style lang="scss">
.mew-component--swap {
  width: 100%;
  .swap-expend {
    .v-application .white {
      background-color: transparent !important;
    }
  }
  .v-skeleton-loader__chip {
    width: 100% !important;
  }
}

.wrapped-btc-text {
  .v-expansion-panel-content__wrap {
    padding: 0 !important;
  }

  .v-expansion-panel,
  .v-expansion-panels {
    background-color: transparent !important;
  }

  .v-expansion-panel-header {
    padding: 16px 0px !important;
  }
}
</style>
