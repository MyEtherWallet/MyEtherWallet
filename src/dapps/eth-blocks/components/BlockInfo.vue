<template>
  <div
    class="eth-blocks--block-info"
    :style="{
      border: alertBorderColor,
      'border-radius': '12px',
      overflow: 'hidden'
    }"
  >
    <!-- =================================================== -->
    <!-- ALERT TITLE: -->
    <!-- =================================================== -->
    <v-col
      :style="{ 'background-color': alertBgColor, padding: '12px' }"
      cols="12"
      class="d-flex align-center"
    >
      <v-icon :class="['mr-2', alertTitleColor]" size="16px">{{
        alertIcon
      }}</v-icon>
      <p :class="['font-weight-bold mb-0', alertTitleColor]">
        {{ alertTitle }}
      </p>
    </v-col>

    <v-row class="align-center justify-start pa-5" no-gutters>
      <!-- =================================================== -->
      <!-- Block is Not available: OWNER INFO -->
      <!-- =================================================== -->
      <v-col
        v-if="isNotAvailable"
        cols="12"
        class="d-flex pa-3 align-center mt-3"
      >
        <p class="mb-0 mr-1">Owner:</p>
        <a :href="raribleOwnerLink" target="_blank">
          {{ ownerFormatted }}
        </a>
      </v-col>

      <!-- =================================================== -->
      <!-- Block is Not available: Rarible LINK -->
      <!-- =================================================== -->
      <v-col v-if="isNotAvailable" cols="12" class="pa-3 mt-1">
        <a :href="raribleLink" target="_blank" class="d-flex align-center">
          <p class="mb-0">See if it's available on Rarible</p>
          <v-icon class="ml-2 greenPrimary--text" size="16px"
            >mdi-open-in-new</v-icon
          >
        </a>
      </v-col>

      <!-- =================================================== -->
      <!-- Block is available: PRICE INFO -->
      <!-- =================================================== -->
      <v-col v-if="isAvailable" cols="12" class="px-2">
        <div class="pa-3 d-flex justify-space-between">
          <div class="text-end">Price</div>
          <div class="d-flex flex-column text-end">
            <h2 class="mb-1 textDark--text">
              {{ formattedPrice }} {{ network.type.currencyName }}
            </h2>
            <p v-if="!isTestNetwork" class="textLight--text mb-0">
              {{ formatFiatPrice }}
            </p>
          </div>
        </div>

        <div class="pa-3 d-flex justify-space-between">
          <div>Transaction fee</div>
          <div class="d-flex flex-column text-end">
            <p class="mb-1 textDark--text">
              {{ txFee }} {{ network.type.currencyName }}
            </p>
            <p v-if="!isTestNetwork" class="textLight--text mb-0">
              {{ formattedFiatTxFee }}
            </p>
          </div>
        </div>

        <div class="pa-3 d-flex justify-space-between">
          <div>Total</div>
          <div class="d-flex flex-column text-end">
            <p class="mb-1 textDark--text">
              {{ formattedFiatTotalPrice }} {{ network.type.currencyName }}
            </p>
            <p v-if="!isTestNetwork" class="textLight--text mb-0">
              {{ formattedTotalPrice }}
            </p>
          </div>
        </div>
      </v-col>

      <!-- =================================================== -->
      <!-- Block is available: MINT BUTTON -->
      <!-- =================================================== -->
      <v-col
        v-if="isAvailable"
        cols="6"
        class="mt-1 d-flex justify-center pa-3"
      >
        <mew-button
          v-if="!isPending"
          :title="isAdded ? 'Added to Batch' : 'Add to batch'"
          :disabled="isAdded"
          btn-style="outline"
          has-full-width
          @click.native="addToCart"
        />
        <mew-button
          v-else
          disabled
          btn-style="outline"
          :title="isAdded ? 'Added to Batch' : 'Add to batch'"
          has-full-width
        />
      </v-col>

      <v-col
        v-if="isAvailable"
        cols="6"
        class="mt-1 d-flex justify-center pa-3"
      >
        <mew-button
          v-if="!isPending"
          :title="$vuetify.breakpoint.xs ? 'Mint' : 'Mint now'"
          :disabled="disableActionBtn"
          :loading="disableAction"
          has-full-width
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

      <!-- =================================================== -->
      <!-- Block is owned: SEND NFT BUTTON -->
      <!-- =================================================== -->
      <v-col v-if="isOwned" cols="12" sm="6" class="mt-4 pr-sm-2 mb-sm-2 pa-3">
        <mew-button
          v-if="!isPending"
          has-full-width
          title="Send"
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

      <!-- =================================================== -->
      <!-- Block is owned: LIST FOR SALE BUTTON -->
      <!-- =================================================== -->
      <v-col
        v-if="isOwned"
        cols="12"
        sm="6"
        class="mt-5 mb-2 mt-sm-4 pl-sm-2 pa-3"
        :order="$vuetify.breakpoint.xs ? 'last' : ''"
      >
        <mew-button
          v-if="!isPending"
          has-full-width
          :btn-link="raribleLink"
          title="Sell on OpenSea"
          @click.native="trackToRarible"
        >
        </mew-button>
      </v-col>

      <!-- =================================================== -->
      <!-- Block is available OR is Owned: not enough ETH -->
      <!-- =================================================== -->
      <v-col
        v-if="!hasEnoughEth && (isOwned || isAvailable)"
        cols="12"
        :class="[
          'd-flex align-center mt-1',
          isOwned ? 'justify-start' : 'justify-end'
        ]"
      >
        <div class="mb-0 redPrimary--text mew-label d-flex align-center px-3">
          <span
            >{{ notEnoughMessage }}
            <a
              v-if="!isTestNetwork"
              rel="noopener noreferrer"
              target="_blank"
              class="mew-label font-weight-medium buy-more-link"
              @click="
                () => {
                  openBuySell('ETHBlocksInfo');
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

      <!-- =================================================== -->
      <!-- Block is reserved -->
      <!-- =================================================== -->
      <v-col v-if="isReserved" cols="12" class="d-flex align-center mt-3">
        <p class="textLight--text ml-5">
          Please contact support@myetherwallet.com to inquire about this block.
        </p>
      </v-col>
    </v-row>
  </div>
</template>

<script>
const RARIBLE_CONTRACT = 'token/0x01234567bac6ff94d7e4f0ee23119cf848f93245:';
const RARIBLE = 'https://rarible.com/';
const RARIBLE_TOKEN = `${RARIBLE}${RARIBLE_CONTRACT}`;
const RARIBLE_OWNER = `${RARIBLE}user/`;

const RARIBLE_TEST = 'https://rinkeby.rarible.com/';
const RARIBLE_TEST_TOKEN = `${RARIBLE_TEST}${RARIBLE_CONTRACT}`;
const RARIBLE_TEST_OWNER = `${RARIBLE_TEST}user/`;
</script>
<script setup>
import { defineProps, computed, defineEmits } from 'vue';
import { fromWei } from 'web3-utils';
import BigNumber from 'bignumber.js';
import { some } from 'lodash';

import {
  BLOCK_ALERT,
  blockAlertValidator
} from '../handlers/helpers/blockAlertType';
import {
  formatIntegerToString,
  formatFloatingPointValue
} from '@/core/helpers/numberFormatHelper';

import { currencyToNumber } from '@/core/helpers/localization';
import { useBuySell } from '@/core/composables/buyMore';
import { useAmplitude } from '@/core/composables/amplitude';
import { useGlobalStore } from '@/core/store/global';
import { useExternalStore } from '@/core/store/external';
import { useEthBlocksTxsStore } from '../store';

// emit
const emit = defineEmits(['mint', 'openSend']);

// injections/use
const { openBuySell } = useBuySell();
const { trackDapp } = useAmplitude();
const { network, isTestNetwork, gasPrice, getFiatValue } = useGlobalStore();
const { fiatValue } = useExternalStore();
const { cart, addBlockToCart, addTestBlockToCart } = useEthBlocksTxsStore();

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
const alertBorderColor = computed(() => {
  switch (props.blockAlert) {
    case BLOCK_ALERT.NOT_AVAILABLE:
      return '1px solid #FBDBA7';
    case BLOCK_ALERT.AVAILABLE:
      return '1px solid #C3F0E9';
    case BLOCK_ALERT.RESERVED:
      return '1px solid #FF445B';
    default:
      return '1px solid #D4E1F9';
  }
});
/**
 * @returns{string}
 */
const alertBgColor = computed(() => {
  switch (props.blockAlert) {
    case BLOCK_ALERT.NOT_AVAILABLE:
      return '#FEF4E5';
    case BLOCK_ALERT.AVAILABLE:
      return '#EBFAF8';
    case BLOCK_ALERT.RESERVED:
      return '#FFF0F2';
    default:
      return '#EEF3FD';
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
  return value;
});
/**
 * @returns{string}
 * Property returns formatted Total price
 */
const formattedFiatTotalPrice = computed(() => {
  const total = Number(txFee) + Number(formattedPrice.value);
  return total.toFixed(5);
});
/**
 * @returns{string}
 * Property returns formatted Total price in ETH
 */
const formattedTotalPrice = computed(() => {
  const tx = Number(formattedFiatTxFee.value.substring(1));
  const locPrice = currencyToNumber(formatFiatPrice.value.substring(1));
  const total = getFiatValue((tx + locPrice).toFixed(2), {
    doNotLocalize: true
  });
  return total;
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
  return `Not enough ${network.value.type.name} to ${text}. `;
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
  const network = cart.value.ETH;
  return some(network, block => {
    return block === props.blockNumber;
  });
});

// methods
const emitMint = () => {
  if (props.isAvailable) {
    emit('mint');
  }
};
/**
 * Emits 'send' to the parent
 * ONLY USED IN OWNED block alert SEND button
 * @emits mint
 */
const emitOpenSend = () => {
  if (props.isOwned) {
    emit('openSend');
  }
};
const trackToRarible = () => {
  trackDapp('ethBlocksToRarible');
};
const addToCart = () => {
  if (props.isAvailable && !props.isAdded) {
    isTestNetwork.value
      ? addTestBlockToCart(props.blockNumber)
      : addBlockToCart(props.blockNumber);
  }
};
</script>

<style lang="scss">
.eth-blocks--block-info {
  .buy-more-link {
    padding-left: 2px;
  }
}
</style>
