<template>
  <app-simple-dialog
    :value="gasPriceModal"
    width="400"
    title="Transaction fee"
    @close="handleClose"
  >
    <settings-gas-price
      :is-swap="true"
      :buttons="gasButtons"
      :selected="selected"
      :set-selected="setGas"
      :gas-price="gasPrice"
      :set-custom-gas-price="setCustom"
      :open-global-settings="openSettings"
    />
  </app-simple-dialog>
</template>

<script>
import AppSimpleDialog from './AppSimpleDialog';
import gasPriceMixin from '@/modules/settings/handler/gasPriceMixin';
import SettingsGasPrice from '@/modules/settings/components/SettingsGasPrice';
import {
  getGasBasedOnType,
  gasPriceTypes
} from '@/core/helpers/gasPriceHelper';
import { toWei } from 'web3-utils';
export default {
  components: {
    AppSimpleDialog,
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
    },
    selected: {
      type: String,
      default: gasPriceTypes.ECONOMY
    }
  },
  data() {
    return {};
  },
  methods: {
    setCustom(value) {
      //fix-it
      const newObj = {
        gasType: gasPriceTypes.STORED,
        gasPrice: toWei(value, 'gwei')
      };
      this.$emit('onLocalGasPrice', newObj);
      this.close();
    },
    setGas(value) {
      const newObj = {
        gasType: value,
        gasPrice: getGasBasedOnType(this.localGas, value)
      };
      this.$emit('onLocalGasPrice', newObj);
      this.close();
    },
    handleClose() {
      this.$emit('close');
    }
  }
};
</script>

<style></style>
