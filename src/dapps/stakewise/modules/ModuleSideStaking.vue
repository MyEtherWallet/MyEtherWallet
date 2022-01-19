<template>
  <!-- ======================================================================================= -->
  <!-- Side Staking -->
  <!-- ======================================================================================= -->
  <div
    class="mew-component--module-side-apr pa-5 border-radius--10px box-border"
  >
    <div class="d-flex align-top justify-space-between mb-1">
      <div class="d-flex align-center mt-n4">
        <div class="stake-icon mr-2">
          <img
            src="@/assets/images/icons/icon-stakewise-green.svg"
            alt="Stakewise"
          />
        </div>
        <div class="textLight--text">
          <span class="textMedium--text">Staking</span> - SETH2
        </div>
      </div>
      <div class="text-right">
        <div class="font-weight-bold mew-heading-3 mb-1">0.5</div>
        <div class="textLight--text">$143.09</div>
      </div>
    </div>

    <!-- ======================================================================================= -->
    <!-- You are not staking user message -->
    <!-- ======================================================================================= -->
    <div class="mt-4">
      You are currently not staking any ETH. To earn rewards start staking.
      <span class="greenPrimary--text">Start staking</span>
    </div>

    <!-- ======================================================================================= -->
    <!-- Pending -->
    <!-- ======================================================================================= -->
    <div class="d-flex justify-space-between mt-4">
      <div>
        <v-progress-circular
          indeterminate
          color="greenPrimary"
          :width="2"
          :size="20"
          class="mr-1"
        />
        0.05 ETH Pending
      </div>
      <div class="greenPrimary--text font-weight-medium d-flex align-center">
        View on EthVM
        <v-icon color="greenPrimary" small class="ml-1">mdi-open-in-new</v-icon>
      </div>
    </div>

    <!-- ======================================================================================= -->
    <!-- Active for Stake ETH -->
    <!-- ======================================================================================= -->
    <div
      v-if="!compoundRewards"
      class="d-flex align-center justify-space-between mt-4"
    >
      <div class="greenPrimary--text">Redeem to ETH</div>
      <div class="greenPrimary--text cursor--pointer" @click="routeToSwap">
        Stake more ETH
      </div>
    </div>

    <!-- ======================================================================================= -->
    <!-- Active for Compound Rewards -->
    <!-- ======================================================================================= -->
    <div v-else class="d-flex align-center justify-space-between mt-4">
      <div class="greenPrimary--text">Redeem to ETH</div>
      <mew-button title="Stake more ETH" />
    </div>
  </div>
</template>

<script>
import { ROUTES_WALLET } from '@/core/configs/configRoutes';

export default {
  name: 'ModuleSideStaking',
  components: {},
  props: {
    compoundRewards: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    routeToSwap() {
      this.$router.push({ name: ROUTES_WALLET.SWAP.NAME });
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
