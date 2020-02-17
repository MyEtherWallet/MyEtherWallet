<template>
  <WhiteSheet class="pa-3">
    <div class="d-flex pa-5">
      <div class="d-flex">
        <div class="mr-3 pt-1">
          <img
            style="opacity: 0.7;"
            src="@/assets/images/Common/Icons/eth.svg"
          />
        </div>
        <div>
          <div class="text-uppercase">My Eth Balance</div>
          <div class="display-1">$4,032.35</div>
          <div class="text-color--mew-green">24.842 ETH</div>
        </div>
      </div>
      <div class="ml-auto">b</div>
    </div>

    <ChartBalance :data="chartData" />

    <div class="d-flex align-center px-5 py-3">
      <div class="px-6"></div>
      <div class="font-weight-bold">
        ETH PRICE
        <span class="ml-2 font-weight-regular text-color--mew-green"
          >3.12%</span
        >
      </div>
      <div class="ml-5">$321.55 / 1ETH</div>
      <StdButton size="x-large" class="ml-auto">Send Transaction</StdButton>
    </div>
  </WhiteSheet>
</template>

<script>
import WhiteSheet from '@/components/Common/WhiteSheet';
import StdButton from '@/components/StdButton';
import ChartBalance from '@/components/Charts/Balance';

export default {
  components: { WhiteSheet, ChartBalance, StdButton },
  data() {
    return {
      chartData: [
        [1167609600000, 0.7537],
        [1167696000000, 0.7537],
        [1167782400000, 0.7559],
        [1167868800000, 0.7631],
        [1167955200000, 0.7644],
        [1168214400000, 0.769],
        [1168300800000, 0.7683],
        [1168387200000, 0.77],
        [1168473600000, 0.7703],
        [1168560000000, 0.7757],
        [1168819200000, 0.7728],
        [1168905600000, 0.7721],
        [1168992000000, 0.7748],
        [1169078400000, 0.774],
        [1169164800000, 0.7718],
        [1169424000000, 0.7731],
        [1169510400000, 0.767],
        [1169596800000, 0.769],
        [1169683200000, 0.7706],
        [1169769600000, 0.7752],
        [1170028800000, 0.774],
        [1170115200000, 0.771],
        [1170201600000, 0.7721],
        [1170288000000, 0.7681],
        [1170374400000, 0.7681],
        [1170633600000, 0.7738],
        [1170720000000, 0.772],
        [1170806400000, 0.7701],
        [1170892800000, 0.7699],
        [1170979200000, 0.7689],
        [1171238400000, 0.7719],
        [1171324800000, 0.768],
        [1171411200000, 0.7645],
        [1171497600000, 0.7613],
        [1171584000000, 0.7624],
        [1171843200000, 0.7616],
        [1171929600000, 0.7608],
        [1172016000000, 0.7608],
        [1172102400000, 0.7631]
      ]
    };
  }
};
</script>

<style lang="scss" scoped>
//@import '@/assets/styles/GlobalVariables.scss';
</style>
