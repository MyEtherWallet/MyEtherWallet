<template>
  <div class="mew-component--side-info-tx-history">
    <mew6-white-sheet :sideinfo="!mobile" class="px-7 py-5">
      <div class="d-flex align-center justify-space-between">
        <div class="mew-heading-2">Transaction history</div>
        <div class="primary--text font-weight--500">EthVM</div>
      </div>

      <div class="mt-5">
        <txBlock address="0x68dcd0743ea5dea3f03c6e49bbfb1eb72ab050a3" />
      </div>
    </mew6-white-sheet>
  </div>
</template>

<script>
import txBlock from './component/tx-block/TxBlock';

export default {
  components: { txBlock },
  props: {
    mobile: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {};
  }
};
</script>

<style lang="scss"></style>
