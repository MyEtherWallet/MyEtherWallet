<template>
  <div>
    <div class="textMedium--text mb-5">
      This fee is charged by the Ethereum network and fluctuates depending on
      network traffic. MEW does not profit from this fee.
    </div>

    <!--
    =====================================================================================
      Economic / Regular / Fast
    =====================================================================================
    -->
    <div>
      <div
        v-for="(b, key) in buttons"
        :id="$data[`${b.title}Disabled`] ? 'disabled' : ''"
        :key="key"
        class="mb-2 d-flex align-center justify-space-between group-button"
        :class="[gasPriceType === b.title ? 'active' : '']"
        @click.stop="
          () => {
            setSelected(b.title);
          }
        "
      >
        <div class="d-flex align-center">
          <div
            class="mr-1 ml-n1 text-center"
            style="width: 40px; line-height: 0"
          >
            <v-icon v-if="b.title === gasPriceTypes.ECONOMY" color="textDark">
              mdi-check
            </v-icon>
            <img
              v-if="b.title === gasPriceTypes.REGULAR"
              :class="isDark ? 'dark-icon' : ''"
              src="@/assets/images/icons/icon-arrow-up.svg"
              alt="arrow up"
              height="15"
            />
            <img
              v-if="b.title === gasPriceTypes.FAST"
              :class="isDark ? 'dark-icon' : ''"
              src="@/assets/images/icons/icon-arrow-up.svg"
              alt="arrow up"
              height="15"
            />
            <img
              v-if="b.title === gasPriceTypes.FAST"
              :class="isDark ? 'dark-icon' : ''"
              src="@/assets/images/icons/icon-arrow-up.svg"
              alt="arrow up"
              height="15"
            />
          </div>
          <div>
            <div class="mew-heading-3 font-weight-regular textDark--text">
              {{ b.priority }}
            </div>
            <div v-if="!fromSettings" class="prices d-flex">
              <div
                v-if="b.title === gasPriceTypes.ECONOMY"
                class="secondary--text mr-2"
              >
                {{ economyInEth }} {{ currencyName }}
              </div>
              <div
                v-if="b.title === gasPriceTypes.REGULAR"
                class="secondary--text mr-2"
              >
                {{ regularInEth }} {{ currencyName }}
              </div>
              <div
                v-if="b.title === gasPriceTypes.FAST"
                class="secondary--text mr-2"
              >
                {{ fastInEth }} {{ currencyName }}
              </div>
              <div
                v-if="b.title === gasPriceTypes.ECONOMY"
                class="textLight--text"
              >
                {{ economyInUsd }}
              </div>
              <div
                v-if="b.title === gasPriceTypes.REGULAR"
                class="textLight--text"
              >
                {{ regularInUsd }}
              </div>
              <div
                v-if="b.title === gasPriceTypes.FAST"
                class="textLight--text"
              >
                {{ fastInUsd }}
              </div>
            </div>
          </div>
        </div>

        <!-- Show Priority Time-->
        <div class="d-flex align-center">
          <v-icon class="mr-1" color="greenPrimary" small
            >mdi-clock-outline</v-icon
          >
          <div class="greenPrimary--text">{{ b.time }}</div>
        </div>
      </div>
    </div>
    <div class="mt-4 d-flex flex-column align-center">
      <div v-if="!fromSettings && showGetMoreEth" class="mt-3">
        <span class="secondary--text">Can't increase priority? </span>
        <a
          v-if="network.type.canBuy"
          @click="
            () => {
              openBuySell('SettingsGasPrice');
            }
          "
        >
          Buy more {{ network.type.currencyName }}
        </a>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, ref, computed, watch, onMounted } from 'vue';
import { fromWei } from 'web3-utils';
import BigNumber from 'bignumber.js';

import { gasPriceTypes } from '@/core/helpers/gasPriceHelper';
import {
  formatFiatValue,
  formatFloatingPointValue,
  toBNSafe
} from '@/core/helpers/numberFormatHelper';

import { useGlobalStore } from '@/core/store/global';
import { useWalletStore } from '@/core/store/wallet';
import { useExternalStore } from '@/core/store/external';

import { useBuySell } from '@/core/composables/buyMore';
import { useVuetify } from '@/core/composables/vuetify';

// injections/use
const { openBuySell } = useBuySell();
const { gasPriceByType, network, preferredCurrency, gasPriceType, gasPrice } =
  useGlobalStore();
const { fiatValue } = useExternalStore();
const { balanceInETH } = useWalletStore();
const vuetify = useVuetify();

// props
const props = defineProps({
  setSelected: {
    type: Function,
    default: () => {}
  },
  buttons: {
    type: Array,
    default: () => []
  },
  notEnoughEth: {
    type: Boolean,
    default: false
  },
  totalGasLimit: {
    type: String,
    default: '0'
  },
  fromSettings: {
    type: Boolean,
    default: false
  },
  costInEth: {
    type: String,
    default: '0'
  }
});

// data
const previousSelected = ref(null);
const economyDisabled = ref(false);
const regularDisabled = ref(false);
const fastDisabled = ref(false);

// computed
const currencyName = computed(() => {
  return network.value.type.currencyName;
});
const economyInEth = computed(() => {
  const txFee = calcTxFee(gasPriceTypes.ECONOMY);
  return formatInEth(txFee);
});
const regularInEth = computed(() => {
  const txFee = calcTxFee(gasPriceTypes.REGULAR);
  return formatInEth(txFee);
});
const fastInEth = computed(() => {
  const txFee = calcTxFee(gasPriceTypes.FAST);
  return formatInEth(txFee);
});
const economyInUsd = computed(() => {
  const txFee = calcTxFee(gasPriceTypes.ECONOMY);
  return formatInUsd(txFee);
});
const regularInUsd = computed(() => {
  const txFee = calcTxFee(gasPriceTypes.REGULAR);
  return formatInUsd(txFee);
});
const fastInUsd = computed(() => {
  const txFee = calcTxFee(gasPriceTypes.FAST);
  return formatInUsd(txFee);
});
const showGetMoreEth = computed(() => {
  let counter = 0;
  Object.values(gasPriceTypes).forEach(item => {
    if (!this[`${item}Disabled`]) {
      counter++;
    }
  });

  return counter < 3;
});
const isDark = computed(() => {
  return vuetify.theme.dark;
});

// watch
/**
 * If not enough balance to cover new priority, go back to previous priority
 */
watch(
  () => props.fromSettings,
  () => {
    setGasType();
  }
);
watch(
  () => gasPriceType,
  () => {
    setGasType();
  }
);
watch(
  () => gasPrice,
  () => {
    recalculate();
  }
);
watch(
  () => props.costInEth,
  () => {
    recalculate();
  }
);
watch(
  () => props.notEnoughEth,
  () => {
    recalculate();
  }
);

// mounted
onMounted(() => {
  recalculate();
  previousSelected.value = gasPriceType.value;
});

// methods
const setGasType = () => {
  if (props.notEnoughEth && !props.fromSettings) {
    if (gasPriceType.value == 'regular') {
      regularDisabled.value = true;
      fastDisabled.value = true;
    } else if (gasPriceType.value == 'fast') {
      fastDisabled.value = true;
    } else {
      economyDisabled.value = true;
      regularDisabled.value = true;
      fastDisabled.value = true;
    }
    props.setSelected(previousSelected);
    if (!props.notEnoughEth) {
      previousSelected.value = gasPriceType.value;
    }
  }
};
const calcTxFee = priority => {
  return fromWei(
    toBNSafe(props.totalGasLimit)
      .mul(toBNSafe(gasPriceByType(priority)))
      .toString()
  );
};
const formatInEth = fee => {
  return formatFloatingPointValue(fee).value;
};
const formatInUsd = fee => {
  const number = BigNumber(fee).times(fiatValue.value).toFixed(2);
  return formatFiatValue(number, {
    currency: preferredCurrency.value
  }).value;
};
const recalculate = () => {
  const amount = BigNumber(props.costInEth).minus(
    this[`${gasPriceType.value}InEth`]
  );
  Object.values(gasPriceTypes).forEach(item => {
    const withFee = BigNumber(amount).plus(this[`${item}InEth`]);
    this[`${item}Disabled`] = withFee.gt(balanceInETH.value);
  });
};
</script>

<style lang="scss" scoped>
.group-button {
  min-height: 72px;
  padding: 5px 16px;
  border-radius: 8px;
  cursor: pointer;
  user-select: none;
  width: 100%;
  border: 1px solid var(--v-buttonBorder-base);
  background-color: var(--v-buttonGrayLight-base);
  &.active {
    border: 2px solid #05c0a5;
    opacity: 1 !important;
  }
  &:hover {
    opacity: 1 !important;
    background-color: var(--v-buttonGrayLight-base);
  }
}

#disabled {
  opacity: 0.5;
  pointer-events: none;
}
.buy-eth:hover {
  cursor: pointer;
}
.prices {
  white-space: nowrap;
  font-size: 14px;
}
.dark-icon {
  filter: invert(1);
}
</style>
