<template>
  <mew-overlay
    :show-overlay="open"
    right-btn-text="Close"
    content-size="medium"
    :close="closing"
  >
    <div class="manage-overlay--component">
      <h2 class="text-center">
        {{ $t('unstoppable.resolve-domain') }}
      </h2>
      <div class="mt-5 textMedium--text">
        When sending a token to
        <span class="font-weight-bold">{{ managedDomain.name }}</span> it will
        be deposited to the wallet entered below.
      </div>
      <div
        v-if="loading"
        class="pa-8 d-flex flex-column align-center justify-center"
        style="min-height: 466px"
      >
        <v-progress-circular indeterminate />
        <span class="mew-heading-2 mt-8">
          {{ $t('unstoppable.updating-your-records') }}
        </span>
        <span class="mew-body d-flex text-center mt-4" style="width: 317px">
          {{ $t('unstoppable.processing-registration-advice') }}
        </span>
      </div>
      <div v-if="!loading" class="pa-7">
        <div
          v-for="(value, record) in records"
          :key="record"
          class="d-flex align-center justify-space-between mb-8"
        >
          <div class="bluePrimary--text font-weight-medium">
            {{ record }}
          </div>
          <div style="min-width: 300px" class="d-flex align-center">
            <mew-input
              v-model="records[record]"
              style="max-height: 50px"
              :has-clear-btn="true"
              label="Enter your wallet address"
              :rules="[
                v =>
                  validateRecord(record, value) ||
                  $t('unstoppable.wrong-address-format')
              ]"
            />
          </div>
        </div>
      </div>
      <div>
        <mew-menu activator-text-color="primary--text" :list-obj="menuObj" />
      </div>
    </div>
    <div class="mt-3">
      <mew-button
        :title="$t('unstoppable.save-and-close')"
        btn-size="xlarge"
        :disabled="disabled"
        @click.native="saveRecords"
      />
    </div>
  </mew-overlay>
</template>

<script>
import { mapState, mapGetters, mapMutations } from 'vuex';
import {
  isValidRecordKeyValue,
  keyToCryptoKey,
  cryptoKeyToKey
} from '../handlers/records';
import resolverAbi from '../handlers/resolverAbi';

export default {
  props: {
    open: { default: false, type: Boolean },
    close: {
      default: function () {
        return {};
      },
      type: Function
    }
  },
  data() {
    return {
      records: {
        ETH: '',
        BTC: '',
        LTC: '',
        ZIL: ''
      },
      errors: {
        ETH: null
      },
      disabled: false,
      loading: false,
      // rotation: 180,
      // dropdownOpen: false,
      additionalRecords: [],
      menuObj: {
        name: 'More currencies',
        items: [
          {
            title: '1st Links',
            items: [
              {
                title: 'Link 1'
              },
              {
                title: 'Link 2'
              }
            ]
          }
        ]
      }
    };
  },
  computed: {
    ...mapState('wallet', ['balance', 'address', 'web3']),
    ...mapGetters('unstoppable', [
      'managedDomain',
      'resolution',
      'activeOverlay'
    ])
  },
  watch: {
    managedDomain: async function (newVal, oldVal) {
      if (
        this.activeOverlay === 'ManageRecordsOverlay' &&
        newVal &&
        newVal.name !== oldVal.name
      ) {
        await this.fetchRecords();
      }
    },
    errors: function (newVal) {
      if (this.activeOverlay === 'ManageRecordsOverlay') {
        this.disabled = this.hasError(newVal);
      }
    }
  },
  methods: {
    ...mapMutations('unstoppable', ['SET_ACTIVE_OVERLAY']),
    closing() {
      this.records = {
        ETH: '',
        BTC: '',
        LTC: '',
        ZIL: ''
      };
      this.errors = {};
      this.additionalRecords = this.getAdditionalRecords();
      this.SET_ACTIVE_OVERLAY({ value: '' });
      this.close();
    },
    async fetchRecords() {
      const cryptoKeys = Object.keys(this.records)
        .map(key => keyToCryptoKey[key])
        .filter(k => !!k);

      const cryptoValues = await this.resolution.getRecords(
        this.managedDomain.name,
        cryptoKeys
      );

      for (const [key, value] of Object.entries(cryptoValues)) {
        if (value) {
          this.records[cryptoKeyToKey[key]] = value;
        }
      }
      this.additionalRecords = this.getAdditionalRecords();
    },
    getAdditionalRecords() {
      const records = Object.keys(keyToCryptoKey)
        .map(record => {
          if (Object.keys(this.records).includes(record)) return undefined;
          return record;
        })
        .filter(r => r);
      return records;
    },
    // async handleAddRecord(key) {
    //   const record = await this.resolution
    //     .getRecord(this.managedDomain.name, keyToCryptoKey[key])
    //     .catch(() => '');
    //   this.records = { ...this.records, [key]: record };
    //   this.additionalRecords = this.getAdditionalRecords();
    // },
    validateRecord(key, value) {
      if (!value) {
        this.errors = { ...this.errors, [key]: undefined };
        return true;
      }
      if (isValidRecordKeyValue(key, value)) {
        this.errors = { ...this.errors, [key]: undefined };
        return true;
      }
      this.errors = { ...this.errors, [key]: true };
      return false;
    },
    hasError(errorObj) {
      return Object.values(errorObj).includes(true);
    },
    async saveRecords() {
      this.loading = true;
      const resolverAddr =
        this.managedDomain.resolver ||
        (await this.resolution.getResolver(this.managedDomain.name));

      const keys = [];
      const values = [];

      for (const [rk, rv] of Object.entries(this.records)) {
        if (rv) {
          keys.push(rk);
          values.push(rv);
        }
      }

      const resolverContract = new this.web3.eth.Contract(
        resolverAbi,
        resolverAddr
      );

      await resolverContract.methods
        .setMany(keys, values, this.managedDomain.namehash)
        .send({ from: this.address })
        .on('confirmation', confirmationNumber => {
          if (confirmationNumber === 4) {
            this.loading = false;
            this.fetchRecords();
          }
        })
        .on('error', () => {
          this.loading = false;
          this.fetchRecords();
        });
    }
    // rotate() {
    //   this.rotation = this.rotation === 0 ? 180 : 0;
    //   this.dropdownOpen = !this.dropdownOpen;
    // }
  }
};
</script>

<style lang="scss">
.manage-overlay--component {
  width: 100%;
}

.dropdown-list-box {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12);
  width: 22%;
  position: absolute;
  user-select: none;
  background-color: #fff;
  border: 1px solid #05c0a5;
  border-radius: 0 0 4px 4px;
  z-index: 10;
  overflow-y: auto;
  overflow-x: hidden;
  max-height: 230px;
  ul {
    li {
      cursor: pointer;
      padding: 10px 15px;
      position: relative;
      display: grid;
      grid-template-columns: 40px 1fr 70px 25px;
      align-items: center;

      &:nth-child(odd) {
        background-color: #fff;
      }

      &:hover {
        background-color: #f9f9f9;
      }
    }
  }
}
</style>
