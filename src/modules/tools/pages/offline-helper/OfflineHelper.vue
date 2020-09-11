<template>
  <div>
    <block-title max-width="600px" no-page-title :data="title" class="mb-7" />

    <mew-stepper :items="items" :on-step="3">
      <template v-slot:outsideStepContent1>
        <v-sheet color="transparent" max-width="600px" class="mx-auto py-10">
          <bordered-white-sheet class="px-7">
            <v-radio-group v-model="networkSelected">
              <div v-for="(item, i) in networks" :key="i">
                <div class="text-uppercase font-weight-bold subtitle-1 mb-1">
                  {{ item.label }}
                </div>

                <v-row no-gutters>
                  <v-col
                    v-for="button in item.buttons"
                    :key="button.value"
                    cols="6"
                    class="mt-2"
                  >
                    <v-radio
                      :label="button.name"
                      :value="button.value"
                    ></v-radio>
                  </v-col>
                </v-row>

                <div>{{ item.id }}</div>
                <divider-line v-if="networks.length != i + 1" class="my-5" />
              </div>
            </v-radio-group>
          </bordered-white-sheet>
        </v-sheet>
        <mew-button
          button-size="xlarge"
          title="Change"
          class="mx-auto display--block"
        />
      </template>

      <template v-slot:outsideStepContent2>
        <v-sheet color="transparent" max-width="600px" class="mx-auto py-10">
          <address-select label="From Address" />
          <div class="d-flex justify-center mt-2">
            <mew-button
              class="mr-3"
              title="Back"
              button-size="xlarge"
              btn-style="outline"
            />
            <mew-button title="Next" button-size="xlarge" />
          </div>
          <mew-button
            class="mt-5 display--block mx-auto"
            title="Export JSON file"
            button-size="small"
            btn-style="transparent"
          />
        </v-sheet>
      </template>

      <template v-slot:outsideStepContent3>
        <v-sheet color="transparent" max-width="600px" class="mx-auto py-10">
          <v-textarea outlined label="Signature" value="Value"></v-textarea>
          <mew-expand-panel
            is-toggle
            has-dividers
            :panel-items="exPannel1"
            class="mt-4 mb-10 swap-expend"
          >
            <template v-slot:panelBody1 style="margin-bottom: -1px !important">
              1
            </template>
            <template v-slot:panelBody2>
              <div
                v-for="(d, key) in details"
                :key="key"
                class="d-flex align-center justify-space-between mb-3"
              >
                <div>{{ d.title }}</div>
                <div>{{ d.value }}</div>
              </div>
            </template>
          </mew-expand-panel>
        </v-sheet>
      </template>
    </mew-stepper>
  </div>
</template>

<script>
import blockTitle from '@/components/block-title/BlockTitle';
import borderedWhiteSheet from '@/components/bordered-white-sheet/BorderedWhiteSheet';
import dividerLine from '@/components/divider-line/DividerLine';

export default {
  components: { blockTitle, borderedWhiteSheet, dividerLine },
  data: () => ({
    details: [
      { title: 'Sender', value: '0x1208D377499bd32c1b995cAEEcA0BE297c242926' },
      {
        title: 'Receiver',
        value: '0x1208D377499bd32c1b995cAEEcA0BE297c242926'
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
    exPannel1: [
      {
        name: 'Raw transaction'
      },
      {
        name: 'Details'
      }
    ],
    items: [
      {
        step: 1,
        name: 'STEP 1. Create password'
      },
      {
        step: 2,
        name: 'STEP 2. Download keystore file'
      },
      {
        step: 3,
        name: 'STEP 3. Well done'
      }
    ]
  })
};
</script>

<style lang="scss" scoped></style>
