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
          />
        </template>
        <template #tabContent2>
          <sell-eth-component
            :handler="moonpayHandler"
            :close="close"
            :tab="activeTab"
            :default-currency="defaltCurrency"
          />
        </template>
      </mew-tabs>
      <!-- ============================================================== -->
      <!-- Powered by -->
      <!-- ============================================================== -->
      <div class="mew-body d-flex justify-center align-center py-8">
        Powered By
        <img
          src="@/modules/moon-pay/assets/moonpay-logo.svg"
          width="100px"
          class="ml-1"
        />
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
      moonpayHandler: {}
    };
  },
  computed: {
    ...mapState('wallet', ['address']),
    ...mapGetters('wallet', ['tokensList']),
    defaltCurrency() {
      return this.tokensList.filter(
        item => item.contract === MAIN_TOKEN_ADDRESS
      )[0];
    },
    leftBtn() {
      return {
        method: this.close
      };
    },
    tabItems() {
      return [
        {
          name: 'Buy ETH'
        },
        {
          name: 'Sell ETH'
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
    }
  }
};
</script>

<style lang="scss" scoped></style>
