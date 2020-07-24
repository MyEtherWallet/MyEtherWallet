<template>
  <mew-overlay
    :show-overlay="open"
    title="1. Connect with Trezor"
    right-btn-text="Cancel"
  >
    <template v-slot:mewComponent>
      <mew-tabs :items="tabs" is-block>
        <template v-slot:tabContent0>
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
                <mew-select label="App opened in Trezor" />
                <mew-select label="HD derivation path" />
              </div>
              <mew-button
                button-size="xlarge"
                title="Connect with Trezor"
                has-full-width
                @click.native="activeTab = 1"
              />
            </div>
          </mew6-white-sheet>
        </template>
        <template v-slot:tabContent1>
          <mew6-white-sheet>
            <GroupRadioButtons :buttons="networkButtons" />
            <AddressTable />
          </mew6-white-sheet>
        </template>
      </mew-tabs>
    </template>
  </mew-overlay>
</template>

<script>
import GroupRadioButtons from '@/components/Buttons/GroupRadioButtons';
import AddressTable from './components/AddressTable';

export default {
  components: {
    GroupRadioButtons,

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
      tabs: [
        {
          name: ''
        },
        {
          name: ''
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
