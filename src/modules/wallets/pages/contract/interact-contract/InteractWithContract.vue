<template>
  <div>
    <div class="d-flex">
      <div class="flex-grow-1">
        <mew6-white-sheet>
          <interface-wrap title="Interact with contract">
            <div class="d-flex">
              <mew-input
                :value="contractAddress"
                label="Contract Address"
                placeholder=" "
                class="mr-3 flex-grow-1"
                @input="setContractAddress"
              />
              <mew-select
                :items="mergedContracts"
                label="Contract Type"
                @input="selectedContract"
              />
            </div>
            <v-textarea
              v-model="abi"
              no-resize
              outlined
              name="input-7-4"
              label="ABI/JSON Interface"
              @change="setAbi"
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
                button-size="small"
                btn-style="transparent"
                @click.native="resetDefaults()"
              />
            </div>
          </interface-wrap>
        </mew6-white-sheet>
        <mew-overlay
          :show-overlay="interact"
          :close="closeInteract"
          :back="backInteract"
        >
          <template v-slot:mewOverlayBody>
            <mew-select
              :label="'Method'"
              :items="methods"
              @input="methodSelect"
            >
            </mew-select>
            <div
              v-for="(input, idx) in inputs"
              :key="input.name + idx"
              class="input-item-container"
            >
              <mew-input
                v-if="getType(input.type).type !== 'radio'"
                :disabled="noInput"
                :label="`${input.name} (${input.type})`"
                :rules="[
                  value => {
                    return isValidInput(
                      value,
                      getType(input.type).solidityType
                    );
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
                    :value="false"
                    :label="input.name"
                    @input="valueInput(input.name, $event)"
                  />
                </div>
                <div class="bool-items"></div>
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
            <div
              v-for="(output, idx) in outputs"
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
            </div>
          </template>
        </mew-overlay>
      </div>
      <div class="pa-4"></div>
      <div>
        <network />
        <div class="pa-4"></div>
        <swap />
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { isAddress } from '@/helpers/addressUtils';
import InterfaceWrap from '@/components/interface-wrap/InterfaceWrap';
import store from 'store';
import Network from '@/modules/wallets/components/network/Network';
import Swap from '@/modules/wallets/components/swap/Swap';
import * as unit from 'ethjs-unit';
import Contracts from '../contracts';
import tempDevAbi from '../tests/contractsForDeploy/Type_Demo_ABI';
const padLeftEven = hex => {
  hex = hex.length % 2 !== 0 ? '0' + hex : hex;
  return hex;
};

const sanitizeHex = hex => {
  hex = hex.substring(0, 2) == '0x' ? hex.substring(2) : hex;
  if (hex == '') return '0x';
  return '0x' + padLeftEven(hex);
};

export default {
  components: {
    'interface-wrap': InterfaceWrap,
    network: Network,
    swap: Swap
  },
  data() {
    return {
      interact: false,
      inputsValid: false,
      activeContract: {},
      hasInputs: false,
      outputs: {},
      abi: [],
      contractAddress: '',
      methods: [],
      contractType: []
    };
  },
  computed: {
    ...mapState(['network', 'gasPrice', 'account', 'web3']),
    mergedContracts() {
      const customContracts = store.get('customContracts') || [];
      const mergedContracts = this.network.type.contracts.concat(
        customContracts
      );
      return [
        { name: 'select a contract', abi: '', address: '' },
        {
          name: 'demo',
          abi: tempDevAbi,
          address: '0xAEf115Cd6723A44aD9901DB3134762392814fE17'
        }
      ].concat(mergedContracts);
    },
    isValidAbi() {
      try {
        JSON.parse(this.abi);
        return true;
      } catch (e) {
        return false;
      }
    },
    isValidAddress() {
      return isAddress(this.address);
    },
    noInput() {
      return false;
    },
    noOutput() {
      return (
        !this.activeContract.hasOutputs || this.activeContract.isMethodConstant
      );
    },
    resType() {
      return typeof this.result;
    },
    inputs() {
      return this.activeContract.selectedMethodInputs;
    },
    txValue() {
      return sanitizeHex(unit.toWei(this.value, 'ether').toString(16));
    },
    canInteract() {
      return this.activeContract.contractActive;
    }
  },
  mounted() {
    this.activeContract = new Contracts(this.account.address, undefined, 0);
  },
  methods: {
    resetDefaults() {
      this.abi = '';
      this.contractAddress = '';
      this.interact = false;
      this.contractMethods = [];
      this.selectedMethod = {};
      this.result = '';
      this.loading = false;
      this.value = 0;
      this.outputs = {};
      this.clearCurrency = !this.clearCurrency;
      this.activeContract.reset();
    },
    getOutputs() {
      return this.outputs;
    },
    hasOutputs() {
      return Object.values(this.outputs).every(item => item.value !== null);
    },
    write() {
      if (this.activeContract.isMethodConstant) {
        this.activeContract.write().then(res => {
          this.outputs = res.outputs;
        });
      } else {
        this.activeContract.write();
      }
    },
    valueInput(name, value) {
      this.activeContract.setSelectedMethodInputValue(name, value);
      this.inputsValid = this.activeContract.inputsValid;
    },
    setAbi(evt) {
      this.abi = evt;
      this.activeContract.setAbi(this.abi);
    },
    setContractAddress(evt) {
      this.contractAddress = evt;
      this.activeContract.setContractAddress(this.contractAddress);
    },
    selectedContract(selected) {
      if (selected.abi === '') {
        this.abi = '';
      } else {
        this.abi = JSON.stringify(selected.abi);
        this.activeContract.setAbi(this.abi);
      }
      this.contractAddress = selected.address;
      this.activeContract.setContractAddress(this.contractAddress);
    },
    closeInteract() {
      this.interact = false;
      this.resetDefaults();
    },
    backInteract() {
      this.interact = false;
      this.activeContract.clear();
    },
    showInteract() {
      this.interact = true;
      this.$set(this, 'methods', this.activeContract.contractMethodNames);
    },
    methodSelect(evt) {
      this.activeContract
        .selectedFunction(evt)
        .then(res => {
          this.$set(this, 'outputs', res.outputs);
          this.hasInputs = Object.keys(res.inputs).length > 0;
        })
        .catch(e => {
          // eslint-disable-next-line
          console.error(e);
        });
    },

    isValidInput() {
      return Contracts.isContractArgValid.apply(this, arguments);
    },
    getType() {
      return Contracts.getType.apply(this, arguments);
    },

    formatInput() {
      return Contracts.formatInput.apply(this, arguments);
    },
    copyToClipboard(ref) {
      this.$refs[ref].select();
      document.execCommand('copy');
    },
    deleteInput(ref) {
      this.$refs[ref].value = '';
    }
  }
};
</script>
