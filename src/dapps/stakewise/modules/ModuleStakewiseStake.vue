<template>
  <div class="dapps-stakewise-stake pt-8 pb-13 px-3 pa-sm-15">
    <v-row align="center" justify="center">
      <v-col cols="10">
        <mew-warning-sheet
          class="mb-5"
          title="StakeWise V3 is now live on
        mainnet"
          description="The Stakewise integration on MEW is no longer accepting deposits. You can still unstake your ETH by redeeming your sETH2 and rETH2 tokens."
          :bottom="false"
        />
      </v-col>
      <v-col
        :order="vuetify.breakpoint.smAndDown ? 'last' : ''"
        cols="12"
        md="10"
        :class="vuetify.breakpoint.smAndDown ? 'my-10' : ''"
      >
        <mew-sheet class="pa-15">
          <div class="mew-heading-4 font-weight-bold">
            MEW will no longer be accepting new deposits in the integrated
            Stakewise app. Unstaking continues to be available. Users who staked
            with Stakewise via MEW have the following options:
          </div>
          <!-- ======================================================================================= -->
          <!-- How stake works -->
          <!-- ======================================================================================= -->
          <div class="mt-6">
            <ul class="textMedium--text">
              <li class="mb-2">
                <a
                  href="https://help.myetherwallet.com/en/articles/6136823-stake-your-eth-using-stakewise"
                  target="_blank"
                  >Unstake your ETH from Stakewise
                </a>
                in MEW and re-stake via one of our staking partners - Staked.us,
                for full validators staking, and Coinbase, for staking any
                amount with no minimum.
              </li>
              <li class="mb-2">
                Connect your wallet to the
                <a href="https://app.stakewise.io/" target="_blank"
                  >Stakewise web app</a
                >
                to view and continue managing your stake there.
              </li>
            </ul>
          </div>

          <!-- ======================================================================================= -->
          <!-- Divier -->
          <!-- ======================================================================================= -->
          <v-divider class="mt-9 mb-8" />
          <v-row>
            <v-col cols="6">
              <stakewise-staking
                class="mb-4"
                :tx-fee="txFee"
                :has-enough-balance="hasEnoughBalance"
                @set-max="setMax"
                @scroll="scroll"
                @redeem-to-eth="redeemToEth"
              />
            </v-col>
            <v-col cols="6">
              <stakewise-rewards
                v-if="isEthNetwork"
                :tx-fee="txFee"
                @set-max="setMax"
                @scroll="scroll"
                @redeem-to-eth="redeemToEth"
              />
            </v-col>
          </v-row>
        </mew-sheet>
      </v-col>
    </v-row>
  </div>
</template>

<script>
const MIN_GAS_LIMIT = 150000;
</script>
<script setup>
import { defineAsyncComponent, ref, computed, watch, onMounted } from 'vue';
import { fromWei } from 'web3-utils';

import BigNumber from 'bignumber.js';
import { debounce, isEmpty, clone, find } from 'lodash';

import { formatFloatingPointValue } from '@/core/helpers/numberFormatHelper';
import { ERROR, Toast } from '@/modules/toast/handler/handlerToast';
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

import stakewiseHandler from '../handlers/stakewiseStakeHandler';
import Swapper from '@/modules/swap/handlers/handlerSwap';
import { useAmplitude } from '@/core/composables/amplitude';
import { useGlobalStore } from '@/core/store/global';
import { useWalletStore } from '@/core/store/wallet';
import { useVuetify } from '@/core/composables/vuetify';
import { useNotificationsStore } from '@/core/store/notifications';
import { useStakewiseStore } from '../store';

const StakewiseStaking = defineAsyncComponent(() =>
  import('../components/StakewiseStaking')
);
const StakewiseRewards = defineAsyncComponent(() =>
  import('../components/StakewiseRewards')
);

// injections/use
const { trackDapp } = useAmplitude();
const { balanceInETH, instance, tokensList, address, web3 } = useWalletStore();
const { addNotification } = useNotificationsStore();
const { network, isEthNetwork, gasPriceByType, updateGasPrice, gasPriceType } =
  useGlobalStore();
const { sethBalance, rethBalance } = useStakewiseStore();
const vuetify = useVuetify();

// data
const stakeAmount = ref('0');
const locGasPrice = ref('0');
const gasLimit = ref('21000');
const stakeHandler = ref({});
const agreeToTerms = ref(false);
const estimateGasError = ref(false);
const swapper = ref(null);
const currentTrade = ref(null);
const availableQuotes = ref([]);
const selectedProvider = ref({});
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
const input = ref(null);
const loading = ref(true);

// computed
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
const hasEnoughBalanceToStake = computed(() => {
  return BigNumber(ethTotalFee.value)
    .plus(stakeAmount.value)
    .lte(balanceInETH.value);
});
const hasEnoughBalance = computed(() => {
  return BigNumber(ethTotalFee.value).lte(balanceInETH.value);
});
const target = computed(() => {
  const value = element.value;
  if (!isNaN(value)) {
    return Number(value);
  }
  return value;
});
const element = computed(() => {
  return input.value;
});
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
const txFee = computed(() => {
  const locGasLimit = BigNumber(gasLimit.value).gt('21000')
    ? gasLimit.value
    : MIN_GAS_LIMIT;
  const txFee = BigNumber(locGasPrice).times(locGasLimit).toFixed();
  return txFee;
});

// watch
watch(
  () => locGasPrice,
  newVal => {
    stakeHandler.value._setGasPrice(newVal);
  }
);
watch(
  () => gasPriceType.value,
  () => {
    locGasPrice.value = gasPriceByType(gasPriceType.value);
  }
);
watch(
  () => stakeAmount,
  value => {
    const val = value ? value : 0;
    stakeHandler.value._setAmount(BigNumber(val).toFixed());

    if (BigNumber(value).lte(balanceInETH.value) && BigNumber(value).gt(0)) {
      setGasLimit();
    }
  }
);
watch(
  () => address.value,
  () => {
    setup();
  }
);
watch(
  () => web3.value,
  () => {
    setup();
    setGasPrice();
  }
);

// mounted
onMounted(() => {
  setup();
  locGasPrice.value = gasPriceByType(gasPriceType.value);
  swapper.value = new Swapper(web3.value, network.value.type.name);
});

// methods
const setAmount = debounce(function (val) {
  const value = val ? val : 0;
  stakeAmount.value = BigNumber(value).toFixed();
}, 500);
const setup = () => {
  stakeAmount.value = '0';
  stakeHandler.value = {};
  stakeHandler.value = new stakewiseHandler(
    web3.value,
    isEthNetwork.value,
    address.value
  );
};
const setGasPrice = () => {
  updateGasPrice();
  locGasPrice.value = gasPriceByType(gasPriceType.value);
};
const setGasLimit = () => {
  estimateGasError.value = false;
  stakeHandler.value
    .getTransactionFee()
    .then(res => {
      gasLimit.value = res;
      stakeHandler.value._setGasLimit(res);
    })
    .catch(() => {
      estimateGasError.value = true;
    });
};
const setMax = () => {
  if (hasEnoughBalanceToStake.value) {
    const max = BigNumber(balanceInETH.value).minus(BigNumber(ethTotalFee));
    setAmount(max.toFixed());
  }
};
const scroll = () => {
  vuetify.goTo(target);
};
const setupTrade = trade => {
  if (trade instanceof Error || !trade) {
    return;
  }
  currentTrade.value = trade;
  currentTrade.value.gasPrice = locGasPrice;
};
const getQuote = async (from, to, balance) => {
  if (
    balance !== '' &&
    balance > 0 &&
    !isEmpty(from) &&
    !isEmpty(to) &&
    !isEmpty(from?.symbol) &&
    !isEmpty(to?.symbol)
  ) {
    return await swapper.value
      .getAllQuotes({
        fromT: from,
        toT: to,
        fromAmount: new BigNumber(balance).times(
          new BigNumber(10).pow(new BigNumber(from.decimals))
        )
      })
      .then(async quotes => {
        availableQuotes.value = await quotes.map(q => {
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
const executeTrade = type => {
  const currentTradeCopy = clone(currentTrade);
  try {
    loading.value = false;
    swapper.value
      .executeTrade(currentTrade, confirmInfo)
      .then(res => {
        swapNotificationFormatter(res, currentTradeCopy);
      })
      .then(() => {
        trackDapp(`stakewiseRedeem${type === 'seth' ? 'Seth' : 'Reth'}Fail`);
        setAmount(0);
        locGasPrice.value = gasPriceByType(gasPriceType.value);
        gasLimit.value = '21000';
        agreeToTerms.value = false;
      })
      .catch(err => {
        trackDapp(`stakewiseRedeem${type === 'seth' ? 'Seth' : 'Reth'}Success`);
        loading.value = false;
        Toast(err.message, {}, ERROR);
      });
  } catch (err) {
    loading.value = false;
    instance.value.errorHandler(err.message, {}, ERROR);
    trackDapp(`stakewiseRedeem${type === 'seth' ? 'Seth' : 'Reth'}Fail`);
  }
};
const swapNotificationFormatter = (obj, currentTrade) => {
  obj.hashes.forEach((hash, idx) => {
    const notif = Object.assign(
      {
        hash,
        from: address.value,
        type: NOTIFICATION_TYPES.SWAP,
        network: network.type.name,
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
  const eth = type === 'seth' ? hasSeth : hasReth;
  trackDapp(`stakewiseRedeem${type === 'seth' ? 'Seth' : 'Reth'}`);
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
        .times(sethBalance.value)
        .toFixed(),
      fromUsdVal: BigNumber(eth.price ? eth.price : 0)
        .times(sethBalance.value)
        .toFixed(),
      validUntil: new Date().getTime() + 10 * 60 * 1000,
      selectedProvider: selectedProvider.value,
      txFee: txFee.value,
      gasPriceType: gasPriceType.value
    };
    await executeTrade(type);
  } catch (err) {
    loading.value = false;
    instance.value.errorHandler(err.message, {}, ERROR);
  }
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
