<template>
  <div>
    <!--
    ===================================================
      Updated Block Information // Will delete old one later
    ===================================================
    -->
    <div class="alert-container mb-10">
      <v-row class="alert-container-top pt-4 px-3">
        <v-col cols="12" class="d-flex align-center">
          <v-icon :class="['mr-2', alertTitleColor]" size="16px">{{
            alertIcon
          }}</v-icon>
          <p :class="['font-weight-bold mb-0', alertTitleColor]">
            {{ alertTitle }}
          </p>
        </v-col>
      </v-row>
      <v-row v-if="isAvailable" class="mt-1 px-3" align="center">
        <!--
        ===================================================
          Block is available: BLOCK PRICE INFO
        ===================================================
        -->
        <v-col cols="6">
          <div>Price</div>
        </v-col>
        <v-col cols="6" class="text-end">
          <div>
            <h2 class="mb-1 textDark--text">
              {{ formattedPrice }} {{ network.type.currencyName }}
            </h2>
            <p v-if="!isTestNetwork" class="textLight--text mb-0">
              {{ formatFiatPrice }}
            </p>
          </div>
        </v-col>
      </v-row>

      <v-row v-if="isAvailable" class="mt-1 px-3" align="center">
        <!--
        ===================================================
          Block is available: TOTAL PRICE INFO
        ===================================================
        -->
        <v-col cols="6">
          <div>Transaction fee</div>
        </v-col>
        <v-col cols="6" class="text-end">
          <div>
            <h2 class="mb-1 textDark--text">
              {{ txFee }} {{ network.type.currencyName }}
            </h2>
            <p v-if="!isTestNetwork" class="textLight--text mb-0">
              {{ formattedFiatTxFee }}
            </p>
          </div>
        </v-col>
      </v-row>

      <v-row v-if="isAvailable" class="mt-1 px-3" align="center">
        <!--
        ===================================================
          Block is available: TOTAL PRICE INFO
        ===================================================
        -->
        <v-col cols="6">
          <div>Total</div>
        </v-col>
        <v-col cols="6" class="text-end">
          <div>
            <h2 class="mb-1 textDark--text">
              {{ formattedFiatTotalPrice }} {{ network.type.currencyName }}
            </h2>
            <p v-if="!isTestNetwork" class="textLight--text mb-0">
              {{ formattedTotalPrice }}
            </p>
          </div>
        </v-col>
      </v-row>

      <v-row class="px-3 py-4">
        <!--
        ===================================================
          Block Buttons
        ===================================================
        -->
        <v-col cols="6">
          <mew-button
            btn-style="outline"
            color-theme="primary"
            has-full-width
            :disabled="!isAdded && isAvailable"
            @click.native="addToCart"
          >
            <div class="d-flex align-center">
              <v-icon v-if="isAdded && isAvailable" left
                >mdi-plus-circle-outline</v-icon
              >
              <div>{{ addText }}</div>
            </div>
          </mew-button>
        </v-col>
        <v-col cols="6">
          <mew-button
            v-if="!isPending"
            :title="vuetify.breakpoint.xs ? 'Mint' : 'Mint now'"
            btn-style="background"
            color-theme="primary"
            has-full-width
            :loading="disableAction"
            :disabled="disableActionBtn"
            @click.native="emitMint()"
          >
          </mew-button>
          <mew-button v-else disabled btn-style="light">
            <div class="d-flex flex-row align-center">
              <v-progress-circular
                indeterminate
                color="primary"
                class="ma-auto"
                size="16"
                width="2"
              ></v-progress-circular>
              <div class="textDark--text pl-2">Pending</div>
            </div>
          </mew-button>
        </v-col>
      </v-row>
    </div>
    <mew-alert :theme="alertTheme" hide-alert-icon hide-close-icon>
      <v-row class="align-center justify-start" no-gutters>
        <!--
        ===================================================
          ALERT TITLE:
        ===================================================
        -->
        <v-col cols="12" class="d-flex align-center">
          <v-icon :class="['mr-2', alertTitleColor]" size="16px">{{
            alertIcon
          }}</v-icon>
          <p :class="['font-weight-bold mb-0', alertTitleColor]">
            {{ alertTitle }}
          </p>
        </v-col>
        <!--
        ===================================================
          Block is Not available: OWNER INFO
        ===================================================
        -->
        <v-col v-if="isNotAvailable" cols="12" class="d-flex align-center mt-3">
          <p class="mb-0 mr-1">Owner:</p>
          <a :href="raribleOwnerLink" target="_blank">
            {{ ownerFormatted }}
          </a>
        </v-col>
        <!--
        ===================================================
          Block is Not available: Rarible LINK
        ===================================================
        -->
        <v-col v-if="isNotAvailable" cols="12" class="mt-1">
          <a :href="raribleLink" target="_blank" class="d-flex align-center">
            <p class="mb-0">See if it's available on Rarible</p>
            <v-icon class="ml-2 greenPrimary--text" size="16px"
              >mdi-open-in-new</v-icon
            >
          </a>
        </v-col>
        <!--
        ===================================================
          Block is available: PRICE INFO
        ===================================================
        -->
        <v-col v-if="isAvailable" cols="6" class="mt-1">
          <h2 class="mb-1 textDark--text">
            {{ formattedPrice }} {{ network.type.currencyName }}
          </h2>
          <p v-if="!isTestNetwork" class="textLight--text mb-0">
            {{ formatFiatPrice }}
          </p>
        </v-col>
        <!--
        ===================================================
          Block is available: MINT BUTTON
        ===================================================
        -->
        <v-col v-if="isAvailable" cols="6" class="mt-1 d-flex justify-end">
          <mew-button
            v-if="!isPending"
            :title="vuetify.breakpoint.xs ? 'Mint' : 'Mint Block'"
            :disabled="disableActionBtn"
            :loading="disableAction"
            @click.native="emitMint()"
          />
          <mew-button v-else disabled btn-style="light">
            <div class="d-flex flex-row align-center">
              <v-progress-circular
                indeterminate
                color="primary"
                class="ma-auto"
                size="16"
                width="2"
              ></v-progress-circular>
              <div class="textDark--text pl-2">Pending</div>
            </div>
          </mew-button>
        </v-col>
        <!--
        ===================================================
          Block is owned: SEND NFT BUTTON
        ===================================================
        -->
        <v-col v-if="isOwned" cols="12" sm="6" class="mt-4 pr-sm-2 mb-sm-2">
          <mew-button
            v-if="!isPending"
            has-full-width
            title="Send ETH Block"
            btn-style="outline"
            :disabled="disableActionBtn"
            :loading="disableAction"
            @click.native="emitOpenSend()"
          />
          <mew-button v-else disabled btn-style="light">
            <div class="d-flex flex-row align-center">
              <v-progress-circular
                indeterminate
                color="primary"
                class="ma-auto"
                size="16"
                width="2"
              ></v-progress-circular>
              <div class="textDark--text pl-2">Pending</div>
            </div>
          </mew-button>
        </v-col>
        <!--
        ===================================================
          Block is owned: LIST FOR SALE BUTTON
        ===================================================
        -->
        <v-col
          v-if="isOwned"
          cols="12"
          sm="6"
          class="mt-5 mb-2 mt-sm-4 pl-sm-2"
          :order="vuetify.breakpoint.xs ? 'last' : ''"
        >
          <mew-button
            v-if="!isPending"
            has-full-width
            :btn-link="raribleLink"
            @click.native="trackToRarible"
          >
            <v-row class="align-center justify-center">
              <div>List for sale</div>
              <v-icon class="ml-2 white--text" size="16px"
                >mdi-open-in-new</v-icon
              >
            </v-row>
          </mew-button>
        </v-col>
        <!--
        ===================================================
          Block is available OR is Owned: not enough ETH
        ===================================================
        -->
        <v-col
          v-if="!hasEnoughEth && (isOwned || isAvailable)"
          cols="12"
          :class="[
            'd-flex align-center mt-1',
            isOwned ? 'justify-start' : 'justify-end'
          ]"
        >
          <div class="mb-0 redPrimary--text mew-label d-flex">
            <span
              >{{ notEnoughMessage }}
              <a
                v-if="!isTestNetwork && network.type.canBuy"
                class="mew-label font-weight-medium buy-more-link"
                @click="
                  () => {
                    openBuySell('ETHBlocksAlert');
                  }
                "
              >
                Buy more {{ network.type.name }}.

                <span
                  ><mew-tooltip
                    class="d-inline-block"
                    :text="estimatedFeesTooltip"
                /></span>
              </a>
              <span v-else
                ><mew-tooltip
                  class="buy-more-link d-inline-block"
                  :text="estimatedFeesTooltip"
              /></span>
            </span>
          </div>
        </v-col>
        <!--
        ===================================================
          Block is reserved
        ===================================================
        -->
        <v-col v-if="isReserved" cols="12" class="d-flex align-center mt-3">
          <p class="mb-0 textLight--text">
            ETH Blocks 1-10 are reserved for the Ethereum founders
          </p>
        </v-col>
      </v-row>
    </mew-alert>
  </div>
</template>
<script setup>
import { computed } from 'vue';
import { fromWei } from 'web3-utils';
import BigNumber from 'bignumber.js';

import {
  RARIBLE_TOKEN,
  RARIBLE_OWNER,
  RARIBLE_TEST_TOKEN,
  RARIBLE_TEST_OWNER
} from '@/core/configs/commons';

import {
  BLOCK_ALERT,
  blockAlertValidator
} from '../handlers/helpers/blockAlertType';
import {
  formatIntegerToString,
  formatFloatingPointValue
} from '@/core/helpers/numberFormatHelper';

import { useBuySell } from '@/core/composables/buyMore';
import { useAmplitude } from '@/core/composables/amplitude';
import { useGlobalStore } from '@/core/store/global';
import { useExternalStore } from '@/core/store/external';
import { useEthBlocksTxsStore } from '../store';
import { useVuetify } from '../composables/vuetify';

// emit
const emit = defineEmits(['mint', 'openSend']);

// injections/use
const { openBuySell } = useBuySell();
const { trackDapp } = useAmplitude();
const { network, isTestNetwork, getFiatValue, gasPrice } = useGlobalStore();
const { fiatValue } = useExternalStore();
const { cart, addBlockToCart } = useEthBlocksTxsStore();
const vuetify = useVuetify();

// props
const props = defineProps({
  blockAlert: {
    default: BLOCK_ALERT.NOT_AVAILABLE,
    validator: blockAlertValidator
  },
  owner: {
    type: String,
    default: ''
  },
  price: {
    type: String,
    default: ''
  },
  disableAction: {
    type: Boolean,
    default: false
  },
  isPending: {
    type: Boolean,
    default: false
  },
  blockNumber: {
    type: String,
    default: ''
  },
  hasEnoughEth: {
    type: Boolean,
    default: true
  },
  estimatedTotalWei: {
    type: String,
    default: '0'
  }
});

// computed
/**
 * @returns{string}
 */
const alertTheme = computed(() => {
  switch (props.blockAlert) {
    case BLOCK_ALERT.NOT_AVAILABLE:
      return 'warning';
    case BLOCK_ALERT.AVAILABLE:
      return 'success';
    case BLOCK_ALERT.RESERVED:
      return 'error';
    default:
      return 'info';
  }
});
/**
 * @returns{string}
 */
const alertTitle = computed(() => {
  switch (props.blockAlert) {
    case BLOCK_ALERT.NOT_AVAILABLE:
      return 'This block is not available';
    case BLOCK_ALERT.AVAILABLE:
      return 'This block is available';
    case BLOCK_ALERT.RESERVED:
      return 'This block is reserved';
    default:
      return 'You own this ETH Block';
  }
});
/**
 * @returns{string}
 */
const alertTitleColor = computed(() => {
  switch (props.blockAlert) {
    case BLOCK_ALERT.NOT_AVAILABLE:
      return 'orangePrimary--text';
    case BLOCK_ALERT.AVAILABLE:
      return 'greenPrimary--text';
    case BLOCK_ALERT.RESERVED:
      return 'redPrimary--text';
    default:
      return 'bluePrimary--text';
  }
});
/**
 * @returns{string}
 */
const alertIcon = computed(() => {
  switch (props.blockAlert) {
    case BLOCK_ALERT.NOT_AVAILABLE:
      return 'mdi-alert';
    case BLOCK_ALERT.AVAILABLE:
      return 'mdi-checkbox-marked-circle';
    case BLOCK_ALERT.RESERVED:
      return 'mdi-close-circle';
    default:
      return 'mdi-information';
  }
});
const isAvailable = computed(() => {
  return props.blockAlert === BLOCK_ALERT.AVAILABLE;
});
const isNotAvailable = computed(() => {
  return props.blockAlert === BLOCK_ALERT.NOT_AVAILABLE;
});
const isOwned = computed(() => {
  return props.blockAlert === BLOCK_ALERT.OWNED;
});
const isReserved = computed(() => {
  return props.blockAlert === BLOCK_ALERT.RESERVED;
});
/**
 * @returns{string}
 * Property returns formatted owner string such as '0x4356...5a24'
 */
const ownerFormatted = computed(() => {
  return props.owner && props.owner !== ''
    ? `${props.owner.substr(0, 6)}...${props.owner.substr(
        props.owner.length - 4,
        4
      )}`
    : '';
});
/**
 * @returns{string}
 * Property returns formatted transaction fee in ETH
 */
const txFee = computed(() => {
  const GAS_LIMIT = '21000';
  const val = BigNumber(GAS_LIMIT).times(gasPrice.value);
  return formatFloatingPointValue(fromWei(val.toString())).value;
});
/**
 * @returns{string}
 * Property returns formatted FIAT price
 */
const formattedFiatTxFee = computed(() => {
  const value = getFiatValue(
    BigNumber(fromWei(gasPrice.value)).times(fiatValue.value)
  );
  return value;
});
/**
 * @returns{string}
 * Property returns formatted ETH price
 */
const formattedPrice = computed(() => {
  return formatIntegerToString(fromWei(props.price));
});
/**
 * @returns{string}
 * Property returns formatted FIAT price
 */
const formatFiatPrice = computed(() => {
  const value = getFiatValue(
    BigNumber(fromWei(props.price)).times(fiatValue.value)
  );
  return `~${value}`;
});
/**
 * Property returns rarible link to a block based on block number and current netowrk
 * @returns{string}
 */
const raribleLink = computed(() => {
  if (props.blockNumber !== '') {
    const endLInk = '?tab=details';
    return isTestNetwork.value
      ? `${RARIBLE_TEST_TOKEN}${props.blockNumber}${endLInk}`
      : `${RARIBLE_TOKEN}${props.blockNumber}${endLInk}`;
  }
  return '';
});
/**
 * Property returns rarible link to an owner based on owner and current netowrk
 * @returns{string}
 */
const raribleOwnerLink = computed(() => {
  if (props.blockNumber !== '') {
    const endLInk = '?tab=owned';
    return isTestNetwork.value
      ? `${RARIBLE_TEST_OWNER}${props.owner}${endLInk}`
      : `${RARIBLE_OWNER}${props.owner}${endLInk}`;
  }
  return '';
});
/**
 * Property disables action buttons whether or not if was passed or user has enough eth
 * @returns{boolean}
 */
const disableActionBtn = computed(() => {
  return !props.hasEnoughEth || props.disableAction;
});
/**
 * Property return not enough string based on the netowrk type
 * @returns{string}
 */
const notEnoughMessage = computed(() => {
  const text = isOwned.value ? 'transfer' : 'mint';
  return `Not enough ${network.value.type.name.toUpperCase()} to ${text}. `;
});
const estimatedFeesTooltip = computed(() => {
  const formattedTotal = formatFloatingPointValue(
    fromWei(props.estimatedTotalWei)
  ).value;
  const estimate = isOwned.value
    ? `Estimated transaction fee is ${formattedTotal} ${network.value.type.name}.`
    : `Estimated total: mint price + transaction fee = ${formattedTotal} ${network.value.type.name}.`;
  return estimate;
});
const isAdded = computed(() => {
  if (length >= 1) {
    const found = cart.value.find(item => {
      return item === props.blockNumber;
    });
    return found;
  }
  return false;
});
const addText = computed(() => {
  return !isAdded.value && isAvailable.value
    ? 'Added to batch'
    : 'Add to batch';
});

// methods

/**
 * Emits 'mint' to the parent
 * ONLY USED IN AVALAILABLE block alert Mint button
 * @emits mint
 */
const emitMint = () => {
  if (isAvailable.value) {
    emit('mint');
  }
};
/**
 * Emits 'send' to the parent
 * ONLY USED IN OWNED block alert SEND button
 * @emits mint
 */
const emitOpenSend = () => {
  if (isOwned.value) {
    emit('openSend');
  }
};
const trackToRarible = () => {
  trackDapp('ethBlocksToRarible');
};
const addToCart = () => {
  if (isAvailable.value && !isAdded.value) {
    addBlockToCart(props.blockNumber);
  }
};
</script>

<style lang="scss" scoped>
.buy-more-link {
  padding-left: 2px;
}
.alert-container {
  border: 1px solid var(--v-greenMedium-base);
  border-radius: 10px;
  overflow: hidden;
  height: 200px;
}
.alert-container-top {
  background-color: #ebfaf8;
}
</style>
