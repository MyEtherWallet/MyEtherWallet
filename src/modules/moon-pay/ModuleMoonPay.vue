<template>
  <div class="mew-component--moon-pay">
    <app-dialog :is-open="true">
      <div>aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa</div>

      <buy-eth />
      <sell-eth />
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
    return {};
  },
  methods: {}
};
</script>

<style lang="scss" scoped></style>
