<template>
  <mew-alert
    :theme="alertTheme"
    has-white-background
    hide-alert-icon
    hide-close-icon
  >
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
        <a
          href="https://www.ethvm.com/address/0x64bbde373e909501de1309231336761adeaa07d5"
          target="_blank"
        >
          {{ ownerFormatted }}
        </a>
      </v-col>
      <!--
        ===================================================
          Block is Not available: OPENSEA LINK
        ===================================================
        -->
      <v-col v-if="isNotAvailable" cols="12" class="mt-1">
        <a
          href="https://www.ethvm.com/address/0x64bbde373e909501de1309231336761adeaa07d5"
          target="_blank"
          class="d-flex align-center"
        >
          <p class="mb-0">See if it's available on OpenSea</p>
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
          :title="$vuetify.breakpoint.xs ? 'Mint' : 'Mint Block'"
          :disabled="disableAction"
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
          :disabled="disableAction"
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
      <v-col v-if="isOwned" cols="12" sm="6" class="mt-5 mb-2 mt-sm-4 pl-sm-2">
        <mew-button v-if="!isPending" has-full-width>
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
</template>

<script>
import {
  BLOCK_ALERT,
  blockAlertValidator
} from '../handlers/helpers/blockAlertType';
import { fromWei } from 'web3-utils';
import { mapGetters } from 'vuex';
import {
  formatIntegerToString,
  formatFiatValue
} from '@/core/helpers/numberFormatHelper';
import BigNumber from 'bignumber.js';
export default {
  name: 'BlockInfoAlert',
  props: {
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
    }
  },
  computed: {
    ...mapGetters('global', ['network', 'isTestNetwork']),
    ...mapGetters('external', ['fiatValue']),
    /**
     * @returns{string}
     */
    alertTheme() {
      switch (this.blockAlert) {
        case BLOCK_ALERT.NOT_AVAILABLE:
          return 'warning';
        case BLOCK_ALERT.AVAILABLE:
          return 'success';
        case BLOCK_ALERT.RESERVED:
          return 'error';
        default:
          return 'info';
      }
    },
    /**
     * @returns{string}
     */
    alertTitle() {
      switch (this.blockAlert) {
        case BLOCK_ALERT.NOT_AVAILABLE:
          return 'This block in not available';
        case BLOCK_ALERT.AVAILABLE:
          return 'This block is available';
        case BLOCK_ALERT.RESERVED:
          return 'This block is reserved';
        default:
          return 'You own this ETH Block';
      }
    },
    /**
     * @returns{string}
     */
    alertTitleColor() {
      switch (this.blockAlert) {
        case BLOCK_ALERT.NOT_AVAILABLE:
          return 'orangePrimary--text';
        case BLOCK_ALERT.AVAILABLE:
          return 'greenPrimary--text';
        case BLOCK_ALERT.RESERVED:
          return 'redPrimary--text';
        default:
          return 'bluePrimary--text';
      }
    },
    /**
     * @returns{string}
     */
    alertIcon() {
      switch (this.blockAlert) {
        case BLOCK_ALERT.NOT_AVAILABLE:
          return 'mdi-alert';
        case BLOCK_ALERT.AVAILABLE:
          return 'mdi-checkbox-marked-circle';
        case BLOCK_ALERT.RESERVED:
          return 'mdi-close-circle';
        default:
          return 'mdi-information';
      }
    },
    isAvailable() {
      return this.blockAlert === BLOCK_ALERT.AVAILABLE;
    },
    isNotAvailable() {
      return this.blockAlert === BLOCK_ALERT.NOT_AVAILABLE;
    },
    isOwned() {
      return this.blockAlert === BLOCK_ALERT.OWNED;
    },
    isReserved() {
      return this.blockAlert === BLOCK_ALERT.RESERVED;
    },
    /**
     * @returns{string}
     * Property returns formatted owner string such as '0x4356...5a24'
     */
    ownerFormatted() {
      return this.owner && this.owner !== ''
        ? `${this.owner.substr(0, 6)}...${this.owner.substr(
            this.owner.length - 4,
            4
          )}`
        : '';
    },
    /**
     * @returns{string}
     * Property returns formatted formatted ETH price
     */
    formattedPrice() {
      return formatIntegerToString(fromWei(this.price));
    },
    /**
     * @returns{string}
     * Property returns formatted formatted FIAT price
     */
    formatFiatPrice() {
      const value = formatFiatValue(
        BigNumber(fromWei(this.price)).times(this.fiatValue)
      ).value;
      return `~ ${'$' + value}`;
    }
  },
  methods: {
    /**
     * Emits 'mint' to the parent
     * ONLY USED IN AVALAILABLE block alert Mint button
     * @emits mint
     */
    emitMint() {
      if (this.isAvailable) {
        this.$emit('mint');
      }
    },
    emitOpenSend() {
      if (this.isOwned) {
        this.$emit('openSend');
      }
    }
  }
};
</script>
