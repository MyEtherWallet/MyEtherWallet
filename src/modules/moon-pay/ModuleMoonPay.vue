<template>
  <div class="mew-component--moon-pay">
    <mew-popup
      :show="open"
      :has-buttons="false"
      :has-title="false"
      :has-padding="false"
      max-width="540"
      :left-btn="leftBtn"
      scrollable
      has-body-content
    >
      <mew-tabs
        v-if="open"
        :items="tabItems"
        :active-tab="activeTab"
        active-color="greenPrimary"
        has-underline
        class="mt-n2"
        @onTab="onTab"
      >
        <template #tabContent1>
          <buy-eth-component
            :handler="moonpayHandler"
            :close="close"
            :tab="activeTab"
            :default-currency="defaltCurrency"
            @selectedCurrency="setSelectedCurrency"
          />
        </template>
        <template #tabContent2>
          <sell-eth-component
            :handler="moonpayHandler"
            :close="close"
            :tab="activeTab"
            :default-currency="defaltCurrency"
            @selectedCurrency="setSelectedCurrency"
          />
        </template>
      </mew-tabs>
      <!-- ============================================================== -->
      <!-- Powered by -->
      <!-- ============================================================== -->
      <div class="py-8">
        <div class="text-center mb-3">
          Moonpay.com will open on a new tab to continue
        </div>
        <div class="mew-body d-flex justify-center align-center">
          Powered By
          <img
            src="@/modules/moon-pay/assets/moonpay-logo.svg"
            width="100px"
            class="ml-1"
          />
        </div>
      </div>
    </mew-popup>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex';
import BuyEthComponent from './components/MoonPayBuyComponent';
import SellEthComponent from './components/MoonPaySellComponent';
import handler from './handlers/moonpayHandler';
import { MAIN_TOKEN_ADDRESS } from '@/core/helpers/common';
import { isEmpty } from 'lodash';
export default {
  name: 'MoonPay',
  components: { BuyEthComponent, SellEthComponent },
  props: {
    open: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      isOpen: false,
      activeTab: 0,
      moonpayHandler: {},
      selectedCurrency: {}
    };
  },
  computed: {
    ...mapState('wallet', ['address']),
    ...mapGetters('wallet', ['tokensList']),
    defaltCurrency() {
      return isEmpty(this.selectedCurrency)
        ? this.tokensList.filter(
            item => item.contract === MAIN_TOKEN_ADDRESS
          )[0]
        : this.selectedCurrency;
    },
    leftBtn() {
      return {
        method: this.close
      };
    },
    tabItems() {
      const symbol = isEmpty(this.selectedCurrency)
        ? 'ETH'
        : this.selectedCurrency.name;
      return [
        {
          name: `Buy ${symbol}`
        },
        {
          name: `Sell ${symbol}`
        }
      ];
    }
  },
  watch: {
    open(newVal) {
      this.isOpen = newVal;
      if (newVal) {
        this.moonpayHandler = new handler(this.address);
      }
    }
  },
  methods: {
    onTab(val) {
      this.activeTab = val;
    },
    close() {
      this.activeTab = 0;
      this.$emit('close', false);
    },
    setSelectedCurrency(e) {
      this.selectedCurrency = e;
    }
  }
};
</script>

<style lang="scss" scoped></style>
