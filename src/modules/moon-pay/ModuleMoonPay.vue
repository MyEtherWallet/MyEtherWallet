<template>
  <div class="mew-component--moon-pay">
    <app-dialog :is-open="true" max-width="540">
      <mew-tabs
        :items="tabItems"
        :active-tab="activeTab"
        class="mt-n2"
        @onTab="onTab"
      >
        <template #tabContent1>
          <buy-eth />
        </template>
        <template #tabContent2>
          <sell-eth />
        </template>
      </mew-tabs>
    </app-dialog>
  </div>
</template>

<script>
import AppDialog from '@/core/components/AppSimpleDialog';
import BuyEth from './ModuleBuyEth';
import SellEth from './ModuleSellEth';
export default {
  name: 'MoonPay',
  components: { AppDialog, BuyEth, SellEth },
  data() {
    return {
      activeTab: 0,
      tabItems: [
        {
          name: 'Buy ETH'
        },
        {
          name: 'Sell ETH'
        }
      ]
    };
  },
  methods: {
    onTab(val) {
      this.activeTab = val;
    }
  }
};
</script>

<style lang="scss" scoped></style>
