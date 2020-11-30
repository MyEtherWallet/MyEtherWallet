<template>
  <div class="mew-component--access-wallet-bitbox">
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
          <h2 class="text-center mb-10">Select BitBox wallet</h2>
          <mew-super-button
            :selected="bitBoxSelected === 1"
            class="mb-4"
            btn-mode="small-right-image"
            color-theme="basic"
            title="BitBox 01"
            :right-icon="
              require('@/assets/images/icons/hardware-wallets/icon-bitbox.svg')
            "
            :right-icon-height="45"
            @click.native="bitBoxSelected = 1"
          />
          <mew-super-button
            :selected="bitBoxSelected === 2"
            btn-mode="small-right-image"
            color-theme="basic"
            title="BitBox 02"
            :right-icon="
              require('@/assets/images/icons/hardware-wallets/icon-bitbox.svg')
            "
            :right-icon-height="45"
            @click.native="bitBoxSelected = 2"
          />

          <div class="d-flex justify-center mt-8">
            <mew-button
              title="Continue"
              button-size="xlarge"
              :has-full-width="false"
              @click.native="step += 1"
            />
          </div>
        </v-sheet>

        <div v-if="step === 2" class="full-width">
          <h2 class="text-center mb-10">1. Enter your password</h2>
          <mew6-white-sheet max-width="600px" class="mx-auto pa-4 pa-sm-12">
            <div class="mb-6 font-weight-bold">Enter your Bitbox password.</div>
            <v-text-field
              label="Password"
              :type="showPassword ? 'text' : 'password'"
              placeholder="Enter keystore file password"
              outlined
              :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
              @click:append="showPassword = !showPassword"
            />
            <mew-checkbox
              class="justify-center"
              label="To access my wallet, I accept"
              :link="linkToTerms"
            />

            <div class="d-flex justify-center mt-2">
              <mew-button
                title="Access my wallet"
                button-size="xlarge"
                :has-full-width="false"
                @click.native="step += 1"
              />
            </div>
          </mew6-white-sheet>
          <page-indicator-dot class="mt-4" :items="3" :current-item="1" />
        </div>

        <div v-if="step === 2" class="full-width">
          <h2 class="text-center mb-10">2. Connect with BitBox</h2>
          <mew6-white-sheet max-width="600px" class="mx-auto pa-4 pa-sm-12">
            <div class="text-center mb-10">
              <img
                src="@/assets/images/currencies/icon-eth-blue.svg"
                alt="App"
                height="80"
              />
            </div>

            <mew-select label="App opened in BitBox" :items="apps" />
            <mew-select label="HD derivation path" :items="derivationPath" />

            <div class="d-flex justify-center mt-2">
              <mew-button
                title="Connect with BitBox"
                button-size="xlarge"
                :has-full-width="false"
                @click.native="step += 1"
              />
            </div>
          </mew6-white-sheet>
          <page-indicator-dot class="mt-4" :items="3" :current-item="2" />
        </div>

        <div v-if="step === 3" class="full-width">
          <h2 class="text-center mb-10">
            1. Match your encryption pairing code
          </h2>
          <mew6-white-sheet max-width="600px" class="mx-auto pa-4 pa-sm-12">
            <div class="mb-4 font-weight-bold">
              Please confirm the encryption pairing code matches what is shown
              on your BitBox 02.
            </div>

            <div>
              Notice: You need to enter BitBox 02 password to unlock your device
              first.
            </div>

            <v-sheet max-width="200px" class="mx-auto mt-10 text-center">
              <v-row>
                <v-col v-for="(c, key) in pairingCode" :key="key" cols="6">
                  <h4>
                    <strong class="monospace">{{ c }}</strong>
                  </h4>
                </v-col>
              </v-row>
            </v-sheet>

            <mew-checkbox
              class="justify-center"
              label="To access my wallet, I accept"
              :link="linkToTerms"
            />

            <div class="d-flex justify-center mt-2">
              <mew-button
                title="Access my wallet"
                button-size="xlarge"
                :has-full-width="false"
                @click.native="step += 1"
              />
            </div>
          </mew6-white-sheet>
          <page-indicator-dot class="mt-4" :items="3" :current-item="2" />
        </div>

        <v-sheet
          v-if="step === 4"
          color="transparent"
          max-width="700px"
          width="100%"
        >
          <h2 class="text-center mb-10">3. Confirm network & address</h2>

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
          <page-indicator-dot class="mt-4" :items="3" :current-item="3" />
        </v-sheet>
      </template>
    </mew-overlay>
  </div>
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
      step: 1,
      showPassword: false,
      linkToTerms: {
        title: 'Terms.',
        url: 'https://www.myetherwallet.com/terms-of-service'
      },
      pairingCode: ['AUNEF', 'NE237', 'ALUC3', 'A86N0'],
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
        {
          name: 'Ethereum',
          value: 'ethereum'
        }
      ],
      derivationPath: [
        {
          name: "m/44'/60'/0",
          value: "m/44'/60'/0"
        },
        {
          name: "m/44'/60'/0",
          value: "m/44'/60'/0"
        }
      ],
      bitBoxSelected: null
    };
  }
};
</script>

<style lang="scss" scoped>
.v-input--selection-controls {
  padding: 0;
  margin: 0;
}
</style>
