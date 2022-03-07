<template>
  <mew-module
    class="d-flex flex-grow-1 pt-6"
    :has-elevation="true"
    :has-indicator="true"
    title="Deploy contract"
  >
    <template #moduleBody>
      <div>
        <v-textarea
          v-model="byteCode"
          outlined
          label="Bytecode"
          placeholder=" "
          :rules="[
            value => {
              return isValidByteCodeInput(value);
            }
          ]"
        />
        <v-textarea
          v-model="abiInterface"
          outlined
          name="input-7-4"
          label="ABI/JSON Interface"
          value=""
          placeholder=" "
          :rules="[
            value => {
              return isValidABI(value);
            }
          ]"
        ></v-textarea>
        <mew-input
          v-model="contractName"
          label="Contract name"
          placeholder=" "
        />
        <div v-show="constructorInputs.length">
          <div class="mb-10">Constructor Inputs</div>
          <div
            v-for="(input, idx) in constructorInputs"
            :key="input.name + idx"
            class="input-item-container"
          >
            <mew-input
              v-if="getType(input.type).type !== 'radio'"
              v-model="input.value"
              :label="`${input.name} (${input.type})`"
              class="non-bool-input"
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
                <mew-checkbox
                  v-model="input.value"
                  :value="true"
                  :label="`${input.name} (${input.type})`"
                  type="radio"
                  checked
                />
              </div>
            </div>
          </div>
          <mew-input
            v-if="isContructorPayable"
            v-model="ethAmount"
            :rules="[
              value => {
                return isETHValue(value);
              }
            ]"
            :label="`value (ETH)`"
            class="non-bool-input"
          />
        </div>
        <div class="text-center mt-3">
          <mew-button
            title="Sign Transaction"
            :has-full-width="false"
            btn-size="xlarge"
            :disabled="!canDeploy"
            @click.native="deploy"
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
    </template>
  </mew-module>
</template>

<script>
import Vue from 'vue';
import { mapState, mapActions, mapGetters } from 'vuex';
import sanitizeHex from '@/core/helpers/sanitizeHex';
import validateHexString from '@/core/helpers/validateHexString';
import {
  parseJSON,
  parseABI,
  getType as getInputType,
  isContractArgValid
} from './handlers/common';
import { stringToArray } from '@/core/helpers/common';
import { toWei, toBN, toHex } from 'web3-utils';

export default {
  name: 'ModuleContractDeploy',
  data() {
    return {
      contractName: '',
      byteCode: '',
      byteCodeHex: '',
      abiInterface: '',
      inputsValid: false,
      ethAmount: '0'
    };
  },
  computed: {
    ...mapState('wallet', ['address', 'web3']),
    ...mapState('global', ['currentNetwork']),
    ...mapGetters('global', ['gasPrice']),
    canDeploy() {
      return (
        this.byteCodeHex !== '' &&
        this.isValidByteCodeInput(this.byteCodeHex) &&
        this.isValidABI(this.abiInterface) &&
        (this.getConstructor(JSON.parse(this.abiInterface)).inputs.length ===
          0 ||
          this.inputsValid) &&
        (this.isContructorPayable === false || this.isETHValue(this.ethAmount))
      );
    },
    constructorInputs() {
      if (this.isValidABI(this.abiInterface)) {
        return this.getConstructor(JSON.parse(this.abiInterface)).inputs;
      }
      return [];
    },
    isContructorPayable() {
      if (this.isValidABI(this.abiInterface)) {
        return (
          this.getConstructor(JSON.parse(this.abiInterface)).stateMutability ===
          'payable'
        );
      }
      return false;
    }
  },
  watch: {
    abiInterface() {
      this.constructorInputs.forEach((i, idx) => {
        this.constructorInputs[idx].value = '';
        Vue.set(this.constructorInputs, idx, this.constructorInputs[idx]);
      });
    }
  },
  methods: {
    ...mapActions('global', ['addLocalContract']),
    resetDefaults() {
      this.contractName = '';
      this.byteCode = '';
      this.byteCodeHex = '';
      this.abiInterface = '';
      this.inputsValid = false;
      this.ethAmount = '0';
    },
    isValidByteCodeInput(val) {
      if (validateHexString(val)) {
        this.byteCodeHex = sanitizeHex(val);
        return true;
      }
      if (validateHexString('0x' + val)) {
        this.byteCodeHex = '0x' + val;
        return true;
      }
      try {
        const parsed = JSON.parse(val);
        if (validateHexString('0x' + parsed.object)) {
          this.byteCodeHex = '0x' + parsed.object;
          return true;
        }
        return false;
      } catch (e) {
        return false;
      }
    },
    isValidABI(val) {
      return !!parseJSON(val) && !!parseABI(parseJSON(val));
    },
    getConstructor(abi) {
      for (const method of abi) {
        if (method.type === 'constructor') return method;
      }
      return { inputs: [] };
    },
    deploy() {
      const contract = new this.web3.eth.Contract(
        JSON.parse(this.abiInterface)
      );
      const params = [];
      let details = {};
      for (const _input of this.constructorInputs) {
        if (_input.type.includes('[]') && _input.value)
          params.push(stringToArray(_input.value));
        else params.push(_input.value);
      }
      contract
        .deploy({
          data: this.byteCodeHex,
          arguments: params
        })
        .send({
          from: this.address,
          value: this.isContructorPayable
            ? toHex(toBN(toWei(this.ethAmount)))
            : '0x00'
        })
        .on('transactionHash', () => {
          details = {
            name: this.contractName,
            abi: JSON.stringify(JSON.parse(this.abiInterface))
          };
          this.resetDefaults();
        })
        .on('receipt', result => {
          details.address = result.contractAddress;
          if (details.name === '') {
            details.name = result.contractAddress;
          }
          this.addLocalContract(details);
        });
    },
    valueInput(idx, value) {
      if (idx && value) {
        this.constructorInputs[idx].value = value;
      }
      this.inputsValid = true;
      for (const _input of this.constructorInputs) {
        if (
          !this.isValidInput(
            _input.value,
            this.getType(_input.type).solidityType
          )
        )
          this.inputsValid = false;
      }
    },
    isETHValue(val) {
      try {
        toWei(val, 'ether');
        return true;
      } catch (e) {
        return false;
      }
    },
    getType(type) {
      return getInputType(type);
    },
    isValidInput(value, sType) {
      return isContractArgValid(value, sType);
    }
  }
};
</script>
