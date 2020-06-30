<template>
  <div :title="'Remaining:' + remainingAmt" class="mew-progress-bar full-width d-flex cursor-pointer">
    <div
      :class="[
        data.color,
        idx === 0 ? 'left-border-radius' : '',
        idx === balanceObj.data.length - 1 && hasRightBorderRadius ? 'right-border-radius' : ''
      ]"
      v-for="(data, idx) in balanceObj.data"
      :key="data + idx"
      :style="{ height: '10px', width: data.percentage + '%'}"
      :title="data.tooltip ? data.tooltip : ''"
    />
  </div>
</template>

<script>
import BigNumber from 'bignumber.js';

export default {
  data() {
    return {
       hasRightBorderRadius: false,
       remainingAmt: null
    }
  },
  props: {
    /**
     * Balance object, i.e, {total:10  , data: [ title: '', amount: 1, color: '' ]}
     */
    balanceObj: {
      type: Object,
      default: function() {
        return {}
      }
    }
  },
  beforeMount() {
    let total = 0;

    this.balanceObj.data.forEach((data, idx) => {
      if (this.balanceObj.total < data.amount) {
        return;
      }
      
      const percentage = new BigNumber(data.amount).div(this.balanceObj.total).times(100).toFixed(2);

      total = new BigNumber(total).plus(data.amount).toFixed();
      this.balanceObj.data[idx].percentage = percentage;
    })

    if (total < this.balanceObj.total) {
      this.remainingAmt = new BigNumber(this.balanceObj.total).minus(total).toFixed();
    }

    if (total >= this.balanceObj.total ) {
      this.hasRightBorderRadius = true;
    }
  }
  
}
</script>

<style lang="scss" scoped>
.mew-progress-bar {
  background-color: var(--v-primaryOutlineActive-base);
  border-radius: 8.5px;

  .left-border-radius {
    border-top-left-radius: 8.5px;
    border-bottom-left-radius: 8.5px;
  }

  .right-border-radius {
    border-top-right-radius: 8.5px;
    border-bottom-right-radius: 8.5px;
  }
}
</style>