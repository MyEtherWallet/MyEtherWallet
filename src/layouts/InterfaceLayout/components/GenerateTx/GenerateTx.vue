<template>
  <div class="generate-tx">

    <div class="page-wrap">
      <div class="main-form-block">
        <div class="form-container grid--1">
          <dropdown-coin-selector :options="coinSelector" />
          <standard-input :options="inputAmount" />
        </div>

        <div class="form-container single--1">
          <dropdown-address-selector :options="addressSelector" />
        </div>

        <div class="form-container single--1">
          <standard-input :options="inputData" />
        </div>

        <div class="form-container single--1">
          <standard-input :options="inputNonce" />
        </div>

        <div class="form-container single--1">
          <standard-input :options="inputGasLimit" />
        </div>
      </div><!-- .main-form-block -->

      <div class="page--bottom-button-container">
        <standard-button 
          :options="buttonGenerate"
          @click.native="openSignedTXModal"
        />
      </div>

      <interface-bottom-text
        link="/"
        question="Have issues?"
        link-text="Learn More"/>





        <!--
        <div class="send-form">
          <div class="form-block amount-to-address">
            <div class="amount">
              <div class="title-container">
                <div class="title">
                  <h4>Type</h4>
                </div>
              </div>
              <currency-picker
                :currency="coinType"
                :token="true"
                page="sendOfflineGenTx"/>
            </div>
            <div>
              <div class="the-form amount-number">
                <div class="title-container">
                  <div class="title">
                    <h4>Amount</h4>
                  </div>
                  <p class="linker-1">Entire Balance</p>
                </div>
                <div class="mew-custom-form__text">
                  <input
                    v-model="toAmt"
                    type="number"
                    name=""
                    placeholder="Deposit Amount">
                  <i
                    v-if="false"
                    :class="[parsedBalance < toAmt ? 'not-good': '','fa fa-check-circle good-button']"
                    aria-hidden="true"/>                
                </div>
              </div>
            </div>
          </div>

          <div>
            <div class="to-address">
              <div class="title-container">
                <div class="title">
                  <h4>To Address</h4>
                </div>
                <p
                  class="copy-button linker-1 prevent-user-select"
                  @click="copyToAddress">Copy</p>
              </div>
              <div class="the-form address-block">
                <dropdown-address-selector />
              </div>
            </div>
          </div>
          <div
            v-show="parsedBalance < toAmt"
            class="error-message-container">
            <p>You don't have enough funds</p>
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
          :to-address="address"
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
      -->







    </div> <!-- .page-wrap -->

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
import DropDownCoinSelector from '@/components/DropDownCoinSelector';
import DropDownAddressSelector from '@/components/DropDownAddressSelector';

// eslint-disable-next-line
const EthTx = require('ethereumjs-tx')
// eslint-disable-next-line
const unit = require('ethjs-unit')

export default {
  components: {
    'interface-bottom-text': InterfaceBottomText,
    'tx-speed-input': TxSpeedInput,
    'signed-tx-modal': SignedTxModal,
    'currency-picker': CurrencyPicker,
    'dropdown-address-selector': DropDownAddressSelector,
    'dropdown-coin-selector': DropDownCoinSelector
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
      buttonGenerate: {
        title: 'Generate',
        buttonStyle: 'green',
        rightArrow: true,
        fullWidth: false
      },
      addressSelector: {
        title: 'To Address',
        buttonCopy: true,
        buttonClear: true,
        popover: 'What is address'
      },
      coinSelector: {
        title: 'Type'
      },
      inputAmount: {
        title: 'Amount',
        value: '',
        type: 'text',
        buttonCopy: false,
        buttonClear: false,
        buttonCustom: 'Entire Balance',
        topTextInfo: '',
        popover: '',
        placeHolder: '',
        rightInputText: ''
      },
      inputData: {
        title: 'Data',
        value: '',
        type: 'text',
        buttonCopy: false,
        buttonClear: false,
        buttonCustom: '',
        topTextInfo: '',
        popover: 'What is data?',
        placeHolder: 'e.g. 0xDECAF9CD23694035AFEDC90943589023590374',
        rightInputText: ''
      },
      inputNonce: {
        title: 'Nonce',
        value: '',
        type: 'text',
        buttonCopy: false,
        buttonClear: false,
        buttonCustom: '',
        topTextInfo: '',
        popover: 'What is Nonce?',
        placeHolder: '',
        rightInputText: ''
      },
      inputGasLimit: {
        title: 'Gas Limit',
        value: '',
        type: 'text',
        buttonCopy: false,
        buttonClear: false,
        buttonCustom: '',
        topTextInfo: '0.00013 ETH ($0.534)',
        popover: 'What is Gas Limit?',
        placeHolder: '',
        rightInputText: 'Gwei'
      },
      toAmt: 0,
      address: '',
      toData: '0x',
      parsedBalance: 0,
      localGas: this.gasLimit,
      coinType: [{ symbol: 'ETH', name: 'Ethereum' }],
      selectedCoinType: '',
      raw: '',
      signed: '',
      locNonce: this.nonce,
      validAddress: false,
      resolvedAddress: ''
    };
  },
  watch: {
    parsedBalance(newVal) {
      this.parsedBalance = newVal;
    },
    gasLimit(newVal) {
      this.localGas = newVal;
    }
  },
  mounted() {
    this.parsedBalance = unit.fromWei(
      this.$store.state.account.balance.result,
      'ether'
    );
  },
  methods: {
    openSignedTXModal() {
      console.log('Modal open');
    },
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
        to:
          this.resolvedAddress !== ''
            ? this.resolvedAddress
            : this.address !== ''
              ? this.address
              : '',
        chainId: this.$store.state.network.type.chainID || 1
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
@import '../InformationBlockForms-desktop';
@import '../InformationBlockForms-tablet';
@import '../InformationBlockForms-mobile';
</style>
