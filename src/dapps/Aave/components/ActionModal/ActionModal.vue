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
                <!-- need to change icon -->
                <td>
                  <img
                    class="token-icon"
                    src="@/assets/images/currency/eth.svg"
                  />{{ token.name }}
                </td>
                <td>
                  {{
                    depositModal
                      ? token.user
                        ? convertToFixed(token.user.principalATokenBalance)
                        : 0
                      : convertToFixed(token.availableLiquidity)
                  }}
                  {{ token.symbol }}
                </td>
                <td :class="depositModal ? '' : 'stable-apr'">
                  {{
                    depositModal
                      ? token.user
                        ? convertToFixed(token.user.principalATokenBalance)
                        : 0
                      : convertToFixed(token.stableBorrowRate * 100) + '%'
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
                  <button class="action-btn" @click="takeAction(token)">
                    {{
                      depositModal
                        ? $tc('dappsAave.deposit', 1)
                        : $t('dappsAave.borrow')
                    }}
                  </button>
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
import * as unit from 'ethjs-unit';
export default {
  props: {
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
  watch: {
    depositModal() {
      this.search = '';
    },
    reserves(newVal) {
      console.error('newVal', newVal);
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
          }
        });
      } else {
        this.getLocalReserves(this.reserves);
      }
    }
  },
  methods: {
    getLocalReserves(reserves) {
      this.localReserves = [];
      reserves.forEach(reserve => this.localReserves.push(reserve));
    },
    convertFromRay(int) {
      const rayUnit = new BigNumber(10).pow(27);
      const convertedInt = new BigNumber(int).div(rayUnit);
      return new BigNumber(convertedInt).times(100).toFixed(2);
    },
    sort(direction, colIdx) {
      const borrowColumnNames = [
        'availableLiquidity',
        'fixedBorrowRate',
        'variableBorrowRate'
      ];
      const depositColumnNames = [
        'currentATokenBalance',
        'currentUnderlyingBalance',
        'borrowRate'
      ];
      const columnNames = this.depositModal
        ? depositColumnNames
        : borrowColumnNames;
      if (direction === 'ascending') {
        this.localReserves.sort((a, b) => {
          return a[columnNames[colIdx]] - b[columnNames[colIdx]];
        });
      } else {
        this.localReserves.sort((a, b) => {
          return b[columnNames[colIdx]] - a[columnNames[colIdx]];
        });
      }
    },
    toggleTabs() {
      this.allTabActive = !this.allTabActive;
      this.stableTabActive = !this.stableTabActive;
    },
    takeAction(token) {
      this.$refs['actionModal'].hide();
      this.$router.push({ name: 'Action', params: { token: token } });
    },
    convertToFixed(val) {
      return new BigNumber(val).toFixed(2).toString();
    },
    convertToEther(wei) {
      if (!wei) {
        return '0';
      }
      return new BigNumber(unit.fromWei(wei, 'ether')).toFixed(2).toString();
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
    max-width: 700px !important;
  }
}

.modal-body {
  padding: 0 !important;
}
</style>
