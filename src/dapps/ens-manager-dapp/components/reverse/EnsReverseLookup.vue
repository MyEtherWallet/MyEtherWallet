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

    <mew-sheet
      v-for="domain in ensLookupResults"
      :key="domain.name"
      class="d-flex justify-space-between align-center mb-5 pr-5"
    >
      <p class="font-weight-heavy pt-5 pl-5">{{ domain.name }}</p>
      <mew-button
        title="Set Name"
        btn-size="medium"
        @click.native="setReverseRecord(domain)"
      />
    </mew-sheet>
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
        const reverseRecord = await domain.setNameReverseRecord(domain.name);
        return reverseRecord;
      } catch (e) {
        Toast(e, {}, ERROR);
      }
    }
  }
};
</script>
