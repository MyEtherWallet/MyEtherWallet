<template>
  <div>
    <div class="d-flex">
      <div class="flex-grow-1">
        <mew6-white-sheet>
          <interface-wrap title="Interact with contract">
            <div class="d-flex">
              <mew-input
                label="Contract Address"
                placeholder=" "
                class="mr-3 flex-grow-1"
                @input="setContractAddress"
              />
              <mew-select :items="contractType" label="Contract Type" />
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
              />
            </div>
          </interface-wrap>
        </mew6-white-sheet>
        <mew-overlay
          :show-overlay="show"
          :close="showInteract"
          :back="showInteract"
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
                  <!--                  <mew-checkbox-->
                  <!--                    v-model="inputs[input.name]"-->
                  <!--                    :value="false"-->
                  <!--                    :label="$t('contract.false')"-->
                  <!--                    type="radio"-->
                  <!--                    checked-->
                  <!--                  />-->
                </div>
                <div class="bool-items"></div>
              </div>
              <!--              <mew-input :label="`${input.name} (${input.type})`"> </mew-input>-->
            </div>
            {{ hasInputs }}
            <div v-show="hasInputs" class="text-center mt-3">
              <mew-button
                title="Sign Transaction"
                :has-full-width="false"
                button-size="xlarge"
                :disabled="false"
                @click.native="write"
              />
            </div>
            <div
              v-for="(output, idx) in getOutputs()"
              :key="output.name + idx"
              class="input-item-container"
            >
              {{ output }}
              {{ output.value }}
              <mew-input
                v-if="getType(output.type).type !== 'radio'"
                :disabled="true"
                :label="`${output.name} (${output.type})`"
                :value="output.value"
                class="non-bool-input"
              />
              <div
                v-if="getType(output.type).type === 'radio'"
                class="bool-input-container"
              >
                <div class="bool-items">
                  <mew-switch :value="false" :label="output.name" />
                  <!--                  <mew-checkbox-->
                  <!--                    v-model="inputs[input.name]"-->
                  <!--                    :value="false"-->
                  <!--                    :label="$t('contract.false')"-->
                  <!--                    type="radio"-->
                  <!--                    checked-->
                  <!--                  />-->
                </div>
                <div class="bool-items"></div>
              </div>
              <!--              <mew-input :label="`${input.name} (${input.type})`"> </mew-input>-->
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
      show: false,
      tempDevAbi: tempDevAbi,
      activeContract: {},
      // inputs: {},
      hasInputs: false,
      outputs: {},
      abi: [],
      methods: [
        {
          text: 'func1',
          value: function () {
            console.log('function 1');
          }
        },
        {
          text: 'func2',
          value: function () {
            console.log('function 2');
          }
        }
      ],
      contractType: [
        {
          name: 'Contract 1',
          subtext: 'Eth',
          value: '1'
        }
      ]
    };
  },
  computed: {
    ...mapState(['network', 'gasPrice', 'account', 'web3']),
    mergedContracts() {
      // const customContracts = store.get('customContracts') || [];
      // const concatContracts = this.network.type.contracts.concat(
      //   customContracts
      // );
      // return concatContracts;
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
      // return (
      //   this.selectedMethod.constant && this.selectedMethod.inputs.length === 0
      // );
    },
    resType() {
      return typeof this.result;
    },
    inputs() {
      return this.activeContract.selectedMethodInputs;
    },
    // outputs(){
    //   console.log(this.activeContract.selectedMethodOutputs); // todo remove dev item
    //   return this.activeContract.selectedMethodOutputs;
    // },
    // allValid() {
    //   let _allvalid = true;
    //   if (this.selectedMethod.inputs) {
    //     this.selectedMethod.inputs.forEach(item => {
    //       if (
    //         !this.isValidInput(
    //           this.inputs[item.name],
    //           this.getType(item.type).solidityType
    //         )
    //       )
    //         _allvalid = false;
    //     });
    //   }
    //   return _allvalid && this.isValidAbi && this.isValidAddress;
    // },
    // contractArgs() {
    //   const _contractArgs = [];
    //   if (this.selectedMethod) {
    //     this.selectedMethod.inputs.forEach(item => {
    //       if (item.type.includes('[]')) {
    //         const parsedItem = this.formatInput(this.inputs[item.name]);
    //         _contractArgs.push(parsedItem);
    //       } else if (item.type === 'address') {
    //         _contractArgs.push(this.inputs[item.name].toLowerCase().trim());
    //       } else if (item.includes === 'uint') {
    //         const number = new BigNumber(this.inputs[item.name].trim());
    //         _contractArgs.push(number.toFixed());
    //       } else {
    //         _contractArgs.push(this.inputs[item.name]);
    //       }
    //     });
    //   }
    //   return _contractArgs;
    // },
    txValue() {
      return sanitizeHex(unit.toWei(this.value, 'ether').toString(16));
    }
  },
  mounted() {
    this.activeContract = new Contracts(this.account.address, undefined, 0);
  },
  methods: {
    getOutputs() {
      return this.outputs;
    },
    write() {
      if (this.activeContract.isMethodConstant) {
        this.activeContract.write().then(res => {
          this.outputs = res.outputs;
          console.log('write result', res.outputs); // todo remove dev item
          // this.$set(this, 'outputs', res);
        });
      }
    },
    valueInput(name, value) {
      console.log('valueInput 1 ', name, value); // todo remove dev item
      // this.inputs[idx] = evt;
      // console.log(this.inputs); // todo remove dev item
      this.activeContract.setSelectedMethodInputValue(name, value);
      // this.inputs = this.activeContract.selectedMethodInputs
    },
    setAndCheckAbi(evt) {
      this.abi = evt;
    },
    showInteract() {
      console.log(this.show); // todo remove dev item
      this.show = !this.show;
      this.activeContract.setAbi(this.abi);
      this.$set(this, 'methods', this.activeContract.contractMethodNames);
      console.log(this.methods); // todo remove dev item
    },
    methodSelect(evt) {
      this.activeContract.selectedFunction(evt).then(res => {
        console.log(
          'this.activeContract.methodInputs',
          this.activeContract.selectedMethodInputs
        ); // todo remove dev item
        // this.inputs = this.activeContract.selectedMethodInputs
        this.$set(this, 'outputs', res.outputs);
        // // this.inputs = this.activeContract.selectedMethodInputs;
        this.hasInputs = Object.keys(res.inputs).length > 0;
        console.log(Object.keys(res.inputs)); // todo remove dev item
        console.log(res.inputs); // todo remove dev item
        console.log(res.outputs); // todo remove dev item
        // if(res.result){
        //
        // }
        console.log('inputs', this.inputs); // todo remove dev item
      });
    },
    setContractAddress(evt) {
      this.activeContract.setContractAddress(evt);
    },
    resetDefaults() {
      this.abi = '';
      this.address = '';
      this.interact = false;
      this.contractMethods = [];
      this.selectedMethod = {};
      this.result = '';
      this.loading = false;
      this.value = 0;
      this.inputs = {};
      this.clearCurrency = !this.clearCurrency;
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
      }
      this.address = selected.address;
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
