<template>
  <div class="lend-migrator-container">
    <back-button />
    <b-container class="text-center">
      <div class="pt-4 lend-title">{{ $t('dappsAave.lend-title') }}</div>
      <div class="d-flex mt-4 mb-1 total-container entire-bal">
        <p>
          GNT:
          <span class="balance"
            ><span v-if="!loading">{{ lendBalance }} </span>
            <i v-if="loading" class="fa fa-spin fa-spinner fa-lg" />
          </span>
        </p>
        <button class="button-link" @click="setEntireBalance">
          {{ $t('sendTx.button-entire') }}
        </button>
      </div>
      <input
        v-model="amount"
        type="text"
        :placeholder="$t('dappsAave.total-amount')"
      />
      <button
        :class="[
          'large-round-button-green-filled',
          'mt-3',
          disabled ? 'disabled' : ''
        ]"
        @click="checkAllowance"
      >
        {{ $t('dappsAave.migrate') }}
      </button>
    </b-container>
  </div>
</template>

<script>
import BackButton from '@/layouts/InterfaceLayout/components/BackButton';
import lendToAaveMigrator from './abi/GntMigratorAgent';
import ERC20 from './abi/erc20';
import OLD_GNT from './abi/oldToken';
import BigNumber from 'bignumber.js';
import { mapState } from 'vuex';
import { Toast } from '@/helpers';

const GNT_AGENT_ADDRESS =
  '0xBFAd98d76598961827bA832108c21445aa4FEE9A';
const OLD_GNT_ADDRESS = '0xa74476443119A942dE498590Fe1f2454d7D4aC0d'
const NEW_GNT_ADDRESS = '0x7DD9c5Cba05E151C895FDe1CF355C9A1D5DA6429';
const SYMBOL = 'GNT';

export default {
  components: {
    'back-button': BackButton
  },
  props: {
    tokensWithBalance: {
      type: Array,
      default: function () {
        return [];
      }
    }
  },
  data() {
    return {
      amount: 0,
      hasEnoughRatio: false,
      lendMigratorContract: '',
      loading: false
    };
  },
  computed: {
    ...mapState('main', ['web3', 'account']),
    lendBalance() {
      const lendToken = this.tokensWithBalance.find(item => {
        return item.symbol === SYMBOL;
      });
      return lendToken ? new BigNumber(lendToken.balance).toFixed() : 0;
    },
    disabled() {
      if (
        this.amount > 0 &&
        this.amount <= this.lendBalance
      ) {
        return false;
      }
      return true;
    }
  },
  mounted() {
    // this.getRatio();
  },
  methods: {
    async checkAllowance() {
      const lendContract = new this.web3.eth.Contract(OLD_GNT, NEW_GNT_ADDRESS);
      this.migrate(lendContract);
      // const allowance = await lendContract.methods
      //   .allowance(this.account.address, GNT_AGENT_ADDRESS)
      //   .call();
      this.loading = true;
      // if (
      //   allowance !== '0' &&
      //   new BigNumber(allowance).lt(new BigNumber(this.amount))
      // ) {
      //   const lendApproveData = await lendContract.methods
      //     .approve(GNT_AGENT_ADDRESS, 0)
      //     .encodeABI();
      //   this.web3.eth
      //     .sendTransaction({
      //       from: this.account.address,
      //       to: LEND_ADDRESS,
      //       value: 0,
      //       gas: 100000,
      //       data: lendApproveData
      //     })
      //     .then(() => {
      //       this.migrate(lendContract);
      //     })
      //     .catch(error => {
      //       this.loading = false;
      //       Toast.responseHandler(error, Toast.ERROR);
      //     });
      // } else {
      //   this.migrate(lendContract);
      // }
    },
    async migrate(lendContract) {
      const estimatedAmount = new BigNumber(this.amount)
        .times(new BigNumber(10).pow(18))
        .toFixed();
      const amountAsHex = this.web3.utils.numberToHex(estimatedAmount);
      const migrateData = await lendContract.methods
        .migrate(amountAsHex)
        .encodeABI();
      const params = {
        from: this.account.address,
        to: OLD_GNT_ADDRESS,
        value: 0,
        data: migrateData
      }
      this.web3.eth.estimateGas(params)
      .then(res => {
        this.loading = true;
        this.web3.eth
          .sendTransaction({
            from: this.account.address,
            to: OLD_GNT_ADDRESS,
            value: 0,
            gas: res,
            data: migrateData
          })
          .then(() => {
            this.amount = 0;
            this.loading = false;
          })
          .catch(error => {
            this.loading = false;
            Toast.responseHandler(error, Toast.ERROR);
          });
      })
      // const lendMigrateData = await this.lendMigratorContract.methods
      //   .migrateFromLEND(amountAsHex)
      //   .encodeABI();

    },
    // async getRatio() {
    //   this.lendMigratorContract = new this.web3.eth.Contract(
    //     lendToAaveMigrator,
    //     GNT_AGENT_ADDRESS
    //   );
    //   const lendAaveRatio = await this.lendMigratorContract.methods
    //     .LEND_AAVE_RATIO()
    //     .call();
    //   this.hasEnoughRatio =
    //     lendAaveRatio > 1
    //       ? true
    //       : Toast.responseHandler(
    //           this.$t('dappAave.invalid-ratio'),
    //           Toast.ERROR
    //         );
    // },
    setEntireBalance() {
      this.amount = this.lendBalance;
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'LendMigrator.scss';
</style>
