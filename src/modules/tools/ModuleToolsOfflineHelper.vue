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
        <mew-stepper :items="stepperItems" :on-step="currentStep"></mew-stepper>

        <h5
          v-if="$vuetify.breakpoint.mdAndDown"
          class="text-center font-weight-medium"
        >
          {{ stepperItems[currentStep - 1].name }}
        </h5>

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
              class="mt-2 display--block mx-auto DownloadButton"
              title="Export JSON file"
              btn-size="small"
              btn-style="transparent"
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
                @click.native="$refs.uploadSig.click()"
              />
            </div>
          </v-sheet>
        </div>
      </template>
    </mew-module>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex';
import { isAddress, fromWei, toHex } from 'web3-utils';
import { Transaction } from 'ethereumjs-tx';
import commonGenerator from '@/core/helpers/commonGenerator';
import sanitizeHex from '@/core/helpers/sanitizeHex';
import NetworkSwitch from '@/modules/network/components/NetworkSwitch.vue';
import { BigNumber } from 'bignumber.js';
import { toChecksumAddress } from 'ethereumjs-util';
import { isEmpty } from 'lodash';
export default {
  name: 'ModuleToolsOfflineHelper',
  components: { NetworkSwitch },
  props: {
    isHomePage: {
      type: Boolean,
      default: true
    }
  },
  data: () => ({
    dialog: false,
    currentStep: 1,
    fromAddress: '',
    fromAddressMessage: [],
    details: [],
    exportFileName: '',
    signature: '',
    signatureError: false,
    signatureMessage: [],
    rawTransaction: '',
    transactionDetails: [],
    validTx: false,
    file: {},
    fileLink: '',
    alerts: [],
    dialogAlert: '',
    txHash: '',
    status: false,
    txLoading: false,
    title: {
      title: 'Send Offline Helper',
      description:
        'Use this tool to help you sign transactions securely on an offline computer'
    },
    exPanelStep2: [
      {
        name: 'Details'
      }
    ],
    exPanelStep3: [
      {
        name: 'Raw transaction'
      },
      {
        name: 'Details'
      }
    ],
    stepperItems: [
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
    ]
  }),
  computed: {
    ...mapState('wallet', ['web3']),
    ...mapState('addressBook', ['addressBookStore']),
    ...mapState('wallet', ['address']),
    ...mapGetters('global', ['network']),
    addresses() {
      return this.isHomePage
        ? [
            {
              address: '0xDECAF9CD2367cdbb726E904cD6397eDFcAe6068D',
              currency: 'ETH',
              nickname: 'MEW Donations',
              resolverAddr: '0xDECAF9CD2367cdbb726E904cD6397eDFcAe6068D'
            }
          ]
        : this.address
        ? [
            {
              address: toChecksumAddress(this.address),
              nickname: 'My Address',
              resolverAddr: ''
            }
          ]
        : [].concat(this.addressBookStore);
    },
    detailLength() {
      return this.details.length > 0;
    },
    sortedAlerts() {
      const x = this.alerts;
      return x.sort((a, b) =>
        a.severity > b.severity ? 1 : a.severity < b.severity ? -1 : 0
      );
    },
    error() {
      return this.alerts.filter(a => a.severity === 'error').length
        ? true
        : false;
    },
    getRawTransaction() {
      let sig = this.signature;
      try {
        sig = JSON.parse(sig);
        if (!isEmpty(sig)) {
          if (sig.rawTransaction) sig = sanitizeHex(sig.rawTransaction);
        }
      } catch {
        sig = sanitizeHex(sig);
      }
      return sig;
    }
  },
  methods: {
    handleBack() {
      if (this.currentStep === 3) {
        this.checkTx('');
      }
      this.currentStep -= 1;
    },
    clear() {
      this.fromAddress = '';
      this.rawTransaction = '';
      this.signature = '';
      this.currentStep = 1;
      this.dialogAlert = '';
    },
    dismiss() {
      this.dialog = false;
      this.dialogAlert = '';
      this.txHash = '';
    },
    /*********************************************
     * checks if address is valid on each change
     * shows and hides accordingly to address
     *********************************************/
    setAddress(val = '') {
      this.fromAddress = val;
      if (isAddress(this.fromAddress)) {
        if (this.fromAddressMessage.length) this.fromAddressMessage = [];
        this.setDetails();
        return;
      }
      if (this.details.length > 1) this.setDetails([]);
      if (this.fromAddress === null || this.fromAddress === '') {
        if (this.fromAddressMessage.length) this.fromAddressMessage = [];
        return;
      }
      this.fromAddressMessage = ['Not a valid Address'];
    },
    /**********************************************************
     * Gets data from current network and web3 instance
     * @returns {object} data - used for exporting to json,
     * details - details to be displayed to the user
     **********************************************************/
    async data() {
      const { eth } = this.web3;
      const chainID = await eth.getChainId();
      const gasPrice = await eth.getGasPrice();
      const nonce = await eth.getTransactionCount(this.fromAddress);
      return {
        data: {
          nonce,
          gasPrice
        },
        details: {
          address: this.fromAddress,
          nonce: nonce.toString(),
          chainID,
          gasLimit: `21000`,
          gasPrice
        }
      };
    },

    /*************************************************************
     * Sets details to current data or specified data from param
     * @param {array} val - optional, expecting array
     *************************************************************/
    async setDetails(val) {
      if (val) return (this.details = val);
      const { details } = await this.data();
      this.details = [
        {
          title: 'Sender',
          value: '',
          address: details.address
        },
        {
          title: 'Nonce',
          value: details.nonce
        },
        { title: 'Date', value: Date() },
        {
          title: 'Chain ID',
          value: details.chainID
        },
        {
          title: 'Gas Limit',
          value: details.gasLimit
        },
        {
          title: 'Gas Price',
          value: details.gasPrice
        }
      ];
      this.exportFile();
    },

    /************************
     * exports data to json
     ************************/
    async exportFile() {
      let { data } = await this.data();
      data = {
        nonce: toHex(data.nonce),
        gasPrice: toHex(data.gasPrice)
      };
      const blob = new Blob([JSON.stringify(data)], { type: 'mime' });
      this.fileLink = window.URL.createObjectURL(blob);
      this.exportFileName = `generated-offline-tx-${Date.now()}.json`;
    },

    /*********************************************
     * checks if the signature is a valid hex
     * generates data and details
     * @param {string} val - value of signature
     *********************************************/
    checkTx(val = '') {
      this.signature = val;
      if (this.signature === '') {
        this.signatureError = false;
        this.signatureMessage = [];
        this.alerts = [];
        this.validTx = false;
        return;
      }
      if (this.signatureError) {
        this.signatureError = false;
        this.signatureMessage = [];
      }
      if (this.alerts.length) this.alerts = [];
      this.setRawTransaction();
      this.setRawDetails();
    },

    /****************************************************
     * number helper
     * @param {int,string} val - number to be evaluated
     ****************************************************/
    gtr(val) {
      return new BigNumber(val).gt(0) ? new BigNumber(val).toFixed() : '0';
    },

    /***********************************************************************************
     * creates data and details
     * handles errors
     * @return {object}
     * - raw: raw data
     * - details: detailed data (includes more fields)
     ***********************************************************************************/
    rawData() {
      try {
        const tx = new Transaction(this.getRawTransaction, {
          common: commonGenerator(this.network)
        });
        const txValues = tx.toJSON(true);
        const txChain = tx.getChainId();
        const txFrom = sanitizeHex(tx.getSenderAddress().toString('hex'));
        this.validTx = tx.verifySignature();
        const fee = tx.getBaseFee().toString();
        const basicDetails = {
          from: txFrom,
          nonce: this.gtr(txValues.nonce),
          gasPrice: fromWei(this.gtr(txValues.gasPrice)),
          gasLimit: this.gtr(txValues.gasLimit),
          to: txValues.to,
          value: fromWei(this.gtr(txValues.value), 'ether'),
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
        this.signatureError = true;
        this.validTx = false;
        const errorMsgs = Object.keys(errors);
        const foundError = errorMsgs.find(e => {
          if (!message) return false;
          return message.includes(e);
        });
        if (foundError) {
          this.signatureMessage = [errors[foundError]];
        } else {
          this.signatureMessage = ['Must be a valid transaction'];
        }
        return {};
      }
    },
    /**********************************************************
     * sets raw data to specified value or generated raw data
     * @param {Object[]} val - array of entries
     * @param {string} val[].title - Name of value
     * @param {string|number} val[].value - Value
     **********************************************************/
    async setRawTransaction(val) {
      if (val) return (this.rawTransaction = val);
      const { raw, fee } = this.rawData();
      if (raw) {
        this.rawTransaction = JSON.stringify(raw, null, 3);
        const { eth } = this.web3;
        const addressMatch =
          toChecksumAddress(raw.from) === toChecksumAddress(this.fromAddress);
        const balance = await eth.getBalance(raw.from);
        if (!addressMatch)
          this.alerts.push({
            name: 'addressMatch',
            severity: 'warning',
            title: 'Warning',
            message: 'Signer does not match selected address!'
          });
        if (BigNumber(balance).lt(fee))
          this.alerts.push({
            name: 'balance',
            severity: 'error',
            title: 'Error',
            message: "Current address can't afford this transaction"
          });
      }
    },

    /**********************************************************
     * sets details to specified value or generated details
     * @param {Object[]} val - array of entries
     * @param {string} val[].title - Name of value
     * @param {string|number} val[].value - Value
     **********************************************************/
    setRawDetails(val) {
      if (val) return (this.transactionDetails = val);
      const { details } = this.rawData();
      if (details)
        this.transactionDetails = [
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
    },

    /***************************************************
     * processes uploaded file and gets signature from
     * rawTransaction value
     * sets processed signature to signature
     ***************************************************/
    uploadFile({ target: { files } }) {
      const reader = new FileReader();
      const self = this;
      reader.onloadend = function ({ target: { result } }) {
        try {
          self.file = JSON.parse(result);
          if (!isEmpty(self.file)) {
            if (self.file.rawTransaction) {
              self.checkTx(self.file.rawTransaction);
              self.$refs.uploadSig.value = '';
              return;
            }
          }
          throw Error();
        } catch {
          self.signatureError = true;
          self.signatureMessage = ['Bad signature upload'];
        }
      };
      if (files[0]) reader.readAsBinaryString(files[0]);
    },
    sendTx() {
      const { eth } = this.web3;
      this.dialog = true;
      this.txLoading = true;
      eth
        .sendSignedTransaction(this.getRawTransaction)
        .once('transactionHash', hash => {
          this.txHash = hash;
          this.clear();
        })
        .once('receipt', receipt => {
          const { status } = receipt;
          this.status = status;
          this.txLoading = false;
        })
        .catch(({ message }) => {
          this.dialogAlert = message;
          this.txLoading = false;
        });
    }
  }
};
</script>
