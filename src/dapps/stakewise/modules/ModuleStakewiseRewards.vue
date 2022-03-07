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
          <div class="mew-heading-2 mb-8">Compound Rewards</div>

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
                <img
                  src="@/dapps/stakewise/assets/icon-stakewise-red.svg"
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
                  src="@/dapps/stakewise/assets/icon-stakewise-green.svg"
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
            <button-balance :loading="false" :balance="balanceInETH" />
            <mew-input
              type="number"
              :max-btn-obj="{
                title: 'Max',
                disabled: false,
                method: setMax
              }"
              :image="iconStakewise"
              label="Amount to compound"
              placeholder="Enter amount"
              :value="compoundAmount"
              @input="getQuote"
            />
          </div>

          <!-- ======================================================================================= -->
          <!-- How compounding works -->
          <!-- ======================================================================================= -->
          <div class="mt-3">
            <div class="font-weight-bold mb-4">How Compounding works</div>
            <div class="textMedium--text">
              To increase your staking balance and maximize your rewards, you
              can transfer your rETH2 rewards balance to the sETH2 staking pool.
            </div>

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
              label="I have read and agreeed to Stakewise terms of service."
              :link="{
                title: 'Stakewise terms',
                url: 'https://stakewise.io/terms-and-conditions/'
              }"
            />
            <mew-button
              class="mt-8"
              title="Compound Rewards"
              btn-size="xlarge"
            />
          </div>
        </mew6-white-sheet>
      </v-col>
      <v-col cols="12" md="4">
        <stakewise-apr class="mb-4" />
        <stakewise-staking class="mb-4" />
        <stakewise-rewards />
      </v-col>
    </v-row>
  </div>
</template>

<script>
import StakewiseApr from '../components/StakewiseApr';
import StakewiseStaking from '../components/StakewiseStaking';
import StakewiseRewards from '../components/StakewiseRewards';
import ButtonBalance from '@/core/components/AppButtonBalance';
// import stakeHandler from '../handlers/stakewiseStakeHandler';
import Swapper from '@/modules/swap/handlers/handlerSwap';
import BigNumber from 'bignumber.js';
import { debounce } from 'lodash';
import { mapGetters, mapState } from 'vuex';
import { find } from 'lodash';
import {
  SETH2_MAINNET_CONTRACT,
  RETH2_MAINNET_CONTRACT,
  RETH2_GOERLI_CONTRACT,
  SETH2_GOERLI_CONTRACT
} from '@/dapps/stakewise/handlers/configs.js';
export default {
  name: 'ModuleStakewiseRewards',
  components: {
    StakewiseApr,
    StakewiseStaking,
    StakewiseRewards,
    ButtonBalance
  },
  data() {
    return {
      iconStakewise: require('@/dapps/stakewise/assets/icon-stakewise-red.svg'),
      compoundAmount: '0',
      locGasPrice: '0'
      // stakeHandler: {}
    };
  },
  computed: {
    ...mapGetters('wallet', ['balanceInETH', 'tokensList']),
    ...mapGetters('stakewise', ['getStakingFee']),
    ...mapGetters('global', ['network', 'isEthNetwork', 'gasPriceByType']),
    ...mapGetters('external', ['fiatValue']),
    ...mapState('wallet', ['web3', 'address']),
    ...mapState('stakewise', ['validatorApr']),
    ...mapState('global', ['gasPriceType']),
    seth2Contract() {
      return this.isEthNetwork ? SETH2_MAINNET_CONTRACT : SETH2_GOERLI_CONTRACT;
    },
    reth2Contract() {
      return this.isEthNetwork ? RETH2_MAINNET_CONTRACT : RETH2_GOERLI_CONTRACT;
    },
    hasSeth() {
      const token = find(
        this.tokensList,
        item => item.contract.toLowerCase() === this.seth2Contract.toLowerCase()
      );
      return token;
    },
    hasReth() {
      const token = find(
        this.tokensList,
        item => item.contract.toLowerCase() === this.reth2Contract.toLowerCase()
      );
      return token;
    },
    rethBalance() {
      return '0.19';
      // return this.hasReth ? this.hasReth.balancef : '0';
    }
    // rethUsdBalance() {
    //   return this.hasReth ? this.hasReth.usdBalancef : '0';
    // }
  },
  mounted() {
    // this.stakeHandler = new stakeHandler(
    //   this.web3,
    //   this.isEthNetwork,
    //   this.address
    // );
    this.locGasPrice = this.gasPriceByType(this.gasPriceType);
  },
  methods: {
    setMax() {
      const max = BigNumber(this.rethBalance);
      this.setAmount(max.toString());
    },
    setAmount: debounce(val => {
      const value = val ? val : 0;
      // this.stakeHandler._setAmount(BigNumber(value).toString());
      this.compoundAmount = BigNumber(value).toString();
    }, 500),
    getQuote: debounce(() => {
      const swapper = new Swapper(this.web3, this.network.type.name);
      return swapper
        .getAllQuotes({
          fromT: this.hasSeth,
          toT: this.hasReth,
          // hardcoded compound amount for now
          fromAmount: new BigNumber('0.18').times(
            new BigNumber(10).pow(new BigNumber(18))
          )
        })
        .then(quotes => {
          console.log('quotes', quotes);
        });
    }, 500)
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
