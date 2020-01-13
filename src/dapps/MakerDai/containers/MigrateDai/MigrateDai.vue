<template>
  <div style="max-width: 500px;">
    <div class="d-flex align-items-center mb-3">
      <h3 class="mr-2 ">{{ $t('dappsMCDMaker.upgrade-sai-to-dai') }}</h3>
      <img :src="DaiIcon" class="icon-size" />
    </div>
    <div style="max-width: 500px;" class="mb-5">
      {{ $t('dappsMCDMaker.upgrade-informational') }}
    </div>
    <div class="top-buttons">
      <p @click="setMax">{{ $t('dappsMCDMaker.entire-sai-balance') }}</p>
    </div>
    <div class="dropdown-text-container dropdown-container no-point">
      <p>
        <span class="cc DAI cc-icon cc-icon-dai currency-symbol" />
        {{ $t('dappsMCDMaker.sai') }}
      </p>
    </div>
    <input
      v-model="daiQty"
      :class="[
        'currency-picker-container',
        'dropdown-text-container',
        'dropdown-container'
      ]"
    />
    <div class="buttons-container">
      <div
        :class="[
          validInputs ? '' : 'disabled',
          'submit-button large-round-button-green-filled'
        ]"
        @click="submitTransaction"
      >
        {{ $t('dappsMCDMaker.upgrade') }}
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import DaiIcon from '@/assets/images/currency/coins/AllImages/DAI.svg';
import BigNumber from 'bignumber.js';
import { addresses, migrateABI, ERC20 } from '../../makerHelpers';
import ethUnit from 'ethjs-unit';
import { Toast } from '@/helpers';

const toBigNumber = num => {
  return new BigNumber(num);
};

export default {
  props: {
    tokensWithBalance: {
      type: Array,
      default: function() {
        return [];
      }
    },
    ethPrice: {
      type: BigNumber,
      default: function() {
        return new BigNumber(0);
      }
    },
    makerActive: {
      type: Boolean,
      default: false
    },
    cdps: {
      type: Array,
      default: function() {
        return [];
      }
    },
    availableCdps: {
      type: Object,
      default: function() {
        return {};
      }
    },
    cdpDetailsLoaded: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      daiQty: 0,
      gasLimit: -1,
      DaiIcon: DaiIcon
    };
  },
  computed: {
    ...mapState('main', ['account', 'gasPrice', 'web3', 'network', 'ens']),
    validInputs() {
      return toBigNumber(this.daiQty).gt(0);
    }
  },
  async mounted() {},
  methods: {
    // MIGRATION CONTRACT
    // https://github.com/makerdao/scd-mcd-migration/blob/master/src/ScdMcdMigration.sol#L59
    async migrate(val) {
      const contract = new this.web3.eth.Contract(
        migrateABI,
        addresses.MIGRATION
      );

      const data = contract.methods.swapSaiToDai(val).encodeABI();
      return {
        from: this.account.address,
        to: addresses.MIGRATION,
        value: 0,
        gas: 500000,
        data: data
      };
    },
    setMax() {
      const saiEntry = this.tokensWithBalance.find(entry => {
        return entry.symbol === 'SAI';
      });
      if (!saiEntry) {
        this.daiQty = 0;
      } else {
        this.daiQty = saiEntry.balance;
      }
    },
    async approve(val) {
      const contract = new this.web3.eth.Contract(ERC20, addresses.SAI);

      const data = contract.methods
        .approve(addresses.MIGRATION, val)
        .encodeABI();

      return {
        from: this.account.address,
        to: addresses.SAI,
        value: 0,
        data: data
      };
    },
    async submitTransaction() {
      window.scrollTo(0, 0);
      try {
        const val = ethUnit.toWei(this.daiQty, 'ether').toString();
        const txs = await Promise.all([this.approve(val), this.migrate(val)]);

        this.web3.mew.sendBatchTransactions(txs).catch(err => {
          Toast.responseHandler(err, Toast.ERROR);
        });
      } catch (e) {
        Toast.responseHandler(e, Toast.ERROR);
      }
    },
    displayPercentValue(raw) {
      if (!BigNumber.isBigNumber(raw)) raw = new BigNumber(raw);
      return raw.times(100).toString();
    },
    displayFixedValue(raw, decimals = 3) {
      if (!BigNumber.isBigNumber(raw)) raw = new BigNumber(raw);
      return raw.toFixed(decimals).toString();
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'MigrateDai';
</style>
