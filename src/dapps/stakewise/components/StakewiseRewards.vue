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
          <span class="textMedium--text">Rewards</span> - rETH2
        </div>
      </div>
      <div class="text-right">
        <div class="font-weight-bold mew-heading-3 mb-1">
          {{ formattedBalance }}
        </div>
        <div v-if="ethvmSupport" class="textLight--text">
          ${{ rethBalanceFiat }}
        </div>
      </div>
    </div>

    <!-- ======================================================================================= -->
    <!-- not earned any rewards yet user message -->
    <!-- ======================================================================================= -->
    <div v-if="hasStakedNoRewards" class="mt-4">
      You have not earned any rewards yet. Please wait 24 hours after staking to
      start earning rewards.
    </div>

    <!-- ======================================================================================= -->
    <!-- Active for Stake ETH -->
    <!-- ======================================================================================= -->
    <div
      v-if="hasBalance"
      class="d-flex align-center justify-space-between flex-wrap-reverse mt-4"
    >
      <mew-button
        v-if="isEthNetwork"
        title="Redeem to ETH"
        btn-style="transparent"
        btn-size="small"
        class="mew-body"
        :disabled="!hasBalance || enoughToCoverRedeem"
        @click.native="executeSwap"
      />
      <mew-button
        title="Compound"
        :btn-style="compoundRewards ? 'transparent' : 'background'"
        btn-size="small"
        class="mew-body"
        :disabled="!hasBalance || enoughToCoverRedeem"
        @click.native="scrollToInput"
      />
    </div>

    <!-- ======================================================================================= -->
    <!-- have rewards but not enough to cover tx fee -->
    <!-- ======================================================================================= -->
    <div v-if="enoughToCoverRedeem" class="mt-4 greyPrimary--text">
      You do not have enough ETH to cover transaction fee.
    </div>
  </div>
</template>

<script>
import BigNumber from 'bignumber.js';
import { STAKEWISE_ROUTES } from '@/dapps/stakewise/configsRoutes';
import { mapGetters, mapState } from 'vuex';
import {
  formatFloatingPointValue,
  formatFiatValue
} from '@/core/helpers/numberFormatHelper';

export default {
  name: 'ModuleSideRewards',
  components: {},
  props: {
    compoundRewards: {
      type: Boolean,
      default: false
    },
    txFee: {
      type: String,
      default: ''
    },
    hasEnoughBalance: {
      type: String,
      default: ''
    }
  },
  computed: {
    ...mapGetters('wallet', ['tokensList']),
    ...mapGetters('global', ['isEthNetwork', 'network']),
    ...mapGetters('external', ['fiatValue']),
    ...mapState('wallet', ['web3', 'address', 'balance']),
    ...mapState('stakewise', ['rethBalance', 'sethBalance']),
    hasStakedNoRewards() {
      return (
        BigNumber(this.sethBalance).gt(0) && BigNumber(this.rethBalance).eq(0)
      );
    },
    hasBalance() {
      return BigNumber(this.rethBalance).gt(0);
    },
    enoughToCoverRedeem() {
      if (this.hasStakedNoRewards) {
        return false;
      }
      if (!this.hasEnoughBalance) {
        return true;
      }
      if (!this.hasBalance) {
        return false;
      }
      if (BigNumber(this.balance).gt(this.txFee)) {
        return false;
      }
      return true;
    },
    ethvmSupport() {
      return this.network.type.isEthVMSupported.supported;
    },
    formattedBalance() {
      return formatFloatingPointValue(this.rethBalance).value;
    },
    rethBalanceFiat() {
      return formatFiatValue(
        BigNumber(this.rethBalance).times(this.fiatValue).toString()
      ).value;
    }
  },
  watch: {
    $route: {
      handler: function (from) {
        if (from.query.module === 'compound') {
          this.$nextTick(() => {
            this.$emit('scroll');
            this.$emit('set-max');
          });
        }
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    executeSwap() {
      this.$emit('redeem-to-eth', 'reth', this.rethBalance);
    },
    changeRoute() {
      return new Promise(resolve => {
        resolve(
          this.$router.push({
            name: STAKEWISE_ROUTES.REWARDS.NAME,
            query: { module: 'compound' }
          })
        );
      });
    },
    scrollToInput() {
      this.$emit('scroll');
      this.changeRoute().then(() => {
        this.$nextTick(() => {
          this.$emit('set-max');
        });
      });
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
