<template lang="html">
  <div class="initial-state-unstoppable">
    <div class="content-container">
      <div class="title-container">
        <div class="title">
          <span>
            {{ domainName }}
          </span>
        </div>
      </div>
      <div class="content">
        <div v-show="loading" class="loading-container">
          <i class="fa fa-spinner fa-lg fa-spin" />
        </div>
        <div v-show="!loading">
          <div v-for="key in Object.keys(edit)" :key="key" class="info-row">
            <span class="info-title">{{ key }}</span>
            <input
              v-model="edit[key]"
              :class="[error[key] ? 'errored' : '']"
              :placeholder="$t('unstoppable.your-address')"
              type="text"
              :name="key"
              @input="addressChange"
            />
          </div>
          <div class="dropdown-container" @click="dropdownOpen = !dropdownOpen">
            <div class="dropdown-title">
              {{ $t('unstoppable.more-currencies') }}
            </div>
            <div class="dropdown-open-button">
              <i
                v-if="!dropdownOpen"
                class="fa fa-chevron-down"
                aria-hidden="true"
              />
              <i
                v-if="dropdownOpen"
                class="fa fa-chevron-up"
                aria-hidden="true"
              />
            </div>
            <div v-if="dropdownOpen" class="dropdown-list-box">
              <ul>
                <li
                  v-for="key of additionalRecords"
                  :key="key"
                  @click="handleAddRecord(key)"
                >
                  <div>
                    <p>
                      {{ key }}
                    </p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
          <div class="save-button-container">
            <button :class="[!canSave ? 'disabled' : '']" @click="handleSave()">
              {{ $t('unstoppable.save-changes') }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <interface-bottom-text
      :link-text="$t('common.help-center')"
      :question="$t('common.have-issues')"
      link="https://kb.myetherwallet.com"
    />
  </div>
</template>

<script>
import InterfaceBottomText from '@/components/InterfaceBottomText';
import { mapState } from 'vuex';
import registryAbi from '../../ABI/registryAbi';
import resolverAbi from '../../ABI/resolverAbi';
import { hash } from 'eth-ens-namehash';
import { keyToCryptoKey, isValidRecordKeyValue } from './helpers';

export default {
  components: {
    'interface-bottom-text': InterfaceBottomText
  },
  props: {
    account: {
      type: Object,
      default: function () {}
    },
    domainName: {
      type: String,
      default: ''
    },
    web3: {
      type: Object,
      default: function () {}
    }
  },
  data() {
    return {
      domains: [],
      loading: true,
      records: {},
      edit: {},
      error: {},
      dropdownOpen: false,
      additionalRecords: [],
      canSave: false
    };
  },
  computed: {
    ...mapState('main', ['online'])
  },
  mounted() {
    this.getRecords();
  },
  methods: {
    async getResolverAddress(cryptoRegistry, node) {
      return cryptoRegistry.methods
        .resolverOf(node)
        .call()
        .catch(() => null);
    },
    async getRecords() {
      let result = [];
      try {
        const node = hash(this.domainName);
        const cryptoRegistry = new this.web3.eth.Contract(
          registryAbi,
          '0xd1e5b0ff1287aa9f9a268759062e4ab08b9dacbe'
        );
        const resolverAddress = await this.getResolverAddress(
          cryptoRegistry,
          node
        );
        if (!resolverAddress) {
          throw new Error('No resolver address set');
        }
        const resolver = new this.web3.eth.Contract(
          resolverAbi,
          resolverAddress
        );
        result = await resolver.methods
          .getMany(Object.values(keyToCryptoKey), node)
          .call();
      } catch (e) {
        result = new Array(65).fill('');
        this.loading = false;
      }
      this.additionalRecords = [];
      this.edit = {};
      this.records = {};
      for (const [index, key] of Object.keys(keyToCryptoKey).entries()) {
        if (result[index]) {
          this.records[key] = result[index];
          this.edit[key] = result[index];
        } else {
          this.additionalRecords.push(key);
        }
      }
      const defaultRecords = ['ETH', 'BTC', 'LTC', 'ZIL'];
      for (const key of defaultRecords) {
        if (!this.edit[key]) {
          this.edit[key] = '';
          this.records[key] = '';
        }
      }
      this.additionalRecords.sort();
      this.loading = false;
    },
    handleAddRecord(key) {
      this.dropdownOpen = false;
      this.edit[key] = '';
      this.records[key] = '';
      this.additionalRecords.splice(this.additionalRecords.indexOf(key), 1);
      this.additionalRecords.sort();
      this.dropdownOpen = !this.dropdownOpen;
    },
    addressChange(e) {
      const key = e.target.name;
      const value = e.target.value;
      if (value && !isValidRecordKeyValue(key, value)) {
        this.error[key] = true;
      } else {
        this.error[key] = false;
      }
      this.canSave = false;
      for (const key of Object.keys(this.edit)) {
        if (this.error[key]) {
          this.canSave = false;
          return;
        }
        if (this.edit[key] !== this.records[key]) {
          this.canSave = true;
        }
      }
    },
    async handleSave() {
      this.loading = true;
      const node = hash(this.domainName);
      const cryptoRegistry = new this.web3.eth.Contract(
        registryAbi,
        '0xd1e5b0ff1287aa9f9a268759062e4ab08b9dacbe'
      );
      const resolverAddress = await this.getResolverAddress(
        cryptoRegistry,
        node
      );
      const keys = [];
      const values = [];
      for (const key of Object.keys(this.edit)) {
        if (this.edit[key] !== this.records[key]) {
          keys.push(keyToCryptoKey[key] || key);
          values.push(this.edit[key]);
        }
      }
      const resolverContract = new this.web3.eth.Contract(
        resolverAbi,
        resolverAddress || '0xEf31d4Eb54A743a6d665D067A374cD64CBD71ee3'
      );
      if (!resolverAddress) {
        await cryptoRegistry.methods
          .resolveTo(resolverContract.options.address, node)
          .send({ from: this.account.address })
          .on('error', () => {
            this.loading = false;
            this.getRecords();
          });
      }
      await resolverContract.methods
        .setMany(keys, values, node)
        .send({ from: this.account.address })
        .on('confirmation', confirmationNumber => {
          if (confirmationNumber === 4) {
            this.loading = false;
            this.getRecords();
          }
        })
        .on('error', () => {
          this.loading = false;
          this.getRecords();
        });
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'ManageCryptoContainer.scss';
</style>
