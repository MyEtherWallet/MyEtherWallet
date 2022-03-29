<template>
  <div>
    <v-dialog v-model="dialog" persistent max-width="500">
      <v-sheet color="white" class="pa-5">
        <h3 class="mb-5 text-center">Transction status</h3>
        <div class="greyLight pa-5 mb-2">
          <div class="font-weight-bold">Transaction Hash</div>
          <mew-transform-hash
            hash="0xf267c8145dce9092463c6582c8c6f00677e2ab626c8cfc64ea997725ab14a16c"
          />
        </div>
        <div class="greyLight pa-5">
          <div class="font-weight-bold">Transaction receipt</div>
          <mew-transform-hash
            hash="0xf267c8145dce9092463c6582c8c6f00677e2ab626c8cfc64ea997725ab14a16c"
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
        <v-radio-group
          v-model="networkSelected"
          class="pa-7 radio-group"
          @change="setNet"
        >
          <div v-for="(item, i) in networks" :key="i">
            <div class="text-uppercase font-weight-bold subtitle-1 mb-1">
              {{ item.label }}
            </div>

            <v-row no-gutters>
              <v-col
                v-for="button in item.buttons"
                :key="button.value"
                cols="12"
                md="6"
                class="mt-2"
              >
                <v-radio :label="button.name" :value="button.value"></v-radio>
              </v-col>
            </v-row>

            <div>{{ item.id }}</div>
            <v-divider v-if="networks.length != i + 1" class="my-5" />
          </div>
        </v-radio-group>
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
        <mew-address-select label="From Address" @input="setAddress" />
        <mew-expand-panel
          v-if="details.length > 1"
          is-toggle
          has-dividers
          :panel-items="exPannelStep2"
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
            @click.native="currentStep = 3"
          />
        </div>
        <mew-button
          v-if="details.length > 1"
          class="mt-2 display--block mx-auto"
          title="Export JSON file"
          btn-size="small"
          btn-style="transparent"
          :btn-link="file"
          :download="exportFileName"
        />
      </v-sheet>
    </div>

    <div v-if="currentStep === 3">
      <v-sheet color="transparent" max-width="600px" class="mx-auto py-10">
        <v-textarea outlined label="Signature" value="Value"></v-textarea>
        <mew-expand-panel
          is-toggle
          has-dividers
          :panel-items="exPannelStep3"
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
          <template #panelBody2>
            <div
              v-for="(d, key) in details"
              :key="key"
              class="d-flex align-center justify-space-between mb-3 pa-5"
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
            @click.native="currentStep = 2"
          />
          <mew-button
            title="Confirm & Send"
            btn-size="xlarge"
            class="mx-1 mb-3"
            @click.native="dialog = true"
          />
        </div>
        <mew-button
          class="mt-2 display--block mx-auto"
          title="Upload JSON file"
          btn-size="small"
          btn-style="transparent"
        />
      </v-sheet>
    </div>
  </div>
</template>

<script>
import AppBlockTitle from '@/core/components/AppBlockTitle';
import { mapActions, mapState } from 'vuex';
import { isAddress, fromWei } from 'web3-utils';
import networks from '@/utils/networks';
import { BigNumber } from 'bignumber.js';
export default {
  name: 'ModuleToolsOfflineHelper',
  components: { AppBlockTitle },
  data: () => ({
    dialog: false,
    currentStep: 1,
    fromAddress: '',
    details: [],
    exportFileName: '',
    file: {},
    networkSelected: null,
    networks: Object.values(networks)
      .flat()
      .map(network => {
        return {
          label: network.type.name,
          buttons: [{ name: network.service, value: network }]
        };
      }),
    // [
    //   ({
    //     label: 'eth',
    //     buttons: [
    //       { name: 'myetherapi.com', value: 'myetherapi' },
    //       { name: 'infura.io', value: 'infura' },
    //       { name: 'giveth.io', value: 'giveth' },
    //       { name: 'therscan.io', value: 'therscan' }
    //     ]
    //   },
    //   {
    //     label: 'rop',
    //     buttons: [
    //       { name: 'myetherapi.com', value: 'myetherapi1' },
    //       { name: 'infura.io', value: 'infura1' },
    //       { name: 'giveth.io', value: 'giveth1' },
    //       { name: 'therscan.io', value: 'therscan1' }
    //     ]
    //   },
    //   {
    //     label: 'rin',
    //     buttons: [
    //       { name: 'myetherapi.com', value: 'myetherapi2' },
    //       { name: 'infura.io', value: 'infura2' },
    //       { name: 'giveth.io', value: 'giveth2' },
    //       { name: 'therscan.io', value: 'therscan2' }
    //     ]
    //   })
    // ],
    title: {
      title: 'Send offline helper',
      description:
        'This is a recommended way to view your balance. You can only view your balance via this option.'
    },
    exPannelStep2: [
      {
        name: 'Details'
      }
    ],
    exPannelStep3: [
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
  computed: {},
  methods: {
    ...mapState('wallet', ['web3']),
    ...mapActions('global', ['setNetwork']),
    ...mapActions('wallet', ['setWeb3Instance']),
    async setAddress(val = '') {
      this.fromAddress = val;
      if (isAddress(this.fromAddress)) {
        this.setDetails();
        return;
      }
      if (this.details.length > 1) this.setDetails([]);
    },
    async setNet(val) {
      await this.setNetwork(val);
      this.networkSelected = val;
      this.setWeb3Instance();
    },
    async data() {
      const { eth } = this.web3();
      const chainID = await eth.getChainId();
      const blockNumber = await eth.getBlockNumber();
      const { gasLimit } = await eth.getBlock(blockNumber);
      const gasPrice = await eth.getGasPrice();
      const nonce = await eth.getTransactionCount(this.fromAddress);
      const netName = this.networkSelected.type.name;
      const fee = new BigNumber(fromWei(gasPrice)).times(gasLimit).toFixed();
      const cost = '$0.03';
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
          gasPrice: `${fromWei(gasPrice, 'gwei')} Gwei`,
          fee: `${fee} ${netName} (${cost})`
        }
      };
    },
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
        { title: 'Value', value: details.value },
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
        },
        { title: 'Fee', value: details.fee }
      ];
      this.exportFile();
    },
    async exportFile() {
      const { data } = await this.data();
      const blob = new Blob([JSON.stringify(data)], { type: 'mime' });
      this.file = window.URL.createObjectURL(blob);
      this.exportFileName = `generated-offline-tx-${Date.now()}.json`;
    }
    // uploadFile(e) {
    //   // const reader = new FileReader();
    //   // let { file, getTransactionDetails } = this;
    //   // reader.onloadend = function ({ target: { result,files } }) {
    //   //   file = JSON.parse(result);
    //   //   getTransactionDetails(file.rawTransaction);
    //   // };
    //   // reader.readAsBinaryString(e.target.files[0]);
    // }
  }
};
</script>

<style lang="scss" scoped>
.radio-group {
  border: 1px solid var(--v-greyMedium-base);
  border-radius: 10px;
  box-shadow: 0 10px 15px var(--v-greyLight-base) !important;
}
</style>
