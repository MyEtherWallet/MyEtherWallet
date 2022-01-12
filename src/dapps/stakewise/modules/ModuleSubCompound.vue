<template>
  <div>
    <mew6-white-sheet
      class="pa-md-15"
      :no-shadow="$vuetify.breakpoint.smAndDown"
    >
      <div class="mew-heading-2 mb-8">Compound Rewards</div>

      <!-- ======================================================================================= -->
      <!-- Stake direction information -->
      <!-- ======================================================================================= -->
      <div class="d-flex align-center text-center">
        <div
          class="border-radius--8px backgroundGrey flex-grow-1 pa-5 d-flex flex-column align-center"
          style="width: 30%"
        >
          <div class="mew-caption textMedium--text font-weight-regular mb-2">
            You give
          </div>
          <div class="stake-icon">
            <img
              src="@/assets/images/icons/icon-stakewise-red.svg"
              alt="Stakewise rETH2"
            />
          </div>
          <div class="font-weight-bold mt-2">rETH2</div>
        </div>
        <div class="px-5">
          <v-icon color="greenPrimary">mdi-arrow-right</v-icon>
        </div>
        <div
          class="border-radius--8px backgroundGrey flex-grow-1 pa-5 d-flex flex-column align-center"
          style="width: 30%"
        >
          <div class="mew-caption textLight--text font-weight-regular mb-2">
            You will get
          </div>
          <div class="stake-icon">
            <img
              src="@/assets/images/icons/icon-stakewise-green.svg"
              alt="Stakewise sETH2"
            />
          </div>
          <div class="font-weight-bold mt-2">sETH2</div>
        </div>
      </div>

      <!-- ======================================================================================= -->
      <!-- Amount to stake -->
      <!-- ======================================================================================= -->
      <div class="position--relative mt-15">
        <button-balance :loading="false" balance="10035342000" />
        <mew-input
          type="number"
          :max-btn-obj="{
            title: 'Max',
            disabled: false,
            method: setMaxAmount
          }"
          :image="iconStakewise"
          label="Amount to compound"
          placeholder="Enter amount"
          value=""
        />
      </div>

      <!-- ======================================================================================= -->
      <!-- How compounding works -->
      <!-- ======================================================================================= -->
      <div class="mt-3">
        <div class="font-weight-bold mb-4">How Compounding works</div>
        <div class="textMedium--text">
          To increase your staking balance and maximize your rewards, you can
          transfer your rETH2 rewards balance to the sETH2 staking pool.
        </div>

        <a
          href="https://www.mewtopia.com/rewards-and-risks-of-staking-crypto/"
          target="_blank"
        >
          <div class="greenPrimary--text mt-6">
            View StakeWise guide<v-icon color="greenPrimary" small class="ml-2">
              mdi-open-in-new
            </v-icon>
          </div>
        </a>
      </div>

      <!-- ======================================================================================= -->
      <!-- Divier -->
      <!-- ======================================================================================= -->
      <v-divider class="mt-12 mb-5" />

      <!-- ======================================================================================= -->
      <!-- Stake status -->
      <!-- ======================================================================================= -->
      <div class="stake-status">
        <div class="d-flex justify-space-between mb-5">
          <div>
            <div
              class="textLight--text mew-label font-weight-medium text-uppercase"
            >
              Network Fee
            </div>
            <div class="textLight--text text-decoration-underline">
              Edit priority
            </div>
          </div>
          <div class="text-right">
            <div class="">0.023422 ETH</div>
            <div class="mew-label textLight--text">$120.98</div>
          </div>
        </div>
        <div class="d-flex justify-space-between mb-5">
          <div
            class="textLight--text mew-label font-weight-medium text-uppercase"
          >
            0.3% Staking Fee
          </div>
          <div class="text-right">
            <div class="">0.38421 ETH</div>
            <div class="mew-label textLight--text">$120.98</div>
          </div>
        </div>
      </div>

      <!-- ======================================================================================= -->
      <!-- Divier -->
      <!-- ======================================================================================= -->
      <v-divider class="mt-4 mb-9" />

      <!-- ======================================================================================= -->
      <!-- Start -->
      <!-- ======================================================================================= -->
      <div class="d-flex flex-column align-center">
        <mew-checkbox
          label="I have read and agreeed to Stakewise terms of
      service."
          :link="{
            title: 'Stakewise terms',
            url: 'https://stakewise.io/terms-and-conditions/'
          }"
        />
        <mew-button class="mt-8" title="Compound Rewards" btn-size="xlarge" />
      </div>
    </mew6-white-sheet>
  </div>
</template>

<script>
import ButtonBalance from '@/core/components/AppButtonBalance';
export default {
  name: 'ModuleSubStakeEth',
  components: { ButtonBalance },
  data() {
    return {
      iconStakewise: require('@/assets/images/icons/icon-stakewise-red.svg')
    };
  },
  computed: {},
  methods: {
    setMaxAmount() {}
  }
};
</script>

<style lang="scss" scoped>
.stake-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--v-greyLight-base) !important;
  border-radius: 50% !important;
  width: 52px;
  height: 52px;
  background-color: var(--v-whiteBackground-base);

  img {
    height: 30px;
  }
}

ul {
  li {
    margin-bottom: 12px;
    padding-left: 27px;

    &:before {
      font-size: 11px;
      content: '◆';
      margin-left: -23px;
      margin-right: 10px;
      color: var(--v-greenPrimary-base);
    }
  }
}
</style>
