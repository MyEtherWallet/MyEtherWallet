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
        label="I understand that Staking is currently a one-way-street and won't be able to get my fund back until an unknown date in the future when transfers are enabled in Eth2."
      ></mew-checkbox>
      <mew-checkbox
        label="I understand that staking involves slashing risks and my funds can be lost."
      ></mew-checkbox>
      <mew-checkbox
        label="I have read and agreed to Staked.us terms of service. This Staking feature is provided by Staked.us, and MEW is not liable for it's services."
      ></mew-checkbox>
    </div>
    <div class="stake-container mt-10 text-center rounded-lg py-6 px-12">
      <!--
    ===================================================
    Prepare to stake (Step 1)
    ===================================================
    -->
      <div>
        <div class="textBlack2--text">
          We will prepare validators for you. After that you can confirm and
          stake your ETH.
        </div>
        <mew-button
          btn-size="xlarge"
          class="mt-3"
          title="Prepare for staking"
        ></mew-button>
      </div>
      <!--
    ===================================================
    Preparing validators (Step 2)
    ===================================================
    -->
      <div v-if="false">
        <div>Preparing validators</div>
        <div>
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
      <div v-if="false">
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
      />
      <mew-button
        btn-size="xlarge"
        class="d-block ma-2"
        title="Stake 32 ETH"
        @click.native="isOpenVerify = true"
      >
      </mew-button>
    </div>
  </div>
</template>

<script>
import BigNumber from 'bignumber.js';
// import configNetworkTypes from '@/dapps/staked-dapp/handlers/configNetworkTypes';
import { mapState, mapGetters } from 'vuex';
import eth from '@/assets/images/currencies/eth.png';
import iconColorfulETH from '@/assets/images/icons/icon-colorful-eth.svg';
import { formatFiatValue } from '@/core/helpers/numberFormatHelper';

export default {
  props: {
    amount: {
      type: Number,
      default: 0
    },
    address: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      isOpenVerify: false,
      oneTimeFee: '',
      agreed: false,
      agreedBeaconChain: false,
      agreedFundsLost: false
    };
  },
  computed: {
    ...mapGetters('external', ['networkTokenUSDMarket']),
    ...mapGetters('global', ['network']),
    ...mapState('wallet', ['web3']),
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
            new BigNumber(this.amount).times(this.networkTokenUSDMarket.value)
          ).value
        },
        {
          img: iconColorfulETH,
          subtitle: 'Your Withdrawal Address',
          title: 'Ethereum 2.0',
          desc: this.address,
          isAddress: true
        }
      ];
    },
    /**
     * @returns array
     * Includes network and service fees + total
     */
    fees() {
      return [
        { title: 'Network fee', ethValue: '0.013234', usdValue: '$93.12' },
        { title: 'Service fee', ethValue: '0.013234', usdValue: '$93.12' },
        { title: 'Total', ethValue: '0.013234', usdValue: '$93.12' }
      ];
    },
    // getTotal() {
    //   return new BigNumber(this.oneTimeFee)
    //     .plus(this.details.amount)
    //     .toFixed(4);
    // },
    // validatorPl() {
    //   const isPlural = this.details.amount / 32 > 1 ? 2 : 1;
    //   return this.$tc('dappsStaked.validator', isPlural);
    // },
    emitWhenAllIsValid() {
      if (this.agreed && this.agreedBeaconChain && this.agreedBeaconChain) {
        this.$emit('completed', true, {
          key: 'review',
          value: true
        });
        return false;
      }
      return true;
    }
  },
  mounted() {
    console.error('asdfasdf', this.detailsText);
    /*
    this.getFees();
    // "multiwatch" watcher
    this.$watch(
      () => {
        // returns the value to callback when this changes
        return this.agreed && this.agreedBeaconChain && this.agreedFundsLost;
      },
      function (val) {
        if (val) {
          this.$emit('completed', true, {
            key: 'review',
            value: true
          });
        } else {
          this.$emit('completed', false, {
            key: 'review',
            value: false
          });
        }
      },
      {
        immediate: true
      }
    );
    */
  },
  methods: {
    // async getFees() {
    //   const batchContract =
    //     configNetworkTypes.network[this.network.type.name].batchContract;
    //   const abi = [
    //     {
    //       inputs: [
    //         {
    //           internalType: 'uint256',
    //           name: 'numValidators',
    //           type: 'uint256'
    //         }
    //       ],
    //       name: 'getFees',
    //       outputs: [
    //         {
    //           internalType: 'uint256',
    //           name: '',
    //           type: 'uint256'
    //         }
    //       ],
    //       stateMutability: 'view',
    //       type: 'function'
    //     }
    //   ];
    //   const contract = new this.web3.eth.Contract(abi, batchContract);
    //   const fees = await contract.methods
    //     .getFees(this.details.amount / 32)
    //     .call();
    //   this.oneTimeFee = this.web3.utils.fromWei(
    //     new BigNumber(fees).toString(),
    //     'ether'
    //   );
    // },
    // usdPrice(amount) {
    //   if (this.details.ethPrice) {
    //     return new BigNumber(this.details.ethPrice).times(amount);
    //   }
    //   return 0;
    // },
    agree() {
      this.agreed = !this.agreed;
    },
    agreeBeaconChain() {
      this.agreedBeaconChain = !this.agreedBeaconChain;
    },
    agreeFundsLost() {
      this.agreedFundsLost = !this.agreedFundsLost;
    },
    doNext() {
      console.log('do next'); // todo remove dev item
      this.next();
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
