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
        class="pt-3"
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
import { mapGetters, mapState, mapActions } from 'vuex';
import BuyEthComponent from './components/MoonPayBuyComponent';
import SellEthComponent from './components/MoonPaySellComponent';
import handler from './handlers/moonpayHandler';
import { MAIN_TOKEN_ADDRESS } from '@/core/helpers/common';
import { isEmpty } from 'lodash';
import nodes from '@/utils/networks';
import { SUCCESS, Toast } from '../toast/handler/handlerToast';
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
      selectedCurrency: {},
      nodes: nodes
    };
  },
  computed: {
    ...mapState('wallet', ['address']),
    ...mapGetters('wallet', ['tokensList']),
    ...mapGetters('global', ['network']),
    defaltCurrency() {
      return isEmpty(this.selectedCurrency)
        ? this.tokensList.filter(
            item =>
              item.contract.toLowerCase() === MAIN_TOKEN_ADDRESS.toLowerCase()
          )[0]
        : this.selectedCurrency;
    },
    leftBtn() {
      return {
        method: this.close
      };
    },
    tabItems() {
      return [
        {
          name: `Buy`
        },
        {
          name: `Sell`
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
      this.selectedCurrency = {};
    }
  },
  methods: {
    ...mapActions('wallet', ['setWeb3Instance']),
    ...mapActions('global', ['setNetwork']),
    onTab(val) {
      this.activeTab = val;
      if (val === 1) {
        this.selectedCurrency = {};
        if (this.network.type.chainID !== 1) {
          const defaultNetwork = this.nodes['ETH'].find(item => {
            return item.service === 'myetherwallet.com-ws';
          });

          this.setNetwork(defaultNetwork).then(() => {
            this.setWeb3Instance();
            Toast(`Switched network to: ETH`, {}, SUCCESS);
          });
        }
      }
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
