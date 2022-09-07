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

    <div v-else class="d-flex flex-column justify-space-between">
      <div class="mew-heading-2 mb-2">Your Domains:</div>
      <div class="d-flex justify-space-between">
        <mew-select
          :value="selectedDomain"
          filter-placeholder="Search for Domain"
          :items="domainListItems"
          @input="setDomain"
        >
        </mew-select>
        <mew-button
          title="Register"
          class="set-button"
          btn-size="xlarge"
          @click.native="setReverseRecord(selectedDomain)"
        />
      </div>
    </div>
    <div v-if="hasReverseRecordNames">
      <div class="mew-heading-2 mb-2">Reverse Names:</div>
      <div class="d-flex justify-space-between">
        {{ reverseRecordNames }}
        <!-- <mew-select
          :value="selectedDomain"
          filter-placeholder="Search for Domain"
          :items="domainListItems"
          @input="setDomain"
        >
        </mew-select> -->
        <!-- <mew-button
          title="Register"
          class="set-button"
          btn-size="xlarge"
          @click.native="setReverseRecord(selectedDomain)"
        /> -->
      </div>
    </div>
  </div>
</template>

<script>
import { isEmpty } from 'lodash';
import ENS from '@ensdomains/ensjs';
import { mapGetters, mapState } from 'vuex';

import { Toast, ERROR } from '@/modules/toast/handler/handlerToast';
import PermanentNameModule from '../../handlers/handlerPermanentName';
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
      selectedDomain: {},
      selectedDomainAddr: '',
      permHandler: {},
      hasReverseRecordNames: false,
      reverseRecordNames: ''
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
    domainListItems() {
      return this.ensLookupResults || [];
    }
  },
  async mounted() {
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
    this.getReverseRecordNames();
  },
  methods: {
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
        Toast(e, {}, ERROR);
      }
    },
    // async getReverseRecordNames() {
    //   try {
    //     const reverseRecordNames = await this.permHandler.getReverseNameRecords(
    //       this.permHandler.nameHash
    //     );
    //     this.reverseRecordNames = reverseRecordNames;
    //     return reverseRecordNames;
    //   } catch (e) {
    //     Toast(e, {}, ERROR);
    //   }
    // },
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
