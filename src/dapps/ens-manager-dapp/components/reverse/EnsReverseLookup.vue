<template>
  <div>
    <v-sheet
      class="addressBlock d-flex justify-space-between align-center mb-7"
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

    <mew-select
      v-else-if="hasDomains"
      :value="selectedDomain"
      class="d-flex justify-space-between align-center mb-5 pr-5"
      filter-placeholder="Search for Domain"
      :items="domainListItems"
      @input="setDomain"
    >
    </mew-select>
    <mew-button
      title="Register"
      btn-size="medium"
      @click.native="setReverseRecord(selectedDomain)"
    />
  </div>
</template>

<script>
import { Toast, ERROR } from '@/modules/toast/handler/handlerToast';
import { isEmpty } from 'lodash';
import ENS from 'ethereum-ens';
import { mapGetters, mapState } from 'vuex';
import PermanentNameModule from '../../handlers/handlerPermanentName';
export default {
  name: 'EnsReverseLookup',
  props: {
    address: {
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
      selectedDomain: {},
      permHandler: {}
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
    ...mapState('wallet', ['balance', 'address', 'web3']),
    ...mapState('global', ['gasPriceType']),
    ...mapState('wallet', ['balance', 'address', 'web3', 'instance']),
    domainListItems() {
      return this.ensLookupResults || [];
    }
  },
  async mounted() {
    await this.findDomainByAddress();
    const ens = this.network.type.ens
      ? new ENS(this.web3.currentProvider, this.network.type.ens.registry)
      : null;
    this.permHandler = new PermanentNameModule(
      this.name,
      this.network,
      this.address,
      this.web3,
      ens
    );
  },
  methods: {
    async fetchDomains() {
      return await this.ensManager.getAllNamesForReverseLookup(this.address);
    },
    async findDomainByAddress() {
      try {
        this.hasDomains = true;
        const domains = await this.fetchDomains();
        if (isEmpty(domains)) this.hasDomains = false;
        this.ensLookupResults = domains.map(item => {
          return {
            name: item.name,
            value: item.name
          };
        });
        console.log('ensLookupResults:', this.ensLookupResults);
      } catch (e) {
        Toast(e, {}, ERROR);
      }
    },
    setDomain(value) {
      this.selectedDomain = value;
    },
    async setReverseRecord(domain) {
      try {
        const reverseRecord = await this.permHandler.setNameReverseRecord(
          domain.name
        );
        return reverseRecord;
      } catch (e) {
        console.error(e);
        Toast(e, {}, ERROR);
      }
    }
  }
};
</script>
