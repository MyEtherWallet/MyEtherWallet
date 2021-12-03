<template>
  <app-simple-dialog
    :value="gasPriceModal"
    width="420"
    title="Select transaction fee"
    @close="handleClose"
  >
    <settings-gas-price
      :is-swap="true"
      :buttons="gasButtons"
      :set-selected="setGas"
      :gas-price="gasPrice"
      :cost-in-eth="costInEth"
      :tx-fee-formatted="txFeeFormatted"
      :tx-fee-usd="txFeeUsd"
      :not-enough-eth="notEnoughEth"
      :total-gas-limit="totalGasLimit"
      :close-dialog="closeDialog"
      :from-settings="false"
    />
  </app-simple-dialog>
</template>

<script>
import { mapState } from 'vuex';
import AppSimpleDialog from './AppSimpleDialog';
import gasPriceMixin from '@/modules/settings/handler/gasPriceMixin';
import SettingsGasPrice from '@/modules/settings/components/SettingsGasPrice';
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
    close: {
      type: Function,
      default: () => {}
    },
    notEnoughEth: {
      type: Boolean,
      default: false
    },
    costInEth: {
      type: String,
      default: '0'
    },
    txFeeFormatted: {
      type: String,
      default: '0'
    },
    txFeeUsd: {
      type: String,
      default: '0'
    },
    totalGasLimit: {
      type: String,
      default: '0'
    }
  },
  data() {
    return {};
  },
  computed: {
    ...mapState('global', ['online'])
  },
  watch: {
    /**
     * emit gas when modal
     * opens in case of difference
     */
    gasPriceModal(newVal) {
      if (newVal) {
        this.$emit('onLocalGasPrice', this.gasPriceByType(this.gasPriceType));
      }
    },
    /**
     * only emit new gas price
     * when modal is open
     */
    gasPrice() {
      if (this.gasPriceModal) {
        this.$emit('onLocalGasPrice', this.gasPriceByType(this.gasPriceType));
      }
    }
  },
  methods: {
    /**
     * emit selected gas
     */
    setGas(value) {
      this.$emit('onLocalGasPrice', this.gasPriceByType(value));
      this.setSelected(value);
    },
    closeDialog() {
      this.close();
    },
    handleClose() {
      this.$emit('close');
    }
  }
};
</script>

<style></style>
