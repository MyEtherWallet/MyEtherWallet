<template>
  <div class="mew-component--swap">
    <div class="d-block d-lg-none">
      <network mobile class="mb-4" />
      <myEthBalance mobile class="mb-4" />
    </div>

    <div class="d-flex mt-4 mt-lg-0">
      <div class="flex-grow-1">
        <mew6-white-sheet>
          <interface-wrap title="Swap">
            <div
              class="d-flex flex-column flex-lg-row justify-center align-center"
            >
              <div>
                <mew-select :items="coins" label="From" />
                <mew-input label="Amount" placeholder=" " />
              </div>
              <div class="px-6 mb-8 d-flex align-center">
                <img
                  :class="$vuetify.breakpoint.mdAndDown ? 'rotate' : ''"
                  :src="swap"
                  height="35"
                />
              </div>
              <div>
                <mew-select :items="coins" label="To" />
                <mew-input label="Amount" placeholder=" " />
              </div>
            </div>
            <mew-address-select
              class="mt-5"
              copy-tooltip="Copy"
              save-tooltip="Save"
              :enable-save-address="true"
              label="label"
              :items="addresses"
              placeholder="Please enter an address"
              success-toast="Success"
              :is-valid-address="false"
              @emitSelectedValue="getSelectedValue"
            />

            <div class="mt-5">
              <div class="mew-heading-3">Select a provider</div>
              <v-row>
                <v-col cols="12" lg="6">
                  <v-card flat color="tableHeader" class="pa-6">
                    <div class="d-flex align-center justify-space-between mb-3">
                      <img
                        :class="$vuetify.theme.dark ? 'invert' : ''"
                        :src="kyber"
                        alt="Kyber network"
                        height="35"
                      />
                      <mew-checkbox />
                    </div>
                    <div class="font-weight-medium">1 ETH = 2.4235634 XMR</div>
                    <div>0.01 ETH (From Min.)</div>
                    <div>28.77344534 ETH (Max.)</div>
                  </v-card>
                </v-col>
                <v-col cols="12" lg="6">
                  <v-card flat color="tableHeader" class="pa-6">
                    <div class="d-flex align-center justify-space-between mb-3">
                      <img
                        :class="$vuetify.theme.dark ? 'invert' : ''"
                        :src="changelly"
                        alt="Changelly"
                        height="35"
                      />
                      <mew-checkbox />
                    </div>
                    <div class="font-weight-medium">1 ETH = 2.4235634 XMR</div>
                    <div>0.01 ETH (From Min.)</div>
                    <div>28.77344534 ETH (Max.)</div>
                  </v-card>
                </v-col>
                <v-col cols="12" lg="6">
                  <v-card disabled flat color="tableHeader" class="pa-6">
                    <div class="d-flex align-center justify-space-between mb-3">
                      <img
                        :class="$vuetify.theme.dark ? 'invert' : ''"
                        :src="simplex"
                        alt="Simplex"
                        height="35"
                      />
                      <div>Not Available</div>
                    </div>
                    <div>Buy crypto with a credit card.</div>
                  </v-card>
                </v-col>
                <v-col cols="12" lg="6">
                  <v-card disabled flat color="tableHeader" class="pa-6">
                    <div class="d-flex align-center justify-space-between mb-3">
                      <img :src="bity" alt="Bity" height="35" />
                      <div>Not Available</div>
                    </div>
                    <div>Swap ETH and ERC20 tokens.</div>
                  </v-card>
                </v-col>
              </v-row>
            </div>

            <mew-expand-panel
              is-toggle
              has-dividers
              :panel-items="exPannel"
              class="mt-4 mb-10 swap-expend"
            >
              <template #panelBody1>
                <mew-input
                  label="Gas Price"
                  placeholder=" "
                  right-label="Gwei"
                />
                <mew-input
                  label="Gas Limit"
                  placeholder=" "
                  right-label="Wei"
                />
              </template>
            </mew-expand-panel>

            <div class="text-center">
              <mew-button
                title="Swap"
                :has-full-width="false"
                btn-size="xlarge"
              />
            </div>
          </interface-wrap>
        </mew6-white-sheet>
      </div>

      <div class="pa-4 d-none d-lg-block"></div>

      <div class="d-none d-lg-block">
        <network />
        <div class="pa-4"></div>
        <tx-history title="Transaction history" />
        <div class="pa-4"></div>
        <myEthBalance />
        <div class="pa-4"></div>
        <swap />
      </div>
    </div>

    <div class="d-block d-lg-none">
      <tx-history class="mt-4" title="Transaction history" mobile />
      <swap class="mt-4" mobile />
    </div>
  </div>
</template>

<script>
import Network from '@/modules/wallets/components/network/Network';
import Swap from '@/modules/wallets/components/swap/Swap';
import txHistory from '@/modules/wallets/components/transaction-history/TransactionHistory';
import myEthBalance from '@/modules/wallets/components/my-eth-balance/MyEthBalance';
import InterfaceWrap from '@/components/interface-wrap/InterfaceWrap';
import eth from '@/assets/images/currencies/icon-eth-blue.svg';
import SwapIcon from '@/assets/images/icons/icon-swap.svg';
import KyberNetwork from '@/assets/images/icons/icon-kyber-network.svg';
import Changelly from '@/assets/images/icons/icon-changelly.png';
import Simplex from '@/assets/images/icons/icon-simplex.png';
import Bity from '@/assets/images/icons/icon-bity.png';

export default {
  components: {
    network: Network,
    swap: Swap,
    'interface-wrap': InterfaceWrap,
    txHistory,
    myEthBalance
  },
  data() {
    return {
      exPannel: [
        {
          name: 'Transaction Fee',
          subtext: '$0.077',
          tooltip:
            'Transaction fee is automatically caculated. If you want to customize the Transaction fee, you can do it from here.'
        }
      ],
      swap: SwapIcon,
      kyber: KyberNetwork,
      changelly: Changelly,
      simplex: Simplex,
      bity: Bity,
      addresses: [
        {
          address: '0xDECAF9CD2367cdbb726E904cD6397eDFcAe6068D',
          currency: 'ETH',
          nickname: 'My Address',
          resolverAddr: '0xDECAF9CD2367cdbb726E904cD6397eDFcAe6068D'
        },
        {
          address: '0x43689531907482BEE7e650D18411E284A7337A66',
          currency: 'ETH',
          nickname: 'nickname',
          resolverAddr: '0xDECAF9CD2367cdbb726E904cD6397eDFcAe6068D'
        }
      ],
      coins: [
        {
          name: 'ETH',
          subtext: 'Ethereum',
          value: 'Ethereum',
          img: eth
        }
      ]
    };
  },
  methods: {
    getSelectedValue(value) {
      this.addressValue = value;
    }
  }
};
</script>

<style lang="scss" scoped>
.v-input--selection-controls {
  padding: 0;
  margin: 0;
}

.invert {
  filter: invert(100%);
}

.rotate {
  transform: rotate(90deg);
}
</style>

<style lang="scss">
.mew-component--swap {
  .swap-expend {
    .v-application .white {
      background-color: transparent !important;
    }
  }
}
</style>
