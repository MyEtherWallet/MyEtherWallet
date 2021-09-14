<template>
  <mew-module
    class="d-flex flex-grow-1 pt-6"
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
            @click.native="showInteract"
          />
        </div>
        <div class="text-center mt-4">
          <mew-button
            title="Clear all"
            :has-full-width="false"
            btn-size="small"
            btn-style="transparent"
            @click.native="resetDefaults"
          />
        </div>
      </div>

      <!--
      ============================================================================
      Overlay
      ============================================================================
      -->
      <mew-overlay
        title="Interact with contract"
        :show-overlay="interact"
        right-btn-text="close"
        :close="closeInteract"
      >
        <template #mewOverlayBody>
          <mew6-white-sheet
            style="max-width: 480px; width: 100%"
            class="px-9 py-12"
          >
            <mew-select
              label="Function"
              :items="methods"
              class="mb-1"
              @input="methodSelect"
            />

            <div
              v-show="selectedMethod.inputs.length"
              class="mew-heading-2 mb-3"
            >
              Inputs
            </div>
            <div
              v-for="(input, idx) in selectedMethod.inputs"
              :key="input.name + idx"
              class="input-item-container"
            >
              <mew-input
                v-if="getType(input.type).type !== 'radio'"
                :label="`${input.name} (${input.type})`"
                :rules="[
                  value => {
                    return isValidInput(
                      value,
                      getType(input.type).solidityType
                    );
                  }
                ]"
                @input="valueInput(idx, $event)"
              />
              <div
                v-if="getType(input.type).type === 'radio'"
                class="bool-input-container"
              >
                <div class="bool-items">
                  <mew-checkbox
                    v-model="input.value"
                    :label="input.name"
                    type="radio"
                    checked
                    @input="valueInput(idx, $event)"
                  />
                </div>
              </div>
            </div>
            <div>
              <mew-input
                v-if="isPayableFunction"
                label="ETH amount:"
                :rules="[
                  value => {
                    return hasEnough ? '' : 'Not enough ETH';
                  }
                ]"
                type="number"
                @input="payableInput($event)"
              />
            </div>
            <div class="text-center mt-2">
              <mew-button
                :title="isViewFunction ? 'Call' : 'Write'"
                :has-full-width="false"
                btn-size="xlarge"
                :disabled="canProceed"
                @click.native="readWrite"
              />
            </div>

            <v-divider v-if="hasOutputs" class="mt-9 mb-8" />

            <div v-if="hasOutputs">
              <div class="mew-heading-2">Results</div>
              <div
                v-for="(output, idx) in selectedMethod.outputs"
                :key="output.name + idx"
                class="d-flex align-center justify-space-between my-4"
              >
                <div class="text-capitalize">
                  {{ output.name !== '' ? output.name : selectedMethod.name }}
                </div>
                <div class="font-weight-medium">{{ output.value }}</div>
              </div>
            </div>
          </mew6-white-sheet>
        </template>
      </mew-overlay>
    </template>
  </mew-module>
</template>

<script>
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
        return this.hasEnough;
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
          if (
            item.type !== 'constructor' &&
            item.type !== 'event' &&
            item.type !== 'Fallback'
          ) {
            return item;
          }
        });
      }
      return [];
    },
    canInteract() {
      return isAddress(this.contractAddress) && parseABI(parseJSON(this.abi));
    },
    hasOutputs() {
      const outputsWithValues = this.selectedMethod.outputs.filter(item => {
        if (item.value !== '') {
          return item;
        }
      });

      return outputsWithValues.length > 0;
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
      if (!amount || amount === '') amount = '0';
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
