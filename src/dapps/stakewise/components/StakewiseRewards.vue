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
        <div class="textLight--text">${{ rethBalanceFiat }}</div>
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
    <div
      v-if="hasReth"
      class="d-flex align-center justify-space-between flex-wrap-reverse mt-4"
    >
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
        @click.native="scrollToInput"
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
import rEthAbi from '@/dapps/stakewise/handlers/abi/rewardEthToken';
import {
  formatFloatingPointValue,
  formatFiatValue
} from '@/core/helpers/numberFormatHelper';
import BigNumber from 'bignumber.js';
import { fromWei } from 'web3-utils';
import _ from 'lodash';
import { mapGetters, mapState } from 'vuex';
export default {
  name: 'ModuleSideRewards',
  components: {},
  props: {
    compoundRewards: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      rethBalance: '0',
      rethBalanceFiat: '0'
    };
  },
  computed: {
    ...mapGetters('wallet', ['tokensList']),
    ...mapGetters('global', ['isEthNetwork']),
    ...mapState('wallet', ['web3', 'address']),
    ...mapGetters('external', ['fiatValue']),
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
    },
    address() {
      this.fetchBalance();
    }
  },
  mounted() {
    this.fetchBalance();
  },
  methods: {
    routeToSwap() {
      this.$router.push({
        name: ROUTES_WALLET.SWAP.NAME,
        query: {
          fromToken: this.reth2Contract,
          toToken: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
          amount: this.rethBalance
        }
      });
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
    },
    async fetchBalance() {
      const contract = new this.web3.eth.Contract(rEthAbi, this.reth2Contract);
      contract.methods
        .balanceOf(this.address)
        .call()
        .then(res => {
          this.rethBalance = formatFloatingPointValue(fromWei(res)).value;
          this.rethBalanceFiat = formatFiatValue(
            BigNumber(fromWei(res)).times(this.fiatValue).toString()
          ).value;
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
