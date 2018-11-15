<template>
  <div class="swap-container">
    <swap-confirmation-modal
      ref="swapConfirmation"
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
            <p v-if="fromBelowMinAllowed">{{ fromBelowMinAllowed }}</p>
            <p v-if="!hasEnough"> Insufficient balance</p>
            <p v-if="!fromBelowMinAllowed">&nbsp;</p>
            <p v-if="fromAboveMaxAllowed">{{ fromAboveMaxAllowed }}</p>
            <p v-else>&nbsp;</p>
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
            <p v-if="toBelowMinAllowed">{{ toBelowMinAllowed }}</p>
            <p v-else>&nbsp;</p>
            <p v-if="toAboveMaxAllowed">{{ toAboveMaxAllowed }}</p>
            <p v-else>&nbsp;</p>
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

    <div
      v-show="showRefundAddress"
      class="send-form">
      <div class="title-container">
        <div class="title title-and-copy">
          <h4>{{ fromCurrency }} address for refund (if needed) from Changelly </h4>
          <p class="copy-button prevent-user-select">{{ $t('common.copy') }}</p>
        </div>
      </div>
      <div class="the-form gas-amount">
        <drop-down-address-selector
          :currency="fromCurrency"
          :current-address="currentAddress"
          @toAddress="setRefundAddress"/>
      </div>
    </div>

    <div class="send-form">
      <div class="title-container">
        <div class="title title-and-copy">
          <h4>Providers</h4>
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
        @selectedProvider="setSelectedProvider"/>
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
  isValidEntry
} from '@/partners';

const errorLogger = debug('v5:swapContainer');

BigNumber.config({ DECIMAL_PLACES: 6 });

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
      fromValue: 1,
      toValue: 1,
      invalidFrom: 'none',
      selectedProvider: {},
      swapDetails: {},
      finalizingSwap: false,
      toAddress: '',
      currentAddress: '',
      refundAddress: '',
      swap: new Swap(providers, {
        network: this.$store.state.network.type.name,
        web3: this.$store.state.web3,
        ens: this.$store.state.ens
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
      tempStatuses: [],
      haveProviderRates: false,
      loadingError: false
    };
  },
  computed: {
    ...mapGetters({
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
      if (0.000001 > +this.fromValue)
        return 'Below minimun swap value of 0.000001';
      if (this.selectedProvider.minValue > +this.fromValue)
        return this.$t('interface.belowMinSwap');
      return false;
    },
    fromAboveMaxAllowed() {
      if (
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
        this.toAddress !== '' &&
        this.selectedProvider.minValue < +this.fromValue &&
        (+this.fromValue < this.selectedProvider.maxValue ||
          this.selectedProvider.maxValue === 0)
      );
    },
    // temp solution
    checkBityMin() {
      if (this.swap.getProvider('bity')) {
        return (
          !this.swap
            .getProvider('bity')
            .minCheck(
              this.fromCurrency,
              this.fromValue,
              this.toCurrency,
              this.toValue
            ) &&
          this.selectedProvider.provider === this.swap.getProvider('bity').name
        );
      }
      return false;
    },
    // temp solution
    checkBityMax() {
      if (this.swap.getProvider('bity')) {
        return (
          !this.swap
            .getProvider('bity')
            .maxCheck(
              this.fromCurrency,
              this.fromValue,
              this.toCurrency,
              this.toValue
            ) &&
          this.selectedProvider.provider === this.swap.getProvider('bity').name
        );
      }
      return false;
    },
    showRefundAddress() {
      return (
        !this.swap.isToken(this.fromCurrency) &&
        this.selectedProvider.provider === 'changelly'
      );
    },
    hasEnough(){
      this.chackBalance(this.fromCurrency);
      return true;
    }
  },
  watch: {
    ['this.$store.state.network.type.name']() {
      this.swap.updateNetwork(this.$store.state.network.type.name);
    },
    ['swap.updateProviderRates']() {
      const { toArray, fromArray } = this.swap.buildInitialCurrencyArrays();
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
    }
  },
  mounted() {
    setTimeout(() => {
      if (!this.haveProviderRates) {
        this.issueRecievingRates = true;
        this.ratesRetrived = true;
      }
    }, 3000);
    const { toArray, fromArray } = this.swap.buildInitialCurrencyArrays();
    this.toArray = toArray;
    this.fromArray = fromArray;
    this.currentAddress = this.wallet.getChecksumAddressString();
  },
  methods: {
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
    setFromCurrency(value) {
      this.fromCurrency = value.symbol;
      this.toArray = this.swap.setToCurrencyBuilder(value);
      this.updateRateEstimate(
        this.fromCurrency,
        this.toCurrency,
        this.fromValue,
        'from'
      );
    },
    setToCurrency(value) {
      this.toCurrency = value.symbol;
      this.fromArray = this.swap.setFromCurrencyBuilder(value);
      this.updateRateEstimate(
        this.fromCurrency,
        this.toCurrency,
        this.fromValue,
        'to'
      );
    },
    async chackBalance(currency) {
      // eslint-disable-next-line
      console.log(this.swap.isToken(currency)); // todo remove dev item
      if (this.swap.isToken(currency) && currency !== 'ETH') {
        const contract = new this.web3.eth.Contract(
          [
            {
              constant: true,
              inputs: [
                {
                  name: '_owner',
                  type: 'address'
                }
              ],
              name: 'balanceOf',
              outputs: [
                {
                  name: '',
                  type: 'uint256'
                }
              ],
              payable: false,
              stateMutability: 'view',
              type: 'function'
            }
          ],
          this.swap.getTokenAddress(currency)
        );
       const balance = await contract.methods.balanceOf(this.currentAddress).call();
        // eslint-disable-next-line
       console.log(balance); // todo remove dev item
      }
    },
    amountChanged(to) {
      if (
        (isValidEntry(this.fromValue) && to === 'from') ||
        (isValidEntry(this.toValue) && to === 'to')
      ) {
        if (
          this.swap.getProvider('simplex').currencies.fiat[this.fromCurrency]
        ) {
          this.web3.utils._.debounce(this.updateEstimate('simplex' + to), 200);
        } else {
          this.web3.utils._.debounce(this.updateEstimate(to), 200);
        }
      } else if (to === 'from') {
        this.toValue = '';
      } else if (to === 'to') {
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
        case 'simplexto':
          simplexProvider = this.swap.getProvider('simplex');

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
        case 'simplexfrom':
          simplexProvider = this.swap.getProvider('simplex');
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
                  fromValue: 1,
                  toCurrency,
                  rate: +entry.rate,
                  minValue: entry.minValue || 0,
                  maxValue: entry.maxValue || 0
                };
              }
            }),
            fromValue
          );
          this.updateEstimate(to);
        }
      }
    },
    // ================================ Finalize and Open Modal ============================================
    async swapConfirmationModalOpen() {
      try {
        if (this.validSwap) {
          this.finalizingSwap = true;
          const providerDetails = this.providerList.find(entry => {
            return entry.provider === this.selectedProvider.provider;
          });
          const swapDetails = {
            provider: providerDetails.provider,
            fromCurrency: providerDetails.fromCurrency,
            fromValue: this.fromValue,
            toValue: this.toValue,
            toCurrency: providerDetails.toCurrency,
            rate: providerDetails.rate,
            minValue: providerDetails.minValue,
            maxValue: providerDetails.maxValue,
            toAddress: this.toAddress,
            fromAddress: this.currentAddress,
            timestamp: new Date().toISOString(),
            status: 0,
            maybeToken: false,
            refundAddress: this.refundAddress
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
        // eslint-disable-next-line
        console.error(e);
        errorLogger(e);
      }
    },
    swapStarted(swapDetails) {
      this.$store.dispatch('addSwapTransaction', [
        this.currentAddress,
        swapDetails
      ]);
    },
    resetSwapState() {
      this.toAddress = '';
      this.fromCurrency = 'ETH';
      this.toCurrency = 'BTC';
      this.fromValue = 1;
      this.toValue = 1;
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'SwapContainer.scss';
</style>
