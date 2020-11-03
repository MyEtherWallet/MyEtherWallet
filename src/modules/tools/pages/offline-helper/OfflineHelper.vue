<template>
  <div>
    <block-title max-width="600px" no-page-title :data="title" class="mb-7" />

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
        <border-block
          md-shadow
          md-border-radius
          class="px-7"
          max-height="300px"
        >
          <v-radio-group v-model="networkSelected">
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
              <divider-line v-if="networks.length != i + 1" class="my-5" />
            </div>
          </v-radio-group>
        </border-block>
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
        <mew-address-select label="From Address" />
        <mew-expand-panel
          is-toggle
          has-dividers
          :panel-items="exPannelStep2"
          class="mt-4 mb-10 swap-expend"
        >
          <template #panelBody1>
            <div
              v-for="(d, key) in details"
              :key="key"
              class="d-flex align-center justify-space-between mb-3"
            >
              <div v-if="d.title" class="pr-3">{{ d.title }}</div>
              <div v-if="d.value" class="text-right">{{ d.value }}</div>
              <ellipsis-block v-if="d.address" :text="d.address" />
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
          class="mt-2 display--block mx-auto"
          title="Export JSON file"
          btn-size="small"
          btn-style="transparent"
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
              class="d-flex align-center justify-space-between mb-3"
            >
              <div v-if="d.title" class="pr-3">{{ d.title }}</div>
              <div v-if="d.value" class="text-right">{{ d.value }}</div>
              <ellipsis-block v-if="d.address" :text="d.address" />
            </div>
          </template>
          <template #panelBody2>
            <div
              v-for="(d, key) in details"
              :key="key"
              class="d-flex align-center justify-space-between mb-3"
            >
              <div v-if="d.title" class="pr-3">{{ d.title }}</div>
              <div v-if="d.value" class="text-right">{{ d.value }}</div>
              <ellipsis-block v-if="d.address" :text="d.address" />
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
import ellipsisBlock from '@/components/ellipsisBlock/EllipsisBlock';
import blockTitle from '@/components/block-title/BlockTitle';
import borderBlock from '@/components/border-block/BorderBlock.vue';
import dividerLine from '@/components/divider-line/DividerLine';

export default {
  components: { ellipsisBlock, blockTitle, borderBlock, dividerLine },
  data: () => ({
    currentStep: 3,
    details: [
      {
        title: 'Sender',
        value: '',
        address: '0x1208D377499bd32c1b995cAEEcA0BE297c242926'
      },
      {
        title: 'Receiver',
        value: '',
        address: '0x1208D377499bd32c1b995cAEEcA0BE297c242926'
      },
      { title: 'Nonce', value: '0' },
      { title: 'Value', value: '1 ETH' },
      { title: 'Date', value: 'Ox' },
      {
        title: 'Chain ID',
        value: '1(Ethereum)'
      },
      { title: 'Gas Limit', value: '3000' },
      { title: 'Gas Price', value: '5 Gwei' },
      { title: 'Fee', value: '0.001 ETH ($0.03)' }
    ],
    networkSelected: null,
    networks: [
      {
        label: 'eth',
        buttons: [
          { name: 'myetherapi.com', value: 'myetherapi' },
          { name: 'infura.io', value: 'infura' },
          { name: 'giveth.io', value: 'giveth' },
          { name: 'therscan.io', value: 'therscan' }
        ]
      },
      {
        label: 'rop',
        buttons: [
          { name: 'myetherapi.com', value: 'myetherapi1' },
          { name: 'infura.io', value: 'infura1' },
          { name: 'giveth.io', value: 'giveth1' },
          { name: 'therscan.io', value: 'therscan1' }
        ]
      },
      {
        label: 'rin',
        buttons: [
          { name: 'myetherapi.com', value: 'myetherapi2' },
          { name: 'infura.io', value: 'infura2' },
          { name: 'giveth.io', value: 'giveth2' },
          { name: 'therscan.io', value: 'therscan2' }
        ]
      }
    ],
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
  })
};
</script>

<style lang="scss" scoped></style>
