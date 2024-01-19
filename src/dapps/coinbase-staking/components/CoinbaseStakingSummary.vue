<template>
  <!-- ======================================================================================= -->
  <!-- Side APR -->
  <!-- ======================================================================================= -->
  <div
    class="mew-component--module-side-apr bgWalletBlockDark pa-5 border-radius--10px"
  >
    <div class="d-flex align-center justify-space-between mb-1">
      <div class="text-uppercase mew-header-4 font-weight-medium">
        Coinbase Staking Summary
      </div>
    </div>
    <div class="d-flex align-center justify-space-between pt-2">
      <div
        class="textLight--text text-uppercase mew-label font-weight-medium set-font"
      >
        Total stake:
      </div>
      <div v-if="!loading" class="set-font">{{ stake }} MEWcbETH</div>
      <v-skeleton-loader v-else width="100px" max-height="48px" type="text" />
    </div>
    <div class="d-flex align-center justify-space-between pt-2">
      <div
        class="textLight--text text-uppercase mew-label font-weight-medium set-font"
      >
        ETH value:
      </div>
      <div v-if="!loading" class="set-font">
        {{ stakeInETH }} {{ currencyName }}
      </div>
      <v-skeleton-loader v-else width="100px" max-height="48px" type="text" />
    </div>
    <div class="d-flex align-center justify-space-between pt-2">
      <div
        class="textLight--text text-uppercase mew-label font-weight-medium set-font"
      >
        Exitable {{ currencyName }}:
      </div>
      <div v-if="!loading" class="set-font">
        {{ exitableETH }} {{ currencyName }}
      </div>
      <v-skeleton-loader v-else width="100px" max-height="48px" type="text" />
    </div>
    <div class="d-flex align-center justify-space-between pt-2">
      <div
        class="textLight--text text-uppercase mew-label font-weight-medium set-font"
      >
        Claimable Stake:
      </div>
      <div v-if="!loading" class="set-font">{{ claimableStake }} MEWcbETH</div>
      <v-skeleton-loader v-else width="100px" max-height="48px" type="text" />
    </div>
    <div
      v-if="showClaimNow"
      class="d-flex align-center justify-space-between pt-3 pb-2"
    >
      <mew-button
        title="Claim now"
        has-full-width
        btn-size="medium"
        :loading="loadingClaim"
        @click.native="claim"
      />
    </div>
    <div class="d-flex align-center justify-space-between pt-2">
      <div
        class="textLight--text text-uppercase mew-label font-weight-medium set-font"
      >
        Pending Exit:
      </div>
      <div v-if="!loading" class="set-font">
        {{ stakePendingExit }} MEWcbETH
      </div>
      <v-skeleton-loader v-else width="100px" max-height="48px" type="text" />
    </div>
    <div class="d-flex align-center justify-space-between pt-2">
      <div
        class="textLight--text text-uppercase mew-label font-weight-medium set-font"
      >
        Refreshes in:
      </div>
      <div v-if="!loading" class="set-font">{{ ticker }}</div>
      <div v-else>-- Hours and -- mins</div>
    </div>
    <div class="d-flex align-center justify-space-between">
      <div class="greenPrimary--text mew-label font-weight-medium set-font">
        (Refreshes daily at 1PM UTC)
      </div>
    </div>
    <div class="d-flex align-center justify-space-between pt-2">
      <mew-button
        title="Refresh Manually"
        has-full-width
        btn-style="outline"
        btn-size="medium"
        :loading="loading"
        @click.native="fetchInfo"
      />
    </div>
  </div>
</template>

<script>
import { mapGetters, mapState, mapActions } from 'vuex';
import { isEmpty } from 'lodash';
import BigNumber from 'bignumber.js';
import moment from 'moment';

import { ERROR, SUCCESS, Toast } from '@/modules/toast/handler/handlerToast';
import { fromBase } from '@/core/helpers/unit';
import { API } from '@/dapps/coinbase-staking/configs.js';
import { EventBus } from '@/core/plugins/eventBus';

const FIVE_MINS = 300000; // 1000 * 60 * 5

export default {
  name: 'CoinbaseStakingSummary',
  data() {
    return {
      currentTime: 0,
      timeInterval: null,
      loading: true,
      loadingClaim: false
    };
  },
  computed: {
    ...mapGetters('global', ['network']),
    ...mapState('coinbaseStaking', ['lastFetched', 'fetchedDetails']),
    ...mapState('wallet', ['address', 'instance', 'web3']),
    actualLastFetched() {
      return this.lastFetched[this.network.type.name];
    },
    currencyName() {
      return this.network.type.currencyName;
    },
    details() {
      return this.fetchedDetails[this.network.type.name];
    },
    hasDetails() {
      return !isEmpty(this.details);
    },
    stake() {
      const value = this.hasDetails
        ? `${fromBase(this.details.integratorShareBalance.value, 18)}`
        : '';
      return value.length > 7
        ? `${value.substr(0, value.length - 4)}...`
        : value;
    },
    stakeInETH() {
      const value = this.hasDetails
        ? `${fromBase(this.details.integratorShareUnderlyingBalance.value, 18)}`
        : '';
      return value.length > 7
        ? `${value.substr(0, value.length - 4)}...`
        : value;
    },
    exitableETH() {
      const value = this.hasDetails
        ? `${fromBase(this.details.totalExitableEth.value, 18)}`
        : '';
      return value.length > 7
        ? `${value.substr(0, value.length - 4)}...`
        : value;
    },
    claimableStake() {
      const value = this.hasDetails
        ? `${fromBase(this.details.fulfillableShareCount.value, 18)}`
        : '';
      return value.length > 7
        ? `${value.substr(0, value.length - 4)}...`
        : value;
    },
    stakePendingExit() {
      const value = this.hasDetails
        ? `${fromBase(this.details.totalSharesPendingExit.value, 18)}`
        : '';
      return value.length > 7
        ? `${value.substr(0, value.length - 4)}...`
        : value;
    },
    showClaimNow() {
      return BigNumber(this.claimableStake).gt(0);
    },
    closestOnePM() {
      const currentFetched = new Date(this.actualLastFetched);
      const nearestFromLastFetched = new Date(this.actualLastFetched);
      nearestFromLastFetched.setUTCHours(13, 0, 0); // set last fetched date to 1PM UTC
      if (nearestFromLastFetched > currentFetched) {
        return nearestFromLastFetched.getTime();
      }
      const nextNearest = nearestFromLastFetched.setDate(
        nearestFromLastFetched.getUTCDate() + 1
      );
      if (nextNearest > currentFetched) {
        return new Date(nextNearest).getTime();
      }
      return currentFetched.getTime();
    },
    ticker() {
      const now = moment(this.currentTime);
      const expiration = moment(this.closestOnePM);
      const diff = expiration.diff(now);
      const duration = moment.duration(diff);
      const hours = duration.hours();
      const minutes = duration.minutes();
      return `${hours} Hour${hours > 9 ? 's' : ''} and ${minutes} min${
        minutes > 9 ? 's' : ''
      }`;
    }
  },
  watch: {
    /**
     * if lastFetched is behind lastFetched1PMUTC
     * and if currentTime is after lastFetched1PMUTC, refresh details
     */
    currentTime(newVal) {
      const currentFetched = new Date(this.actualLastFetched);
      const currentFetchedOnePMUTC = new Date(
        new Date(this.actualLastFetched).setUTCHours(13, 0, 0)
      );
      const currentTime = new Date(newVal);
      const fetchedInThePast = currentFetched < currentFetchedOnePMUTC;
      const onePMPastNow = currentTime >= currentFetchedOnePMUTC;
      if (fetchedInThePast && onePMPastNow) {
        this.fetchInfo();
      }
    }
  },
  mounted() {
    this.fetchInfo();
    this.currentTime = new Date().getTime();
    this.timeInterval = setInterval(() => {
      const time = new Date();
      this.currentTime = time.getTime();
    }, FIVE_MINS);
    EventBus.$on('fetchSummary', this.fetchInfo);
  },
  destroyed() {
    EventBus.$off('fetchSummary');
  },
  methods: {
    ...mapActions('coinbaseStaking', ['storeFetched']),
    fetchInfo() {
      this.loading = true;
      fetch(
        `${API}?address=${this.address}&action=details&networkId=${this.network.type.chainID}`
      )
        .then(res => res.json())
        .then(res => {
          this.loading = false;
          if (res.error || res.message) {
            Toast(res.error || res.message, {}, ERROR);
            return;
          }
          this.storeFetched([res, this.network.type.name]);
        });
    },
    async claim() {
      this.loadingClaim = true;
      const { gasLimit, to, data, value, error } = await fetch(
        `${API}?address=${this.address}&action=claim&networkId=${this.network.type.chainID}`
      ).then(res => res.json());

      if (error) {
        Toast(error, {}, ERROR);
        this.loadingClaim = false;
        return;
      }
      const txObj = {
        gasLimit: gasLimit,
        to: to,
        from: this.address,
        data: data,
        value: value
      };
      this.web3.eth
        .sendTransaction(txObj)
        .then(() => {
          this.loadingClaim = false;
          this.fetchInfo();
          Toast(
            'Successfully claimed exitable stake! Account will reflect once pool refreshes.',
            {},
            SUCCESS
          );
        })
        .catch(e => {
          this.loadingClaim = false;
          this.instance.errorHandler(e);
        });
    }
  }
};
</script>

<style lang="scss" scoped>
.set-font {
  font-size: 12px !important;
}
</style>
