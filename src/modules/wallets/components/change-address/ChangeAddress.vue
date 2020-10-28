<template>
  <mew-overlay
    :show-overlay="open"
    right-btn-text="Close"
    @closeOverlay="$emit('close')"
  >
    <template #mewOverlayBody>
      <div>
        <h2 class="text-center mb-10">1. Connect with Ledger</h2>

        <mew6-white-sheet>
          <div class="pa-8">
            <div class="mt-2 mb-9 text-center">
              <mew-icon icon-name="ETH" :img-height="100"></mew-icon>
            </div>
            <mew-select
              :items="apps"
              select-label="App opened in Ledger"
              class="mb-1"
            />
            <mew-select
              :items="path"
              select-label="HD derivation path"
              class="mb-1"
            />

            <div class="text-center">
              <mew-button title="Connect with Ledger" btn-size="xlarge" />
            </div>
          </div>
        </mew6-white-sheet>

        <pageIndicatorDot :items="2" :current-item="1" />
      </div>

      <div>
        <h2 class="text-center mb-10">2. Confirm network & address</h2>

        <v-sheet color="transparent" max-width="750px" width="100%">
          <mew-expand-panel :panel-items="panelItems">
            <template #panelBody1>
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
            </template>
            <template #panelBody2>
              <mew-table
                has-select
                has-color
                :table-headers="tableHeaders"
                :table-data="tableData"
              />
            </template>
          </mew-expand-panel>
        </v-sheet>
        <div class="text-center mt-4">
          <mew-button title="Access My Wallet" btn-size="xlarge" />
        </div>

        <pageIndicatorDot :items="2" :current-item="2" />
      </div>
    </template>
  </mew-overlay>
</template>

<script>
import pageIndicatorDot from '@/components/page-indicator-dot/PageIndicatorDot';
import dividerLine from '@/components/divider-line/DividerLine';

export default {
  components: { pageIndicatorDot, dividerLine },
  props: {
    open: { default: false, type: Boolean },
    close: {
      default: function () {
        return {};
      },
      type: Function
    }
  },
  data() {
    return {
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
      apps: [
        { name: 'Ethereum', value: 'eth' },
        { name: 'Ethereum2', value: 'eth2' },
        { name: 'Ethereum3', value: 'eth3' }
      ],
      path: [
        { name: "m/44'/60'/0'", value: '1' },
        { name: "m/44'/60'/2'", value: '2' }
      ],
      panelItems: [
        {
          name: 'Network',
          subtext: 'ETH - myetherwallet.com'
        },
        {
          name: 'Address to interact with'
        }
      ],
      tableHeaders: [
        {
          text: 'Address',
          value: 'address',
          sortable: false,
          filterable: false,
          width: '100%'
        },
        {
          text: '#Token',
          value: 'token',
          sortable: false,
          filterable: false,
          containsLink: true,
          width: '30%'
        },
        {
          text: '24H Changes',
          value: 'change',
          sortable: false,
          filterable: false,
          width: '30%'
        },
        {
          text: '',
          value: 'callToAction',
          sortable: false,
          filterable: false,
          width: '20%'
        }
      ],
      tableData: [
        {
          ethBalance: '0.0001 ETH',
          token: '21',
          tokenImg:
            'https://cdn4.iconfinder.com/data/icons/cryptocoins/227/ETH-512.png',
          address: '0xAECAF9CD2367cdbb726E904cD6397eDFcAe6068D'
        },
        {
          ethBalance: '2.23 ETH',
          token: '10',
          address: '0xDECAF9CD2367cdbb726E904cD6397eDFcAe6068D',
          change: '0.23%',
          status: '+',
          changeData: {
            x: [1, 4, 10, 4],
            y: [5, 1, 34, 43]
          }
        },
        {
          ethBalance: '0.23 ETH',
          token: '8',
          address: '0xAECFF9CD2367cdbb726E904cD6397eDFcAe6068D',
          callToAction: 'Edit'
        }
      ]
    };
  }
};
</script>
