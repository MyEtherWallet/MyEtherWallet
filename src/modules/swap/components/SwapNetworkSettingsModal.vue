<template>
  <v-dialog :value="gasPriceModal" width="500">
    <v-sheet class="py-6 px-4">
      <v-row>
        <v-col cols="12">
          <p class="mew-heading-1">Network Fee</p>
          <p class="mew-body">
            This fee is calculated by multiplying the gas price and gas limit
            for your transaction. Higher fees results in faster transactions.
            <a>Learn More </a>
          </p>
          <settings-gas-price
            :is-swap="true"
            :buttons="gasButtons"
            :selected="gasPriceType"
            :set-selected="setGas"
            :gas-price="gasPrice"
            :set-custom-gas-price="setCustom"
            :open-global-settings="openSettings"
          />
        </v-col>
      </v-row>
    </v-sheet>
  </v-dialog>
</template>

<script>
import gasPriceMixin from '@/modules/settings/handler/gasPriceMixin';
import SettingsGasPrice from '@/modules/settings/components/SettingsGasPrice';

export default {
  components: {
    SettingsGasPrice
  },
  mixins: [gasPriceMixin],
  props: {
    gasPriceModal: {
      type: Boolean,
      default: false
    },
    openSettings: {
      type: Function,
      default: () => {}
    },
    close: {
      type: Function,
      default: () => {}
    }
  },
  created() {
    this.fetchGasPrice();
  },
  methods: {
    setCustom(value) {
      this.setCustomGasPrice(value, false);
      this.close();
    },
    setGas(value) {
      this.setSelected(value, false);
      this.close();
    }
  }
};
</script>

<style></style>
