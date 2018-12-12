<template>
  <div class="send-currency-container">
    <interface-container-title :title="$t('common.sendTx')" />

    <div class="send-form">
      <div class="form-block amount-to-address">
        <div class="amount">
          <div class="single-input-block">
            <div class="title">
              <h4>{{ $t('interface.sendTxType') }}</h4>
            </div>
            <currency-picker
              :currency="tokensWithBalance"
              :page="'sendEthAndTokens'"
              :token="true"
              @selectedCurrency="setSelectedCurrency"
            />
          </div>
          <div class="single-input-block">
            <div class="title">
              <h4>{{ $t('interface.sendTxAmount') }}</h4>
              <p
                class="title-button prevent-user-select"
                @click="setBalanceToAmt"
              >
                Entire Balance
              </p>
            </div>
            <div class="the-form amount-number">
              <input
                :value="amount"
                type="number"
                placeholder="Amount"
                @input="debouncedAmount"
              />
              <i
                :class="[
                  selectedCurrency.name === 'Ether'
                    ? parsedBalance < amount
                      ? 'not-good'
                      : ''
                    : selectedCurrency.balance < amount
                    ? 'not-good'
                    : '',
                  'fa fa-check-circle good-button'
                ]"
                aria-hidden="true"
              />
            </div>
          </div>
          <div
            v-if="
              selectedCurrency.name === 'Ether'
                ? amount > parsedBalance
                : selectedCurrency.balance < amount
            "
            class="error-message-container"
          >
            <p>{{ $t('common.dontHaveEnough') }}</p>
          </div>
        </div>
        <div class="to-address">
          <div class="title">
            <h4>
              {{ $t('interface.sendTxToAddr') }}
              <blockie
                v-show="validAddress && address.length !== 0"
                :address="
                  resolvedAddress !== ''
                    ? resolvedAddress.toLowerCase()
                    : address
                "
                :size="8"
                :scale="16"
                width="32px"
                height="32px"
                class="blockie-image"
              />
            </h4>

            <p
              class="copy-button prevent-user-select"
              @click="copyToClipboard('address')"
            >
              {{ $t('common.copy') }}
            </p>
          </div>
          <div class="the-form address-block">
            <input
              v-ens-resolver="address"
              ref="address"
              type="text"
              name="name"
              autocomplete="off"
              @input="debounceInput"
            />
            <i
              :class="[
                validAddress && address.length !== 0 ? '' : 'not-good',
                'fa fa-check-circle good-button'
              ]"
              aria-hidden="true"
            />
          </div>
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
                  @click="advancedExpend = !advancedExpend"
                />
                <span class="slider round" />
              </label>
            </div>
          </div>
        </div>
        <div
          :class="advancedExpend && 'input-container-open'"
          class="input-container"
        >
          <div class="margin-container">
            <div class="the-form user-input">
              <input
                v-model="data"
                type="text"
                name=""
                placeholder="Add Data (e.g. 0x7834f874g298hf298h234f)"
                autocomplete="off"
              />
            </div>
            <div class="the-form user-input">
              <input
                v-model="gasLimit"
                :placeholder="$t('common.gasLimit')"
                type="number"
                name=""
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="submit-button-container">
      <div
        :class="[
          validAddress && address.length !== 0 ? '' : 'disabled',
          'submit-button large-round-button-green-filled'
        ]"
        @click="confirmationModalOpen"
      >
        {{ $t('interface.sendTx') }}
      </div>
      <interface-bottom-text
        :link-text="$t('interface.learnMore')"
        :question="$t('interface.haveIssues')"
        link="mailto:support@myetherwallet.com"
      />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import InterfaceContainerTitle from '../../components/InterfaceContainerTitle';
import CurrencyPicker from '../../components/CurrencyPicker';
import InterfaceBottomText from '@/components/InterfaceBottomText';
import Blockie from '@/components/Blockie';
import normalise from '@/helpers/normalise';
import BigNumber from 'bignumber.js';
import * as unit from 'ethjs-unit';
import utils from 'web3-utils';

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
    },
    highestGas: {
      type: Number,
      default: 0
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
      gasAmount: 0,
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
      account: 'account',
      gasPrice: 'gasPrice',
      web3: 'web3',
      wallet: 'wallet',
      network: 'network',
      ens: 'ens'
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
      if (this.verifyAddr()) {
        this.estimateGas();
      }
      this.$store.dispatch('setGasPrice', Number(newVal));
    },
    selectedCurrency(newVal) {
      this.selectedCurrency = newVal;
      this.estimateGas();
    }
  },
  mounted() {
    if (this.account.balance) {
      this.parsedBalance = this.account.balance;
    }
    this.gasAmount = this.gasPrice;
  },
  methods: {
    debouncedAmount: utils._.debounce(function(e) {
      this.amount = new BigNumber(e.target.value).decimalPlaces(18).toFixed();
      e.target.value = this.amount;
      if (this.verifyAddr()) {
        this.estimateGas();
      }
    }, 300),
    debounceInput: utils._.debounce(function(e) {
      this.address = normalise(e.target.value);
    }, 1500),
    copyToClipboard(ref) {
      this.$refs[ref].select();
      document.execCommand('copy');
    },
    async createTx() {
      const isEth = this.selectedCurrency.name === 'Ethereum';
      this.nonce = await this.web3.eth.getTransactionCount(
        this.wallet.getAddressString()
      );

      this.raw = {
        from: this.wallet.getAddressString(),
        gas: this.gasLimit,
        nonce: this.nonce,
        gasPrice: Number(unit.toWei(this.gasPrice, 'gwei')),
        value: isEth
          ? this.amount === ''
            ? 0
            : unit.toWei(this.amount, 'ether')
          : 0,
        to: isEth
          ? this.resolvedAddress !== ''
            ? this.resolvedAddress
            : this.address
          : this.selectedCurrency.addr,
        data: this.data,
        chainId: this.network.type.chainID || 1
      };

      if (this.address === '') {
        delete this.raw['to'];
      }
      this.web3.eth.sendTransaction(this.raw);
    },
    confirmationModalOpen() {
      this.createTx();
      window.scrollTo(0, 0);
    },
    setBalanceToAmt() {
      if (this.selectedCurrency.name === 'Ethereum') {
        this.amount = this.parsedBalance - this.transactionFee;
      } else {
        this.amount = this.selectedCurrency.balance;
      }
    },
    createDataHex() {
      let amount;
      if (this.selectedCurrency.name !== 'Ethereum' && this.address !== '') {
        if (this.amount !== 0) {
          amount = this.amount;
        } else {
          amount = 0;
        }
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
        const contract = new this.web3.eth.Contract(
          jsonInterface,
          this.selectedCurrency.addr
        );
        this.data = contract.methods
          .transfer(
            this.address,
            new BigNumber(amount)
              .times(new BigNumber(10).pow(this.selectedCurrency.decimals))
              .toFixed()
          )
          .encodeABI();
      } else {
        this.data = '0x';
      }
    },
    setSelectedCurrency(e) {
      this.selectedCurrency = e;
    },
    estimateGas() {
      const isEth = this.selectedCurrency.name === 'Ethereum';
      const bnAmount = new BigNumber(this.amount);
      this.web3.eth
        .estimateGas({
          from: this.wallet.getAddressString(),
          value: isEth
            ? this.amount === ''
              ? 0
              : unit.toWei(bnAmount, 'ether')
            : 0,
          to: isEth ? this.address : this.selectedCurrency.addr,
          data: this.data
        })
        .then(res => {
          this.transactionFee = unit.fromWei(
            unit.toWei(this.gasPrice, 'gwei') * res,
            'ether'
          );
          this.gasLimit = res;
        })
        .catch(err => {
          // eslint-disable-next-line no-console
          console.error(err);
        });
    },
    changeGas(val) {
      this.gasAmount = val;
      this.createDataHex();
      this.$store.dispatch('setGasPrice', Number(val));
    },
    verifyAddr() {
      if (this.address.length !== 0 && this.address !== '') {
        const valid = this.web3.utils.isAddress(this.address);
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
//@import 'SendCurrencyContainer-desktop.scss';
//@import 'SendCurrencyContainer-tablet.scss';
//@import 'SendCurrencyContainer-mobile.scss';
</style>
