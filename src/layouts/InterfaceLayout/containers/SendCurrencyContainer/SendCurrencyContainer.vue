<template>
  <div class="dashboard-container">
    <div class="container--flex container--top">
      <div class="container--card block--actions">
        <div class="title">
          <h4>Actions</h4>
        </div>
        <div class="margin--top--auto buttons">
          <img src="@/assets/images/buttons/send-tx.png" />
          <img src="@/assets/images/buttons/nft-manager.png" />
        </div>
      </div>

      <div class="container--card block--swap">
        <div class="flex--row--align-center title">
          <h4>Swap</h4>
          <button class="title-button prevent-user-select">
            More...
          </button>
        </div>
        <p>
          MEW has partnered with Bity, Kyber Network, and Simplex to allow users
          to swap fiat to crypto, ETH and BTC, ETH and ERC-20.
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
    </div>

    <div class="container--card bottom--buttons">
      <div class="flex--row--align-center title">
        <h4>MEW Dapps</h4>
        <button class="title-button prevent-user-select">
          View All
        </button>
      </div>
      <div class="button-container">
        <horizontal-button-group :buttons="buttons" />
      </div>
    </div>
  </div>
</template>

<script>
import HorizontalButtonGroup from '@/components/HorizontalButtonGroup';
import IconEns from '@/assets/images/icons/dashboard/ens.svg';
import IconMaker from '@/assets/images/icons/dashboard/maker.svg';
import IconDomain from '@/assets/images/icons/dashboard/domain.svg';

export default {
  components: {
    'horizontal-button-group': HorizontalButtonGroup
  },
  props: {},
  data() {
    return {
      buttons: [
        {
          title: 'Register ENS',
          description: 'Register or buy your domain here',
          icon: IconEns
        },
        {
          title: 'Maker',
          description: 'Collateralize & Generate DAI',
          icon: IconMaker
        },
        {
          title: 'Domain Sale',
          description: ' Sale your domain here',
          icon: IconDomain
        }
      ]
    };
  },

  computed: {},
  watch: {},
  mounted() {}
};
</script>

<style lang="scss" scoped>
@import 'SendCurrencyContainer.scss';
</style>
