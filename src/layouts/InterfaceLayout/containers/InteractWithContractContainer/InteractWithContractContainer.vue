<template>
  <div class="interact-with-contract-container">
    <interface-container-title :title="$t('common.interactWcontract')" />
    <div v-if="!interact" class="interact-div">
      <div class="send-form contract-address-container">
        <div class="title-container">
          <div class="title">
            <h4 class="contract-address-title">
              {{ $t('interface.contractAddr') }}
            </h4>
            <div class="select-contract no-border">
              <currency-picker
                :currency="network.type.contracts"
                :token="false"
                page="interactWContract"
                @selectedCurrency="selectedContract"
              />
            </div>
          </div>
        </div>
        <div class="the-form domain-name">
          <input
            v-ens-resolver="'address'"
            v-validate="'required'"
            v-model="address"
            type="text"
            name="nameAddr"
            placeholder="Enter Domain Name or Address"
          />

          <i
            :class="[
              isValidAddress && address !== '' ? '' : 'not-good',
              'fa fa-check-circle good-button'
            ]"
            aria-hidden="true"
            class="address-validation-check"
          />
        </div>
      </div>

      <div class="send-form">
        <div class="title-container">
          <div class="title">
            <h4>{{ $t('interface.abiJsonInt') }}</h4>
            <div class="copy-buttons">
              <span @click="deleteInput('abi')">{{ $t('common.clear') }}</span>
              <span @click="copyToClipboard('abi')">
                {{ $t('common.copy') }}
              </span>
            </div>
          </div>
        </div>
        <div class="the-form domain-name">
          <textarea
            v-validate="'required'"
            ref="abi"
            v-model="abi"
            class="custom-textarea-1"
            name="abiField"
          />
          <i
            :class="[
              isValidAbi && abi !== '' ? '' : 'not-good',
              'fa fa-check-circle good-button'
            ]"
            aria-hidden="true"
          />
        </div>
      </div>
      <div class="submit-button-container">
        <div
          :class="[
            isValidAbi &&
            isValidAddress &&
            (!errors.has('nameAddr') && !errors.has('abiField'))
              ? ''
              : 'disabled',
            'submit-button large-round-button-green-filled clickable'
          ]"
          @click="switchView('forward')"
        >
          {{ $t('common.continue') }}
          <img src="~@/assets/images/icons/right-arrow.png" />
        </div>
        <interface-bottom-text
          :link-text="$t('interface.helpCenter')"
          :question="$t('interface.haveIssues')"
          link="https://kb.myetherwallet.com"
        />
      </div>
    </div>
    <div v-else class="contract-methods-container">
      <h4>Read/Write Contract</h4>
      <div class="contract-addr-container">
        <div class="contract-addr">
          <p>Contract Address: {{ address }}</p>
        </div>
        <div class="picker-container">
          <currency-picker
            :currency="methods"
            :token="false"
            page="interactWContract"
            @selectedCurrency="selectFunction"
          />
        </div>
      </div>
      <div
        v-if="selectedMethod.name !== undefined"
        class="method-arguments-container"
      >
        <h4>{{ selectedMethod.name | capitalize }}</h4>
        <div v-for="(input, idx) in writeInputs" :key="input.name + idx">
          <div class="title-container">
            <div class="title">
              <h5>{{ input.name | capitalize }} ({{ input.type }}):</h5>
            </div>
          </div>
          <div class="the-form contract-name">
            <input
              v-if="getType(input.type).type !== 'radio'"
              :type="getType(input.type).type"
              v-model="inputs[input.name]"
            />
            <div
              v-if="getType(input.type).type === 'radio'"
              class="bool-input-container"
            >
              <div>
                <input
                  v-model="inputs[input.name]"
                  :value="true"
                  :name="input.name"
                  type="radio"
                />
                <label :for="input.name">True</label>
              </div>
              <div>
                <input
                  v-model="inputs[input.name]"
                  :value="false"
                  :name="input.name"
                  type="radio"
                  checked
                />
                <label :for="input.name">False</label>
              </div>
            </div>
            <i
              :class="[
                isValidInput(
                  inputs[input.name],
                  getType(input.type).solidityType
                )
                  ? ''
                  : 'not-good',
                'fa fa-check-circle good-button'
              ]"
              aria-hidden="true"
            />
          </div>
        </div>
      </div>
    </div>
    <div class="submit-button-container">
      <div class="interact-buttons">
        <div
          class="submit-button large-round-button-green-border clickable"
          @click="switchView('backwards')"
        >
          {{ $t('common.back') }}
        </div>
        <div
          v-if="
            selectedMethod.hasOwnProperty('inputs') &&
              selectedMethod.inputs.length > 0
          "
          :class="[
            inputsFilled ? '' : 'disabled',
            loading ? 'disabled' : '',
            'submit-button large-round-button-green-filled clickable'
          ]"
          @click="write"
        >
          <span v-show="!loading && !selectedMethod.constant">{{
            $t('interface.write')
          }}</span>
          <span v-show="!loading && selectedMethod.constant">{{
            $t('interface.read')
          }}</span>
          <i v-show="loading" class="fa fa-spinner fa-spin fa-lg" />
        </div>
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
import CurrencyPicker from '../../components/CurrencyPicker';
import InterfaceContainerTitle from '../../components/InterfaceContainerTitle';
import InterfaceBottomText from '@/components/InterfaceBottomText';
import { Misc } from '@/helpers';
import { isAddress } from '@/helpers/addressUtils';

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
      methods: [],
      selectedMethod: {},
      result: '',
      loading: false,
      hexAddress: '',
      inputs: {}
    };
  },
  computed: {
    ...mapGetters({
      network: 'network',
      gasPrice: 'gasPrice',
      account: 'account',
      web3: 'web3'
    }),
    isValidAbi() {
      return Misc.isJson(this.abi);
    },
    isValidAddress() {
      return isAddress(this.address);
    },
    writeInputs() {
      const _self = this;
      const _inputs = this.selectedMethod.inputs;
      _inputs.forEach(input => {
        // eslint-disable-next-line
        _self.input[input.name] = input.type === 'bool' ? false : '';
      });

      return _inputs;
    },
    allValid() {
      let _allvalid = true;
      if (this.abiConstructor) {
        this.abiConstructor.inputs.forEach(item => {
          if (
            !this.isValidInput(
              this.inputs[item.name],
              this.getType(item.type).solidityType
            )
          )
            _allvalid = false;
        });
      }
      return _allvalid && this.isValidAbi && this.isValidaddress;
    }
  },
  watch: {
    result(newVal) {
      this.resType = typeof newVal;
    },
    network() {
      this.abi = '';
      this.address = '';
      this.interact = false;
      this.methods = [];
      this.selectedMethod = {};
      this.result = '';
    }
  },
  methods: {
    isValidInput(value, solidityType) {
      if (!value) value = '';
      if (solidityType === 'uint') return value != '' && !isNaN(value);
      if (solidityType === 'address') return isAddress(value);
      if (solidityType === 'string') return true;
      if (solidityType === 'bytes')
        return value.substr(0, 2) == '0x' && Misc.validateHexString(value);
      if (solidityType === 'bool')
        return typeof value == typeof true || value === '';
      return false;
    },
    getType(inputType) {
      if (!inputType) inputType = '';
      if (inputType.includes('uint'))
        return { type: 'number', solidityType: 'uint' };
      if (inputType.includes('address'))
        return { type: 'text', solidityType: 'address' };
      if (inputType.includes('string'))
        return { type: 'text', solidityType: 'string' };
      if (inputType.includes('bytes'))
        return { type: 'text', solidityType: 'bytes' };
      if (inputType.includes('bool'))
        return { type: 'radio', solidityType: 'bool' };
      return { type: 'text', solidityType: 'string' };
    },
    selectedContract(selected) {
      if (selected.abi === '') {
        this.abi = '';
      } else {
        this.abi = JSON.stringify(selected.abi);
      }
      this.address = selected.address;
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
      const contract = new this.web3.eth.Contract([method], this.address);
      if (method.constant === true && method.inputs.length === 0) {
        contract.methods[method.name]()
          .call({ from: this.account.address })
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
      const web3 = this.web3;
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
          .call({ from: this.account.address })
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
        const nonce = await web3.eth.getTransactionCount(this.account.address);
        const gasLimit = await contract.methods[this.selectedMethod.name](
          ...params
        )
          .estimateGas({ from: this.account.address })
          .then(res => {
            return res;
          })
          .catch(err => {
            // eslint-disable-next-line
            console.error(err);
          });
        const data = contract.methods[this.selectedMethod.name](
          ...params
        ).encodeABI();

        const raw = {
          from: this.account.address,
          gas: gasLimit,
          nonce: nonce,
          gasPrice: Number(unit.toWei(this.gasPrice, 'gwei')),
          value: 0,
          to: this.hexAddress,
          data: data
        };

        await web3.eth.sendTransaction(raw);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'InteractWithContractContainer.scss';
</style>
