<template>
  <div class="pt-8 pb-13 px-3 pa-sm-15">
    <v-row>
      <v-col
        :order="$vuetify.breakpoint.smAndDown ? 'last' : ''"
        cols="12"
        md="8"
        :class="$vuetify.breakpoint.smAndDown ? 'my-10' : 'pr-7'"
      >
        <mew6-white-sheet
          class="pa-md-15"
          :no-shadow="$vuetify.breakpoint.smAndDown"
        >
          <div class="mew-heading-2 mb-8">
            Stake {{ currencyName }} with Stakewise
          </div>

          <!-- ======================================================================================= -->
          <!-- Stake direction information -->
          <!-- ======================================================================================= -->
          <div class="d-flex align-center text-center">
            <div
              class="border-radius--8px backgroundGrey flex-grow-1 pa-5 d-flex flex-column align-center"
              style="width: 30%"
            >
              <div
                class="mew-caption textMedium--text font-weight-regular mb-2"
              >
                You give
              </div>
              <div class="stake-icon">
                <img src="@/assets/images/icons/icon-eth-gray.svg" alt="Eth" />
              </div>
              <div class="font-weight-bold mt-2">ETH</div>
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
                  src="@/dapps/stakewise/assets/icon-stakewise-green.svg"
                  alt="Stakewise"
                />
              </div>
              <div class="font-weight-bold mt-2">sETH2</div>
            </div>
          </div>

          <!-- ======================================================================================= -->
          <!-- Amount to stake -->
          <!-- ======================================================================================= -->
          <div class="position--relative mt-15">
            <button-balance :loading="false" :balance="balanceInETH" />
            <mew-input
              type="number"
              :max-btn-obj="{
                title: 'Max',
                disabled: false,
                method: () => {}
              }"
              :image="iconEth"
              label="Amount to stake"
              placeholder="Enter amount"
              value=""
            />
          </div>

          <!-- ======================================================================================= -->
          <!-- How stake works -->
          <!-- ======================================================================================= -->
          <div class="mt-3">
            <div class="font-weight-bold mb-4">How staking works</div>
            <ul class="textMedium--text">
              <li>
                Anyone can deposit any amount of {{ currencyName }} into the
                Stakewise pool. No minimum required.
              </li>
              <li>
                For each new deposit into the pool, Stakewise mints an equal
                amount of sETH2 (1 {{ currencyName }} = 1 sETH2).
              </li>
              <li>
                Holders of sETH2 will start accruing rETH2 rewards within 24
                hours of receiving the sETH2 token.
              </li>
              <li>Stakewise takes 10% of the staking reward.</li>
            </ul>

            <a
              href="https://www.mewtopia.com/rewards-and-risks-of-staking-crypto/"
              target="_blank"
            >
              <div class="greenPrimary--text mt-6">
                View StakeWise guide<v-icon
                  color="greenPrimary"
                  small
                  class="ml-2"
                >
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
              <div
                class="textLight--text mew-label font-weight-medium text-uppercase"
              >
                Current APR
              </div>
              <div class="text-right">
                <div class="greenPrimary--text">{{ validatorApr }}%</div>
              </div>
            </div>
            <div class="d-flex justify-space-between mb-5">
              <div
                class="textLight--text mew-label font-weight-medium text-uppercase"
              >
                Total Staked
              </div>
              <div class="text-right">
                <div class="greenPrimary--text">
                  {{ getPoolSupply }} {{ currencyName }}
                </div>
                <div class="mew-label textLight--text">$120.98</div>
              </div>
            </div>
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
                <div class="">0.023422 {{ currencyName }}</div>
                <div class="mew-label textLight--text">$120.98</div>
              </div>
            </div>
            <div class="d-flex justify-space-between mb-5">
              <div
                class="textLight--text mew-label font-weight-medium text-uppercase"
              >
                {{ getStakingFee }}% Staking Fee
              </div>
              <div class="text-right">
                <div class="">0.38421 {{ currencyName }}</div>
                <div class="mew-label textLight--text">$120.98</div>
              </div>
            </div>
          </div>

          <!-- ======================================================================================= -->
          <!-- Divier -->
          <!-- ======================================================================================= -->
          <v-divider class="mt-4 mb-9" />

          <!-- ======================================================================================= -->
          <!-- Start staking -->
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
            <mew-button class="mt-8" title="Start staking" btn-size="xlarge" />
          </div>
        </mew6-white-sheet>
      </v-col>
      <v-col cols="12" md="4">
        <stakewise-apr class="mb-4" />
        <stakewise-staking compound-rewards class="mb-4" />
        <stakewise-rewards compound-rewards />
      </v-col>
    </v-row>
  </div>
</template>

<script>
import StakewiseApr from '../components/StakewiseApr';
import StakewiseStaking from '../components/StakewiseStaking';
import StakewiseRewards from '../components/StakewiseRewards';
import ButtonBalance from '@/core/components/AppButtonBalance';
import { mapGetters, mapState } from 'vuex';
export default {
  name: 'ModuleStakewiseStake',
  components: {
    StakewiseApr,
    StakewiseStaking,
    StakewiseRewards,
    ButtonBalance
  },
  data() {
    return {
      iconEth: require('@/assets/images/icons/icon-eth-gray.svg')
    };
  },
  computed: {
    ...mapGetters('wallet', ['balanceInETH']),
    ...mapGetters('stakewise', ['getStakingFee', 'getPoolSupply']),
    ...mapGetters('global', ['network']),
    ...mapState('stakewise', ['validatorApr']),
    currencyName() {
      return this.network.type.currencyName;
    }
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
