<template>
  <div class="modal-container">
    <b-modal
      ref="actionModal"
      :title="depositModal ? 'Deposit' : 'Borrow'"
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
                    <i class="fa fa-caret-up" />
                    <i class="fa fa-caret-down" />
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
                    <i class="fa fa-caret-up" />
                    <i class="fa fa-caret-down" />
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
                    <i class="fa fa-caret-up" />
                    <i class="fa fa-caret-down" />
                  </span>
                </div>
              </th>
              <th></th>
            </thead>
            <tbody>
              <tr v-for="(token, index) in reserves" :key="token.key">
                <td class="number">{{ index + 1 }}.</td>
                <td>{{ token.name }}</td>
                <td>
                  {{
                    depositModal
                      ? convertToEther(token.currentATokenBalance)
                      : convertToEther(token.availableLiquidity)
                  }}
                </td>
                <td :class="depositModal ? '' : 'stable-apr'">
                  {{
                    depositModal
                      ? convertToEther(token.currentUnderlyingBalance)
                      : convertToEther(token.fixedBorrowRate)
                  }}
                </td>
                <td :class="depositModal ? '' : 'var-apr'">
                  {{
                    depositModal
                      ? convertToEther(token.borrowRate)
                      : convertToEther(token.variableBorrowRate)
                  }}
                </td>
                <td>
                  <button class="action-btn" @click="takeAction(index)">
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
    }
  },
  data() {
    return {
      search: '',
      allTabActive: true,
      stableTabActive: false,
      fakeObj: [
        {
          token: 'DAI',
          availBalance: '15.42323 DAI',
          deposited: '2.47 DAI',
          apr: '9.72%'
        },
        {
          token: 'DAI',
          availBalance: '15.42323 DAI',
          deposited: '2.47 DAI',
          apr: '9.72%'
        }
      ]
    };
  },
  computed: {
    title: function() {
      return this.depositModal ? 'Deposit' : 'Borrow';
    }
  },
  methods: {
    toggleTabs() {
      this.allTabActive = !this.allTabActive;
      this.stableTabActive = !this.stableTabActive;
    },
    takeAction(idx) {
      this.$refs['actionModal'].hide();
      this.$router.push({name: 'Action', params: {id: idx}});
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
.modal-dialog {
  max-width: 600px !important;
}

.modal-body {
  padding: 0 !important;
}
</style>
