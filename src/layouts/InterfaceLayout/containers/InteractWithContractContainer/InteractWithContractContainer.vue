<template>
  <div class="interact-with-contract-container">
    <interface-container-title :title="$t('common.interactWcontract')"/>
    <div
      v-if="!interact"
      class="interact-div">
      <div class="send-form">
        <div class="title-container">
          <div class="title">
            <h4>{{ $t('interface.contractAddr') }}</h4>
            <div class="select-contract no-border">
              <currency-picker
                :currency="network.type.contracts"
                :token="false"
                page="interactWContract"
                @selectedCurrency="selectedCurrency"/>
            </div>
          </div>
        </div>
        <div class="the-form domain-name">
          <input
            v-ens-resolver="address"
            v-model="address"
            type="text"
            placeholder="Enter Domain Name or Address" >

          <i
            :class="[validAddress && address !== ''? '': 'not-good' ,'fa fa-check-circle good-button']"
            aria-hidden="true"
            class="address-validation-check"/>
        </div>
      </div>

      <div class="send-form">
        <div class="title-container">
          <div class="title">
            <h4>{{ $t('interface.abiJsonInt') }}</h4>
            <div class="copy-buttons">
              <span @click="deleteInput('abi')">{{ $t('common.clear') }}</span>
              <span @click="copyToClipboard('abi')">{{ $t('common.copy') }}</span>
            </div>
          </div>
        </div>
        <div class="the-form domain-name">
          <textarea
            ref="abi"
            v-model="abi"
            class="custom-textarea-1"
            name=""/>
          <i
            :class="[validAbi && abi !== ''? '': 'not-good' ,'fa fa-check-circle good-button']"
            aria-hidden="true"/>
        </div>
      </div>
      <div class="submit-button-container">
        <div
          :class="[(validAbi && validAddress) && (address !== '' && abi !== '')? '': 'disabled' ,'submit-button large-round-button-green-filled clickable']"
          @click="switchView('forward')">
          {{ $t('common.continue') }}
          <img src="~@/assets/images/icons/right-arrow.png">
        </div>
        <interface-bottom-text
          :link-text="$t('interface.learnMore')"
          :question="$t('interface.haveIssues')"
          link="/"/>
      </div>
    </div>
    <div
      v-else
      class="interact-div">
      <div class="send-form">
        <div class="title-container">
          <div class="title">
            <h4>Read / Write Contract</h4>
          </div>
        </div>
        <div class="address-container">
          <div class="address"> Contract Address: {{ address }}</div>
          <div class="functions">
            <currency-picker
              :currency="methods"
              :token="false"
              page="interactWContract"
              @selectedCurrency="selectFunction"/>
          </div>
        </div>
      </div>
      <div
        v-show="selectedMethod.name !== undefined"
        class="send-form">
        <div class="title-container">
          <div class="title">
            <h4>{{ selectedMethod.name }}</h4>
          </div>
        </div>
        <div>
          <div
            v-if="selectedMethod.constant === true && selectedMethod.inputs.length === 0"
            class="the-form domain-name">
            <input
              v-model="result"
              type="text"
              name=""
              placeholder="0x00000000000000"
              disabled >
          </div>
          <div
            v-for="(input, idx) in selectedMethod.inputs"
            v-else
            v-show="selectedMethod.inputs.length !== 0"
            :key="input.name + idx"
            class="the-form domain-name">
            <div
              v-if="input.type === 'bool'"
              class="bool-input">
              <div class="title-container">
                <div class="title">
                  <p>{{ input.name | capitalize }}</p>
                </div>
              </div>
              <div class="bool-input-container">
                <div>
                  <input
                    v-model="writeInputs[input.name]"
                    :value="true"
                    :name="input.name"
                    :checked="writeInputs[input.name] === true? true: false"
                    type="radio">
                  <label :for="input.name">true</label>
                </div>
                <div>
                  <input
                    v-model="writeInputs[input.name]"
                    :value="false"
                    :name="input.name"
                    :checked="writeInputs[input.name] === false? true: false"
                    type="radio">
                  <label :for="input.name">false</label>
                </div>
              </div>
            </div>
            <input
              v-else
              :type="checkType(input.type)"
              v-model="writeInputs[input.name]"
              :placeholder="input.name"
              name=""
              class="contract-inputs">
          </div>
          <div
            v-show="selectedMethod.constant === false"
            class="the-form domain-name result-container">
            <div class="title-container">
              <div class="title">
                <h4>Value: </h4>
              </div>
            </div>
            <input
              v-model="value"
              type="text"
              name=""
              placeholder="ETH" >
          </div>
          <div
            v-if="result !== '' && selectedMethod.inputs.length > 0"
            class="the-form domain-name result-container">
            <div class="title-container">
              <div class="title">
                <h4>Result: </h4>
              </div>
            </div>
            <div class="result-inputs">
              <input
                v-if="resType === 'string'"
                v-model="result"
                type="text"
                name=""
                placeholder="0x00000000000000"
                disabled >
              <div v-if="resType === 'object'"> <!-- Have to separate them since v-for still loops when v-if is in the same line getting max stack -->
                <div
                  v-for="(res, idx) in Object.keys(result)"
                  :key="selectedMethod.outputs[idx].name !== ''? selectedMethod.outputs[idx].name + idx : selectedMethod.outputs[idx].type + idx">
                  <label :name="selectedMethod.outputs[idx].name !== ''? selectedMethod.outputs[idx].name: selectedMethod.outputs[idx].type + idx"> {{ selectedMethod.outputs[idx].name !== ''? selectedMethod.outputs[idx].name: selectedMethod.outputs[idx].type }}</label>
                  <input
                    :name="selectedMethod.outputs[idx].name !== ''? selectedMethod.outputs[idx].name: selectedMethod.outputs[idx].type + idx"
                    :value="result[res]"
                    type="text"
                    placeholder="0x00000000000000"
                    disabled>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="submit-button-container">
        <div class="buttons interact-buttons">
          <div
            class="submit-button large-round-button-green-border clickable"
            @click="switchView('backwards')">
            {{ $t('common.back') }}
          </div>
          <div
            v-if="selectedMethod.constant === true && selectedMethod.inputs.length > 0"
            :class="[inputsFilled? '': 'disabled', loading ? 'disabled': '','submit-button large-round-button-green-filled clickable']"
            @click="write">
            <span v-show="!loading">
              Read
            </span>
            <i
              v-show="loading"
              class="fa fa-spinner fa-spin fa-lg"/>
          </div>
          <div
            v-if="selectedMethod.constant === false"
            :class="[inputsFilled? '': 'disabled', loading ? 'disabled': '','submit-button large-round-button-green-filled clickable']"
            @click="write">
            <span v-show="!loading">
              Write
            </span>
            <i
              v-show="loading"
              class="fa fa-spinner fa-spin fa-lg"/>
          </div>
        </div>
        <interface-bottom-text
          :link-text="$t('interface.learnMore')"
          :question="$t('interface.haveIssues')"
          link="/"/>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import CurrencyPicker from '../../components/CurrencyPicker';
import InterfaceContainerTitle from '../../components/InterfaceContainerTitle';
import InterfaceBottomText from '@/components/InterfaceBottomText';
import { Misc } from '@/helpers';

import * as unit from 'ethjs-unit';

export default {
  components: {
    'interface-container-title': InterfaceContainerTitle,
    'interface-bottom-text': InterfaceBottomText,
    'currency-picker': CurrencyPicker
  },
  data() {
    return {
      abi: '',
      address: '',
      interact: false,
      validAbi: false,
      validAddress: false,
      methods: [],
      selectedMethod: {},
      result: '',
      writeInputs: {},
      inputsFilled: false,
      loading: false,
      resType: 'string',
      gasLimit: 21000,
      value: 0,
      data: '',
      raw: {},
      nonce: 0,
      transactionFee: 0,
      resolvedAddress: ''
    };
  },
  computed: {
    ...mapGetters({
      network: 'network'
    })
  },
  watch: {
    abi(newVal) {
      this.validAbi = Misc.isJson(newVal);
    },
    selectedMethod(newVal) {
      this.writeInputs = {};
      for (const inputs in newVal) {
        if (newVal.hasOwnProperty(inputs)) {
          newVal.inputs.forEach(input => {
            this.$set(this.writeInputs, input.name, '');
          });
        }
      }
    },
    writeInputs: {
      // Watches nested values instead
      handler: function() {
        this.checkInputsFilled();
      },
      deep: true
    },
    result(newVal) {
      this.resType = typeof newVal;
    },
    network() {
      this.abi = '';
      this.address = '';
      this.interact = false;
      this.validAbi = false;
      this.validAddress = false;
      this.methods = [];
      this.selectedMethod = {};
      this.result = '';
      this.writeInputs = {};
      this.inputsFilled = false;
    }
  },
  methods: {
    selectedCurrency(currency) {
      if (currency.abi === '') {
        this.abi = '';
      } else {
        this.abi = JSON.stringify(currency.abi);
      }
      this.address = currency.address;
    },
    checkType(type) {
      if (
        type === 'address' ||
        type === 'string' ||
        type === 'byte' ||
        type.includes('bytes')
      ) {
        return 'string';
      }
      return 'number';
    },
    selectFunction(method) {
      const contract = new this.$store.state.web3.eth.Contract(
        [method],
        this.address
      );
      if (method.constant === true && method.inputs.length === 0) {
        contract.methods[method.name]()
          .call({ from: this.$store.state.wallet.getAddressString() })
          .then(res => {
            this.result = res;
          })
          .catch(err => {
            // eslint-disable-next-line
            console.error(err); // todo replace with proper error
          });
      } else {
        this.result = '';
      }
      this.selectedMethod = method;
    },
    copyToClipboard(ref) {
      this.$refs[ref].select();
      document.execCommand('copy');
    },
    deleteInput(ref) {
      this.$refs[ref].value = '';
    },
    switchView(direction) {
      switch (direction) {
        case 'forward':
          this.methods = JSON.parse(this.abi)
            .map(func => func)
            .filter(func => func.type !== 'constructor')
            .filter(func => func.constant !== undefined);
          this.interact = true;
          break;
        default:
          this.interact = false;
      }
    },
    async write() {
      const web3 = this.$store.state.web3;
      const contract = new web3.eth.Contract(
        [this.selectedMethod],
        this.address
      );
      const params = Object.keys(this.writeInputs).map(input =>
        web3.utils.toHex(this.writeInputs[input])
      );
      this.loading = true;
      if (this.selectedMethod.constant === true) {
        contract.methods[this.selectedMethod.name](...params)
          .call({ from: this.$store.state.wallet.getAddressString() })
          .then(res => {
            this.result = res;
            this.loading = false;
          })
          .catch(err => {
            // eslint-disable-next-line
            console.error(err); // todo replace with proper error
            this.loading = false;
          });
      } else {
        this.nonce = await web3.eth.getTransactionCount(
          this.$store.state.wallet.getAddressString()
        );
        this.gasLimit = await contract.methods[this.selectedMethod.name](
          ...params
        )
          .estimateGas({ from: this.$store.state.wallet.getAddressString() })
          .then(res => {
            this.transactionFee = unit.fromWei(
              unit.toWei(this.$store.state.gasPrice, 'gwei') * res,
              'ether'
            );
            return res;
          })
          .catch(err => {
            // eslint-disable-next-line
            console.error(err);
          });
        this.data = contract.methods[this.selectedMethod.name](
          ...params
        ).encodeABI();

        this.raw = {
          from: this.$store.state.wallet.getAddressString(),
          gas: this.gasLimit,
          nonce: this.nonce,
          gasPrice: Number(unit.toWei(this.$store.state.gasPrice, 'gwei')),
          value: this.value,
          to:
            this.resolvedAddress !== ''
              ? this.resolvedAddress
              : this.address !== ''
                ? this.address
                : '',
          data: this.data
        };

        await web3.eth.sendTransaction(this.raw);
      }
    },
    checkInputsFilled() {
      const inputs = Object.keys(this.writeInputs);
      for (let i = 0; i < inputs.length; i++) {
        if (this.writeInputs[inputs[i]] === '') {
          this.inputsFilled = false;
          return;
        }
        this.inputsFilled = true;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'InteractWithContractContainer.scss';
</style>
