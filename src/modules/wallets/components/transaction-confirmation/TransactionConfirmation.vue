<template>
  <v-sheet color="transparent" max-width="600px" class="pa-8">
    <from-to-block
      from="0x300be4b1183dca9046349e9e01b1e0c08e362964"
      to="0x02fb7f333fd493b39b79ba57b6d510c64eaa3dc0"
      class="mb-2"
    />
    <balance-block />
    <mew-expand-panel>
      <template #panelBody1 :panel-items="panelItems">
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
        title="Continue on your device"
        @click.native="activeTab = 1"
      />
    </div>
    <warning-sheet :description="warningDescription" />
  </v-sheet>
</template>

<script>
import fromToBlock from '@/components/from-to-block/FromToBlock';
import balanceBlock from '@/components/balance-block/BalanceBlock';

export default {
  components: {
    fromToBlock,
    balanceBlock
  },
  data: function () {
    return {
      warningDescription:
        'Make sure all your transaction details are CORRECT. Canceling or replacing transactions can not be guaranteed to work. You still be charged gas fee even transaction failing. Learn more here…',
      open: false,
      panelItems: [
        {
          name: 'Network',
          subtext: 'ETH - myetherapi.com'
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
