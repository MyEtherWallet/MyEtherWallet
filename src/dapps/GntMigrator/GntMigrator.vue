<template>
  <div class="lend-migrator-container">
    <back-button />
    <b-container class="text-center">
      <div class="pt-4 lend-title">{{ $t('dappsMisc.gnt-title') }}</div>
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
        :placeholder="$t('dappsMisc.total-amount')"
      />
      <button
        :class="[
          'large-round-button-green-filled',
          'mt-3',
          disabled ? 'disabled' : ''
        ]"
        @click="checkAllowance"
      >
        {{ $t('dappsMisc.migrate') }}
      </button>
    </b-container>
  </div>
</template>

<script>
import BackButton from '@/layouts/InterfaceLayout/components/BackButton';
import OLD_GNT from './abi/oldToken';
import BigNumber from 'bignumber.js';
import { mapState } from 'vuex';
import { Toast } from '@/helpers';
import utils from 'web3-utils';

const OLD_GNT_ADDRESS = '0xa74476443119A942dE498590Fe1f2454d7D4aC0d';
// const NEW_GNT_ADDRESS = '0x7DD9c5Cba05E151C895FDe1CF355C9A1D5DA6429';
// const SYMBOL = 'GNT';

export default {
  components: {
    'back-button': BackButton
  },

  data() {
    return {
      amount: 0,
      hasEnoughRatio: false,
      lendMigratorContract: '',
      loading: false,
      updatedBalance: 0,
      miningLockout: false,
      lendBalance: 0
    };
  },
  computed: {
    ...mapState('main', ['web3', 'account']),
    disabled() {
      const amount = new BigNumber(this.amount);
      const balance = new BigNumber(this.lendBalance);
      if (amount.gt(0) && amount.lte(balance)) {
        return false;
      }
      return true;
    }
  },
  mounted() {
    this.getLendBalance();
  },
  methods: {
    async checkAllowance() {
      const lendContract = new this.web3.eth.Contract(OLD_GNT, OLD_GNT_ADDRESS);
      this.migrate(lendContract);
      this.loading = true;
    },
    async getLendBalance() {
      const lendContract = new this.web3.eth.Contract(OLD_GNT, OLD_GNT_ADDRESS);
      const balance = await lendContract.methods
        .balanceOf(this.account.address)
        .call();
      this.lendBalance = new BigNumber(balance)
        .div(new BigNumber(10).pow(18))
        .toFixed();
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
      };
      this.miningLockout = true;
      this.web3.eth.estimateGas(params).then(res => {
        this.loading = false;
        this.amount = 0;
        this.web3.eth
          .sendTransaction({
            from: this.account.address,
            to: OLD_GNT_ADDRESS,
            value: 0,
            gas: res,
            data: migrateData
          })
          .then(() => {
            this.miningLockout = false;
            this.amount = 0;
            this.loading = false;
            this.getUpdatedBalance();
          })
          .catch(error => {
            this.loading = false;
            this.miningLockout = false;
            Toast.responseHandler(error, Toast.ERROR);
          });
      });
    },
    setEntireBalance() {
      this.amount = this.lendBalance;
    },
    getUpdatedBalance() {
      this.getLendBalance();
      const abi = [
        {
          constant: true,
          inputs: [
            {
              name: '_owner',
              type: 'address'
            }
          ],
          name: '.methodsbalanceOf',
          outputs: [
            {
              name: '',
              type: 'uint256'
            }
          ],
          payable: false,
          type: 'function'
        }
      ];
      const contract = new this.web3.eth.Contract(abi, OLD_GNT_ADDRESS);
      contract.methods
        .balanceOf(this.account.address)
        .call()
        .then(res => {
          this.updatedBalance = utils.fromWei(res, 'Ether');
        });
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'LendMigrator.scss';
</style>
