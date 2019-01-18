<template>
  <div class="modal-container">
    <b-modal
      ref="swapconfirmation"
      hide-footer
      centered
      class="bootstrap-modal bootstrap-modal-wide padding-40-20"
      title="Confirmation"
    >
      <div class="time-remaining">
        <h1>{{ timeRemaining }}</h1>
        <p>{{ $t('interface.timeRemaining') }}</p>
      </div>
      <div class="swap-detail">
        <div class="from-address">
          <div class="icon">
            <i :class="['cc', fromAddress.name, 'cc-icon']" />
          </div>
          <p class="value">
            {{ fromAddress.value }} <span>{{ fromAddress.name }}</span>
          </p>
          <p
            v-show="fromAddress.address !== '' && !isFromFiat"
            class="block-title"
          >
            {{ $t('interface.fromAddr') }}
          </p>
          <p v-show="fromAddress.address !== '' && !isFromFiat" class="address">
            {{ fromAddress.address }}
          </p>
        </div>
        <div class="right-arrow"><img :src="arrowImage" /></div>
        <div class="to-address">
          <div class="icon">
            <i :class="['cc', toAddress.name, 'cc-icon']" />
          </div>
          <p class="value">
            {{ toAddress.value }} <span>{{ toAddress.name }}</span>
          </p>
          <p v-show="toAddress.address !== ''" class="block-title">
            {{ $t('interface.sendTxToAddr') }}
          </p>
          <p v-show="toAddress.address !== ''" class="address">
            {{ toAddress.address }}
          </p>
        </div>
        <ul v-show="!isFromFiat" class="confirm-send-button">
          <li>
            <div>
              <h4>
                {{ $t('interface.send') }} {{ fromAddress.value }}
                {{ fromAddress.name }} {{ $t('interface.articleTo') }}
                <span class="address">{{ qrcode }}</span>
              </h4>
              <p>{{ swapDetails.providerAddress }}</p>

              <qrcode :value="qrcode" :options="{ size: 200 }" />
            </div>
          </li>
          <li>
            <div @click="sentTransaction">
              <button-with-qrcode
                :qrcode="qrcode"
                :buttonname="$t('interface.sentCoins')"
              />
            </div>
          </li>
        </ul>
        <simplex-checkout-form
          v-if="isFromFiat && swapProvider === 'simplex'"
          :form-data="swapDetails.dataForInitialization"
          :continue-action="redirectToPartner"
        />
      </div>

      <help-center-button />
    </b-modal>
  </div>
</template>

<script>
import Arrow from '@/assets/images/etc/single-arrow.svg';
import ButtonWithQrCode from '@/components/Buttons/ButtonWithQrCode';
import HelpCenterButton from '@/components/Buttons/HelpCenterButton';
import CheckoutForm from '../CheckoutForm';

import { fiat, utils, qrcodeBuilder } from '@/partners';

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
    },
    currentAddress: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      rawSwapDetails: {},
      timerInterval: {},
      timeRemaining: 0,
      fiatCurrencies: fiat.map(entry => entry.symbol),
      qrcode: '',
      arrowImage: Arrow,
      fromAddress: {},
      toAddress: {}
    };
  },
  computed: {
    swapProvider() {
      return this.swapDetails.provider;
    },
    isFromFiat() {
      return this.fiatCurrencies.includes(this.rawSwapDetails.fromCurrency);
    }
  },
  watch: {
    swapDetails(newValue) {
      this.rawSwapDetails = newValue;
      this.timeUpdater(newValue);
      if (
        this.fiatCurrencies.includes(newValue.toCurrency) ||
        this.fiatCurrencies.includes(newValue.fromCurrency)
      ) {
        this.fromAddress = {
          value: newValue.fromValue,
          name: newValue.fromCurrency,
          address: newValue.fromAddress ? newValue.fromAddress : ''
        };
        this.toAddress = {
          value: newValue.toValue,
          name: newValue.toCurrency,
          address: newValue.toAddress ? newValue.toAddress : ''
        };
      } else {
        this.fromAddress = {
          value: newValue.fromValue,
          name: newValue.fromCurrency,
          address: newValue.fromAddress ? newValue.fromAddress : ''
        };
        this.toAddress = {
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
      this.$store
        .dispatch('addSwapNotification', [
          `Swap_Order`,
          this.currentAddress,
          this.swapDetails
        ])
        .then(() => {
          this.$refs.swapconfirmation.hide();
        });
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
      this.qrcode = qrcodeBuilder(
        swapDetails.providerAddress,
        swapDetails.fromCurrency
      );
    },
    bitySwap(swapDetails) {
      this.buildQrCodeContent(swapDetails);
    },
    changellySwap(swapDetails) {
      this.buildQrCodeContent(swapDetails);
    },
    sentTransaction() {
      this.$store
        .dispatch('addSwapNotification', [
          `Swap_Order`,
          this.currentAddress,
          this.swapDetails
        ])
        .then(() => {
          this.$refs.swapconfirmation.hide();
        });
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'SwapSendToModal.scss';
</style>
