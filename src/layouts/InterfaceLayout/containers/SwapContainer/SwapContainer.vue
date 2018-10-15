<template>
  <div class="swap-container">
    <swap-confirmation-modal 
      ref="swapConfirm" 
      :selected-provider="selectedProvider" 
      :swap-details="swapDetails" 
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
            :source="true"
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
            <p v-if="selectedProvider.minValue > +fromValue ">{{ $t('interface.min') }}</p>
            <p v-else>&nbsp;</p>
            <p v-if="+fromValue > selectedProvider.maxValue && selectedProvider.maxValue > 0">{{ $t('interface.max')
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
            :source="false"
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
        :provider-data="providerList" 
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
      <h4 v-if="false">1 ETH = 0.000231 BTC</h4>
      <div
        class="submit-button large-round-button-green-filled clickable"
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
import BigNumber from 'bignumber.js';

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

import {
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

export default {
  components: {
    'interface-bottom-text': InterfaceBottomText,
    'interface-container-title': InterfaceContainerTitle,
    'swap-currency-picker': SwapCurrencyPicker,
    'drop-down-address-selector': DropDownAddressSelector,
    'providers-radio-selector': ProvidersRadioSelector,
    'swap-confirmation-modal': SwapConfirmationModal
  },
  data() {
    return {
      currencyOptions: {},
      fromCurrency: 'ETH',
      toCurrency: 'ETH',
      fromValue: 1,
      toValue: 1,
      invalidFrom: 'none',
      selectedProvider: {},
      swapDetails: {},
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
      providerData: [
        // TODO: calculate initially presented values
        // {
        //   provider: 'kybernetwork',
        //   fromCurrency: 'BTC',
        //   fromValue: 1,
        //   toCurrency: 'ETH',
        //   rate: 21.43572,
        //   minValue: 0,
        //   maxValue: 0
        // },
        // {
        //   provider: 'bity',
        //   fromCurrency: 'BTC',
        //   fromValue: 1,
        //   toCurrency: 'ETH',
        //   rate: 21.43572,
        //   minValue: 0,
        //   maxValue: 0
        // }
      ]
    };
  },
  computed: {
    bestRate() {
      if (this.providerData.length > 0) {
        if (this.selectedProvider.provider) {
          return this.providerList.find(entry => {
            return entry.provider === this.selectedProvider.provider;
          }).rate;
        }
        return bestRateForQuantity([...this.providerList], this.fromValue);
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
    }
  },
  watch: {
    ['kyberSwap.hasTokens']() {
      this.updateSupportedCurrencyArrays(
        this.kyberSwap.name,
        this.kyberSwap.getSupportedTokens()
      );
    },
    ['changellySwap.hasTokens']() {
      this.updateSupportedCurrencyArrays(
        this.changellySwap.name,
        this.changellySwap.getSupportedTokens()
      );
    },
    ['bitySwap.hasRates']() {
      if (this.bitySwap.hasRates) {
        this.updateSupportedCurrencyArrays(
          this.bitySwap.name,
          this.bitySwap.currencies
        );
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
    // Replace default values with values from APIs
    const {
      toArray,
      fromArray
    } = this.currencyOptions.buildInitialCurrencyArrays();
    this.toArray = toArray;
    this.fromArray = fromArray;
    this.currentAddress = this.$store.state.wallet.address;
  },
  methods: {
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
      const fromValue = this.fromValue;
      this.toArray = this.currencyOptions.setToCurrencyBuilder(value);
      this.updateRateEstimate(
        this.fromCurrency,
        this.toCurrency,
        fromValue,
        'from'
      );
    },
    setToCurrency(value) {
      this.toCurrency = value.symbol;
      const fromValue = this.fromValue;
      this.fromArray = this.currencyOptions.setFromCurrencyBuilder(value);
      this.updateRateEstimate(
        this.fromCurrency,
        this.toCurrency,
        fromValue,
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
            await this.getSimplexRate(false, this.fromValue, this.toValue);
          }
          break;
        case 'simplexfrom':
          if (this.simplexSwap.canQuote(this.fromValue, this.toValue)) {
            await this.getSimplexRate(true, this.fromValue, this.toValue);
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
        }
        if (this.simplexSwap.validSwap(fromCurrency, toCurrency)) {
          callsToMake.push(this.getSimplexRate);
        }
        if (this.bitySwap.validSwap(fromCurrency, toCurrency)) {
          callsToMake.push(this.getBityRate);
        }
        if (this.changellySwap.validSwap(fromCurrency, toCurrency)) {
          callsToMake.push(this.getChangellyRate);
        }
        const results = await Promise.all(
          callsToMake.map(func => func(fromCurrency, toCurrency, fromValue, to))
        );

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
    },
    // ================================ Finalize and Open Modal ============================================
    async swapConfirmationModalOpen() {
      if (this.validSwap) {
        this.swapDetails = await this.collectSwapDetails();
        this.$refs.swapConfirm.$refs.swapconfirmation.show();
      }
    },
    async collectSwapDetails() {
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
        address: this.toAddress,
        timestamp: Date.now()
      };

      swapDetails.dataForInitialization = await this.startSwap(swapDetails);
      return swapDetails;
    },
    async startSwap(swapDetails) {
      switch (swapDetails.provider) {
        case this.kyberSwap.name:
          return this.kyberSwap.generateDataForTransactions(
            swapDetails.fromCurrency,
            swapDetails.toCurrency,
            this.kyberSwap.convertToTokenWei(
              swapDetails.fromCurrency,
              swapDetails.fromValue
            ),
            this.kyberSwap.convertToTokenWei(
              swapDetails.toCurrency,
              swapDetails.toValue
            ),
            this.kyberSwap.convertToTokenWei('ETH', swapDetails.rate),
            swapDetails.address
          );
        case this.changellySwap.name:
          return this.changellySwap.createTransaction(
            swapDetails.fromCurrency,
            swapDetails.toCurrency,
            swapDetails.address,
            swapDetails.fromValue
          );
      }
    },
    // ================================ Provider Specific ============================================
    async getSimplexRate(isFiat, fromValue, toValue) {
      if (this.simplexSwap.canQuote(fromValue, toValue)) {
        let simplexRateDetails;
        if (isFiat) {
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
          provider: this.simplexSwap.name,
          rate: rate,
          minValue: this.simplexSwap.minFiat,
          maxValue: this.simplexSwap.maxFiat
        };
      }
      this.invalidFrom = 'simplexMin';
      console.log('indicate invalid simplex'); // TODO: provide ui indication(s)
      const rate = await this.simplexSwap.updateFiat(
        this.fromCurrency,
        this.toCurrency,
        51
      );
      return {
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
        provider: this.kyberSwap.name,
        rate: rate
      };
    },
    async getBityRate(fromCurrency, toCurrency) {
      const rate = await this.bitySwap.getRate(fromCurrency, toCurrency);
      return {
        provider: this.bitySwap.name,
        rate: rate,
        minValue: this.bitySwap.minValue
        // maxValue: this.bitySwap.maxValue // TODO provide better identification and notice of min/max for user
      };
    },
    async getChangellyRate(fromCurrency, toCurrency, fromValue) {
      const changellyDetails = await Promise.all([
        this.changellySwap.getMin(fromCurrency, toCurrency, fromValue),
        this.changellySwap.getRate(fromCurrency, toCurrency, fromValue)
      ]);
      return {
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
