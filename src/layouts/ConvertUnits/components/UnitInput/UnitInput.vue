<template>
  <div class="unit-input">
    <div class="wrap">
      <div class="block-left">
        <div class="select-block">
          <dropdown-unit-selector
            :options="options"
            :current-selected="selectedLeft"
            :left="true"
            @updateSelected="updateCurrency"
          />
        </div>
        <div>
          <input
            v-model="valueLeft"
            type="number"
            step="any"
            placeholder="Amount"
          />
        </div>
      </div>

      <div class="block-center">
        <div class="convert-icon">
          <img src="~@/assets/images/icons/swap.svg" />
        </div>
      </div>

      <div class="block-right">
        <div class="select-block">
          <dropdown-unit-selector
            :options="options"
            :current-selected="selectedRight"
            :left="false"
            @updateSelected="updateCurrency"
          />
        </div>
        <div>
          <input
            v-model="valueRight"
            type="number"
            placeholder="Amount"
            step="any"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { BigNumber } from 'bignumber.js';
import { mapState } from 'vuex';
import DropDownUnitSelector from '../DropDownUnitSelector';
import utils from 'web3-utils';

export default {
  components: {
    'dropdown-unit-selector': DropDownUnitSelector
  },
  props: {
    options: {
      type: Array,
      default: function() {
        return [];
      }
    }
  },
  data() {
    return {
      selectedLeft: 'wei',
      selectedRight: 'ether',
      valueLeft: 1000000000000000000,
      valueRight: 1
    };
  },
  computed: {
    ...mapState(['web3'])
  },
  watch: {
    valueLeft(newVal) {
      this.valueRight = this.convertFromTo(
        newVal,
        this.selectedLeft,
        this.selectedRight
      );
    },
    valueRight(newVal) {
      this.valueLeft = this.convertFromTo(
        newVal,
        this.selectedRight,
        this.selectedLeft
      );
    },
    selectedLeft(newVal) {
      this.valueRight = this.convertFromTo(
        this.valueLeft,
        newVal,
        this.selectedRight
      );
    },
    selectedRight(newVal) {
      this.valueLeft = this.convertFromTo(
        this.valueRight,
        newVal,
        this.selectedLeft
      );
    }
  },
  methods: {
    getValueOfUnit(unit) {
      unit = unit ? unit.toLowerCase() : 'ether';
      const unitValue = utils.unitMap[unit];
      return new BigNumber(unitValue, 10);
    },
    convertFromTo(amt, from, to) {
      return new BigNumber(String(amt))
        .times(this.getValueOfUnit(from))
        .div(this.getValueOfUnit(to))
        .toString(10);
    },
    updateCurrency(e) {
      if (e[1] === 'left') {
        this.selectedLeft = e[0];
      } else {
        this.selectedRight = e[0];
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'UnitInput.scss';
</style>
