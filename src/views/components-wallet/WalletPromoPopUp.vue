<template>
  <app-modal
    width="420"
    :show="showInitialPromo"
    has-body-content
    :has-buttons="false"
    :has-close-button="false"
    :close="setHidePopUp"
  >
    <template #dialogBody>
      <div class="d-flex flex-column align-start">
        <div class="d-flex">
          <img
            class="eth--icon mr-4"
            src="@/dapps/stakewise/assets/icon-stakewise-purple.svg"
            width="60px"
            height="60px"
          />
          <h2>Join the Stakewise pool with any amount of ETH</h2>
        </div>
        <div class="my-5 mew-body text--lighten-1 textMedium--text">
          Start earning rewards on your ETH within 24 hours. Simplified staking
          with no minimum requirements.
        </div>
      </div>
      <div
        class="mew-component--module-side-apr backgroundGrey pa-5 border-radius--10px"
      >
        <div class="d-flex align-center justify-space-between mb-1">
          <div
            class="textLight--text text-uppercase mew-label font-weight-medium"
          >
            Current APR
          </div>
          <div v-if="!loading" class="textLight--text greenPrimary--text">
            {{ validatorApr }}%
          </div>
          <v-skeleton-loader v-else class="mt-1" type="text" width="63px" />
        </div>
        <div class="d-flex align-center justify-space-between">
          <div
            class="textLight--text text-uppercase mew-label font-weight-medium"
          >
            ETH in pool
          </div>
          <div v-if="!loading">{{ formattedPoolValue }} ETH</div>
          <v-skeleton-loader v-else class="mt-1" type="text" width="100px" />
        </div>
      </div>
      <mew-button
        class="mt-6"
        title="START STAKING"
        has-full-width
        btn-size="xlarge"
        @click.native="goToPromo()"
      />
    </template>
  </app-modal>
</template>

<script>
import AppModal from '@/core/components/AppModal';
import { mapActions, mapState, mapGetters } from 'vuex';
import handlerAnalytics from '@/modules/analytics-opt-in/handlers/handlerAnalytics.mixin';
import { EventBus } from '@/core/plugins/eventBus';
import BigNumber from 'bignumber.js';
import handler from '@/dapps/stakewise/handlers/stakewiseHandler';
import { STAKEWISE_EVENT } from '@/dapps/stakewise/helpers/index';
import { SUPPORTED_NETWORKS } from '@/dapps/stakewise/handlers/helpers/supportedNetworks';
import { formatFloatingPointValue } from '@/core/helpers/numberFormatHelper';
import { Toast, ERROR } from '@/modules/toast/handler/handlerToast';
import nodes from '@/utils/networks';
export default {
  name: 'TheStakewisePopupPromo',
  components: { AppModal },
  mixins: [handlerAnalytics],
  data() {
    return {
      loading: true,
      nodes: nodes
    };
  },
  computed: {
    ...mapState('global', ['showWalletPromo', 'promoOver']),
    ...mapState('ensManagerStore', ['showHasClaimable']),
    ...mapState('stakewise', ['validatorApr', 'showInitialPromo']),
    ...mapState('wallet', ['web3']),
    ...mapGetters('global', ['network', 'isEthNetwork']),
    ...mapGetters('stakewise', ['getPoolSupply']),
    formattedPoolValue() {
      return formatFloatingPointValue(this.getPoolSupply).value;
    },
    isSupported() {
      const isSupported = SUPPORTED_NETWORKS.find(item => {
        return item.name === this.network.type.name;
      });
      return isSupported;
    }
  },
  watch: {
    web3() {
      this.setup();
    }
  },
  mounted() {
    this.setup();
  },
  methods: {
    ...mapActions('global', ['setNetwork']),
    ...mapActions('wallet', ['setWeb3Instance']),
    ...mapActions('stakewise', [
      'setPoolSupply',
      'setStakingFee',
      'setValidatorApr',
      'closeStakewisePromo'
    ]),
    setup() {
      if (this.isSupported) {
        this.stakewiseHandler = new handler(this.web3, this.isEthNetwork);
        this.collectiveFetch();
      }
    },
    collectiveFetch() {
      Promise.all([
        this.stakewiseHandler.getEthPool(),
        this.stakewiseHandler.getStakingFee(),
        this.stakewiseHandler.getValidatorApr()
      ])
        .then(res => {
          this.setPoolSupply(res[0]);
          this.setStakingFee(res[1]);
          this.setValidatorApr(
            BigNumber(res[2])
              .minus(BigNumber(res[2]).times(0.1))
              .dp(2)
              .toString()
          );
          this.loading = false;
        })
        .catch(e => {
          Toast(e, {}, ERROR);
        });
    },
    setHidePopUp() {
      this.closeStakewisePromo();
    },
    navigate() {
      this.setHidePopUp();
      this.trackDapp('stakewiseFromPromo');
      EventBus.$emit(STAKEWISE_EVENT);
    },
    /**
     * Hides promo popup forever and navigates to the promo link.
     * Edit this function to route to new link
     */
    goToPromo() {
      if (!this.isSupported) {
        const defaultNetwork = this.nodes['ETH'].find(item => {
          return item.service === 'myetherwallet.com-ws';
        });
        this.setNetwork(defaultNetwork).then(() => {
          this.setWeb3Instance().then(() => {
            this.navigate();
          });
        });
      } else {
        this.navigate();
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.eth--icon {
  border: 1px solid #d7dae3;
  border-radius: 12px;
}
</style>
