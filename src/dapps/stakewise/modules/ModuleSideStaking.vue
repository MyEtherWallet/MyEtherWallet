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
    <div class="d-flex align-center justify-space-between mt-4">
      <div class="greenPrimary--text">Redeem to ETH</div>
      <div class="greenPrimary--text cursor--pointer" @click="routeToSwap">
        Stake more ETH
      </div>
    </div>
  </div>
</template>

<script>
import { ROUTES_WALLET } from '@/core/configs/configRoutes';

export default {
  name: 'ModuleSideStaking',
  components: {},
  data() {
    return {};
  },
  computed: {},
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
