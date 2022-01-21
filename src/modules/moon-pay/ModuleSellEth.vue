<template>
  <div class="pt-10">
    <!-- ============================================================== -->
    <!-- Currency select -->
    <!-- ============================================================== -->
    <mew-select label="Currency" :items="currencyItems" />

    <!-- ============================================================== -->
    <!-- Amount -->
    <!-- ============================================================== -->
    <div class="position--relative mt-9">
      <button-balance balance="0.435" loading />
      <mew-input
        type="number"
        label="Amount"
        placeholder="Enter amount to sell"
        :max-btn-obj="{
          title: 'Max',
          disabled: false,
          method: () => {}
        }"
      />
    </div>

    <!-- ============================================================== -->
    <!-- Summary -->
    <!-- ============================================================== -->
    <div class="mt-6">
      <div class="d-flex align-center justify-space-between">
        <div class="font-weight-medium">Summary</div>
        <div class="mew-label textMedium--text d-flex align-center">
          <v-icon color="textMedium" small class="mr-1">
            mdi-clock-time-three-outline
          </v-icon>
          Valid for 9s
        </div>
      </div>
      <div class="d-flex align-center justify-space-between mt-4">
        <div>ETH price</div>
        <div class="text-right">$4,352.54</div>
      </div>
      <div class="d-flex align-center justify-space-between mt-4">
        <div>You sell</div>
        <div class="text-right">2 ETH</div>
      </div>
      <div class="d-flex align-center justify-space-between mt-4">
        <div>You get</div>
        <div class="text-right">$8,545.00</div>
      </div>

      <!-- ============================================================== -->
      <!-- (Expending block) Show fees -->
      <!-- ============================================================== -->
      <expending-block class="mt-4" btn-right btn-bottom>
        <template #headerShow>
          <div class="greenPrimary--text">Show fees</div>
        </template>
        <template #headerHide>
          <div class="greenPrimary--text">Hide fees</div>
        </template>
        <template #content>
          <div>
            <div class="d-flex align-center justify-space-between mb-4">
              <div class="textLight--text">Processing fee</div>
              <div class="textLight--text text-right">0.234827 ETH</div>
            </div>
            <div class="d-flex align-center justify-space-between mb-4">
              <div class="textLight--text">Network fee</div>
              <div class="textLight--text text-right">0.234827 ETH</div>
            </div>
          </div>
        </template>
      </expending-block>
    </div>

    <!-- ============================================================== -->
    <!-- Sell button -->
    <!-- ============================================================== -->
    <mew-button
      title="Sell now"
      btn-size="xlarge"
      has-full-width
      class="mt-10"
    />
  </div>
</template>

<script>
import ButtonBalance from '@/core/components/AppButtonBalance';
import ExpendingBlock from '@/core/components/AppExpendingBlock';
export default {
  name: 'ModuleSellEth',
  components: { ButtonBalance, ExpendingBlock },
  data() {
    return {
      currencyItems: [
        {
          text: 'Select a currency',
          selectLabel: true,
          divider: true
        },
        {
          name: 'ETH',
          subtext: 'Ethereum',
          value: 'eth'
        },
        {
          name: 'USDC',
          subtext: 'USD Coin',
          value: 'usdc'
        },
        {
          name: 'USDT',
          subtext: 'Tether',
          value: 'usdt'
        }
      ]
    };
  },
  methods: {}
};
</script>

<style lang="scss" scoped></style>
