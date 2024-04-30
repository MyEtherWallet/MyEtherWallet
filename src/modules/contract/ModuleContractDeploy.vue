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
          class="BytecodeInput"
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
          class="ABIInput"
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
          class="ContractName"
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
        <div class="text-right">
          <mew-button
            btn-style="light"
            title="Clear all"
            :has-full-width="false"
            class="mr-4"
            @click.native="resetDefaults()"
          />
          <mew-button
            title="Deploy Contract"
            class="SignTransactionButton"
            :has-full-width="false"
            :disabled="!canDeploy"
            @click.native="deploy"
          />
        </div>
      </div>
    </template>
  </mew-module>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { toWei, toBN, toHex } from 'web3-utils';

import sanitizeHex from '@/core/helpers/sanitizeHex';
import validateHexString from '@/core/helpers/validateHexString';
import {
  parseJSON,
  parseABI,
  getType as getInputType,
  isContractArgValid
} from './handlers/common';
import { stringToArray } from '@/core/helpers/common';
import { CONTRACT } from '../analytics-opt-in/handlers/configs/events';
import { useAmplitude } from '@/core/composables/amplitude';

import {
  global as useGlobalStore,
  wallet as useWalletStore
} from '@/core/store/index.js';

// injections/use
const { trackContract } = useAmplitude();
const { addLocalContract } = useGlobalStore();
const { address, web3, instance } = useWalletStore();

// data
const contractName = ref('');
const byteCode = ref('');
const byteCodeHex = ref('');
const abiInterface = ref('');
const inputsValid = ref(false);
const ethAmount = ref('0');

// computed
const canDeploy = computed(() => {
  return (
    byteCodeHex.value !== '' &&
    isValidByteCodeInput(byteCodeHex.value) &&
    isValidABI(abiInterface.value) &&
    (getConstructor(JSON.parse(abiInterface.value)).inputs.length === 0 ||
      inputsValid.value) &&
    (isContructorPayable.value === false || isETHValue(ethAmount.value))
  );
});
const constructorInputs = computed(() => {
  if (isValidABI(abiInterface.value)) {
    return getConstructor(JSON.parse(abiInterface.value)).inputs;
  }
  return [];
});
const isContructorPayable = computed(() => {
  if (isValidABI(abiInterface.value)) {
    return (
      getConstructor(JSON.parse(abiInterface.value)).stateMutability ===
      'payable'
    );
  }
  return false;
});

// watch
watch(abiInterface, () => {
  constructorInputs.value.forEach((i, idx) => {
    constructorInputs.value[idx].value = '';
    constructorInputs.value[idx] = constructorInputs[idx].value;
  });
});

// methods
const resetDefaults = () => {
  contractName.value = '';
  byteCode.value = '';
  byteCodeHex.value = '';
  abiInterface.value = '';
  inputsValid.value = false;
  ethAmount.value = '0';
};
const isValidByteCodeInput = val => {
  if (validateHexString(val)) {
    byteCodeHex.value = sanitizeHex(val);
    return true;
  }
  if (validateHexString('0x' + val)) {
    byteCodeHex.value = '0x' + val;
    return true;
  }
  try {
    const parsed = JSON.parse(val);
    if (validateHexString('0x' + parsed.object)) {
      byteCodeHex.value = '0x' + parsed.object;
      return true;
    }
    return false;
  } catch (e) {
    return false;
  }
};
const isValidABI = val => {
  return !!parseJSON(val) && !!parseABI(parseJSON(val));
};
const getConstructor = abi => {
  for (const method of abi) {
    if (method.type === 'constructor') return method;
  }
  return { inputs: [] };
};
const deploy = () => {
  const contract = new web3.eth.Contract(JSON.parse(abiInterface.value));
  const params = [];
  let details = {};
  for (const _input of constructorInputs.value) {
    if (_input.type.includes('[]') && _input.value)
      params.push(stringToArray(_input.value));
    else params.push(_input.value);
  }
  trackContract(CONTRACT.DEPLOY_CONTRACT);
  contract
    .deploy({
      data: byteCodeHex.value,
      arguments: params
    })
    .send({
      from: address,
      value: isContructorPayable.value
        ? toHex(toBN(toWei(ethAmount.value)))
        : '0x00'
    })
    .on('transactionHash', () => {
      details = {
        name: contractName.value,
        abi: JSON.stringify(JSON.parse(abiInterface.value))
      };
      resetDefaults();
    })
    .on('receipt', result => {
      details.address = result.contractAddress;
      if (details.name === '') {
        details.name = result.contractAddress;
      }
      trackContract(CONTRACT.DEPLOY_CONTRACT_SUCCESS);
      addLocalContract(details);
    })
    .on('error', err => {
      trackContract(CONTRACT.DEPLOY_CONTRACT_FAIL);
      instance.errorHandler(err);
    });
};
const valueInput = (idx, value) => {
  if (idx && value) {
    constructorInputs.value[idx].value = value;
  }
  inputsValid.value = true;
  for (const _input of constructorInputs.value) {
    if (!isValidInput(_input.value, getType(_input.type).solidityType))
      inputsValid.value = false;
  }
};
const isETHValue = val => {
  try {
    toWei(val, 'ether');
    return true;
  } catch (e) {
    return false;
  }
};
const getType = type => {
  return getInputType(type);
};
const isValidInput = (value, sType) => {
  return isContractArgValid(value, sType);
};
</script>
