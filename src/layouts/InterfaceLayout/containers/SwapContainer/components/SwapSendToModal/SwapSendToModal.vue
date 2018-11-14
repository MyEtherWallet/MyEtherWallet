<template>
  <div class="modal-container">
    <b-modal
      ref="swapconfirmation"
      hide-footer
      centered
      class="bootstrap-modal bootstrap-modal-wide padding-40-20"
      title="Confirmation">
      <div class="time-remaining">
        <h1>{{ timeRemaining }}</h1>
        <p>Time Remaining</p>
      </div>
      <div class="swap-detail">
        <div class="from-address">
          <div class="icon">
            <img :src="fromAddress.image">
          </div>
          <p class="value">{{ fromAddress.value }} <span>{{ fromAddress.name }}</span></p>
          <p
            v-show="fromAddress.address !== ''"
            class="block-title">From Address</p>
          <p
            v-show="fromAddress.address !== ''"
            class="address">{{ fromAddress.address }}</p>
        </div>
        <div class="right-arrow">
          <img :src="arrowImage">
        </div>
        <div class="to-address">
          <div class="icon">
            <img :src="toAddress.image">
          </div>
          <p class="value">{{ toAddress.value }} <span>{{ toAddress.name }}</span></p>
          <p
            v-show="toAddress.address !== ''"
            class="block-title">To Address</p>
          <p
            v-show="toAddress.address !== ''"
            class="address">{{ toAddress.address }}</p>
        </div>
        <div
          v-show="!fromFiat"
          class="confirm-send-button">
          <h4>Send {{ fromAddress.value }} {{ fromAddress.name }} to <span class="address">{{ qrcode }}</span></h4>
          <qrcode
            :value="qrcode"
            :options="{ size: 200 }"/>
        </div>
        <simplex-checkout-form
          v-if="fromFiat && swapProvider === 'simplex'"
          :form-data="swapDetails.dataForInitialization"
          :continue-action="redirectToPartner"/>
      </div>

      <help-center-button/>

    </b-modal>
  </div>
</template>

<script>
import Arrow from '@/assets/images/etc/single-arrow.svg';
import iconBtc from '@/assets/images/currency/btc.svg';
import iconEth from '@/assets/images/currency/eth.svg';
import ButtonWithQrCode from '@/components/Buttons/ButtonWithQrCode';
import HelpCenterButton from '@/components/Buttons/HelpCenterButton';
import CheckoutForm from '../CheckoutForm';

import { fiat, utils } from '@/partners';

export default {
  components: {
    'button-with-qrcode': ButtonWithQrCode,
    'help-center-button': HelpCenterButton,
    'simplex-checkout-form': CheckoutForm
  },
  props: {
    swapDetails: {
      type: Object,
      default: function() {
        return {};
      }
    }
  },
  data() {
    return {
      currencyIcons: {
        BTC: iconBtc,
        ETH: iconEth
      },
      timerInterval: {},
      timeRemaining: 0,
      fiatCurrencies: fiat.map(entry => entry.symbol),
      fromFiat: false,
      qrcode: '',
      arrowImage: Arrow,
      fromAddress: {
        image: iconEth,
        value: '1.0000000000',
        name: 'ETH',
        address: '0xF54F78F67feCDd37e0C009aB4cCD6549A69540D4'
      },
      toAddress: {
        image: iconBtc,
        value: '0.0034523',
        name: 'BTC',
        address: '0xF54F78F67feCDd37e0C009aB4cCD6549A69540D4'
      }
    };
  },
  computed: {
    swapProvider() {
      return this.swapDetails.provider;
    }
  },
  watch: {
    swapDetails(newValue) {
      this.timeUpdater(newValue);
      if (this.fiatCurrencies.includes(newValue.fromCurrency)) {
        this.fromFiat = true;
        this.fromAddress = {
          image: this.currencyIcons[newValue.fromCurrency],
          value: newValue.fromValue,
          name: newValue.fromCurrency,
          address: newValue.fromAddress ? newValue.fromAddress : ''
        };
        this.toAddress = {
          image: this.currencyIcons[newValue.toCurrency],
          value: newValue.toValue,
          name: newValue.toCurrency,
          address: newValue.toAddress
        };
      } else if (this.fiatCurrencies.includes(newValue.toCurrency)) {
        this.fromAddress = {
          image: this.currencyIcons[newValue.fromCurrency],
          value: newValue.fromValue,
          name: newValue.fromCurrency,
          address: newValue.fromAddress ? newValue.fromAddress : ''
        };
        this.toAddress = {
          image: this.currencyIcons[newValue.toCurrency],
          value: newValue.toValue,
          name: newValue.toCurrency,
          address: ''
        };
      } else {
        this.fromAddress = {
          image: this.currencyIcons[newValue.fromCurrency],
          value: newValue.fromValue,
          name: newValue.fromCurrency,
          address: newValue.fromAddress ? newValue.fromAddress : ''
        };
        this.toAddress = {
          image: this.currencyIcons[newValue.toCurrency],
          value: newValue.toValue,
          name: newValue.toCurrency,
          address: newValue.toAddress
        };
      }
    }
  },
  methods: {
    timeUpdater(swapDetails) {
      clearInterval(this.timerInterval);
      this.timeRemaining = utils.getTimeRemainingString(swapDetails.timestamp);
      this.timerInterval = setInterval(() => {
        this.timeRemaining = utils.getTimeRemainingString(
          swapDetails.timestamp
        );
        if (this.timeRemaining === 'expired') {
          clearInterval(this.timerInterval);
        }
      }, 1000);
    },
    redirectToPartner() {
      this.swapStarted(this.swapDetails);
      this.$refs.swapconfirmation.hide();
    },
    swapStarted(swapDetails) {
      this.timeUpdater(swapDetails);
      if (swapDetails.dataForInitialization) {
        switch (swapDetails.provider) {
          case 'changelly':
            this.changellySwap(swapDetails);
            break;
          case 'bity':
            this.bitySwap(swapDetails);
            break;
        }
      } else {
        throw Error('Invalid details from swap provider');
      }
    },
    buildQrCodeContent(swapDetails) {
      if (swapDetails.fromCurrency === 'BTC') {
        this.qrcode = `bitcoin:${swapDetails.providerAddress}`;
      } else {
        this.qrcode = swapDetails.providerAddress;
      }
    },
    bitySwap(swapDetails) {
      this.buildQrCodeContent(swapDetails);
      // this.qrcode = swapDetails.providerAddress;
      // this.$store.dispatch('addSwapTransaction', [this.currentAddress, value]);
    },
    changellySwap(swapDetails) {
      this.buildQrCodeContent(swapDetails);
      // this.qrcode = swapDetails.providerAddress;
      // this.$store.dispatch('addSwapTransaction', [this.currentAddress, value]);
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'SwapSendToModal.scss';
</style>
