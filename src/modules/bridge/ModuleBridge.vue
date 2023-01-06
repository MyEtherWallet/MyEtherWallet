<template>
  <div class="mew-component--bridge">
    <mew6-white-sheet>
      <mew-module
        :has-elevation="true"
        class="d-flex flex-grow-1"
        title="Bridge"
        title-size="mew-heading-1"
      >
        <template v-if="isAvailable" #moduleBody>
          <mew-popup
            :show="isOpenNetworkOverlay"
            title="Select Network"
            content-size="large"
            :close="closeNetworkOverlay"
            has-body-content
            :has-buttons="false"
            :left-btn="leftBtn"
            hide-close-btn
            :large-title="true"
          >
            <network-switch
              :filter-types="filterNetworks"
              :is-bridge-select="true"
              @selectedNetwork="setSelectedNetwork"
            />
          </mew-popup>
          <!--
            =====================================================================================
              From Network / To Network selection
            =====================================================================================
            -->
          <div class="d-flex network-container">
            <div class="network-selection pa-3" @click="openNetworkOverlay">
              <img
                :alt="`${networkName}-icon`"
                :src="networkImage"
                class="network-icon mr-2"
              />
              <div class="mr-4" style="height: 32px">
                <div class="network-select-label">From</div>
                <div class="network-label">{{ network.type.name_long }}</div>
              </div>
              <v-icon class="expand-button">mdi-chevron-down</v-icon>
            </div>
            <div
              class="d-flex ma-2 cursor-pointer switch-button"
              @click="switchNetworks"
            >
              <img
                :src="switchNetworkIcon"
                alt="switch-icon"
                height="24"
                class="align-self-center"
              />
            </div>
            <div
              class="network-selection pa-3 to-network"
              @click="openNetworkOverlay(true)"
            >
              <img
                v-if="selectedNetwork.icon"
                :alt="`${selectedNetwork.name}-icon`"
                :src="selectedNetwork.icon"
                class="network-icon mr-2"
              />
              <div class="mr-4" style="height: 32px">
                <div class="network-select-label">To</div>
                <div class="network-label">{{ selectedNetwork.name_long }}</div>
              </div>
              <v-icon class="expand-button">mdi-chevron-down</v-icon>
            </div>
          </div>

          <!--
            =====================================================================================
              From / Amount to Bridge / To / Amount to Recieve
            =====================================================================================
            -->
          <div class="d-flex token-container to mt-10">
            <v-row class="align-start justify-space-between">
              <div class="token-label pa-3">You Give</div>
            </v-row>
            <v-row class="align-start justify-space-between">
              <div class="token-row">
                <div class="d-flex cursor-pointer">
                  <div class="token-name">{{ fromTokenName }}</div>
                  <img
                    class="dropdown-arrow"
                    alt="dropdown-arrow"
                    :src="dropdownArrowIcon"
                  />
                </div>
                <div class="token-amount">0</div>
              </div>
            </v-row>
            <v-row class="align-start justify-space-between">
              <div class="balance-row">
                <div class="balance-text">Max: 0</div>
                <div class="balance-value">$0</div>
              </div>
            </v-row>
          </div>

          <div class="d-flex token-container from">
            <div class="token-label">You Recieve</div>
            <div class="token-row">
              <div class="d-flex cursor-pointer">
                <div class="token-name">{{ toTokenName }}</div>
                <img
                  class="dropdown-arrow"
                  alt="dropdown-arrow"
                  :src="dropdownArrowIcon"
                />
              </div>
              <div class="token-amount">0</div>
            </div>
            <div class="balance-row">
              <div class="balance-text">Balance: 0</div>
              <div class="balance-value">$0</div>
            </div>
          </div>

          <!--
            =====================================================================================
              Address Book
            =====================================================================================
            -->
          <div class="mt-8">
            <module-address-book
              v-show="showToAddress"
              ref="toAddressInput"
              class="ToAddressInput"
              :is-valid-address-func="isValidToAddress"
              :label="toAddressLabel"
              @setAddress="setToAddress"
            />
          </div>

          <!--
            =====================================================================================
             Providers List
            =====================================================================================
            -->
          <div v-if="hasMinEth">
            <!--
                  =====================================================================================
                  Bridge Fee
                  =====================================================================================
                -->
            <app-transaction-fee
              v-if="showNetworkFee"
              :is-from-chain="!isFromNonChain"
              :show-fee="showBridgeFee"
              :getting-fee="loadingFee"
              :error="feeError"
              :total-cost="totalCost"
              :tx-fee="txFee"
              :total-gas-limit="totalGasLimit"
              :not-enough-eth="notEnoughEth"
              :from-eth="isFromTokenMain"
              is-swap
              class="mt-10 mt-sm-16"
              @onLocalGasPrice="handleLocalGasPrice"
            />
            <div class="text-center mt-10 mt-sm-15">
              <mew-button
                v-if="showNextButton"
                title="Proceed"
                :has-full-width="true"
                :disabled="disableNext"
                btn-size="xlarge"
                class="NextButton"
                @click.native="showConfirm()"
              />
            </div>
          </div>
        </template>
        <!--
          =====================================================================================
           Message is BRIDGE NOT Available
          =====================================================================================
        -->
        <template v-else #moduleBody>
          <div class="bridge-not-available">
            <app-user-msg-block :message="bridgeNotAvailableMes" />
          </div>
        </template>
      </mew-module>
    </mew6-white-sheet>
  </div>
</template>

<script>
import { toBN, toWei } from 'web3-utils';
import {
  // debounce,
  isEmpty,
  clone,
  // isUndefined,
  isObject,
  isNumber
} from 'lodash';
import { mapGetters, mapState, mapActions } from 'vuex';
import MultiCoinValidator from 'multicoin-address-validator';
import BigNumber from 'bignumber.js';

import Notification, {
  NOTIFICATION_TYPES,
  NOTIFICATION_STATUS
} from '@/modules/notifications/handlers/handlerNotification';
import { Toast, ERROR } from '@/modules/toast/handler/handlerToast';
import { MAIN_TOKEN_ADDRESS } from '@/core/helpers/common';
import handlerAnalytics from '@/modules/analytics-opt-in/handlers/handlerAnalytics.mixin';
import buyMore from '@/core/mixins/buyMore.mixin.js';
import handleError from '../confirmation/handlers/errorHandler';
import { EventBus } from '@/core/plugins/eventBus';
import * as types from '@/utils/networks/types';

const MIN_GAS_LIMIT = 800000;
let localContractToToken = {};
// Hardcoded for now
const wrappedTokens = {
  ETH: {
    MATIC: '0x7d1afa7b718fb893db30a3abc0cfc608aacfebb0',
    BNB: '0xb8c77482e45f1f44de1745f52c74426c631bdd52'
  },
  BSC: {
    ETH: '0x2170ed0880ac9a755fd29b2688956bd959f933f8',
    MATIC: '0xcc42724c6683b7e57334c4e856f4c9965ed682bd'
  },
  MATIC: {
    ETH: '0x7ceb23fd6bc0add59e62ac25578270cff1b9f619',
    BNB: ''
  }
};
export default {
  name: 'ModuleBridge',
  components: {
    // AppButtonBalance: () => import('@/core/components/AppButtonBalance'),
    // AppUserMsgBlock: () => import('@/core/components/AppUserMsgBlock'),
    ModuleAddressBook: () => import('@/modules/address-book/ModuleAddressBook'),
    AppTransactionFee: () => import('@/core/components/AppTransactionFee.vue'),
    NetworkSwitch: () =>
      import('@/modules/network/components/NetworkSwitch.vue')
  },
  mixins: [handlerAnalytics, buyMore],
  props: {
    fromToken: {
      type: String,
      default: MAIN_TOKEN_ADDRESS
    },
    amount: {
      type: String,
      default: '0'
    },
    isAvailable: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      bridgeNotAvailableMes: {
        title: `Bridge is not available on this network`,
        subtitle:
          'Please select ETH, BNB or MATIC networks to use this feature.'
      },
      selectedNetwork: { name_long: 'Select Network' },
      step: 0,
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
      },
      toTokenType: {},
      fromTokenType: {},
      tokenInValue: this.amount || '0',
      tokenOutValue: '0',
      availableTokens: { toTokens: [], fromTokens: [] },
      availableQuotes: [],
      currentTrade: null,
      allTrades: [],
      isLoading: true,
      loadingFee: false,
      feeError: '',
      defaults: {
        fromToken: this.fromToken
      },
      isLoadingProviders: false,
      showAnimation: false,
      checkLoading: true,
      addressValue: {},
      selectedProvider: {},
      refundAddress: '',
      isValidRefundAddr: false,
      localGasPrice: '0',
      mainTokenDetails: {},
      cachedAmount: '0',
      selectedProviderId: undefined,
      isOpenNetworkOverlay: false
    };
  },
  computed: {
    ...mapState('swap', ['prefetched', 'swapTokens']),
    ...mapState('wallet', ['web3', 'address', 'balance', 'identifier']),
    ...mapState('global', ['gasPriceType']),
    ...mapState('external', ['coinGeckoTokens']),
    ...mapGetters('global', [
      'network',
      'isEthNetwork',
      'gasPriceByType',
      'getFiatValue'
    ]),
    ...mapGetters('wallet', [
      'balanceInETH',
      'tokensList',
      'initialLoad',
      'balanceInWei'
    ]),
    ...mapGetters('external', [
      'balanceFiatValue',
      'contractToToken',
      'getCoinGeckoTokenById'
    ]),
    ...mapGetters('article', ['getArticle']),
    /**
     * @returns a boolean
     * based on how the bridge state is
     */
    showNetworkFee() {
      return this.showNextButton;
    },
    /**
     * @returns a boolean
     * based on how the bridge state is
     */
    showNextButton() {
      return (
        this.step > 0 &&
        this.providersErrorMsg.subtitle === '' &&
        !this.isLoadingProviders
      );
    },
    networkImage() {
      return this.network.type.icon;
    },
    networkName() {
      return this.network.type.name;
    },
    switchNetworkIcon() {
      return require('@/assets/images/icons/icon-swap-new.svg');
    },
    leftBtn() {
      return {
        title: '',
        color: 'primary',
        method: this.closeNetworkOverlay
      };
    },
    filterNetworks() {
      let filteredNetworks = Object.keys(types);
      filteredNetworks = filteredNetworks.filter(item => {
        return (
          item !== this.network.type.name &&
          (item === 'ETH' || item === 'BSC' || item === 'MATIC')
        );
      });
      return filteredNetworks;
    },
    dropdownArrowIcon() {
      return require('@/assets/images/icons/icon-arrow-dropdown.svg');
    },
    /**
     * @returns an object
     * if native token, return empty
     */
    // maxBtn() {
    //   return this.availableBalance.isZero()
    //     ? {}
    //     : {
    //         title: 'Max',
    //         disabled:
    //           !this.hasMinEth &&
    //           this.amountErrorMessage === this.errorMsgs.amountEthIsTooLow,
    //         method: this.setMaxAmount
    //       };
    // },
    /**
     *Returns errors messages based on network
     */
    errorMsgs() {
      return {
        amountEthIsTooLow: `You do not have enough ${this.network.type.currencyName} to bridge.`,
        amountExceedsEthBalance: `Amount exceeds your ${this.network.type.currencyName} balance.`,
        amountExceedsTxFee: `Amount entered doesn't allow for transaction fee`,
        amountLessThan0: 'Bridge amount must be greater than 0',
        doNotOwnToken: 'You do not own this token'
      };
    },
    /**
     * Property returns correct mes
     */
    // msg() {
    //   return {
    //     lowBalance: {
    //       title: `Your ${this.network.type.currencyName} balance is too low`,
    //       subtitle: `Every transaction requires a small amount of ${this.network.type.currencyName} to execute. Even if you have tokens to bridge, when your ${this.network.type.currencyName} balance is close to zero, you won't be able to send anything until you fund your account.`
    //     }
    //   };
    // },
    disableNext() {
      const disableSet =
        this.step < 2 ||
        this.amountErrorMessage !== '' ||
        this.feeError !== '' ||
        !this.hasSelectedProvider ||
        this.providersErrorMsg.subtitle !== '' ||
        this.loadingFee;
      if (this.fromTokenType?.isEth) {
        return disableSet;
      }
      return (
        disableSet ||
        (!this.refundAddress &&
          !this.isValidRefundAddr &&
          this.actualTrade?.length === 0)
      );
    },
    providersErrorMsg() {
      let msg = '';
      let subError = '';
      if (!this.isLoading) {
        if (
          new BigNumber(this.tokenInValue).lt(this.selectedProvider.minFrom)
        ) {
          msg = 'The minimum requirement for this provider is';
          subError = `${this.selectedProvider.minFrom} ${this.fromTokenType?.symbol}`;
        } else if (
          new BigNumber(this.tokenInValue).gt(this.selectedProvider.maxFrom)
        ) {
          msg = 'The maximum requirement for this provider is';
          subError = `${this.selectedProvider.maxFrom} ${this.fromTokenType?.symbol}`;
        } else if (this.availableQuotes.length === 0) {
          msg =
            'No providers found for this token pair. Select a different token pair or try again later.';
        } else if (
          this.selectedProvider.rate === '0' ||
          this.feeError === 'Invalid Input'
        ) {
          msg =
            'Provided input is invalid or provider is having issues. Please try again!';
        }
      }
      return {
        subtitle: msg,
        subtitleError: subError
      };
    },
    /**
     * checks whether both token fields are empty
     */
    // enableTokenSwitch() {
    //   return (
    //     !this.isLoading &&
    //     ((!isEmpty(this.fromTokenType) &&
    //       !isEmpty(this.fromTokenType?.symbol)) ||
    //       (!isEmpty(this.toTokenType) && !isEmpty(this.toTokenType?.symbol)))
    //   );
    // },
    /**
     * Returns correct balance to be dispalyed above From Selection field
     */
    // displayBalance() {
    //   return this.availableBalance.toString();
    // },
    txFee() {
      return toBN(this.totalGasLimit).mul(toBN(this.localGasPrice)).toString();
    },
    totalCost() {
      const amount = this.isFromTokenMain ? this.tokenInValue : '0';
      const amountWei = toWei(amount);
      return BigNumber(this.txFee).plus(amountWei).toString();
    },
    totalGasLimit() {
      if (this.currentTrade) {
        let totalGas = toBN(0);
        this.currentTrade.transactions?.forEach(tx => {
          totalGas = totalGas.add(toBN(tx.gas));
        });
        return totalGas.toString();
      }
      return '0';
    },
    /**
     * check whether the to token is in ETH chain or not
     * also checks if the userAddress is not empty
     *
     * @returns {String} - Ethereum Address
     */
    toAddress() {
      if (!this.toTokenType?.isEth) {
        if (!isEmpty(this.addressValue)) {
          return this.addressValue.isValid
            ? this.addressValue.value
            : this.address;
        }
        return this.address;
      }

      if (this.toTokenType?.contract === MAIN_TOKEN_ADDRESS) {
        return this.address;
      }
      if (this.toTokenType?.isEth) return this.address;
      return this.address;
    },
    /**
     * Checks whether or not the user has a minimum eth balance to bridge:
     * @returns{boolean}
     */
    hasMinEth() {
      if (
        !isEmpty(this.fromTokenType) &&
        this.fromTokenType.hasOwnProperty('isEth') &&
        !this.fromTokenType.isEth
      ) {
        return true;
      }
      return toBN(this.balanceInWei).gte(
        toBN(this.localGasPrice).muln(MIN_GAS_LIMIT)
      );
    },

    /**
     * Checks whether the user has enough
     * balance for the transaction
     */
    notEnoughEth() {
      try {
        const balanceAfterFees = toBN(this.balance).sub(toBN(this.totalCost));
        return balanceAfterFees.isNeg();
      } catch (e) {
        return true;
      }
    },
    showToAddress() {
      if (typeof this.toTokenType?.isEth === 'undefined') return false;
      return !this.toTokenType?.isEth;
    },
    /**
     * @returns BigNumber of the available balance for the From Token
     */
    availableBalance() {
      if (!this.initialLoad && this.fromTokenType?.name) {
        const hasBalance = this.tokensList.find(
          token =>
            token.contract.toLowerCase() ===
            this.fromTokenType.contract.toLowerCase()
        );
        const tokenBalance =
          !isEmpty(hasBalance) &&
          !isEmpty(hasBalance.balance) &&
          hasBalance.hasOwnProperty('decimals')
            ? this.getTokenBalance(hasBalance.balance, hasBalance.decimals)
            : new BigNumber(0);
        return this.isFromTokenMain
          ? this.getTokenBalance(this.balanceInWei, 18)
          : tokenBalance;
      }

      return new BigNumber(0);
    },
    /**
     * Determines whether or not to show swap fee panel
     * Fee is shown if provider was selected and no errors are passed
     */
    showBridgeFee() {
      return this.step >= 2 && this.availableBalance.gt(0);
    },
    /**
     * Method validates input for the From token amount against user input
     * Used to show error messages for the amount input component
     */
    amountErrorMessage() {
      if (!this.initialLoad && !this.isLoading && this.fromTokenType?.name) {
        /* Balance is <= 0*/
        if (this.availableBalance.lte(0)) {
          return this.isFromTokenMain
            ? this.errorMsgs.amountEthIsTooLow
            : this.tokensList.length > 0
            ? this.errorMsgs.doNotOwnToken
            : new BigNumber(this.tokenInValue).lt(0)
            ? this.errorMsgs.amountLessThan0
            : '';
        }

        // TODO: Check if provided amount exceeds valid decimals

        /*Eth Balance is too low to send a transaction*/
        if (!this.hasMinEth) {
          return this.errorMsgs.amountEthIsTooLow;
        }
        if (this.tokenInValue && this.tokenInValue !== '') {
          /* Amount entered < 0 */
          if (new BigNumber(this.tokenInValue).lt(0)) {
            return this.errorMsgs.amountLessThan0;
          }
          /* ETH only: Amount entered > (ETH Balance - Gas Price )*/
          if (
            this.isFromTokenMain &&
            this.availableBalance.lt(new BigNumber(this.tokenInValue))
          ) {
            return this.errorMsgs.amountExceedsEthBalance;
          }
          /*ERC20 Only: Amount entered > Balance  */
          if (
            !this.isFromTokenMain &&
            this.availableBalance.lt(new BigNumber(this.tokenInValue))
          ) {
            return `Amount exceeds your ${this.fromTokenType.symbol} balance.`;
          }
          /* Changelly Errors: */

          if (
            new BigNumber(this.tokenInValue).lt(this.selectedProvider.minFrom)
          ) {
            return `Amount below ${this.selectedProvider.minFrom} ${this.fromTokenType.symbol} min`;
          }
          if (
            new BigNumber(this.tokenInValue).gt(this.selectedProvider.maxFrom)
          ) {
            return `Amount over ${this.selectedProvider.maxFrom} ${this.fromTokenType.symbol} max`;
          }
        }
      }
      return '';
    },
    /**
     * Checks whether or not there is a selected provider
     * @returns{boolean}
     */
    hasSelectedProvider() {
      return !isEmpty(this.selectedProvider);
    },
    toAddressLabel() {
      const name =
        !isEmpty(this.toTokenType) && this.toTokenType.hasOwnProperty('name')
          ? this.toTokenType.name
          : 'ETH';
      return `To ${name} address`;
    },
    networkAndWeb3() {
      return this.network, this.web3;
    },
    fromTokenName() {
      console.log('fromTokenType', this.fromTokenType);
      if (!this.fromTokenType) return 'Token';
      return `${this.fromTokenType.symbol}`;
    },
    toTokenName() {
      console.log('toTokenType', this.toTokenType);
      if (!this.toTokenType) return 'Token';
      return `${this.toTokenType.symbol}`;
    }
  },
  watch: {
    tokensList() {
      this.resetBridgeState();
    },
    coinGeckoTokens(newVal) {
      if (newVal.size > 0) {
        this.resetBridgeState();
      }
    },
    tokenInValue() {
      this.feeError = '';
      // this.trackSwap('tokenFromValueChanged');
    },
    gasPriceType() {
      if (this.currentTrade) this.currentTrade.gasPrice = this.localGasPrice;
    },
    txFee: {
      handler: function () {
        this.checkFeeBalance();
      },
      immediate: true
    },
    selectedProvider(p, oldVal) {
      if (!isEmpty(oldVal)) {
        // this.trackSwap('switchProviders');
      }
      if (isEmpty(p)) this.selectedProviderId = undefined;
    },
    selectedProviderId(newVal) {
      if (isNumber(newVal)) {
        // this.trackSwap(
        //   `swapProvider: ${newVal + 1}/${this.availableQuotes.length}`
        // );
      }
    },
    defaults: {
      handler: function () {
        this.setDefaults();
      },
      deep: true,
      immediate: true
    },
    amountErrorMessage(newVal) {
      if (newVal !== '') this.availableQuotes.splice(0);
    },
    networkAndWeb3: {
      handler: function () {
        this.resetBridgeState();
      }
    },
    web3: {
      handler: function () {
        this.resetBridgeState();
      }
    },
    fromTokenType: {
      handler: function (newVal) {
        this.fromTokenType = newVal;
      },
      deep: true,
      immediate: false
    },
    toTokenType: {
      handler: function (newVal) {
        this.toTokenType = newVal;
      },
      deep: true,
      immediate: false
    },
    selectedNetwork(newVal) {
      console.log('selectedNetwork', newVal);
      if (newVal && newVal.name_long !== 'Select Network') {
        // TODO: Set to token type to selected network's
        // contractToToken(wrappedTokens[this.selectedNetwork.name][this.network.type.name])
        this.toTokenType = Object.assign({}, this.fromTokenType);
        this.toTokenType.symbol = `W${this.toTokenType.symbol}`;
        console.log('wrappedTokens', wrappedTokens);
      }
    }
  },
  mounted() {
    // multi value watcher to clear
    // refund address and to address
    if (this.coinGeckoTokens.size > 0) {
      this.resetBridgeState();
    }
    // this.trackSwap('swapPageView');
  },
  methods: {
    ...mapActions('notifications', ['addNotification']),
    ...mapActions('swap', ['setSwapTokens']),
    resetBridgeState() {
      this.mainTokenDetails = this.contractToToken(MAIN_TOKEN_ADDRESS);
      localContractToToken = {};
      localContractToToken[MAIN_TOKEN_ADDRESS] = this.mainTokenDetails;
      this.toTokenType = undefined;
      this.selectedNetwork = { name_long: 'Select Network' };
      this.setupBridge();
    },
    /**
     * Handles emitted values from module-address-book
     */
    setToAddress(value, isValid) {
      this.addressValue = {
        value,
        isValid
      };
      this.setTokenInValue(this.tokenInValue);
    },
    setupBridge() {
      if (this.isAvailable) {
        this.isLoading = !this.prefetched;
        this.fromTokenType = this.mainTokenDetails;
        this.isLoading = false;
        this.localGasPrice = this.gasPriceByType(this.gasPriceType);
      }
    },
    // reset values after executing transaction
    clear() {
      this.step = 0;
      this.confirmInfo = {
        to: '',
        from: '',
        fromImg: '',
        toImg: '',
        fromType: '',
        toType: '',
        validUntil: 0,
        selectedProvider: '',
        txFee: '',
        actualTrade: {}
      };

      this.toTokenType = {};
      this.fromTokenType = {};
      this.tokenInValue = '0';
      this.tokenOutValue = '0';
      this.availableTokens = { toTokens: [], fromTokens: [] };
      this.availableQuotes = [];
      this.currentTrade = null;
      this.allTrades = [];
      this.isLoading = false;
      this.loadingFee = false;
      this.feeError = '';
      this.selectedProviderId = undefined;
      this.defaults = {
        fromToken: this.fromToken
      };
      this.isLoadingProviders = false;
      this.checkLoading = true;
      this.addressValue = {};
      this.selectedProvider = {};
      this.localGasPrice = '0';
      if (this.$refs.amountInput) this.$refs.amountInput.clear();
      this.refundAddress = '';
      this.isValidRefundAddr = false;
      this.setupBridge();
    },
    // resetAddressValues({ clearRefund = true, clearTo = true }) {
    //   if (clearTo)
    //     if (this.$refs.toAddressInput) {
    //       this.$refs.toAddressInput.clear();
    //     }
    //   this.selectedProvider = {};
    // },
    /**
     * Set the max available amount to swap from
     */
    // setMaxAmount() {
    //   this.trackSwap('setMaxValue');
    //   const availableBalanceMinusGas = new BigNumber(
    //     this.availableBalance
    //   ).minus(fromWei(toBN(this.localGasPrice).muln(MIN_GAS_LIMIT)));
    //   this.tokenInValue = this.isFromTokenMain
    //     ? availableBalanceMinusGas.gt(0)
    //       ? availableBalanceMinusGas.toFixed()
    //       : '0'
    //     : this.availableBalance.toFixed();
    // },
    /**
     * Gets the default from token
     */
    getDefaultFromToken() {
      // const findToken = this.actualFromTokens.find(item => {
      //   if (item.contract === this.defaults.fromToken) return item;
      // });
      // if (
      //   this.defaults.fromToken === MAIN_TOKEN_ADDRESS &&
      //   new BigNumber(this.balanceInETH).gt(0)
      // ) {
      //   return findToken;
      // }
      // return findToken ? findToken : this.actualFromTokens[0];
      return this.mainTokenDetails;
    },
    // getDefaultToToken() {
    //   const findToken = this.actualToTokens.find(item => {
    //     if (item.contract === this.defaults.toToken) return item;
    //   });
    //   if (
    //     this.defaults.toToken === MAIN_TOKEN_ADDRESS &&
    //     new BigNumber(this.balanceInETH).gt(0)
    //   ) {
    //     return this.mainTokenDetails;
    //   }
    //   return findToken ? findToken : this.actualToTokens[0];
    // },
    // switchTokens() {
    //   this.trackSwap('switchTokens');
    //   const fromToken = this.fromTokenType;
    //   const toToken = this.toTokenType || this.actualToTokens[0];
    //   const tokenOutValue = this.tokenOutValue;
    //   this.fromTokenType = {};
    //   this.toTokenType = {};
    //   this.tokenOutValue = '0';
    //   const toTokenFromTokenList = this.actualFromTokens.find(item => {
    //     if (item && item.contract === toToken?.contract) return item;
    //   });
    //   this.setFromToken(toTokenFromTokenList ? toTokenFromTokenList : toToken);
    //   this.setToToken(fromToken);
    //   this.setTokenInValue(tokenOutValue);
    // },
    // processTokens(tokens, storeTokens) {
    //   this.setupTokenInfo(tokens.fromTokens);
    //   this.setupTokenInfo(tokens.toTokens);
    //   this.setupTokenInfo(TRENDING_LIST[this.network.type.name]);
    //   this.availableTokens = tokens;
    //   this.setDefaults();
    //   if (isUndefined(storeTokens)) {
    //     this.setSwapTokens(tokens);
    //   }
    // },
    setDefaults() {
      setTimeout(() => {
        this.fromTokenType = this.getDefaultFromToken();
        // this.toTokenType = this.getDefaultToToken();
        this.setTokenInValue(this.tokenInValue);
      }, 500);
    },
    // setFromToken(value) {
    //   if (
    //     value === undefined ||
    //     (!value?.hasOwnProperty('isEth') &&
    //       value?.contract?.toLowerCase() !== MAIN_TOKEN_ADDRESS)
    //   ) {
    //     const foundToken = this.actualFromTokens.filter(item => {
    //       if (
    //         item?.contract &&
    //         item?.contract?.toLowerCase() === value?.contract?.toLowerCase()
    //       )
    //         return item;
    //     });
    //     value =
    //       foundToken.length > 0 ? foundToken[0] : this.actualFromTokens[0];
    //   }
    //   this.fromTokenType = value;
    //   this.resetAddressValues({ clearTo: false });
    //   this.$nextTick(() => {
    //     if (value && value.name) {
    //       this.trackSwapToken('from: ' + value.name);
    //     }
    //     this.setTokenInValue(this.tokenInValue);
    //   });
    // },
    // setToToken(value) {
    //   if (!value?.hasOwnProperty('isEth')) {
    //     const foundToken = this.actualToTokens.filter(item => {
    //       if (
    //         item?.contract &&
    //         item?.contract?.toLowerCase() === value?.contract?.toLowerCase()
    //       )
    //         return item;
    //     });
    //     value = foundToken[0];
    //   }
    //   this.toTokenType = value;
    //   this.resetAddressValues({ clearRefund: false });
    //   if (value && value.name) {
    //     this.trackSwapToken('to: ' + value.name);
    //   }
    //   this.setTokenInValue(this.tokenInValue);
    // },
    // triggerSetTokenInValue: debounce(function (val) {
    //   this.setTokenInValue(val);
    // }, 500),
    setTokenInValue(value) {
      /**
       * Ensure that both pairs have been set
       * before calling the providers
       */
      this.belowMinError = false;
      if (this.isLoading || this.initialLoad) return;
      const val = value ? value : 0;
      this.tokenInValue = BigNumber(val).toFixed();
      // Check if (in amount) is larger than (available balance)
      if (
        this.availableBalance.lt(new BigNumber(this.tokenInValue)) ||
        !this.hasMinEth
      ) {
        this.step = 0;
        return;
      }

      // if (isEmpty(this.fromTokenType)) {
      //   Toast('From token cannot be empty!', {}, ERROR);
      //   return;
      // }

      // TODO: Check decimal count in tokenInValue

      this.tokenOutValue = '0';
      this.availableQuotes.forEach(q => {
        if (q) {
          q.isSelected = false;
        }
      });
      this.availableQuotes = [];
      this.allTrades = [];
      this.step = 0;

      if (this.refundAddress === '' || !this.isValidRefundAddr) return;
      if (this.showToAddress && !this.addressValue?.isValid) return;
      if (
        !isEmpty(this.toTokenType) &&
        this.toTokenType.hasOwnProperty('isEth') &&
        !this.toTokenType.isEth &&
        (isEmpty(this.addressValue) ||
          (!isEmpty(this.addressValue) && !this.addressValue.isValid))
      ) {
        return;
      }
      if (
        !BigNumber(value).isNaN() &&
        BigNumber(value).gt(0) &&
        !isEmpty(this.fromTokenType) &&
        !isEmpty(this.toTokenType) &&
        !isEmpty(this.fromTokenType?.symbol) &&
        !isEmpty(this.toTokenType?.symbol)
      ) {
        this.isLoadingProviders = true;
        this.showAnimation = true;
        this.cachedAmount = this.tokenInValue;
        this.swapper
          .getAllQuotes({
            fromT: this.fromTokenType,
            toT: this.toTokenType,
            fromAmount: new BigNumber(this.tokenInValue).times(
              new BigNumber(10).pow(new BigNumber(this.fromTokenType.decimals))
            )
          })
          .then(quotes => {
            if (this.tokenInValue === this.cachedAmount) {
              this.selectedProvider = {};
              if (quotes.length) {
                this.lastSetToken = quotes[0].amount;
                this.availableQuotes = quotes.reduce((arr, q) => {
                  if (quotes.length === 1 || BigNumber(q.amount).gt(0)) {
                    q.rate = new BigNumber(q.amount)
                      .dividedBy(new BigNumber(this.tokenInValue))
                      .toString();
                    q.isSelected = false;
                    arr.push(q);
                  }
                  return arr;
                }, []);
                this.tokenOutValue = quotes[0].amount;
              }
              this.step = 1;
              this.isLoadingProviders = false;
            } else {
              this.isLoadingProviders = false;
            }
          });
      }
    },
    showConfirm() {
      this.trackSwap('showConfirm');
      this.setConfirmInfo();
      this.executeTrade();
    },
    setConfirmInfo() {
      const toPrice = this.toTokenType.price ? this.toTokenType.price : 0;
      const fromPrice = this.fromTokenType.price ? this.fromTokenType.price : 0;
      const obj = {
        from: this.address,
        to: this.toAddress,
        fromType: this.fromTokenType.symbol,
        toType: this.toTokenType.symbol,
        fromImg: this.fromTokenType.img,
        toImg: this.toTokenType.img,
        fromVal: this.tokenInValue,
        toVal: this.tokenOutValue,
        toUsdVal: BigNumber(toPrice).times(this.tokenOutValue).toFixed(),
        fromUsdVal: BigNumber(fromPrice).times(this.tokenInValue).toFixed(),
        validUntil: new Date().getTime() + 10 * 60 * 1000,
        selectedProvider: this.selectedProvider,
        txFee: this.txFee,
        gasPriceType: this.gasPriceType,
        actualTrade: this.currentTrade,
        fromTokenType: this.fromTokenType,
        toTokenType: this.toTokenType
      };
      this.confirmInfo = obj;
    },
    isValidToAddress(address) {
      if (this.availableQuotes.length > 0) {
        return this.swapper.isValidToAddress({
          provider: this.availableQuotes[0].provider,
          toT: this.toTokenType,
          address
        });
      }
      if (this.toTokenType.isEth) {
        return MultiCoinValidator.validate(address, 'Ethereum');
      }
      try {
        return MultiCoinValidator.validate(address, this.toTokenType.name);
      } catch (e) {
        return this.swapper.isValidToAddress({
          provider: 'changelly',
          toT: this.toTokenType,
          address
        });
      }
    },
    executeTrade() {
      const currentTradeCopy = clone(this.currentTrade);
      this.swapper
        .executeTrade(this.currentTrade, this.confirmInfo)
        .then(res => {
          this.swapNotificationFormatter(res, currentTradeCopy);
        })
        .catch(err => {
          if (err && err.statusObj?.hashes?.length > 0) {
            err.statusObj.hashes.forEach(item => {
              const error = handleError(item);
              if (error) Toast(error, {}, ERROR);
            });
            return;
          }
          const error = handleError(err);
          if (error) Toast(err && err.message ? err.message : err, {}, ERROR);
        });
    },
    getTokenBalance(balance, decimals) {
      return new BigNumber(balance.toString()).div(
        new BigNumber(10).pow(decimals)
      );
    },
    swapNotificationFormatter(obj, currentTrade) {
      obj.hashes.forEach((hash, idx) => {
        const main = {
          from: this.address,
          type: NOTIFICATION_TYPES.SWAP,
          network: this.network.type?.name,
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
          }
        };

        const notif = Object.assign(
          {
            hash,
            swapObj: obj
          },
          main,
          currentTrade.transactions[idx]
        );
        this.addNotification(new Notification(notif)).then(this.clear);
      });
    },
    checkFeeBalance() {
      this.feeError = '';
      if (this.notEnoughEth) {
        this.feeError = `Not enough ${this.network.type.currencyName} to pay for transaction fee.`;
      }
    },
    handleLocalGasPrice(e) {
      this.localGasPrice = e;
    },
    // preventCharE(e) {
    //   if (e.key === 'e') e.preventDefault();
    // }
    openNetworkOverlay(isBridgeSelect) {
      if (!isObject(isBridgeSelect) && isBridgeSelect)
        this.isOpenNetworkOverlay = true;
      else EventBus.$emit('openNetwork');
    },
    closeNetworkOverlay() {
      this.isOpenNetworkOverlay = false;
    },
    setSelectedNetwork(network) {
      const found = Object.keys(types).find(item => item === network);
      const foundNetwork = types[found];
      this.selectedNetwork = foundNetwork;
      this.closeNetworkOverlay();
    },
    switchNetworks() {
      // TODO: Switch the networks when both
      // networks are set
      console.log('switching networks');
    }
  }
};
</script>

<style lang="scss" scoped>
.input-swap-container {
  box-shadow: 0px 4px 4px rgb(11 40 64 / 4%), 0px 2px 10px rgb(11 40 64 / 6%),
    0px 3px 16px rgb(11 40 64 / 4%);
  border-radius: 10px;
}

.v-input--selection-controls {
  padding: 0;
  margin: 0;
}

.border-top {
  border-top: 1px solid var(--v-greyMedium-base);
}

.bridge-not-available {
  @media (min-width: 960px) {
    min-height: 45vh;
  }
}

.network-icon {
  box-sizing: border-box;

  width: 32px;
  height: 32px;

  border: 1px solid #d7dae3;
  border-radius: 8px;
}

.network-selection {
  background: #ffffff;
  border: 1px solid #d7dde7;
  box-sizing: border-box;
  border-radius: 12px;

  display: flex;
  flex-direction: row;
  align-items: flex-start;
  padding: 0px;
  cursor: pointer;
}

.network-selection.to-network {
  border: 2px solid var(--v-greenPrimary-base);
}

.network-select-label {
  font-style: normal;
  font-weight: 500;
  font-size: 10px;
  line-height: 12px;

  letter-spacing: 1.5px;
  text-transform: uppercase;

  color: #7b818e;
}

.network-label {
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;

  display: flex;
  letter-spacing: 0.03em;

  color: #000000;
}

.expand-button {
  width: 24px;
  height: 24px;

  margin-left: auto;
  color: rgba(0, 0, 0, 0.8);
  align-self: center;
}

.network-container {
  align-content: stretch;
  justify-content: center;
  // flex-direction: column;
  // gap: 2px;
}

.switch-button > img:hover {
  background-color: rgba(0, 0, 0, 0.1);
  border-radius: 20%;
}

.token-container {
  box-sizing: border-box;

  display: flex;
  flex-direction: row;
  align-items: flex-start;
  padding: 15px;

  width: 100%;
  height: 112px;

  border: 1px solid #d7dde7;
  justify-self: center;
}

.token-container.to {
  border-radius: 12px 12px 0 0;
}

.token-container.from {
  border-top: none;
  border-radius: 0 0 12px 12px;
}

.token-label {
  display: flex;
  font-style: normal;
  font-weight: 500;
  font-size: 10px;
  line-height: 12px;

  letter-spacing: 1.5px;
  text-transform: uppercase;

  color: #7b818e;
}

.token-name {
  font-style: normal;
  font-weight: 500;
  font-size: 24px;
  line-height: 32px;

  color: #b9bdc7;
}

.balance-text {
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 20px;

  color: #7b818e;
}

.token-amount {
  font-style: normal;
  font-weight: 500;
  font-size: 24px;
  line-height: 32px;

  color: #b9bdc7;
  margin-left: auto;
}

.balance-value {
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  line-height: 20px;

  color: #9ba1ae;

  margin-left: auto;
}

.token-row {
  display: flex;
  // align-self: center;
  // margin-left: -55px;
}

.balance-row {
  display: flex;
  align-self: flex-end;
  // margin-left: -55px;
}
</style>
