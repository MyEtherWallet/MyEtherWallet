<template>
  <div class="dashboard-container grid-container">
    <b-row>
      <b-col>
        <div class="card block--actions">
          <div class="title">
            <h4>Actions</h4>
          </div>
          <div class="margin--top--auto buttons">
            <img src="@/assets/images/buttons/send-tx.png" />
            <img src="@/assets/images/buttons/nft-manager.png" />
          </div>
        </div>
      </b-col>
      <b-col>
        <div class="card block--swap">
          <div class="flex--row--align-center title">
            <h4>Swap</h4>
            <button class="title-button prevent-user-select">
              More...
            </button>
          </div>
          <p>
            MEW has partnered with Bity, Kyber Network, and Simplex to allow
            users to swap fiat to crypto, ETH and BTC, ETH and ERC-20.
          </p>
          <div class="margin--top--auto swap-info">
            <div class="swap-to">
              <p class="monospace">0.026 BTC / 1 ETH</p>
              <div class="margin--left--auto flex--row--align-center">
                <span class="currency-symbol cc ETH cc-icon"></span>
                <img src="@/assets/images/icons/swap.svg" />
                <span class="currency-symbol cc BTC cc-icon"></span>
              </div>
            </div>

            <div class="swap-to">
              <p class="monospace">351.24 USD / 1 ETH</p>
              <div class="margin--left--auto flex--row--align-center">
                <span class="currency-symbol cc ETH cc-icon"></span>
                <img src="@/assets/images/icons/swap.svg" />
                <span class="currency-symbol cc USD cc-icon"></span>
              </div>
            </div>

            <div class="swap-to">
              <p class="monospace">32.116 XMR / 1 ETH</p>
              <div class="margin--left--auto flex--row--align-center">
                <span class="currency-symbol cc ETH cc-icon"></span>
                <img src="@/assets/images/icons/swap.svg" />
                <span class="currency-symbol cc XMR cc-icon"></span>
              </div>
            </div>
          </div>
        </div>
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <div class="card">
          <div class="flex--row--align-center title">
            <h4>MEW Dapps</h4>
            <button class="title-button prevent-user-select">
              Vuew All
            </button>
          </div>
          <div><horizontal-button-group /></div>
        </div>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import HorizontalButtonGroup from '@/components/HorizontalButtonGroup';

export default {
  components: {
    'horizontal-button-group': HorizontalButtonGroup
  },
  props: {
    tokensWithBalance: {
      type: Array,
      default: function() {
        return [];
      }
    },
    getBalance: {
      type: Function,
      default: function() {}
    },
    highestGas: {
      type: String,
      default: '0'
    }
  },
  data() {
    return {};
  },

  computed: {},
  watch: {},
  mounted() {}
};
</script>

<style lang="scss" scoped>
@import 'SendCurrencyContainer.scss';
</style>
