<template>
  <mew6-white-sheet
    class="mew-component--bridge px-5 py-5 px-md-15 py-md-10 mx-auto"
    :style="!isMobile ? 'max-width: 600px' : ''"
  >
    <h2 class="mb-8">Bridge</h2>
    <template v-if="isAvailable">
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
          :is-bridge-page="true"
          @selectedNetwork="setSelectedNetwork"
        />
      </mew-popup>

      <!-- ===================================================================================== -->
      <!-- From Network / To Network selection -->
      <!-- ===================================================================================== -->
      <div
        class="d-flex align-center justify-center flex-column flex-sm-row network-container"
      >
        <div class="network-selection pa-3" @click="openNetworkOverlay">
          <img
            :alt="`${networkName}-icon`"
            :src="networkImage"
            class="network-icon mr-2"
          />
          <div style="height: 32px">
            <div class="network-select-label">From</div>
            <div
              class="network-label"
              :class="!isMobile ? 'text-ellipsis' : 'text-ellipsis-mobile'"
            >
              {{ network.type.name_long }}
            </div>
          </div>
          <v-icon class="expand-button">mdi-chevron-down</v-icon>
        </div>

        <v-btn
          style="background-color: transparent !important"
          class="d-flex my-2 mx-2 switch-button cursor-pointer"
          x-small
          depressed
          min-height="36px"
          min-width="36px"
          max-height="36px"
          max-width="36px"
          bottom
          :disabled="!enableNetworkSwitch"
          @click="switchNetworks"
        >
          <v-icon v-if="!isMobile" color="textDark">mdi-swap-horizontal</v-icon>
          <v-icon v-else color="textDark">mdi-swap-vertical</v-icon>
        </v-btn>

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
          <div style="height: 32px">
            <div class="network-select-label">To</div>
            <div
              class="network-label"
              :class="!isMobile ? 'text-ellipsis' : 'text-ellipsis-mobile'"
            >
              {{ selectedNetwork.name_long }}
            </div>
          </div>
          <v-icon class="expand-button">mdi-chevron-down</v-icon>
        </div>
      </div>

      <!-- ======================================================================================================================= -->
      <!-- Token selector interface -->
      <!-- ======================================================================================================================= -->
      <div class="position--relative mt-10">
        <mew-token-selector-interface
          flat-bottom
          style="margin-bottom: -1px"
          title="YOU GIVE"
          :left-text="`Max: ${displayBalance}`"
          :right-text="`≈${displayAmountPrice}`"
          :token="fromTokenType"
          placeholder="Enter amount"
          :loading="isLoading"
          :set-max-amount="setMaxAmount"
          :value="tokenInValue"
          :amount-error-message="amountErrorMessage"
          @clicked="openTokenOverlay(false)"
          @changed="setAmount"
        />
        <v-icon class="circle-arrow">mdi-arrow-down </v-icon>
        <mew-token-selector-interface
          flat-top
          title="YOU RECEIVE"
          :left-text="`Balance: 0`"
          :right-text="`≈${displayQuoteAmountPrice}`"
          read-only
          btn-text="Select Token"
          :token="toToken"
          :value="tokenOutValue"
          :loading="isLoading"
          :btn-disabled="disableToTokenSelect"
          @clicked="openTokenOverlay(true)"
        />
      </div>

      <div v-if="hasMinEth && showNetworkFee">
        <v-slide-y-transition v-if="showAnimation" hide-on-leave group>
          <swap-provider-mentions
            key="showAnimation"
            :is-loading="isLoadingProviders"
            :check-loading="checkLoading"
            @showProviders="showProviders"
          />
        </v-slide-y-transition>
        <div v-else key="showAnimation1">
          <div class="d-flex pa-3">
            <span class="fee-label">Rate</span>
            <div class="ml-auto cursor-pointer" @click="openProvidersList">
              <span class="dropdown-label"
                >{{ rateValue }} {{ network.type.currencyName }}</span
              >
              <v-icon class="ml-2" size="24px" color="black"
                >mdi-menu-down</v-icon
              >
            </div>
          </div>
          <div class="d-flex pa-3">
            <span class="fee-label">Network fee</span>
            <v-icon class="ml-2" size="12px">mdi-information-outline</v-icon>
            <div class="ml-auto cursor-pointer" @click="openGasPrice">
              <span class="dropdown-label">{{ feeInUsd }}</span>
              <v-icon class="ml-2" size="24px" color="black"
                >mdi-menu-down</v-icon
              >
            </div>
          </div>

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

        <!-- ===================================================================================== -->
        <!-- Bridge Fee -->
        <!-- ===================================================================================== -->
        <simple-dialog
          :is-open="gasPriceModal"
          width="420"
          title="Select transaction fee"
          @close="closeGasPrice"
        >
          <settings-gas-price
            :is-swap="true"
            :buttons="gasButtons"
            :set-selected="setGas"
            :gas-price="gasPrice"
            :cost-in-eth="totalCostInEth"
            :tx-fee-formatted="txFeeFormatted"
            :tx-fee-usd="feeInUsd"
            :not-enough-eth="notEnoughEth"
            :total-gas-limit="totalGasLimit"
            :close-dialog="closeGasPrice"
            :from-settings="false"
          />
        </simple-dialog>

        <!-- ===================================================================================== -->
        <!-- Provider Rates -->
        <!-- ===================================================================================== -->
        <simple-dialog
          :is-open="showProviderRates"
          width="420"
          title="Select rate"
          @close="closeProvidersList"
        >
          <providers-list
            :step="step"
            :available-quotes="availableQuotes"
            :set-provider="setProvider"
            :to-token-symbol="toToken ? toToken.symbol : ''"
            :to-token-icon="toToken ? toToken.img : ''"
            :is-loading="isLoadingProviders"
            :providers-error="providersErrorMsg"
            :selected-provider-id="selectedProviderId"
          />
        </simple-dialog>
      </div>

      <!-- ===================================================================================== -->
      <!-- Token Select -->
      <!-- ===================================================================================== -->
      <simple-dialog
        :is-open="isOpenTokenSelect"
        max-width="600px"
        :title="tokenSelectTitle"
        @close="closeTokenOverlay"
      >
        <token-select
          :title="receiveTokenSelectOpen ? '' : 'MY TOKENS'"
          :tokens-list="filterTokens"
          :show-token-balance="!receiveTokenSelectOpen"
          @selectedToken="closeTokenOverlay"
        />
      </simple-dialog>
    </template>

    <!-- ===================================================================================== -->
    <!-- Message is BRIDGE NOT Available -->
    <!-- ===================================================================================== -->
    <template v-else>
      <div class="bridge-not-available">
        <app-user-msg-block :message="bridgeNotAvailableMes" />
      </div>
    </template>
  </mew6-white-sheet>
</template>

<script>
import { fromWei, toBN, toWei } from 'web3-utils';
import {
  // debounce,
  isEmpty,
  // clone,
  // isUndefined,
  isObject,
  isNumber
} from 'lodash';
import { mapGetters, mapState, mapActions } from 'vuex';
import BigNumber from 'bignumber.js';

// import Notification, {
//   NOTIFICATION_TYPES,
//   NOTIFICATION_STATUS
// } from '@/modules/notifications/handlers/handlerNotification';
import { Toast, ERROR, SUCCESS } from '@/modules/toast/handler/handlerToast';
import { MAIN_TOKEN_ADDRESS } from '@/core/helpers/common';
import handlerAnalytics from '@/modules/analytics-opt-in/handlers/handlerAnalytics.mixin';
import buyMore from '@/core/mixins/buyMore.mixin.js';
// import handleError from '../confirmation/handlers/errorHandler';
import { EventBus } from '@/core/plugins/eventBus';
import * as types from '@/utils/networks/types';
import * as nodes from '@/utils/networks/nodes';
import {
  formatFiatValue,
  formatFloatingPointValue
} from '@/core/helpers/numberFormatHelper';
import WALLET_TYPES from '@/modules/access-wallet/common/walletTypes';
import gasPriceMixin from '@/modules/settings/handler/gasPriceMixin';

const MIN_GAS_LIMIT = 800000;
let localContractToToken = {};
// WrappedToken: { Network: ContractAddress }
const wrappedTokens = {
  ETH: {
    MATIC: '0x7ceb23fd6bc0add59e62ac25578270cff1b9f619',
    BSC: '0x2170ed0880ac9a755fd29b2688956bd959f933f8'
  },
  BNB: {
    ETH: '0xb8c77482e45f1f44de1745f52c74426c631bdd52'
  },
  MATIC: {
    ETH: '0x7d1afa7b718fb893db30a3abc0cfc608aacfebb0',
    BSC: '0xcc42724c6683b7e57334c4e856f4c9965ed682bd'
  }
};
export default {
  name: 'ModuleBridge',
  components: {
    SimpleDialog: () => import('@/core/components/AppSimpleDialog'),
    MewTokenSelectorInterface: () =>
      import('@/components/MewTokenSelectorInterface.vue'),
    AppUserMsgBlock: () => import('@/core/components/AppUserMsgBlock'),
    ModuleAddressBook: () => import('@/modules/address-book/ModuleAddressBook'),
    AppTransactionFee: () => import('@/core/components/AppTransactionFee.vue'),
    NetworkSwitch: () =>
      import('@/modules/network/components/NetworkSwitch.vue'),
    SwapProviderMentions: () =>
      import('@/modules/swap/components/SwapProviderMentions.vue'),
    TokenSelect: () => import('./components/TokenSelect.vue'),
    ProvidersList: () => import('./components/ProvidersList.vue'),
    AppNetworkSettingsModal: () =>
      import('@/core/components/AppNetworkSettingsModal.vue'),
    SettingsGasPrice: () =>
      import('@/modules/settings/components/SettingsGasPrice.vue')
  },
  mixins: [handlerAnalytics, buyMore, gasPriceMixin],
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
      selectedProvider: {},
      localGasPrice: '0',
      mainTokenDetails: {},
      cachedAmount: '0',
      selectedProviderId: undefined,
      isOpenNetworkOverlay: false,
      isOpenTokenSelect: false,
      networkSelectedBefore: null,
      receiveTokenSelectOpen: false,
      gasPriceModal: false,
      showProviderRates: false
    };
  },
  computed: {
    ...mapState('swap', ['prefetched', 'swapTokens']),
    ...mapState('wallet', [
      'web3',
      'address',
      'balance',
      'identifier',
      'instance'
    ]),
    ...mapState('global', [
      'gasPriceType',
      'validNetwork',
      'preferredCurrency'
    ]),
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
    isMobile() {
      return this.$vuetify.breakpoint.smAndDown;
    },
    /**
     * @returns a boolean
     * based on how the bridge state is
     */
    showNetworkFee() {
      return (
        this.selectedNetwork?.name &&
        !isEmpty(this.tokenInValue) &&
        this.tokenInValue !== '0'
      );
      // return this.showNextButton;
    },
    /**
     * @returns a boolean
     * based on how the bridge state is
     */
    showNextButton() {
      return true;
      // return (
      //   this.step > 0 &&
      //   this.providersErrorMsg.subtitle === '' &&
      //   !this.isLoadingProviders
      // );
    },
    networkImage() {
      return this.network.type.icon;
    },
    networkName() {
      return this.network.type.name;
    },
    leftBtn() {
      return {
        title: '',
        color: 'primary',
        method: this.closeNetworkOverlay
      };
    },
    tokenSelectTitle() {
      return `Select token to ${
        this.receiveTokenSelectOpen ? 'receive' : 'give'
      }`;
    },
    filterNetworks() {
      // Only use mainnet coin for bridge for now
      let filteredNetworks = Object.keys(types);
      const availableNetworks = wrappedTokens[this.network.type.currencyName];
      filteredNetworks = filteredNetworks.filter(item => {
        return (
          item !== this.network.type.name &&
          Object.keys(availableNetworks).includes(item)
        );
      });
      return filteredNetworks;
    },
    filterTokens() {
      const filteredTokens = this.tokensList.reduce((arr, item) => {
        const newObj = Object.assign({}, item);
        if (item.symbol === this.network.type.currencyName) {
          if (this.receiveTokenSelectOpen) {
            const tokens = wrappedTokens[this.network.type.currencyName];
            newObj.symbol = `W${item.symbol}`;
            newObj.name = newObj.symbol;
            newObj.subtext = `Wrapped ${item.subtext}`;
            newObj.value = newObj.subtext;
            newObj.contract = tokens[this.selectedNetwork.name];
          }
          arr.push(newObj);
        }
        return arr;
      }, []);
      return filteredTokens;
    },
    toToken() {
      return !isEmpty(this.toTokenType) ? this.toTokenType : null;
    },
    // toTokenText() {
    //   return !isEmpty(this.toTokenType)
    //     ? this.toTokenType.name
    //     : 'Select Token';
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
      return disableSet || this.actualTrade?.length === 0;
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
     * checks whether both network fields are empty
     */
    enableNetworkSwitch() {
      if (this.selectedNetwork.name_long === 'Select Network') return false;
      // Check if mainnet coin is available on selected network
      const availableNetworks =
        wrappedTokens[this.selectedNetwork.currencyName];
      const found = Object.keys(availableNetworks).find(
        item => item === this.network.type.name
      );
      return (
        !this.isLoading &&
        !isEmpty(this.selectedNetwork?.currencyName) &&
        !isEmpty(found)
      );
    },
    /**
     * Returns correct balance to be displayed below From Selection field
     */
    displayBalance() {
      return formatFloatingPointValue(this.availableBalance.toString()).value;
    },
    /**
     * Returns correct price to be displayed below From Amount field
     */
    displayAmountPrice() {
      const price = new BigNumber(this.fromTokenType.price).multipliedBy(
        this.tokenInValue
      );
      return formatFiatValue(price).value;
    },
    /**
     * Returns correct price to be displayed below From Amount field
     */
    displayQuoteAmountPrice() {
      const price = new BigNumber(this.fromTokenType.price).multipliedBy(
        this.tokenOutValue
      );
      return formatFiatValue(price).value;
    },
    disableToTokenSelect() {
      return this.selectedNetwork.name_long === 'Select Network';
    },
    txFee() {
      return toBN(this.totalGasLimit).mul(toBN(this.localGasPrice)).toString();
    },
    txFeeInEth() {
      return fromWei(this.txFee);
    },
    txFeeFormatted() {
      return formatFloatingPointValue(this.txFeeInEth).value;
    },
    feeInUsd() {
      const value = formatFiatValue(
        new BigNumber(this.txFeeInEth).times(this.fiatValue).toFixed(2),
        { currency: this.preferredCurrency }
      ).value;
      return value;
    },
    totalCost() {
      const amount = this.tokenInValue || '0';
      const amountWei = toWei(amount);
      return new BigNumber(this.txFee).plus(amountWei).toString();
    },
    // totalCostFormatted() {
    //   console.log('availableQuotes', this.availableQuotes);
    //   console.log('selectedProviderId', this.selectedProviderId);
    //   return formatFloatingPointValue(this.totalCostInEth).value;
    // },
    totalCostInEth() {
      const amount = this.tokenInValue || '0';
      return new BigNumber(this.txFeeInEth).plus(amount).toFixed();
    },
    totalGasLimit() {
      if (this.currentTrade) {
        let totalGas = toBN(0);
        this.currentTrade.transactions?.forEach(tx => {
          totalGas = totalGas.add(toBN(tx.gas));
        });
        return totalGas.toString();
      }
      // For testing
      return `${MIN_GAS_LIMIT}`;
      // return '0';
    },
    rateValue() {
      return formatFloatingPointValue(this.tokenOutValue).value;
    },
    /**
     * Checks whether or not the user has a minimum eth balance to bridge:
     * @returns{boolean}
     */
    hasMinEth() {
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
    // showBridgeFee() {
    //   return this.availableBalance.gt(0);
    //   // return this.step >= 2 && this.availableBalance.gt(0);
    // },
    /**
     * Method validates input for the From token amount against user input
     * Used to show error messages for the amount input component
     */
    amountErrorMessage() {
      if (!this.initialLoad && !this.isLoading && this.fromTokenType?.name) {
        /* Balance is <= 0*/
        if (this.availableBalance.lte(0)) {
          return this.errorMsgs.amountEthIsTooLow;
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
          // if (
          //   !this.isFromTokenMain &&
          //   this.availableBalance.lt(new BigNumber(this.tokenInValue))
          // ) {
          //   return `Amount exceeds your ${this.fromTokenType.symbol} balance.`;
          // }
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
    networkAndWeb3() {
      return this.network, this.web3;
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
      this.setTokenOutValue();
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
        this.setTokenOutValue();
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
      if (newVal && newVal.name_long !== 'Select Network') {
        this.setToToken();
      } else this.toTokenType = {};
    },
    /**
     * set gas when modal
     * opens in case of difference
     */
    gasPriceModal(newVal) {
      if (newVal) {
        this.handleLocalGasPrice(this.gasPriceByType(this.gasPriceType));
      }
    },
    /**
     * only set new gas price
     * when modal is open
     */
    gasPrice() {
      if (this.gasPriceModal) {
        this.handleLocalGasPrice(this.gasPriceByType(this.gasPriceType));
      }
    }
  },
  mounted() {
    if (this.coinGeckoTokens.size > 0) {
      this.resetBridgeState();
    }
    // this.trackSwap('swapPageView');
  },
  methods: {
    ...mapActions('notifications', ['addNotification']),
    ...mapActions('swap', ['setSwapTokens']),
    ...mapActions('wallet', ['setWeb3Instance']),
    ...mapActions('global', ['setNetwork', 'updateGasPrice']),
    resetBridgeState() {
      this.mainTokenDetails = this.contractToToken(MAIN_TOKEN_ADDRESS);
      localContractToToken = {};
      localContractToToken[MAIN_TOKEN_ADDRESS] = this.mainTokenDetails;
      if (
        this.networkSelectedBefore &&
        this.network.type.name === this.networkSelectedBefore.type.name
      )
        this.networkSelectedBefore = null;

      this.selectedNetwork = this.networkSelectedBefore
        ? this.networkSelectedBefore.type
        : { name_long: 'Select Network' };
      this.setupBridge();
    },
    setupBridge() {
      if (this.isAvailable) {
        this.isLoading = !this.prefetched;
        this.fromTokenType = this.mainTokenDetails;
        this.setToToken();
        this.isLoading = false;
        this.localGasPrice = this.gasPriceByType(this.gasPriceType);
      }
    },
    setToToken(tokenName) {
      if (!tokenName) {
        const tokens = wrappedTokens[this.network.type.currencyName];
        this.toTokenType = Object.assign({}, this.fromTokenType);
        this.toTokenType.symbol = `W${this.toTokenType.symbol}`;
        this.toTokenType.name = this.toTokenType.symbol;
        this.toTokenType.subtext = `Wrapped ${this.toTokenType.subtext}`;
        this.toTokenType.value = this.toTokenType.subtext;
        this.toTokenType.contract = tokens[this.selectedNetwork.name];
      } else {
        const realSymbol = tokenName.substring(1);
        console.log('realSymbol', realSymbol);
        const foundToken = this.tokensList.find(
          item => item.symbol === realSymbol
        );
        console.log('foundToken', foundToken);
        // TODO: set the wrapped token
        // this.toTokenType = foundToken;
      }
      if (new BigNumber(this.tokenInValue || 0).gt(0)) this.doQuoteTesting();
    },
    // reset values after executing transaction
    // clear() {
    //   this.step = 0;
    //   this.confirmInfo = {
    //     to: '',
    //     from: '',
    //     fromImg: '',
    //     toImg: '',
    //     fromType: '',
    //     toType: '',
    //     validUntil: 0,
    //     selectedProvider: '',
    //     txFee: '',
    //     actualTrade: {}
    //   };

    //   this.toTokenType = {};
    //   this.fromTokenType = {};
    //   this.tokenInValue = '0';
    //   this.tokenOutValue = '0';
    //   this.availableQuotes = [];
    //   this.currentTrade = null;
    //   this.allTrades = [];
    //   this.isLoading = false;
    //   this.loadingFee = false;
    //   this.feeError = '';
    //   this.selectedProviderId = undefined;
    //   this.defaults = {
    //     fromToken: this.fromToken
    //   };
    //   this.isLoadingProviders = false;
    //   this.checkLoading = true;
    //   this.addressValue = {};
    //   this.selectedProvider = {};
    //   this.localGasPrice = '0';
    //   if (this.$refs.amountInput) this.$refs.amountInput.clear();
    //   this.setupBridge();
    // },
    /**
     * Set the max available amount to swap from
     */
    setMaxAmount() {
      // this.trackSwap('setMaxValue');
      const availableBalanceMinusGas = new BigNumber(
        this.availableBalance
      ).minus(fromWei(toBN(this.localGasPrice).muln(MIN_GAS_LIMIT)));
      this.tokenInValue = availableBalanceMinusGas.gt(0)
        ? availableBalanceMinusGas.toFixed()
        : '0';
      this.doQuoteTesting();
    },
    /**
     * Gets the default from token
     */
    getDefaultFromToken() {
      return this.mainTokenDetails;
    },
    setDefaults() {
      setTimeout(() => {
        this.fromTokenType = this.getDefaultFromToken();
        // this.toTokenType = this.getDefaultToToken();
        this.setTokenInValue(this.tokenInValue);
      }, 500);
    },
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
      this.tokenInValue = new BigNumber(val).toFixed();
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

      this.setTokenOutValue(); // Change to quoted amount
      this.availableQuotes.forEach(q => {
        if (q) {
          q.isSelected = false;
        }
      });
      this.availableQuotes = [];
      this.allTrades = [];
      this.step = 0;

      if (
        !BigNumber(value).isNaN() &&
        BigNumber(value).gt(0) &&
        !isEmpty(this.fromTokenType) &&
        !isEmpty(this.toTokenType) &&
        !isEmpty(this.fromTokenType?.symbol) &&
        !isEmpty(this.toTokenType?.symbol)
      ) {
        // this.isLoadingProviders = true;
        // this.showAnimation = true;
        this.cachedAmount = this.tokenInValue;
        // TODO: get rates for wrapped tokens
      }
    },
    showConfirm() {
      // this.trackSwap('showConfirm');
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
    executeTrade() {
      // const currentTradeCopy = clone(this.currentTrade);
      // this.swapper
      //   .executeTrade(this.currentTrade, this.confirmInfo)
      //   .then(res => {
      //     this.swapNotificationFormatter(res, currentTradeCopy);
      //   })
      //   .catch(err => {
      //     if (err && err.statusObj?.hashes?.length > 0) {
      //       err.statusObj.hashes.forEach(item => {
      //         const error = handleError(item);
      //         if (error) Toast(error, {}, ERROR);
      //       });
      //       return;
      //     }
      //     const error = handleError(err);
      //     if (error) Toast(err && err.message ? err.message : err, {}, ERROR);
      //   });
    },
    getTokenBalance(balance, decimals) {
      return new BigNumber(balance.toString()).div(
        new BigNumber(10).pow(decimals)
      );
    },
    // swapNotificationFormatter(obj, currentTrade) {
    //   obj.hashes.forEach((hash, idx) => {
    //     const main = {
    //       from: this.address,
    //       type: NOTIFICATION_TYPES.SWAP,
    //       network: this.network.type?.name,
    //       status: NOTIFICATION_STATUS.PENDING,
    //       fromTxData: {
    //         currency: this.confirmInfo.fromType,
    //         amount: this.confirmInfo.fromVal,
    //         icon: this.confirmInfo.fromImg
    //       },
    //       toTxData: {
    //         currency: this.confirmInfo.toType,
    //         amount: this.confirmInfo.toVal,
    //         icon: this.confirmInfo.toImg,
    //         to: this.confirmInfo.to
    //       }
    //     };

    //     const notif = Object.assign(
    //       {
    //         hash,
    //         swapObj: obj
    //       },
    //       main,
    //       currentTrade.transactions[idx]
    //     );
    //     this.addNotification(new Notification(notif)).then(this.clear);
    //   });
    // },
    checkFeeBalance() {
      this.feeError = '';
      if (this.notEnoughEth) {
        this.feeError = `Not enough ${this.network.type.currencyName} to pay for transaction fee.`;
      }
    },
    setGas(value) {
      this.handleLocalGasPrice(this.gasPriceByType(value));
      this.setSelected(value);
      this.trackGasSwitch(
        `type:${this.gasPriceType}, gas:${this.txFeeFormatted}`
      );
      this.closeGasPrice();
    },
    handleLocalGasPrice(e) {
      this.localGasPrice = e;
      // this.closeGasPrice();
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
    openTokenOverlay(isReceive) {
      this.receiveTokenSelectOpen = isReceive;
      this.isOpenTokenSelect = true;
    },
    closeTokenOverlay(tokenName) {
      this.isOpenTokenSelect = false;
      console.log('selectedToken', tokenName);
      if (this.receiveTokenSelectOpen) {
        // TODO: Match selected token to available token
        this.setToToken(tokenName);
        setTimeout(() => {
          this.receiveTokenSelectOpen = false;
        }, 100);
      }
    },
    openGasPrice() {
      this.updateGasPrice().then(() => {
        this.gasPriceModal = true;
      });
    },
    closeGasPrice() {
      this.gasPriceModal = false;
    },
    openProvidersList() {
      this.showProviderRates = true;
    },
    closeProvidersList() {
      this.showProviderRates = false;
      // this.step = 0;
    },
    setSelectedNetwork(network) {
      const found = Object.keys(types).find(item => item === network);
      const foundNetwork = types[found];
      this.selectedNetwork = foundNetwork;
      this.closeNetworkOverlay();
    },
    switchNetworks() {
      const found = Object.values(nodes).filter(item => {
        if (item.type.name === this.selectedNetwork.name) {
          return item;
        }
      });
      this.networkSelectedBefore = this.network;

      this.setNetwork({
        network: found[0],
        walletType: this.instance?.identifier || ''
      })
        .then(() => {
          const provider =
            this.identifier === WALLET_TYPES.WEB3_WALLET
              ? this.setWeb3Instance(window.ethereum)
              : this.setWeb3Instance();
          provider.then(() => {
            Toast(
              `Switched network to: ${this.network.type.name}`,
              {},
              SUCCESS
            );
            this.trackNetworkSwitch(this.network.type.name);
          });
        })
        .catch(e => {
          Toast(e, {}, ERROR);
        });
    },
    setAmount(val) {
      this.tokenInValue = val;
      this.doQuoteTesting();
    },
    doQuoteTesting() {
      if (this.selectedNetwork?.name) {
        this.showAnimation = true;
        setTimeout(() => {
          // Testing purposes
          this.step = 2;
          let amount = new BigNumber(this.tokenInValue);
          if (amount.isNaN()) amount = new BigNumber('0');
          this.availableQuotes = [
            {
              amount: amount.toFixed(),
              exchange: 'one_inch',
              exchangeInfo: {
                description: '',
                img: '',
                name: 'One Inch'
              },
              isSelected: true,
              maxFrom: '1000000000000000000',
              minFrom: '0.000000000000000001',
              provider: 'ONE_INCH',
              rate: '1'
            },
            {
              amount: amount.toFixed(),
              exchange: 'paraswap',
              exchangeInfo: {
                description: '',
                img: '',
                name: 'paraswap'
              },
              isSelected: false,
              maxFrom: '1000000000000000000',
              minFrom: '0.000000000000000001',
              provider: 'PARASWAP',
              rate: '0.97500000000000008168'
            }
          ];
          // Set amount to correct rate amount
          this.availableQuotes.map(item => {
            item.amount = this.calculateAmount(item.amount, item.rate);
          });
          this.setTokenOutValue();
          this.showAnimation = false;
          // Testing end
        }, 2000);
      } else this.step = 0;
    },
    setTokenOutValue() {
      // Change to best quote value
      const selectedId = this.selectedProviderId ? this.selectedProviderId : 0;
      let amount = this.tokenInValue !== '' ? this.tokenInValue : '0';
      if (this.availableQuotes.length > 0) {
        const quote = this.availableQuotes[selectedId];
        amount = this.calculateAmount(this.tokenInValue, quote.rate);
      }
      if (amount === '0') amount = '';
      this.tokenOutValue = this.selectedNetwork?.name ? amount : '';
    },
    showProviders(val) {
      if (!this.isLoadingProviders && val) {
        this.showAnimation = false;
      }
    },
    setProvider(idx, clicked) {
      this.belowMinError = false;
      this.availableQuotes.forEach((q, _idx) => {
        if (_idx === idx) {
          this.selectedProviderId = _idx;
          q.isSelected = true;
          this.tokenOutValue = q.amount;
          // this.getTrade(idx);
          if (!clicked) {
            this.selectedProvider = q;
            // this.trackSwap(
            //   `swapProvider: ${idx + 1}/ ${this.availableQuotes.length}`
            // );
          } else {
            this.selectedProvider =
              q.amount !== this.selectedProvider.amount ? q : {};
          }
        }
      });
    },
    /**
     * Calculate the amount received from rate
     * @param {*} amount Amount of token in Eth
     * @param {*} rate Rate of exchange
     */
    calculateAmount(amount, rate) {
      return new BigNumber(amount).multipliedBy(rate).toFixed();
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
  border: 1px solid transparent;
  outline: 1px solid #d7dde7;
  box-sizing: border-box;
  border-radius: 12px;
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  padding: 0px;
  cursor: pointer;
  width: stretch;

  &:hover {
    border: 1px solid var(--v-greenPrimary-base);
    outline: 1px solid var(--v-greenPrimary-base);
  }
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
  width: max-content;
  &.text-ellipsis {
    display: inline-block;
    max-width: 125px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  &.text-ellipsis-mobile {
    display: inline-block;
    max-width: 125px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
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
}

.switch-button > img:hover {
  background-color: rgba(0, 0, 0, 0.1);
  border-radius: 20%;
}

.circle-arrow {
  border: 1px solid #e3e9ed;
  border-radius: 50%;
  padding: 7px;
  position: absolute;
  top: calc(50% + -20px);
  left: calc(50% + -20px);
  margin: 0;
  background-color: white;
}

.fee-label {
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
  letter-spacing: 0.1px;
  color: #081d34;
}

.dropdown-label {
  font-weight: 500;
  font-size: 16px;
  line-height: 24px;
  color: #081d34;
}
</style>
