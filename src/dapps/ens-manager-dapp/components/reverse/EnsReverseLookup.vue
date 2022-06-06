<template>
  <div>
    <v-sheet class="addressBlock d-flex justify-space-between align-center">
      <mew-blockie :address="address" />
      <span class="font-weight-light">{{ address }}</span>
    </v-sheet>
    <div v-if="!hasDomains">
      <div class="font-weight-light d-flex justify-space-between align-center">
        No ENS names have their ETH Address records set to this address. Only
        ENS names that point to your Ethereum account can be set as your Primary
        ENS Name.
      </div>
    </div>

    <mew-button
      v-for="domain in ensLookupResults"
      :key="domain.name"
      :title="domain.name"
      :transparent="true"
      @click.native="setReverseRecord(domain)"
    >
    </mew-button>
  </div>
</template>

<script>
import { Toast, ERROR } from '@/modules/toast/handler/handlerToast';
export default {
  name: 'EnsReverseLookup',
  props: {
    address: {
      default: '',
      type: String
    },
    network: {
      default: () => {},
      type: Object
    },
    ensManager: {
      default: () => {},
      type: Object
    }
  },
  data() {
    return {
      ensLookupResults: '',
      hasDomains: false
    };
  },
  mounted() {
    this.findDomainByAddress();
  },
  methods: {
    async findDomainByAddress() {
      this.hasDomains = true;
      try {
        const lookupDomains = await this.ensManager.getAllNamesForReverseLookup(
          this.address
        );
        if (lookupDomains.length === 0) {
          this.hasDomains = false;
          Toast('Address provided does not own any ens domains', {}, ERROR);
        } else {
          this.hasDomains = true;
        }
        this.ensLookupResults = lookupDomains;
        return this.ensLookupResults;
      } catch (e) {
        Toast(e, {}, ERROR);
      }
    },
    async setReverseRecord(domain) {
      try {
        const reverseRecord = await domain.setNameReverseRecord(
          this.network.type.ens.registry,
          domain.name
        );
        return reverseRecord;
      } catch (e) {
        Toast(e, {}, ERROR);
      }
    }
  }
};
</script>
