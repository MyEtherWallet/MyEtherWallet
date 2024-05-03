<template>
  <div>
    <v-dialog v-model="dialog" persistent max-width="500">
      <v-sheet color="white" class="pa-5">
        <h3 class="mb-5 text-center">Transaction status</h3>
        <div v-if="txLoading" class="pa-5">
          <v-progress-linear indeterminate rounded height="6" />
        </div>
        <v-alert v-if="!txLoading" :type="status ? 'success' : 'error'">{{
          status ? 'Success' : 'Failed'
        }}</v-alert>
        <div v-if="txHash" class="greyLight pa-5 mb-2">
          <div class="font-weight-bold">Transaction Hash</div>
          <div class="d-flex">
            <mew-transform-hash :hash="txHash" />
            <mew-copy :copy-value="txHash" tooltip="Copy Me!" class="ml-2" />
          </div>
        </div>
        <div class="pa-5">
          <mew-alert
            v-if="dialogAlert"
            hide-close-icon
            theme="error"
            title="Error"
            :description="dialogAlert"
          />
        </div>

        <div class="text-center">
          <mew-button
            class="mt-6"
            title="Close"
            btn-size="xlarge"
            @click.native="dismiss"
          />
        </div>
      </v-sheet>
    </v-dialog>

    <mew-module
      class="pt-6"
      :title="title.title"
      :has-elevation="true"
      :has-indicator="true"
    >
      <template #moduleBody>
        <mew-stepper
          :compact="$vuetify.breakpoint.smAndDown"
          :items="stepperItems"
          :on-step="currentStep"
        ></mew-stepper>

        <div v-if="currentStep === 1">
          <v-sheet color="transparent" max-width="600px" class="mx-auto py-10">
            <network-switch />
          </v-sheet>
          <mew-button
            btn-size="xlarge"
            title="Next"
            class="mx-auto display--block NextButton"
            @click.native="currentStep = 2"
          />
        </div>

        <div v-if="currentStep === 2">
          <v-sheet color="transparent" max-width="600px" class="mx-auto py-10">
            <mew-address-select
              class="OfflineAddressInput"
              label="From Address"
              copy-tooltip="Copy"
              save-tooltip="Save Address"
              :show-copy="detailLength"
              :show-save="false"
              :items="addresses"
              :enable-save-address="false"
              :is-valid-address="detailLength"
              :address-value="fromAddress"
              :error-messages="fromAddressMessage"
              @input="setAddress"
            />
            <mew-expand-panel
              v-if="detailLength"
              is-toggle
              has-dividers
              :panel-items="exPanelStep2"
              class="mt-4 mb-10 swap-expend OfflineDetails"
            >
              <template #panelBody1>
                <div
                  v-for="(d, key) in details"
                  :key="key"
                  class="d-flex align-center justify-space-between mb-3 px-5"
                >
                  <div v-if="d.title" class="pr-3">{{ d.title }}</div>
                  <div v-if="d.value" class="text-right">{{ d.value }}</div>
                  <mew-transform-hash v-if="d.address" :hash="d.address" />
                </div>
              </template>
            </mew-expand-panel>
            <div class="d-block d-lg-flex justify-center mt-2 text-center">
              <mew-button
                class="mx-1 mb-3"
                title="Back"
                btn-size="xlarge"
                btn-style="outline"
                @click.native="handleBack"
              />
              <mew-button
                class="mx-1 mb-3 NextButton2"
                title="Next"
                btn-size="xlarge"
                :disabled="!detailLength"
                @click.native="currentStep = 3"
              />
            </div>
            <mew-button
              v-if="detailLength"
              class="mt-2 d-flex align-center justify-center mx-auto DownloadButton"
              title="Export JSON file"
              btn-size="small"
              btn-style="transparent"
              style="max-width: 130px"
              :btn-link="fileLink"
              :download="exportFileName"
            />
          </v-sheet>
        </div>

        <div v-if="currentStep === 3">
          <v-sheet color="transparent" max-width="600px" class="mx-auto py-10">
            <v-textarea
              outlined
              label="Signature"
              class="mb-1 SignatureInput"
              :value="signature"
              :error="signatureError"
              :error-messages="signatureMessage"
              @input="checkTx"
            ></v-textarea>
            <mew-alert
              v-for="alert in sortedAlerts"
              :key="alert.key"
              class="mb-3"
              hide-close-icon
              :theme="alert.severity"
              :title="alert.title"
              :description="alert.message"
            />
            <mew-expand-panel
              v-if="!signatureError && signature !== ''"
              is-toggle
              has-dividers
              :panel-items="exPanelStep3"
              class="mt-4 mb-10 swap-expend SignatureRawDetails"
            >
              <template #panelBody1>
                <div
                  class="d-flex align-center justify-space-between mb-3 px-5"
                >
                  <v-textarea readonly auto-grow :value="rawTransaction" />
                </div>
              </template>
              <template #panelBody2>
                <div
                  v-for="(d, key) in transactionDetails"
                  :key="key"
                  class="d-flex align-center justify-space-between mb-3 pa-5"
                >
                  <div v-if="d.title" class="pr-3">{{ d.title }}</div>
                  <div
                    v-if="d.value"
                    class="text-right"
                    style="overflow-x: hidden; text-overflow: ellipsis"
                  >
                    {{ d.value }}
                  </div>
                  <mew-transform-hash v-if="d.address" :hash="d.address" />
                </div>
              </template>
            </mew-expand-panel>

            <div class="d-block d-lg-flex justify-center mt-2 text-center">
              <mew-button
                class="mx-1 mb-3"
                title="Back"
                btn-size="xlarge"
                btn-style="outline"
                @click.native="handleBack"
              />
              <mew-button
                title="Confirm & Send"
                btn-size="xlarge"
                class="mx-1 mb-3 ConfirmSendButton"
                :disabled="!validTx || error"
                @click.native="sendTx"
              />
            </div>
            <div class="d-flex justify-center">
              <input
                ref="uploadSig"
                type="file"
                style="display: none"
                accept="json"
                @change="uploadFile"
              />
              <mew-button
                class="mt-2 display--block mx-auto"
                title="Upload JSON file"
                btn-size="small"
                btn-style="transparent"
                @click.native="triggerUpload"
              />
            </div>
          </v-sheet>
        </div>
      </template>
    </mew-module>
  </div>
</template>

<script setup>
import { defineAsyncComponent, defineProps, ref, computed } from 'vue';
import { isAddress, fromWei, toHex, toBN } from 'web3-utils';
import { Transaction } from 'ethereumjs-tx';
import { BigNumber } from 'bignumber.js';
import { toChecksumAddress } from 'ethereumjs-util';
import { isEmpty } from 'lodash';

import commonGenerator from '@/core/helpers/commonGenerator';
import sanitizeHex from '@/core/helpers/sanitizeHex';

import { useGlobalStore } from '@/core/store/global';
import { useWalletStore } from '@/core/store/wallet';
import { useAddressBookStore } from '@/core/store/addressBook';

const NetworkSwitch = defineAsyncComponent(() =>
  import('@/modules/network/components/NetworkSwitch.vue')
);

// injections/use
const { network } = useGlobalStore();
const { web3, address } = useWalletStore();
const { addressBookStore } = useAddressBookStore();

// props
const props = defineProps({
  isHomePage: {
    type: Boolean,
    default: true
  }
});

// data
const dialog = ref(false);
const currentStep = ref(1);
const fromAddress = ref('');
const fromAddressMessage = ref([]);
const details = ref([]);
const exportFileName = ref('');
const signature = ref('');
const signatureError = ref(false);
const signatureMessage = ref([]);
const rawTransaction = ref('');
const transactionDetails = ref([]);
const validTx = ref(false);
const file = ref({});
const fileLink = ref('');
const alerts = ref([]);
const dialogAlert = ref('');
const txHash = ref('');
const status = ref(false);
const txLoading = ref(false);
const uploadSig = ref(null);
const title = {
  title: 'Send Offline Helper',
  description:
    'Use this tool to help you sign transactions securely on an offline computer'
};
const exPanelStep2 = [
  {
    name: 'Details'
  }
];
const exPanelStep3 = [
  {
    name: 'Raw transaction'
  },
  {
    name: 'Details'
  }
];
const stepperItems = [
  {
    step: 1,
    name: 'STEP 1. Select network'
  },
  {
    step: 2,
    name: 'STEP 2. Generate information'
  },
  {
    step: 3,
    name: 'STEP 3. Signed transaction'
  }
];

// computed
const addresses = computed(() => {
  return props.isHomePage
    ? [
        {
          address: '0xDECAF9CD2367cdbb726E904cD6397eDFcAe6068D',
          currency: 'ETH',
          nickname: 'MEW Donations',
          resolverAddr: '0xDECAF9CD2367cdbb726E904cD6397eDFcAe6068D'
        }
      ]
    : address
    ? [
        {
          address: toChecksumAddress(address),
          nickname: 'My Address',
          resolverAddr: ''
        }
      ]
    : [].concat(addressBookStore);
});

const detailLength = computed(() => {
  return details.value.length > 0;
});

const sortedAlerts = computed(() => {
  const x = alerts.value;
  return x.sort((a, b) => {
    a.severity > b.severity ? 1 : a.severity < b.severity ? -1 : 0;
  });
});

const error = computed(() => {
  return alerts.value.filter(a => a.severity === 'error').length ? true : false;
});
const getRawTransaction = computed(() => {
  let sig = signature.value;
  try {
    sig = JSON.parse(sig);
    if (!isEmpty(sig)) {
      if (sig.rawTransaction) sig = sanitizeHex(sig.rawTransaction);
    }
  } catch {
    sig = sanitizeHex(sig);
  }
  return sig;
});

// methods
const handleBack = () => {
  if (currentStep.value === 3) {
    checkTx('');
  }
  currentStep.value -= 1;
};
const clear = () => {
  fromAddress.value = '';
  rawTransaction.value = '';
  signature.value = '';
  currentStep.value = 1;
  dialogAlert.value = '';
};
const dismiss = () => {
  dialog.value = false;
  dialogAlert.value = '';
  txHash.value = '';
};
/*********************************************
 * checks if address is valid on each change
 * shows and hides accordingly to address
 *********************************************/
const setAddress = (val = '') => {
  fromAddress.value = val;
  if (isAddress(fromAddress.value)) {
    if (fromAddressMessage.value.length) fromAddressMessage.value = [];
    setDetails();
    return;
  }
  if (details.value.length > 1) setDetails([]);
  if (fromAddress.value === null || fromAddress.value === '') {
    if (fromAddressMessage.value.length) fromAddressMessage.value = [];
    return;
  }
  fromAddressMessage.value = ['Not a valid Address'];
};
/**********************************************************
 * Gets data from current network and web3 instance
 * @returns {object} data - used for exporting to json,
 * details - details to be displayed to the user
 **********************************************************/
const txData = async () => {
  const { eth } = web3;
  const chainID = await eth.getChainId();
  const fetchedGasPrice = await eth.getGasPrice();
  const gasPrice = fromWei(fetchedGasPrice, 'gwei');
  const nonce = await eth.getTransactionCount(fromAddress);
  return {
    data: {
      nonce,
      fetchedGasPrice,
      chainID
    },
    details: {
      address: fromAddress,
      nonce: nonce.toString(),
      chainID,
      gasLimit: `21000`,
      gasPrice
    }
  };
};

/*************************************************************
 * Sets details to current data or specified data from param
 * @param {array} val - optional, expecting array
 *************************************************************/
const setDetails = async val => {
  if (val) return (details.value = val);
  const { resDetails } = await txData();
  details.value = [
    {
      title: 'Sender',
      value: '',
      address: resDetails.address
    },
    {
      title: 'Nonce',
      value: resDetails.nonce
    },
    { title: 'Date', value: Date() },
    {
      title: 'Chain ID',
      value: resDetails.chainID
    },
    {
      title: 'Gas Limit',
      value: resDetails.gasLimit
    },
    {
      title: 'Gas Price',
      value: `${resDetails.gasPrice} gwei`
    }
  ];
  exportFile();
};

/************************
 * exports data to json
 ************************/
const exportFile = async () => {
  let { data } = await txData();
  data = {
    nonce: toHex(data.nonce),
    gasPrice: toHex(data.fetchedGasPrice),
    chainID: toHex(data.chainID)
  };
  const blob = new Blob([JSON.stringify(data)], { type: 'mime' });
  fileLink.value = window.URL.createObjectURL(blob);
  exportFileName.value = `generated-offline-tx-${Date.now()}.json`;
};

/*********************************************
 * checks if the signature is a valid hex
 * generates data and details
 * @param {string} val - value of signature
 *********************************************/
const checkTx = (val = '') => {
  signature.value = val;
  if (signature.value === '') {
    signatureError.value = false;
    signatureMessage.value = [];
    alerts.value = [];
    validTx.value = false;
    return;
  }
  if (signatureError.value) {
    signatureError.value = false;
    signatureMessage.value = [];
  }
  if (alerts.value.length) alerts.value = [];
  setRawTransaction();
  setRawDetails();
};

/****************************************************
 * number helper
 * @param {int,string} val - number to be evaluated
 ****************************************************/
const gtr = val => {
  return new BigNumber(val).gt(0) ? new BigNumber(val).toFixed() : '0';
};

/***********************************************************************************
 * creates data and details
 * handles errors
 * @return {object}
 * - raw: raw data
 * - details: detailed data (includes more fields)
 ***********************************************************************************/
const rawTxData = () => {
  try {
    const tx = new Transaction(getRawTransaction, {
      common: commonGenerator(network)
    });
    const txValues = tx.toJSON(true);
    const txChain = tx.getChainId();
    const txFrom = sanitizeHex(tx.getSenderAddress().toString('hex'));
    validTx.value = tx.verifySignature();
    const fee = tx.getBaseFee().toString();
    const basicDetails = {
      from: txFrom,
      nonce: gtr(txValues.nonce),
      gasPrice: gtr(txValues.gasPrice),
      gasLimit: gtr(txValues.gasLimit),
      to: txValues.to,
      value: fromWei(gtr(txValues.value), 'ether'),
      data: txValues.data
    };
    return {
      fee,
      raw: {
        ...basicDetails
      },
      details: {
        ...basicDetails,
        chainID: txChain
      }
    };
  } catch ({ message }) {
    const errors = {
      'invalid rlp: total length is larger than the data':
        'Malformed signature',
      'chain id': 'Incorrect network selected'
    };
    signatureError.value = true;
    validTx.value = false;
    const errorMsgs = Object.keys(errors);
    const foundError = errorMsgs.find(e => {
      if (!message) return false;
      return message.includes(e);
    });
    if (foundError) {
      signatureMessage.value = [errors[foundError]];
    } else {
      signatureMessage.value = ['Must be a valid transaction'];
    }
    return {};
  }
};
/**********************************************************
 * sets raw data to specified value or generated raw data
 * @param {Object[]} val - array of entries
 * @param {string} val[].title - Name of value
 * @param {string|number} val[].value - Value
 **********************************************************/
const setRawTransaction = async val => {
  if (val) return (rawTransaction.value = val);
  const { raw, fee } = rawTxData();
  if (raw) {
    rawTransaction.value = JSON.stringify(raw, null, 3);
    const { eth } = web3;
    const addressMatch =
      toChecksumAddress(raw.from) === toChecksumAddress(fromAddress);
    const balance = await eth.getBalance(raw.from);
    if (!addressMatch)
      alerts.value.push({
        name: 'addressMatch',
        severity: 'error',
        title: 'Error',
        message: 'Signer does not match selected address!'
      });
    if (BigNumber(balance).lt(fee))
      alerts.value.push({
        name: 'balance',
        severity: 'error',
        title: 'Error',
        message: "Current address can't afford this transaction"
      });
  }
};

/**********************************************************
 * sets details to specified value or generated details
 * @param {Object[]} val - array of entries
 * @param {string} val[].title - Name of value
 * @param {string|number} val[].value - Value
 **********************************************************/
const setRawDetails = val => {
  if (val) return (transactionDetails.value = val);
  const { details } = rawTxData();
  if (details)
    transactionDetails.value = [
      {
        title: 'From',
        value: '',
        address: details.from
      },
      {
        title: 'To',
        value: '',
        address: details.to
      },
      {
        title: 'Value',
        value: details.value
      },
      {
        title: 'Gas Price',
        value: details.gasPrice
      },
      {
        title: 'Gas Limit',
        value: details.gasLimit
      },
      {
        title: 'Data',
        value: details.data
      },
      {
        title: 'Chain Id',
        value: details.chainID
      }
    ];
};

/***************************************************
 * processes uploaded file and gets signature from
 * rawTransaction value
 * sets processed signature to signature
 ***************************************************/
const uploadFile = ({ target: { files } }) => {
  const reader = new FileReader();
  reader.onloadend = function ({ target: { result } }) {
    try {
      file.value = JSON.parse(result);
      if (!isEmpty(file.value)) {
        if (file.value.rawTransaction) {
          checkTx(file.value.rawTransaction);
          uploadSig.value = '';
          return;
        }
      }
      throw Error();
    } catch {
      signatureError.value = true;
      signatureMessage.value = ['Bad signature upload'];
    }
  };
  if (files[0]) reader.readAsBinaryString(files[0]);
};
const sendTx = async () => {
  const { eth } = web3;
  const actualNonce = await eth.getTransactionCount(fromAddress);
  const { raw } = await rawTxData();
  const nonce = raw.nonce;
  dialog.value = true;
  txLoading.value = true;
  if (toBN(actualNonce).gt(toBN(nonce))) {
    dialogAlert.value = 'Nonce too low!';
    txLoading.value = false;
    return;
  }
  eth
    .sendSignedTransaction(getRawTransaction)
    .once('transactionHash', hash => {
      txHash.value = hash;
      clear();
    })
    .once('receipt', receipt => {
      const { status } = receipt;
      status.value = status;
      txLoading.value = false;
    })
    .catch(({ message }) => {
      dialogAlert.value = message;
      txLoading.value = false;
    });
};

const triggerUpload = () => {
  uploadSig.value.click();
};
</script>
