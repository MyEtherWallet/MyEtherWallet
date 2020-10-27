<template>
  <div class="mew-component--side-info-balance">
    <mew6-white-sheet :sideinfo="!mobile" class="px-5 px-lg-7 py-5">
      <div class="d-flex align-center justify-space-between">
        <div>
          <div class="d-flex align-center">
            <h4 class="font-weight-bold mr-2">My ETH balance</h4>
          </div>

          <div class="mt-4">
            <div class="mb-1">
              <span class="mew-heading-2">24.842</span> ETH
            </div>
          </div>
        </div>
        <div>
          <tiny-chart :data="chart" class="mt-n4" />
        </div>
      </div>
      <div class="d-flex align-center justify-space-between">
        <div class="primary--text font-weight--500">$4,032.35</div>
        <div class="primary--text font-weight--500">
          0.35%<v-icon small color="primary">mdi-arrow-up-thick</v-icon>
        </div>
      </div>
    </mew6-white-sheet>
  </div>
</template>

<script>
import tinyChart from '@/modules/wallets/components/tiny-chart/TinyChart';

export default {
  components: { tinyChart },
  props: {
    mobile: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      chart: [
        [1167609600000, 0.7137],
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
        [1172102400000, 0.7931]
      ]
    };
  }
};
</script>

<style lang="scss"></style>
