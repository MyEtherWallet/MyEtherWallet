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
      <div class="textLight--text text-uppercase mew-label font-weight-medium">
        Total stake:
      </div>
      <div v-if="!loading">
        {{ stake }} MEWcbETH ({{ stakeInETH }} {{ currencyName }})
      </div>
      <v-skeleton-loader v-else width="100px" max-height="48px" type="text" />
    </div>
    <div class="d-flex align-center justify-space-between pt-2">
      <div class="textLight--text text-uppercase mew-label font-weight-medium">
        Total Exitable {{ currencyName }}:
      </div>
      <div v-if="!loading">{{ exitableETH }} {{ currencyName }}</div>
      <v-skeleton-loader v-else width="100px" max-height="48px" type="text" />
    </div>
    <div class="d-flex align-center justify-space-between pt-2">
      <div class="textLight--text text-uppercase mew-label font-weight-medium">
        Claimable Stake:
      </div>
      <div v-if="!loading">{{ claimableStake }} MEWcbETH</div>
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
      <div class="textLight--text text-uppercase mew-label font-weight-medium">
        Pending Exit:
      </div>
      <div v-if="!loading">{{ stakePendingExit }} MEWcbETH</div>
      <v-skeleton-loader v-else width="100px" max-height="48px" type="text" />
    </div>
    <div class="d-flex align-center justify-space-between pt-2">
      <div class="textLight--text text-uppercase mew-label font-weight-medium">
        Refreshes in:
      </div>
      <div v-if="!loading">{{ ticker }}</div>
      <div v-else>-- Hours and -- mins</div>
    </div>
    <div class="d-flex align-center justify-space-between">
      <div class="greenPrimary--text mew-label font-weight-medium">
        (Refreshes daily at 1PM UTC)
      </div>
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
      return this.hasDetails ? this.details.integratorShareBalance.value : '0';
    },
    stakeInETH() {
      return this.hasDetails
        ? fromBase(this.details.integratorShareUnderlyingBalance.value, 18)
        : '0';
    },
    exitableETH() {
      return this.hasDetails
        ? fromBase(this.details.totalExitableEth.value, 18)
        : '0';
    },
    claimableStake() {
      return this.hasDetails ? this.details.fulfillableShareCount.value : '0';
    },
    stakePendingExit() {
      return this.hasDetails ? this.details.totalSharesPendingExit.value : '0';
    },
    showClaimNow() {
      return BigNumber(this.claimableStake).gt(0);
    },
    closestOnePM() {
      const currentFetched = new Date(this.lastFetched);
      const nearestFromLastFetched = new Date(this.lastFetched);
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
      const currentFetched = new Date(this.lastFetched);
      const currentFetchedOnePMUTC = new Date(
        new Date(this.lastFetched).setUTCHours(13, 0, 0)
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
    if (!this.hasDetails) {
      this.fetchInfo();
    } else {
      this.loading = false;
    }

    this.currentTime = new Date().getTime();
    this.timeInterval = setInterval(() => {
      const time = new Date();
      this.currentTime = time.getTime();
    }, FIVE_MINS);
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
          if (res.error) {
            Toast(res.error, {}, ERROR);
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
        .on('receipt', () => {
          this.loadingClaim = false;
          Toast(
            'Successfully staked! Account will reflect once pool refreshes.',
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
