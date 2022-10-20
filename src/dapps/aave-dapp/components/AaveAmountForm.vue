<template>
  <div class="full-width">
    <v-row justify="space-around" no-gutters dense>
      <v-col cols="12" md="6">
        <mew-module
          color-type="overlayBg"
          :has-body-padding="true"
          :subtitle="leftSideValues.subTitle"
          :title="leftSideValues.title"
          :caption="leftSideValues.caption"
          class="text-left height--full"
        />
      </v-col>
      <v-col cols="12" md="6">
        <mew-module
          color-type="overlayBg"
          :has-body-padding="true"
          :subtitle="rightSideValues.subTitle"
          :title="rightSideValues.title"
          :caption="rightSideValues.caption"
          class="text-left height--full"
        />
      </v-col>
    </v-row>
    <div class="mt-5">
      <p class="mew-heading-3 text-left">{{ formText.title }}</p>
      <p class="mew-body pt-1 text-left">
        {{ formText.caption }}
      </p>
    </div>
    <div class="mt-5">
      <mew-input
        :value="amount"
        label="Amount"
        :right-label="selectedToken.token"
        :hide-clear-btn="true"
        :rules="checkIfNumerical"
        :error-messages="errorMessages"
        @input="setAmount"
      />
      <mew-toggle
        v-if="showToggle"
        :button-group="group"
        button-type="percentage"
        :on-toggle-btn-idx="startingIdx"
        @onBtnClick="onToggle"
      />
    </div>

    <div class="mt-12 justify-center d-flex">
      <mew-button
        :title="buttonTitle.action"
        color-theme="primary"
        btn-style="background"
        btn-size="xlarge"
        :disabled="disabled"
        @click.native="emitValues"
      />
      <mew-button
        :title="buttonTitle.cancel"
        color-theme="error"
        btn-style="transparent"
        class="ml-2"
        btn-size="xlarge"
        @click.native="cancel"
      />
    </div>
  </div>
</template>

<script>
import BigNumber from 'bignumber.js';
import { ACTION_TYPES } from '@/dapps/aave-dapp/handlers/helpers';
import { isEmpty } from 'lodash';
import hasValidDecimals from '@/core/helpers/hasValidDecimals';

export default {
  name: 'AaveAmountForm',
  props: {
    tokenDecimal: {
      type: Number,
      default: 18
    },
    selectedToken: {
      type: Object,
      default: () => {}
    },
    showToggle: {
      type: Boolean,
      default: false
    },
    leftSideValues: {
      type: Object,
      default: () => {
        return {
          title: '',
          caption: '',
          subTitle: ''
        };
      }
    },
    rightSideValues: {
      type: Object,
      default: () => {
        return { title: '', caption: '', subTitle: '' };
      }
    },
    formText: {
      type: Object,
      default: () => {
        return { title: '', caption: '' };
      }
    },
    buttonTitle: {
      type: Object,
      default: () => {
        return { action: '', cancel: '' };
      }
    },
    tokenBalance: {
      type: String,
      default: '0'
    },
    aaveBalance: {
      type: String,
      default: '0'
    }
  },
  data() {
    return {
      group: ['25%', '50%', '75%', 'MAX'],
      amount: '0',
      startingIdx: 0
    };
  },
  computed: {
    hasAmount() {
      return (
        BigNumber(this.amount).gt(0) &&
        BigNumber(this.amount).lte(this.actualTokenBalance)
      );
    },
    checkIfNumerical() {
      const regex = new RegExp('^-?\\d+[.]?\\d*$');
      const test = regex.test(this.amount);
      return [test || 'Please enter a valid value!'];
    },
    errorMessages() {
      if (isEmpty(this.amount)) return 'Amount is required!';
      if (BigNumber(this.actualTokenBalance).lte(0))
        return 'Not enough token balance';
      if (!hasValidDecimals(this.amount, this.tokenDecimal))
        return 'Too many decimal places';
      if (BigNumber(this.amount).isNegative())
        return 'Amount cannot be negative';
      if (BigNumber(this.amount).lte(0))
        return 'Please enter an amount greater than 0';
      if (BigNumber(this.amount).gt(this.actualTokenBalance))
        return 'Amount exceeds available balance';
      return '';
    },
    disabled() {
      return !this.hasAmount || this.errorMessages !== '';
    },
    actualTokenBalance() {
      return this.buttonTitle.action.toLowerCase() === ACTION_TYPES.withdraw
        ? this.aaveBalance
        : this.tokenBalance;
    }
  },
  mounted() {
    if (this.showToggle) {
      setTimeout(() => {
        this.onToggle(this.group[1]);
      }, 100);
    }
  },
  methods: {
    setAmount(e) {
      this.amount = e;
    },
    onToggle(e) {
      switch (e) {
        case this.group[0]:
          this.startingIdx = 0;
          this.amount = this.calculatedAmt(0.25);
          break;
        case this.group[1]:
          this.startingIdx = 1;
          this.amount = this.calculatedAmt(0.5);
          break;
        case this.group[2]:
          this.startingIdx = 2;
          this.amount = this.calculatedAmt(0.75);
          break;
        default:
          this.startingIdx = 3;
          this.amount = this.calculatedAmt(1);
      }
    },
    cancel() {
      this.$emit('cancel');
    },
    emitValues() {
      this.$emit('emitValues', this.amount);
    },
    calculatedAmt(per) {
      let amt = this.actualTokenBalance;
      if (isNaN(amt)) amt = 0;
      return BigNumber(amt)
        .times(per)
        .decimalPlaces(this.tokenDecimal)
        .toString();
    }
  }
};
</script>
