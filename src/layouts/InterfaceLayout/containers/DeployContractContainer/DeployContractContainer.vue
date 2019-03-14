<template>
  <div class="deploy-contract-container">
    <interface-container-title :title="$t('common.depContract')" />
    <div class="content-container">
      <div class="send-form">
        <div class="title-container">
          <div class="title">
            <h4>{{ $t('interface.byteCode') }}</h4>
            <div class="copy-buttons">
              <button class="title-button" @click="deleteInput('bytecode')">
                {{ $t('common.clear') }}
              </button>
              <button class="title-button" @click="copyToClipboard('bytecode')">
                {{ $t('common.copy') }}
              </button>
            </div>
          </div>
        </div>
        <div class="the-form byte-code">
          <textarea
            ref="bytecode"
            v-model="bytecode"
            class="custom-textarea-1"
          />
          <i
            :class="[
              isValidByte ? '' : 'not-good',
              'fa fa-check-circle good-button'
            ]"
            aria-hidden="true"
          />
        </div>
      </div>

      <div class="send-form">
        <div class="title-container">
          <div class="title">
            <h4>{{ $t('interface.abiJsonInt') }}</h4>
            <div class="copy-buttons">
              <button class="title-button" @click="deleteInput('abi')">
                {{ $t('common.clear') }}
              </button>
              <button class="title-button" @click="copyToClipboard('abi')">
                {{ $t('common.copy') }}
              </button>
            </div>
          </div>
        </div>
        <div class="the-form">
          <textarea ref="abi" v-model="abi" class="custom-textarea-1" />
          <i
            :class="[
              isValidAbi && abi !== '' ? '' : 'not-good',
              'fa fa-check-circle good-button'
            ]"
            aria-hidden="true"
          />
        </div>
      </div>

      <div v-if="abiConstructor" class="send-form">
        <div class="title-container">
          <div class="title">
            <h4>
              {{ $t('interface.constructor') }}
              {{ abiConstructor ? 'Inputs' : 'Input' }}:
            </h4>
          </div>
        </div>
        <div
          v-for="(input, idx) in abiConstructor.inputs"
          :key="input.name + idx"
        >
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

      <div
        v-if="abiConstructor !== null && abiConstructor.payable"
        class="send-form"
      >
        <div class="title-container">
          <div class="title">
            <h4>Value in ETH:</h4>
          </div>
        </div>
        <div class="the-form contract-name">
          <input
            ref="value"
            v-model="value"
            step="any"
            placeholder="Value in ETH"
          />
        </div>
      </div>
      <div class="send-form">
        <div class="title-container">
          <div class="title">
            <h4>{{ $t('interface.contractName') }}</h4>
          </div>
        </div>
        <div class="the-form contract-name">
          <input
            ref="contractName"
            v-model="contractName"
            placeholder="Name for the contract"
          />
        </div>
      </div>

      <div class="submit-button-container">
        <div class="buttons">
          <div
            :class="[
              allValid ? '' : 'disabled',
              'submit-button large-round-button-green-filled clickable'
            ]"
            @click="confirmationModalOpen"
          >
            {{ $t('common.signTx') }}
          </div>
        </div>
        <interface-bottom-text
          :link-text="$t('interface.helpCenter')"
          :question="$t('interface.haveIssues')"
          link="https://kb.myetherwallet.com"
        />
      </div>
    </div>
  </div>
</template>

<script>
import InterfaceBottomText from '@/components/InterfaceBottomText';
import InterfaceContainerTitle from '../../components/InterfaceContainerTitle';
import { Misc, Toast } from '@/helpers';
import { isAddress } from '@/helpers/addressUtils';
import ethUnit from 'ethjs-unit';
import EthTx from 'ethereumjs-tx';
import BigNumber from 'bignumber.js';
import store from 'store';
import { generateAddress, bufferToHex } from 'ethereumjs-util';
import { mapGetters } from 'vuex';

export default {
  name: 'DeployContract',
  components: {
    'interface-bottom-text': InterfaceBottomText,
    'interface-container-title': InterfaceContainerTitle
  },
  data() {
    return {
      bytecode: '',
      abi: '',
      inputs: {},
      contractName: '',
      gasLimit: 21000,
      data: '',
      value: 0
    };
  },
  computed: {
    ...mapGetters({
      gasPrice: 'gasPrice',
      web3: 'web3',
      network: 'network'
    }),
    isValidAbi() {
      return Misc.isJson(this.abi);
    },
    abiConstructor() {
      let _constructor = null;
      if (this.isValidAbi) {
        JSON.parse(this.abi).forEach(item => {
          if (item.type === 'constructor') {
            _constructor = item;
          }
        });
      }

      // Sets radio buttons to false due to vue reactivity
      if (_constructor && _constructor.hasOwnProperty('inputs')) {
        _constructor.inputs.forEach(item => {
          if (item.type === 'bool') {
            // eslint-disable-next-line
            this.inputs[item.name] = false;
          }
        });
      }
      return _constructor;
    },
    isValidByte() {
      return (
        this.bytecode &&
        this.bytecode.substr(0, 2) === '0x' &&
        Misc.validateHexString(this.bytecode)
      );
    },
    txByteCode() {
      return Misc.sanitizeHex(this.bytecode);
    },
    deployArgs() {
      const _deployArgs = [];
      if (this.abiConstructor) {
        this.abiConstructor.inputs.forEach(item => {
          _deployArgs.push(this.inputs[item.name]);
        });
      }
      return _deployArgs;
    },
    txData() {
      return new this.web3.eth.Contract(JSON.parse(this.abi))
        .deploy({ data: this.txByteCode, arguments: this.deployArgs })
        .encodeABI();
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
      return _allvalid && this.isValidAbi && this.isValidByte;
    }
  },
  methods: {
    isValidInput(value, solidityType) {
      if (!value) value = '';
      if (solidityType === 'uint')
        return value !== '' && !isNaN(value) && Misc.isInt(value);
      if (solidityType === 'address') return isAddress(value);
      if (solidityType === 'string') return true;
      if (solidityType === 'bytes')
        return value.substr(0, 2) == '0x' && Misc.validateHexString(value);
      if (solidityType === 'bool')
        return typeof value == typeof true || value === '';
      return false;
    },
    getType: Misc.solidityType,
    async sendTransaction() {
      try {
        await this.estimateGas();
        const web3 = this.web3;
        const coinbase = await web3.eth.getCoinbase();
        const nonce = await web3.eth.getTransactionCount(coinbase);
        const _tx = new EthTx({
          nonce: nonce,
          gasPrice: Misc.sanitizeHex(
            ethUnit.toWei(this.gasPrice, 'gwei').toString(16)
          ),
          gasLimit: Misc.sanitizeHex(new BigNumber(this.gasLimit).toString(16)),
          data: this.txData
        });
        const json = _tx.toJSON(true);
        delete json.to;
        json.from = coinbase;
        this.web3.eth.sendTransaction(json).catch(err => {
          Toast.responseHandler(err, Toast.WARN);
        });
        const contractAddr = bufferToHex(generateAddress(coinbase, nonce));
        this.pushContractToStore(contractAddr);
      } catch (e) {
        Toast.responseHandler(e, false);
      }
    },
    pushContractToStore(addr) {
      const localStoredContract = store.get('customContracts') || [];
      const itemIndex = localStoredContract.findIndex(item => {
        return item.name.toLowerCase() === this.contractName.toLowerCase();
      });
      if (itemIndex === -1) {
        const storableObj = {
          abi: JSON.parse(this.abi),
          address: addr,
          comment: '',
          name: this.contractName
        };
        localStoredContract.push(storableObj);
      } else {
        localStoredContract[itemIndex] = {
          abi: JSON.parse(this.abi),
          address: addr,
          comment: '',
          name: this.contractName
        };
      }
      store.set('customContracts', localStoredContract);
    },
    confirmationModalOpen() {
      this.sendTransaction();
      window.scrollTo(0, 0);
    },
    async estimateGas() {
      const coinbase = await this.web3.eth.getCoinbase();
      const params = {
        from: coinbase,
        data: this.txData
      };
      this.gasLimit = await this.web3.eth.estimateGas(params).catch(err => {
        Toast.responseHandler(err, Toast.WARN);
      });
    },
    copyToClipboard(ref) {
      this.$refs[ref].select();
      document.execCommand('copy');
    },
    deleteInput(ref) {
      this[ref] = '';
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'DeployContractContainer.scss';
</style>
