<template>
  <mew-overlay
    :show-overlay="open"
    title="1. Connect with Finney"
    right-btn-text="Cancel"
  >
    <template v-slot:mewComponent>
      <mew-tabs :items="tabs">
        <template v-slot:tabContent0>
          <div>
            <OverlayTitle title="Select BitBox wallet" />
            <v-sheet color="transparent" max-width="850px" class="mx-auto px-5">
              <v-row>
                <v-col
                  v-for="(btn, key) in buttons"
                  :key="key"
                  cols="12"
                  sm="12"
                >
                  <mew-super-button
                    right-icon-type="img"
                    :right-icon="btn.icon"
                    :title="btn.label"
                  />
                </v-col>
              </v-row>
            </v-sheet>
          </div>
        </template>
        <template v-slot:tabContent1>
          <div>
            <OverlayTitle title="1. Enter your password" />
            <mew6-white-sheet>
              <div class="overlay-content pa-8 text-center">
                <div class="font-weight-bold mb-8">
                  Please enter the passwordof your BitBox device.
                </div>

                <mew-input />

                <mew-checkbox
                  label="To access my wallet, I accept Terms."
                  :link="link"
                />
                <mew-button
                  button-size="xlarge"
                  has-full-width
                  title="Connect with Ledger"
                  @click.native="activeTab = 2"
                />
              </div>
            </mew6-white-sheet>
          </div>
        </template>
        <template v-slot:tabContent2>
          <div>
            <OverlayTitle title="2. Confirm network & address" />
            <div class="overlay-content">
              <mew-expand-panel :panel-items="panelItems">
                <template v-slot:panelBody0>
                  <GroupRadioButtons :buttons="networkButtons" />
                </template>
              </mew-expand-panel>

              <mew-expand-panel :panel-items="panelItems">
                <template v-slot:panelBody1>
                  <AddressTable />
                </template>
              </mew-expand-panel>

              <mew-checkbox
                label="To access my wallet, I accept Terms."
                :link="link"
              />

              <mew-button
                button-size="xlarge"
                has-full-width
                title="Access my wallet"
                @click.native="activeTab = 0"
              />
            </div>
          </div>
        </template>
      </mew-tabs>
    </template>
  </mew-overlay>
</template>

<script>
import GroupRadioButtons from '@/components/Buttons/GroupRadioButtons';
import OverlayTitle from '@/components/OverlayTitle';
import AddressTable from './components/AddressTable';

export default {
  components: {
    GroupRadioButtons,
    OverlayTitle,
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
      link: {
        title: 'Terms',
        url: 'https://www.myetherwallet.com/terms-of-service'
      },
      panelItems: [
        {
          name: 'Network',
          subtext: 'ETH - myetherapi.com'
        },
        {
          name: 'Address to interact with',
          subtext: '',
          tooltip: 'Tooltip'
        }
      ],
      tabs: [
        {
          name: ''
        },
        {
          name: ''
        },
        {
          name: ''
        }
      ],
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
</style>
