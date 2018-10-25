<template>
  <div class="swap-container">
    <swap-confirmation-modal
      ref="swapConfirm"
      :selected-provider="selectedProvider"
      :swap-details="swapDetails"
      :current-address="currentAddress"
      @swapStarted="swapStarted"/>

    <swap-send-to-modal
      ref="swapSendTo"
      :selected-provider="selectedProvider"
      :swap-details="swapDetails"
      :current-address="currentAddress"
      @swapStarted="resetSwapState"/>

    <div class="title-block">
      <interface-container-title :title="$t('common.swap')"/>
      <div class="buy-eth">
        <span>Buy ETH with</span>
        <img :src="images.visaMaster">
      </div>
    </div>

    <div class="send-form">
      <div class="form-block amount-to-address">
        <div class="amount">
          <div class="title">
            <h4>{{ $t('common.from') }}</h4>
          </div>
          <swap-currency-picker
            :currencies="fromArray"
            :from-source="true"
            page="SwapContainerFrom"
            @selectedCurrency="setFromCurrency"/>
          <div class="the-form amount-number">
            <input
              v-model="fromValue"
              type="number"
              name=""
              value=""
              placeholder="Deposit Amount"
              @input="amountChanged('from')">
          </div>
          <div
            class="error-message-container">
            <p v-if="selectedProvider.minValue > +fromValue ">{{ $t('interface.belowMinSwap') }}</p>
            <p v-else>&nbsp;</p>
            <p v-if="+fromValue > selectedProvider.maxValue && selectedProvider.maxValue > 0">{{ $t('interface.aboveMaxSwap')
            }}</p>
          </div>
        </div>
        <div class="exchange-icon">
          <img :src="images.swap">
        </div>
        <div class="amount">
          <div class="title">
            <h4>{{ $t('common.to') }}</h4>
          </div>
          <swap-currency-picker
            :currencies="toArray"
            :from-source="false"
            page="SwapContainerTo"
            @selectedCurrency="setToCurrency"/>
          <div class="the-form amount-number">
            <input
              v-model="toValue"
              type="number"
              name=""
              value=""
              placeholder="Received Amount"
              @input="amountChanged('to')">
          </div>
          <div
            class="error-message-container">
            <p v-if="!bitySwap.minCheck(fromCurrency, fromValue, toCurrency, toValue) && selectedProvider.provider === bitySwap.name">{{ $t('interface.belowMinSwap') }}</p>
            <p v-if="!bitySwap.maxCheck(fromCurrency, fromValue, toCurrency, toValue) && selectedProvider.provider === bitySwap.name ">{{ $t('interface.aboveMaxSwap')
            }}</p>
          </div>
        </div>
      </div>
    </div>

    <div class="send-form">
      <div class="title-container">
        <div class="title title-and-copy">
          <h4>{{ $t('common.toAddress') }}</h4>
          <p class="copy-button prevent-user-select">{{ $t('common.copy') }}</p>
        </div>
      </div>
      <div class="the-form gas-amount">
        <drop-down-address-selector
          :currency="toCurrency"
          :current-address="currentAddress"
          @toAddress="setToAddress"/>
      </div>
    </div>

    <div class="send-form">
      <div class="title-container">
        <div class="title title-and-copy">
          <h4>Providers</h4>
        </div>
      </div>
      <providers-radio-selector
        v-if="haveProviderRates"
        :provider-data="providerList"
        :from-value="+fromValue"
        :to-value="+toValue"
        :no-providers-pair="noProvidersPair"
        :loading-data="loadingData"
        :providers-found="providersFound"
        @selectedProvider="setSelectedProvider"/>
    </div>

    <div
      v-if="false"
      class="send-form">
      <div class="title-container">
        <div class="title">
          <div class="title-and-popover">
            <h4>{{ $t('common.speedTx') }}</h4>
            <popover :popcontent="$t('popover.whatIsSpeedOfTX')"/>
          </div>
          <p>{{ $t('common.txFee') }}: 0.000013 ETH ($1.234)</p>
        </div>
        <div class="buttons">
          <div class="small-circle-button-green-border">
            {{ $t('common.slow') }}
          </div>
          <div class="small-circle-button-green-border active">
            {{ $t('common.regular') }}
          </div>
          <div class="small-circle-button-green-border">
            {{ $t('common.fast') }}
          </div>
        </div>
      </div>

      <div class="the-form gas-amount">
        <input
          type="number"
          name=""
          value=""
          placeholder="Gas Amount">
        <div class="good-button-container">
          <p>Gwei</p>
          <i
            class="fa fa-check-circle good-button not-good"
            aria-hidden="true"/>
        </div>
      </div>
    </div>

    <div class="submit-button-container">
      <div
        v-show="finalizingSwap"
        class="disabled submit-button large-round-button-green-filled clickable">
        Finalizing Swap Details
        <!--{{ $t('common.continue') }}-->
        <i
          class="fa fa-long-arrow-right"
          aria-hidden="true"/>
      </div>
      <div
        v-show="!finalizingSwap"
        :class="[validSwap ? '': 'disabled','submit-button large-round-button-green-filled clickable']"
        @click="swapConfirmationModalOpen">
        {{ $t('common.continue') }}
        <i
          class="fa fa-long-arrow-right"
          aria-hidden="true"/>
      </div>
    </div>

  </div>
</template>
<script>
import web3 from 'web3';
import BigNumber from 'bignumber.js';
import debug from 'debug';

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
  supportedProviders,
  BitySwap,
  KyberSwap,
  Simplex,
  ChangellySwap,
  CurrencyOptionBuilder,
  bestProviderForQuantity,
  bestRateForQuantity,
  isValidEntry,
  checkInvalidOrMissingValue
} from '@/partners';

const errorLogger = debug('v5:swapContainer');

BigNumber.config({ DECIMAL_PLACES: 7 });

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
      currencyOptions: {},
      fromCurrency: 'ETH',
      toCurrency: 'ETH',
      // fromCurrency: 'OMG',
      // toCurrency: 'ETH',
      fromValue: 1,
      toValue: 1,
      invalidFrom: 'none',
      selectedProvider: {},
      swapDetails: {},
      finalizingSwap: false,
      toAddress: '',
      currentAddress: '',
      bitySwap: new BitySwap({ network: this.$store.state.network.type.name }),
      kyberSwap: new KyberSwap({
        network: this.$store.state.network.type.name,
        web3: this.$store.state.web3,
        ens: this.$store.state.ens
      }),
      changellySwap: new ChangellySwap({
        network: this.$store.state.network.type.name
      }),
      simplexSwap: new Simplex({
        network: this.$store.state.network.type.name
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
      ratesRetrived: false,
      issueRecievingRates: false,
      providerRatesRecieved: [],
      noProvidersPair: {},
      loadingData: true,
      providersFound: [],
      tempStatuses: []
    };
  },
  computed: {
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
        // eslint-disable no-console
        errorLogger(e);
      }
    },
    providerList() {
      if (this.providerData.length > 0) {
        return bestProviderForQuantity([...this.providerData], this.fromValue);
      }
      return [];
    },
    validSwap() {
      return (
        this.toAddress !== '' &&
        this.selectedProvider.minValue < +this.fromValue &&
        (+this.fromValue < this.selectedProvider.maxValue ||
          this.selectedProvider.maxValue === 0)
      );
    },
    haveProviderRates() {
      //TODO centralize location of name strings for providers
      if (this.$store.state.network.type.name === 'ETH') {
        if (this.ratesRetrived) return this.ratesRetrived;
        return supportedProviders.every(entry =>
          this.providerRatesRecieved.includes(entry)
        );
      }
      return true;
    }
  },
  watch: {
    ['kyberSwap.hasTokens']() {
      if (!this.providerRatesRecieved.includes(this.kyberSwap.name)) {
        this.providerRatesRecieved.push(this.kyberSwap.name);
      }
      this.updateSupportedCurrencyArrays(
        this.kyberSwap.name,
        this.kyberSwap.getSupportedTokens()
      );
    },
    ['changellySwap.hasTokens']() {
      if (!this.providerRatesRecieved.includes(this.changellySwap.name)) {
        this.providerRatesRecieved.push(this.changellySwap.name);
      }
      this.updateSupportedCurrencyArrays(
        this.changellySwap.name,
        this.changellySwap.getSupportedTokens()
      );
    },
    ['bitySwap.hasRates']() {
      if (!this.providerRatesRecieved.includes(this.bitySwap.name)) {
        this.providerRatesRecieved.push(this.bitySwap.name);
      }
      this.updateSupportedCurrencyArrays(
        this.bitySwap.name,
        this.bitySwap.currencies
      );
    },
    haveProviderRates(newValue) {
      if (newValue) {
        this.updateRateEstimate(
          this.fromCurrency,
          this.toCurrency,
          this.fromValue,
          'from'
        );
      }
    }
  },
  beforeMount() {
    this.currencyOptions = new CurrencyOptionBuilder({
      changelly: this.changellySwap.currencies,
      bity: this.bitySwap.currencies,
      simplex: this.simplexSwap.currencies,
      kyber: this.kyberSwap.currencies
    });
  },
  // Fill with default values while retrieving values from APIs, or
  // The default lists should get generated (for changelly and kyber at least) on build

  // If swap instances are initiated on load or a loading indicator is provided
  // then the watchers, beforeMount, and mounted could be reduced to one call
  mounted() {
    setTimeout(() => {
      if (!this.haveProviderRates) {
        this.issueRecievingRates = true;
        this.ratesRetrived = true;
      }
    }, 3000);
    // Replace default values with values from APIs
    const {
      toArray,
      fromArray
    } = this.currencyOptions.buildInitialCurrencyArrays();
    this.toArray = toArray;
    this.fromArray = fromArray;
    this.currentAddress = this.$store.state.wallet.getChecksumAddressString();
    this.providerRatesRecieved = [this.simplexSwap.name]; //TODO centralize location of name strings for providers
  },
  methods: {
    swapStarted(swapDetails) {
      // let checkStatus;
      this.$store
        .dispatch('addSwapTransaction', [this.currentAddress, swapDetails])
        .then(() => {
          this.resetSwapState();
          // switch (swapDetails.provider) {
          //   case this.kyberSwap.name:
          //     break;
          //   case this.changellySwap.name:
          //     checkStatus = this.changellySwap.statusUpdater(swapDetails);
          //     checkStatus();
          //     break;
          //   case this.bitySwap.name:
          //     checkStatus = this.bitySwap.statusUpdater(swapDetails);
          //     checkStatus();
          //     break;
          //   case this.simplexSwap.name:
          //     break;
          // }

        });
    },
    // TODO: CACHE PREVIOUSLY QUERIED RATES, TO USE FOR INITIAL DIAPLAY WHILE NEW RATES ARE RETRIEVED
    // TODO: ASK - provide the normalized exchange, calculated exchange, or both.
    // TODO: i.e. 1 FromCurrency = Rate ToCurrency, or X FromCurrency = X * Rate ToCurrency,
    resetSwapState() {
      this.toAddress = '';
      this.fromCurrency = 'ETH';
      this.toCurrency = 'BTC';
      this.fromValue = 1;
      this.toValue = 1;
    },
    updateSupportedCurrencyArrays(provider, retrievedList) {
      this.currencyOptions.updateCurrencyList(provider, retrievedList);
      const {
        toArray,
        fromArray
      } = this.currencyOptions.buildInitialCurrencyArrays();
      this.toArray = toArray;
      this.fromArray = fromArray;
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
    setFromCurrency(value) {
      this.fromCurrency = value.symbol;
      this.toArray = this.currencyOptions.setToCurrencyBuilder(value);
      this.updateRateEstimate(
        this.fromCurrency,
        this.toCurrency,
        this.fromValue,
        'from'
      );
    },
    setToCurrency(value) {
      this.toCurrency = value.symbol;
      this.fromArray = this.currencyOptions.setFromCurrencyBuilder(value);
      this.updateRateEstimate(
        this.fromCurrency,
        this.toCurrency,
        this.fromValue,
        'to'
      );
    },
    amountChanged(to) {
      if (
        (isValidEntry(this.fromValue) && to === 'from') ||
        (isValidEntry(this.toValue) && to === 'to')
      ) {
        if (this.simplexSwap.currencies.fiat[this.fromCurrency]) {
          this.$store.state.web3.utils._.debounce(
            this.updateEstimate('simplex' + to),
            200
          );
        } else {
          this.$store.state.web3.utils._.debounce(this.updateEstimate(to), 200);
        }
      } else if (to === 'from') {
        this.toValue = '';
      } else if (to === 'to') {
        this.fromValue = '';
      }
    },
    async updateEstimate(input) {
      let fromValue, toValue;
      switch (input) {
        case 'to':
          this.fromValue = checkInvalidOrMissingValue(
            new BigNumber(this.toValue).div(this.bestRate).toString(10),
            false
          );
          break;
        case 'from':
          this.toValue = checkInvalidOrMissingValue(
            new BigNumber(this.fromValue).times(this.bestRate).toString(10),
            true
          );
          break;
        case 'simplexto':
          if (this.simplexSwap.canQuote(this.fromValue, this.toValue)) {
            await this.getSimplexRate(
              this.fromCurrency,
              this.toCurrency,
              this.fromValue,
              this.toValue,
              false
            );
          }
          break;
        case 'simplexfrom':
          if (this.simplexSwap.canQuote(this.fromValue, this.toValue)) {
            await this.getSimplexRate(
              this.fromCurrency,
              this.toCurrency,
              this.fromValue,
              this.toValue,
              true
            );
          }
          break;
        default:
          toValue = checkInvalidOrMissingValue(
            new BigNumber(this.fromValue).times(this.bestRate).toString(10),
            true
          );
          fromValue = checkInvalidOrMissingValue(
            new BigNumber(this.toValue).div(this.bestRate).toString(10),
            false
          );
          this.toValue = toValue;
          this.fromValue = fromValue;
          break;
      }
    },
    async updateRateEstimate(fromCurrency, toCurrency, fromValue, to) {
      if (this.haveProviderRates) {
        // provide user with feedback prior to rate call return
        this.loadingData = true;
        this.noProvidersPair = { fromCurrency, toCurrency };
        const providersFound = [];
        // clear the provider information before gathering providers for new pair
        this.selectedProvider = {}; // Reset the selected provider when new rate pair is choosen
        this.toValue = '';
        const callsToMake = [];
        this.providerData = [];
        if (
          +fromValue > 0 &&
          fromCurrency !== toCurrency &&
          !Number.isNaN(+fromValue)
        ) {
          if (this.kyberSwap.validSwap(fromCurrency, toCurrency)) {
            callsToMake.push(this.getKyberRate);
            providersFound.push(this.kyberSwap.name);
          }
          if (this.simplexSwap.validSwap(fromCurrency, toCurrency)) {
            callsToMake.push(this.getSimplexRate);
            providersFound.push(this.simplexSwap.name);
          }
          if (this.bitySwap.validSwap(fromCurrency, toCurrency)) {
            callsToMake.push(this.getBityRate);
            providersFound.push(this.bitySwap.name);
          }
          if (this.changellySwap.validSwap(fromCurrency, toCurrency)) {
            callsToMake.push(this.getChangellyRate);
            providersFound.push(this.changellySwap.name);
          }

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
                    fromValue: 1,
                    toCurrency,
                    rate: +entry.rate,
                    minValue: entry.minValue || 0,
                    maxValue: entry.maxValue || 0
                  };
                }
              }),
              this.fromValue
            );
            this.updateEstimate(to);
          }
        } else {
          this.providersFound = providersFound;
          this.loadingData = false;
        }
      }
    },
    // ================================ Finalize and Open Modal ============================================
    async swapConfirmationModalOpen() {
      try {
        if (this.validSwap) {
          this.finalizingSwap = true;
          this.swapDetails = await this.collectSwapDetails();
          this.finalizingSwap = false;
          if (
            this.swapDetails.dataForInitialization &&
            this.swapDetails.maybeToken
          ) {
            this.$refs.swapConfirm.$refs.swapconfirmation.show();
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
        this.$refs.swapConfirm.$refs.swapconfirmation.hide();
        this.$refs.swapSendTo.$refs.swapconfirmation.hide();
        this.finalizingSwap = false;
        errorLogger(e);
      }
    },
    async collectSwapDetails() {
      try {
        const tempDetails = this.providerList.find(entry => {
          return entry.provider === this.selectedProvider.provider;
        });
        const swapDetails = {
          provider: tempDetails.provider,
          fromCurrency: tempDetails.fromCurrency,
          fromValue: this.fromValue,
          toValue: this.toValue,
          toCurrency: tempDetails.toCurrency,
          rate: tempDetails.rate,
          minValue: tempDetails.minValue,
          maxValue: tempDetails.maxValue,
          toAddress: this.toAddress,
          fromAddress: this.currentAddress,
          timestamp: Date.now(),
          status: 1,
          maybeToken: false
        };

        return await this.startSwap(swapDetails);
      } catch (e) {
        throw e;
      }
    },
    async startSwap(swapDetails) {
      try {
        let details, parsed;
        switch (swapDetails.provider) {
          case this.kyberSwap.name:
            swapDetails.maybeToken = true;
            swapDetails.providerAddress = this.kyberSwap.getAddress();
            swapDetails.kyberMaxGas = await this.kyberSwap.getKyberMaxGas();
            details = await this.kyberSwap.createSwap(swapDetails);
            break;
          case this.changellySwap.name:
            if (this.selectedProvider.minValue < swapDetails.fromValue) {
              details = await this.changellySwap.createSwap(swapDetails);
              parsed = ChangellySwap.parseOrder(details);
              swapDetails.maybeToken = web3.utils.isAddress(
                details.payinAddress
              );
              swapDetails.providerAddress = details.payinAddress;
            } else {
              throw Error(
                'From amount below changelly minimun for currency pair'
              );
            }
            break;
          case this.bitySwap.name:
            details = await this.bitySwap.createSwap(swapDetails);
            parsed = BitySwap.parseOrder(details);
            swapDetails.maybeToken = web3.utils.isAddress(
              details.payment_address
            );
            swapDetails.providerAddress = details.payment_address;
            break;
          case this.simplexSwap.name:
            details = await this.simplexSwap.createSwap(swapDetails);
            break;
        }

        swapDetails.dataForInitialization = details;
        swapDetails.parsed = parsed;
        return swapDetails;
      } catch (e) {
        throw e;
      }
    },
    // ================================ Provider Specific ============================================
    async getSimplexRate(fromCurrency, toCurrency, fromValue, toValue, isFiat) {
      if (this.simplexSwap.canQuote(fromValue, this.toValue)) {
        let simplexRateDetails;
        if (this.simplexSwap.isFiat(fromCurrency) && isFiat) {
          // TODO restructure to remove redundancy
          simplexRateDetails = await this.simplexSwap.updateFiat(
            this.fromCurrency,
            this.toCurrency,
            fromValue
          );
          this.fromValue = simplexRateDetails.fromValue;
          this.toValue = simplexRateDetails.toValue;
        } else {
          simplexRateDetails = await this.simplexSwap.updateDigital(
            this.fromCurrency,
            this.toCurrency,
            toValue
          );
          this.fromValue = simplexRateDetails.fromValue;
          this.toValue = simplexRateDetails.toValue;
        }

        const rate = new BigNumber(simplexRateDetails.fromValue)
          .div(simplexRateDetails.toValue)
          .toString(10);
        return {
          fromCurrency,
          toCurrency,
          provider: this.simplexSwap.name,
          rate: rate,
          minValue: this.simplexSwap.minFiat,
          maxValue: this.simplexSwap.maxFiat
        };
      }
      this.invalidFrom = 'simplexMin';
      // eslint-disable no-console
      errorLogger('indicate invalid simplex'); // TODO: provide ui indication(s)
      const simplexRateDetails = await this.simplexSwap.updateFiat(
        this.fromCurrency,
        this.toCurrency,
        51
      );
      const rate = new BigNumber(simplexRateDetails.toValue)
        .div(simplexRateDetails.fromValue)
        .toString(10);
      return {
        fromCurrency,
        toCurrency,
        provider: this.simplexSwap.name,
        rate: rate,
        minValue: this.simplexSwap.minFiat,
        maxValue: this.simplexSwap.maxFiat
      };
    },
    async getKyberRate(fromCurrency, toCurrency, fromValue) {
      const rate = await this.kyberSwap.getExpactedRateInTokens(
        fromCurrency,
        toCurrency,
        fromValue
      );
      return {
        fromCurrency,
        toCurrency,
        provider: this.kyberSwap.name,
        rate: rate
      };
    },
    async getBityRate(fromCurrency, toCurrency) {
      const rate = await this.bitySwap.getRate(fromCurrency, toCurrency);
      return {
        fromCurrency,
        toCurrency,
        provider: this.bitySwap.name,
        rate: rate,
        minValue: this.bitySwap.minValue,
        maxValue: this.bitySwap.maxValue // TODO provide better identification and notice of min/max for user
      };
    },
    async getChangellyRate(fromCurrency, toCurrency, fromValue) {
      const changellyDetails = await Promise.all([
        this.changellySwap.getMin(fromCurrency, toCurrency, fromValue),
        this.changellySwap.getRate(fromCurrency, toCurrency, fromValue)
      ]);
      return {
        fromCurrency,
        toCurrency,
        provider: this.changellySwap.name,
        minValue: changellyDetails[0],
        rate: changellyDetails[1]
      };
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'SwapContainer.scss';
</style>
