<template>
  <mew-overlay
    :show-overlay="open"
    right-btn-text="Cancel"
    @closeOverlay="$emit('close')"
  >
    <template #mewOverlayBody>
      <v-sheet
        v-if="step === 1"
        color="transparent"
        max-width="400px"
        width="100%"
      >
        <h2 class="text-center mb-10">1. Connect with Ledger</h2>

        <mew6-white-sheet full-width>
          <div class="overlay-content pa-8">
            <div class="text-center mb-8">
              <img
                src="@/assets/images/currencies/icon-eth-blue.svg"
                alt="Eth icon"
                height="60"
              />
            </div>
            <div>
              <mew-select label="App opened in Ledger" :items="apps" />
              <mew-select label="HD derivation path" :items="derivationPath" />
            </div>
            <mew-button
              button-size="xlarge"
              title="Connect with Ledger"
              has-full-width
              @click.native="step = 2"
            />
          </div>
        </mew6-white-sheet>
        <page-indicator-dot class="mt-4" :items="2" :current-item="1" />
      </v-sheet>

      <v-sheet
        v-if="step === 2"
        color="transparent"
        max-width="600px"
        width="100%"
      >
        <h2 class="text-center mb-10">2. Confirm network & address</h2>

        <mew-expand-panel :panel-items="changeNetwork" class="mb-2">
          <template #panelBody1>
            <v-radio-group v-model="networkSelected">
              <div v-for="(network, i) in networks" :key="i">
                <div class="text-uppercase font-weight-bold subtitle-1 mb-1">
                  {{ network.label }}
                </div>

                <v-row no-gutters>
                  <v-col
                    v-for="button in network.buttons"
                    :key="button.value"
                    cols="12"
                    sm="6"
                    class="mt-2"
                  >
                    <v-radio
                      :label="button.name"
                      :value="button.value"
                    ></v-radio>
                  </v-col>
                </v-row>

                <div>{{ network.id }}</div>
                <divider-line v-if="networks.length != i + 1" class="my-5" />
              </div>
            </v-radio-group>
          </template>
        </mew-expand-panel>

        <mew-expand-panel :panel-items="addressToInteract">
          <template #panelBody1>
            <mew-table
              style="margin: 0 -24px"
              :table-headers="tableHeaders"
              :table-data="tableData"
              has-select
            />
            <div class="d-flex align-center justify-center mt-5">
              <div class="cursor--pointer mx-4">&lt; Previous</div>
              <div class="cursor--pointer mx-4">Next &gt;</div>
            </div>
          </template>
        </mew-expand-panel>

        <mew-checkbox
          class="mt-5 justify-center"
          label="To access my wallet, I accept"
          :link="linkToTerms"
        />

        <div class="d-flex justify-center mt-2">
          <mew-button
            title="Access my wallet"
            button-size="xlarge"
            :has-full-width="false"
            @click.native="step = 1"
          />
        </div>
        <page-indicator-dot class="mt-4" :items="2" :current-item="2" />
      </v-sheet>
    </template>
  </mew-overlay>
</template>

<script>
import pageIndicatorDot from '@/components/page-indicator-dot/PageIndicatorDot';
import dividerLine from '@/components/divider-line/DividerLine';

export default {
  components: {
    pageIndicatorDot,
    dividerLine
  },
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
      tableHeaders: [
        {
          text: 'Address',
          value: 'address',
          sortable: false,
          filterable: false,
          width: '100%'
        },
        {
          text: 'Eth Balance',
          value: 'ethBalance',
          sortable: false,
          filterable: false,
          containsLink: true,
          width: '100%'
        },
        {
          text: '#Token',
          value: 'token',
          sortable: false,
          filterable: false,
          containsLink: true,
          width: '100%'
        }
      ],
      tableData: [
        {
          address: '9834759283750173071305',
          ethBalance: '0.0001 ETH',
          token: '21'
        },
        {
          address: '9834759283750173071305ergerthtr',
          ethBalance: '2.23 ETH',
          token: '10'
        },
        {
          address: '9834759283750173071erger305',
          ethBalance: '0.23 ETH',
          token: '8'
        }
      ],
      networkSelected: null,

      changeNetwork: [
        {
          name: 'Network',
          subtext: 'ETH - myetherapi.com'
        }
      ],
      addressToInteract: [
        {
          name: 'Address to interact with'
        }
      ],
      linkToTerms: {
        title: 'Terms.',
        url: 'https://www.myetherwallet.com/terms-of-service'
      },
      step: 1,
      tabs: [
        {
          name: ''
        },
        {
          name: ''
        }
      ],
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
      apps: ['Ethereum', 'SometingElse'],
      derivationPath: [`m/44'/60'/0'`, `m/44'/60'/2'`]
    };
  }
};
</script>

<style lang="scss" scoped></style>
