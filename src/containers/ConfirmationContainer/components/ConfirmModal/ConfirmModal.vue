<template>
  <div class="modal-container">
    <b-modal
      ref="confirmation"
      hide-footer
      centered
      class="bootstrap-modal-wide confirmation-modal nopadding"
      title="Confirmation"
    >
      <div class="modal-content qrcode-modal">
        <div class="tx-info">
          <address-block
            :address="from"
            :value="value"
            :token-transfer-val="tokenTransferVal"
            :token-symbol="tokenSymbol"
            direction="from"
          />
          <div v-show="to !== '' && to !== undefined" class="direction">
            <img src="~@/assets/images/icons/right-arrow.svg" />
          </div>
          <address-block
            v-show="to !== '' && to !== undefined"
            :address="to"
            :token-transfer-to="tokenTransferTo"
            :token-transfer-val="tokenTransferVal"
            :token-symbol="tokenSymbol"
            :value="value"
            direction="to"
          />
        </div>
        <div class="detail-info">
          <div class="info">
            <h4>Detail Information</h4>
            <div class="sliding-switch-white">
              <label class="switch">
                <input
                  type="checkbox"
                  @click="modalDetailInformation = !modalDetailInformation"
                />
                <span class="slider round" />
              </label>
            </div>
          </div>
          <div
            :class="modalDetailInformation && 'expended-info-open'"
            class="expended-info"
          >
            <div class="padding-container">
              <div class="grid-block">
                <p>{{ $t('interface.network') }}</p>
                <p>{{ network.type.name }} by {{ network.service }}</p>
              </div>
              <div class="grid-block">
                <p>{{ $t('common.gasLimit') }}</p>
                <p>{{ gas }} wei</p>
              </div>
              <div class="grid-block">
                <p>{{ $t('common.gasPrice') }}</p>
                <p>{{ gasPrice }} gwei</p>
              </div>
              <div class="grid-block">
                <p>{{ $t('common.txFee') }}</p>
                <p>{{ fee }} {{ network.type.name }}</p>
              </div>
              <div class="grid-block">
                <p>Nonce</p>
                <p>{{ nonce }}</p>
              </div>
              <div class="grid-block">
                <p>{{ $t('common.data') }}</p>
                <p>{{ data }}</p>
              </div>
            </div>
          </div>
        </div>

        <div class="submit-button-container">
          <div class="flex-center-align">
            <div class="button-with-helper">
              <div
                ref="ConfirmAndSendButton"
                :class="[
                  signedTx !== '' ? '' : 'disabled',
                  'submit-button large-round-button-green-filled clickable'
                ]"
                @click="sendTx"
              >
                {{ $t('common.confirmAndSend') }}
              </div>
              <div class="tooltip-box-2">
                <b-btn id="exPopover9">
                  <img class="icon" src="~@/assets/images/icons/qr-code.svg" />
                </b-btn>
                <b-popover
                  target="exPopover9"
                  triggers="hover focus"
                  placement="top"
                ></b-popover>
              </div>
            </div>
          </div>
          <p class="learn-more">
            Have any issues?
            <a
              href="https:/kb.myetherwallet.com"
              target="_blank"
              rel="noopener noreferrer"
              >Learn more</a
            >
          </p>
        </div>
      </div>
    </b-modal>
  </div>
</template>

<script>
import AddressBlock from '../AddressBlock';
import BigNumber from 'bignumber.js';
import { mapGetters } from 'vuex';

export default {
  components: {
    'address-block': AddressBlock
  },
  props: {
    confirmSendTx: {
      type: Function,
      default: function() {}
    },
    fee: {
      type: Number,
      default: 0
    },
    signedTx: {
      type: String,
      default: ''
    },
    data: {
      type: String,
      default: '0x'
    },
    from: {
      type: String,
      default: ''
    },
    gas: {
      type: Number,
      default: 0
    },
    gasPrice: {
      type: Number,
      default: 0
    },
    nonce: {
      type: Number,
      default: 0
    },
    to: {
      type: String,
      default: ''
    },
    value: {
      type: Number,
      default: 0
    },
    isHardwareWallet: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      modalDetailInformation: false,
      transactionSigned: false,
      tokenTransferTo: '',
      tokenTransferVal: '',
      tokenSymbol: ''
    };
  },
  computed: {
    ...mapGetters({
      web3: 'web3',
      network: 'network'
    }),
    signedTransaction() {
      if (this.signedMessage) {
        return this.signedMessage;
      } else if (this.isHardwareWallet) {
        return this.$t('confirmation.approveOnDevice');
      }
      return '';
    }
  },
  watch: {
    data(newVal) {
      this.parseData(newVal);
    }
  },
  mounted() {
    if (this.data !== '0x') {
      this.parseData(this.data);
    }
  },
  methods: {
    sendTx() {
      if (this.signedTx !== '') {
        this.confirmSendTx();
      }
    },
    async parseData(data) {
      const web3 = this.web3;
      const networkToken = this.network.type.tokens;
      const tokenIndex = networkToken.findIndex(el => {
        return el.address.toLowerCase() === this.to.toLowerCase();
      });

      const jsonInterface = {
        constant: false,
        inputs: [
          { name: '_to', type: 'address' },
          { name: '_amount', type: 'uint256' }
        ],
        name: 'transfer',
        outputs: [{ name: '', type: 'bool' }],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function'
      };
      const transferFuncSig = web3.eth.abi.encodeFunctionSignature(
        jsonInterface
      );
      this.tokenTransferTo = '';
      this.tokenTransferVal = '';
      this.tokenSymbol = '';
      if (data.substr(0, 10) === transferFuncSig) {
        const params = web3.eth.abi.decodeParameters(
          ['address', 'uint256'],
          `${data.substr(10)}`
        );
        const value = new BigNumber(params[1]);
        this.tokenTransferTo = params[0];
        this.tokenTransferVal =
          tokenIndex !== -1
            ? value
                .div(new BigNumber(10).pow(networkToken[tokenIndex].decimals))
                .toFixed()
                .toString(10)
            : value;
        this.tokenSymbol =
          tokenIndex !== -1 ? networkToken[tokenIndex].symbol : 'Unknown Token';
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'ConfirmModal.scss';
</style>
