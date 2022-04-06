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
        <div class="font-weight-bold mew-heading-3 mb-1">
          {{ balance }}
        </div>
        <div v-if="ethvmSupport" class="textLight--text">${{ balanceUsd }}</div>
      </div>
    </div>

    <!-- ======================================================================================= -->
    <!-- You are not staking user message -->
    <!-- ======================================================================================= -->
    <div v-if="!hasStaked && !hasPending" class="mt-4">
      You are currently not staking any {{ currencyName }}. To earn rewards
      start staking.
      <span class="greenPrimary--text cursor--pointer" @click="scrollToInput"
        >Start staking</span
      >
    </div>

    <!-- ======================================================================================= -->
    <!-- Pending -->
    <!-- ======================================================================================= -->
    <div v-if="isEthNetwork">
      <div
        v-for="tx in stakewiseTxs.ETH"
        :key="tx.hash"
        class="d-flex justify-space-between flex-wrap mt-4"
      >
        <div class="py-1">
          <v-progress-circular
            indeterminate
            color="greenPrimary"
            :width="2"
            :size="20"
            class="mr-1"
          />
          {{ tx.amount }} {{ currencyName }} Pending
        </div>
        <div
          class="greenPrimary--text font-weight-medium d-flex align-center cursor--pointer py-1"
          @click="checkHash(tx.hash)"
        >
          View on {{ ethvmSupport ? 'EthVM' : 'EtherScan' }}
          <v-icon color="greenPrimary" small class="ml-1"
            >mdi-open-in-new</v-icon
          >
        </div>
      </div>
    </div>
    <div v-else>
      <div
        v-for="tx in stakewiseTxs.GOERLI"
        :key="tx.hash"
        class="d-flex justify-space-between mt-4"
      >
        <div>
          <v-progress-circular
            indeterminate
            color="greenPrimary"
            :width="2"
            :size="20"
            class="mr-1"
          />
          {{ tx.amount }} {{ currencyName }} Pending
        </div>
        <div
          class="greenPrimary--text font-weight-medium d-flex align-center cursor--pointer"
          @click="checkHash(tx.hash)"
        >
          View on {{ ethvmSupport ? 'EthVM' : 'EtherScan' }}
          <v-icon color="greenPrimary" small class="ml-1"
            >mdi-open-in-new</v-icon
          >
        </div>
      </div>
    </div>

    <!-- ======================================================================================= -->
    <!-- Active for Stake currencyName -->
    <!-- ======================================================================================= -->
    <div
      v-if="hasStaked"
      class="d-flex align-center justify-space-between mt-4 flex-wrap-reverse"
    >
      <mew-button
        v-if="isEthNetwork"
        :title="`Redeem to ${currencyName}`"
        btn-style="transparent"
        btn-size="small"
        class="py-1"
        @click.native="routeToSwap"
      />
      <mew-button
        :title="`Stake more ${currencyName}`"
        :btn-style="compoundRewards ? 'background' : 'transparent'"
        btn-size="small"
        class="py-1"
        @click.native="scrollToInput"
      />
    </div>
  </div>
</template>

<script>
import { isEmpty, some, find } from 'lodash';
import { ROUTES_WALLET } from '@/core/configs/configRoutes';
import {
  SETH2_GOERLI_CONTRACT,
  SETH2_MAINNET_CONTRACT
} from '@/dapps/stakewise/handlers/configs.js';
import sEthAbi from '@/dapps/stakewise/handlers/abi/stakedEthToken.js';
import { mapActions, mapGetters, mapState } from 'vuex';
import { fromWei } from 'web3-utils';
import BigNumber from 'bignumber.js';
import { STAKEWISE_ROUTES } from '../configsRoutes';
import {
  formatFloatingPointValue,
  formatFiatValue
} from '@/core/helpers/numberFormatHelper';
export default {
  name: 'ModuleSideStaking',
  components: {},
  props: {
    compoundRewards: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      balance: 0,
      balanceUsd: 0,
      intervals: {}
    };
  },
  computed: {
    ...mapGetters('global', ['isEthNetwork', 'network']),
    ...mapGetters('wallet', ['tokensList']),
    ...mapState('wallet', ['web3', 'address']),
    ...mapState('stakewise', ['stakewiseTxs']),
    ...mapGetters('external', ['fiatValue']),
    currencyName() {
      return this.network.type.currencyName;
    },
    ethvmSupport() {
      return this.network.type.isEthVMSupported.supported;
    },
    linkUrl() {
      return this.ethvmSupport
        ? this.network.type.isEthVMSupported.blockExplorerTX
        : this.network.type.blockExplorerTX;
    },
    hasPending() {
      const txList = this.isEthNetwork
        ? this.stakewiseTxs.ETH
        : this.stakewiseTxs.GOERLI;
      return txList.length > 0;
    },
    seth2Contract() {
      return this.isEthNetwork ? SETH2_MAINNET_CONTRACT : SETH2_GOERLI_CONTRACT;
    },
    hasStaked() {
      if (this.ethvmSupport) {
        const exists = some(
          this.tokensList,
          item =>
            item.contract.toLowerCase() === this.seth2Contract.toLowerCase()
        );
        return exists;
      }
      return BigNumber(this.balance).gt(0);
    },
    sethToken() {
      if (this.ethvmSupport) {
        const token = find(
          this.tokensList,
          item =>
            item.contract.toLowerCase() === this.seth2Contract.toLowerCase()
        );
        return token ? token : '0';
      }
      return '0';
    }
  },
  watch: {
    stakewiseTxs: {
      handler(newVal) {
        const txList = this.isEthNetwork ? newVal.ETH : newVal.GOERLI;
        if (txList.length > 0) {
          txList.forEach(item => {
            this.fetcher(item.hash);
          });
        }
      },
      deep: true
    },
    address() {
      this.fetchBalance();
    },
    isEthNetwork() {
      this.fetchBalance();
    },
    $route: {
      handler: function (from) {
        if (from.query.module === 'stake') {
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
  mounted() {
    this.fetchBalance();
    const txList = this.isEthNetwork
      ? this.stakewiseTxs.ETH
      : this.stakewiseTxs.GOERLI;
    if (txList.length > 0) {
      txList.forEach(item => {
        this.fetcher(item.hash);
      });
    }
  },
  beforeDestroy() {
    // clear intervals that may have been setup
    if (isEmpty(this.intervals)) {
      Object.values(this.intervals).forEach(item => {
        clearInterval(item);
      });
    }
  },
  methods: {
    ...mapActions('stakewise', ['removePendingTxs', 'removePendingTxsGoerli']),
    routeToSwap() {
      this.$router.push({
        name: ROUTES_WALLET.SWAP.NAME,
        query: {
          fromToken: this.seth2Contract,
          toToken: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
          amount: this.sethToken.balancef
        }
      });
    },
    async fetchBalance() {
      const contract = new this.web3.eth.Contract(sEthAbi, this.seth2Contract);
      contract.methods
        .balanceOf(this.address)
        .call()
        .then(res => {
          this.balance = formatFloatingPointValue(fromWei(res)).value;
          this.balanceUsd = formatFiatValue(
            BigNumber(fromWei(res)).times(this.fiatValue).toString()
          ).value;
        });
    },
    checkHash(hash) {
      // eslint-disable-next-line
      window.open(this.linkUrl.replace('[[txHash]]', hash), '_blank');
    },
    fetcher(hash) {
      this.intervals[hash] = setInterval(() => {
        this.web3.eth.getTransactionReceipt(hash).then(res => {
          if (res) {
            clearInterval(this.intervals[hash]);
            this.isEthNetwork
              ? this.removePendingTxs(hash)
              : this.removePendingTxsGoerli(hash);
            this.fetchBalance();
          }
        });
      }, 10000);
    },
    changeRoute() {
      return new Promise(resolve => {
        resolve(
          this.$router.push({
            name: STAKEWISE_ROUTES.CORE.NAME,
            query: { module: 'stake' }
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
