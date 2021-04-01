<template>
  <v-sheet
    class="pa-12 text-center"
    rounded
    color="white"
    elevation="1"
    width="650"
  >
    <v-row justify="space-around">
      <v-col cols="6">
        <mew-module
          color-type="overlayBg"
          :has-body-padding="true"
          :subtitle="leftSideValues.subTitle"
          :title="leftSideValues.title"
          :caption="leftSideValues.caption"
          class="text-left"
        />
      </v-col>
      <v-col cols="6">
        <mew-module
          color-type="overlayBg"
          :has-body-padding="true"
          :subtitle="rightSideValues.subTitle"
          :title="rightSideValues.title"
          :caption="rightSideValues.caption"
          class="text-left"
        />
      </v-col>
    </v-row>
    <div class="px-12 mt-5">
      <p class="mew-heading-3 text-left">{{ formText.title }}</p>
      <p class="mew-body pt-1 text-left">
        {{ formText.caption }}
      </p>
    </div>
    <div class="px-12 mt-5">
      <div class="px-12">
        <mew-input
          :value="amount"
          label="Amount"
          :right-label="selectedToken.token"
          :hide-clear-btn="true"
          :rules="[checkIfNumerical]"
          @input="setAmount"
        />
      </div>
      <mew-toggle
        v-if="showToggle"
        :button-group="group"
        button-type="percentage"
        :on-toggle-btn-idx="startingIdx"
        @onBtnClick="onToggle"
      />
    </div>
    <v-row class="px-12 mt-5" align="center" justify="center">
      <v-col cols="6">
        <mew-button
          :title="buttonTitle.action"
          color-theme="primary"
          btn-style="background"
          btn-size="xlarge"
          class="mb-2 px-12"
          :has-full-width="true"
          :disabled="!hasAmount"
          @click.native="emitValues"
        />
        <br />
        <mew-button
          :title="buttonTitle.cancel"
          color-theme="error"
          btn-style="transparent"
          btn-size="xlarge"
          class="px-12"
          :has-full-width="true"
          @click.native="cancel"
        />
      </v-col>
    </v-row>
  </v-sheet>
</template>

<script>
import BigNumber from 'bignumber.js';
export default {
  name: 'AaveAmountForm',
  props: {
    selectedToken: {
      type: Object,
      default: () => {}
    },
    handler: {
      type: [Object, null],
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
      return BigNumber(this.amount).gt(0);
    }
  },
  mounted() {
    if (this.showToggle) {
      this.onToggle('50%');
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
    checkIfNumerical(value) {
      const regex = new RegExp('^-?[0-9]+.?[0-9]*$');
      const test = regex.test(value);
      if (value !== '' && !test) return 'Please enter a valid value!';
      return test;
    },
    cancel() {
      this.$emit('cancel');
    },
    emitValues() {
      this.$emit('emitValues', this.amount);
    },
    calculatedAmt(per) {
      const amt = BigNumber(this.tokenBalance).times(per);
      return amt.toFixed();
    }
  }
};
</script>

<style></style>
