<template>
  <div class="modal-container">
    <b-modal
      ref="swapconfirmation"
      hide-footer
      centered
      class="bootstrap-modal bootstrap-modal-wide padding-40-20"
      title="Confirmation">
      <div class="time-remaining">
        <h1>09:25</h1>
        <p>Time Remaining</p>
      </div>
      <div class="swap-detail">
        <div class="from-address">
          <div class="icon">
            <img :src="fromAddress.image">
          </div>
          <p class="value">{{ fromAddress.value }} <span>{{ fromAddress.name }}</span></p>
          <p class="block-title">From Address</p>
          <p class="address">{{ fromAddress.address }}</p>
        </div>
        <div class="right-arrow">
          <img :src="arrowImage">
        </div>
        <div class="to-address">
          <div class="icon">
            <img :src="toAddress.image">
          </div>
          <p class="value">{{ toAddress.value }} <span>{{ toAddress.name }}</span></p>
          <p class="block-title">To Address</p>
          <p class="address">{{ toAddress.address }}</p>
        </div>
        <div class="confirm-send-button" >
          <qrcode
            :value="qrcode"
            :options="{ size: 200 }"/>
        </div>

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

export default {
  components: {
    'button-with-qrcode': ButtonWithQrCode,
    'help-center-button': HelpCenterButton
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
      },
    };
  },
  watch: {
    swapDetails(newValue) {
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
  },
  methods: {
    sendTransaction() {
      this.swapStarted(this.swapDetails);
      this.$refs.swapconfirmation.hide();
      // this.$emit('swapStarted');
    },
    swapStarted(value) {
      if (value.dataForInitialization) {
        switch (value.provider) {
          case 'changelly':
            this.changellySwap(value);
            break;
          case 'bity':
            this.bitySwap(value);
            break;
        }
      }
    },
    bitySwap(value) {
      this.qrcode = value.dataForInitialization.payment_address;
      // this.$store.dispatch('addSwapTransaction', [this.currentAddress, value]);
    },
    changellySwap(value){
      this.qrcode = value.dataForInitialization.payinAddress;
      // this.$store.dispatch('addSwapTransaction', [this.currentAddress, value]);
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'SwapSendToModal.scss';
</style>
