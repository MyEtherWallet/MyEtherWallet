<template>
  <div class="lend-migrator-container">
    <back-button />
    <b-container class="text-center">
      <div class="pt-4 lend-title">{{ $t('dappsAave.lend-title') }}</div>
      <div class="d-flex mt-4 mb-1 total-container entire-bal">
        <p>
          {{ $t('dappsAave.total-lend') }}:
          <span class="balance">{{ lendBalance }}</span>
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
        @click="startMigration"
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
import utils from 'web3-utils';

const LEND_MIGRATOR_PROXY_ADDRESS =
  '0x317625234562B1526Ea2FaC4030Ea499C5291de4';
const LEND_MIGRATOR_ABI_ADDRESS = '0x86241b6c526998582556F7C0342D8863b604B17b';
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
      amount: 0
    };
  },
  computed: {
    ...mapState('main', ['web3', 'account']),
    lendBalance() {
      const lendToken = this.tokensWithBalance.find(item => {
        return item.symbol === 'LEND';
      });
      return lendToken ? new BigNumber(lendToken.balance).toFixed() : 0;
    },
    disabled() {
      if (this.amount > 0 && this.amount <= this.lendBalance) {
        return false;
      }
      return true;
    }
  },
  methods: {
    async startMigration() {
      const contract = new this.web3.eth.Contract(ERC20, LEND_ADDRESS);
      const data = contract.methods
        .approve(
          LEND_MIGRATOR_PROXY_ADDRESS,
          utils.toWei(this.amount, 'ether').toString()
        )
        .encodeABI();

      this.web3.eth
        .sendTransaction({
          from: this.account.address,
          to: LEND_ADDRESS,
          value: 0,
          data: data
        })
        .then(() => {
          this.getRatio();
        })
        .catch(error => {
          Toast.responseHandler(error, Toast.ERROR);
        });
    },
    async getRatio() {
      const contract = new this.web3.eth.Contract(
        lendToAaveMigrator,
        LEND_MIGRATOR_ABI_ADDRESS
      );
      const lendAaveRatio = await contract.methods.LEND_AAVE_RATIO().call();
      lendAaveRatio > 1
        ? this.migrate(contract)
        : Toast.responseHandler(this.$t('dappAave.invalid-ratio'), Toast.ERROR);
    },
    setEntireBalance() {
      this.amount = this.lendBalance;
    },
    async migrate(contract) {
      await contract.methods
        .migrateFromLEND(parseInt(this.amount))
        .send({ from: this.account.address })
        .on('error', error => {
          Toast.responseHandler(error, Toast.ERROR);
        });
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'LendMigrator.scss';
</style>
