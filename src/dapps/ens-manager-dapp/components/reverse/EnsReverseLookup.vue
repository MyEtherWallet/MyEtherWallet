<template>
  <div>
    <v-sheet
      class="addressBlock d-flex justify-space-between align-center mb-7"
      color="transparent"
    >
      <mew-blockie :address="address" />
      <span class="font-weight-heavy pr-15">{{ address }}</span>
    </v-sheet>
    <div v-if="!hasDomains">
      <mew-alert
        hide-close-icon
        class="font-weight-light d-flex justify-space-between align-center mb-7 mt-7"
      >
        No ENS names have their ETH Address records set to this address. Only
        ENS names that point to your Ethereum account can be set as your Primary
        ENS Name.
      </mew-alert>
    </div>

    <div v-else class="d-flex flex-column justify-space-between">
      <div class="mew-heading-2 mb-2">Your Domains:</div>
      <div class="d-flex justify-space-between">
        <mew-select
          normal-dropdown
          :value="selectedDomain"
          filter-placeholder="Search for Domain"
          :items="domainListItems"
          :error-messages="selectedDomain.error"
          class="domain-dropdown"
          @input="setDomain"
        >
        </mew-select>
        <mew-button
          title="Register"
          class="set-button"
          btn-size="xlarge"
          :loading="selectedDomain.loading"
          :disabled="disableRegister"
          @click.native="setReverseRecord(selectedDomain)"
        />
      </div>
    </div>
    <div v-if="hasReverseRecordNames">
      <div class="mew-heading-2 mb-2">Reverse Names:</div>
      <div class="d-flex justify-space-between">
        {{ reverseRecordNames }}
      </div>
    </div>
  </div>
</template>

<script>
import { isEmpty } from 'lodash';
import ENS from '@ensdomains/ensjs';
import { mapGetters, mapState } from 'vuex';

import PermanentNameModule from '../../handlers/handlerPermanentName';
import NameResolver from '@/modules/name-resolver/index';
import errorHandler from '@/modules/confirmation/handlers/errorHandler.js';
import metainfo from '../../metainfo.js';

import { Toast, ERROR } from '@/modules/toast/handler/handlerToast';
import { toBNSafe } from '@/core/helpers/numberFormatHelper';
export default {
  name: 'EnsReverseLookup',
  props: {
    address: {
      default: '',
      type: String
    },
    name: {
      default: '',
      type: String
    },
    durationPick: {
      default: '',
      type: String
    },
    ensManager: {
      default: () => {},
      type: Object
    }
  },
  data() {
    return {
      ensLookupResults: null,
      hasDomains: false,
      selectedDomain: { loading: false, fee: toBNSafe(0), error: '' },
      selectedDomainAddr: '',
      permHandler: {},
      hasReverseRecordNames: false,
      reverseRecordNames: '',
      domainListItems: [],
      nameResolver: null
    };
  },
  computed: {
    ...mapGetters('global', [
      'network',
      'gasPrice',
      'gasPriceByType',
      'getFiatValue'
    ]),
    ...mapGetters('external', ['fiatValue']),
    ...mapState('global', ['gasPriceType']),
    ...mapState('wallet', ['balance', 'web3', 'instance']),
    disableRegister() {
      if (
        !this.selectedDomain.hasOwnProperty('address') ||
        !this.selectedDomain.hasOwnProperty('name')
      )
        return true;
      return (
        (!this.selectedDomain.value &&
          toBNSafe(this.balance).lt(this.selectedDomain.fee)) ||
        this.selectedDomain.error.length > 0
      );
    }
  },
  watch: {
    network() {
      if (this.checkNetwork()) this.setup();
    },
    address(addr) {
      if (this.checkNetwork() && addr) this.setup();
    },
    web3() {
      if (this.checkNetwork()) this.setup();
    }
  },
  async mounted() {
    if (this.checkNetwork()) await this.setup();
  },
  methods: {
    async setDomainListItems() {
      const array = [];
      const { name } = await this.nameResolver.resolveAddress(this.address);
      this.ensLookupResults?.forEach(async i => {
        i.loading = true;
        i.fee = toBNSafe(0);
        i.error = '';
        /**
         * check if address already has a reverse name
         */
        if (!name) {
          try {
            const gas = await this.permHandler.getNameReverseData(i.name);
            i.fee = toBNSafe(gas * this.gasPrice);
            if (toBNSafe(this.balance).lt(i.fee)) {
              i.error = `Insufficient amount of ${this.network.type.currencyName}`;
            }
          } catch {
            i.error =
              'An error occurred while retrieving the domain information';
            i.loading = false;
            return array.push(i);
          }
        }
        i.loading = false;
        return array.push(i);
      }) || [];
      this.domainListItems = array;
    },
    checkNetwork() {
      return metainfo.networks.find(
        item => item.chainID === this.network.type.chainID
      );
    },
    async setup() {
      await this.findDomainByAddress();
      const ens = this.network.type.ens
        ? new ENS({
            provider: this.web3.eth.currentProvider,
            ensAddress: this.network.type.ens.registry
          })
        : null;
      this.permHandler = new PermanentNameModule(
        this.name,
        this.address,
        this.network,
        this.web3,
        ens,
        this.durationPick
      );
      this.nameResolver = new NameResolver(this.network, this.web3);
      this.selectedDomain = { loading: false, fee: toBNSafe(0), error: '' };
      await this.setDomainListItems();
      this.getReverseRecordNames();
    },
    async fetchDomains() {
      return await this.ensManager.getAllNamesForAddress(this.address);
    },
    async findDomainByAddress() {
      try {
        this.hasDomains = true;
        const domains = await this.fetchDomains();
        if (isEmpty(domains)) this.hasDomains = false;
        this.ensLookupResults = domains.map(item => {
          return {
            name: item.name,
            value: item.nameHash,
            address: item.address
          };
        });
      } catch (e) {
        Toast(e, {}, ERROR);
      }
    },
    setDomain(value) {
      this.selectedDomain = value;
      this.getReverseRecordNames(this.selectedDomainAddr);
    },
    async setReverseRecord(chosenDomain) {
      try {
        const reverseRecord = await this.permHandler.setNameReverseRecord(
          chosenDomain.name
        );
        this.hasReverseRecordNames = true;
        return reverseRecord;
      } catch (e) {
        const err = errorHandler(e);
        if (err) Toast(err, {}, ERROR);
      }
    },
    async getReverseRecordNames() {
      try {
        const ens = this.network.type.ens
          ? new ENS(this.web3.currentProvider, this.network.type.ens.registry)
          : null;
        const reverse = ens.reverse(this.address);
        this.reverseRecordNames = await reverse.name();
        this.hasReverseRecordNames = true;
      } catch (e) {
        this.hasReverseRecordNames = false;
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.set-button {
  margin-left: 10px;
}
</style>

<style lang="scss">
.domain-dropdown {
  .v-input__slot {
    height: 62px;
  }
}
</style>
