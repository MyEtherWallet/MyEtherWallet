<template>
  <v-sheet color="transparent" max-width="600px" class="pa-3 pa-lg-8">
    <div class="mb-4 text-center">
      <h2 class="font-weight-bold error--text">09:25</h2>
      <div class="text-uppercase searchText--text font-weight-bold">
        Time remaining
      </div>
    </div>

    <swap-from-to-block from="0.05" to="0.234" class="mb-2" />

    <mew-address-select class="mt-10" label="Receiving Address" />

    <mew-expand-panel :panel-items="panelItems" has-dividers is-toggle>
      <template #panelBody1>
        <div class="px-3">
          <div class="d-flex justify-space-between mb-2">
            <div>Network</div>
            <div>ETH by myetherwallet.com</div>
          </div>
          <div class="d-flex justify-space-between mb-2">
            <div>Gas Price</div>
            <div>40 <span class="primary--text">GWEI</span></div>
          </div>
          <div class="d-flex justify-space-between mb-2">
            <div>Gas Limit</div>
            <div>21000 <span class="primary--text">WEI</span></div>
          </div>
          <div class="d-flex justify-space-between mb-2">
            <div>Nonce</div>
            <div>17</div>
          </div>
          <div class="d-flex justify-space-between">
            <div>Data</div>
            <div>0x</div>
          </div>
        </div>
      </template>
    </mew-expand-panel>
    <div class="d-flex justify-center my-8">
      <mew-button
        btn-size="xlarge"
        title="Confirm & Swap"
        @click.native="activeTab = 1"
      />
    </div>
    <mew-warning-sheet :description="warningDescription" class="mx-2" />
  </v-sheet>
</template>

<script>
import swapFromToBlock from '@/components/from-to-block/SwapFromToBlock';

export default {
  components: {
    swapFromToBlock
  },
  data: function () {
    return {
      warningDescription:
        'Make sure all your transaction details are CORRECT. Canceling or replacing transactions can not be guaranteed to work. You still be charged gas fee even transaction failing. Learn more here…',
      open: false,
      panelItems: [
        {
          name: 'Details'
        }
      ],
      activeTab: 0
    };
  },
  methods: {
    close: () => {}
  }
};
</script>

<style lang="scss">
.v-application .warning {
  border-radius: 10px;
}
</style>
