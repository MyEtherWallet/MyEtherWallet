<template>
  <div class="send-currency-container">
    <interface-container-title :title="$t('common.sendTx')"/>

    <div class="send-form">
      <div class="form-block amount-to-address">
        <div class="amount">
          <div class="title">
            <h4>{{ $t("interface.sendTxAmount") }}</h4>
            <p
              class="title-button prevent-user-select"
              @click="setBalanceToAmt">Entire Balance</p>
          </div>
          <currency-picker
            :currency="tokensWithBalance"
            :page="'sendEthAndTokens'"
            :token="true"
            @selectedCurrency="setSelectedCurrency"/>
          <div class="the-form amount-number">
            <input
              v-model="amount"
              type="number"
              name=""
              placeholder="Amount" >
            <i
              :class="[selectedCurrency.name === 'Ether' ? parsedBalance < amount ? 'not-good': '' : selectedCurrency.balance < amount ? 'not-good': '','fa fa-check-circle good-button']"
              aria-hidden="true"/>
          </div>
          <div
            v-if="selectedCurrency.name === 'Ether' ? amount > parsedBalance : selectedCurrency.balance < amount"
            class="error-message-container">
            <p>{{ $t('common.dontHaveEnough') }}</p>
          </div>
        </div>
        <div class="to-address">
          <div class="title">
            <h4>{{ $t("interface.sendTxToAddr") }}
              <blockie
                v-show="validAddress && address.length !== 0"
                :address="address"
                width="32px"
                height="32px"
                class="blockie-image"/>
            </h4>

            <p
              class="copy-button prevent-user-select"
              @click="copyToClipboard('address')">{{
                $t('common.copy')
              }}</p>
          </div>
          <div class="the-form address-block">
            <textarea
              v-ens-resolver="address"
              ref="address"
              v-model="address"
              name="name"
              autocomplete="off"/>
            <i
              :class="[validAddress && address.length !== 0 ? '':'not-good', 'fa fa-check-circle good-button']"
              aria-hidden="true"/>
          </div>
        </div>
      </div>
    </div>

    <div class="send-form">
      <div class="title-container">
        <div class="title">
          <div class="title-helper">
            <h4>{{ $t("common.speedTx") }}</h4>
            <popover :popcontent="$t('popover.whatIsSpeedOfTransactionContent')"/>
          </div>
          <p>{{ $t("common.txFee") }}: {{ transactionFee }} ETH </p>
        </div>
        <div class="buttons">
          <div
            :class="[$store.state.gasPrice === 5 ? 'active': '', 'small-circle-button-green-border']"
            @click="changeGas(5)">
            {{ $t('common.slow') }}
          </div>
          <div
            :class="[$store.state.gasPrice === 45 ? 'active': '', 'small-circle-button-green-border']"
            @click="changeGas(45)">
            {{ $t('common.regular') }}
          </div>
          <div
            :class="[$store.state.gasPrice === 75 ? 'active': '', 'small-circle-button-green-border']"
            @click="changeGas(75)">
            {{ $t('common.fast') }}
          </div>
        </div>
      </div>

      <div class="the-form gas-amount">
        <input
          v-model="gasAmount"
          type="number"
          name=""
          placeholder="Gas Amount" >
        <div class="good-button-container">
          <p>Gwei</p>
          <i
            class="fa fa-check-circle good-button not-good"
            aria-hidden="true"/>
        </div>
      </div>
    </div>
    <div class="send-form advanced">
      <div class="advanced-content">

        <div class="toggle-button-container">
          <h4>{{ $t('common.advanced') }}</h4>
          <div class="toggle-button">
            <span>{{ $t('interface.dataGas') }}</span>
            <!-- Rounded switch -->
            <div class="sliding-switch-white">
              <label class="switch">
                <input
                  type="checkbox"
                  @click="advancedExpend = !advancedExpend" >
                <span class="slider round"/>
              </label>
            </div>
          </div>
        </div>
        <div
          v-if="advancedExpend"
          class="input-container">
          <div class="the-form user-input">
            <input
              v-model="data"
              type="text"
              name=""
              placeholder="Add Data (e.g. 0x7834f874g298hf298h234f)"
              autocomplete="off" >
          </div>
          <div class="the-form user-input">
            <input
              v-model="gasLimit"
              type="number"
              name=""
              placeholder="Gas Limit" >
          </div>
        </div>
      </div>
    </div>

    <div class="submit-button-container">
      <div
        :class="[validAddress && address.length !== 0? '': 'disabled','submit-button large-round-button-green-filled']"
        @click="confirmationModalOpen">
        {{ $t('interface.sendTx') }}
      </div>
      <interface-bottom-text
        :link-text="$t('interface.learnMore')"
        :question="$t('interface.haveIssues')"
        link="/"/>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

import InterfaceContainerTitle from '../../components/InterfaceContainerTitle';
import CurrencyPicker from '../../components/CurrencyPicker';
import InterfaceBottomText from '@/components/InterfaceBottomText';
import Blockie from '@/components/Blockie';

import * as unit from 'ethjs-unit';

export default {
  components: {
    'interface-container-title': InterfaceContainerTitle,
    'interface-bottom-text': InterfaceBottomText,
    blockie: Blockie,
    'currency-picker': CurrencyPicker
  },
  props: {
    tokensWithBalance: {
      type: Array,
      default: function() {
        return [];
      }
    },
    getBalance: {
      type: Function,
      default: function() {}
    }
  },
  data() {
    return {
      advancedExpend: false,
      validAddress: true,
      amount: 0,
      amountValid: true,
      nonce: 0,
      gasLimit: 21000,
      data: '0x',
      gasAmount: this.$store.state.gasPrice,
      parsedBalance: 0,
      address: '',
      transactionFee: 0,
      selectedCurrency: { symbol: 'ETH', name: 'Ethereum' },
      raw: {},
      signedTx: '',
      resolvedAddress: ''
    };
  },
  computed: {
    ...mapGetters({
      account: 'account'
    })
  },
  watch: {
    address(newVal) {
      this.address = newVal;
      if (this.verifyAddr()) {
        this.validAddress = false;
      } else {
        this.estimateGas();
        this.validAddress = true;
      }
    },
    parsedBalance(newVal) {
      this.parsedBalance = newVal;
    },
    gasAmount(newVal) {
      this.gasAmount = newVal;
      if (!this.verifyAddr()) {
        this.estimateGas();
      }
      this.$store.dispatch('setGasPrice', Number(newVal));
    },
    amount(newVal) {
      this.amount = newVal;
      if (!this.verifyAddr()) {
        this.estimateGas();
      }
    },
    selectedCurrency(newVal) {
      this.estimateGas();
      this.selectedCurrency = newVal;
    }
  },
  mounted() {
    if (this.account.balance) {
      this.parsedBalance = unit.fromWei(
        parseInt(this.account.balance),
        'ether'
      );
    }
  },
  methods: {
    copyToClipboard(ref) {
      this.$refs[ref].select();
      document.execCommand('copy');
    },
    async createTx() {
      const jsonInterface = [
        {
          constant: false,
          inputs: [
            { name: '_to', type: 'address' },
            { name: '_amount', type: 'uint256' }
          ],
          name: 'transfer',
          outputs: [{ name: 'success', type: 'bool' }],
          payable: false,
          type: 'function'
        }
      ];
      const contract = new this.$store.state.web3.eth.Contract(jsonInterface);
      const isEth = this.selectedCurrency.name === 'Ethereum';
      this.nonce = await this.$store.state.web3.eth.getTransactionCount(
        this.$store.state.wallet.getAddressString()
      );
      this.data = isEth
        ? this.data
        : contract.methods
            .transfer(this.address, unit.toWei(this.amount, 'ether'))
            .encodeABI();

      this.raw = {
        from: this.$store.state.wallet.getAddressString(),
        gas: this.gasLimit,
        nonce: this.nonce,
        gasPrice: Number(unit.toWei(this.$store.state.gasPrice, 'gwei')),
        value: isEth
          ? this.amount === ''
            ? 0
            : unit.toWei(this.amount, 'ether')
          : 0,
        to: isEth ? this.address : this.selectedCurrency.addr,
        data: this.data,
        chainId: this.$store.state.network.type.chainID || 1
      };

      if (this.address === '') {
        delete this.raw['to'];
      }

      if (window.web3 && this.$store.state.wallet.identifier === 'Web3') {
        this.raw['web3WalletOnly'] = true;
      }

      this.$store.state.web3.eth.sendTransaction(this.raw);
    },
    confirmationModalOpen() {
      this.createTx();
      window.scrollTo(0, 0);
    },
    changeGas(val) {
      this.gasAmount = val;
      this.createDataHex();
      this.$store.dispatch('setGasPrice', Number(val));
    },
    setBalanceToAmt() {
      if (this.selectedCurrency.name === 'Ethereum') {
        this.amount = this.parsedBalance - this.transactionFee;
      } else {
        this.amount = this.selectedCurrency.balance;
      }
    },
    createDataHex() {
      if (this.selectedCurrency.name !== 'Ethereum' && this.address !== '') {
        const amount = this.$store.state.web3.utils.toWei(
          this.amount.toString(),
          'eth'
        );
        const jsonInterface = [
          {
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
          }
        ];
        const contract = new this.$store.state.web3.eth.Contract(
          jsonInterface,
          this.selectedCurrency.addr
        );

        this.data = contract.methods.transfer(this.address, amount).encodeABI();
      } else {
        this.data = '0x';
      }
    },
    setSelectedCurrency(e) {
      this.selectedCurrency = e;
    },
    estimateGas() {
      const newRaw = this.raw;
      delete newRaw['gas'];
      delete newRaw['nonce'];
      this.createDataHex();
      this.$store.state.web3.eth
        .estimateGas(newRaw)
        .then(res => {
          this.transactionFee = unit.fromWei(
            unit.toWei(this.$store.state.gasPrice, 'gwei') * res,
            'ether'
          );
          this.gasLimit = res;
        })
        .catch(err => {
          // eslint-disable-next-line no-console
          console.error(err);
        });
    },
    verifyAddr() {
      if (this.address.length !== 0 && this.address !== '') {
        const valid = this.$store.state.web3.utils.isAddress(this.address);
        if (!valid) {
          return true;
        }
        return false;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'SendCurrencyContainer.scss';
</style>
