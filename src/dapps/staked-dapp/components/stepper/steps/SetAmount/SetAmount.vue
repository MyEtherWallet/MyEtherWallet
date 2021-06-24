<template>
  <div class="mx-auto pb-15" style="max-width: 550px">
    <!--
    ===================================================
    Select Amount 
    ===================================================
    -->
    <div class="mew-heading-2 py-12 text-center">
      Select ETH amount to stake
    </div>

    <mew-select
      v-model="amount"
      label="Staking amount"
      :items="selectItems"
      is-swap
      outlined
    />

    <!--
    ===================================================
    Staking APR and fee
    ===================================================
    -->
    <div class="mb-15">
      <v-row>
        <v-col
          cols="12"
          md="6"
          class="py-1 text-uppercase captionPrimary--text font-weight-bold"
        >
          Current APR
        </v-col>
        <v-col cols="12" md="6" class="py-1 text-right primary--text">
          9.38%
        </v-col>
      </v-row>
      <v-row>
        <v-col
          cols="12"
          md="6"
          class="
            py-1
            text-uppercase
            captionPrimary--text
            font-weight-bold
            d-flex
            align-center
          "
        >
          Staking Fee
          <mew-tooltip class="ml-1" :text="toolTipFee" />
        </v-col>
        <v-col cols="12" md="6" class="py-1 text-right">
          0.72% <span class="textSecondary--text">0.3 ETH min</span>
        </v-col>
      </v-row>
    </div>

    <!--
    ===================================================
    Deposit value growth forecast
    ===================================================
    -->
    <div>
      <div class="mew-heading-3 mb-8">Deposit value growth forecast</div>

      <div class="mb-6">
        <v-row>
          <v-col cols="12" md="6" class="py-1">In 3 months</v-col>
          <v-col cols="12" md="6" class="py-1 text-right textSecondary--text">
            $15,840.00
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" md="6" class="py-1 primary--text">2.1952 ETH</v-col>
          <v-col cols="12" md="6" class="py-1 text-right">34.1952 ETH</v-col>
        </v-row>
      </div>

      <div class="mb-6">
        <v-row>
          <v-col cols="12" md="6" class="py-1">In 3 months</v-col>
          <v-col cols="12" md="6" class="py-1 text-right textSecondary--text">
            $15,840.00
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" md="6" class="py-1 primary--text">2.1952 ETH</v-col>
          <v-col cols="12" md="6" class="py-1 text-right">34.1952 ETH</v-col>
        </v-row>
      </div>

      <div class="mb-6">
        <v-row>
          <v-col cols="12" md="6" class="py-1">In 3 months</v-col>
          <v-col cols="12" md="6" class="py-1 text-right textSecondary--text">
            $15,840.00
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" md="6" class="py-1 primary--text">2.1952 ETH</v-col>
          <v-col cols="12" md="6" class="py-1 text-right">34.1952 ETH</v-col>
        </v-row>
      </div>
    </div>

    <!--
    ===================================================
    User information
    ===================================================
    -->
    <div class="overlayBg px-12 py-8 mt-15 border-radius--10px">
      <ul class="user-info">
        <li>Your ETH is staked with our partner Staked.us</li>
        <li>Staked.us will create and maintain Eth2 validators for you</li>
        <li>Earn up to 21% Annualized rewards</li>
        <li class="warning--text text--darken-2">
          You can neither spend nor transfer your Eth2 funds until an unknown
          data in the future when transfers are enabled on the Eth2 chain
        </li>
      </ul>
    </div>

    <mew-button
      class="mx-auto d-block mt-10"
      :loading="false"
      :disabled="getErrorMessage !== null"
      :has-full-width="false"
      btn-size="xlarge"
      title="Next: Eth2 address"
      @click.native="doNext"
    />
  </div>
</template>

<script>
import { toBN, toWei } from 'web3-utils';
import BigNumber from 'bignumber.js';
import { mapState, mapGetters } from 'vuex';
import { Toast, ERROR } from '@/modules/toast/handler/handlerToast';
import eth from '@/assets/images/currencies/eth.png';
import { formatFiatValue } from '@/core/helpers/numberFormatHelper';

const types = [
  { name: '32', value: 32 },
  { name: '64', value: 64 },
  { name: '96', value: 96 },
  { name: '128', value: 128 }
];

export default {
  props: {
    next: {
      type: Function,
      default: function () {}
    }
  },
  data() {
    return {
      toolTipFee:
        '0.75% staking fee (or 0.3 ETH, whichever is higher) is covering staking until transfers are enabled on Eth2. Once transfers are enabled, you will have a choice to either continue staking your ETH for an additional fee, or withdraw your ETH and earned rewards and stop staking.',
      amount: {},
      ethPrice: '',
      balance: 0,
      eth: eth
    };
  },
  computed: {
    ...mapState('wallet', ['web3']),
    ...mapGetters('wallet', ['balanceInETH']),
    ...mapGetters('external', ['networkTokenUSDMarket']),
    /**
     * @returns array
     * Mew select dropdown items
     */
    selectItems() {
      const items = [];
      for (let i = 1; i <= 4000; i++) {
        if (i % 32 === 0) {
          items.push({
            name: i + ' ETH',
            value: i,
            img: this.eth,
            price: formatFiatValue(
              new BigNumber(i).times(this.networkTokenUSDMarket.value)
            ).value
          });
        }
      }
      return items;
    },
    hasError() {
      return this.notValidMultiple || this.notEnoughBalance;
    },
    notValidMultiple() {
      return this.amount && (this.amount <= 0 || this.amount % 32 !== 0);
    },
    notEnoughBalance() {
      return (
        this.amount &&
        toBN(toWei(this.amount.toString(), 'ether')).gt(
          toBN(toWei(this.balance.toString(), 'ether'))
        )
      );
    },
    usdPrice() {
      if (this.ethPrice) {
        return new BigNumber(this.ethPrice).times(this.amount);
      }
      return 0;
    },
    amountAsString() {
      return this.amount.toString();
    },
    rules() {
      return [
        this.notValidMultiple || this.$t('dappsStaked.error-set-amount'),
        (this.hasError && this.notEnoughBalance) ||
          this.$t('dappsStaked.error-not-enough-bal')
      ];
    },
    getErrorMessage() {
      if (this.notValidMultiple) {
        return this.$t('dappsStaked.error-set-amount');
      } else if (this.hasError && this.notEnoughBalance) {
        return this.$t('dappsStaked.error-not-enough-bal');
      }
      return null;
    }
  },
  watch: {
    balanceInETH: {
      deep: true,
      immediate: true,
      handler: function (val) {
        this.balance = val;
      }
    }
  },
  mounted() {
    this.balance = this.balanceInETH;
    console.log(toWei(this.balance.toString(), 'ether')); // todo remove dev item
    this.getEthPrice();
    this.$watch(
      () => {
        // returns the value to callback when this changes
        return (
          !this.hasError &&
          toBN(toWei(this.balance.toString(), 'ether')).gt(
            toWei('32', 'ether')
          ) &&
          this.amount !== 0
        );
      },
      val => {
        if (val) {
          this.setAmount(this.amount);
        }
      },
      { immediate: true }
    );
  },
  methods: {
    doNext() {
      console.log('do next'); // todo remove dev item
      this.next();
    },
    async getEthPrice() {
      const price = await fetch(
        'https://cryptorates.mewapi.io/ticker?filter=ETH'
      )
        .then(res => {
          return res.json();
        })
        .catch(e => {
          Toast(e, ERROR);
        });

      this.ethPrice = price && price.data ? price.data.ETH.quotes.USD.price : 0;
    },
    isActive(idx) {
      if (this.amount === types[idx]) {
        return true;
      }
      return false;
    },
    setAmount(idx) {
      if (Number.isInteger(idx) && idx < 4) {
        this.amount = types[idx];
        console.log('amount', this.amount); // todo remove dev item
      }
      this.$emit(
        'completed',
        !this.hasError,
        {
          key: 'amount',
          value: this.amount
        },
        this.ethPrice
      );
    }
  }
};
</script>

<style lang="scss" scoped>
.user-info {
  list-style-type: '◆';
  li {
    padding-left: 15px;
    margin-bottom: 20px;

    &:last-child {
      margin-bottom: 0;
    }
  }
}
</style>
