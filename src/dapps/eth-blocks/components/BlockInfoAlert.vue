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
          :title="$vuetify.breakpoint.xs ? 'Mint' : 'Mint Block'"
          :disabled="disableMint"
          :loading="disableMint"
          @click.native="emitMint()"
        />
      </v-col>
      <!--
        ===================================================
          Block is owned: SEND NFT BUTTON
        ===================================================
        -->
      <v-col v-if="isOwned" cols="12" sm="6" class="mt-4 pr-sm-2 mb-sm-2">
        <mew-button
          has-full-width
          title="Send ETH Block"
          btn-style="outline"
          @click.native="emitOpenSend()"
        />
      </v-col>
      <!--
        ===================================================
          Block is owned: LIST FOR SALE BUTTON
        ===================================================
        -->
      <v-col v-if="isOwned" cols="12" sm="6" class="mt-5 mb-2 mt-sm-4 pl-sm-2">
        <mew-button has-full-width>
          <v-row class="align-center justify-center">
            <div>List for sale</div>
            <v-icon class="ml-2 white--text" size="16px"
              >mdi-open-in-new</v-icon
            >
          </v-row>
        </mew-button>
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
    disableMint: {
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
