<template>
  <app-simple-dialog
    :value="gasPriceModal"
    width="380"
    title="Transaction fee"
    @close="handleClose"
  >
    <settings-gas-price
      :is-swap="true"
      :buttons="gasButtons"
      :selected="selected"
      :set-selected="setGas"
      :gas-price="gasPrice"
      :cost-in-eth="costInEth"
      :open-global-settings="openSettings"
      :not-enough-eth="notEnoughEth"
    />
  </app-simple-dialog>
</template>

<script>
import { mapGetters } from 'vuex';
import AppSimpleDialog from './AppSimpleDialog';
import gasPriceMixin from '@/modules/settings/handler/gasPriceMixin';
import SettingsGasPrice from '@/modules/settings/components/SettingsGasPrice';
import { gasPriceTypes } from '@/core/helpers/gasPriceHelper';
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
    },
    notEnoughEth: {
      type: Boolean,
      default: false
    },
    costInEth: {
      type: String,
      default: '0'
    }
  },
  data() {
    return {};
  },
  computed: {
    ...mapGetters('global', ['gasPriceByType'])
  },
  methods: {
    setGas(value) {
      const newObj = {
        gasType: value,
        gasPrice: this.gasPriceByType(value)
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
