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
            src="@/dapps/stakewise/assets/icon-stakewise-green.svg"
            alt="Stakewise"
          />
        </div>
        <div class="textLight--text">
          <span class="textMedium--text">Staking</span> - SETH2
        </div>
      </div>
      <div class="text-right">
        <div class="font-weight-bold mew-heading-3 mb-1">{{ sethBalance }}</div>
        <div class="textLight--text">${{ sethUsdBalance }}</div>
      </div>
    </div>

    <!-- ======================================================================================= -->
    <!-- You are not staking user message -->
    <!-- ======================================================================================= -->
    <div v-if="!hasStaked" class="mt-4">
      You are currently not staking any ETH. To earn rewards start staking.
      <span class="greenPrimary--text cursor--pointer" @click="() => {}"
        >Start staking</span
      >
    </div>

    <!-- ======================================================================================= -->
    <!-- Pending -->
    <!-- ======================================================================================= -->
    <div v-if="hasPending" class="d-flex justify-space-between mt-4">
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
      v-if="hasStaked"
      class="d-flex align-center justify-space-between mt-4"
    >
      <mew-button
        title="Redeem to ETH"
        btn-style="transparent"
        btn-size="small"
        class="mew-body"
        @click.native="routeToSwap"
      />
      <mew-button
        title="Stake more ETH"
        :btn-style="compoundRewards ? 'background' : 'transparent'"
        btn-size="small"
        class="mew-body"
        @click.native="routeToSwap"
      />
    </div>
  </div>
</template>

<script>
import { ROUTES_WALLET } from '@/core/configs/configRoutes';
import { SETH2_CONTRACT } from '@/dapps/stakewise/handlers/configs.js';
import _ from 'lodash';
import { mapGetters, mapState } from 'vuex';
export default {
  name: 'ModuleSideStaking',
  components: {},
  props: {
    compoundRewards: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    ...mapGetters('wallet', ['tokensList']),
    ...mapState('stakewise', ['stakewiseTxs']),
    hasPending() {
      return this.stakewiseTxs.length > 0;
    },
    hasStaked() {
      const exists = _.find(
        this.tokensList,
        item => item.contract.toLowerCase() === SETH2_CONTRACT.toLowerCase()
      );
      return exists;
    },
    sethBalance() {
      return this.hasStaked ? this.hasStaked.balancef : '0';
    },
    sethUsdBalance() {
      return this.hasStaked ? this.hasStaked.usdBalancef : '0';
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
