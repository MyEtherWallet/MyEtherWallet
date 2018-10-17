<template>
  <div class="swap-container">
    <swap-confirmation-modal/>

    <div class="title-block">
      <interface-container-title :title="$t('common.swap')"/>
      <img src="@/assets/images/etc/bity.png">
    </div>

    <div class="send-form">
      <div class="form-block amount-to-address">
        <div class="amount">
          <dropdown-coin-selector :options="coinSelectorFrom" />
          <div class="the-form amount-number">
            <standard-input :options="inputDepositAmount" />
          </div>
        </div>
        <div class="exchange-icon">
          <img :src="images.swap">
        </div>
        <div class="amount">
          <dropdown-coin-selector :options="coinSelectorTo" />
          <div class="the-form amount-number">
            <standard-input :options="inputReceivedAmount" />
          </div>
        </div>
      </div>
    </div>

    <div class="send-form">
      <dropdown-address-selector :options="addressSelector" />
    </div>

    <div class="send-form">
      <div class="title-container">
        <div class="title title-and-copy">
          <h4>Providers</h4>
        </div>
      </div>
      <providers-radio-selector/>
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
          placeholder="Gas Amount" >
        <div class="good-button-container">
          <p>Gwei</p>
          <i
            class="fa fa-check-circle good-button not-good"
            aria-hidden="true"/>
        </div>
      </div>
    </div>

    <div class="submit-button-container">      
      <div class="bottom-button-container">
        <standard-button 
          :options="buttonContinue"
          @click.native="openSignedTXModal"
        />
      </div>
      <div class="buy-eth">
        <span>Buy ETH with</span>
        <img :src="images.visaMaster">
      </div>
    </div>

    
    <standard-button 
      :options="buttonContinue"
      class="mobile-button"
      @click.native="openSignedTXModal"
    />
  



  </div>
</template>
<script>
import ProvidersRadioSelector from '../../components/ProvidersRadioSelector';
import CurrencyPicker from '../../components/CurrencyPicker';
import DropDownAddressSelector from '@/components/DropDownAddressSelector';
import InterfaceBottomText from '@/components/InterfaceBottomText';
import InterfaceContainerTitle from '../../components/InterfaceContainerTitle';
import swapIcon from '@/assets/images/icons/swap.svg';
import ImageKybernetowrk from '@/assets/images/etc/kybernetowrk.png';
import ImageBity from '@/assets/images/etc/bity.png';
import ImageVisaMaster from '@/assets/images/etc/visamaster.png';
import SwapConfirmationModal from './components/SwapConfirmationModal';
import DropDownCoinSelector from '@/components/DropDownCoinSelector';

export default {
  components: {
    'interface-bottom-text': InterfaceBottomText,
    'interface-container-title': InterfaceContainerTitle,
    'currency-picker': CurrencyPicker,
    'dropdown-address-selector': DropDownAddressSelector,
    'providers-radio-selector': ProvidersRadioSelector,
    'swap-confirmation-modal': SwapConfirmationModal,
    'dropdown-coin-selector': DropDownCoinSelector
  },
  data() {
    return {
      buttonContinue: {
        title: 'Continue',
        buttonStyle: 'green',
        rightArrow: true,
        fullWidth: false,
        isThisMobileBottomButton: true // Hide bottom button automatically
      },
      addressSelector: {
        title: 'To Address',
        buttonCopy: true,
        buttonClear: true,
        popover: 'What is address'
      },
      inputDepositAmount: {
        title: '',
        value: '',
        type: 'text',
        buttonCopy: false,
        buttonClear: false,
        buttonCustom: '',
        topTextInfo: '',
        popover: '',
        placeHolder: 'Deposit Amount',
        rightInputText: ''
      },
      inputReceivedAmount: {
        title: '',
        value: '',
        type: 'text',
        buttonCopy: false,
        buttonClear: false,
        buttonCustom: '',
        topTextInfo: '',
        popover: '',
        placeHolder: 'Received Amount',
        rightInputText: ''
      },
      coinSelectorFrom: {
        title: 'From'
      },
      coinSelectorTo: {
        title: 'To'
      },
      images: {
        kybernetowrk: ImageKybernetowrk,
        bity: ImageBity,
        visaMaster: ImageVisaMaster,
        swap: swapIcon
      },
      toArray: [
        { symbol: 'BTC', name: 'Bitcoin' },
        { symbol: 'Aug', name: 'Augur' },
        { symbol: 'OMG', name: 'OhMyGod' }
      ],
      fromArray: [
        { symbol: 'BTC', name: 'Bitcoin' },
        { symbol: 'Aug', name: 'Augur' },
        { symbol: 'OMG', name: 'OhMyGod' }
      ]
    };
  },
  methods: {
    swapConfirmationModalOpen() {
      this.$children[0].$refs.swapconfirmation.show();
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'SwapContainer-desktop.scss';
@import 'SwapContainer-tablet.scss';
@import 'SwapContainer-mobile.scss';
</style>
