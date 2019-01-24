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
              :page="'sendEgasAmountthAndTokens'"
              :token="true"
              @selectedCurrency="selectedCurrency = $event"
            />
          </div>
          <div class="single-input-block">
            <div class="title">
              <h4>{{ $t('interface.sendTxAmount') }}</h4>
              <p
                class="title-button prevent-user-select"
                @click="sendEntireBalance"
              >
                Entire Balance
              </p>
            </div>
            <div class="the-form amount-number">
              <input
                v-validate="'min_value:0'"
                v-model="value"
                type="number"
                placeholder="Amount"
                min="0"
                name="value"
              />
              <i
                :class="[
                  !isValidAmount || errors.has('value') ? 'not-good' : '',
                  'fa fa-check-circle good-button'
                ]"
                aria-hidden="true"
              />
            </div>
          </div>
          <div
            v-if="!isValidAmount || errors.has('value')"
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
                v-show="isValidAddress"
                :address="hexAddress"
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
              v-ens-resolver="'address'"
              ref="address"
              v-model="address"
              type="text"
              name="name"
              autocomplete="off"
            />
            <i
              :class="[
                isValidAddress && hexAddress.length !== 0 ? '' : 'not-good',
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
            <div v-show="!isToken" class="the-form user-input">
              <p>Add Data</p>
              <input
                v-model="data"
                type="text"
                placeholder="Add Data (e.g. 0x7834f874g298hf298h234f)"
                autocomplete="off"
              />
              <i
                :class="[
                  data.length !== 0 ? '' : 'not-good',
                  'fa fa-check-circle good-button'
                ]"
                aria-hidden="true"
              />
            </div>
            <div class="the-form user-input">
              <p>{{ $t('common.gasLimit') | capitalize }}</p>
              <input
                v-model="gasLimit"
                :placeholder="$t('common.gasLimit')"
                type="number"
                name
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="submit-button-container">
      <div
        :class="[
          validInputs ? '' : 'disabled',
          'submit-button large-round-button-green-filled'
        ]"
        @click="submitTransaction"
      >
        {{ $t('interface.sendTx') }}
      </div>
      <interface-bottom-text
        :link-text="$t('interface.helpCenter')"
        :question="$t('interface.haveIssues')"
        link="https://kb.myetherwallet.com"
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
import EthTx from 'ethereumjs-tx';
import { Misc } from '@/helpers';
import BigNumber from 'bignumber.js';
import ethUnit from 'ethjs-unit';
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
      isValidAddress: false,
      hexAddress: '',
      address: '',
      value: '0',
      gasLimit: '21000',
      data: '',
      selectedCurrency: ''
    };
  },
  computed: {
    ...mapGetters({
      account: 'account',
      gasPrice: 'gasPrice',
      web3: 'web3',
      network: 'network'
    }),
    isValidAmount() {
      if (this.isToken)
        return new BigNumber(this.value).lte(this.selectedCurrency.balance);
      return new BigNumber(this.value).lte(this.balanceDefault);
    },
    balanceDefault() {
      return new BigNumber(ethUnit.fromWei(this.account.balance, 'ether'));
    },
    validInputs() {
      return (
        this.isValidAmount &&
        this.isValidAddress &&
        new BigNumber(this.gasLimit).gte(0) &&
        Misc.validateHexString(this.data)
      );
    },
    isToken() {
      return this.selectedCurrency.symbol !== this.network.type.name;
    },
    txData() {
      if (this.isToken) {
        return this.getTokenTransferABI(
          this.value,
          this.selectedCurrency.decimals
        );
      }
      return Misc.sanitizeHex(this.data);
    },
    txValue() {
      if (this.isToken) {
        return '0x00';
      }
      return Misc.sanitizeHex(ethUnit.toWei(this.value, 'ether').toString(16));
    },
    txTo() {
      return this.isToken ? this.selectedCurrency.address : this.hexAddress;
    },
    multiWatch() {
      return (
        this.value,
        this.isValidAddress,
        this.data,
        this.selectedCurrency,
        new Date().getTime() / 1000
      );
    }
  },
  watch: {
    multiWatch: utils._.debounce(function() {
      if (this.validInputs) this.estimateGas();
    }, 500)
  },
  methods: {
    sendEntireBalance() {
      if (this.isToken) this.value = this.selectedCurrency.balance;
      else
        this.value = this.balanceDefault.minus(
          ethUnit.fromWei(
            new BigNumber(ethUnit.toWei(this.gasPrice, 'gwei'))
              .times(21000)
              .toString(),
            'ether'
          )
        );
    },
    getTokenTransferABI(amount, decimals) {
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
      const contract = new this.web3.eth.Contract(jsonInterface);
      return contract.methods
        .transfer(
          this.hexAddress,
          new BigNumber(amount).times(new BigNumber(10).pow(decimals)).toFixed()
        )
        .encodeABI();
    },
    async estimateGas() {
      const coinbase = await this.web3.eth.getCoinbase();
      const params = {
        from: coinbase,
        value: this.txValue,
        to: this.txTo,
        data: this.txData
      };
      this.gasLimit = await this.web3.eth.estimateGas(params);
    },
    async submitTransaction() {
      window.scrollTo(0, 0);
      try {
        const coinbase = await this.web3.eth.getCoinbase();
        const nonce = await this.web3.eth.getTransactionCount(coinbase);
        const _tx = new EthTx({
          nonce: Misc.sanitizeHex(new BigNumber(nonce).toString(16)),
          gasPrice: Misc.sanitizeHex(
            ethUnit.toWei(this.gasPrice, 'gwei').toString(16)
          ),
          gasLimit: Misc.sanitizeHex(new BigNumber(this.gasLimit).toString(16)),
          to: this.txTo,
          value: this.txValue,
          data: this.txData,
          chainId: this.network.type.chainID
        });
        const json = _tx.toJSON(true);
        json.from = coinbase;
        this.web3.eth.sendTransaction(json);
      } catch (e) {
        throw e;
      }
    },
    copyToClipboard(ref) {
      this.$refs[ref].select();
      document.execCommand('copy');
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'SendCurrencyContainer.scss';
</style>
