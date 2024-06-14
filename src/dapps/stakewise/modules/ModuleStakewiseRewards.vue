<template>
  <div class="dapps-stakewise-rewards pt-8 pb-13 px-3 pa-sm-15">
    <v-row>
      <v-col cols="12">
        <mew-warning-sheet
          class="mb-5"
          title="StakeWise V3 is now live on
        mainnet"
          description="Please note that Stakewise V2 deposits are now
        disabled. You can redeem your sETH2 and rETH2 for ETH in the MEW Stakewise
        dApp, and then re-stake by using the Stakewise web app."
          :link-obj="linkObj"
          :bottom="false"
        />
      </v-col>
      <v-col
        :order="$vuetify.breakpoint.smAndDown ? 'last' : ''"
        cols="12"
        md="8"
        :class="$vuetify.breakpoint.smAndDown ? 'my-10' : 'pr-7'"
      >
        <mew-sheet class="pa-15">
          <div class="mew-heading-2 textDark--text mb-8">Compound Rewards</div>

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
                  src="@/dapps/stakewise/assets/icon-stakewise-red.svg"
                  alt="Stakewise rETH2"
                />
              </div>
              <div class="font-weight-bold mt-2">rETH2</div>
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
                <img
                  src="@/dapps/stakewise/assets/icon-stakewise-green.svg"
                  alt="Stakewise sETH2"
                />
              </div>
              <div class="font-weight-bold mt-2">sETH2</div>
            </div>
          </div>

          <!-- ======================================================================================= -->
          <!-- Amount to stake -->
          <!-- ======================================================================================= -->
          <div class="position--relative mt-15">
            <app-button-balance
              :loading="loadingBalance"
              :balance="rethBalance"
            />
            <mew-input
              type="number"
              :max-btn-obj="maxBtnObj"
              :image="iconStakewise"
              label="Amount to compound"
              :value="compoundAmount"
              placeholder="Enter amount"
              :error-messages="errorMessages"
              :disabled="true"
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
                <div class="">{{ ethTotalFee }} ETH</div>
                <div class="mew-label textLight--text">{{ gasPriceFiat }}</div>
              </div>
            </div>
          </div>

          <!-- ======================================================================================= -->
          <!-- Divier -->
          <!-- ======================================================================================= -->
          <v-divider class="mt-11" />

          <!-- ======================================================================================= -->
          <!-- How compounding works -->
          <!-- ======================================================================================= -->
          <div class="mt-6">
            <div class="font-weight-bold mb-2">How Compounding works</div>
            <div class="textMedium--text mb-5">
              To increase your staking balance and maximize your rewards, you
              can transfer your rETH2 rewards balance to the sETH2 staking pool.
            </div>

            <a
              href="https://help.myetherwallet.com/en/articles/6136823-stake-your-eth-using-stakewise"
              target="_blank"
            >
              <div class="greenPrimary--text">
                View StakeWise guide<v-icon
                  color="greenPrimary"
                  small
                  class="ml-2"
                >
                  mdi-open-in-new
                </v-icon>
              </div>
            </a>
          </div>

          <!-- ======================================================================================= -->
          <!-- Divier -->
          <!-- ======================================================================================= -->
          <v-divider class="mt-9 mb-8" />

          <!-- ======================================================================================= -->
          <!-- Start -->
          <!-- ======================================================================================= -->
          <div class="d-flex flex-column align-center">
            <mew-checkbox
              v-model="agreeToTerms"
              label="I have read and agreed to Stakewise terms of service."
              :link="{
                title: 'Stakewise terms',
                url: 'https://stakewise.io/terms-and-conditions/'
              }"
            />
            <mew-button
              class="mt-8"
              title="Compound rewards"
              btn-size="xlarge"
              :loading="loading"
              :disabled="!isValid"
              @click.native="showConfirm"
            />
          </div>
        </mew-sheet>
      </v-col>
      <v-col cols="12" md="4">
        <stakewise-apr class="mb-4" />
        <stakewise-staking
          class="mb-4"
          :tx-fee="txFee"
          :has-enough-balance="hasEnoughBalance"
          @set-max="setMax"
          @scroll="scroll"
          @redeem-to-eth="redeemToEth"
        />
        <stakewise-rewards
          v-if="isEthNetwork"
          :tx-fee="txFee"
          @set-max="setMax"
          @scroll="scroll"
          @redeem-to-eth="redeemToEth"
        />
      </v-col>
    </v-row>
  </div>
</template>

<script setup>
import { defineAsyncComponent, ref, computed, watch, onMounted } from 'vue';
import BigNumber from 'bignumber.js';
import { find, clone, isEmpty, debounce } from 'lodash';
import { fromWei } from 'web3-utils';

import { STAKEWISE_REWARD_MIN_GAS_LIMIT } from '@/core/configs/commons';

import { EventBus } from '@/core/plugins/eventBus';
import { formatFloatingPointValue } from '@/core/helpers/numberFormatHelper';
import Notification, {
  NOTIFICATION_TYPES,
  NOTIFICATION_STATUS
} from '@/modules/notifications/handlers/handlerNotification';
import {
  SETH2_MAINNET_CONTRACT,
  SETH2_GOERLI_CONTRACT,
  RETH2_MAINNET_CONTRACT,
  RETH2_GOERLI_CONTRACT,
  SETH2_Token,
  RETH2_Token,
  ETH_Token
} from '@/dapps/stakewise/handlers/configs.js';

import { ERROR, Toast } from '@/modules/toast/handler/handlerToast';
import Swapper from '@/modules/swap/handlers/handlerSwap';
import stakewiseHandler from '../handlers/stakewiseStakeHandler';
import { useAmplitude } from '@/core/composables/amplitude';
import { useGlobalStore } from '@/core/store/global';
import { useWalletStore } from '@/core/store/wallet';
import { useExternalStore } from '@/core/store/external';
import { useVuetify } from '@/core/composables/vuetify';
import { useStakewiseStore } from '../store';
import { useNotificationsStore } from '@/core/store/notifications';

const StakewiseApr = defineAsyncComponent(() =>
  import('../components/StakewiseApr')
);
const StakewiseStaking = defineAsyncComponent(() =>
  import('../components/StakewiseStaking')
);
const StakewiseRewards = defineAsyncComponent(() =>
  import('../components/StakewiseRewards')
);

// injections
const { trackDapp } = useAmplitude();
const { balanceInETH, tokensList, web3, instance, address } = useWalletStore();
const { network, gasPriceByType, getFiatValue, gasPriceType, isEthNetwork } =
  useGlobalStore();
const { rethBalance, sethBalance } = useStakewiseStore();
const { fiatValue } = useExternalStore();
const { addNotification } = useNotificationsStore();
const vuetify = useVuetify();

// data
const iconStakewise = require('@/dapps/stakewise/assets/icon-stakewise-red.svg');
// reactive
const compoundAmount = ref('0');
const locGasPrice = ref('0');
const gasLimit = ref('21000');
const availableQuotes = ref([]);
const selectedProvider = ref({});
const stakeHandler = ref({});
const currentTrade = ref(null);
const swapper = ref(null);
const loading = ref(false);
const agreeToTerms = ref(false);
const loadingBalance = ref(true);
const confirmInfo = ref({
  to: '',
  from: '',
  fromImg: '',
  toImg: '',
  fromType: '',
  toType: '',
  validUntil: 0,
  selectedProvider: '',
  txFee: ''
});
const linkObj = ref({
  title: 'Stakewise web app.',
  url: 'https://app.stakewise.io/'
});
const input = ref(null);

// computed
const reth2Contract = computed(() => {
  return isEthNetwork.value ? RETH2_MAINNET_CONTRACT : RETH2_GOERLI_CONTRACT;
});
const seth2Contract = computed(() => {
  return isEthNetwork.value ? SETH2_MAINNET_CONTRACT : SETH2_GOERLI_CONTRACT;
});
const hasReth = computed(() => {
  const token = find(
    tokensList.value,
    item => item.contract.toLowerCase() === reth2Contract.value.toLowerCase()
  );
  if (!token) {
    return RETH2_Token;
  }
  return token;
});
const hasSeth = computed(() => {
  const token = find(
    tokensList.value,
    item => item.contract.toLowerCase() === seth2Contract.value.toLowerCase()
  );
  if (!token) {
    return SETH2_Token;
  }
  return token;
});
const gasPrice = computed(() => {
  return BigNumber(locGasPrice.value).gt(0)
    ? BigNumber(locGasPrice.value)
    : BigNumber(gasPriceByType(gasPriceType.value));
});
const ethTotalFee = computed(() => {
  const locGasLimit = BigNumber(gasLimit.value).gt('21000')
    ? gasLimit.value
    : STAKEWISE_REWARD_MIN_GAS_LIMIT;
  const ethFee = fromWei(BigNumber(gasPrice).times(locGasLimit).toFixed());
  return formatFloatingPointValue(ethFee).value;
});
const gasPriceFiat = computed(() => {
  const gasPrice = BigNumber(ethTotalFee.value);
  return gasPrice.gt(0)
    ? getFiatValue(gasPrice.times(fiatValue.value).toFixed())
    : getFiatValue('0');
});
const hasEnoughBalance = computed(() => {
  return BigNumber(ethTotalFee.value).lte(balanceInETH.value);
});
const isValid = computed(() => {
  return (
    BigNumber(compoundAmount.value).gt(0) &&
    hasEnoughBalance.value &&
    agreeToTerms.value &&
    errorMessages.value === '' &&
    isEthNetwork.value
  );
});
const txFee = computed(() => {
  const locGasLimit = BigNumber(gasLimit.value).gt('21000')
    ? gasLimit.value
    : STAKEWISE_REWARD_MIN_GAS_LIMIT;
  const txFee = BigNumber(gasPrice).times(locGasLimit).toFixed();
  return txFee;
});
const overMaximum = computed(() => {
  return BigNumber(compoundAmount.value).gt(rethBalance.value);
});
const errorMessages = computed(() => {
  if (!isEthNetwork.value) {
    return 'Compunding rewards are not supported on non ETH network!';
  }
  if (BigNumber(compoundAmount.value).eq(0)) {
    return '';
  }
  if (BigNumber(compoundAmount.value).lt(0)) {
    return 'Value cannot be negative';
  }
  if (overMaximum.value) {
    return 'Exceeds rETH2 balance';
  }
  if (
    !isEmpty(selectedProvider.value) &&
    BigNumber(selectedProvider.value.minFrom).gt(compoundAmount.value)
  ) {
    return 'Not enough rETH2!';
  }

  if (
    BigNumber(compoundAmount.value).gt(0) &&
    !stakewiseHandler.value.helpers.hasValidDecimals(
      BigNumber(compoundAmount.value).toFixed(),
      18
    )
  ) {
    return 'Invalid decimals. ETH can only have 18 decimals';
  }
  return '';
});
const target = computed(() => {
  const value = element.value;
  if (!isNaN(value)) {
    return Number(value);
  }
  return value;
});
const element = computed(() => {
  return input;
});
const maxBtnObj = computed(() => {
  return {
    title: 'Max',
    disabled: true,
    method: setMax
  };
});

// watch
watch(
  () => gasPriceType.value,
  () => {
    locGasPrice.value = gasPriceByType(gasPriceType.value);
  }
);
watch(
  () => compoundAmount,
  value => {
    if (BigNumber(value).lte(balanceInETH.value) && BigNumber(value).gt(0)) {
      setGasLimit();
    }
  }
);
watch(
  () => isEthNetwork.value,
  () => {
    setup();
  }
);
watch(
  () => address.value,
  () => {
    setup();
  }
);

onMounted(() => {
  locGasPrice.value = gasPriceByType(gasPriceType.value);
  swapper.value = new Swapper(web3.value, network.value.type.name);
  setup();
});

// methods
const setAmount = debounce(function (val) {
  const value = val ? val : 0;
  compoundAmount.value = BigNumber(value).toFixed();
  stakeHandler.value._setAmount(BigNumber(value).toFixed());
  getQuote(hasReth.value, hasSeth.value, compoundAmount.value);
}, 500);
const setup = () => {
  stakeHandler.value = new stakewiseHandler(
    web3.value,
    isEthNetwork.value,
    address.value
  );
  loadingBalance.value = false;
};
const setMax = () => {
  const max = BigNumber(rethBalance.value);
  setAmount(max.toFixed());
};
const setupTrade = trade => {
  if (trade instanceof Error || !trade) {
    return;
  }
  currentTrade.value = trade;
  currentTrade.value.gasPrice = gasPrice.value;
};
const getQuote = (from, to, balance) => {
  if (
    balance !== '' &&
    balance > 0 &&
    !isEmpty(from) &&
    !isEmpty(to) &&
    !isEmpty(from?.symbol) &&
    !isEmpty(to?.symbol)
  ) {
    return swapper.value
      .getAllQuotes({
        fromT: from,
        toT: to,
        fromAmount: new BigNumber(balance).times(
          new BigNumber(10).pow(new BigNumber(from.decimals))
        )
      })
      .then(quotes => {
        availableQuotes.value = quotes.map(q => {
          q.rate = new BigNumber(q.amount)
            .dividedBy(new BigNumber(balance))
            .toFixed();
          selectedProvider.value = q;
          return q;
        });
      })
      .catch(err => {
        loading.value = false;
        Toast(err, {}, ERROR);
      });
  }
};
const getTrade = async (from, to, type) => {
  const balance = type === 'seth' ? sethBalance.value : rethBalance.value;
  try {
    const trade = await swapper.value.getTrade({
      fromAddress: address.value,
      toAddress: address.value,
      provider: availableQuotes.value[0].provider,
      fromT: from,
      toT: to,
      quote: availableQuotes.value[0],
      fromAmount: new BigNumber(balance).times(
        new BigNumber(10).pow(new BigNumber(from.decimals))
      )
    });
    if (trade instanceof Promise) {
      trade
        .then(tradeResponse => {
          setupTrade(tradeResponse);
        })
        .catch(err => {
          loading.value = false;
          Toast(err, {}, ERROR);
        });
    } else {
      setupTrade(trade);
    }
  } catch (err) {
    loading.value = false;
    Toast(err, {}, ERROR);
  }
};
const showConfirm = async () => {
  trackDapp('stakewiseRewardsShowConfirm');
  try {
    loading.value = true;
    await getTrade(hasReth.value, hasSeth.value, 'reth');
    confirmInfo.value = {
      from: hasReth.value.contract,
      to: hasSeth.value.contract,
      fromType: hasReth.value.symbol,
      toType: hasSeth.value.symbol,
      fromImg: hasReth.value.img,
      toImg: hasSeth.value.img,
      fromVal: rethBalance.value,
      toVal: rethBalance.value,
      fromUsdVal: BigNumber(hasReth.value.price ? hasReth.value.price : 0)
        .times(rethBalance.value)
        .toFixed(),
      toUsdVal: BigNumber(hasSeth.value.price ? hasSeth.value.price : 0)
        .times(rethBalance.value)
        .toFixed(),
      validUntil: new Date().getTime() + 10 * 60 * 1000,
      selectedProvider: selectedProvider.value,
      txFee: txFee,
      gasPriceType: gasPriceType.value
    };
    executeTrade();
  } catch (err) {
    loading.value = false;
    instance.value.errorHandler(err.message, {}, ERROR);
  }
};
const executeTrade = () => {
  const currentTradeCopy = clone(currentTrade);
  try {
    loading.value = false;
    swapper.value
      .executeTrade(currentTrade, confirmInfo)
      .then(res => {
        trackDapp('stakewiseCompoundRewards');
        swapNotificationFormatter(res, currentTradeCopy);
      })
      .then(() => {
        setAmount(0);
        compoundAmount.value = '0';
        locGasPrice.value = '0';
        gasLimit.value = '21000';
        agreeToTerms.value = false;
      })
      .catch(err => {
        loading.value = false;
        instance.value.errorHandler(err.message, {}, ERROR);
      });
  } catch (err) {
    loading.value = false;
    instance.value.errorHandler(err.message, {}, ERROR);
  }
};
const swapNotificationFormatter = (obj, currentTrade) => {
  obj.hashes.forEach((hash, idx) => {
    const notif = Object.assign(
      {
        hash,
        from: address.value,
        type: NOTIFICATION_TYPES.SWAP,
        network: network.value.type.name,
        status: NOTIFICATION_STATUS.PENDING,
        fromTxData: {
          currency: confirmInfo.value.fromType,
          amount: confirmInfo.value.fromVal,
          icon: confirmInfo.value.fromImg
        },
        toTxData: {
          currency: confirmInfo.value.toType,
          amount: confirmInfo.value.toVal,
          icon: confirmInfo.value.toImg,
          to: confirmInfo.value.to
            ? confirmInfo.value.to
            : currentTrade.transactions[idx].to
        },
        swapObj: obj
      },
      currentTrade.transactions[idx]
    );
    addNotification(new Notification(notif));
  });
};
const redeemToEth = async (type, balance) => {
  const eth = type === 'seth' ? hasSeth.value : hasReth.value;
  await getQuote(eth, ETH_Token, balance);
  try {
    loading.value = true;
    await getTrade(eth, ETH_Token, type);
    confirmInfo.value = {
      from: eth.contract,
      to: ETH_Token.contract,
      fromType: eth.symbol,
      toType: ETH_Token.symbol,
      toTokenType: {
        isEth: true
      },
      fromImg: eth.img,
      toImg: ETH_Token.img,
      fromVal: balance,
      toVal: balance,
      toUsdVal: BigNumber(ETH_Token.price ? ETH_Token.price : 0)
        .times(rethBalance.value)
        .toFixed(),
      fromUsdVal: BigNumber(eth.price ? eth.price : 0)
        .times(rethBalance.value)
        .toFixed(),
      validUntil: new Date().getTime() + 10 * 60 * 1000,
      selectedProvider: selectedProvider.value,
      txFee: txFee,
      gasPriceType: gasPriceType.value
    };
    await executeTrade();
  } catch (err) {
    loading.value = false;
    instance.value.errorHandler(err.message, {}, ERROR);
  }
};
const openSettings = () => {
  EventBus.$emit('openSettings');
};
const scroll = () => {
  vuetify.goTo(target);
};
const setGasLimit = () => {
  stakeHandler.value
    .getTransactionFee()
    .then(res => {
      gasLimit.value = res;
      stakeHandler.value._setGasLimit(res);
    })
    .catch(err => {
      Toast(err, {}, ERROR);
    });
};
</script>

<style lang="scss" scoped>
.stake-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--v-greyLight-base) !important;
  border-radius: 50% !important;
  width: 52px;
  height: 52px;
  background-color: var(--v-whiteBackground-base);

  img {
    height: 30px;
  }
}

ul {
  li {
    margin-bottom: 12px;
    padding-left: 27px;

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
