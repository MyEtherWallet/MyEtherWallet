<template>
  <div>
    <v-dialog v-model="dialog" persistent max-width="500">
      <v-sheet color="white" class="pa-5">
        <h3 class="mb-5 text-center">Transaction status</h3>
        <div v-if="txHash" class="greyLight pa-5 mb-2">
          <div class="font-weight-bold">Transaction Hash</div>
          <mew-transform-hash :hash="txHash" />
        </div>
        <div v-if="txReceipt" class="greyLight pa-5">
          <div class="font-weight-bold">Transaction receipt</div>
          <mew-transform-hash :hash="txReceipt" />
        </div>
        <div class="pa-5">
          <v-progress-linear
            v-if="txLoading"
            indeterminate
            rounded
            height="6"
          />
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
            title="Okay"
            btn-size="xlarge"
            @click.native="dialog = false"
          />
        </div>
      </v-sheet>
    </v-dialog>

    <app-block-title
      max-width="600px"
      no-page-title
      :data="title"
      class="mb-7"
    />

    <mew-stepper
      class="mx-n12 mx-sm-0"
      :items="stepperItems"
      :on-step="currentStep"
    ></mew-stepper>

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
        class="mx-auto display--block"
        @click.native="currentStep = 2"
      />
    </div>

    <div v-if="currentStep === 2">
      <v-sheet color="transparent" max-width="600px" class="mx-auto py-10">
        <mew-address-select
          label="From Address"
          :address-value="fromAddress"
          :error-messages="fromAddressMessage"
          @input="setAddress"
        />
        <mew-expand-panel
          v-if="detailLength"
          is-toggle
          has-dividers
          :panel-items="exPanelStep2"
          class="mt-4 mb-10 swap-expend"
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
            @click.native="currentStep = 1"
          />
          <mew-button
            class="mx-1 mb-3"
            title="Next"
            btn-size="xlarge"
            :disabled="!detailLength"
            @click.native="currentStep = 3"
          />
        </div>
        <mew-button
          v-if="detailLength"
          class="mt-2 display--block mx-auto"
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
          :value="signature"
          :error="signatureError"
          :error-messages="signatureMessage"
          @input="checkTx"
        ></v-textarea>
        <mew-alert
          v-if="!addressMatch"
          hide-close-icon
          theme="warning"
          title="Warning"
          :description="alert"
        />
        <mew-expand-panel
          v-if="!signatureError && signature !== ''"
          is-toggle
          has-dividers
          :panel-items="exPanelStep3"
          class="mt-4 mb-10 swap-expend"
        >
          <template #panelBody1>
            <div class="d-flex align-center justify-space-between mb-3 px-5">
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
            @click.native="currentStep = 2"
          />
          <mew-button
            title="Confirm & Send"
            btn-size="xlarge"
            class="mx-1 mb-3"
            :disabled="!validTx"
            @click.native="sendTx"
          />
        </div>
        <mew-button
          class="mt-2 display--block mx-auto"
          title="Upload JSON file"
          btn-size="small"
          btn-style="transparent"
          type="file"
          @change="uploadFile"
        />
        <div class="d-flex justify-center">
          <input
            ref="uploadSig"
            type="file"
            style="display: none"
            accept="json"
            @change="uploadFile"
          />
          <mew-button
            btn-style="transparent"
            title="upload"
            @click.native="$refs.uploadSig.click()"
          />
        </div>
      </v-sheet>
    </div>
  </div>
</template>

<script>
import AppBlockTitle from '@/core/components/AppBlockTitle';
import { mapGetters, mapState } from 'vuex';
import { isAddress, fromWei, isHex } from 'web3-utils';
import { Transaction } from 'ethereumjs-tx';
import commonGenerator from '@/core/helpers/commonGenerator';
import sanitizeHex from '@/core/helpers/sanitizeHex';
import NetworkSwitch from '@/modules/network/components/NetworkSwitch.vue';
import { BigNumber } from 'bignumber.js';
import { toChecksumAddress } from 'ethereumjs-util';
export default {
  name: 'ModuleToolsOfflineHelper',
  components: { AppBlockTitle, NetworkSwitch },
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
    alert: 'Signer does not match selected address!',
    dialogAlert: '',
    txHash: '',
    txReceipt: '',
    txLoading: false,
    title: {
      title: 'Send offline helper',
      description:
        'This is a recommended way to view your balance. You can only view your balance via this option.'
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
    detailLength() {
      return this.details.length > 0;
    },
    addressMatch() {
      if (this.validTx) {
        const { raw } = this.rawData();
        return (
          toChecksumAddress(raw.from) === toChecksumAddress(this.fromAddress)
        );
      }
      return true;
    }
  },
  methods: {
    ...mapState('wallet', ['web3']),
    ...mapGetters('global', ['network']),

    /*********************************************
     * checks if address is valid on each change
     * shows and hides accordingly to address
     *********************************************/
    setAddress(val = '') {
      this.fromAddress = val;
      if (isAddress(this.fromAddress)) {
        if (this.fromAddressMessage.length > 0) this.fromAddressMessage = [];
        this.setDetails();
        return;
      }
      if (this.details.length > 1) this.setDetails([]);
      this.fromAddressMessage = ['Not a valid Address'];
    },

    /**********************************************************
     * Gets data from current network and web3 instance
     * @returns {object} data - used for exporting to json,
     * details - details to be displayed to the user
     **********************************************************/
    async data() {
      const { eth } = this.web3();
      const chainID = await eth.getChainId();
      const blockNumber = await eth.getBlockNumber();
      const { gasLimit } = await eth.getBlock(blockNumber);
      const gasPrice = await eth.getGasPrice();
      const nonce = await eth.getTransactionCount(this.fromAddress);
      const netName = this.network().type.name;
      return {
        data: {
          address: this.fromAddress,
          gasPrice,
          nonce,
          chainID,
          timestamp: Date.now()
        },
        details: {
          address: this.fromAddress,
          nonce: nonce.toString(),
          value: `1 ${netName}`,
          chainID,
          gasLimit,
          gasPrice: `${fromWei(gasPrice, 'gwei')} Gwei`
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
      const { data } = await this.data();
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
      if (isHex(this.signature)) this.signature = sanitizeHex(this.signature);
      else {
        this.signatureError = true;
        this.signatureMessage = ['Must be a valid transaction'];
        this.validTx = false;
        return;
      }
      if (this.signatureError) {
        this.signatureError = false;
        this.signatureMessage = [];
      }
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
        const tx = new Transaction(this.signature, {
          common: commonGenerator(this.network())
        });
        const txValues = tx.toJSON(true);
        const txChain = tx.getChainId();
        const txFrom = sanitizeHex(tx.getSenderAddress().toString('hex'));

        this.validTx = tx.verifySignature();
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
          raw: {
            ...basicDetails
          },
          details: {
            ...basicDetails,
            chainID: txChain
          }
        };
      } catch ({ message }) {
        const remainder = 'invalid remainder';
        const rlp = 'invalid rlp: total length is larger than the data';
        this.signatureError = true;
        this.validTx = false;
        switch (message) {
          case remainder:
            this.signatureMessage = ['Must be a valid transaction'];
            break;
          case rlp:
            this.signatureMessage = ['Malformed signature'];
            break;
          default:
            this.signatureMessage = ['Must be a valid transaction'];
            console.log(message);
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
    setRawTransaction(val) {
      if (val) return (this.rawTransaction = val);
      const { raw } = this.rawData();
      if (raw) this.rawTransaction = JSON.stringify(raw, null, 3);
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
        self.file = JSON.parse(result);
        if (self.file.rawTransaction)
          return (self.signature = self.file.rawTransaction);
        self.signatureError = true;
        self.signatureMessage = ['Bad signature upload'];
      };
      if (files[0]) reader.readAsBinaryString(files[0]);
    },
    sendTx() {
      if (this.signature && !this.signatureError) {
        const { eth } = this.web3();
        this.dialog = true;
        this.txLoading = true;
        eth
          .sendSignedTransaction(this.signature)
          .once('transactionHash', hash => {
            this.txHash = hash;
          })
          .then(receipt => {
            this.txReceipt = receipt;
          })
          .catch(({ message }) => {
            this.dialogAlert = message;
          });
        this.txLoading = false;
      }
    }
  }
};
</script>
