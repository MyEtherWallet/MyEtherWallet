<template>
  <div>
    <mew-module
      class="d-flex flex-grow-1 pt-6"
      title="Send Offline"
      :has-elevation="true"
      :has-indicator="true"
    >
      <template #moduleBody>
        <!--
      =====================================================================================
        Tokens / Amount to Swap / Token Balance
      =====================================================================================
      -->
        <v-row class="mt-5">
          <v-col cols="12" sm="6" class="pr-sm-1 pt-0 pb-0 pb-sm-4">
            <div class="position--relative">
              <mew-select
                v-model="selectedCurrency"
                label="Token"
                :items="tokens"
                :is-custom="true"
              />
            </div>
          </v-col>
          <v-col cols="12" sm="6" class="pl-sm-1 pt-0 pb-2 pb-sm-4">
            <div class="position--relative">
              <mew-input
                v-model="amount"
                class="SendOfflineAmountInput"
                label="Amount"
                placeholder="0"
                :error-messages="amountErrors"
                type="number"
              />
            </div>
          </v-col>
          <!--
        =====================================================================================
          Input Address
        =====================================================================================
        -->
          <v-col cols="12" class="pt-4 pb-2">
            <ModuleAddressBook
              ref="addressInput"
              class="SendOfflineAddressBook"
              @setAddress="setAddress"
            />
          </v-col>

          <v-col cols="12">
            <mew-input
              v-model="localNonce"
              class="SendOfflineNonceInput"
              :label="$t('sendTx.nonce')"
              placeholder="0"
              type="number"
              :error-messages="nonceErrors"
            />
          </v-col>
          <v-col cols="12">
            <mew-input
              v-model="data"
              label="Data"
              placeholder="0x..."
              :error-messages="dataErrors"
              class="mb-8 SendOFflineDataInput"
              :disabled="disableData"
            />
          </v-col>
          <v-col cols="12">
            <mew-input
              v-model="gasLimit"
              class="SendOfflineGasLimitInput"
              :label="$t('common.gas.limit')"
              :error-messages="gasLimitErrors"
              type="number"
            />
          </v-col>
          <v-col cols="12">
            <mew-input
              v-model="gasPrice"
              class="SendOfflineGasPriceInput"
              label="Gas Price (in gwei)"
              :error-messages="gasPriceErrors"
              type="number"
            />
          </v-col>
        </v-row>

        <div class="d-flex flex-column mt-12">
          <div class="text-center">
            <mew-button
              title="Generate Transaction"
              class="SendOfflineGenerateTransactionButton"
              :has-full-width="false"
              btn-size="xlarge"
              :disabled="isDisabledNextBtn"
              @click.native="generateTx"
            />
          </div>
          <div class="text-center">
            <div class="d-flex flex-column justify-center">
              <input
                ref="uploadedFile"
                class="SendOfflineUploadInput"
                type="file"
                style="opacity: 0"
                accept="json"
                @change="upload"
              />
              <mew-button
                class="mt-2 display--block mx-auto SendOfflineUploadJsonButton"
                title="Upload JSON file"
                btn-size="small"
                btn-style="transparent"
                @click.native="$refs.upload.click()"
              />
            </div>
            <mew-button
              :title="$t('common.clear-all')"
              :has-full-width="false"
              btn-size="small"
              btn-style="transparent"
              @click.native="clear()"
            />
          </div>
        </div>
      </template>
    </mew-module>
    <mew-overlay
      :show-overlay="isSignedTxOpen"
      title="Signed Transaction"
      :close="() => (isSignedTxOpen = false)"
      content-size="xlarge"
    >
      <div v-if="signedTransaction" style="width: 100%" class="text-center">
        <mew-text-area
          ref="signedTxInput"
          class="SendOfflineSignedTxResultInput"
          style="width: 100%"
          label="Signed Transaction"
          readonly
          :value="signedTransaction.rawTransaction"
        />

        <mew-text-area
          class="mt-12"
          style="width: 100%"
          label="Signed Raw Transaction"
          readonly
          :value="signed"
        />
        <mew-button
          class="mt-5"
          title="Copy And Continue"
          @click.native="copyAndContinue"
        />
        <div class="pt-3">
          <a
            :href="jsonFile"
            :download="jsonFileName"
            rel="noopener noreferrer"
            class="mew-body"
            >Download</a
          >
        </div>
      </div>
    </mew-overlay>
  </div>
</template>

<script setup>
import { defineAsyncComponent, ref, computed, watch, onMounted } from 'vue';
import clipboardCopy from 'clipboard-copy';
import {
  toBN,
  isHexStrict,
  toWei,
  hexToNumberString,
  fromWei
} from 'web3-utils';

import BigNumber from 'bignumber.js';
import Web3 from 'web3';
import { isValidAddress } from 'ethereumjs-util';
import { debounce, isEmpty } from 'lodash';
import * as nodes from '@/utils/networks/nodes';

import sanitizeHex from '@/core/helpers/sanitizeHex';
import { ERROR, SUCCESS, Toast } from '../toast/handler/handlerToast';
import { toBNSafe } from '@/core/helpers/numberFormatHelper';

import { useGlobalStore } from '@/core/store/global';
import { useWalletStore } from '@/core/store/wallet';
import { useExternalStore } from '@/core/store/external';

const ModuleAddressBook = defineAsyncComponent(() =>
  import('@/modules/address-book/ModuleAddressBook')
);

// injections/use
const { instance, setWeb3Instance } = useWalletStore();
const { network, setNetwork } = useGlobalStore();

// data
const isSignedTxOpen = ref(false);
const localNonce = ref('0');
const gasLimit = ref('21000');
const gasPrice = ref('0');
const toAddress = ref('');
const addressValid = ref(false);
const amount = ref('0');
const selectedCurrency = ref({});
const data = ref('0x');
const userInputType = ref('');
const defaultGasLimit = ref('21000');
const gasLimitError = ref('');
const amountError = ref('');
const signed = ref(null);
const raw = ref(null);
const signedTransaction = ref(null);
const jsonFileName = ref('');
const jsonFile = ref(null);
const tokens = ref([]);
const chainID = ref(1);
const signedTxInput = ref(null);
const addressInput = ref(null);
const uploadedFile = ref(null);

// computed
const networkToken = computed(() => {
  return {
    symbol: network.type.currencyName,
    name: network.type.name
  };
});
const isDisabledNextBtn = computed(() => {
  return (
    nonceErrors.value !== '' ||
    dataErrors.value !== '' ||
    gasLimitErrors.value !== '' ||
    gasPriceErrors.value !== '' ||
    amountErrors.value !== '' ||
    !validAddress.value
  );
});
const nonceErrors = computed(() => {
  if (
    BigNumber(localNonce.value).lt(0) ||
    localNonce.value === '' ||
    localNonce.value === null
  ) {
    return 'Nonce has to be greater than or equal to 0!';
  }
  return '';
});
const dataErrors = computed(() => {
  if (isHexStrict(data.value)) {
    return '';
  }
  return 'Invalid data hex';
});
const gasLimitErrors = computed(() => {
  if (!gasLimit.value) {
    return 'Required';
  }
  if (BigNumber(gasLimit.value).lte(0)) {
    return 'Gas limit must be greater than 0';
  } else if (BigNumber(gasLimit.value).dp() > 0) {
    return 'Gas limit can not have decimal points';
  } else if (toBN(gasLimit.value).lt(toBN(defaultGasLimit.value))) {
    return 'Amount too low. Transaction will fail';
  }
  return '';
});
const gasPriceErrors = computed(() => {
  if (!gasPrice.value) {
    return 'Required';
  } else if (BigNumber(gasPrice.value).lte(0)) {
    return 'Gas price must be greater than 0';
  }

  return '';
});
const amountErrors = computed(() => {
  if (!amount.value) {
    return 'Required';
  } else if (BigNumber(amount).lt(0)) {
    return 'Amount must be greater than or equal to 0';
  }
  return '';
});
const disableData = computed(() => {
  return selectedCurrency.value?.symbol !== network.type.currencyName;
});
const validAddress = computed(() => {
  return toAddress.value !== '' && isValidAddress(toAddress);
});
const canGenerate = computed(() => {
  return (
    validAddress.value &&
    !isEmpty(selectedCurrency.value) &&
    selectedCurrency.value.symbol !== network.type.currencyName
  );
});

// watch
watch(signed, newVal => {
  const parsedVal = JSON.parse(newVal);
  const string = JSON.stringify(parsedVal);
  const blob = new Blob([string], {
    type: 'mime'
  });
  jsonFileName.value = `signedTransactionObject-${+new Date()}.json`;
  jsonFile.value = window.URL.createObjectURL(blob);
});
watch(selectedCurrency, () => {
  if (canGenerate.value) {
    generateData();
  }
});
watch(toAddress, () => {
  if (canGenerate.value) {
    generateData();
  }
});
watch(network, () => {
  selectedCurrency.value = networkToken;
  generateTokens();
});

// mounted
onMounted(() => {
  selectedCurrency.value = networkToken;
  generateTokens();
});

// method
const generateTokens = () => {
  const networkToken = [networkToken];
  network.type.tokens.then(tokens => {
    tokens.value = networkToken.concat(
      tokens.map(item => {
        item.subtext = item.name;
        item.value = item.contract;
        item.name = item.symbol;
        return item;
      })
    );
  });
};
const generateData = () => {
  const web3 = new Web3(network.url);
  const jsonInterface = [
    {
      constant: false,
      inputs: [
        { name: '_to', type: 'address' },
        { name: '_amount', type: 'uint256' }
      ],
      name: 'transfer',
      outputs: [{ name: '', type: 'bool' }],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'function'
    }
  ];
  const contract = new web3.eth.Contract(
    jsonInterface,
    selectedCurrency.value.address
  );
  const amount = toBN(amount);
  data.value = contract.methods
    .transfer(toAddress.value.toLowerCase(), amount)
    .encodeABI();
};
const copyAndContinue = () => {
  clipboardCopy(signedTxInput.value);
  isSignedTxOpen.value = false;
};
/**
 * Resets values to default
 */
const clear = () => {
  if (addressInput.value) addressInput.value.clear();
  toAddress.value = '';
  selectedCurrency.value = networkToken;
  addressValid.value = false;
  amount.value = '0';
  data.value = '0x';
  userInputType.value = '';
  localNonce.value = '0';
  gasPrice.value = '0';
  defaultGasLimit.value = '21000';
  gasLimitError.value = '';
  amountError.value = '';
};
const setAddress = (addr, isValidAddress, userInputType) => {
  toAddress.value = addr;
  addressValid.value = isValidAddress;
  userInputType.value = userInputType;
};
const upload = ({ target: { files } }) => {
  const reader = new FileReader();
  reader.onloadend = function ({ target: { result } }) {
    try {
      const file = JSON.parse(result);
      if (file.nonce) {
        const uploadedGasPrice = hexToNumberString(file.gasPrice);
        localNonce.value = hexToNumberString(file.nonce);
        gasPrice.value = fromWei(uploadedGasPrice, 'gwei');
        chainID.value = hexToNumberString(file.chainID);
        setNetworkDebounced(chainID);
        uploadedFile.value = '';
        return;
      }
      Toast('Malformed File', {}, 'error');
    } catch {
      Toast('Incorrect File Type', {}, 'error');
    }
  };
  if (files[0]) reader.readAsBinaryString(files[0]);
};
const generateTx = async () => {
  const symbol = network.type.currencyName;
  const isToken = selectedCurrency.value.symbol !== symbol;
  const amtWei = toWei(amount, 'ether');
  const localRaw = {
    nonce: sanitizeHex(toBNSafe(localNonce).toString(16)),
    gasLimit: sanitizeHex(toBNSafe(gasLimit).toString(16)),
    gasPrice: sanitizeHex(toWei(toBNSafe(gasPrice), 'gwei').toString(16)),
    to: isToken
      ? selectedCurrency.value.address
      : toAddress.value.toLowerCase().trim(),
    value: isToken
      ? sanitizeHex(toBNSafe(0).toString(16))
      : sanitizeHex(toBNSafe(amtWei).toString(16)),
    data: data,
    chainId: network.type.chainID
  };

  raw.value = localRaw;
  const signed = await instance.signTransaction(raw);
  signedTransaction.value = signed;
  signed.value = JSON.stringify(signed);
  window.scrollTo(0, 0);
  clear();
  isSignedTxOpen.value = true;
};
/**
 * Debounce network switch from user input
 * @return {void}
 */
const setNetworkDebounced = debounce(function (value) {
  const found = Object.values(nodes).filter(item => {
    if (item.type.chainID == value) {
      return item;
    }
  });
  setNetwork({
    network: found[0],
    walletType: instance?.identifier || ''
  })
    .then(() => {
      setWeb3Instance();
      Toast(`Switched network to: ${found[0].type.name}`, {}, SUCCESS);
    })
    .catch(e => {
      Toast(e, {}, ERROR);
    });
}, 1000);
</script>
