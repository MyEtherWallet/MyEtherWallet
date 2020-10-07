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
              <mew-select :items="mergedContracts" label="Contract Type" @input="selectedContract"/>
            </div>
            <v-textarea
              v-model="abi"
              no-resize
              outlined
              name="input-7-4"
              label="ABI/JSON Interface"
              @change="setAndCheckAbi"
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
                class="non-bool-input"
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
              <!--              <mew-input :label="`${input.name} (${input.type})`"> </mew-input>-->
            </div>
            <div v-show="hasInputs" class="text-center mt-3">
              <mew-button
                title="Write"
                :has-full-width="false"
                button-size="xlarge"
                :disabled="false"
                @click.native="write"
              />
            </div>
            Result
            <div
              v-for="(output, idx) in getOutputs()"
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

import Network from '@/modules/wallets/components/network/Network';
import Swap from '@/modules/wallets/components/swap/Swap';
// import BigNumber from 'bignumber.js';
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
      // canInteract: false,
      tempDevAbi: tempDevAbi,
      activeContract: {},
      // inputs: {},
      hasInputs: false,
      hasOutputs: false,
      outputs: {},
      abi: tempDevAbi,
      contractAddress: '0x27AADe85642CA89cf219945D4bfB731498ca01FD',
      methods: [],
      contractType: []
    };
  },
  computed: {
    ...mapState(['network', 'gasPrice', 'account', 'web3']),
    mergedContracts() {
      const customContracts = /*store.get('customContracts') ||*/ [];
      const concatContracts = this.network.type.contracts.concat(
        customContracts
      );
      return concatContracts;
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
    // todo remove dev item
    // this.activeContract.setContractAddress(this.contractAddress);
    // this.activeContract.setAbi(this.abi);
    // this.canInteract = this.activeContract.contractActive;
    // console.log(this.activeContract.contractActive); // todo remove dev item
  },
  // deactivated(){
  //   this.activeContract.reset();
  // },
  // beforeDestroy () {
  //   this.activeContract.reset();
  // },
  methods: {
    getOutputs() {
      return this.outputs;
    },
    write() {
      if (this.activeContract.isMethodConstant) {
        this.activeContract.write().then(res => {
          this.outputs = res.outputs;
          this.hasOutputs = true;
        });
      } else {
        this.activeContract.write();
      }
    },
    valueInput(name, value) {
      this.activeContract.setSelectedMethodInputValue(name, value);
    },
    setAndCheckAbi(evt) {
      this.abi = evt;
      this.activeContract.setAbi(this.abi);
      // this.canInteract = this.activeContract.contractActive;
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
      console.log(this.interact); // todo remove dev item
      this.interact = true;
      this.$set(this, 'methods', this.activeContract.contractMethodNames);
      console.log(this.methods); // todo remove dev item
    },
    methodSelect(evt) {
      this.activeContract.selectedFunction(evt).then(res => {
        this.$set(this, 'outputs', res.outputs);
        this.hasInputs = Object.keys(res.inputs).length > 0;
      })
      .catch(err => {

      })
    },
    setContractAddress(evt) {
      this.contractAddress = evt;
      this.activeContract.setContractAddress(this.contractAddress);
      // this.canInteract = this.activeContract.contractActive;
      // console.log(this.activeContract.contractActive); // todo remove dev item
    },
    resetDefaults() {
      this.abi = '';
      this.contractAddress = '';
      this.interact = false;
      this.contractMethods = [];
      this.selectedMethod = {};
      this.result = '';
      this.loading = false;
      this.value = 0;
      // this.inputs = {};
      this.clearCurrency = !this.clearCurrency;
      this.activeContract.reset();
      console.log('resetDefaults'); // todo remove dev item
      // this.canInteract = this.activeContract.contractActive;
    },
    isValidInput() {
      return Contracts.isContractArgValid.apply(this, arguments);
    },
    getType() {
      return Contracts.getType.apply(this, arguments);
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
