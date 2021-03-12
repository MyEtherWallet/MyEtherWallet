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
              @input="valueInput(input.name, $event)"
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
          <div v-show="hasInputs" class="text-center mt-3">
            <mew-button
              :title="hasOutputs() ? 'Result' : 'Write'"
              :has-full-width="false"
              button-size="xlarge"
              :disabled="!inputsValid"
              @click.native="write"
            />
          </div>
          <div class="pa-4"></div>
          <div v-show="selectedMethod.outputs.length" class="mb-10">
            Outputs
          </div>
          <div
            v-for="(output, idx) in selectedMethod.outputs"
            v-show="noOutput"
            :key="output.name + idx"
            class="input-item-container"
          >
            <mew-input
              v-if="getType(output.type).type !== 'radio'"
              :disabled="true"
              :label="`${output.name} (${output.type})`"
              :value="output.value"
              class="non-bool-input"
            />
            <mew-input
              v-if="getType(output.type).type === 'radio'"
              :disabled="true"
              :label="`${output.name} (${output.type})`"
              :value="output.value"
              class="non-bool-input"
            />
          </div>
        </template>
      </mew-overlay>
    </template>
  </mew-module>
</template>

<script>
import { mapState } from 'vuex';
import { isAddress } from '@/core/helpers/addressUtils';
import {
  parseJSON,
  parseABI,
  getType as getInputType,
  isContractArgValid
} from './handlers/common';

export default {
  name: 'ModuleContractInteract',
  components: {},
  data() {
    return {
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
      }
    };
  },
  computed: {
    ...mapState('wallet', ['address', 'web3', 'network']),
    ...mapState('global', ['currentNetwork', 'gasPrice']),
    mergedContracts() {
      return [{ name: 'select a contract', abi: '', address: '' }].concat(
        this.currentNetwork.type.contracts
      );
    },
    noOutput() {
      return (
        !this.activeContract.hasOutputs || this.activeContract.isMethodConstant
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
      this.abi = '';
      this.contractAddress = '';
      this.interact = false;
      this.contractMethods = [];
      this.selectedMethod = {
        inputs: [],
        outputs: []
      };
      this.result = '';
      this.loading = false;
      this.value = 0;
      this.outputs = [];
      this.clearCurrency = !this.clearCurrency;
    },
    hasOutputs() {
      // return Object.values(this.outputs).every(item => item.value !== null);
    },
    write() {
      // if (this.activeContract.isMethodConstant) {
      //   this.activeContract.write().then(res => {
      //     this.outputs = res.outputs;
      //   });
      // } else {
      //   this.activeContract.write();
      // }
    },
    // eslint-disable-next-line no-unused-vars
    valueInput(name, value) {
      // this.activeContract.setSelectedMethodInputValue(name, value);
      // this.inputsValid = this.activeContract.inputsValid;
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
      if (evt.inputs && evt.outputs) this.selectedMethod = evt;
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
