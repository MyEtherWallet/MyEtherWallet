<template>
  <mew6-white-sheet>
    <InterfaceWrap title="Swap">
      <div class="d-flex">
        <div>
          <mew-select :items="coins" label="From" />
          <mew-input label="Amount" placeholder=" " />
        </div>
        <div class="px-6 mb-8 d-flex align-center">
          <img :src="swap" height="35" />
        </div>
        <div>
          <mew-select :items="coins" label="To" />
          <mew-input label="Amount" placeholder=" " />
        </div>
      </div>
      <address-select
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
          <v-col cols="6" lg="6" sm="12">
            <v-card flat color="superPrimary" class="pa-6">
              <div class="d-flex align-center justify-space-between mb-3">
                <img :src="kyber" alt="Kyber network" height="35" />
                <v-checkbox
                  v-model="check1"
                  value="1"
                  hide-details
                ></v-checkbox>
              </div>
              <div class="font-weight-medium">1 ETH = 2.4235634 XMR</div>
              <div>0.01 ETH (From Min.)</div>
              <div>28.77344534 ETH (Max.)</div>
            </v-card>
          </v-col>
          <v-col>
            <v-card flat color="superPrimary" class="pa-6">
              <div class="d-flex align-center justify-space-between mb-3">
                <img :src="changelly" alt="Changelly" height="35" />
                <v-checkbox
                  v-model="check2"
                  value="2"
                  hide-details
                ></v-checkbox>
              </div>
              <div class="font-weight-medium">1 ETH = 2.4235634 XMR</div>
              <div>0.01 ETH (From Min.)</div>
              <div>28.77344534 ETH (Max.)</div>
            </v-card>
          </v-col>
          <v-col>
            <v-card flat color="superPrimary" class="pa-6">
              <div class="d-flex align-center justify-space-between mb-3">
                <img :src="simplex" alt="Simplex" height="35" />
                <div class="textSecondary--text">Not Available</div>
              </div>
              <div class="textSecondary--text">
                Buy crypto with a credit card.
              </div>
            </v-card>
          </v-col>
          <v-col>
            <v-card flat color="superPrimary" class="pa-6">
              <div class="d-flex align-center justify-space-between mb-3">
                <img :src="bity" alt="Bity" height="35" />
                <div class="textSecondary--text">Not Available</div>
              </div>
              <div class="textSecondary--text">Swap ETH and ERC20 tokens.</div>
            </v-card>
          </v-col>
        </v-row>
      </div>
      <mew6-expantion-block
        title="Transaction Fee"
        right-text="$0.077"
        help-text="Transaction fee is automatically caculated. If you want to customize the Transaction fee, you can do it from here."
        class="mt-3 mb-12"
      >
        <mew-input label="Gas Price" placeholder=" " right-label="Gwei" />
        <mew-input label="Gas Limit" placeholder=" " right-label="Wei" />
      </mew6-expantion-block>
      <div class="text-center">
        <mew-button title="Swap" :has-full-width="false" button-size="xlarge" />
      </div>
    </InterfaceWrap>
  </mew6-white-sheet>
</template>

<script>
import InterfaceWrap from '@/web/components/InterfaceWraps/InterfaceWrap1';
import eth from '@/assets/images/currencies/icon-eth-blue.svg';
import SwapIcon from '@/assets/images/icons/icon-swap.svg';
import KyberNetwork from '@/assets/images/icons/icon-kyber-network.svg';
import Changelly from '@/assets/images/icons/icon-changelly.png';
import Simplex from '@/assets/images/icons/icon-simplex.png';
import Bity from '@/assets/images/icons/icon-bity.png';

export default {
  components: { InterfaceWrap },
  data() {
    return {
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
      //console.log('selected value:', value);
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
</style>
