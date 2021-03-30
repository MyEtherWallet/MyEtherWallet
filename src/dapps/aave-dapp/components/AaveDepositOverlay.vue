<template>
  <mew-overlay
    :show-overlay="open"
    :title="header"
    right-btn-text="Close"
    :close="handleCancel"
  >
    <template #mewOverlayBody>
      <!--
      =====================================================================================
        Aave token deposit table
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
          :table-header="depositHeader"
          @selectedDeposit="handleSelectedDeposit"
        />
      </v-sheet>
      <!--
        =====================================================================================
          Aave Summary
        =====================================================================================
        -->
      <div v-if="step === 1 || step === 3">
        <aave-summary
          :selected-token="selectedToken"
          :handler="handler"
          :amount="amount"
          :amount-usd="amountUsd"
          :step="step"
          :action-type="depositHeader"
          @confirmed="handleConfirm"
          @onConfirm="emitDeposit"
        />
      </div>
      <div v-if="step === 2">
        <aave-amount-form
          :selected-token="selectedToken"
          :handler="handler"
          :action-type="depositHeader"
          @cancel="handleCancel"
          @emitValues="handleDepositAmount"
        />
      </div>
    </template>
  </mew-overlay>
</template>

<script>
import AaveTable from './AaveTable';
import AaveSummary from './AaveSummary';
import AaveAmountForm from './AaveAmountForm.vue';
import { AAVE_TABLE_HEADER } from '../handlers/helpers';
import { _ } from 'web3-utils';
import { mapState } from 'vuex';
export default {
  components: { AaveTable, AaveSummary, AaveAmountForm },
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
      amount: '0',
      amountUsd: '$ 0.00',
      depositHeader: AAVE_TABLE_HEADER.DEPOSIT
    };
  },
  computed: {
    ...mapState('wallet', ['address']),
    header() {
      switch (this.step) {
        case 1:
        case 3:
          return 'Deposit';
        case 2:
          return 'Confirmation';
        default:
          return 'Select the token you want to deposit';
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
        this.handleSelectedDeposit(this.preSelectedToken);
      }
    }
  },
  methods: {
    handleSelectedDeposit(val) {
      this.selectedToken = val;
      this.step = 1;
    },
    handleConfirm() {
      this.step += 1;
    },
    handleDepositAmount(e) {
      this.step = 3;
      this.amount = e[0];
      this.amountUsd = e[1];
    },
    handleCancel() {
      this.step = 0;
      this.selectedToken = {};
      this.amount = '0';
      this.amountUsd = '$ 0.00';

      this.close();
    },
    emitDeposit() {
      const param = {
        aavePool: 'proto',
        userAddress: this.address,
        amount: this.amount,
        referralCode: '14',
        reserve: this.actualToken.underlyingAsset
      };
      this.$emit('onConfirm', param);
      this.handleCancel();
    }
  }
};
</script>

<style lang="scss" scoped></style>
