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
          v-model="currentContract"
          :items="mergedContracts"
          label="Contract Name"
          class="ContractSelect"
          normal-dropdown
          @input="selectedContract"
        />
        <mew-input
          v-model="contractAddress"
          label="Contract Address"
          placeholder=" "
          class="mr-3 flex-grow-1 full-width"
          :persistent-hint="nametag.length > 0"
          :hint="nametag"
        />

        <v-textarea
          v-model="abi"
          no-resize
          outlined
          name="input-7-4"
          label="ABI/JSON Interface"
        ></v-textarea>

        <div class="text-right">
          <mew-button
            title="Clear all"
            :has-full-width="false"
            btn-style="light"
            class="mr-4"
            @click.native="resetDefaults"
          />
          <mew-button
            title="Interact"
            class="InteractButton"
            :disabled="!canInteract"
            :has-full-width="false"
            @click.native="showInteract"
          />
        </div>
      </div>

      <!--
      ============================================================================
      Overlay
      ============================================================================
      -->
      <mew-overlay
        :footer="{
          text: 'Need help?',
          linkTitle: 'Contact support',
          link: 'mailto:support@myetherwallet.com'
        }"
        title="Interact with contract"
        :show-overlay="interact"
        :close="closeInteract"
        content-size="medium"
      >
        <mew-select
          label="Function"
          :items="methods"
          class="mt-4 mt-lg-0 mb-1 FunctionSelect"
          normal-dropdown
          @input="methodSelect"
        />

        <div v-show="selectedMethod.inputs.length" class="mew-heading-2 mb-3">
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
            class="CallFunctionButton"
            :disabled="canProceed"
            @click.native="readWrite"
          />
        </div>

        <v-divider v-if="hasOutputs" class="mt-9 mb-8" />

        <div v-if="hasOutputs" style="display: contents">
          <div class="mew-heading-2">Results</div>
          <div
            v-for="(output, idx) in selectedMethod.outputs"
            :key="output.name + idx"
            class="d-flex align-center justify-space-between my-4"
          >
            <div class="text-capitalize mr-2">
              {{ output.name !== '' ? output.name : selectedMethod.name }}
            </div>
            <div class="font-weight-medium">{{ output.value }}</div>
          </div>
        </div>
      </mew-overlay>
    </template>
  </mew-module>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import { toBN, toWei } from 'web3-utils';
import { isString, throttle } from 'lodash';
import { getAddressInfo } from '@kleros/address-tags-sdk';

import { isAddress } from '@/core/helpers/addressUtils';
import { stringToArray } from '@/core/helpers/common';
import {
  parseJSON,
  parseABI,
  getType as getInputType,
  isContractArgValid
} from './handlers/common';
import { ERROR, Toast } from '../toast/handler/handlerToast';
import { CONTRACT } from '../analytics-opt-in/handlers/configs/events';
import { useAmplitude } from '@/core/composables/amplitude';
import { useGlobalStore } from '@/core/store/global';
import { useWalletStore } from '@/core/store/wallet';
import { storeToRefs } from 'pinia';

// injections/vue
const { trackContract } = useAmplitude();
const { address, balance } = useWalletStore();
const { network, localContracts } = useGlobalStore();

const { web3 } = storeToRefs(useWalletStore);
// data
const currentContract = ref(null);
const interact = ref(false);
const inputsValid = ref(false);
const hasEnough = ref(false);
const abi = ref([]);
const contractAddress = ref('');
const selectedMethod = ref({
  inputs: [],
  outputs: []
});
const outputValues = ref([]);
const ethPayable = ref('0');
const nametag = ref('');
const networkContracts = ref([]);

// computed
const canProceed = computed(() => {
  if (isPayableFunction.value) {
    if (!canPay.value) {
      return true;
    }
    return !inputsValid.value && !!selectedMethod.value.inputs.length && canPay;
  }
  return !inputsValid.value && !!selectedMethod.value.inputs.length;
});
const isViewFunction = computed(() => {
  return (
    selectedMethod.value.constant ||
    selectedMethod.value.stateMutability === 'view'
  );
});
const isPayableFunction = computed(() => {
  return selectedMethod.value.stateMutability === 'payable';
});
const canPay = computed(() => {
  if (isPayableFunction.value) {
    return hasEnough.value;
  }
  return true;
});
const mergedContracts = computed(() => {
  const checkContract = arr => arr.filter(contract => isString(contract.name));
  return [
    { text: 'Select a Contract', selectLabel: true, divider: true }
  ].concat(
    checkContract(localContracts),
    checkContract(networkContracts.value)
  );
});
const methods = computed(() => {
  if (canInteract.value) {
    return JSON.parse(abi.value).filter(item => {
      if (
        item.type !== 'constructor' &&
        item.type !== 'event' &&
        item.type !== 'fallback'
      ) {
        return item;
      }
    });
  }
  return [];
});
const canInteract = computed(() => {
  return isAddress(contractAddress.value) && parseABI(parseJSON(abi.value));
});
const hasOutputs = computed(() => {
  const outputsWithValues = selectedMethod.value.outputs.filter(item => {
    if (item.value !== '') {
      return item;
    }
  });

  return outputsWithValues.length > 0;
});

// watch
watch(
  () => contractAddress,
  newVal => {
    nametag.value = '';
    if (!newVal) {
      contractAddress.value = '';
    }
    if (newVal && isAddress(newVal.toLowerCase())) {
      resolveAddress();
    }
  }
);
watch(
  () => web3,
  () => {
    generateNetworkContracts();
  }
);

// mounted
onMounted(() => {
  generateNetworkContracts();
});

// methods
const generateNetworkContracts = () => {
  network.type.contracts.then(contracts => {
    networkContracts.value = contracts;
  });
};
const resetDefaults = () => {
  currentContract.value = null;
  abi.value = [];
  contractAddress.value = '';
  interact.value = false;
  selectedMethod.value = {
    inputs: [],
    outputs: []
  };
};
const readWrite = () => {
  const params = [];
  for (const _input of selectedMethod.value.inputs) {
    if (_input.type.includes('[]')) {
      if (_input.value === '[]') {
        params.push([]);
      } else {
        params.push(stringToArray(_input.value));
      }
    } else {
      params.push(_input.value);
    }
  }
  const caller = currentContract.value.methods[selectedMethod.value.name].apply(
    this,
    params
  );
  if (isViewFunction.value) {
    trackContract(CONTRACT.INTERACT_W_CONTRACT_READ);
    caller
      .call()
      .then(result => {
        trackContract(CONTRACT.INTERACT_W_CONTRACT_READ_SUCCESS);
        if (selectedMethod.value.outputs.length === 1) {
          selectedMethod.value.outputs[0].value = result;
          selectedMethod.value.outputs[0] = selectedMethod.value;
        } else if (selectedMethod.value.outputs.length > 1) {
          selectedMethod.value.outputs.forEach((out, idx) => {
            out.value = result[idx];
            selectedMethod.value.outputs[idx] = out;
          });
        }
      })
      .catch(({ message }) => {
        trackContract(CONTRACT.INTERACT_W_CONTRACT_READ_FAIL);
        Toast(message, {}, ERROR);
      });
  } else if (isPayableFunction.value) {
    trackContract(CONTRACT.INTERACT_W_CONTRACT_WRITE);
    const rawTx = {
      to: contractAddress.value,
      from: address,
      value: ethPayable,
      data: caller.encodeABI()
    };

    web3.eth
      .estimateGas(rawTx)
      .then(gasLimit => {
        trackContract(CONTRACT.INTERACT_W_CONTRACT_WRITE_SUCCESS);
        rawTx.gas = gasLimit;
        caller.send(rawTx);
      })
      .catch(({ message }) => {
        trackContract(CONTRACT.INTERACT_W_CONTRACT_WRITE_FAIL);
        Toast(message, {}, ERROR);
      });
  } else {
    trackContract(CONTRACT.INTERACT_W_CONTRACT_WRITE);
    caller
      .send({ from: address })
      .then(() => {
        trackContract(CONTRACT.INTERACT_W_CONTRACT_WRITE_SUCCESS);
      })
      .catch(({ message }) => {
        trackContract(CONTRACT.INTERACT_W_CONTRACT_WRITE_FAIL);
        Toast(message, {}, ERROR);
      });
  }
};
const payableInput = amount => {
  if (!amount || amount === '') amount = '0';
  ethPayable.value = toWei(amount, 'ether');
  hasEnough.value = toBN(ethPayable.value).lte(balance);
};
const valueInput = (idx, value) => {
  selectedMethod.value.inputs[idx].value = value;
  inputsValid.value = true;
  for (const _input of selectedMethod.value.inputs) {
    if (!isValidInput(_input.value, getType(_input.type).solidityType))
      inputsValid.value = false;
  }
};
const selectedContract = selected => {
  if (parseABI(parseJSON(selected.abi))) {
    if (typeof selected.abi !== 'string')
      abi.value = JSON.stringify(selected.abi);
    else abi.value = selected.abi;
  }
  if (isAddress(selected.address)) {
    contractAddress.value = selected.address;
  }
};
const closeInteract = () => {
  interact.value = false;
  resetDefaults();
};
const showInteract = () => {
  interact.value = true;
  currentContract.value = new web3.eth.Contract(
    JSON.parse(abi.value),
    contractAddress.value
  );
};
const methodSelect = evt => {
  if (evt && evt.inputs && evt.outputs) {
    inputsValid.value = false;
    selectedMethod.value = evt;
    selectedMethod.value.inputs.forEach(v => (v.value = ''));
    selectedMethod.value.outputs.forEach(v => (v.value = ''));
    outputValues.value = [];
  }
};

const isValidInput = (value, sType) => {
  return isContractArgValid(value, sType);
};
const getType = type => {
  return getInputType(type);
};
/**
 * Resolves address and @returns name
 */
const resolveAddress = throttle(async () => {
  try {
    await getAddressInfo(contractAddress.value, 'https://ipfs.kleros.io').then(
      data => {
        nametag.value = data?.publicNameTag || '';
      }
    );
  } catch (e) {
    nametag.value = '';
  }
}, 300);
</script>
