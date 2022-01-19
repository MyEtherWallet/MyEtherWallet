<template>
  <!-- ======================================================================================= -->
  <!-- Side Rewards -->
  <!-- ======================================================================================= -->
  <div
    class="mew-component--module-side-apr pa-5 border-radius--10px box-border"
  >
    <div class="d-flex align-top justify-space-between mb-1">
      <div class="d-flex align-center mt-n4">
        <div class="stake-icon mr-2">
          <img
            src="@/assets/images/icons/icon-stakewise-red.svg"
            alt="Stakewise"
          />
        </div>
        <div class="textLight--text">
          <span class="textMedium--text">Rewards</span> - RETH2
        </div>
      </div>
      <div class="text-right">
        <div class="font-weight-bold mew-heading-3 mb-1">0.34565</div>
        <div class="textLight--text">$0.09</div>
      </div>
    </div>

    <!-- ======================================================================================= -->
    <!-- not earned any rewards yet user message -->
    <!-- ======================================================================================= -->
    <div class="mt-4">
      You have not earned any rewards yet. Please wait 24 hours after staking to
      start earning rewards.
    </div>

    <!-- ======================================================================================= -->
    <!-- Active for Stake ETH -->
    <!-- ======================================================================================= -->
    <div
      v-if="compoundRewards"
      class="d-flex align-center justify-space-between mt-4"
    >
      <div class="greenPrimary--text">Redeem to ETH</div>
      <div class="greenPrimary--text cursor--pointer" @click="routeToSwap">
        Compound
      </div>
    </div>

    <!-- ======================================================================================= -->
    <!-- Active for Compound Rewards -->
    <!-- ======================================================================================= -->
    <div v-else class="d-flex align-center justify-space-between mt-4">
      <div class="greenPrimary--text">Redeem to ETH</div>
      <mew-button title="Compound" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'ModuleSideRewards',
  components: {},
  props: {
    compoundRewards: {
      type: Boolean,
      default: false
    }
  }
};
</script>

<style lang="scss" scoped>
.box-border {
  border: 1px solid var(--v-greyMedium-base);
}
.stake-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--v-greyLight-base) !important;
  border-radius: 50% !important;
  width: 32px;
  height: 32px;
  background-color: var(--v-whiteBackground-base);

  img {
    height: 28px;
  }
}
</style>
