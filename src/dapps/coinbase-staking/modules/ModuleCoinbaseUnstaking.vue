<template>
  <div class="dapps-stakewise-stake pt-8 pb-13 px-3 pa-sm-15">
    <v-row>
      <v-col
        :order="$vuetify.breakpoint.smAndDown ? 'last' : ''"
        cols="12"
        md="8"
        :class="$vuetify.breakpoint.smAndDown ? 'my-10' : 'pr-7'"
      >
        <mew-sheet class="pa-15">
          <div class="mew-heading-2 textDark--text mb-8">Unstake ETH</div>

          <!-- ======================================================================================= -->
          <!-- Stake direction information -->
          <!-- ======================================================================================= -->
          <div ref="input" class="d-flex align-center text-center">
            <div
              class="border-radius--8px bgWalletBlockDark flex-grow-1 pa-5 d-flex flex-column align-center"
              style="width: 30%"
            >
              <div
                class="mew-caption textMedium--text font-weight-regular mb-2"
              >
                You give
              </div>
              <div class="stake-icon">
                <img
                  src="@/assets/images/icons/icon-eth-gray.svg"
                  alt="Stakewise"
                />
              </div>
              <div class="font-weight-bold mt-2">MEWcbETH</div>
            </div>
            <div class="px-5">
              <v-icon color="greenPrimary">mdi-arrow-right</v-icon>
            </div>
            <div
              class="border-radius--8px bgWalletBlockDark flex-grow-1 pa-5 d-flex flex-column align-center"
              style="width: 30%"
            >
              <div
                class="mew-caption textMedium--text font-weight-regular mb-2"
              >
                You will get
              </div>
              <div class="stake-icon">
                <img src="@/assets/images/icons/icon-eth-gray.svg" alt="Eth" />
              </div>
              <div class="font-weight-bold mt-2">{{ currencyName }}</div>
            </div>
          </div>

          <!-- ======================================================================================= -->
          <!-- Amount to stake -->
          <!-- ======================================================================================= -->
          <div class="position--relative mt-15">
            <app-button-balance :loading="false" :balance="stakedBalance" />
            <mew-input
              type="number"
              :max-btn-obj="{
                title: 'Max',
                method: setMax,
                disabled: errorMessages !== ''
              }"
              :image="iconEth"
              label="Amount to unstake"
              placeholder="Enter amount"
              :value="unstakeAmount"
              :error-messages="errorMessages"
              :buy-more-str="buyMoreStr"
              @buyMore="
                () => {
                  openBuySell('CoinbaseUnstaking');
                }
              "
              @input="setAmount"
            />
          </div>

          <!-- ======================================================================================= -->
          <!-- Stake status -->
          <!-- ======================================================================================= -->
          <div class="stake-status">
            <div class="d-flex justify-space-between">
              <div>
                <div class="mew-body">
                  Network Fee
                  <span
                    class="ml-2 greenPrimary--text cursor--pointer"
                    @click="openSettings"
                  >
                    Edit
                  </span>
                </div>
              </div>
              <div class="text-right">
                <div class="">{{ ethTotalFee }} {{ currencyName }}</div>
                <div v-show="isEthNetwork" class="mew-body textLight--text">
                  {{ gasPriceFiat }}
                </div>
              </div>
            </div>
          </div>

          <!-- ======================================================================================= -->
          <!-- Divier -->
          <!-- ======================================================================================= -->
          <v-divider class="mt-8" />

          <!-- ======================================================================================= -->
          <!-- How stake works -->
          <!-- ======================================================================================= -->
          <div class="mt-6">
            <div class="font-weight-bold mb-2">How unstaking works</div>
            <ul class="textMedium--text">
              <li class="mb-2">
                Request to unstake the desired amount of
                {{ currencyName }}.
              </li>
              <li class="mb-2">
                Wait for {{ currencyName }} to become ready to claim. Status
                updates daily at 1pm UTC.
              </li>
              <li class="mb-2">
                Claim available {{ currencyName }} to unstake. Unstaked
                {{ currencyName }} will be deposited to your wallet.
              </li>
            </ul>

            <div class="mt-6">
              <a
                href="https://help.myetherwallet.com/en/articles/8843926-stake-eth-with-coinbase-in-mew-web"
                target="_blank"
              >
                <div class="greenPrimary--text">
                  View the ETH Staking guide<v-icon
                    color="greenPrimary"
                    small
                    class="ml-2"
                  >
                    mdi-open-in-new
                  </v-icon>
                </div>
              </a>
            </div>
          </div>

          <!-- ======================================================================================= -->
          <!-- Divier -->
          <!-- ======================================================================================= -->
          <v-divider class="mt-9 mb-8" />

          <!-- ======================================================================================= -->
          <!-- Start staking -->
          <!-- ======================================================================================= -->
          <div class="d-flex flex-column align-center">
            <mew-button
              class="mt-8"
              title="Unstake"
              btn-size="xlarge"
              :loading="loading"
              :disabled="!isValid"
              @click.native="unstake"
            />
          </div>
        </mew-sheet>
      </v-col>
      <v-col cols="12" md="4">
        <coinbase-staking-summary ref="summary" class="mb-4" />
      </v-col>
    </v-row>
  </div>
</template>

<script setup>
import { defineAsyncComponent, ref, computed, watch, onMounted } from 'vue';
import { fromWei } from 'web3-utils';
import BigNumber from 'bignumber.js';
import { debounce, isEmpty } from 'lodash';

import { formatFloatingPointValue } from '@/core/helpers/numberFormatHelper';
import { ERROR, SUCCESS, Toast } from '@/modules/toast/handler/handlerToast';
import { EventBus } from '@/core/plugins/eventBus';
import hasValidDecimals from '@/core/helpers/hasValidDecimals';
import { toBase, fromBase } from '@/core/helpers/unit';
import {
  API,
  CB_TRACKING,
  MIN_GAS_LIMIT
} from '@/dapps/coinbase-staking/configs.js';
import { useBuySell } from '@/core/composables/buyMore';
import { useAmplitude } from '@/core/composables/amplitude';

import { useGlobalStore } from '@/core/store/global';
import { useWalletStore } from '@/core/store/wallet';
import { useExternalStore } from '@/core/store/external';
import { useCoinbaseStakingStore } from '../store';

const CoinbaseStakingSummary = defineAsyncComponent(() =>
  import('../components/CoinbaseStakingSummary')
);

// injections/use
const { openBuySell } = useBuySell();
const { trackDapp } = useAmplitude();
const { network, isEthNetwork, gasPriceByType, getFiatValue, gasPriceType } =
  useGlobalStore();
const { fiatValue } = useExternalStore();
const { balanceInETH, web3, address, instance } = useWalletStore();
const { fetchedDetails } = useCoinbaseStakingStore();

// data
const iconEth = require('@/assets/images/icons/icon-eth-gray.svg');
const unstakeAmount = ref('0');
const locGasPrice = ref('0');
const gasLimit = ref('21000');
const estimateGasError = ref(false);
const loading = ref(false);

// computed
const details = computed(() => {
  return fetchedDetails.value[network.value.type.name];
});
const hasDetails = computed(() => {
  return !isEmpty(details.value);
});
const stakedBalance = computed(() => {
  return hasDetails.value
    ? fromBase(details.value.integratorShareUnderlyingBalance.value, 18)
    : 0;
});
const currencyName = computed(() => {
  return network.value.type.currencyName;
});
const ethTotalFee = computed(() => {
  const gasPrice = BigNumber(locGasPrice.value).gt(0)
    ? BigNumber(locGasPrice.value)
    : BigNumber(gasPriceByType(gasPriceType.value));
  const locGasLimit = BigNumber(gasLimit.value).gt('21000')
    ? gasLimit.value
    : MIN_GAS_LIMIT;
  const ethFee = fromWei(BigNumber(gasPrice).times(locGasLimit).toFixed());
  return formatFloatingPointValue(ethFee).value;
});
const gasPriceFiat = computed(() => {
  const gasPrice = BigNumber(ethTotalFee.value);
  return gasPrice.gt(0)
    ? getFiatValue(gasPrice.times(fiatValue.value).toFixed())
    : '0';
});
const hasEnoughBalanceToStake = computed(() => {
  return BigNumber(ethTotalFee.value).lte(balanceInETH.value);
});
const isValid = computed(() => {
  return (
    BigNumber(unstakeAmount.value).gt(0) &&
    hasEnoughBalanceToStake.value &&
    errorMessages.value === ''
  );
});
const errorMessages = computed(() => {
  if (!hasEnoughBalanceToStake.value) {
    return 'Not enough ETH.';
  }

  if (estimateGasError.value) {
    return !hasEnoughBalanceToStake.value
      ? 'Issue with gas estimation. Please check if you have enough balance!'
      : '';
  }
  if (BigNumber(stakedBalance.value).lte(0)) {
    return 'User has no ETH staked.';
  }
  if (BigNumber(unstakeAmount.value).lt(0)) {
    return 'Value cannot be negative';
  }
  if (BigNumber(unstakeAmount.value).gt(stakedBalance)) {
    return `Balance too low! User only has ${stakedBalance.value}.`;
  }
  if (
    BigNumber(unstakeAmount.value).gt(0) &&
    !hasValidDecimals(BigNumber(unstakeAmount.value).toFixed(), 18)
  ) {
    return 'Invalid decimals. ETH can only have 18 decimals';
  }
  return '';
});
const buyMoreStr = computed(() => {
  return isEthNetwork.value && !hasEnoughBalanceToStake.value
    ? network.value.type.canBuy
      ? 'Buy more.'
      : ''
    : null;
});

// watch
watch(
  () => gasPriceType.value,
  () => {
    locGasPrice.value = gasPriceByType(gasPriceType.value);
  }
);

// mounted
onMounted(() => {
  locGasPrice.value = gasPriceByType(gasPriceType.value);
});

// methods
const reset = () => {
  setAmount(0);
  loading.value = false;
};
const unstake = async () => {
  trackDapp(CB_TRACKING.CLICK_UNSTAKE);
  window.scrollTo(0, 0);
  loading.value = true;
  const { gasLimit, to, data, value, error } = await fetch(
    `${API}?address=${address.value}&action=unstake&networkId=${
      network.value.type.chainID
    }&amount=${toBase(unstakeAmount, 18)}`
  ).then(res => res.json());
  if (error) {
    const message = isEmpty(error)
      ? 'Something went wrong! Please try again!'
      : error.message;
    Toast(message, {}, ERROR);
    loading.value = false;
    trackDapp(CB_TRACKING.UNSTAKE_FAIL);
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
      EventBus.$emit('fetchSummary');
    })
    .then(() => {
      reset();
      EventBus.$emit('fetchSummary');
      Toast(
        'Successfully unstaked! Account will reflect once pool refreshes.',
        {},
        SUCCESS
      );
      trackDapp(CB_TRACKING.UNSTAKE_SUCCESS);
    })
    .catch(e => {
      reset();
      instance.value.errorHandler(e);
      trackDapp(CB_TRACKING.UNSTAKE_FAIL);
    });
};
const setAmount = debounce(function (val) {
  const value = val ? val : 0;
  unstakeAmount.value = BigNumber(value).toFixed();
}, 500);
const setMax = () => {
  if (hasEnoughBalanceToStake.value) {
    const max = BigNumber(stakedBalance.value);
    setAmount(max.toFixed());
  }
};
const openSettings = () => {
  EventBus.$emit('openSettings');
};
</script>

<style lang="scss" scoped>
.stake-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--v-borderInput-base) !important;
  border-radius: 50% !important;
  width: 52px;
  height: 52px;
  background-color: var(--v-alwaysWhite-base);

  img {
    height: 30px;
  }
}

ul {
  li {
    list-style: none;
    margin-bottom: 12px;

    &:before {
      font-size: 11px;
      content: '◆';
      margin-left: -23px;
      margin-right: 10px;
      color: var(--v-greenPrimary-base);
    }
  }
}
</style>
