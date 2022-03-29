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
          <div class="input-swap-container pt-7 pb-3 px-5">
            <v-row class="align-start justify-space-between mt-4">
              <v-col cols="12" sm="5" class="pb-0 pb-sm-3 pr-sm-0">
                <div class="position--relative">
                  <app-button-balance
                    v-show="!isFromNonChain"
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
                      ? network.type.canBuy
                        ? 'Buy more.'
                        : ''
                      : null
                  "
                  :max-btn-obj="maxBtn"
                  @buyMore="openMoonpay"
                  @input="setTokenInValue"
              /></v-col>
              <v-col
                cols="12"
                align-self="center"
                sm="2"
                class="px-6 py-0 py-sm-3 mb-3 mb-sm-0"
              >
                <div class="d-flex align-center justify-center pb-sm-10">
                  <mew-icon-button
                    mdi-icon="swap-horizontal"
                    class="pa-2 d-flex align-center justify-center"
                    color-theme="basic"
                    btn-style="light"
                    :disabled="!enableTokenSwitch"
                    @click.native="switchTokens"
                  />
                </div>
              </v-col>
              <v-col cols="12" sm="5" class="pb-0 pb-sm-3 pl-sm-0">
                <mew-select
                  ref="toToken"
                  :value="toTokenType"
                  :items="actualToTokens"
                  :is-custom="true"
                  :loading="isLoading"
                  label="To"
                  @input="setToToken"
                />
                <mew-input
                  label="Amount"
                  placeholder="0"
                  type="number"
                  :hide-clear-btn="true"
                  :value="tokenOutValue"
                  is-read-only
                />
              </v-col>
            </v-row>
          </div>

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
                :title="`Buy ${network.type.currencyName}`"
                class="ma-1"
                :has-full-width="$vuetify.breakpoint.xsOnly"
                @click.native="openMoonpay"
              />
            </div>
          </app-user-msg-block>

          <!--
            =====================================================================================
              Address Book
            =====================================================================================
            -->
          <div class="mt-8">
            <module-address-book
              v-if="isFromNonChain"
              ref="refundAddressInput"
              :label="nativeLabel"
              :is-valid-address-func="isValidRefundAddress"
              @setAddress="setRefundAddr"
            />
            <module-address-book
              v-show="showToAddress"
              ref="toAddressInput"
              :is-valid-address-func="isValidToAddress"
              :label="toAddressLabel"
              @setAddress="setToAddress"
            />
          </div>

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
                    color="greyLight"
                    class="textLight--text"
                  >
                    How can I get wrapped Bitcoin?
                  </v-expansion-panel-header>
                  <v-expansion-panel-content color="greyLight" class="pa-0">
                    <div class="textLight--text mb-2">
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
                        href="https://help.myetherwallet.com/en/articles/5461528-move-your-btc-to-the-ethereum-blockchain-with-mew-swap"
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
                          @click.native="swapTo('renBTC')"
                        />
                      </v-col>
                      <v-col cols="12" md="4">
                        <mew-button
                          btn-size="small"
                          btn-style="outline"
                          title="Swap to wBTC"
                          :has-full-width="true"
                          @click.native="swapTo('wBTC')"
                        />
                      </v-col>
                      <v-col cols="12" md="4">
                        <mew-button
                          btn-size="small"
                          btn-style="outline"
                          title="Swap to PBTC"
                          :has-full-width="true"
                          @click.native="swapTo('PBTC')"
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
          <div v-if="hasMinEth">
            <v-slide-y-transition v-if="showAnimation" hide-on-leave group>
              <swap-provider-mentions
                key="showAnimation"
                :is-loading="isLoadingProviders"
                :check-loading="checkLoading"
                @showProviders="showProviders"
              />
            </v-slide-y-transition>
            <div v-else key="showAnimation1">
              <swap-providers-list
                :step="step"
                :available-quotes="availableQuotes"
                :set-provider="setProvider"
                :to-token-symbol="toTokenType ? toTokenType.symbol : ''"
                :to-token-icon="toTokenType ? toTokenType.img : ''"
                :is-loading="isLoadingProviders"
                :providers-error="providersErrorMsg"
                :class="isFromNonChain ? '' : 'mt-7'"
              />
              <!--
                  =====================================================================================
                  Swap Fee
                  =====================================================================================
                -->
              <app-transaction-fee
                v-if="showNetworkFee"
                :is-from-chain="!isFromNonChain"
                :show-fee="showSwapFee"
                :getting-fee="loadingFee"
                :error="feeError"
                :total-cost="totalCost"
                :tx-fee="txFee"
                :total-gas-limit="totalGasLimit"
                :not-enough-eth="notEnoughEth"
                :from-eth="isFromTokenMain"
                class="mt-10 mt-sm-16"
                @onLocalGasPrice="handleLocalGasPrice"
              />
              <div v-if="showNextButton" class="text-center mt-10 mt-sm-15">
                <mew-button
                  title="Next"
                  :has-full-width="true"
                  :disabled="disableNext"
                  btn-size="xlarge"
                  style="max-width: 240px"
                  @click.native="showConfirm()"
                />
              </div>
            </div>
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
import MultiCoinValidator from 'multicoin-address-validator';
import AppButtonBalance from '@/core/components/AppButtonBalance';
import AppUserMsgBlock from '@/core/components/AppUserMsgBlock';
import ModuleAddressBook from '@/modules/address-book/ModuleAddressBook';
import SwapProvidersList from './components/SwapProvidersList.vue';
import SwapProviderMentions from './components/SwapProviderMentions.vue';
import Swapper from './handlers/handlerSwap';
import AppTransactionFee from '@/core/components/AppTransactionFee.vue';
import { toBN, fromWei, toWei, isAddress } from 'web3-utils';
import { isEmpty, clone, isUndefined, debounce, isObject } from 'lodash';
import { mapGetters, mapState, mapActions } from 'vuex';
import Notification, {
  NOTIFICATION_TYPES,
  NOTIFICATION_STATUS
} from '@/modules/notifications/handlers/handlerNotification';
import NonChainNotification from '@/modules/notifications/handlers/nonChainNotification';
import BigNumber from 'bignumber.js';
import { Toast, ERROR, SUCCESS } from '@/modules/toast/handler/handlerToast';
import { MAIN_TOKEN_ADDRESS } from '@/core/helpers/common';
import { TRENDING_LIST } from './handlers/configs/configTrendingTokens';
import handlerAnalytics from '@/modules/analytics-opt-in/handlers/handlerAnalytics.mixin';

import xss from 'xss';
import buyMore from '@/core/mixins/buyMore.mixin.js';

const MIN_GAS_LIMIT = 800000;

export default {
  name: 'ModuleSwap',
  components: {
    AppButtonBalance,
    AppUserMsgBlock,
    ModuleAddressBook,
    SwapProvidersList,
    SwapProviderMentions,
    AppTransactionFee
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
        txFee: ''
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
      isLoadingProviders: false,
      showAnimation: false,
      checkLoading: true,
      addressValue: {},
      selectedProvider: {},
      refundAddress: '',
      isValidRefundAddr: false,
      localGasPrice: '0',
      mainTokenDetails: {}
    };
  },
  computed: {
    ...mapState('swap', ['prefetched', 'swapTokens']),
    ...mapState('wallet', ['web3', 'address', 'balance']),
    ...mapState('global', ['gasPriceType', 'preferredCurrency']),
    ...mapGetters('global', ['network', 'isEthNetwork', 'gasPriceByType']),
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
     * @returns string
     * is used as a label for module-address-book
     */
    nativeLabel() {
      return `Your ${this.fromTokenType?.name} refund address`;
    },
    /**
     * @returns a boolean
     * based on how the swap state is
     */
    showNetworkFee() {
      return this.showNextButton && !this.isFromNonChain;
    },
    /**
     * @returns a boolean
     * based on how the swap state is
     */
    showNextButton() {
      return (
        this.step > 0 &&
        this.providersErrorMsg.subtitle === '' &&
        !this.isLoadingProviders
      );
    },
    /**
     * @returns an object
     * if native token, return empty
     */
    maxBtn() {
      return this.isFromNonChain
        ? {}
        : {
            title: 'Max',
            disabled:
              !this.hasMinEth &&
              this.amountErrorMessage === this.errorMsgs.amountEthIsTooLow,
            method: this.setMaxAmount
          };
    },
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
          subError = `${this.selectedProvider.minFrom} ${this.fromTokenType.symbol}`;
        } else if (
          new BigNumber(this.tokenInValue).gt(this.selectedProvider.maxFrom)
        ) {
          msg = 'The maximum requirement for this provider is';
          subError = `${this.selectedProvider.maxFrom} ${this.fromTokenType.symbol}`;
        } else if (this.availableQuotes.length === 0) {
          msg =
            'No providers found for this token pair. Select a different token pair or try again later.';
        } else if (this.feeError === 'Invalid Input') {
          msg =
            'Provided input is invalid or provider is having issues. Please try again!';
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
    // mainTokenDetails() {
    //   const ethToken = this.contractToToken(MAIN_TOKEN_ADDRESS);
    //   return ethToken;
    // },
    /**
     * checks whether both token fields are empty
     */
    enableTokenSwitch() {
      return (
        !this.isLoading &&
        ((!isEmpty(this.fromTokenType) &&
          !isEmpty(this.fromTokenType?.symbol)) ||
          (!isEmpty(this.toTokenType) && !isEmpty(this.toTokenType?.symbol)))
      );
    },
    /**
     * Checks whether selected from token is
     * the network's currency
     */
    isFromTokenMain() {
      if (this.isLoading) return false;
      return this.fromTokenType?.contract === MAIN_TOKEN_ADDRESS;
    },
    /**
     * Check if fromTokenType is a native token
     * from other chains
     */
    isFromNonChain() {
      if (this.isLoading) return false;
      return this.fromTokenType?.hasOwnProperty('isEth')
        ? !this.fromTokenType?.isEth
        : !isAddress(this.fromTokenType?.contract);
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
      const filteredTrendingTokens = this.trendingTokens.length
        ? this.trendingTokens.filter(token => {
            return token.contract !== this.fromTokenType?.contract;
          })
        : [];
      let returnableTokens = [
        {
          text: 'Select Token',
          imgs: this.getPlaceholderImgs(),
          total: `${this.toTokens.length}`,
          divider: true,
          selectLabel: true
        }
      ];
      if (filteredTrendingTokens.length) {
        returnableTokens = returnableTokens.concat([
          {
            header: 'Trending'
          },
          ...filteredTrendingTokens,
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
      return this.availableTokens.toTokens
        .map(token => {
          if (token.cgid) {
            const foundToken = this.getCoinGeckoTokenById(token.cgid);
            foundToken.price = this.currencyFormatter(foundToken.pricef);
            foundToken.name = token.symbol;
            return Object.assign(token, foundToken);
          }
          const foundToken = this.contractToToken(token.contract);
          if (foundToken) {
            foundToken.contract = token.contract;
            foundToken.price = this.currencyFormatter(foundToken.pricef);
            foundToken.isEth = token.isEth;
            foundToken.name = token.symbol;
            return foundToken;
          }
          const name = token.name;
          token.price = '';
          token.subtext = name;
          token.value = name;
          token.name = token.symbol;
          return token;
        })
        .filter(
          item => item.name !== '' && item.symbol !== '' && item.subtext !== ''
        );
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
      let nonChainTokens = this.availableTokens.fromTokens.filter(item => {
        if (
          item.hasOwnProperty('isEth') &&
          !item.isEth &&
          item.name &&
          item.symbol &&
          item.subtext
        ) {
          return item;
        }
      });
      tradebleWalletTokens = this.formatTokensForSelect(tradebleWalletTokens);
      nonChainTokens = this.formatTokensForSelect(nonChainTokens);
      let returnableTokens = [
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
        ...tradebleWalletTokens
      ];
      if (nonChainTokens.length > 0) {
        returnableTokens = returnableTokens.concat([
          {
            header: 'Cross-Chain Tokens'
          },
          ...nonChainTokens
        ]);
      }
      return returnableTokens.concat([
        {
          header: 'Other Tokens'
        },
        ...validFromTokens
      ]);
    },
    /**
     * @returns object of other tokens
     * to swap from
     */
    fromTokens() {
      return this.availableTokens.fromTokens.map(token => {
        const foundToken = this.contractToToken(token.contract);
        if (foundToken) {
          foundToken.contract = token.contract;
          foundToken.price = this.currencyFormatter(foundToken.pricef);
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
            foundToken.price = this.currencyFormatter(foundToken.pricef);
            return Object.assign(token, foundToken);
          }
          const foundToken = this.contractToToken(token.contract);
          if (foundToken) {
            token = Object.assign(token, foundToken);
            token.price = this.currencyFormatter(token.pricef);
          }
          const name = token.name;
          token.price = '0.00';
          token.subtext = name;
          token.value = name;
          token.name = token.symbol;
          return token;
        })
        .filter(
          item => item.name !== '' && item.symbol !== '' && item.subtext !== ''
        );
    },
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
        2;
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
     * Checks whether or not the user has a minimum eth balance to swap:
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
        return this.isFromTokenMain
          ? this.getTokenBalance(this.balanceInWei, 18)
          : hasBalance && hasBalance.balance && hasBalance.decimals
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
      if (!this.initialLoad && !this.isLoading && this.fromTokenType?.name) {
        /* Balance is <= 0*/

        if (this.availableBalance.lte(0)) {
          return this.isFromTokenMain
            ? this.errorMsgs.amountEthIsTooLow
            : this.tokensList.length > 0 &&
              !this.isFromTokenMain &&
              !this.isFromNonChain
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
      return !isEmpty(this.selectedProvider);
    },
    toAddressLabel() {
      const name =
        !isEmpty(this.toTokenType) && this.toTokenType.hasOwnProperty('name')
          ? this.toTokenType.name
          : 'ETH';
      return `To ${name} address`;
    }
  },
  watch: {
    tokenInValue() {
      this.feeError = '';
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
    '$route.query': {
      handler: function () {
        this.setTokenFromURL();
      }
    }
  },
  beforeMount() {
    this.setTokenFromURL();
  },
  mounted() {
    this.mainTokenDetails = this.contractToToken(MAIN_TOKEN_ADDRESS);
    this.setupSwap();
    // multi value watcher to clear
    // refund address and to address
    this.$watch(
      vm => [vm.toTokenType, vm.fromTokenType],
      () => {
        if (this.$refs.refundAddressInput) {
          this.$refs.refundAddressInput.clear();
        }

        if (this.$refs.toAddressInput) {
          this.$refs.toAddressInput.clear();
        }
      }
    );
  },
  methods: {
    ...mapActions('notifications', ['addNotification']),
    ...mapActions('swap', ['setSwapTokens']),
    /**
     * Handles emitted values from
     * module-address-book
     */
    setRefundAddr(address, valid) {
      this.refundAddress = address;
      this.isValidRefundAddr = valid;
      this.setTokenInValue(this.tokenInValue);
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
    swapTo(to) {
      const findToken = this.toTokens.find(
        item => item.symbol.toLowerCase() === to.toLowerCase()
      );
      this.toTokenType = findToken;
    },
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

      this.localGasPrice = this.gasPriceByType(this.gasPriceType);
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

      this.swapper = null;
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
      this.defaults = {
        fromToken: this.fromToken
      };
      this.isLoadingProviders = false;
      this.checkLoading = true;
      this.addressValue = {};
      this.selectedProvider = {};
      this.localGasPrice = '0';
      if (this.$refs.toToken) this.$refs.toToken.clear();
      if (this.$refs.amountInput) this.$refs.amountInput.clear();
      this.refundAddress = '';
      this.isValidRefundAddr = false;
      this.setupSwap();
    },
    // replace this once localization is merged
    currencyFormatter(val) {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: this.preferredCurrency,
        currencyDisplay: 'narrowSymbol'
      }).format(val.replace(',', ''));
    },
    formatTokensForSelect(tokens) {
      if (!Array.isArray(tokens)) return [];
      return tokens.map(t => {
        t.totalBalance = t.hasOwnProperty('usdBalancef')
          ? this.currencyFormatter(t.usdBalancef)
          : '0.00';
        t.tokenBalance = t.hasOwnProperty('balancef')
          ? this.currencyFormatter(t.balancef)
          : '0.00';
        t.price = t.hasOwnProperty('pricef')
          ? this.currencyFormatter(t.pricef)
          : '0.00';
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
    switchTokens() {
      const fromToken = clone(this.fromTokenType);
      const toToken = clone(this.toTokenType);
      this.tokenInValue = '0';
      this.setFromToken(toToken);
      this.setToToken(fromToken);
    },
    processTokens(tokens, storeTokens) {
      this.availableTokens = tokens;
      if (isUndefined(storeTokens)) {
        this.setSwapTokens(tokens);
      }
    },
    setDefaults() {
      setTimeout(() => {
        this.fromTokenType = this.getDefaultFromToken();
        this.toTokenType = this.getDefaultToToken();
        this.setTokenInValue(this.tokenInValue);
      }, 500);
    },
    setFromToken(value) {
      this.fromTokenType = value;
      this.$nextTick(() => {
        if (value && value.name) {
          this.trackSwap('from: ' + value.name);
        }
        this.setTokenInValue(this.tokenInValue);
      });
    },
    setToToken(value) {
      this.toTokenType = value;
      if (value && value.name) {
        this.trackSwap('to: ' + value.name);
      }
      this.setTokenInValue(this.tokenInValue);
    },
    setTokenInValue: debounce(function (value) {
      /**
       * Ensure that both pairs have been set
       * before calling the providers
       */
      this.belowMinError = false;
      if (this.isLoading || this.initialLoad) return;
      this.tokenInValue = value || '0';
      // Check if (in amount) is larger than (available balance)
      if (
        !this.isFromNonChain &&
        (this.availableBalance.lt(new BigNumber(this.tokenInValue)) ||
          !this.hasMinEth)
      ) {
        this.step = 0;
        return;
      }

      if (isEmpty(this.fromTokenType)) {
        Toast('From token cannot be empty!', {}, ERROR);
        return;
      }

      if (
        !Swapper.helpers.hasValidDecimals(
          this.tokenInValue,
          this.fromTokenType.decimals
        )
      ) {
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

      if (
        this.isFromNonChain &&
        (this.refundAddress === '' || !this.isValidRefundAddr)
      )
        return;
      if (this.showToAddress && !this.addressValue.isValid) return;

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
            }
            this.step = 1;
            this.isLoadingProviders = false;
          });
      }
    }, 500),
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
    getTrade: debounce(function (idx) {
      if (this.isFromNonChain && !this.isValidRefundAddr) {
        return;
      }
      if (this.isFromNonChain && !this.isValidRefundAddr) {
        return;
      }

      if (this.availableQuotes.length === 0) {
        return;
      }

      this.feeError = '';
      if (this.allTrades.length > 0 && this.allTrades[idx])
        return this.setupTrade(this.allTrades[idx]);
      if (!this.allTrades[idx]) {
        this.loadingFee = true;
      }
      const swapObj = {
        fromAddress: this.address,
        toAddress: this.toAddress,
        provider: this.availableQuotes[idx].provider,
        fromT: this.fromTokenType,
        toT: this.toTokenType,
        quote: this.availableQuotes[idx],
        fromAmount: new BigNumber(this.tokenInValue).times(
          new BigNumber(10).pow(new BigNumber(this.fromTokenType.decimals))
        )
      };

      if (this.isFromNonChain) {
        swapObj['refundAddress'] = this.refundAddress;
      }
      const trade = this.swapper.getTrade(swapObj);
      if (trade instanceof Promise) {
        trade.then(tradeResponse => {
          if (
            isObject(tradeResponse) &&
            tradeResponse.hasOwnProperty('provider')
          ) {
            this.allTrades[idx] = tradeResponse;
          }
          this.setupTrade(tradeResponse);
        });
      } else {
        this.setupTrade(trade);
      }
    }, 500),
    setupTrade(trade) {
      this.loadingFee = false;
      // fixes race case where address gets invalidated when
      // transaction is still loading
      if (this.availableQuotes.length > 0) {
        this.step = 2;
      }
      if (trade instanceof Error || !trade) {
        this.feeError = 'Provider issue';
        return;
      }
      this.feeError = '';
      this.currentTrade = trade;
      this.currentTrade.gasPrice = this.localGasPrice;
      if (!this.isFromNonChain) {
        this.currentTrade.gasPrice = this.localGasPrice;
        this.checkFeeBalance();
      }
    },
    showConfirm() {
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

      if (this.isFromNonChain) {
        obj['refundAddress'] = this.refundAddress;
      }
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
      return MultiCoinValidator.validate(address, this.toTokenType.name);
    },
    isValidRefundAddress(address) {
      try {
        return MultiCoinValidator.validate(address, this.fromTokenType.name);
      } catch (e) {
        return this.swapper.isValidToAddress({
          provider: 'changelly',
          toT: this.fromTokenType,
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
              Toast(item.message, {}, ERROR);
            });
            return;
          }
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
        const main = {
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
          }
        };

        if (this.isFromNonChain) {
          const notif = Object.assign(
            {
              swapObj: obj,
              to: this.toAddress
            },
            main
          );
          this.addNotification(new NonChainNotification(notif)).then(() => {
            const currency = this.fromTokenType.symbol;
            Toast(
              `Swap initiated, you should receive ${currency} in 1-3 hours. You will be notified when it's completed`,
              {},
              SUCCESS
            );
            this.clear();
          });
        } else {
          const notif = Object.assign(
            {
              hash,
              swapObj: obj
            },
            main,
            currentTrade.transactions[idx]
          );
          this.addNotification(new Notification(notif)).then(this.clear);
        }
      });
    },
    checkFeeBalance() {
      this.feeError = '';
      if (this.notEnoughEth) {
        this.feeError = `Not enough ${this.network.type.name} to pay for transaction fee.`;
      }
    },
    setTokenFromURL() {
      if (Object.keys(this.$route.query).length > 0) {
        const { fromToken, toToken, amount } = this.stripQuery(
          this.$route.query
        );
        this.defaults = {
          fromToken,
          toToken
        };
        this.tokenInValue = amount ? `${amount}` : '0';
      }
    },
    stripQuery(queryObj) {
      const newObj = {};
      Object.keys(queryObj).forEach(key => {
        newObj[key] = xss(queryObj[key]);
      });
      return newObj;
    },
    showProviders(val) {
      if (!this.isLoadingProviders && val) {
        this.showAnimation = false;
      }
    },
    handleLocalGasPrice(e) {
      this.localGasPrice = e;
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
  border-top: 1px solid var(--v-greyMedium-base);
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

.pb-sm-15px {
  padding-bottom: 15px !important;
}

.pb-sm-29px {
  padding-bottom: 29px !important;
}
</style>
