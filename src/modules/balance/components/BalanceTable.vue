<template>
  <div>
    <app-table
      v-if="!isMobile"
      background
      full-width
      flat
      border-bottom
      class="mt-4 mb-4"
    >
      <table>
        <thead>
          <tr>
            <td>TOKEN</td>
            <td>PRICE</td>
            <td>MARKET CAP</td>
            <td>24H</td>
            <td>BALANCE</td>
            <td></td>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(td, dataKey) in tableData" :key="dataKey">
            <td>
              <div class="d-flex align-center mew-label">
                <mew-token-container
                  :img="td.tokenImg"
                  size="20px"
                  class="mr-2"
                />
                {{ td.token }}
              </div>
            </td>
            <td class="mew-label">
              <div v-if="td.price">
                {{ td.price }}
                <span style="font-size: 11px" class="textLight--text"
                  >/ token</span
                >
              </div>
            </td>
            <td class="mew-label">{{ td.cap }}</td>
            <td>
              <div v-if="td.change">
                <div v-if="td.status == '+'" class="d-flex align-center">
                  <div class="mew-label greenPrimary--text">
                    {{ td.change }}%
                  </div>
                  <v-icon small color="greenPrimary">
                    mdi-arrow-up-thick
                  </v-icon>
                </div>
                <div v-else class="d-flex align-center">
                  <div class="mew-label redPrimary--text">{{ td.change }}%</div>
                  <v-icon small color="redPrimary">
                    mdi-arrow-down-thick
                  </v-icon>
                </div>
              </div>
            </td>
            <td class="mew-label">
              <div class="mew-label">{{ td.balance[0] }}</div>
              <div style="font-size: 11px" class="textLight--text">
                {{ td.balance[1] }}
              </div>
            </td>
            <td>
              <template v-if="td.callToAction">
                <mew-button
                  v-for="(button, idx) in td.callToAction"
                  :key="idx"
                  btn-style="outline"
                  btn-size="small"
                  @click.native="button.method(td)"
                >
                  {{ button.title }}
                </mew-button>
              </template>
            </td>
          </tr>
        </tbody>
      </table>
    </app-table>

    <app-table
      v-for="(td, dataKey) in tableData"
      v-else
      :key="dataKey"
      class="mx-4 mt-2"
      full-width
      border-around
      padding-around
      flat
      round-corner
      mobile-background
    >
      <div class="d-flex align-center justify-space-between mb-1">
        <div class="mew-label font-weight-bold">Token</div>
        <div class="mew-label d-flex align-center">
          <mew-token-container :img="td.tokenImg" size="17px" class="mr-2" />
          {{ td.token }}
        </div>
      </div>
      <div class="d-flex align-center justify-space-between mb-1">
        <div class="mew-label font-weight-bold">Price</div>
        <div class="mew-label">{{ td.price }}</div>
      </div>
      <div class="d-flex align-center justify-space-between mb-1">
        <div class="mew-label font-weight-bold">Market Cap</div>
        <div class="mew-label">{{ td.cap }}</div>
      </div>
      <div class="d-flex align-center justify-space-between mb-1">
        <div class="mew-label font-weight-bold">24H</div>
        <div class="mew-label">
          <div class="d-flex align-center">
            <div class="mew-label">{{ td.change }}%</div>
            <v-icon v-if="td.status == '+'" small color="greenPrimary">
              mdi-arrow-up-thick
            </v-icon>
            <v-icon v-else small color="redPrimary">
              mdi-arrow-down-thick
            </v-icon>
          </div>
        </div>
      </div>
      <div class="d-flex align-center justify-space-between mb-1">
        <div class="mew-label font-weight-bold">Balance</div>
        <div class="mew-label d-flex align-center">
          {{ td.balance[0] }} {{ td.balance[1] }}
        </div>
      </div>
      <div class="text-right mt-3">
        <template v-if="td.callToAction">
          <v-btn
            v-for="(button, idx) in td.callToAction"
            :key="idx"
            outlined
            color="greenPrimary"
            small
            depressed
            @click="button.method(td)"
          >
            <div class="greenPrimary--text mew-label text-transform--none">
              {{ button.title }}
            </div>
          </v-btn>
        </template>
      </div>
    </app-table>
  </div>
</template>

<script>
import AppTable from '@/core/components/AppTable';

export default {
  name: 'BalanceTable',
  components: { AppTable },
  props: {
    tableData: {
      type: Array,
      default: () => {
        return [];
      }
    }
  },
  data() {
    return {};
  },
  computed: {
    isMobile() {
      return this.$vuetify.breakpoint.mdAndDown;
    }
  },
  methods: {}
};
</script>

<style lang="scss" scoped></style>
