<template>
  <!--
    ===================================================
    Step 4: Review & Stake
    ===================================================
    -->
  <div class="mx-auto pb-15" style="max-width: 550px">
    <div class="mew-heading-2 py-12 text-center">Review and stake</div>
    <v-row>
      <!--
    ===================================================
    Stake details
    ===================================================
    -->
      <v-col v-for="(detail, idx) in details" :key="detail + idx" cols="6">
        <div class="tableHeader pa-5 d-flex align-center rounded-lg">
          <div class="mr-3 mt-1">
            <img :src="detail.img" height="22" alt="eth icon" />
          </div>
          <div>
            <div
              class="
                captionPrimary--text
                text-uppercase
                detail-subtitle
                font-weight-medium
              "
            >
              {{ detail.subtitle }}
            </div>
            <div class="mew-heading-4 detail-title">{{ detail.title }}</div>
            <mew-transform-hash
              v-if="detail.isAddress"
              class="mew-hash-container textPrimary--text font-weight-medium"
              :hash="detail.desc"
            />
            <div v-if="!detail.isAddress" class="textPrimary--text">
              {{ detail.desc }}
            </div>
          </div>
        </div>
      </v-col>
    </v-row>
    <!--
    ===================================================
    Fees
    ===================================================
    -->
    <div class="mt-7">
      <div
        v-for="(fee, idx) in fees"
        :key="fee + idx"
        class="d-flex align-center justify-space-between"
      >
        <div class="mew-caption captionPrimary--text">{{ fee.title }}</div>
        <div>
          {{ fee.ethValue }} <span class="captionPrimary--text">ETH /</span>
          {{ fee.usdValue }}
        </div>
      </div>
    </div>
    <!--
    ===================================================
    Terms & Conditions
    ===================================================
    -->
    <div class="mt-12 pa-5 tableHeader">
      <mew-checkbox
        v-model="firstCondition"
        label="I understand that Staking is currently a one-way-street and won't be able to get my fund back until an unknown date in the future when transfers are enabled in Eth2."
      ></mew-checkbox>
      <mew-checkbox
        v-model="secondCondition"
        label="I understand that staking involves slashing risks and my funds can be lost."
      ></mew-checkbox>
      <mew-checkbox
        v-model="thirdCondition"
        label="I have read and agreed to Staked.us terms of service. This Staking feature is provided by Staked.us, and MEW is not liable for it's services."
      ></mew-checkbox>
    </div>
    <div class="stake-container mt-10 text-center rounded-lg py-6 px-12">
      <!--
    ===================================================
    Prepare to stake (Step 1)
    ===================================================
    -->
      <div v-if="stakedStep === 1">
        <div class="textBlack2--text">
          {{ stakedStep1Title.message }}
          <a
            v-if="stakedStep1Title.showContactSupport"
            class="cursor-pointer primary--text text-lowercase"
            href="mailto:support@myetherwallet.com"
            target="_blank"
          >
            {{ $t('common.contact-support') }} </a
          >.
        </div>
        <mew-button
          btn-size="xlarge"
          class="mt-3"
          title="Prepare for staking"
          :disabled="!firstCondition || !secondCondition || !thirdCondition"
          @click.native="prepareToStake"
        ></mew-button>
      </div>
      <!--
    ===================================================
    Preparing validators (Step 2)
    ===================================================
    -->
      <div v-if="stakedStep === 2">
        <div class="mew-heading-4 font-weight-medium">Preparing validators</div>
        <div class="textBlack2--text">
          This usually takes ~20 seconds, in rare cases it can take up to 10
          min.
        </div>
        <v-progress-linear
          class="mt-4"
          indeterminate
          color="primary"
        ></v-progress-linear>
      </div>
      <!--
    ===================================================
    Ready to stake (Step 3)
    ===================================================
    -->
      <div v-if="stakedStep === 3">
        <v-icon color="primary" class="mr-2">mdi-check-circle</v-icon>
        Ready to stake
      </div>
    </div>
    <!--
    ===================================================
    Back & Stake buttons
    ===================================================
    -->
    <div
      class="
        mt-10
        d-flex
        flex-column-reverse flex-md-row
        align-center
        justify-center
      "
    >
      <mew-button
        btn-size="xlarge"
        class="d-block ma-2"
        title="Back"
        btn-style="outline"
        @click.native="onBack"
      />
      <mew-button
        btn-size="xlarge"
        class="d-block ma-2"
        title="Stake 32 ETH"
        :disabled="!readyToStake"
        @click.native="onReadyToStake"
      >
      </mew-button>
    </div>
  </div>
</template>

<script>
import BigNumber from 'bignumber.js';
import configNetworkTypes from '@/dapps/staked-dapp/handlers/configNetworkTypes';
import { mapState, mapGetters } from 'vuex';
import eth from '@/assets/images/currencies/eth.png';
import iconColorfulETH from '@/assets/images/icons/icon-colorful-eth.svg';
import {
  formatFiatValue,
  formatBalanceEthValue
} from '@/core/helpers/numberFormatHelper';
import { ABI_GET_FEES } from '@/dapps/staked-dapp/handlers/handlerStaked';

export default {
  props: {
    amount: {
      type: Number,
      default: 0
    },
    eth2Address: {
      type: String,
      default: ''
    },
    startProvision: {
      type: Function,
      default: () => {}
    },
    pollingStatus: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      firstCondition: false,
      secondCondition: false,
      thirdCondition: false,
      readyToStake: false,
      serviceFees: {},
      stakedStep: 1,
      stakedStep1Title: {
        message:
          'We will prepare validators for you. After that you can confirm and stake your ETH'
      }
    };
  },
  computed: {
    ...mapGetters('external', ['fiatValue']),
    ...mapGetters('global', ['network']),
    ...mapState('wallet', ['web3']),
    ...mapGetters('global', ['gasPrice']),
    /**
     * @returns array
     * Staking details to display (including amount and eth2 address)
     */
    details() {
      return [
        {
          img: eth,
          subtitle: 'Staking',
          title: this.amount + ' ETH',
          desc: formatFiatValue(
            new BigNumber(this.amount).times(this.fiatValue)
          ).value
        },
        {
          img: iconColorfulETH,
          subtitle: 'Your Withdrawal Address',
          title: 'Ethereum 2.0',
          desc: this.eth2Address,
          isAddress: true
        }
      ];
    },
    /**
     * @returns array
     * Includes network, service fees, total
     */
    fees() {
      return [
        {
          title: 'Network fee',
          ethValue: this.networkFees.eth,
          usdValue: '$' + this.networkFees.usd
        },
        {
          title: 'Service fee',
          ethValue: this.serviceFees.eth,
          usdValue: this.serviceFees.usd
        },
        {
          title: 'Total',
          ethValue: this.totalFees.eth,
          usdValue: this.totalFees.usd
        }
      ];
    },
    /**
     * @returns object
     * Network fees in ETH and usd
     */
    networkFees() {
      const gasPriceETH = formatBalanceEthValue(this.gasPrice).value;
      return {
        eth: gasPriceETH,
        usd: formatFiatValue(BigNumber(this.fiatValue).times(gasPriceETH)).value
      };
    },
    /**
     * @returns object
     * Total fees in ETH and usd
     */
    totalFees() {
      const totalETH = new BigNumber(this.networkFees.eth)
        .plus(this.serviceFees.eth)
        .toFixed();
      return {
        eth: totalETH,
        usd: new BigNumber(this.fiatValue).times(totalETH).toFixed()
      };
    },
    /**
     * @returns how many validators are needed to stake x amount of eth
     */
    validatorsCount() {
      if (this.amount) {
        return new BigNumber(this.amount).dividedBy(32).toFixed();
      }
      return 0;
    }
  },
  watch: {
    /**
     * Watches the status of polling
     * if successful -> then its ready to stake
     * else will error out
     */
    pollingStatus(newVal) {
      if (newVal.success) {
        this.stakedStep += 1;
        this.readyToStake = true;
      } else {
        this.stakedStep -= 1;
        if (newVal.error.status === 406) {
          this.stakedStep1Title = {
            message:
              'Oops. We don’t know how you got this far without enough ETH. Please start over and check your funds'
          };
        } else {
          this.stakedStep1Title = {
            message:
              'Something went wrong. Please try again in a few minutes. If the problem persists,',
            showContactSupport: true
          };
        }
      }
    }
  },
  mounted() {
    this.getServiceFees();
  },
  methods: {
    /**
     * @returns object
     * Gets service fees (calls contract and abi to get exact fee)
     */
    async getServiceFees() {
      const batchContract =
        configNetworkTypes.network[this.network.type.name].batchContract;
      const contract = new this.web3.eth.Contract(ABI_GET_FEES, batchContract);
      const feesWEI = await contract.methods.getFees(this.amount / 32).call();
      const feesETH = formatBalanceEthValue(feesWEI).value;
      this.serviceFees = {
        eth: feesETH,
        usd: formatFiatValue(BigNumber(this.fiatValue).times(feesETH)).value
      };
    },
    /**
     * Emits back to go to previous step
     */
    onBack() {
      this.$emit('back');
    },
    /**
     * Start provisioning and polling (step 1: prepare to stake)
     */
    prepareToStake() {
      this.stakedStep += 1;
      this.startProvision({
        eth2Address: this.eth2Address,
        count: this.validatorsCount
      });
    },
    /**
     * Sends the transaction to confirm eth stake
     */
    onReadyToStake() {
      this.$emit('readyToStake');
    }
  }
};
</script>

<style lang="scss" scoped>
.mew-hash-container {
  width: 160px;
}
.detail-subtitle {
  font-size: 0.714rem; //font-size: 10px
}
.detail-title {
  font-weight: 600;
}
.stake-container {
  border: 1px solid var(--v-inputBorder-base);
}
</style>
