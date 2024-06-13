<template>
  <!-- ======================================================================================= -->
  <!-- Side APR -->
  <!-- ======================================================================================= -->
  <div
    class="mew-component--module-side-apr bgWalletBlockDark pa-5 border-radius--10px"
  >
    <div class="d-flex align-center justify-space-between mb-1">
      <div class="text-uppercase mew-header-4 font-weight-medium">
        ETH Staking Summary
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
      class="d-flex flex-column align-center justify-space-between pt-3 pb-2"
    >
      <mew-button
        title="Claim now"
        has-full-width
        btn-size="medium"
        :loading="loadingClaim"
        :disabled="!hasEnoughBalanceToStake"
        @click.native="claim"
      />
      <p v-show="!hasEnoughBalanceToStake" class="error--text">
        Not enough balance to claim.
        <a
          v-show="network.type.canBuy"
          @click="
            () => {
              openBuySell('CoinbaseStakingSummary');
            }
          "
          >Buy More {{ network.type.currencyName }}</a
        >
      </p>
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
const FIVE_MINS = 300000; // 1000 * 60 * 5
</script>
<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue';
import { fromWei } from 'web3-utils';
import { isEmpty } from 'lodash';
import BigNumber from 'bignumber.js';
import moment from 'moment';

import { ERROR, SUCCESS, Toast } from '@/modules/toast/handler/handlerToast';
import { formatFloatingPointValue } from '@/core/helpers/numberFormatHelper';
import { fromBase } from '@/core/helpers/unit';
import {
  API,
  CB_TRACKING,
  MIN_GAS_LIMIT
} from '@/dapps/coinbase-staking/configs.js';
import { EventBus } from '@/core/plugins/eventBus';
import { useBuySell } from '@/core/composables/buyMore';
import { useAmplitude } from '@/core/composables/amplitude';
import { useGlobalStore } from '@/core/store/global';
import { useWalletStore } from '@/core/store/wallet';
import { useCoinbaseStakingStore } from '../store';

// injections
const { openBuySell } = useBuySell();
const { trackDapp } = useAmplitude();
const { network, gasPriceByType, gasPriceType } = useGlobalStore();
const { balanceInETH, address, instance, web3 } = useWalletStore();
const { lastFetched, fetchedDetails, storeFetched } = useCoinbaseStakingStore();

// data
const currentTime = ref(0);
const timeInterval = ref(null);
const gasLimit = ref('21000');
const loading = ref(true);
const loadingClaim = ref(false);
const locGasPrice = ref('0');

// computed
const ethTotalFee = computed(() => {
  const gasPrice = BigNumber(locGasPrice).gt(0)
    ? BigNumber(locGasPrice)
    : BigNumber(gasPriceByType(gasPriceType.value));
  const locGasLimit = BigNumber(gasLimit.value).gt('21000')
    ? gasLimit.value
    : MIN_GAS_LIMIT;
  const ethFee = fromWei(BigNumber(gasPrice).times(locGasLimit).toFixed());
  return formatFloatingPointValue(ethFee).value;
});
const hasEnoughBalanceToStake = computed(() => {
  return BigNumber(ethTotalFee.value).lte(balanceInETH.value);
});
const actualLastFetched = computed(() => {
  return lastFetched.value[network.value.type.name];
});
const currencyName = computed(() => {
  return network.value.type.currencyName;
});
const details = computed(() => {
  return fetchedDetails.value[network.value.type.name];
});
const hasDetails = computed(() => {
  return !isEmpty(details.value);
});
const stake = computed(() => {
  const value = hasDetails.value
    ? `${fromBase(details.value.integratorShareBalance.value, 18)}`
    : '';
  return value.length > 7 ? `${value.substr(0, value.length - 4)}...` : value;
});
const stakeInETH = computed(() => {
  const value = hasDetails.value
    ? `${fromBase(details.value.integratorShareUnderlyingBalance.value, 18)}`
    : '';
  return value.length > 7 ? `${value.substr(0, value.length - 4)}...` : value;
});
const exitableETH = computed(() => {
  const value = hasDetails.value
    ? `${fromBase(details.value.totalExitableEth.value, 18)}`
    : '';
  return value.length > 7 ? `${value.substr(0, value.length - 4)}...` : value;
});
const claimableStake = computed(() => {
  const value = hasDetails.value
    ? `${fromBase(details.value.fulfillableShareCount.value, 18)}`
    : '';
  return value.length > 7 ? `${value.substr(0, value.length - 4)}...` : value;
});
const stakePendingExit = computed(() => {
  const value = hasDetails.value
    ? `${fromBase(details.value.totalSharesPendingExit.value, 18)}`
    : '';
  return value.length > 7 ? `${value.substr(0, value.length - 4)}...` : value;
});
const showClaimNow = computed(() => {
  return hasDetails.value
    ? BigNumber(fromBase(details.value.fulfillableShareCount.value, 18)).gt(0)
    : false;
});
const closestOnePM = computed(() => {
  const currentFetched = new Date(actualLastFetched.value);
  const nearestFromLastFetched = new Date(actualLastFetched.value);
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
});
const ticker = computed(() => {
  const now = moment(currentTime.value);
  const expiration = moment(closestOnePM.value);
  const diff = expiration.diff(now);
  const duration = moment.duration(diff);
  const hours = duration.hours();
  const minutes = duration.minutes();
  return `${hours} Hour${hours > 9 ? 's' : ''} and ${minutes} min${
    minutes > 9 ? 's' : ''
  }`;
});

// watch
/**
 * if lastFetched is behind lastFetched1PMUTC
 * and if currentTime is after lastFetched1PMUTC, refresh details
 */
watch(
  () => currentTime,
  newVal => {
    const currentFetched = new Date(actualLastFetched.value);
    const currentFetchedOnePMUTC = new Date(
      new Date(actualLastFetched.value).setUTCHours(13, 0, 0)
    );
    const currentTime = new Date(newVal);
    const fetchedInThePast = currentFetched < currentFetchedOnePMUTC;
    const onePMPastNow = currentTime >= currentFetchedOnePMUTC;
    if (fetchedInThePast && onePMPastNow) {
      fetchInfo();
    }
  }
);
watch(
  () => gasPriceType.value,
  () => {
    locGasPrice.value = gasPriceByType(gasPriceType.value);
  }
);

// mounted
onMounted(() => {
  fetchInfo();
  locGasPrice.value = gasPriceByType(gasPriceType.value);
  currentTime.value = new Date().getTime();
  timeInterval.value = setInterval(() => {
    const time = new Date();
    currentTime.value = time.getTime();
  }, FIVE_MINS);
  EventBus.$on('fetchSummary', fetchInfo);
});

// destroyed
onUnmounted(() => {
  EventBus.$off('fetchSummary');
});

// methods
const fetchInfo = () => {
  loading.value = true;
  fetch(
    `${API}?address=${address.value}&action=details&networkId=${network.value.type.chainID}`
  )
    .then(res => res.json())
    .then(res => {
      loading.value = false;
      if (res.error || res.message) {
        Toast(res.error || res.message, {}, ERROR);
        return;
      }
      storeFetched([res, network.value.type.name]);
    });
};
const claim = async () => {
  loadingClaim.value = true;
  trackDapp(CB_TRACKING.CLICK_CLAIM);
  const { gasLimit, to, data, value, error } = await fetch(
    `${API}?address=${address.value}&action=claim&networkId=${network.value.type.chainID}`
  ).then(res => res.json());

  if (error) {
    Toast(error, {}, ERROR);
    loadingClaim.value = false;
    trackDapp(CB_TRACKING.CLAIM_FAIL);
    return;
  }
  const txObj = {
    gasLimit: gasLimit,
    to: to,
    from: address.value,
    data: data,
    value: value
  };
  web3.value.eth
    .sendTransaction(txObj)
    .once('receipt', () => {
      fetchInfo();
    })
    .then(() => {
      loadingClaim.value = false;
      fetchInfo();
      Toast(
        'Successfully claimed exitable stake! Account will reflect once pool refreshes.',
        {},
        SUCCESS
      );
      trackDapp(CB_TRACKING.CLAIM_SUCCESS);
    })
    .catch(e => {
      loadingClaim.value = false;
      instance.value.errorHandler(e);
      trackDapp(CB_TRACKING.CLAIM_FAIL);
    });
};
</script>

<style lang="scss" scoped>
.set-font {
  font-size: 12px !important;
}
</style>
