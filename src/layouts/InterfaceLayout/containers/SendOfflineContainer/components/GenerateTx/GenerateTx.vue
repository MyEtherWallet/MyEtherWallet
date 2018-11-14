<template>
  <div class="generate-info">
    <div class="wrap">
      <div class="send-form">
        <div class="form-block amount-to-address">
          <div class="amount">
            <div class="title">
              <h4>{{ $t('interface.sendTxAmount') }}</h4>
            </div>
            <currency-picker
              :currency="coinType"
              :token="true"
              page="sendOfflineGenTx"
            />
            <div class="the-form amount-number">
              <input
                v-model="toAmt"
                :placeholder="$t('interface.depAmount')"
                type="number"
                name="">
              <i
                :class="[account.balance < toAmt ? 'not-good': '','fa fa-check-circle good-button']"
                aria-hidden="true"/>
            </div>
          </div>
          <div class="to-address">
            <div class="title">
              <h4>{{ $t('interface.sendTxToAddr') }} &nbsp;</h4>
              <blockie
                v-show="(address !== '' || resolvedAddress !== '') && validAddress"
                :address="address !== '' ? address: resolvedAddress !== ''? resolvedAddress:''"
                width="22px"
                height="22px"
              />
              <p
                class="copy-button linker-1 prevent-user-select"
                @click="copyToAddress">{{ $t('common.copy') }}</p>
            </div>
            <div class="the-form address-block">
              <textarea
                v-ens-resolver="address"
                ref="toaddress"
                v-model="address"
                name="name"
                placeholder="Please Enter The Address"
              />
              <i
                :class="[
                  validAddress ? '' : 'not-good',
                  'fa fa-check-circle good-button'
                ]"
                aria-hidden="true"
              />
            </div>
          </div>
        </div>
        <div
          v-show="account.balance < toAmt"
          class="error-message-container">
          <p>{{ $t('interface.notEnoughBalance') }}</p>
        </div>
      </div>

      <div class="send-form">
        <div class="title-container">
          <div class="title">
            <div class="title-helper">
              <h4>{{ $t('common.data') }}</h4>
              <popover :popcontent="$t('popover.whatIsDataContent')" />
            </div>
          </div>
        </div>
        <div class="the-form gas-amount">
          <input
            v-model="toData"
            type="number"
            name=""
            placeholder="e.g. 0x65746865726d696e652d657531"
          />
          <div class="good-button-container">
            <i
              class="fa fa-check-circle good-button not-good"
              aria-hidden="true"
            />
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
        @gasLimitUpdate="gasLimitUpdated"
      />
      <div class="submit-button-container">
        <div
          :class="[!validAddress ? 'disabled': '' ,'submit-button large-round-button-green-filled']"
          @click="next">
          {{ $t('interface.generateTx') }}
        </div>
        <interface-bottom-text
          link="mailto:support@myetherwallet.com"
          question="Have issues?"
          link-text="Learn More"
        />
      </div>
    </div>
    <signed-tx-modal
      ref="signedTxModal"
      :signed-tx="signed"
      :raw-tx="raw"
      :path-update="pathUpdate"
    />
  </div>
</template>

<script>
import InterfaceBottomText from '@/components/InterfaceBottomText';
import TxSpeedInput from '../TxSpeedInput';
import CurrencyPicker from '@/layouts/InterfaceLayout/components/CurrencyPicker';
import SignedTxModal from '../SignedTxModal';
import Blockie from '@/components/Blockie';
// eslint-disable-next-line
const EthTx = require('ethereumjs-tx');
import * as unit from 'ethjs-unit';
import { mapGetters } from 'vuex';

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
      toAmt: '0',
      address: '',
      toData: '0x',
      localGas: this.gasLimit,
      coinType: [{ symbol: 'ETH', name: 'Ethereum' }],
      selectedCoinType: '',
      raw: {},
      signed: '',
      locNonce: this.nonce,
      validAddress: false,
      resolvedAddress: ''
    };
  },
  computed: {
    ...mapGetters({
      account: 'account',
      wallet: 'wallet',
      network: 'network',
      web3: 'web3',
      gasPrice: 'gasPrice'
    })
  },
  watch: {
    gasLimit(newVal) {
      this.localGas = newVal;
    }
  },
  methods: {
    copyToAddress() {
      this.$refs('toaddress').select();
      document.execCommand('copy');
      window.getSelection().removeAllRanges();
    },
    async next() {
      const raw = {
        from: this.wallet.getAddressString(),
        gas: this.localGas,
        value: unit.toWei(this.toAmt, 'ether'),
        data: this.toData,
        nonce: this.locNonce,
        gasPrice: Number(unit.toWei(this.gasPrice, 'gwei')),
        to:
          this.resolvedAddress !== ''
            ? this.resolvedAddress
            : this.address !== ''
            ? this.address
            : '',
        chainId: this.network.type.chainID || 1,
        generateOnly: true
      };

      this.raw = raw;

      const signed = await this.web3.eth.signTransaction(this.raw);
      this.signed = JSON.stringify(signed);
      this.$emit('createdRawTx', JSON.stringify(signed));
      this.$refs.signedTxModal.$refs.signedTx.show();
      window.scrollTo(0, 0);
    },
    gasLimitUpdated(e) {
      this.$emit('gasLimitUpdate', e);
    },
    nonceUpdated(e) {
      this.locNonce = e;
      this.$emit('nonceUpdate', e);
    },
    pathUpdate() {
      this.$emit('pathUpdate', 'Offline Send Transaction');
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'GenerateTx.scss';
</style>
