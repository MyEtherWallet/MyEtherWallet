<template>
  <v-snackbar
    :value="show"
    :vertical="true"
    multi-line
    height="170px"
    min-height="170px"
    :width="width"
    :min-width="width"
    :timeout="-1"
    color="#0C4180"
    right
    rounded
    :class="[notSmallOrXs ? 'pr-12' : 'pr-6', 'mr-16 snackbar-container']"
    transition="scale-transition"
    content-class="mew-survey-content d-flex flex-column justify-space-between pa-3"
  >
    <div
      :class="[
        notSmallOrXs ? 'text-center' : 'text-left',
        'mew-heading-4 whiteAlways--text'
      ]"
    >
      You have unclaimed ENS Tokens
    </div>
    <mew-button
      has-full-width
      title="Claim"
      btn-style="background"
      btn-size="large"
      @click.native="openEnsClaimable"
    />
    <mew-button
      has-full-width
      title="Skip"
      btn-style="outline"
      btn-size="large"
      @click.native="setShowHasClaimable(false)"
    />
  </v-snackbar>
</template>

<script>
import { ROUTES_WALLET } from '@/core/configs/configRoutes';
import { mapActions, mapState } from 'vuex';
import { hasClaimed } from '../../handlers/handlerENSTokenClaim';
import BigNumber from 'bignumber.js';
export default {
  data() {
    return {
      show: false,
      timeoutHolder: null,
      claimed: true,
      hasTokens: false
    };
  },
  computed: {
    ...mapState('ensManagerStore', ['showHasClaimable']),
    ...mapState('wallet', ['address', 'web3']),
    notSmallOrXs() {
      return (
        this.$vuetify.breakpoint.lg ||
        this.$vuetify.breakpoint.xl ||
        this.$vuetify.breakpoint.md
      );
    },
    width() {
      if (this.notSmallOrXs) {
        return '281px';
      } else if (this.$vuetify.breakpoint.sm) {
        return '235px';
      }
      return '211px';
    }
  },
  watch: {
    showHasClaimable(newVal) {
      if (this.timeoutHolder) clearTimeout(this.timeoutHolder);
      if (!this.claimed && this.hasTokens) {
        if (newVal) {
          this.delayOpenSnackBar();
        } else {
          this.show = newVal;
        }
      }
    }
  },
  mounted() {
    this.getData();
  },
  methods: {
    ...mapActions('ensManagerStore', ['setShowHasClaimable']),
    async getData() {
      await hasClaimed(this.address, this.web3).then(data => {
        if (data && data.balance) {
          this.claimed = data.claimed;
          this.hasTokens = BigNumber(data.balance).gt(0);
        }
      });
      this.delayOpenSnackBar();
    },
    openEnsClaimable() {
      this.$router.push({
        name: ROUTES_WALLET.ENS_MANAGER.NAME,
        query: {
          active: 2
        }
      });
      this.setShowHasClaimable(false);
    },
    delayOpenSnackBar() {
      // add 6 secs delay
      // on load when showHasClaimable is true
      if (this.showHasClaimable && !this.claimed) {
        this.timeoutHolder = setTimeout(() => {
          this.show = this.showHasClaimable;
        }, 3000);
      }
    }
  }
};
</script>
<style lang="scss">
.mew-survey-content {
  width: 100% !important;
}
.snackbar-container {
  margin-bottom: -80px;
}
</style>
