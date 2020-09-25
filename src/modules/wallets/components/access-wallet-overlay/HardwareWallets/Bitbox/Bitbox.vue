<template>
  <div class="mew-component--access-wallet-bitbox">
    <mew-overlay
      :show-overlay="open"
      right-btn-text="Cancel"
      @closeOverlay="$emit('close')"
    >
      <template v-slot:mewOverlayBody>
        <v-sheet
          v-if="step === 1"
          color="transparent"
          max-width="400px"
          width="100%"
        >
          <h2 class="text-center mb-10">Select BitBox wallet</h2>
          <mew-super-button
            class="mb-4"
            btn-mode="small-right-image"
            color-theme="basic"
            title="BitBox 01"
            :right-icon="
              require('@/assets/images/icons/hardware-wallets/icon-bitbox.svg')
            "
            :right-icon-height="45"
          />
          <mew-super-button
            btn-mode="small-right-image"
            color-theme="basic"
            title="BitBox 02"
            :right-icon="
              require('@/assets/images/icons/hardware-wallets/icon-bitbox.svg')
            "
            :right-icon-height="45"
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
            <template v-slot:panelBody1> aaaaa </template>
          </mew-expand-panel>

          <mew-expand-panel :panel-items="addressToInteract">
            <template v-slot:panelBody1>
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

export default {
  components: {
    pageIndicatorDot
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
      ]
    };
  }
};
</script>

<style lang="scss"></style>
