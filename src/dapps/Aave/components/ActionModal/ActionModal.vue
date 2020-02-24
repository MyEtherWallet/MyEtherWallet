<template>
  <div class="modal-container action-modal">
    <b-modal
      ref="actionModal"
      :title="
        depositModal ? $tc('dappsAave.deposit', 1) : $t('dappsAave.borrow')
      "
      centered
      hide-footer
      static
      lazy
    >
      <div class="modal-contents">
        <div class="header-container">
          <div class="search-container">
            <i class="fa fa-search" />
            <input
              v-model="search"
              :placeholder="$t('dappsAave.search-tokens')"
            />
          </div>
          <div class="type-token-container">
            <span>{{ $t('dappsAave.type-token') }}</span>
            <div class="tab-container">
              <div
                :class="['action-btn', allTabActive ? 'active-tab' : '']"
                @click="toggleTabs()"
              >
                {{ $t('dappsAave.all') }}
              </div>
              <div
                :class="[
                  'action-btn',
                  'stable-btn',
                  stableTabActive ? 'active-tab' : ''
                ]"
                @click="toggleTabs()"
              >
                {{ $t('dappsAave.stable') }}
              </div>
            </div>
          </div>
        </div>
        <div class="table-container">
          <table>
            <thead>
              <th class="number-header">#</th>
              <th>{{ $t('dappsAave.token') }}</th>
              <th>
                <div class="sort-enabled-container">
                  {{
                    depositModal
                      ? $t('dappsAave.avail-balance')
                      : $t('dappsAave.avail-for-you')
                  }}
                  <span>
                    <i class="fa fa-caret-up" @click="sort('ascending', 0)" />
                    <i
                      class="fa fa-caret-down"
                      @click="sort('descending', 0)"
                    />
                  </span>
                </div>
              </th>
              <th>
                <div class="sort-enabled-container">
                  {{
                    depositModal
                      ? $t('dappsAave.deposited')
                      : $t('dappsAave.stable-apr')
                  }}
                  <span>
                    <i class="fa fa-caret-up" @click="sort('ascending', 1)" />
                    <i
                      class="fa fa-caret-down"
                      @click="sort('descending', 1)"
                    />
                  </span>
                </div>
              </th>
              <th>
                <div class="sort-enabled-container">
                  {{
                    depositModal
                      ? $t('dappsAave.apr')
                      : $t('dappsAave.variable-apr')
                  }}
                  <span>
                    <i class="fa fa-caret-up" @click="sort('ascending', 2)" />
                    <i
                      class="fa fa-caret-down"
                      @click="sort('descending', 2)"
                    />
                  </span>
                </div>
              </th>
              <th></th>
            </thead>
            <tbody v-if="!loadingReserves && localReserves.length > 0">
              <tr v-for="(token, index) in localReserves" :key="token.key">
                <td class="number">{{ index + 1 }}.</td>
                <td>
                  <img
                    v-if="!getIcon(token.symbol)"
                    class="token-icon"
                    :src="iconFetcher(token.symbol)"
                  />
                  <span
                    v-if="getIcon(token.symbol)"
                    :class="[
                      'cc',
                      getIcon(token.symbol),
                      'cc-icon',
                      'currency-symbol'
                    ]"
                  ></span
                  ><span v-if="token.name !== 'USD//C'">{{ token.name }}</span
                  ><span v-if="token.name === 'USD//C'">{{
                    token.symbol
                  }}</span>
                </td>
                <td>
                  {{
                    depositModal
                      ? convertToFixed(token.tokenBalance)
                      : getTokenAvail(token)
                  }}
                  {{ token.symbol }}
                </td>
                <td :class="depositModal ? '' : 'stable-apr'">
                  {{
                    depositModal
                      ? token.user
                        ? convertToFixed(token.user.principalATokenBalance)
                        : 0
                      : token.stableBorrowRateEnabled
                      ? convertToFixed(token.stableBorrowRate * 100) + '%'
                      : '--'
                  }}
                  {{ depositModal ? token.symbol : '' }}
                </td>
                <td :class="depositModal ? '' : 'var-apr'">
                  {{
                    depositModal
                      ? convertToFixed(token.liquidityRate * 100)
                      : convertToFixed(token.variableBorrowRate * 100)
                  }}%
                </td>
                <td>
                  <span :title="isDisabled(token) ? disabledTooltip : ''">
                    <button
                      :class="[
                        'action-btn',
                        isDisabled(token) ? 'disabled' : ''
                      ]"
                      @click="takeAction(token)"
                    >
                      {{
                        depositModal
                          ? $tc('dappsAave.deposit', 1)
                          : $t('dappsAave.borrow')
                      }}
                    </button>
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
          <i v-show="loadingReserves" class="fa fa-spinner fa-spin table-msg" />
          <p
            v-if="localReserves.length === 0 && !loadingReserves"
            class="table-msg"
          >
            {{ $t('dappsAave.no-tokens') }}
          </p>
        </div>
      </div>
    </b-modal>
  </div>
</template>

<script>
import BigNumber from 'bignumber.js';
import '@/assets/images/currency/coins/asFont/cryptocoins.css';
import '@/assets/images/currency/coins/asFont/cryptocoins-colors.css';
import { hasIcon } from '@/partners';

export default {
  props: {
    reservesStable: {
      type: Array,
      default: function() {
        return [];
      }
    },
    depositModal: {
      type: Boolean,
      default: true
    },
    reserves: {
      type: Array,
      default: function() {
        return [];
      }
    },
    loadingReserves: {
      type: Boolean,
      default: true
    },
    availEth: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      search: '',
      allTabActive: true,
      stableTabActive: false,
      localReserves: []
    };
  },
  computed: {
    disabledTooltip() {
      return this.depositModal
        ? this.$t('dappsAave.transfer-currencies')
        : this.$t('dappsAave.no-liquidity');
    }
  },
  watch: {
    depositModal() {
      this.search = '';
    },
    reserves(newVal) {
      this.getLocalReserves(newVal);
    },
    search(newVal) {
      this.localReserves = [];
      if (newVal !== '') {
        this.reserves.filter(reserve => {
          if (reserve.name) {
            if (reserve.name.toLowerCase().includes(newVal.toLowerCase())) {
              this.localReserves.push(reserve);
            }
          } else if (reserve.symbol) {
            if (reserve.symbol.toLowerCase().includes(newVal.toLowerCase())) {
              this.localReserves.push(reserve);
            }
          }
        });
      } else {
        this.getLocalReserves(this.reserves);
      }
    }
  },
  mounted() {
    this.getLocalReserves(this.reserves);
  },
  methods: {
    iconFetcher(currency) {
      let icon;
      try {
        // eslint-disable-next-line
        icon = require(`@/assets/images/currency/coins/AllImages/${currency.toUpperCase()}.svg`);
      } catch (e) {
        // eslint-disable-next-line
        return require(`@/assets/images/icons/web-solution.svg`);
      }
      return icon;
    },
    isDisabled(token) {
      if (this.depositModal && token.tokenBalance == 0) {
        return true;
      } else if (!this.depositModal && token.availableLiquidity == 0) {
        return true;
      }
    },
    getTokenAvail(token) {
      const price = token.price.priceInEth;
      const tokenAvail = new BigNumber(this.availEth).div(price).toFixed(2);
      token.availableAmt = tokenAvail;
      return tokenAvail;
    },
    getIcon(currency) {
      return hasIcon(currency);
    },
    getLocalReserves(reserves) {
      this.localReserves = reserves;
    },
    sort(direction, colIdx) {
      if (direction === 'ascending') {
        this.localReserves.sort((a, b) => {
          const A = this.getVal(a, colIdx);
          const B = this.getVal(b, colIdx);
          return A - B;
        });
      } else {
        this.localReserves.sort((a, b) => {
          const A = this.getVal(a, colIdx);
          const B = this.getVal(b, colIdx);
          return B - A;
        });
      }
    },
    getVal(obj, idx) {
      const borrowColumnNames = [
        'availableAmt',
        'stableBorrowRate',
        'variableBorrowRate'
      ];
      const depositColumnNames = ['tokenBalance', 'user', 'liquidityRate'];
      const columnNames = this.depositModal
        ? depositColumnNames
        : borrowColumnNames;

      if (obj[columnNames[idx]] === undefined) {
        return 0;
      }
      if (idx === 1 && !this.depositModal && !obj.stableBorrowRateEnabled) {
        return 0;
      }
      if (idx === 1 && this.depositModal) {
        return obj[columnNames[idx]].principalATokenBalance;
      }

      return obj[columnNames[idx]];
    },
    toggleTabs() {
      this.allTabActive = !this.allTabActive;
      this.stableTabActive = !this.stableTabActive;
      this.localReserves = this.stableTabActive
        ? this.reservesStable
        : this.reserves;
    },
    takeAction(token) {
      this.$refs['actionModal'].hide();
      this.$router.push({ name: 'Action', params: { token: token } });
    },
    convertToFixed(val) {
      if (!val || val == 0) {
        return 0;
      }
      return new BigNumber(val).toFixed(2).toString();
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'ActionModal.scss';
</style>

<style lang="scss">
.action-modal {
  .modal-dialog {
    max-width: 800px !important;
  }
}

.modal-body {
  padding: 0 !important;
}
</style>
