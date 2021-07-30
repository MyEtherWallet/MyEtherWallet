<template>
  <mew-module
    class="d-flex flex-grow-1 pt-6 modules--contract--module-contract-interact"
    title="Interact with contract"
    :has-elevation="true"
    :has-indicator="true"
  >
    <template #moduleBody>
      <div>
        <mew-select
          :items="mergedContracts"
          label="Contract Type"
          @input="selectedContract"
        />
        <mew-input
          v-model="contractAddress"
          label="Contract Address"
          placeholder=" "
          class="mr-3 flex-grow-1"
        />
        <!--  mew text area doesn't handle array as prop -->

        <v-textarea
          v-model="abi"
          no-resize
          outlined
          name="input-7-4"
          label="ABI/JSON Interface"
        ></v-textarea>

        <div class="text-center mt-3">
          <mew-button
            title="Interact"
            :disabled="!canInteract"
            :has-full-width="false"
            btn-size="xlarge"
            @click.native="showInteract()"
          />
        </div>
        <div class="text-center mt-4">
          <mew-button
            title="Clear all"
            :has-full-width="false"
            btn-size="small"
            btn-style="transparent"
            @click.native="resetDefaults()"
          />
        </div>
      </div>

      <interact-with-contract
        :open="interact"
        :close="closeInteract"
        :methods="methods"
        :method-select="methodSelect"
        :read-write="readWrite"
        :payable-input="payableInput"
        :can-proceed="canProceed"
        :value-input="valueInput"
        :back-interact="backInteract"
      />
    </template>
  </mew-module>
</template>

<script>
import InteractWithContract from '@/modules/contract/components/InteractWithContract';
import Vue from 'vue';
import { mapState, mapGetters } from 'vuex';
import { toBN, toWei } from 'web3-utils';
import { isAddress } from '@/core/helpers/addressUtils';
import { stringToArray } from '@/core/helpers/common';
import {
  parseJSON,
  parseABI,
  getType as getInputType,
  isContractArgValid
} from './handlers/common';

export default {
  name: 'ModuleContractInteract',
  components: { InteractWithContract },
  data() {
    return {
      currentContract: null,
      interact: false,
      inputsValid: false,
      hasEnough: false,
      abi: [],
      contractAddress: '',
      selectedMethod: {
        inputs: [],
        outputs: []
      },
      outputValues: [],
      ethPayable: '0'
    };
  },
  computed: {
    ...mapState('wallet', ['address', 'web3', 'balance']),
    ...mapGetters('global', ['network', 'gasPrice', 'localContracts']),
    canProceed() {
      if (this.isPayableFunction) {
        if (!this.canPay) {
          return true;
        }
        return (
          !this.inputsValid &&
          !!this.selectedMethod.inputs.length &&
          this.canPay
        );
      }
      return !this.inputsValid && !!this.selectedMethod.inputs.length;
    },
    isViewFunction() {
      return (
        this.selectedMethod.constant ||
        this.selectedMethod.stateMutability === 'view'
      );
    },
    isPayableFunction() {
      return this.selectedMethod.stateMutability === 'payable';
    },
    canPay() {
      if (this.isPayableFunction) {
        return this.hasEnough();
      }
      return true;
    },
    mergedContracts() {
      return [
        { text: 'Select a Contract', selectLabel: true, divider: true }
      ].concat(this.localContracts, this.network.type.contracts);
    },
    methods() {
      if (this.canInteract) {
        return JSON.parse(this.abi).filter(item => {
          if (item.type !== 'constructor' && item.type !== 'event') {
            return item;
          }
        });
      }
      return [];
    },
    canInteract() {
      return isAddress(this.contractAddress) && parseABI(parseJSON(this.abi));
    }
  },
  methods: {
    resetDefaults() {
      this.currentContract = null;
      this.abi = [];
      this.contractAddress = '';
      this.interact = false;
      this.selectedMethod = {
        inputs: [],
        outputs: []
      };
    },
    readWrite() {
      const params = [];
      for (const _input of this.selectedMethod.inputs) {
        if (_input.type.includes('[]'))
          params.push(stringToArray(_input.value));
        else params.push(_input.value);
      }
      const caller = this.currentContract.methods[
        this.selectedMethod.name
      ].apply(this, params);
      if (this.isViewFunction) {
        caller.call().then(result => {
          if (this.selectedMethod.outputs.length === 1) {
            this.selectedMethod.outputs[0].value = result;
            Vue.set(
              this.selectedMethod.outputs,
              0,
              this.selectedMethod.outputs[0]
            );
          } else if (this.selectedMethod.outputs.length > 1) {
            this.selectedMethod.outputs.forEach((out, idx) => {
              out.value = result[idx];
              Vue.set(this.selectedMethod.outputs, idx, out);
            });
          }
        });
      } else if (this.isPayableFunction) {
        const rawTx = {
          to: this.contractAddress,
          from: this.address,
          value: this.ethPayable,
          data: caller.encodeABI()
        };

        this.web3.eth.estimateGas(rawTx).then(gasLimit => {
          rawTx.gas = gasLimit;
          caller.send(rawTx);
        });
      } else {
        caller.send({ from: this.address });
      }
    },
    payableInput(amount) {
      if (!amount || amount === '') amount = 0;
      this.ethPayable = toWei(amount, 'ether');
      this.hasEnough = toBN(this.ethPayable).lte(this.balance);
    },
    valueInput(idx, value) {
      this.selectedMethod.inputs[idx].value = value;
      this.inputsValid = true;
      for (const _input of this.selectedMethod.inputs) {
        if (
          !this.isValidInput(
            _input.value,
            this.getType(_input.type).solidityType
          )
        )
          this.inputsValid = false;
      }
    },
    selectedContract(selected) {
      if (parseABI(parseJSON(selected.abi))) {
        if (typeof selected.abi !== 'string')
          this.abi = JSON.stringify(selected.abi);
        else this.abi = selected.abi;
      }
      if (isAddress(selected.address)) {
        this.contractAddress = selected.address;
      }
    },
    closeInteract() {
      this.interact = false;
      this.resetDefaults();
    },
    backInteract() {
      this.interact = false;
      this.resetDefaults();
    },
    showInteract() {
      this.interact = true;
      this.currentContract = new this.web3.eth.Contract(
        JSON.parse(this.abi),
        this.contractAddress
      );
    },
    methodSelect(evt) {
      if (evt && evt.inputs && evt.outputs) {
        this.selectedMethod = evt;
        this.selectedMethod.inputs.forEach(v => (v.value = ''));
        this.selectedMethod.outputs.forEach(v => (v.value = ''));
        this.outputValues = [];
      }
    },

    isValidInput(value, sType) {
      return isContractArgValid(value, sType);
    },
    getType(type) {
      return getInputType(type);
    }
  }
};
</script>
