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
        <mew-text-area v-model="abi" label="ABI/JSON Interface" />
        <!--        <v-textarea
          v-model="abi"
          no-resize
          outlined
          name="input-7-4"
          label="ABI/JSON Interface"
        ></v-textarea>-->

        <div class="text-center mt-3">
          <mew-button
            title="Interact"
            :disabled="!canInteract"
            :has-full-width="false"
            button-size="xlarge"
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

      <mew-overlay
        :show-overlay="interact"
        left-btn-text="back"
        right-btn-text="close"
        :close="closeInteract"
        :back="backInteract"
      >
        <template #mewOverlayBody>
          <mew-select :label="'Method'" :items="methods" @input="methodSelect">
          </mew-select>
          <div v-show="selectedMethod.inputs.length" class="mb-10">Inputs</div>
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
                  return isValidInput(value, getType(input.type).solidityType);
                }
              ]"
              @input="valueInput(idx, $event)"
            />
            <div
              v-if="getType(input.type).type === 'radio'"
              class="bool-input-container"
            >
              <div class="bool-items">
                <mew-switch
                  :value="input.value"
                  :label="input.name"
                  @input="valueInput(input.name, $event)"
                />
              </div>
            </div>
          </div>
          <div class="text-center mt-3">
            <mew-button
              :title="isViewFunction ? 'Read' : 'Write'"
              :has-full-width="false"
              button-size="xlarge"
              :disabled="!inputsValid && !!selectedMethod.inputs.length"
              @click.native="readWrite"
            />
          </div>
          <div class="pa-4"></div>
          <div v-show="selectedMethod.outputs.length" class="mb-10">
            Outputs
          </div>
          <div
            v-for="(output, idx) in selectedMethod.outputs"
            v-show="selectedMethod.outputs.length"
            :key="output.name + idx"
            class="input-item-container"
          >
            <mew-input
              v-if="getType(output.type).type !== 'radio'"
              :value="output.value"
              :disabled="true"
              :label="`${output.name} (${output.type})`"
              class="non-bool-input"
            />
            <mew-input
              v-if="getType(output.type).type === 'radio'"
              :value="outputValues[idx]"
              :disabled="true"
              :label="`${output.name} (${output.type})`"
              class="non-bool-input"
            />
          </div>
        </template>
      </mew-overlay>
    </template>
  </mew-module>
</template>

<script>
import Vue from 'vue';
import { mapState } from 'vuex';
import { isAddress } from '@/core/helpers/addressUtils';
import { stringToArray } from '@/core/helpers/common';
import {
  parseJSON,
  parseABI,
  getType as getInputType,
  isContractArgValid
} from './handlers/common';
import * as mewAll from '@myetherwallet/mew-components';

export default {
  name: 'ModuleContractInteract',
  components: {
    'mew-text-area': mewAll.default.MewTextarea
  },
  data() {
    return {
      currentContract: null,
      interact: false,
      inputsValid: false,
      activeContract: {},
      hasInputs: false,
      abi: [],
      contractAddress: '',
      contractType: [],
      selectedMethod: {
        inputs: [],
        outputs: []
      },
      outputValues: []
    };
  },
  computed: {
    ...mapState('wallet', ['address', 'web3', 'network']),
    ...mapState('global', ['currentNetwork', 'gasPrice']),
    isViewFunction() {
      return (
        this.selectedMethod.constant ||
        this.selectedMethod.stateMutability === 'view'
      );
    },
    isNoInputViewFunction() {
      return this.isViewFunction && this.selectedMethod.inputs.length === 0;
    },
    mergedContracts() {
      return [{ name: 'select a contract', abi: '', address: '' }].concat(
        this.currentNetwork.type.contracts
      );
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
      } else {
        caller.send({ from: this.address });
      }
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
        this.abi = JSON.stringify(selected.abi);
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
      if (evt.inputs && evt.outputs) {
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
