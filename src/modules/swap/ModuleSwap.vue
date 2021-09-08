<template>
  <div class="mew-component--swap">
    <mew6-white-sheet>
      <mew-module
        :has-elevation="true"
        :has-indicator="true"
        class="d-flex flex-grow-1 pt-6"
        title="Swap"
      >
        <template v-if="isAvailable" #moduleBody>
          <!--
            =====================================================================================
              From / Amount to Swap / To / Amount to Recieve
            =====================================================================================
            -->
          <v-row class="align-center justify-space-between mt-4">
            <v-col cols="12" sm="5" class="pb-0 pb-sm-3 pr-sm-0">
              <div class="position--relative">
                <app-button-balance
                  :loading="isLoading"
                  :balance="displayBalance"
                />
                <mew-select
                  :value="fromTokenType"
                  label="From"
                  :items="actualFromTokens"
                  :is-custom="true"
                  :loading="isLoading"
                  @input="setFromToken"
                />
              </div>
              <mew-input
                ref="amountInput"
                label="Amount"
                placeholder="0"
                type="number"
                :value="tokenInValue"
                :persistent-hint="true"
                :error-messages="amountErrorMessage"
                :disabled="initialLoad"
                :buy-more-str="
                  isEthNetwork &&
                  (amountErrorMessage === errorMsgs.amountExceedsEthBalance ||
                    amountErrorMessage === errorMsgs.amountEthIsTooLow)
                    ? 'Buy more.'
                    : null
                "
                :max-btn-obj="{
                  title: 'Max',
                  disabled: false,
                  method: setMaxAmount
                }"
                @input="setTokenInValue"
            /></v-col>
            <v-col cols="12" sm="2" class="px-6 py-0 py-sm-3 mb-3 mb-sm-0">
              <div class="d-flex align-center justify-center pb-sm-10">
                <swap-btn
                  :class="[
                    enableTokenSwitch
                      ? 'cursor--pointer'
                      : 'pointer-event--none',
                    'd-flex align-center justify-center'
                  ]"
                  @click.native="switchTokens"
                />
              </div>
            </v-col>
            <v-col cols="12" sm="5" class="pl-sm-0 pb-0 pb-sm-3">
              <mew-select
                ref="toToken"
                :value="toTokenType"
                :items="actualToTokens"
                :is-custom="true"
                :loading="isLoading"
                label="To"
                @input="setToToken"
              />
              <!-- waiting for https://github.com/MyEtherWallet/mew-components/pull/166 to get merged -->
              <v-text-field
                label="Amount"
                placeholder="0"
                type="number"
                :hide-clear-btn="true"
                :value="tokenOutValue"
                :readonly="true"
                outlined
              />
              <!-- <mew-input
                label="Amount"
                placeholder="0"
                type="number"
                :hide-clear-btn="true"
                :value="tokenOutValue"
                readonly="true"
              /> -->
            </v-col>
          </v-row>

          <!--
          =====================================================================================
            User Message Block: store your Bitcoin on Ethereum
          =====================================================================================
          -->
          <app-user-msg-block
            v-if="!hasMinEth"
            class="mt-sm-5"
            :message="msg.lowBalance"
          >
            <div v-if="isEthNetwork" class="mt-3 mx-n1">
              <mew-button
                btn-size="small"
                btn-style="outline"
                title="Buy Ether"
                class="ma-1"
                :has-full-width="$vuetify.breakpoint.xsOnly"
                @click.native="buyEth"
              />
            </div>
          </app-user-msg-block>

          <!--
            =====================================================================================
              Address Book
            =====================================================================================
            -->
          <module-address-book
            v-show="showToAddress"
            class="mt-10"
            :is-valid-address-func="isValidToAddress"
            @setAddress="setToAddress"
          />

          <!--
          =====================================================================================
            User Message Block: store your Bitcoin on Ethereum
          =====================================================================================
          -->
          <app-user-msg-block
            v-if="
              toTokenType &&
              toTokenType.value &&
              toTokenType.value.toLowerCase() == 'bitcoin' &&
              isEthNetwork
            "
            class="mt-sm-5"
            :message="msg.storeBitcoin"
          >
            <div class="border-top mt-3">
              <v-expansion-panels
                flat
                class="expansion-panels--remove-paddings"
              >
                <v-expansion-panel>
                  <v-expansion-panel-header
                    color="tableHeader"
                    class="textPrimaryModule--text"
                  >
                    How can I get wrapped Bitcoin?
                  </v-expansion-panel-header>
                  <v-expansion-panel-content color="tableHeader" class="pa-0">
                    <div class="textPrimaryModule--text mb-2">
                      When you swap to Bitcoin, it is moved to the Bitcoin
                      blockchain, & requires a Bitcoin wallet. In order to keep
                      Bitcoin in MyEtherWallet, you can swap to wrapped Bitcoin
                      instead. Wrapped Bitcoin is an Ethereum token, with a
                      value approximately equal to 1 BTC. Wrapped Bitcoins can
                      be stored in MEW, and can be used as any other Ethereum
                      asset: you can swap it to other tokens, use it as
                      collateral in DeFi apps, etc. There are multiple kinds of
                      wrapped Bitcoins, but they roughly do the same thing.
                      <a
                        href="https://kb.myetherwallet.com/en/swap/btc-to-ethereum/"
                        target="_blank"
                      >
                        Learn more about Wrapped Bitcoin.
                      </a>
                    </div>
                    <v-row class="mt-6">
                      <v-col cols="12" md="4">
                        <mew-button
                          btn-size="small"
                          btn-style="outline"
                          title="Swap to renBTC"
                          :has-full-width="true"
                        />
                      </v-col>
                      <v-col cols="12" md="4">
                        <mew-button
                          btn-size="small"
                          btn-style="outline"
                          title="Swap to wBTC"
                          :has-full-width="true"
                        />
                      </v-col>
                      <v-col cols="12" md="4">
                        <mew-button
                          btn-size="small"
                          btn-style="outline"
                          title="Swap to PBTC"
                          :has-full-width="true"
                        />
                      </v-col>
                    </v-row>
                  </v-expansion-panel-content>
                </v-expansion-panel>
              </v-expansion-panels>
            </div>
          </app-user-msg-block>

          <!--
            =====================================================================================
             Providers List
            =====================================================================================
            -->
          <swap-providers-list
            :step="step"
            :available-quotes="availableQuotes"
            :set-provider="setProvider"
            :to-token-symbol="toTokenType ? toTokenType.symbol : ''"
            :to-token-icon="toTokenType ? toTokenType.img : ''"
            :is-loading="isLoadingProviders"
            :providers-error="providersErrorMsg"
            class="mt-7"
          />
          <!--
            =====================================================================================
             Swap Fee
            =====================================================================================
          -->
          <app-network-fee
            v-if="step > 0 && providersErrorMsg.subtitle === ''"
            :show-fee="showSwapFee"
            :getting-fee="loadingFee"
            :error="feeError"
            :total-fees="totalFees"
            :gas-price-type="localGasType"
            :message="feeError"
            :not-enough-eth="notEnoughEth"
            is-custom
            class="mt-10 mt-sm-16"
            @onLocalGasPrice="handleLocalGasPrice"
          />
          <div class="text-center mt-10 mt-sm-15">
            <mew-button
              title="Next"
              :has-full-width="false"
              :disabled="disableNext"
              btn-size="xlarge"
              @click.native="showConfirm"
            />
          </div>
        </template>
        <!--
          =====================================================================================
           Message is SWAP NOT Available
          =====================================================================================
        -->
        <template v-else #moduleBody>
          <div class="swap-not-available">
            <app-user-msg-block :message="swapNotAvailableMes" />
          </div>
        </template>
      </mew-module>
    </mew6-white-sheet>
  </div>
</template>

<script>
import SwapBtn from '@/views/components-wallet/TheSwapBtn';
import AppButtonBalance from '@/core/components/AppButtonBalance';
import AppUserMsgBlock from '@/core/components/AppUserMsgBlock';
import ModuleAddressBook from '@/modules/address-book/ModuleAddressBook';
import SwapProvidersList from './components/SwapProvidersList.vue';
import Swapper from './handlers/handlerSwap';
import AppNetworkFee from '@/core/components/AppNetworkFee.vue';
import { toBN, fromWei, toWei, _ } from 'web3-utils';
import { mapGetters, mapState, mapActions } from 'vuex';
import Notification, {
  NOTIFICATION_TYPES,
  NOTIFICATION_STATUS
} from '@/modules/notifications/handlers/handlerNotification';
import BigNumber from 'bignumber.js';
import { Toast, ERROR } from '@/modules/toast/handler/handlerToast';
import { MAIN_TOKEN_ADDRESS } from '@/core/helpers/common';
import { TRENDING_LIST } from './handlers/configs/configTrendingTokens';

const MIN_GAS_LIMIT = 800000;

export default {
  name: 'ModuleSwap',
  components: {
    SwapBtn,
    AppButtonBalance,
    AppUserMsgBlock,
    ModuleAddressBook,
    SwapProvidersList,
    AppNetworkFee
  },
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
      swapNotAvailableMes: {
        title: `Swap is not available on this network`,
        subtitle:
          'Please select ETH, BSC or MATIC networks to use this feature.'
      },
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
        totalFees: ''
      },
      swapper: null,
      toTokenType: {},
      fromTokenType: {},
      tokenInValue: this.amount || '0',
      tokenOutValue: '0',
      availableTokens: { toTokens: [], fromTokens: [] },
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
      isLoadingProviders: false,
      addressValue: {},
      selectedProvider: {},
      localGasPrice: '0',
      localGasType: 'economy'
    };
  },
  computed: {
    ...mapState('swap', ['prefetched', 'swapTokens']),
    ...mapState('wallet', ['web3', 'address', 'balance']),
    ...mapState('global', ['gasPriceType']),
    ...mapGetters('global', [
      'network',
      'gasPrice',
      'isEthNetwork',
      'swapLink'
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
    /**
     *Returns errors messages based on netowrk
     */
    errorMsgs() {
      return {
        amountEthIsTooLow: `You do not have enough ${this.network.type.name} to swap.`,
        amountExceedsEthBalance: `Amount exceeds your ${this.network.type.name} balance.`,
        amountExceedsTxFee: `Amount entered doesn't allow for transaction fee`,
        amountLessThan0: 'Swap amount must be greater than 0',
        doNotOwnToken: 'You do not own this token'
      };
    },
    /**
     * Property returns correct mes
     */
    msg() {
      return {
        lowBalance: {
          title: `Your ${this.network.type.name} balance is too low`,
          subtitle: `Every transaction requires a small amount of ${this.network.type.name} to execute. Even if you have tokens to swap, when your ${this.network.type.name} balance is close to zero, you won't be able to send anything until you fund your account.`
        },
        storeBitcoin: {
          title: `Did you know? You can store your Bitcoin on ${this.network.type.name_long}`,
          subtitle: `To swap to BTC you need a Bitcoin wallet, but you can swap to wrapped Bitcoin instead and store it in your ${this.network.type.name_long} wallet.`
        }
      };
    },
    disableNext() {
      return (
        this.step < 2 ||
        this.amountErrorMessage !== '' ||
        this.feeError !== '' ||
        !this.hasSelectedProvider ||
        this.providersErrorMsg.subtitle !== ''
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
          subError = `${this.selectedProvider.minFrom} ${this.fromTokenType.symbol}`;
        } else if (
          new BigNumber(this.tokenInValue).gt(this.selectedProvider.maxFrom)
        ) {
          msg = 'The maximum requirement for this provider i';
          subError = `${this.selectedProvider.maxFrom} ${this.fromTokenType.symbol}`;
        } else if (this.availableQuotes.length === 0) {
          msg =
            'No providers found for this token pair. Select a different token pair or try again later.';
        } else {
          msg = '';
          subError = '';
        }
      }
      return {
        subtitle: msg,
        subtitleError: subError
      };
    },
    /**
     * @rejects object
     * Gets the ETH token dropdown item details
     */
    mainTokenDetails() {
      const ethToken = this.contractToToken(MAIN_TOKEN_ADDRESS);
      return ethToken;
    },
    /**
     * checks whether both token fields are empty
     */
    enableTokenSwitch() {
      return (
        !_.isEmpty(this.fromTokenType) &&
        !_.isEmpty(this.toTokenType) &&
        !_.isEmpty(this.fromTokenType?.symbol) &&
        !_.isEmpty(this.toTokenType?.symbol)
      );
    },
    /**
     * Fetched tokens from all providers(?) + specific tokens
     * Returns an @Array
     * Check if fromTokenType is ETH
     */
    isFromTokenMain() {
      if (this.isLoading) return false;
      return this.fromTokenType?.contract === MAIN_TOKEN_ADDRESS;
    },
    /**
     * Returns correct balance to be dispalyed above From Selection field
     */
    displayBalance() {
      return this.availableBalance.toString();
    },
    /**
     * @returns object of all the token data
     * to swap to
     */
    actualToTokens() {
      if (this.isLoading) return [];
      const validToTokens = this.toTokens.filter(item => {
        if (
          item.contract.toLowerCase() !==
          this.fromTokenType?.contract?.toLowerCase()
        )
          return item;
      });
      let returnableTokens = [
        {
          text: 'Select Token',
          imgs: this.getPlaceholderImgs(),
          total: `${this.toTokens.length}`,
          divider: true,
          selectLabel: true
        }
      ];
      if (this.trendingTokens.length) {
        returnableTokens = returnableTokens.concat([
          {
            header: 'Trending'
          },
          ...this.trendingTokens,
          {
            header: 'All'
          },
          ...validToTokens
        ]);
      } else {
        returnableTokens = returnableTokens.concat([
          {
            header: 'All'
          },
          ...validToTokens
        ]);
      }
      return returnableTokens;
    },
    /**
     * @returns object of all the tokens
     * to swap to
     */
    toTokens() {
      if (this.isLoading) return [];
      return this.availableTokens.toTokens.map(token => {
        const foundToken = this.contractToToken(token.contract);
        if (foundToken) {
          foundToken.contract = token.contract;
          foundToken.price = foundToken.pricef;
          foundToken.isEth = token.isEth;
          return foundToken;
        }
        token.price = '';
        token.subtext = token.name;
        token.value = token.name;
        token.name = token.symbol;
        return token;
      });
    },
    /**
     * @returns object of all token data
     * to swap from
     */
    actualFromTokens() {
      if (this.isLoading) return [];
      const validFromTokens = this.fromTokens.filter(item => {
        if (
          item.contract.toLowerCase() !==
          this.toTokenType?.contract?.toLowerCase()
        )
          return item;
      });
      let tradebleWalletTokens = this.tokensList.filter(item => {
        for (const vt of validFromTokens) {
          if (vt.contract.toLowerCase() === item?.contract?.toLowerCase())
            return item;
        }
      });
      tradebleWalletTokens = this.formatTokensForSelect(tradebleWalletTokens);
      const returnableTokens = [
        {
          text: 'Select Token',
          imgs: this.getPlaceholderImgs(true),
          total:
            this.tokensList.length > 0
              ? this.tokensList.length
              : `${this.toTokens.length}`,
          divider: true,
          selectLabel: true
        },
        {
          header: 'My Wallet'
        },
        ...tradebleWalletTokens,
        {
          header: 'Other Tokens'
        },
        ...validFromTokens
      ];
      return returnableTokens;
    },
    /**
     * @returns object of other tokens
     * to swap from
     */
    fromTokens() {
      return this.availableTokens.fromTokens.map(token => {
        const foundToken = this.contractToToken(token.contract);
        if (foundToken) {
          foundToken.isEth = token.isEth;
          return foundToken;
        }
        token.price = '0.00';
        token.subtext = token.name;
        token.value = token.name;
        token.name = token.symbol;
        return token;
      });
    },
    /**
     * @returns all trending tokens
     * to swap to
     */
    trendingTokens() {
      if (!TRENDING_LIST[this.network.type.name]) return [];
      return TRENDING_LIST[this.network.type.name]
        .filter(token => {
          return token.contract !== this.fromTokenType?.contract;
        })
        .map(token => {
          if (token.cgid) {
            const foundToken = this.getCoinGeckoTokenById(token.cgid);
            foundToken.price = foundToken.pricef;
            return Object.assign(token, foundToken);
          }
          const foundToken = this.contractToToken(token.contract);
          if (foundToken) {
            token = Object.assign(token, foundToken);
            token.price = token.pricef;
          }
          return token;
        });
    },
    totalFees() {
      const gasPrice =
        this.localGasPrice === '0' ? this.gasPrice : this.localGasPrice;
      return toBN(this.totalGasLimit).mul(toBN(gasPrice)).toString();
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
    toAddress() {
      if (this.toTokenType?.isEth) return this.address;
      return this.addressValue.value;
    },
    isToAddressValid() {
      if (this.toTokenType?.isEth) return true;
      return this.addressValue.isValid;
    },
    /**
     * Checks whether or not teh user has a minimum eth balance to swap:
     * @returns{boolean}
     */
    hasMinEth() {
      return toBN(this.balanceInWei).gt(
        toBN(this.localGasPrice).muln(MIN_GAS_LIMIT)
      );
    },

    /**
     * Checks whether the user has enough
     * balance for the transaction
     */
    notEnoughEth() {
      const balanceAfterFees = toBN(this.balance).sub(toBN(this.totalFees));
      const isNotEnoughEth = this.isFromTokenMain
        ? balanceAfterFees.sub(toBN(toWei(this.tokenInValue))).isNeg()
        : balanceAfterFees.isNeg();
      return isNotEnoughEth;
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
        return hasBalance && hasBalance.balance && hasBalance.decimals
          ? this.getTokenBalance(hasBalance.balance, hasBalance.decimals)
          : new BigNumber(0);
      }
      return new BigNumber(0);
    },
    /**
     * Determines whether or not to show swap fee panel
     * Fee is shown if provider was selected and no errors are passed
     */
    showSwapFee() {
      return this.step >= 2 && this.availableBalance.gt(0);
    },
    /**
     * Method validates input for the From token amount against user input
     * Used to show error messages for the amount input component
     */
    amountErrorMessage() {
      if (!this.initialLoad && !this.isLoading) {
        /* Balance is <= 0*/
        if (this.availableBalance.lte(0)) {
          return this.isFromTokenMain
            ? this.errorMsgs.amountEthIsTooLow
            : this.tokensList.length > 0 && !this.isFromTokenMain
            ? this.errorMsgs.doNotOwnToken
            : '';
        }
        if (
          !Swapper.helpers.hasValidDecimals(
            this.tokenInValue,
            this.fromTokenType.decimals
          )
        ) {
          return `Provided amount exceeds valid decimal.`;
        }
        /*Eth Balance is to low to send a transaction*/
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
      return !_.isEmpty(this.selectedProvider);
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
    },
    network() {
      if (this.isAvailable) {
        this.clear();
      }
    },
    mainTokenDetails() {
      this.setDefaults();
    },
    amountErrorMessage(newVal) {
      if (newVal !== '') this.availableQuotes.splice(0);
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
    this.setupSwap();
  },
  methods: {
    ...mapActions('notifications', ['addNotification']),
    ...mapActions('swap', ['setSwapTokens']),
    setupSwap() {
      this.isLoading = !this.prefetched;
      this.swapper = new Swapper(this.web3, this.network.type.name);
      if (!this.prefetched) {
        this.swapper
          .getAllTokens()
          .then(this.processTokens)
          .then(() => {
            this.setDefaults();
            this.isLoading = false;
          });
      } else {
        this.processTokens(this.swapTokens, false);
        this.setDefaults();
        this.isLoading = false;
      }
      this.handleLocalGasPrice({
        gasType: this.gasPriceType,
        gasPrice: this.gasPrice
      });
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
        totalFees: ''
      };

      this.toTokenswapper = null;
      this.toTokentoTokenType = {};
      this.toTokenfromTokenType = {};
      this.toTokentokenInValue = '0';
      this.toTokentokenOutValue = '0';
      this.availableTokens = { toTokens: [], fromTokens: [] };
      this.availableQuotes = [];
      this.currentTrade = null;
      this.allTrades = [];
      this.isLoading = false;
      this.loadingFee = false;
      this.feeError = '';
      this.defaults = {
        fromToken: this.fromToken
      };
      this.isLoadingProviders = false;
      this.addressValue = {};
      this.selectedProvider = {};
      this.localGasPrice = '0';
      this.localGasType = 'economy';
      this.$refs.toToken.clear();
      this.$refs.amountInput.clear();
      this.setupSwap();
    },
    formatTokensForSelect(tokens) {
      if (!Array.isArray(tokens)) return [];
      return tokens.map(t => {
        t.totalBalance = t.usdBalancef;
        t.tokenBalance = t.balancef;
        t.price = t.pricef;
        return t;
      });
    },
    /**
     * Set the max available amount to swap from
     */
    setMaxAmount() {
      const availableBalanceMinusGas = new BigNumber(
        this.availableBalance
      ).minus(fromWei(toBN(this.localGasPrice).muln(MIN_GAS_LIMIT)));
      this.tokenInValue = this.isFromTokenMain
        ? availableBalanceMinusGas.gt(0)
          ? availableBalanceMinusGas.toFixed()
          : '0'
        : this.availableBalance.toFixed();
    },
    /**
     * Gets the default from token
     */
    getDefaultFromToken() {
      const findToken = this.actualFromTokens.find(item => {
        if (item.contract === this.defaults.fromToken) return item;
      });
      if (
        this.defaults.fromToken === MAIN_TOKEN_ADDRESS &&
        new BigNumber(this.balanceInETH).gt(0)
      ) {
        return this.mainTokenDetails;
      }
      return findToken ? findToken : this.actualFromTokens[0];
    },
    getDefaultToToken() {
      const findToken = this.actualToTokens.find(item => {
        if (item.contract === this.defaults.toToken) return item;
      });
      if (
        this.defaults.toToken === MAIN_TOKEN_ADDRESS &&
        new BigNumber(this.balanceInETH).gt(0)
      ) {
        return this.mainTokenDetails;
      }
      return findToken ? findToken : this.actualFromTokens[0];
    },
    /**
     * gets the select label placeholder token imgs
     */
    getPlaceholderImgs() {
      if (this.tokensList.length > 0) {
        return this.tokensList.slice(0, 5).map(item => {
          return item.img ? item.img : this.network.type.icon;
        });
      }
      return [];
    },
    buyEth() {
      // eslint-disable-next-line
      window.open(`${this.swapLink}`, '_blank');
    },
    switchTokens() {
      const fromToken = _.clone(this.fromTokenType);
      const toToken = _.clone(this.toTokenType);
      this.setFromToken(toToken);
      this.setToToken(fromToken);
    },
    processTokens(tokens, storeTokens) {
      this.availableTokens = tokens;
      if (_.isUndefined(storeTokens)) {
        this.setSwapTokens(tokens);
      }
    },
    setDefaults() {
      setTimeout(() => {
        this.fromTokenType = this.getDefaultFromToken();
        if (this.defaults.toToken) {
          this.toTokenType = this.getDefaultToToken();
        }
        this.setTokenInValue(this.tokenInValue);
      }, 500);
    },
    setToAddress(value, isValid) {
      this.addressValue = {
        value,
        isValid
      };
      if (isValid) this.setProvider(0);
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
      /**
       * Ensure that both pairs have been set
       * before calling the providers
       */
      this.belowMinError = false;
      if (this.isLoading || this.initialLoad) return;
      this.tokenInValue = value || '0';
      // Check if (in amount) is larger than (available balance)
      if (this.availableBalance.lt(new BigNumber(this.tokenInValue))) {
        this.step = 0;
        return;
      }
      this.tokenOutValue = '0';
      this.availableQuotes.forEach(q => {
        if (q) {
          q.isSelected = false;
        }
      });
      this.availableQuotes = [];
      this.allTrades = [];
      this.step = 0;

      this.feeError = '';
      if (
        this.tokenInValue !== '' &&
        this.tokenInValue > 0 &&
        this.enableTokenSwitch
      ) {
        this.isLoadingProviders = true;
        this.swapper
          .getAllQuotes({
            fromT: this.fromTokenType,
            toT: this.toTokenType,
            fromAmount: new BigNumber(this.tokenInValue).times(
              new BigNumber(10).pow(new BigNumber(this.fromTokenType.decimals))
            )
          })
          .then(quotes => {
            this.selectedProvider = {};
            this.availableQuotes = quotes.map(q => {
              q.rate = new BigNumber(q.amount)
                .dividedBy(new BigNumber(this.tokenInValue))
                .toString();
              q.isSelected = false;
              return q;
            });
            if (this.availableQuotes.length > 1) {
              this.availableQuotes = quotes.filter(q => q.rate !== '0');
            }
            if (quotes.length) {
              this.tokenOutValue = quotes[0].amount;
              this.step = 1;
            }
            this.isLoadingProviders = false;
          });
      }
    }, 1000),
    setProvider(idx) {
      this.belowMinError = false;
      this.availableQuotes.forEach((q, _idx) => {
        if (_idx === idx) {
          q.isSelected = true;
          this.tokenOutValue = q.amount;
          this.getTrade(idx);
          this.selectedProvider = q !== this.selectedProvider ? q : {};
        }
      });
    },
    getTrade: _.debounce(function (idx) {
      if (!this.isToAddressValid || !this.availableQuotes[idx]) return;
      this.step = 1;
      this.feeError = '';
      this.loadingFee = true;
      if (this.allTrades[idx]) return this.setupTrade(this.allTrades[idx]);
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
          this.allTrades[idx] = trade;
          this.setupTrade(trade);
        })
        .catch(e => {
          if (e) {
            this.feeError = 'This provider is not available.';
          }
        });
    }, 500),
    setupTrade(trade) {
      if (trade instanceof Error) {
        this.feeError = 'Provider issue';
        return;
      }
      this.currentTrade = trade;
      this.currentTrade.gasPrice = this.localGasPrice;
      this.exPannel[0].subtext = `${fromWei(this.totalFees)} ${
        this.network.type.name
      }`;
      this.step = 2;
      this.loadingFee = false;
      this.checkFeeBalance();
    },
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
        toUsdVal: BigNumber(this.toTokenType.price ? this.toTokenType.price : 0)
          .times(this.tokenOutValue)
          .toFixed(),
        fromUsdVal: this.fromTokenType.usdBalance,
        validUntil: new Date().getTime() + 10 * 60 * 1000,
        selectedProvider: this.selectedProvider,
        totalFees: this.totalFees,
        gasPriceType: this.localGasType
      };
      this.executeTrade();
    },
    isValidToAddress(address) {
      if (this.availableQuotes.length > 0) {
        return this.swapper.isValidToAddress({
          provider: this.availableQuotes[0].provider,
          toT: this.toTokenType,
          address
        });
      }
      return true;
    },

    executeTrade() {
      const currentTradeCopy = _.clone(this.currentTrade);
      this.swapper
        .executeTrade(this.currentTrade, this.confirmInfo)
        .then(res => {
          this.swapNotificationFormatter(res, currentTradeCopy);
        })
        .catch(err => {
          this.clear();
          Toast(err.message, {}, ERROR);
        });
    },
    getTokenBalance(balance, decimals) {
      return new BigNumber(balance.toString()).div(
        new BigNumber(10).pow(decimals)
      );
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
        this.addNotification(new Notification(notif)).then(this.clear);
      });
    },
    checkFeeBalance() {
      this.feeError = '';
      if (this.notEnoughEth) {
        const buyMoreStr = this.isEthNetwork ? ' or buy more ETH.' : '.';
        this.feeError = `Not enough ${this.network.type.name} to cover network fee. Select a different provider${buyMoreStr}`;
      }
    },
    handleLocalGasPrice(e) {
      this.localGasPrice = e.gasPrice;
      if (this.currentTrade) this.currentTrade.gasPrice = this.localGasPrice;
      this.localGasType = e.gasType;
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

.border-top {
  border-top: 1px solid var(--v-inputBorder-base);
}

.swap-not-available {
  @media (min-width: 960px) {
    min-height: 45vh;
  }
}

.swap-to-input {
  pointer-events: none !important;
  user-select: none !important;
}
</style>
