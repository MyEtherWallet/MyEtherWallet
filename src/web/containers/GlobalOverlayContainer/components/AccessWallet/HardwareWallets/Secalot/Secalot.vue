<template>
  <BaseOverlay :open="open" :close="close" close-text="Cancel">
    <OverlayTabs>
      <v-tabs v-model="activeTab" color="transparent">
        <v-tab-item>
          <OverlayTitle title="Secalot" />
          <mew6-white-sheet>
            <div class="overlay-content pa-8">
              <div class="text-center mb-8">
                <img
                  src="@/assets/images/currencies/icon-eth-blue.svg"
                  alt="Eth icon"
                  height="60"
                />
              </div>
              <div>
                <v-select
                  v-model="appSelect"
                  :items="apps"
                  item-text="label"
                  item-value="value"
                  label="App opened in Ledger"
                  outlined
                ></v-select>
                <v-select
                  v-model="derivationPathSelect"
                  :items="derivationPath"
                  item-text="label"
                  item-value="value"
                  label="HD derivation path"
                  outlined
                ></v-select>
              </div>
              <mew6-std-btn min-width="100%" @click.native="activeTab = 1">
                Connect with Ledger
              </mew6-std-btn>
            </div>
          </mew6-white-sheet>
        </v-tab-item>
        <v-tab-item>
          <OverlayTitle title="2. Confirm network & address" />
          <div class="overlay-content">
            <mew6-expantion-block-large
              title="Network"
              subtitle="ETH - myetherapi.com"
              class="mb-3"
            >
              <GroupRadioButtons :buttons="networkButtons" />
            </mew6-expantion-block-large>
            <mew6-expantion-block-large title="Address to interact with">
              <AddressTable />
            </mew6-expantion-block-large>
            <mew6-confirm-btn center>
              To access my wallet, I accept&nbsp;
              <a
                target="_blank"
                href="https://www.myetherwallet.com/terms-of-service"
              >
                Terms.
              </a>
            </mew6-confirm-btn>
            <mew6-std-btn min-width="100%" @click.native="activeTab = 0">
              Access my wallet
            </mew6-std-btn>
          </div>
        </v-tab-item>
      </v-tabs>
    </OverlayTabs>
  </BaseOverlay>
</template>

<script>
import GroupRadioButtons from '@/components/Buttons/GroupRadioButtons';
import BaseOverlay from '@/components/Overlays/BaseOverlay';
import OverlayTitle from '@/components/OverlayTitle';
import OverlayTabs from '@/components/OverlayTabs';
import AddressTable from './components/AddressTable';

export default {
  components: {
    GroupRadioButtons,
    BaseOverlay,
    OverlayTitle,
    OverlayTabs,
    AddressTable
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
      networkButtons: [
        {
          groupName: 'ETH',
          btns: [
            { label: 'myetherapi.com', value: 'eth-myetherapi' },
            { label: 'infura.io', value: 'eth-infura' },
            { label: 'giveth.io', value: 'eth-giveth' },
            { label: 'therscan.io', value: 'eth-therscan' }
          ]
        },
        {
          groupName: 'ROP',
          btns: [
            { label: 'etherscan.io', value: 'rop-etherscan' },
            { label: 'infura.io', value: 'rop-infura' },
            { label: 'giveth.io', value: 'rop-giveth' },
            { label: 'therscan.io', value: 'rop-therscan' }
          ]
        },
        {
          groupName: 'RIN',
          btns: [
            { label: 'etherscan.io', value: 'rin-etherscan' },
            { label: 'infura.io', value: 'rin-infura' },
            { label: 'giveth.io', value: 'rin-giveth' },
            { label: 'therscan.io', value: 'rin-therscan' }
          ]
        }
      ],
      appSelect: 'eth',
      derivationPathSelect: '1',
      activeTab: 0,
      apps: [
        { label: 'Ethereum', value: 'eth' },
        { label: 'SometingElse', value: 'smt' }
      ],
      derivationPath: [
        { label: `m/44'/60'/0'`, value: '1' },
        { label: `m/44'/60'/0'`, value: '2' }
      ]
    };
  }
};
</script>

<style lang="scss" scoped>
.overlay-content {
  width: 500px;
}
</style>
