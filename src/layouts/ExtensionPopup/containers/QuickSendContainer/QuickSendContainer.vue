<template>
  <div class="quick-send-container">
    <div>
      <div class="quick-send-header">
        <p v-show="step === 1">{{ $t('mewcx.quick-send') }}</p>
        <p v-show="step === 4">{{ $t('mewcx.success') }}!</p>
        <p v-show="step > 1 && step < 4" class="clickable" @click="back">
          <img src="@/assets/images/icons/arrow-left.svg" />
          {{ $t('common.back') }}
        </p>
        <p v-show="step !== 4" class="clickable" @click="actualCancel">
          {{ $t('common.cancel') }}
        </p>
      </div>
      <b-progress
        :value="perc"
        :max="100"
        class="custom-progress"
        variant="success"
      />
    </div>
    <div class="quick-send-step-contents">
      <h4 v-show="step < 4" class="title">
        {{ $t('mewcx.step') }} {{ step }}. {{ steps[step] }}
      </h4>
      <form v-show="step === 1" @submit.prevent="next">
        <div class="from-text">
          <p>{{ $t('mewcx.from') }}</p>
          <p v-show="hasManyWallets" @click="switchWallet">
            {{ $t('mewcx.change') }}
          </p>
        </div>
        <wallet-view-component
          :usd="usd"
          :address="selectedWallet.address"
          :name="selectedWallet.nick"
          :balance="selectedWallet.balance"
        />
        <div class="password-container">
          <label for="walletPassword"> {{ $t('mewcx.password') }} </label>
          <div class="password-input">
            <input
              v-model="password"
              :type="show ? 'text' : 'password'"
              placeholder="Enter your password"
              name="walletPassword"
            />
            <img :src="show ? showIcon : hide" @click.prevent="show = !show" />
          </div>
          <span class="error">
            {{ error.hasOwnProperty('msg') ? error.msg : '' }}
          </span>
        </div>
      </form>
      <form
        v-show="step === 2"
        class="send-to-container"
        @submit.prevent="next"
      >
        <div class="to-address-container">
          <dropdown-address-selector
            :clear-address="false"
            :title="$t('sendTx.to-addr')"
            @toAddress="getToAddress($event)"
          />
        </div>
        <div class="to-amount-container">
          <label for="amountToSend">
            <p>{{ $t('mewcx.amount-to-send') }}</p>
            <p @click="entireBalance">{{ $t('sendTx.button-entire') }}</p>
          </label>
          <div class="to-amount-input">
            <input
              v-model="value"
              type="number"
              placeholder="Enter address"
              name="amountToSend"
            />
          </div>
        </div>
      </form>
      <div v-show="step === 3" class="confirmation-container">
        <div class="confirmation-amount">
          <p>
            <b>{{ $t('sendTx.amount') }}</b>
          </p>
          <p>{{ value }} {{ network.type.name }}</p>
        </div>
        <p>
          <b> {{ $t('mewcx.from') }}</b>
        </p>
        <wallet-view-component
          :usd="usd"
          :address="selectedWallet.address"
          :name="selectedWallet.nick"
          :balance="selectedWallet.balance"
        />
        <p>
          <b>{{ $t('sendTx.to-addr') }}</b>
        </p>
        <div class="to-address-confirmation">
          <div>
            <blockie :address="toAddress" width="50px" height="50px" />
          </div>
          <div>
            {{ toAddress }}
          </div>
        </div>
      </div>
      <div v-show="step === 4" class="success-container">
        <div class="check-icon">
          <i class="fa fa-check" aria-hidden="true" />
        </div>
        <h3>{{ $t('mewcx.success') }}</h3>
        <p>{{ $t('mewcx.your-tx-hash') }}</p>
        <a :href="txLinkAndHash" target="_blank" rel="noopener noreferrer">{{
          txHash | concatAddr
        }}</a>
      </div>
    </div>
    <div :class="[isValid ? '' : 'disabled', 'next-button']" @click="next">
      <p v-show="step === 1 || step === 2">
        <span v-show="!loading">{{ $t('common.next') }}</span>
        <i v-show="loading" class="fa fa-spinner fa-spin" />
      </p>
      <p v-show="step === 3">
        <span v-show="!loading">{{ $t('mewcx.confirm-send') }}</span>
        <i v-show="loading" class="fa fa-spinner fa-spin" />
      </p>
      <p v-show="step === 4">{{ $t('mewcx.done') }}</p>
    </div>
  </div>
</template>

<script>
/* eslint no-console:0 */
import WalletViewComponent from '../../components/WalletViewComponent';
import hide from '@/assets/images/icons/hide-password.svg';
import showIcon from '@/assets/images/icons/show-password.svg';
import BigNumber from 'bignumber.js';
import DropDownAddressSelector from '@/components/DropDownAddressSelector';
import Blockie from '@/components/Blockie';
import { Misc } from '@/helpers';
import { mapState } from 'vuex';
import ethUnit from 'ethjs-unit';
import { WEB3_SIGN_TX } from '@/builds/mewcx/cxHelpers/cxEvents';

export default {
  components: {
    'wallet-view-component': WalletViewComponent,
    'dropdown-address-selector': DropDownAddressSelector,
    blockie: Blockie
  },
  props: {
    cancel: {
      type: Function,
      default: () => {}
    },
    switchWallet: {
      type: Function,
      default: () => {}
    },
    selectedWallet: {
      type: Object,
      default: () => {
        return {};
      }
    },
    usd: {
      type: Number,
      default: 0
    },
    hasManyWallets: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      step: 1,
      steps: {
        1: 'Access Wallet',
        2: 'Send To',
        3: 'Confirm'
      },
      show: false,
      hide: hide,
      showIcon: showIcon,
      password: '',
      toAddress: '',
      value: 0,
      txHash: '',
      error: {},
      loading: false,
      rawTx: {},
      gasPrice: 0,
      gasLimit: 0,
      isValidAddress: false
    };
  },
  computed: {
    ...mapState('main', ['web3', 'network']),
    txLinkAndHash() {
      return this.network.type.blockExplorerTX.replace(
        '[[txHash]]',
        this.txHash
      );
    },
    isValid() {
      if (this.step === 1) {
        return this.password !== '' && this.password.length > 7;
      } else if (this.step === 2) {
        const walletBalance = new BigNumber(this.selectedWallet.balance);
        const valToSend = new BigNumber(this.value);
        return !valToSend.gt(walletBalance) && this.isValidAddress;
      }
      return true;
    },
    perc() {
      return this.step * 30;
    }
  },
  watch: {
    toAddress() {
      this.getGasPrice();
      this.estimateGas();
      this.error = {};
    },
    password() {
      this.error = {};
    }
  },
  methods: {
    getToAddress(data) {
      this.toAddress = data.address;
      this.isValidAddress = data.valid;
    },
    back() {
      switch (this.step) {
        case 2:
          this.clearWallet();
          break;
        case 3:
          this.clearTransaction();
          break;
      }
    },
    next() {
      switch (this.step) {
        case 1:
          this.unlockWallet();
          break;
        case 2:
          this.createTransaction();
          break;
        case 3:
          this.sendTransaction();
          break;
        case 4:
          this.actualCancel();
          break;
      }
    },
    clearWallet() {
      this.loading = false;
      this.password = '';
      this.show = false;
      this.step -= 1;
    },
    clearTransaction() {
      this.loading = false;
      this.toAddress = '';
      this.value = 0;
      this.rawTx = {};
      this.gasPrice = 0;
      this.gasLimit = 0;
      this.step -= 1;
      this.toValue = '0';
      this.isValidAddress = false;
    },
    unlockWallet() {
      this.loading = true;
      this.step += 1;
      this.loading = false;
    },
    async getGasPrice() {
      this.web3.eth.getGasPrice().then(res => {
        this.gasPrice = new BigNumber(ethUnit.fromWei(res, 'gwei')).toString();
      });
    },
    async estimateGas() {
      const params = {
        from: this.selectedWallet.address,
        value: this.value,
        to: this.toAddress,
        gasPrice: Misc.sanitizeHex(
          ethUnit.toWei(this.gasPrice, 'gwei').toString(16)
        ),
        data: '0x'
      };
      if (this.toAddress !== '') {
        this.web3.eth
          .estimateGas(params)
          .then(gasLimit => {
            this.gasLimit = gasLimit;
          })
          .catch(e => {
            // eslint-disable-no-console
            console.error(e);
          });
      }
    },
    entireBalance() {
      const gasPrice = new BigNumber(ethUnit.fromWei(this.gasPrice, 'gwei'));
      const gasLimitAndGasPrice = gasPrice.times(this.gasLimit).toString();
      const convertedLimitAndPrice = ethUnit.fromWei(
        gasLimitAndGasPrice,
        'ether'
      );
      const walletBalance = new BigNumber(this.selectedWallet.balance);
      this.value = walletBalance.minus(convertedLimitAndPrice).toString();
    },
    async createTransaction() {
      this.loading = true;
      const nonce = await this.web3.eth.getTransactionCount(
        this.selectedWallet.address
      );
      this.raw = {
        nonce: nonce,
        to: this.toAddress,
        from: this.selectedWallet.address,
        value: Misc.sanitizeHex(
          ethUnit.toWei(this.value, 'ether').toString(16)
        ),
        gasPrice: Misc.sanitizeHex(
          ethUnit.toWei(this.gasPrice, 'gwei').toString(16)
        ),
        gas: Misc.sanitizeHex(new BigNumber(this.gasLimit).toString(16)),
        data: '0x'
      };

      this.step += 1;
      this.loading = false;
    },
    sendTransaction() {
      const _self = this;
      _self.loading = true;
      const chrome = window.chrome;
      const payload = {
        params: _self.raw,
        password: _self.password,
        signer: _self.raw.from
      };

      const id = chrome.runtime.id;
      chrome.storage.sync.get(null, res => {
        if (res.hasOwnProperty('knownAddresses')) {
          const arr = JSON.parse(res['knownAddresses']);
          arr.push(this.toAddress);

          chrome.storage.sync.set({
            knownAddresses: JSON.stringify(arr)
          });
        } else {
          const newArr = [this.toAddress];
          chrome.storage.sync.set({
            knownAddresses: JSON.stringify(newArr)
          });
        }
      });
      chrome.runtime.sendMessage(
        id,
        {
          event: WEB3_SIGN_TX,
          payload: payload
        },
        {},
        res => {
          _self.loading = false;
          if (res.hasOwnProperty('error')) {
            _self.error = {
              msg: res.error,
              errored: true
            };
          }
          if (res.hasOwnProperty('message')) {
            _self.error = {
              msg: res.message,
              errored: true
            };
          }

          // eslint-disable-next-line
          if (!!res && (!res.hasOwnProperty('message') || !res.hasOwnProperty('error'))) {
            this.txHash = res;
            this.step += 1;
          }
        }
      );
    },
    actualCancel() {
      this.step = 1;
      this.loading = false;
      this.password = '';
      this.show = false;
      this.toAddress = '';
      this.value = 0;
      this.txHash = '';
      this.error = {};
      this.rawTx = {};
      this.cancel();
    }
  }
};
</script>

<style lang="scss">
.quick-send-dropdown {
  color: black;
  height: 72px;
  width: 45px;
}
.quick-send-from-modal {
  .modal-dialog {
    bottom: 0;
    margin: 0 !important;
    position: absolute;
    width: 100%;
  }

  .modal-content {
    border-top-left-radius: 15px;
    border-top-right-radius: 15px;
  }

  .modal-body {
    padding: 0 !important;
  }
}
</style>
<style lang="scss" scoped>
@import 'QuickSendContainer.scss';
</style>
