<template>
  <!-- ======================================================================================= -->
  <!-- Side APR -->
  <!-- ======================================================================================= -->
  <div
    class="mew-component--module-side-apr bgWalletBlockDark pa-5 border-radius--10px"
  >
    <div class="d-flex align-center justify-space-between mb-1">
      <div class="text-uppercase mew-header-4 font-weight-medium">
        Coinbase Staking Summary
      </div>
    </div>
    <div class="d-flex align-center justify-space-between pt-2">
      <div class="textLight--text text-uppercase mew-label font-weight-medium">
        Total shares:
      </div>
      <div>1 MEWcbETH (0.85 {{ currencyName }})</div>
    </div>
    <div class="d-flex align-center justify-space-between pt-2">
      <div class="textLight--text text-uppercase mew-label font-weight-medium">
        Total Exitable {{ currencyName }}:
      </div>
      <div>0.85 {{ currencyName }}</div>
    </div>
    <div class="d-flex align-center justify-space-between pt-2">
      <div class="textLight--text text-uppercase mew-label font-weight-medium">
        Claimable Shares:
      </div>
      <div>0.85 {{ currencyName }}</div>
    </div>
    <div class="d-flex align-center justify-space-between pt-3">
      <mew-button title="Claim now" has-full-width btn-size="mediume" />
    </div>
    <div class="d-flex align-center justify-space-between pt-4">
      <div class="textLight--text text-uppercase mew-label font-weight-medium">
        Conversion refreshes in:
      </div>
      <div>1 hour 5 mins</div>
    </div>
    <div class="d-flex align-center justify-space-between">
      <div class="greenPrimary--text mew-label font-weight-medium">
        (Refreshes daily at 1PM UTC)
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'CoinbaseStakingSummary',
  computed: {
    ...mapGetters('global', ['network']),
    currencyName() {
      return this.network.type.currencyName;
    }
  }
};
</script>

<style lang="scss" scoped></style>
