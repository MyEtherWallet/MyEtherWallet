<template>
  <mew-overlay
    :show-overlay="open"
    title="1. Connect with Ledger"
    right-btn-text="Close"
  >
    <template v-slot:mewComponent>
      <mew-tabs :items="tabs" is-block>
        <template v-slot:tabContent0>
          <mew6-white-sheet>
            <div class="pa-8">
              <div class="mt-2 mb-9 text-center">
                <mew-icon icon-name="ETH" img-height="100"></mew-icon>
              </div>
              <mew-select
                :items="apps"
                select-label="Choose your coin"
                placeholder="Search..."
                class="mb-1"
              />
              <mew-select
                :items="path"
                select-label="HD derivation path"
                placeholder="Search..."
                class="mb-1"
              />

              <div class="text-center">
                <mew-button title="Connect with Ledger" button-size="xlarge" />
              </div>
            </div>
          </mew6-white-sheet>
        </template>
        <template v-slot:tabContent1>
          <AddressSelection />
          <div class="pa-8">
            <div class="text-center">
              <mew-button title="Access My Wallet" button-size="xlarge" />
            </div>
          </div>
        </template>
      </mew-tabs>
    </template>
  </mew-overlay>
</template>

<script>
import AddressSelection from './components/AddressSelection';

export default {
  components: {
    AddressSelection
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
      appSelected: '',
      apps: [
        { name: 'Ethereum', value: 'eth' },
        { name: 'Ethereum2', value: 'eth2' },
        { name: 'Ethereum3', value: 'eth3' }
      ],
      pathSelected: '',
      path: [
        { name: "m/44'/60'/0'", value: '1' },
        { name: "m/44'/60'/2'", value: '2' }
      ]
    };
  }
};
</script>
