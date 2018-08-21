<template>
  <div class="generate-info">
    <div class="wrap">

      <div class="send-form">
        <div class="form-block amount-to-address">
          <div class="amount">
            <div class="title">
              <h4>Amount</h4>
            </div>
            <currency-picker
              :currency="coinType"
              :token="true"
              page="sendOfflineGenTx"/>
            <div class="the-form amount-number">
              <input
                v-model="toAmt"
                type="number"
                name=""
                placeholder="Deposit Amount" >
              <i
                :class="[parsedBalance < toAmt ? 'not-good': '','fa fa-check-circle good-button']"
                aria-hidden="true"/>
            </div>
          </div>
          <div class="to-address">
            <div class="title">
              <h4>To Address</h4>
              <blockie
                v-show="toAddress !== '' && !validAddress"
                :address="toAddress"
                width="22px"
                height="22px"/>
              <p
                class="copy-button linker-1 prevent-user-select"
                @click="copyToAddress">Copy</p>
            </div>
            <div class="the-form address-block">
              <textarea
                ref="toaddress"
                v-model="toAddress"
                name="name"
                placeholder="Please Enter The Address"/>
              <i
                class="fa fa-check-circle good-button not-good"
                aria-hidden="true"/>
            </div>
          </div>
        </div>
        <div
          v-show="parsedBalance < toAmt"
          class="error-message-container">
          <p>You don't have enough funds</p>
        </div>
        <div
          v-show="toAddress !== '' && !validAddress"
          class="error-message-container">
          <p>Invalid Address</p>
        </div>
      </div>

      <div class="send-form">
        <div class="title-container">
          <div class="title">
            <div class="title-helper">
              <h4>Data</h4>
              <popover :popcontent="$t('popover.whatIsDataContent')"/>
            </div>
          </div>
        </div>
        <div class="the-form gas-amount">
          <input
            v-model="toData"
            type="number"
            name=""
            placeholder="e.g. 0x65746865726d696e652d657531" >
          <div class="good-button-container">
            <i
              class="fa fa-check-circle good-button not-good"
              aria-hidden="true"/>
          </div>
        </div>
      </div>
      <tx-speed-input
        :nonce="nonce"
        :data="toData"
        :value="toAmt"
        :to-address="toAddress"
        :gas-limit="gasLimit"
        @nonceUpdate="nonceUpdated"
        @gasLimitUpdate="gasLimitUpdated"/>
      <div class="submit-button-container">
        <div
          :class="[!validAddress ? 'disabled': '' ,'submit-button large-round-button-green-filled']"
          @click="next">
          Generate
        </div>
        <interface-bottom-text
          link="/"
          question="Have issues?"
          link-text="Learn More"/>
      </div>

    </div>
    <signed-tx-modal
      :signed-tx="signed"
      :raw-tx="raw"
      :path-update="pathUpdate"/>
  </div>
</template>

<script>
import InterfaceBottomText from '@/components/InterfaceBottomText';
import TxSpeedInput from '../../components/TxSpeedInput';
import CurrencyPicker from '../CurrencyPicker';
import SignedTxModal from '../../components/SignedTxModal';
import Blockie from '@/components/Blockie';
// eslint-disable-next-line
const EthTx = require('ethereumjs-tx')
// eslint-disable-next-line
const unit = require('ethjs-unit')

export default {
  components: {
    'interface-bottom-text': InterfaceBottomText,
    'tx-speed-input': TxSpeedInput,
    blockie: Blockie,
    'signed-tx-modal': SignedTxModal,
    'currency-picker': CurrencyPicker
  },
  props: {
    gasLimit: {
      type: Number,
      default: 0
    },
    nonce: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      toAmt: 0,
      toAddress: '',
      toData: '0x',
      parsedBalance: 0,
      localGas: this.gasLimit,
      coinType: [{ symbol: 'ETH', name: 'Ethereum' }],
      selectedCoinType: '',
      raw: '',
      signed: '',
      locNonce: this.nonce,
      validAddress: false
    };
  },
  watch: {
    parsedBalance(newVal) {
      this.parsedBalance = newVal;
    },
    gasLimit(newVal) {
      this.localGas = newVal;
    },
    toAddress(newVal) {
      if (
        newVal !== '' &&
        newVal.length !== 0 &&
        this.$store.state.web3.utils.isAddress(newVal)
      ) {
        this.validAddress = true;
      } else {
        this.validAddress = false;
      }

      this.toAddress = newVal;
    }
  },
  mounted() {
    this.parsedBalance = unit.fromWei(
      this.$store.state.account.balance.result,
      'ether'
    );
  },
  methods: {
    copyToAddress() {
      this.$refs('toaddress').select();
      document.execCommand('copy');
      window.getSelection().removeAllRanges();
    },
    next() {
      const raw = {
        from: this.$store.state.wallet.getAddressString(),
        gas: this.localGas,
        value: unit.toWei(this.toAmt, 'ether'),
        data: this.toData,
        nonce: this.locNonce,
        gasPrice: Number(unit.toWei(this.$store.state.gasPrice, 'gwei')),
        to: this.toAddress,
        chainId: this.$store.state.network.type.chainID
      };
      this.$store.state.web3.eth.signTransaction(raw).then(signedTx => {
        this.$emit('createdRawTx', signedTx.rawTransaction);

        this.raw = raw;
        this.signed = signedTx.rawTransaction;
        this.$children[5].$refs.signedTx.show();
        window.scrollTo(0, 0);
      });
    },
    gasLimitUpdated(e) {
      this.$emit('gasLimitUpdate', e);
    },
    nonceUpdated(e) {
      this.$emit('nonceUpdate', e);
    },
    pathUpdate() {
      this.$emit('pathUpdate', 'sendPubTx');
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'GenerateTx.scss';
</style>
