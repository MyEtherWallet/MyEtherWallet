<template>
  <div class="swap-container">
    <swap-confirmation-modal
      ref="swapConfirmation"
      :selected-provider="selectedProvider"
      :swap-details="swapDetails"
      :current-address="currentAddress"
      @swapStarted="resetSwapState"
    />

    <swap-send-to-modal
      ref="swapSendTo"
      :selected-provider="selectedProvider"
      :swap-details="swapDetails"
      :current-address="currentAddress"
      @swapStarted="resetSwapState"
    />

    <div class="title-block">
      <interface-container-title :title="$t('common.swap')" />
    </div>

    <div class="form-content-container">
      <div class="send-form">
        <div class="form-block amount-to-address">
          <div class="amount">
            <div class="title title-and-copy">
              <h4>{{ $t('common.from') }}</h4>
              <p
                v-if="tokenBalances[fromCurrency] > 0"
                class="all-button prevent-user-select"
                @click="swapAll"
              >
                {{ $t('common.totalBalance') }}
              </p>
            </div>
            <swap-currency-picker
              :currencies="fromArray"
              :override-currency="overrideFrom"
              :from-source="true"
              page="SwapContainerFrom"
              @selectedCurrency="setFromCurrency"
            />
            <div class="the-form amount-number">
              <input
                v-model="fromValue"
                type="number"
                name
                value
                placeholder="Deposit Amount"
                @input="amountChanged('from')"
              />
            </div>
            <div class="error-message-container">
              <p v-if="fromBelowMinAllowed">{{ fromBelowMinAllowed }}</p>
              <p v-if="notEnough && !fromBelowMinAllowed">
                {{ $t('common.dontHaveEnough') }}
              </p>
              <p v-if="fromAboveMaxAllowed">{{ fromAboveMaxAllowed }}</p>
            </div>
          </div>
          <div class="exchange-icon" @click="flipCurrencies">
            <img :src="images.swap" />
          </div>
          <div class="amount">
            <div class="title">
              <h4>{{ $t('common.to') }}</h4>
            </div>
            <swap-currency-picker
              :currencies="toArray"
              :override-currency="overrideTo"
              :from-source="false"
              page="SwapContainerTo"
              @selectedCurrency="setToCurrency"
            />
            <div class="the-form amount-number">
              <input
                v-model="toValue"
                type="number"
                name
                value
                placeholder="Received Amount"
                @input="amountChanged('to')"
              />
            </div>
            <div class="error-message-container">
              <p v-if="toBelowMinAllowed">{{ toBelowMinAllowed }}</p>
              <p v-if="toAboveMaxAllowed">{{ toAboveMaxAllowed }}</p>
            </div>
          </div>
        </div>
        <!-- form-block amount-to-address -->
      </div>

      <div class="send-form">
        <div class="the-form gas-amount">
          <drop-down-address-selector
            :currency="toCurrency"
            :current-address="currentAddress"
            :copybutton="true"
            title="To Address"
            @toAddress="setToAddress"
            @validAddress="setAddressValid"
          />
        </div>
        <div v-show="!isValidAddress" class="error-message-container">
          <p>{{ $t('interface.notValidAddr') }}</p>
        </div>
      </div>

      <div v-show="showRefundAddress" class="send-form">
        <div class="title-container">
          <div class="title title-and-copy">
            <h4>{{ fromCurrency }} {{ $t('interface.refund') }}</h4>
            <p class="copy-button prevent-user-select">
              {{ $t('common.copy') }}
            </p>
          </div>
        </div>
        <div class="the-form gas-amount">
          <drop-down-address-selector
            :currency="fromCurrency"
            :current-address="currentAddress"
            @toAddress="setRefundAddress"
          />
        </div>
      </div>

      <div class="send-form">
        <div class="title-container">
          <div class="title title-and-copy">
            <h4>{{ $t('interface.providers') }}</h4>
          </div>
        </div>
        <providers-radio-selector
          :loading-provider-error="loadingError"
          :loading-provider-rates="!haveProviderRates"
          :provider-data="providerList"
          :from-value="+fromValue"
          :to-value="+toValue"
          :no-providers-pair="noProvidersPair"
          :loading-data="loadingData"
          :providers-found="providersFound"
          :provider-selected="selectedProvider"
          :switch-currency-order="switchCurrencyOrder"
          @selectedProvider="setSelectedProvider"
        />
      </div>

      <div class="submit-button-container">
        <div
          v-show="finalizingSwap"
          class="disabled submit-button large-round-button-green-filled clickable"
        >
          <i class="fa fa-spinner fa-spin" />
          {{ $t('interface.swapButtonLoading') }}
        </div>
        <div
          v-show="!finalizingSwap"
          :class="[
            validSwap ? '' : 'disabled',
            'submit-button large-round-button-green-filled clickable'
          ]"
          @click="swapConfirmationModalOpen"
        >
          {{ $t('common.continue') }}
          <i class="fa fa-long-arrow-right" aria-hidden="true" />
        </div>
        <interface-bottom-text
          :link-text="$t('interface.helpCenter')"
          :question="$t('interface.haveIssues')"
          link="https://kb.myetherwallet.com"
        />
      </div>
    </div>
  </div>
</template>
<script>
import BigNumber from 'bignumber.js';
import debug from 'debug';
import { mapGetters } from 'vuex';

import ProvidersRadioSelector from './components/ProvidersRadioSelector';
import DropDownAddressSelector from './components/SwapAddressSelector';
import InterfaceBottomText from '@/components/InterfaceBottomText';
import InterfaceContainerTitle from '../../components/InterfaceContainerTitle';
import swapIcon from '@/assets/images/icons/swap.svg';
import ImageKybernetowrk from '@/assets/images/etc/kybernetowrk.png';
import ImageBity from '@/assets/images/etc/bity.png';
import ImageVisaMaster from '@/assets/images/etc/visamaster.png';

import SwapCurrencyPicker from './components/SwapCurrencyPicker';
import SwapConfirmationModal from './components/SwapConfirmationModal';
import SwapSendToModal from './components/SwapSendToModal';

import {
  Swap,
  providers,
  bestProviderForQuantity,
  bestRateForQuantity,
  isValidEntry,
  providerNames,
  BASE_CURRENCY,
  MIN_SWAP_AMOUNT,
  ERC20
} from '@/partners';

const errorLogger = debug('v5:swapContainer');

export default {
  components: {
    'interface-bottom-text': InterfaceBottomText,
    'interface-container-title': InterfaceContainerTitle,
    'swap-currency-picker': SwapCurrencyPicker,
    'drop-down-address-selector': DropDownAddressSelector,
    'providers-radio-selector': ProvidersRadioSelector,
    'swap-confirmation-modal': SwapConfirmationModal,
    'swap-send-to-modal': SwapSendToModal
  },
  data() {
    return {
      baseCurrency: BASE_CURRENCY,
      currencyDetails: {},
      fromCurrency: 'ETH',
      toCurrency: 'ETH',
      fromValue: 1,
      toValue: 1,
      invalidFrom: 'none',
      selectedProvider: {},
      swapDetails: {},
      finalizingSwap: false,
      toAddress: '',
      currentAddress: '',
      refundAddress: '',
      validAddress: true,
      swap: new Swap(providers, {
        network: this.$store.state.network.type.name,
        web3: this.$store.state.web3,
        getRateForUnit: true
      }),
      images: {
        kybernetowrk: ImageKybernetowrk,
        bity: ImageBity,
        visaMaster: ImageVisaMaster,
        swap: swapIcon
      },
      toArray: [],
      fromArray: [],
      providerData: [],
      providerNames: providerNames,
      tokenBalances: {},
      ratesRetrived: false,
      issueRecievingRates: false,
      providerRatesRecieved: [],
      noProvidersPair: {},
      loadingData: true,
      providersFound: [],
      tempStatuses: [],
      haveProviderRates: false,
      loadingError: false,
      overrideFrom: {},
      overrideTo: {},
      switchCurrencyOrder: false
    };
  },
  computed: {
    ...mapGetters({
      account: 'account',
      ens: 'ens',
      gasPrice: 'gasPrice',
      web3: 'web3',
      wallet: 'wallet',
      network: 'network'
    }),
    bestRate() {
      try {
        if (this.providerData.length > 0) {
          if (this.selectedProvider.provider) {
            return this.providerList.find(entry => {
              return entry.provider === this.selectedProvider.provider;
            }).rate;
          }
          return bestRateForQuantity([...this.providerList], this.fromValue);
        }
      } catch (e) {
        errorLogger(e);
      }
    },
    fromBelowMinAllowed() {
      if (MIN_SWAP_AMOUNT > +this.fromValue)
        return `${this.$t('interface.belowMin')} ${MIN_SWAP_AMOUNT}`;
      if (this.selectedProvider.minValue > +this.fromValue)
        return this.$t('interface.belowMinSwap');
      return false;
    },
    fromAboveMaxAllowed() {
      if (this.selectedProvider.provider === this.providerNames.bity) {
        return this.toAboveMaxAllowed;
      } else if (
        +this.fromValue > this.selectedProvider.maxValue &&
        this.selectedProvider.maxValue > 0
      )
        return this.$t('interface.aboveMaxSwap');
      return false;
    },
    toBelowMinAllowed() {
      if (this.checkBityMin) return this.$t('interface.belowMinSwap');
      return false;
    },
    toAboveMaxAllowed() {
      if (this.checkBityMax) return this.$t('interface.aboveMaxSwap');
      return false;
    },
    providerList() {
      if (this.providerData.length > 0) {
        return bestProviderForQuantity([...this.providerData], this.fromValue);
      }
      return [];
    },
    validSwap() {
      return (
        !this.notEnough &&
        this.toAddress !== '' &&
        this.selectedProvider.minValue <= +this.fromValue &&
        (+this.fromValue <= this.selectedProvider.maxValue ||
          this.selectedProvider.maxValue === 0)
      );
    },
    checkBityMin() {
      if (this.swap.isProvider(this.providerNames.bity)) {
        return (
          !this.swap
            .getProvider(this.providerNames.bity)
            .minCheck(
              this.fromCurrency,
              this.fromValue,
              this.toCurrency,
              this.toValue
            ) && this.selectedProvider.provider === this.providerNames.bity
        );
      }
      return false;
    },
    checkBityMax() {
      if (this.swap.isProvider(this.providerNames.bity)) {
        return (
          !this.swap
            .getProvider(this.providerNames.bity)
            .maxCheck(
              this.fromCurrency,
              this.fromValue,
              this.toCurrency,
              this.toValue
            ) && this.selectedProvider.provider === this.providerNames.bity
        );
      }
      return false;
    },
    showRefundAddress() {
      return (
        !this.swap.isToken(this.fromCurrency) &&
        this.selectedProvider.provider === this.providerNames.changelly
      );
    },
    isValidAddress() {
      return this.validAddress;
    },
    notEnough() {
      if (
        this.swap.isToken(this.fromCurrency) &&
        this.fromCurrency !== this.baseCurrency
      ) {
        const enteredVal = this.swap.convertToTokenWei(
          this.fromCurrency,
          this.fromValue
        );

        if (+this.tokenBalances[this.fromCurrency] === +enteredVal) {
          return false;
        }
        return new BigNumber(this.tokenBalances[this.fromCurrency]).lte(
          new BigNumber(enteredVal)
        );
      } else if (this.fromCurrency === this.baseCurrency) {
        return new BigNumber(this.account.balance).lt(this.fromValue);
      }
      return false;
    }
  },
  watch: {
    ['this.network.type.name']() {
      this.swap.updateNetwork(this.network.type.name);
    },
    ['swap.updateProviderRates']() {
      const { toArray, fromArray } = this.swap.initialCurrencyLists;
      this.toArray = toArray;
      this.fromArray = fromArray;
    },
    ['swap.haveProviderRates']() {
      this.haveProviderRates = this.swap.haveProviderRates;
      this.updateRateEstimate(
        this.fromCurrency,
        this.toCurrency,
        this.fromValue,
        'from'
      );
    },
    network(newVal) {
      this.providerData = [];
      this.haveProviderRates = false;
      this.loadingData = false;
      this.swap = new Swap(providers, {
        network: newVal.type.name,
        web3: this.web3
      });
    }
  },
  mounted() {
    const { toArray, fromArray } = this.swap.initialCurrencyLists;
    this.toArray = toArray;
    this.fromArray = fromArray;
    this.currentAddress = this.wallet.getChecksumAddressString();
  },
  methods: {
    flipCurrencies() {
      this.switchCurrencyOrder = true;
      const origTo = this.toValue;
      this.fromCurrency = this.currencyDetails.to.symbol;
      this.toCurrency = this.currencyDetails.from.symbol;
      this.overrideFrom = this.currencyDetails.to;
      this.overrideTo = this.currencyDetails.from;
      this.updateRateEstimate(
        this.fromCurrency,
        this.toCurrency,
        origTo,
        'from'
      );
      this.switchCurrencyOrder = false;
    },
    setSelectedProvider(provider) {
      this.selectedProvider = this.providerList.find(entry => {
        return entry.provider === provider;
      });
      this.updateEstimate('from');
    },
    setToAddress(address) {
      this.toAddress = address;
    },
    setRefundAddress(address) {
      this.refundAddress = address;
    },
    setAddressValid(value) {
      this.validAddress = value;
    },
    swapAll() {
      this.fromValue = this.swap.convertToTokenBase(
        this.fromCurrency,
        this.tokenBalances[this.fromCurrency]
      );
    },
    setFromCurrency(value) {
      this.currencyDetails.from = value;
      this.fromCurrency = value.symbol;
      this.getBalance(this.fromCurrency);
      this.toArray = this.swap.setToCurrencyBuilder(value);
      this.updateRateEstimate(
        this.fromCurrency,
        this.toCurrency,
        this.fromValue,
        'from'
      );
    },
    setToCurrency(value) {
      this.currencyDetails.to = value;
      this.toCurrency = value.symbol;
      this.fromArray = this.swap.setFromCurrencyBuilder(value);
      this.updateRateEstimate(
        this.fromCurrency,
        this.toCurrency,
        this.fromValue,
        'to'
      );
    },
    async getBalance(currency) {
      if (this.swap.isToken(currency) && currency !== this.baseCurrency) {
        const balance = await new this.web3.eth.Contract(
          ERC20,
          this.swap.getTokenAddress(currency)
        ).methods
          .balanceOf(this.currentAddress)
          .call();

        this.$set(this.tokenBalances, currency, balance);
      }
    },
    amountChanged(direction) {
      if (
        (isValidEntry(this.fromValue) && direction === 'from') ||
        (isValidEntry(this.toValue) && direction === 'to')
      ) {
        if (
          this.swap.getProvider(this.providerNames.simplex).currencies.fiat[
            this.fromCurrency
          ]
        ) {
          this.web3.utils._.debounce(
            this.updateEstimate(this.providerNames.simplex + direction),
            200
          );
        } else {
          this.web3.utils._.debounce(this.updateEstimate(direction), 200);
        }
      } else if (direction === 'from') {
        this.toValue = '';
      } else if (direction === 'to') {
        this.fromValue = '';
      }
    },
    async updateEstimate(input) {
      let fromValue, toValue, simplexProvider, simplexRateDetails;
      switch (input) {
        case 'to':
          this.fromValue = this.swap.calculateFromValue(
            this.toValue,
            this.bestRate
          );
          break;
        case 'from':
          this.toValue = this.swap.calculateToValue(
            this.fromValue,
            this.bestRate
          );
          break;
        case `${this.providerNames.simplex}to`:
          simplexProvider = this.swap.getProvider(this.providerNames.simplex);

          if (simplexProvider.canQuote(this.fromValue, this.toValue)) {
            simplexRateDetails = await simplexProvider.updateDigital(
              this.fromCurrency,
              this.toCurrency,
              this.toValue
            );
            this.fromValue = simplexRateDetails.fromValue;
            this.toValue = simplexRateDetails.toValue;
          }
          break;
        case `${this.providerNames.simplex}from`:
          simplexProvider = this.swap.getProvider(this.providerNames.simplex);
          if (simplexProvider.canQuote(this.fromValue, this.toValue)) {
            simplexRateDetails = await simplexProvider.updateFiat(
              this.fromCurrency,
              this.toCurrency,
              this.fromValue
            );
            this.fromValue = simplexRateDetails.fromValue;
            this.toValue = simplexRateDetails.toValue;
          }
          break;
        default:
          toValue = this.swap.calculateToValue(this.fromValue, this.bestRate);
          fromValue = this.swap.calculateFromValue(this.toValue, this.bestRate);
          this.toValue = toValue;
          this.fromValue = fromValue;
          break;
      }
    },
    async updateRateEstimate(fromCurrency, toCurrency, fromValue, to) {
      if (this.haveProviderRates) {
        this.loadingData = true;
        this.noProvidersPair = { fromCurrency, toCurrency };
        this.selectedProvider = {}; // Reset the selected provider when new rate pair is choosen
        this.providerData = [];
        const {
          providersFound,
          callsToMake
        } = await this.swap.updateRateEstimate(
          fromCurrency,
          toCurrency,
          fromValue,
          this.toValue
        );
        this.providersFound = providersFound;

        const results = await Promise.all(
          callsToMake.map(func =>
            func(fromCurrency, toCurrency, fromValue, this.toValue)
          )
        );

        this.loadingData = false;
        if (
          results.every(
            entry =>
              entry.fromCurrency === this.fromCurrency &&
              entry.toCurrency === this.toCurrency
          )
        ) {
          this.providerData = bestProviderForQuantity(
            results.map(entry => {
              if (+entry.rate > 0) {
                return {
                  provider: entry.provider,
                  fromCurrency,
                  fromValue: this.fromValue,
                  toCurrency,
                  rate: +entry.rate,
                  minValue: entry.minValue || 0,
                  maxValue: entry.maxValue || 0,
                  computeConversion: function(_fromValue) {
                    return new BigNumber(_fromValue)
                      .times(this.rate)
                      .toFixed(6)
                      .toString(10);
                  }
                };
              }
            }),
            fromValue
          );
          this.updateEstimate(to);
        }
      }
    },
    async swapConfirmationModalOpen() {
      try {
        if (this.validSwap) {
          this.finalizingSwap = true;
          const providerDetails = this.providerList.find(entry => {
            return entry.provider === this.selectedProvider.provider;
          });
          const swapDetails = {
            providerDetails: providerDetails,
            fromValue: this.fromValue,
            toValue: this.toValue,
            toAddress: this.toAddress || this.currentAddress,
            fromAddress: this.currentAddress,
            refundAddress: this.swap.isToken(providerDetails.fromCurrency)
              ? this.currentAddress
              : this.refundAddress
          };

          this.swapDetails = await this.swap.startSwap(swapDetails);
          this.finalizingSwap = false;
          if (
            this.swapDetails.dataForInitialization &&
            this.swapDetails.maybeToken
          ) {
            this.$refs.swapConfirmation.$refs.swapconfirmation.show();
          } else if (
            this.swapDetails.dataForInitialization &&
            !this.swapDetails.maybeToken
          ) {
            this.$refs.swapSendTo.$refs.swapconfirmation.show();
          } else {
            throw Error(
              'Error while requesting finalized details from provider'
            );
          }
        }
      } catch (e) {
        this.$refs.swapConfirmation.$refs.swapconfirmation.hide();
        this.$refs.swapSendTo.$refs.swapconfirmation.hide();
        this.finalizingSwap = false;
        // eslint-disable-next-line no-console
        console.error(e);
        errorLogger(e);
      }
    },
    resetSwapState() {
      // this.toAddress = '';
      this.fromCurrency = this.baseCurrency;
      // this.toCurrency = 'BTC';
      this.fromValue = 1;
      this.toValue = 0;
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'SwapContainer.scss';
</style>
