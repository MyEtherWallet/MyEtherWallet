<template>
  <div class="lend-migrator-container">
    <back-button />
    <b-container class="text-center">
      <div class="pt-4 lend-title">{{ $t('dappsAave.lend-title') }}</div>
      <div class="d-flex mt-4 mb-1 total-container entire-bal">
        <p>
          {{ $t('dappsAave.total-lend') }}:
          <span class="balance"
            ><span v-if="!loading">{{ balance }} </span>
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
      amountAsHex: '',
      loading: false,
      lendContract: '',
      balance: ''
    };
  },
  computed: {
    ...mapState('main', ['web3', 'account']),
    disabled() {
      if (
        this.amount > 0 &&
        this.amount <= this.balance &&
        this.hasEnoughRatio
      ) {
        return false;
      }
      return true;
    }
  },
  mounted() {
    this.getLendBalance();
    this.getRatio();
  },
  methods: {
    async getLendBalance() {
      this.lendContract = new this.web3.eth.Contract(ERC20, LEND_ADDRESS);
      const balance = await this.lendContract.methods
        .balanceOf(this.account.address)
        .call();
      this.balance = this.web3.utils.fromWei(balance, 'ether');
    },
    async checkAllowance() {
      const estimatedAmount = new BigNumber(this.amount)
        .times(new BigNumber(10).pow(18))
        .toFixed();
      this.amountAsHex = this.web3.utils.numberToHex(estimatedAmount);
      const allowance = await this.lendContract.methods
        .allowance(this.account.address, LEND_MIGRATOR_PROXY_ADDRESS)
        .call();
      this.loading = true;
      if (
        allowance !== '0' &&
        new BigNumber(allowance).lt(new BigNumber(this.amountAsHex))
      ) {
        const lendApproveData = await this.lendContract.methods
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
            this.migrate();
          })
          .catch(error => {
            this.loading = false;
            Toast.responseHandler(error, Toast.ERROR);
          });
      } else {
        this.migrate();
      }
    },
    async migrate() {
      const lendApproveData = await this.lendContract.methods
        .approve(LEND_MIGRATOR_PROXY_ADDRESS, this.amountAsHex)
        .encodeABI();
      const lendMigrateData = await this.lendMigratorContract.methods
        .migrateFromLEND(this.amountAsHex)
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
            gas: 500000,
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
      lendAaveRatio > 1
        ? (this.hasEnoughRatio = true)
        : Toast.responseHandler(this.$t('dappAave.invalid-ratio'), Toast.ERROR);
    },
    setEntireBalance() {
      this.amount = this.balance;
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'LendMigrator.scss';
</style>
