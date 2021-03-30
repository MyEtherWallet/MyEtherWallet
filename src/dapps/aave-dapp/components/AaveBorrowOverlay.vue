<template>
  <mew-overlay
    :show-overlay="open"
    :title="header"
    right-btn-text="Close"
    :close="callClose"
  >
    <template #mewOverlayBody>
      <!--
      =====================================================================================
        Aave token borrow table
      =====================================================================================
      -->
      <v-sheet
        v-if="step === 0"
        color="white"
        max-width="650px"
        class="border-radius--10px pa-4"
      >
        <aave-table
          :handler="handler"
          :table-header="aaveTableHandler"
          @selectedBorrow="handleSelectedBorrow"
        />
      </v-sheet>
      <!--
      =====================================================================================
        Aave token borrow form
      =====================================================================================
      -->
      <div v-if="step === 1">
        <aave-amount-form
          :selected-token="selectedToken"
          :handler="handler"
          :action-type="aaveTableHandler"
          @cancelDeposit="handleCancel"
          @emitValues="handleValues"
        />
      </div>
      <!--
      =====================================================================================
        Aave select interest
      =====================================================================================
      -->
      <div v-if="step === 2">
        <aave-select-interest
          :on-stable="true"
          :selected-token="selectedToken"
          @continue="handleContinue"
        />
      </div>
      <!--
      =====================================================================================
        Aave Summary
      =====================================================================================
      -->
      <div v-if="step === 3">
        <aave-summary
          :selected-token="selectedToken"
          :handler="handler"
          :amount="amount"
          :amount-usd="amountUsd"
          :step="step"
          :action-type="aaveTableHandler"
          @onConfirm="handleConfirm"
        />
      </div>
    </template>
  </mew-overlay>
</template>

<script>
import AaveTable from './AaveTable';
import AaveSummary from './AaveSummary';
import AaveAmountForm from './AaveAmountForm.vue';
import AaveSelectInterest from './AaveSelectInterest.vue';
import { AAVE_TABLE_HEADER } from '../handlers/helpers';
import { _ } from 'web3-utils';
import { mapState } from 'vuex';
export default {
  components: { AaveTable, AaveAmountForm, AaveSelectInterest, AaveSummary },
  props: {
    open: {
      default: false,
      type: Boolean
    },
    close: {
      default: function () {
        return {};
      },
      type: Function
    },
    handler: {
      type: [Object, null],
      validator: item => typeof item === 'object' || null,
      default: () => {}
    },
    preSelectedToken: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      step: 0,
      selectedToken: {},
      aaveTableHandler: AAVE_TABLE_HEADER.BORROW,
      amount: '0',
      amountUsd: '$ 0.00',
      type: ''
    };
  },
  computed: {
    ...mapState('wallet', ['address']),
    header() {
      switch (this.step) {
        case 1:
        case 3:
          return 'Borrow';
        case 2:
          return 'Confirmation';
        default:
          return 'Select the token you want to borrow';
      }
    },
    actualToken() {
      if (
        this.handler &&
        !_.isEmpty(this.handler) &&
        !_.isEmpty(this.selectedToken)
      ) {
        const token = this.handler?.reservesData.find(item => {
          if (item.symbol === this.selectedToken.token) return item;
        });

        return token;
      }
      return {};
    }
  },
  watch: {
    preSelectedToken(newVal) {
      if (newVal && !_.isEmpty(newVal)) {
        this.handleSelectedBorrow(this.preSelectedToken);
      }
    }
  },
  methods: {
    handleSelectedBorrow(e) {
      this.selectedToken = e;
      this.step = 1;
    },
    handleValues(e) {
      this.step = 2;
      this.amount = e[0];
      this.amountUsd = e[1];
    },
    handleCancel() {
      this.callClose();
    },
    callClose() {
      this.step = 0;
      this.selectedToken = {};
      this.aaveTableHandler = AAVE_TABLE_HEADER.BORROW;
      this.amount = '0';
      this.amountUsd = '$ 0.00';
      this.close();
    },
    handleContinue(e) {
      this.type = e;
      this.step = 3;
    },
    handleConfirm() {
      const param = {
        aavePool: 'proto',
        userAddress: this.address,
        amount: this.amount,
        referralCode: '14',
        reserve: this.actualToken.underlyingAsset,
        interestRateMode: this.type
      };

      this.$emit('onConfirm', param);
      this.callClose();
    }
  }
};
</script>

<style lang="scss" scoped></style>
