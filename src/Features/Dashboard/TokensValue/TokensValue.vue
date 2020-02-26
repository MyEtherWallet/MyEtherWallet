<template>
  <WhiteSheet>
    <div class="d-flex align-center px-6 pt-7">
      <BlockTitle
        :icon="require('@/assets/images/Etc/Features/tokenValue.png')"
        text1="My Tokens Value"
        text2="$3,132.25"
      />
      <div class="ml-auto">
        <v-btn
          class="text-transform--initial"
          text
          small
          depressed
          :color="mewGreen"
        >
          <v-icon small class="top-button-icon">mdi-chevron-right</v-icon>
          Ethplorer
        </v-btn>
        <v-btn
          class="text-transform--initial"
          text
          small
          depressed
          :color="mewGreen"
        >
          <v-icon small class="top-button-icon">mdi-plus</v-icon>
          Custom Token
        </v-btn>
      </div>
    </div>

    <table class="tokens-table mt-4">
      <thead>
        <tr>
          <td style="width: 45px;"></td>
          <td>Token</td>
          <td>Price</td>
          <td>Market Cap</td>
          <td>24H Changes</td>
          <td>Token Value</td>
          <td></td>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>
            <img
              class="vertical-align--middle"
              src="@/assets/images/Etc/Features/eth.png"
              width="25"
            />
          </td>
          <td>XMR</td>
          <td>$8.29</td>
          <td>$1.53B</td>
          <td>
            <div class="d-flex align-center">
              <ChartTiny class="ml-n2 mr-2" :data="chart2" linecolor="red" />
              <div class="d-flex align-center">
                <div class="text-color--red">0.23%</div>
                <v-icon v-if="false" class="text-color--mew-green body-2"
                  >mdi-arrow-up-bold</v-icon
                >
                <v-icon v-if="true" color="red" class="body-2"
                  >mdi-arrow-down-bold</v-icon
                >
              </div>
            </div>
          </td>
          <td>
            <div>
              <div>$228.42</div>
              <div class="text-color--gray1">27.54</div>
            </div>
          </td>
          <td>
            <StdButton
              buttonclass="button--green-border"
              size="small"
              :minwidth="false"
              fontclass="font-weight-regular"
              >Trade</StdButton
            >
          </td>
        </tr>
        <tr>
          <td>
            <img
              class="vertical-align--middle"
              src="@/assets/images/Etc/Features/eth.png"
              width="25"
            />
          </td>
          <td>XMR</td>
          <td>$8.29</td>
          <td>$1.53B</td>
          <td>
            <div class="d-flex align-center">
              <ChartTiny class="ml-n2 mr-2" :data="chart1" />
              <div class="d-flex align-center">
                <div class="text-color--mew-green">0.23%</div>
                <v-icon class="text-color--mew-green body-2"
                  >mdi-arrow-up-bold</v-icon
                >
                <v-icon v-if="false" color="red" class="body-2"
                  >mdi-arrow-down-bold</v-icon
                >
              </div>
            </div>
          </td>
          <td>
            <div>
              <div>$228.42</div>
              <div class="text-color--gray1">27.54</div>
            </div>
          </td>
          <td>
            <StdButton
              buttonclass="button--green-border"
              size="small"
              :minwidth="false"
              fontclass="font-weight-regular"
              >Trade</StdButton
            >
          </td>
        </tr>
        <tr>
          <td>
            <img
              class="vertical-align--middle"
              src="@/assets/images/Etc/Features/eth.png"
              width="25"
            />
          </td>
          <td>XMR</td>
          <td>$8.29</td>
          <td>$1.53B</td>
          <td>
            <div class="d-flex align-center">
              <ChartTiny class="ml-n2 mr-2" :data="chart1" />
              <div class="d-flex align-center">
                <div class="text-color--mew-green">0.23%</div>
                <v-icon class="text-color--mew-green body-2"
                  >mdi-arrow-up-bold</v-icon
                >
                <v-icon v-if="false" color="red" class="body-2"
                  >mdi-arrow-down-bold</v-icon
                >
              </div>
            </div>
          </td>
          <td>
            <div>
              <div>$228.42</div>
              <div class="text-color--gray1">27.54</div>
            </div>
          </td>
          <td>
            <StdButton
              buttonclass="button--green-border"
              size="small"
              :minwidth="false"
              fontclass="font-weight-regular"
              >Trade</StdButton
            >
          </td>
        </tr>
        <tr>
          <td>
            <img
              class="vertical-align--middle"
              src="@/assets/images/Etc/Features/eth.png"
              width="25"
            />
          </td>
          <td>XMR</td>
          <td>$8.29</td>
          <td>$1.53B</td>
          <td>
            <div class="d-flex align-center">
              <ChartTiny class="ml-n2 mr-2" :data="chart1" />
              <div class="d-flex align-center">
                <div class="text-color--mew-green">0.23%</div>
                <v-icon class="text-color--mew-green body-2"
                  >mdi-arrow-up-bold</v-icon
                >
                <v-icon v-if="false" color="red" class="body-2"
                  >mdi-arrow-down-bold</v-icon
                >
              </div>
            </div>
          </td>
          <td>
            <div>
              <div>$228.42</div>
              <div class="text-color--gray1">27.54</div>
            </div>
          </td>
          <td>
            <StdButton
              buttonclass="button--green-border"
              size="small"
              :minwidth="false"
              fontclass="font-weight-regular"
              >Trade</StdButton
            >
          </td>
        </tr>
      </tbody>
    </table>
  </WhiteSheet>
</template>

<script>
import Var from '@/variables.js';
import WhiteSheet from '@/components/Common/WhiteSheet';
import StdButton from '@/components/StdButton';
import ChartTiny from '@/components/Charts/Tiny';
import BlockTitle from '@/components/BlockTitles/BlockTitle1';

export default {
  components: { WhiteSheet, ChartTiny, StdButton, BlockTitle },
  data() {
    return {
      mewGreen: Var.colorSets.emerald,
      chart1: [
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
      ],
      chart2: [
        [1167609600000, 0.7937],
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
        [1172102400000, 0.7031]
      ]
    };
  },
  beforeMount() {
    this.chartData = this.chart1d;
  }
};
</script>

<style lang="scss" scoped>
@import '@/assets/styles/GlobalVariables.scss';

.top-button-icon {
  border-radius: 100%;
  background-color: #b4ece4;
  margin-right: 5px;
}

.tokens-table {
  width: 100%;
  border-spacing: 0;

  tr {
    border: 0;
    margin: 0;
  }

  td {
    padding: 10px;
  }

  thead {
    background-color: rgb(249, 249, 249);
    font-size: 11px;
    text-transform: uppercase;
    td {
      color: $gray-1;
      font-weight: 500;
    }
  }

  tbody {
    tr {
      padding: 0 10px;
    }
    td {
      border-bottom: 1px solid #efefef;
      padding: 5px 10px;
    }
    td:first-child {
      padding-left: 30px;
    }
    td:last-child {
      padding-right: 30px;
    }
  }
}
</style>
