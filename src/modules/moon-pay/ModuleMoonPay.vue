<template>
  <div class="mew-component--moon-pay">
    <mew-popup
      :show="open"
      :has-buttons="false"
      :has-title="false"
      max-width="540"
      :left-btn="leftBtn"
      scrollable
      has-body-content
    >
      <mew-tabs
        :items="tabItems"
        :active-tab="activeTab"
        class="mt-n2"
        @onTab="onTab"
      >
        <template #tabContent1>
          <buy-eth-component
            :handler="moonpayHandler"
            :close="close"
            :currency-items="currencyItems"
          />
        </template>
        <template #tabContent2>
          <sell-eth-component
            :handler="moonpayHandler"
            :close="close"
            :currency-items="currencyItems"
          />
        </template>
      </mew-tabs>
      <!-- ============================================================== -->
      <!-- Powered by -->
      <!-- ============================================================== -->
      <div class="mew-body d-flex justify-center align-center pt-8">
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
    ...mapGetters('global', ['network']),
    currencyItems() {
      return [
        {
          text: 'Select a currency',
          selectLabel: true,
          divider: true
        },
        {
          name: this.network.type.currencyName,
          subtext: this.network.type.name_long,
          value: this.network.type.currencyName.toLowerCase()
        },
        {
          name: 'USDC',
          subtext: 'USD Coin',
          value: 'usdc'
        },
        {
          name: 'USDT',
          subtext: 'Tether',
          value: 'usdt'
        }
      ];
    },
    leftBtn() {
      return {
        method: this.close
      };
    },
    tabItems() {
      return [
        {
          name: `Buy ${this.network.type.currencyName}`
        },
        {
          name: `Sell ${this.network.type.currencyName}`
        }
      ];
    }
  },
  watch: {
    open(newVal) {
      this.isOpen = newVal;
    }
  },
  mounted() {
    this.moonpayHandler = new handler(this.address);
  },
  methods: {
    onTab(val) {
      this.activeTab = val;
    },
    close() {
      this.$emit('close', false);
    }
  }
};
</script>

<style lang="scss" scoped></style>
