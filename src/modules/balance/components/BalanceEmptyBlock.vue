<template>
  <mew6-white-sheet
    :class="[
      isTokens ? 'empty-token-list' : 'empty-network-balance',
      'module-no-balance pa-4 py-7 pa-sm-12'
    ]"
    color="white"
    max-width="100%"
  >
    <!--
    =====================================================================================
      ETH Empty Block
    =====================================================================================
    -->
    <div v-if="!isTokens">
      <h2 class="mb-6">My {{ networkType }} balance is empty</h2>
      <!--
      =====================================================================================
        Buy ETH (Visible on ETH network ONLY)
      =====================================================================================
       -->
      <div v-if="isEth">
        <mew-button
          :has-full-width="false"
          title="Buy ETH with a credit card"
          btn-size="xlarge"
          btn-link="https://ccswap.myetherwallet.com/#/"
        />
        <div class="d-flex align-center mt-5">
          <div>We accept credit card</div>
          <img
            v-if="!$vuetify.theme.dark"
            class="ml-2 mr-1"
            height="21"
            src="@/assets/images/icons/icon-visa-dark.png"
          />
          <img
            v-if="$vuetify.theme.dark"
            class="ml-2 mr-2"
            height="13"
            src="@/assets/images/icons/icon-visa-white.png"
          />
          <img
            height="18"
            src="@/assets/images/icons/icon-mastercard-mew.png"
          />
        </div>
      </div>
      <div class="textSecondary--text mt-12">
        Tip: You can also send your {{ networkType }} from another wallet!
      </div>
    </div>
    <!--
    =====================================================================================
      Tokens Empty Block
    =====================================================================================
    -->
    <div v-else>
      <h2 class="mb-6">My token list is empty</h2>
      <mew-button
        v-if="isEth"
        class="ml-auto ml-n3"
        :has-full-width="false"
        :title="'+ ' + 'Buy ERC20 tokens'"
        btn-size="xsmall"
        btn-style="transparent"
        @click.native="navigateToSwap"
      />
    </div>
  </mew6-white-sheet>
</template>

<script>
import { ROUTES_WALLET } from '@/core/router/config-routes';
export default {
  name: 'BalanceEmptyBlock',
  props: {
    networkType: {
      type: String,
      default: ''
    },
    isTokens: {
      type: Boolean,
      default: false
    },
    isEth: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    /**
     * Method which naviagates to the swap page.
     * Used in Empty Tokens Block
     */
    navigateToSwap() {
      this.$router.push({ name: ROUTES_WALLET.SWAP.NAME });
    }
  }
};
</script>

<style scoped class="scss">
.module-no-balance {
  min-height: 352px;
}
.empty-network-balance {
  background-image: url(~@/assets/images/backgrounds/bg-circle-triangle.png);
  background-position: right 60px bottom -1px;
  background-size: 180px;
  left: 0;
  top: 0;
}

.empty-token-list {
  background-image: url(~@/assets/images/backgrounds/bg-half-circle.png),
    url(~@/assets/images/backgrounds/bg-small-half-circle.png);
  background-position: right -16px bottom -26px, left -18px bottom -29px;
  background-size: 357px, 150px;
  border-radius: 12px;
}
</style>
