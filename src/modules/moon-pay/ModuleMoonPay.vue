<template>
  <div class="mew-component--moon-pay">
    <mew-popup
      :show="open"
      :has-buttons="false"
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
          <buy-eth-component />
        </template>
        <template #tabContent2>
          <sell-eth-component />
        </template>
      </mew-tabs>
    </mew-popup>
  </div>
</template>

<script>
import { mapState } from 'vuex';
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
      tabItems: [
        {
          name: 'Buy ETH'
        },
        {
          name: 'Sell ETH'
        }
      ],
      moonpayHandler: {}
    };
  },
  computed: {
    ...mapState('wallet', ['address']),
    leftBtn() {
      return {
        method: this.close
      };
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
