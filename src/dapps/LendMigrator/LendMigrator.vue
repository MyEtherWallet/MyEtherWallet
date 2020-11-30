<template>
  <div class="lend-migrator-container">
    <back-button />
    <b-container class="text-center">
      <div class="pt-4 lend-title">{{ $t('dappsAave.lend-title') }}</div>
      <div class="d-flex mt-4 mb-1 total-container entire-bal">
        <p>
          {{ $t('dappsAave.total-lend') }}:
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
import lendToAaveMigrator from './abi/lendToAaveMigrator';
import ERC20 from './abi/erc20';
import BigNumber from 'bignumber.js';
import { mapState } from 'vuex';
import { Toast } from '@/helpers';

const LEND_MIGRATOR_PROXY_ADDRESS =
  '0x317625234562B1526Ea2FaC4030Ea499C5291de4';
const LEND_ADDRESS = '0x80fB784B7eD66730e8b1DBd9820aFD29931aab03';
const LEND_SYMBOL = 'LEND';

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
        return item.symbol === LEND_SYMBOL;
      });
      return lendToken ? new BigNumber(lendToken.balance).toFixed() : 0;
    },
    disabled() {
      if (
        this.amount > 0 &&
        this.amount <= this.lendBalance &&
        this.hasEnoughRatio
      ) {
        return false;
      }
      return true;
    }
  },
  mounted() {
    this.getRatio();
  },
  methods: {
    async checkAllowance() {
      const lendContract = new this.web3.eth.Contract(ERC20, LEND_ADDRESS);
      const allowance = await lendContract.methods
        .allowance(this.account.address, LEND_MIGRATOR_PROXY_ADDRESS)
        .call();
      this.loading = true;
      if (
        allowance !== '0' &&
        new BigNumber(allowance).lt(new BigNumber(this.amount))
      ) {
        const lendApproveData = await lendContract.methods
          .approve(LEND_MIGRATOR_PROXY_ADDRESS, 0)
          .encodeABI();
        this.web3.eth
          .sendTransaction({
            from: this.account.address,
            to: LEND_ADDRESS,
            value: 0,
            gas: 100000,
            data: lendApproveData
          })
          .then(() => {
            this.migrate(lendContract);
          })
          .catch(error => {
            this.loading = false;
            Toast.responseHandler(error, Toast.ERROR);
          });
      } else {
        this.migrate(lendContract);
      }
    },
    async migrate(lendContract) {
      const estimatedAmount = new BigNumber(this.amount)
        .times(new BigNumber(10).pow(18))
        .toFixed();
      const amountAsHex = this.web3.utils.numberToHex(estimatedAmount);
      const lendApproveData = await lendContract.methods
        .approve(LEND_MIGRATOR_PROXY_ADDRESS, amountAsHex)
        .encodeABI();
      const lendMigrateData = await this.lendMigratorContract.methods
        .migrateFromLEND(amountAsHex)
        .encodeABI();
      this.loading = true;
      this.web3.mew
        .sendBatchTransactions([
          {
            from: this.account.address,
            to: LEND_ADDRESS,
            value: 0,
            gas: 100000,
            data: lendApproveData
          },
          {
            from: this.account.address,
            to: LEND_MIGRATOR_PROXY_ADDRESS,
            gas: 200000,
            value: 0,
            data: lendMigrateData
          }
        ])
        .then(() => {
          this.amount = 0;
          this.loading = false;
        })
        .catch(error => {
          this.loading = false;
          Toast.responseHandler(error, Toast.ERROR);
        });
    },
    async getRatio() {
      this.lendMigratorContract = new this.web3.eth.Contract(
        lendToAaveMigrator,
        LEND_MIGRATOR_PROXY_ADDRESS
      );
      const lendAaveRatio = await this.lendMigratorContract.methods
        .LEND_AAVE_RATIO()
        .call();
      this.hasEnoughRatio =
        lendAaveRatio > 1
          ? true
          : Toast.responseHandler(
              this.$t('dappAave.invalid-ratio'),
              Toast.ERROR
            );
    },
    setEntireBalance() {
      this.amount = this.lendBalance;
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'LendMigrator.scss';
</style>
