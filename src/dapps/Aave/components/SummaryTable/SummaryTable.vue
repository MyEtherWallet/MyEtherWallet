<template>
  <div class="summary-table-container">
    <table>
      <!-- <colgroup>
        <col width="15%" />
        <col width="15%" />
        <col width="15%" />
        <col width="10%" />
        <col width="25%" />
        <col width="20%" />
      </colgroup> -->
      <thead>
        <th class="token-header">{{ $t('dappsAave.token') }}</th>
        <th>{{ activeDepositTab ? $t('dappsAave.deposited') : $t('dappsAave.amount-borrowed') }}</th>
        <th>{{ activeDepositTab ? $t('dappsAave.earned') : $t('dappsAave.acc-interest')}}</th>
        <th>{{ $t('dappsAave.apr') }}</th>
        <th>{{ activeDepositTab ? $t('dappsAave.use-collateral') : $t('dappsAave.apr-type')}}</th>
        <th></th>
      </thead>
      <tbody>
        <tr v-for="(token, index) in reserves" :key="token.key">
          <!-- need to change icon -->
          <td class="token-name">
            <img
              class="token-icon mr-2"
              src="@/assets/images/currency/eth.svg"
            />{{ token.name }}
          </td>
          <td class="pt-3">
            <!-- placeholder -->
            <span>$232.32</span>
            <span class="eth-amt">1.4343 {{ $t('common.currency.eth') }}</span>
          </td>
          <td class="pt-3">
            <!-- placeholder -->
            <span>$32.32</span>
            <span class="eth-amt">0.02 {{ $t('common.currency.eth') }}</span>
          </td>
          <td>
            <!-- placeholder -->
            8.91 %
          </td>
          <td class="slider-container" v-if="activeDepositTab">
            <div class="sliding-switch-white">
              <label class="switch">
                <input type="checkbox" @click="useAsCollateral(index)" />
                <span class="slider round" />
              </label>
            </div>
          </td>
          <td class="slider-container" v-if="!activeDepositTab">
            <div class="sliding-switch-white">
              <label class="switch">
                <input type="checkbox" :checked="token.isStable" @click="changeType(index)" />
                <span class="slider borrow-slider round" />
              </label>
            </div>
            <span>{{ token.isStable ? $t('dappsAave.stable') : $t('dappsAave.variable') }}</span>
          </td>
          <td class="button-container">
            <button>{{ activeDepositTab ? $tc('dappsAave.deposit', 1) : $t('dappsAave.borrow') }}</button>
            <button>{{ activeDepositTab ? $t('dappsAave.withdraw') : $t('dappsAave.repay') }}</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  props: {
    reserves: {
      type: Array,
       default: function() {
        return [];
      }
    },
    activeDepositTab: {
      type: Boolean,
      default: true
    }
  },
  mounted() {
    // console.error('reerve', this.reserves[0].isStable)
  },
  methods: {
    useAsCollateral(idx) {
      console.error("idx", idx)
      this.reserves[idx].isCollateral = !this.reserves[idx].isCollateral;
    },
    changeType(idx) {
      console.error("idx", idx)
      // this.reserves[idx].isCollateral = !this.reserves[idx].isCollateral;
    }
  }
}
</script>

<style lang="scss" scoped>
@import 'SummaryTable.scss';
</style>