<template>
  <div class="unit-input">
    <div class="wrap">
      <div class="block-left">
        <div class="select-block">
          <select v-model="selectedLeft">
            <option
              v-for="(opt, idx) in options"
              :key="opt + idx"
              :value="opt">{{ opt | capitalize }}
            </option>
          </select>
        </div>
        <div>
          <input
            v-model="valueLeft"
            type="number"
            placeholder="Amount">
        </div>
      </div>

      <div class="block-center">
        <div class="convert-icon">
          <img src="~@/assets/images/icons/swap.svg">
        </div>
      </div>

      <div class="block-right">
        <div class="select-block">
          <select v-model="selectedRight">
            <option
              v-for="(opt, idx) in options"
              :key="opt + idx"
              :value="opt">{{ opt | capitalize }}
            </option>
          </select>
        </div>
        <div>
          <input
            v-model="valueRight"
            type="number"
            placeholder="Amount">
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
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
      const utils = this.$store.state.web3.utils;
      const BN = utils.BN;
      unit = unit ? unit.toLowerCase() : 'ether';
      const unitValue = utils.unitMap[unit];
      return new BN(unitValue, 10);
    },
    convertFromTo(amt, from, to) {
      const BN = this.$store.state.web3.utils.BN;
      return new BN(String(amt))
        .mul(this.getValueOfUnit(from.toLowerCase()))
        .div(this.getValueOfUnit(to.toLowerCase()))
        .toString();
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'UnitInput.scss';
</style>
