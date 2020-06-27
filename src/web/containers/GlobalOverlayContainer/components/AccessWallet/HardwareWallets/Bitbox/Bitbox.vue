<template>
  <BaseOverlay :open="open" :close="close" close-text="Cancel">
    <OverlayTabs>
      <v-tabs v-model="activeTab" color="transparent">
        <v-tab-item>
          <OverlayTitle title="Select BitBox wallet" />
          <v-sheet color="transparent" max-width="850px" class="mx-auto px-5">
            <v-row>
              <v-col v-for="(btn, key) in buttons" :key="key" cols="12" sm="12">
                <TextIconButton
                  :label="btn.label"
                  :icon="btn.icon"
                  @click.native="activeTab = 1"
                />
              </v-col>
            </v-row>
          </v-sheet>
        </v-tab-item>
        <v-tab-item>
          <OverlayTitle title="1. Enter your password" />
          <mew6-white-sheet>
            <div class="overlay-content pa-8 text-center">
              <div class="font-weight-bold mb-8">
                Please enter the passwordof your BitBox device.
              </div>
              <div class="password-field mx-auto">
                <mew6-password-field />
              </div>
              <mew6-confirm-btn center class="mt-2">
                I agree MEW browser extention user
                <a target="_blank" href="https://myetherwallet.com"> Terms</a>.
              </mew6-confirm-btn>
              <mew6-std-btn min-width="100%" @click.native="activeTab = 2">
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
import TextIconButton from '@/web/components/Buttons/TextIconButton';
import GroupRadioButtons from '@/components/Buttons/GroupRadioButtons';
import BaseOverlay from '@/components/Overlays/BaseOverlay';
import OverlayTitle from '@/components/OverlayTitle';
import OverlayTabs from '@/components/OverlayTabs';
import AddressTable from './components/AddressTable';

export default {
  components: {
    TextIconButton,
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
      buttons: [
        {
          label: 'Bitbox 01',
          icon: require('@/assets/images/icons/hardware-wallets/icon-bitbox.svg')
        },
        {
          label: 'Bitbox 02',
          icon: require('@/assets/images/icons/hardware-wallets/icon-bitbox.svg')
        }
      ],
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

.password-field {
  max-width: 350px;
}
</style>
