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
          0x7554...9605
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
        <h2 class="mb-1 textDark--text">0.005 ETH</h2>
        <p class="textLight--text mb-0">$180.42</p>
      </v-col>
      <!--
        ===================================================
          Block is available: MINT BUTTON
        ===================================================
        -->
      <v-col v-if="isAvailable" cols="6" class="mt-1 d-flex justify-end">
        <mew-button :title="$vuetify.breakpoint.xs ? 'Mint' : 'Mint Block'" />
      </v-col>
      <!--
        ===================================================
          Block is owned: SEND NFT BUTTON
        ===================================================
        -->
      <v-col v-if="isOwned" cols="12" md="6" class="mt-4 pr-md-2 mb-md-2">
        <mew-button has-full-width title="Send ETH Block" btn-style="outline" />
      </v-col>
      <!--
        ===================================================
          Block is owned: LIST FOR SALE BUTTON
        ===================================================
        -->
      <v-col v-if="isOwned" cols="12" md="6" class="mt-5 mb-2 mt-md-4 pl-md-2">
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
  blockAlert,
  blockAlertValidator
} from '../handlers/helpers/blockAlertType';
export default {
  name: 'BlockInfo',
  props: {
    blockAlert: {
      default: blockAlert.NOT_AVAILABLE,
      validator: blockAlertValidator
    }
  },
  data() {
    return {};
  },
  computed: {
    alertTheme() {
      switch (this.blockAlert) {
        case blockAlert.NOT_AVAILABLE:
          return 'warning';
        case blockAlert.AVAILABLE:
          return 'success';
        default:
          return 'info';
      }
    },
    alertTitle() {
      switch (this.blockAlert) {
        case blockAlert.NOT_AVAILABLE:
          return 'This block in not available';
        case blockAlert.AVAILABLE:
          return 'This block is available';
        default:
          return 'You own this ETH Block';
      }
    },
    alertTitleColor() {
      switch (this.blockAlert) {
        case blockAlert.NOT_AVAILABLE:
          return 'orangePrimary--text';
        case blockAlert.AVAILABLE:
          return 'greenPrimary--text';
        default:
          return 'bluePrimary--text';
      }
    },
    alertIcon() {
      switch (this.blockAlert) {
        case blockAlert.NOT_AVAILABLE:
          return 'mdi-alert';
        case blockAlert.AVAILABLE:
          return 'mdi-checkbox-marked-circle';
        default:
          return 'mdi-information';
      }
    },
    isAvailable() {
      return this.blockAlert === blockAlert.AVAILABLE;
    },
    isNotAvailable() {
      return this.blockAlert === blockAlert.NOT_AVAILABLE;
    },
    isOwned() {
      return this.blockAlert === blockAlert.OWNED;
    }
  }
};
</script>

<style lang="scss" scoped>
.staked-status-container {
  max-width: 500px;
}
.border-container {
  border: 1px solid var(--v-greyMedium-base);
  border-radius: 12px;
}
.search-success {
  border: 1px solid var(--v-greenMedium-base);
  border-radius: 10px;
  .search-success--header {
    background-color: var(--v-backgroundOverlay-base);
    border-radius: 10px 10px 0% 0%;
  }
}
.table-properties {
  border: 1px solid var(--v-greyMedium-base);
  border-radius: 10px;
  .table-properties--header {
    background-color: var(--v-backgroundWallet-base);
    border-radius: 10px 10px 0% 0%;
  }
  .table-properties--row-colored {
    background-color: var(--v-backgroundGrey-base);
  }
  .table-properties--last-row {
    border-radius: 0% 0% 10px 10px;
  }
}
</style>
