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
      class="d-flex justify-space-between align-center mb-5 pr-5"
      filter-placeholder="Search for Domain"
      :items="domainListItems"
    >
    </mew-select>
    <!-- <mew-button
        title="Register"
        btn-size="medium"
        @click.native="setReverseRecord(domain)"
      /> -->
  </div>
</template>

<script>
import { Toast, ERROR } from '@/modules/toast/handler/handlerToast';
import { isEmpty } from 'lodash';
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
      hasDomains: false
    };
  },
  computed: {
    domainListItems() {
      return this.ensLookupResults || [];
    }
  },
  async mounted() {
    await this.findDomainByAddress();
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
      } catch (e) {
        Toast(e, {}, ERROR);
      }
    }
    // async setReverseRecord(domain) {
    //   try {
    //     const reverseRecord = await domain.setNameReverseRecord(domain.name);
    //     return reverseRecord;
    //   } catch (e) {
    //     Toast(e, {}, ERROR);
    //   }
    // }
  }
};
</script>
