<template>
  <WhiteSheet>
    <div class="d-flex align-center px-6 pt-7">
      <BlockTitle
        :icon="require('@/assets/images/icons/icon-token-grey.png')"
        text1="My Tokens Value"
        text2="$3,132.25"
      />
      <div class="ml-auto">
        <v-btn
          class="text-transform--initial"
          text
          small
          depressed
          :color="$vuetify.theme.themes.light.emerald"
        >
          <v-icon small class="top-button-icon">mdi-chevron-right</v-icon>
          Ethplorer
        </v-btn>
        <v-btn
          class="text-transform--initial"
          text
          small
          depressed
          :color="$vuetify.theme.themes.light.emerald"
        >
          <v-icon small class="top-button-icon">mdi-plus</v-icon>
          Custom Token
        </v-btn>
      </div>
    </div>

    <table class="tokens-table mt-4" :class="theme">
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
        <tr v-for="(data, key) in tableData" :key="key">
          <td>
            <img
              class="vertical-align--middle"
              src="@/assets/images/currencies//eth.png"
              width="25"
            />
          </td>
          <td>{{ data.name }}</td>
          <td>{{ data.price }}</td>
          <td>{{ data.marketCap }}</td>
          <td>
            <div class="d-flex align-center">
              <ChartTiny
                class="ml-n2 mr-2"
                :data="chartData(key)"
                :linecolor="
                  data.changes > 0
                    ? 'var(--v-emerald-base)'
                    : 'var(--v-light_red-base)'
                "
              />
              <div class="d-flex align-center">
                <div
                  :class="
                    data.changes > 0 ? 'emerald--text' : 'light_red--text'
                  "
                >
                  {{ data.changes }}
                </div>
                <v-icon v-if="data.changes > 0" class="emerald--text body-2"
                  >mdi-arrow-up-bold</v-icon
                >
                <v-icon v-if="data.changes < 0" class="light_red--text body-2"
                  >mdi-arrow-down-bold</v-icon
                >
              </div>
            </div>
          </td>
          <td>
            <div>
              <div>{{ data.tokenAmount }}</div>
              <div class="emerald--text">{{ data.tokenValue }}</div>
            </div>
          </td>
          <td>
            <mew-button
              :has-full-width="false"
              btn-style="outline"
              title="Trade"
              button-size="small"
            />
          </td>
        </tr>
      </tbody>
    </table>
  </WhiteSheet>
</template>

<script>
import WhiteSheet from '@/web/components/Common/WhiteSheet';
import ChartTiny from '@/web/components/Charts/Tiny';
import BlockTitle from '@/web/components/BlockTitles/BlockTitle1';

export default {
  components: { WhiteSheet, ChartTiny, BlockTitle },
  data() {
    return {
      tableData: [
        {
          name: 'XMR',
          price: '$8.29',
          marketCap: '$1.53B',
          changes: 0.23,
          tokenAmount: 17.34,
          tokenValue: '$18.32'
        },
        {
          name: 'AMIS',
          price: '$10.72',
          marketCap: '$0.25B',
          changes: -2.14,
          tokenAmount: 27.54,
          tokenValue: '$228.42'
        }
      ]
    };
  },
  methods: {
    chartData(val) {
      const chart = [
        [
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
        [
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
      ];
      return chart[val];
    }
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
    background-color: var(--v-bg_table-base);
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
      &:last-child td {
        border-bottom: 0;
      }
    }
    td {
      padding: 5px 10px;
    }
    td:first-child {
      padding-left: 30px;
    }
    td:last-child {
      padding-right: 30px;
    }
  }

  &.light tbody td {
    border-bottom: 1px solid $theme-light--table-border-color;
  }

  &.dark tbody td {
    border-bottom: 1px solid $theme-dark--table-border-color;
  }
}
</style>
