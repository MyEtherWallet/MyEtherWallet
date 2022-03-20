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
            src="@/dapps/stakewise/assets/icon-stakewise-red.svg"
            alt="Stakewise"
          />
        </div>
        <div class="textLight--text">
          <span class="textMedium--text">Rewards</span> - RETH2
        </div>
      </div>
      <div class="text-right">
        <div class="font-weight-bold mew-heading-3 mb-1">{{ rethBalance }}</div>
        <div class="textLight--text">${{ rethUsdBalance }}</div>
      </div>
    </div>

    <!-- ======================================================================================= -->
    <!-- not earned any rewards yet user message -->
    <!-- ======================================================================================= -->
    <div v-if="hasSeth && !hasReth" class="mt-4">
      You have not earned any rewards yet. Please wait 24 hours after staking to
      start earning rewards.
    </div>

    <!-- ======================================================================================= -->
    <!-- Active for Stake ETH -->
    <!-- ======================================================================================= -->
    <div v-if="hasReth" class="d-flex align-center justify-space-between mt-4">
      <mew-button
        title="Redeem to ETH"
        btn-style="transparent"
        btn-size="small"
        class="mew-body"
        @click.native="routeToSwap"
      />
      <mew-button
        title="Compound"
        :btn-style="compoundRewards ? 'transparent' : 'background'"
        btn-size="small"
        class="mew-body"
        @click.native="routeToStakeEth"
      />
    </div>
  </div>
</template>

<script>
import { ROUTES_WALLET } from '@/core/configs/configRoutes';
import { STAKEWISE_ROUTES } from '@/dapps/stakewise/configsRoutes';
import {
  SETH2_MAINNET_CONTRACT,
  RETH2_MAINNET_CONTRACT,
  RETH2_GOERLI_CONTRACT,
  SETH2_GOERLI_CONTRACT
} from '@/dapps/stakewise/handlers/configs.js';
import _ from 'lodash';
import { mapGetters } from 'vuex';
export default {
  name: 'ModuleSideRewards',
  components: {},
  props: {
    compoundRewards: {
      type: Boolean,
      default: false
    },
    setMax: {
      type: Function,
      default: () => {}
    }
  },
  computed: {
    ...mapGetters('wallet', ['tokensList']),
    ...mapGetters('global', ['isEthNetwork']),
    seth2Contract() {
      return this.isEthNetwork ? SETH2_MAINNET_CONTRACT : SETH2_GOERLI_CONTRACT;
    },
    reth2Contract() {
      return this.isEthNetwork ? RETH2_MAINNET_CONTRACT : RETH2_GOERLI_CONTRACT;
    },
    hasSeth() {
      const token = _.find(
        this.tokensList,
        item => item.contract.toLowerCase() === this.seth2Contract.toLowerCase()
      );
      return token;
    },
    hasReth() {
      const token = _.find(
        this.tokensList,
        item => item.contract.toLowerCase() === this.reth2Contract.toLowerCase()
      );
      return token;
    },
    rethBalance() {
      return this.hasReth ? this.hasReth.balancef : '0';
    },
    rethUsdBalance() {
      return this.hasReth ? this.hasReth.usdBalancef : '0';
    }
  },
  methods: {
    routeToSwap() {
      this.$router.push({
        name: ROUTES_WALLET.SWAP.NAME,
        query: {
          fromT: {
            symbol: 'RETH2',
            contract: RETH2_MAINNET_CONTRACT,
            decimals: 18
          },
          toT: {
            symbol: 'SETH2',
            contract: SETH2_MAINNET_CONTRACT,
            decimals: 18
          },
          amount: this.rethBalance
        }
      });
    },
    routeToStakeEth() {
      if (this.$route.name === STAKEWISE_ROUTES.REWARDS.NAME) {
        this.setMax();
      }
      this.$router.push({ name: STAKEWISE_ROUTES.REWARDS.NAME });
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
