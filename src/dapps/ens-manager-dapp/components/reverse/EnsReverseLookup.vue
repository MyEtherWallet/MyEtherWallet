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

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import { isEmpty } from 'lodash';
import ENS from '@ensdomains/ensjs';

import PermanentNameModule from '../../handlers/handlerPermanentName';
import NameResolver from '@/modules/name-resolver/index';
import errorHandler from '@/modules/confirmation/handlers/errorHandler.js';
import metainfo from '../../metainfo.js';

import { Toast, ERROR } from '@/modules/toast/handler/handlerToast';
import { toBNSafe } from '@/core/helpers/numberFormatHelper';
import { useGlobalStore } from '@/core/store/global';
import { useWalletStore } from '@/core/store/wallet';

// injections/use
const { gasPrice, network } = useGlobalStore();
const { web3, balance } = useWalletStore();

// props
const props = defineProps({
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
});

// data
const ensLookupResults = ref(null);
const hasDomains = ref(false);
const selectedDomain = ref({ loading: false, fee: toBNSafe(0), error: '' });
const selectedDomainAddr = ref('');
const permHandler = ref({});
const hasReverseRecordNames = ref(false);
const reverseRecordNames = ref('');
const domainListItems = ref([]);
const nameResolver = ref(null);

// computed
const disableRegister = computed(() => {
  if (
    !selectedDomain.value.hasOwnProperty('address') ||
    !selectedDomain.value.hasOwnProperty('name')
  )
    return true;
  return (
    (!selectedDomain.value.value &&
      toBNSafe(balance.value).lt(selectedDomain.value.fee)) ||
    selectedDomain.value.error.length > 0
  );
});

// watch
watch(
  () => network.value,
  () => {
    if (checkNetwork()) setup();
  }
);
watch(
  () => props.address,
  addr => {
    if (checkNetwork() && addr) setup();
  }
);
watch(
  () => web3.value,
  () => {
    if (checkNetwork()) setup();
  }
);

// onMounted
onMounted(async () => {
  if (checkNetwork()) await setup();
});

// methods
const checkNetwork = () => {
  return metainfo.networks.find(
    item => item.chainID === network.value.type.chainID
  );
};
const setDomain = value => {
  selectedDomain.value = value;
  getReverseRecordNames(selectedDomainAddr.value);
};
const setDomainListItems = async () => {
  const array = [];
  const { name } = await nameResolver.value.resolveAddress(props.address);
  ensLookupResults.value?.forEach(async i => {
    i.loading = true;
    i.fee = toBNSafe(0);
    i.error = '';
    /**
     * check if address already has a reverse name
     */
    if (!name) {
      try {
        const gas = await permHandler.value.getNameReverseData(i.name);
        i.fee = toBNSafe(gas * gasPrice.value);
        if (toBNSafe(balance.value).lt(i.fee)) {
          i.error = `Insufficient amount of ${network.value.type.currencyName}`;
        }
      } catch {
        i.error = 'An error occurred while retrieving the domain information';
        i.loading = false;
        return array.push(i);
      }
    }
    i.loading = false;
    return array.push(i);
  }) || [];
  domainListItems.value = array;
};
const setup = async () => {
  await findDomainByAddress();
  const ens = network.value.type.ens
    ? new ENS({
        provider: web3.value.eth.currentProvider,
        ensAddress: network.value.type.ens.registry
      })
    : null;
  permHandler.value = new PermanentNameModule(
    props.name,
    props.address,
    network.value,
    web3.value,
    ens,
    props.durationPick
  );
  nameResolver.value = new NameResolver(network.value, web3.value);
  selectedDomain.value = { loading: false, fee: toBNSafe(0), error: '' };
  await setDomainListItems();
  getReverseRecordNames();
};
const fetchDomains = async () => {
  return await props.ensManager.value.getAllNamesForAddress(props.address);
};
const findDomainByAddress = async () => {
  try {
    hasDomains.value = true;
    const domains = await fetchDomains();
    if (isEmpty(domains)) hasDomains.value = false;
    ensLookupResults.value = domains.map(item => {
      return {
        name: item.name,
        value: item.nameHash,
        address: item.address
      };
    });
  } catch (e) {
    Toast(e, {}, ERROR);
  }
};
const setReverseRecord = async chosenDomain => {
  try {
    const reverseRecord = await permHandler.value.setNameReverseRecord(
      chosenDomain.name
    );
    hasReverseRecordNames.value = true;
    return reverseRecord;
  } catch (e) {
    const err = errorHandler(e);
    if (err) Toast(err, {}, ERROR);
  }
};
const getReverseRecordNames = async () => {
  try {
    const ens = network.value.type.ens
      ? new ENS(web3.value.currentProvider, network.value.type.ens.registry)
      : null;
    const reverse = ens.reverse(props.address);
    reverseRecordNames.value = await reverse.name();
    hasReverseRecordNames.value = true;
  } catch (e) {
    hasReverseRecordNames.value = false;
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
