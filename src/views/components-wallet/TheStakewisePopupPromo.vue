<template>
  <app-modal
    width="420"
    :show="showPromo"
    title=""
    has-body-content
    :has-buttons="false"
    :has-close-button="false"
    :close="setHidePopUp"
  >
    <template #dialogBody>
      <div v-if="!isPromoOver">
        <div class="d-flex">
          <img
            class="eth--icon mr-4"
            src="@/dapps/stakewise/assets/icon-stakewise-purple.svg"
            width="60px"
            height="60px"
          />
          <h2>Join the Stakewise pool with any amount of ETH</h2>
        </div>
        <div class="my-5 text-center mew-body text--lighten-1 textMedium--text">
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
          <div class="textLight--text greenPrimary--text">
            {{ validatorApr }}%
          </div>
        </div>
        <div class="d-flex align-center justify-space-between">
          <div
            class="textLight--text text-uppercase mew-label font-weight-medium"
          >
            ETH in pool
          </div>
          <div>{{ formattedPoolValue }} {{ networkName }}</div>
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
import {
  STAKEWISE_EVENT,
  STAKEWISE_OFFER_END
} from '@/dapps/stakewise/helpers/index';
import { formatFloatingPointValue } from '@/core/helpers/numberFormatHelper';
import moment from 'moment';

export default {
  name: 'TheStakewisePopupPromo',
  components: { AppModal },
  mixins: [handlerAnalytics],
  computed: {
    ...mapState('global', ['showWalletPromo', 'promoOver']),
    ...mapState('ensManagerStore', ['showHasClaimable']),
    ...mapState('stakewise', ['validatorApr']),
    ...mapState('wallet', ['web3']),
    ...mapGetters('global', ['network', 'isEthNetwork']),
    ...mapGetters('stakewise', ['getPoolSupply']),
    isPromoOver() {
      return moment(moment()).isAfter(STAKEWISE_OFFER_END);
    },
    showPromo() {
      if (this.showWalletPromo) {
        return this.showWalletPromo;
      }

      return !this.promoOver;
    },
    networkName() {
      return this.network.type.currencyName;
    },
    formattedPoolValue() {
      return formatFloatingPointValue(this.getPoolSupply).value;
    }
  },
  mounted() {
    if (this.showPromo && this.showHasClaimable) {
      this.setShowHasClaimable(false);
    }
    this.stakewiseHandler = new handler(this.web3, this.isEthNetwork);
    this.collectiveFetch();
  },
  methods: {
    ...mapActions('global', ['neverShowPromo', 'setPromoOver']),
    ...mapActions('ensManagerStore', ['setShowHasClaimable']),
    ...mapActions('stakewise', [
      'setPoolSupply',
      'setStakingFee',
      'setValidatorApr'
    ]),
    collectiveFetch() {
      this.stakewiseHandler.getEthPool().then(res => {
        this.setPoolSupply(res);
      });
      this.stakewiseHandler.getStakingFee().then(res => {
        this.setStakingFee(res);
      });
      this.stakewiseHandler.getValidatorApr().then(res => {
        this.setValidatorApr(
          BigNumber(res).minus(BigNumber(res).times(0.1)).dp(2).toString()
        );
      });
    },
    setHidePopUp() {
      if (this.showWalletPromo) {
        this.neverShowPromo().then(() => {
          this.hideClaimsForever();
        });
      }
      if (!this.promoOver) {
        this.setPromoOver().then(() => {
          this.hideClaimsForever();
        });
      }
    },
    hideClaimsForever() {
      if (!this.showHasClaimable) {
        this.setShowHasClaimable(true);
      }
    },
    /**
     * Hides promo popup forever and navigates to the promo link.
     * Edit this function to route to new link
     */
    goToPromo() {
      this.setHidePopUp();
      this.trackDapp('stakewisePromo');
      EventBus.$emit(STAKEWISE_EVENT);
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
