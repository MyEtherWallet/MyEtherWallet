<template>
  <div class="mew-component--moon-pay">
    <app-dialog v-model="isOpen" max-width="540">
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
  props: {
    open: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      isOpen: false,
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
  watch: {
    open(newVal) {
      this.isOpen = newVal;
    },
    isOpen(newVal) {
      if (!newVal) {
        this.$emit('close', false);
      }
    }
  },
  mounted() {
    this.isOpen = this.value;
  },
  methods: {
    onTab(val) {
      this.activeTab = val;
    }
  }
};
</script>

<style lang="scss" scoped></style>
