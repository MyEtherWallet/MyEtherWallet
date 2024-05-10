<template>
  <div class="module-network-switch full-width">
    <v-row
      v-if="!shouldFilter && hasNetworks"
      class="align-end justify-center justify-sm-space-between pa-0"
    >
      <!-- ===================================================================================== -->
      <!-- Toggle: Main/Test/All -->
      <!-- ===================================================================================== -->
      <div
        class="align-center align-sm-end justify-center pr-sm-3 pb-sm-3 order-sm-2 mt-10 mt-sm-0"
      >
        <v-btn-toggle
          v-model="toggleType"
          mandatory
          active-class="buttonToggleDark white--text alig-end"
        >
          <v-btn small>Main</v-btn>
          <v-btn small>Test</v-btn>
          <v-btn small>All</v-btn>
        </v-btn-toggle>
      </div>

      <!-- ===================================================================================== -->
      <!-- Search Data -->
      <!-- ===================================================================================== -->
      <v-col cols="12" sm="7" class="order-sm-1">
        <mew-search
          placeholder="Find Network"
          :value="searchInput"
          @input="setSearch"
        />
      </v-col>
    </v-row>

    <!-- ===================================================================================== -->
    <!-- Empty Search Message -->
    <!-- ===================================================================================== -->
    <app-user-msg-block
      v-if="showEmptySearch || shouldFilter"
      :message="emptySearchMes"
      :is-alert="shouldFilter"
      class="mt-5"
    />

    <!-- ===================================================================================== -->
    <!-- Networks -->
    <!-- ===================================================================================== -->
    <v-radio-group
      v-model="networkSelected"
      :class="networks.length > 10 ? 'network-container' : ''"
    >
      <v-container
        v-for="(n, i) in networks"
        :key="n.name"
        :class="[
          { 'network-border-first': i === 0 },
          { 'network-border-last': i + 1 === networks.length },
          'py-4 px-5 network-border'
        ]"
      >
        <v-row class="pa-0 mew-body align-center justify-start">
          <!-- ===================================================================================== -->
          <!-- Icon -->
          <!-- ===================================================================================== -->
          <mew-token-container :img="n.icon" size="24px" />
          <!-- ===================================================================================== -->
          <!-- Symbol/Name -->
          <!-- ===================================================================================== -->
          <div class="textDark--text Capitalize pl-3">
            {{ n.name }}
          </div>
          <div class="px-2 textLight--text">-</div>
          <div class="textLight--text">
            {{ n.name_long }}
          </div>
          <v-spacer />

          <!-- ===================================================================================== -->
          <!-- Radio -->
          <!-- ===================================================================================== -->
          <v-radio
            :value="n.name"
            :class="['py-2 mb-0']"
            :disabled="networkLoading"
          >
          </v-radio>
        </v-row>
      </v-container>
    </v-radio-group>
  </div>
</template>

<script setup>
import { defineProps, ref, computed, watch, onMounted, defineEmits } from 'vue';
import { debounce } from 'lodash';
import { useRoute } from 'vue-router/composables';

import * as nodes from '@/utils/networks/nodes';
import * as types from '@/utils/networks/types';
import { Toast, SUCCESS } from '@/modules/toast/handler/handlerToast';

import WALLET_TYPES from '@/modules/access-wallet/common/walletTypes';
import { useGlobalStore } from '@/core/store/global';
import { useWalletStore } from '@/core/store/wallet';
import { useExternalStore } from '@/core/store/external';
import { storeToRefs } from 'pinia';

const emit = defineEmits(['newNetwork']);

// props
const props = defineProps({
  isWallet: { type: Boolean, default: true },
  /** Set this prop to pass specific networks to be displayed */
  filterTypes: { type: Array, default: () => [] },
  /** Set this prop to false if device does not support networks */
  hasNetworks: { type: Boolean, default: true }
});

// injections/use
const { validNetwork, setNetwork, setValidNetwork } = useGlobalStore();
const { identifier, instance, setWeb3Instance } = useWalletStore();
const { selectedEIP6963Provider, setTokenAndEthBalance } = useExternalStore();
const route = useRoute();

const { network } = storeToRefs(useGlobalStore());

// data
const networkSelectedBefore = ref(null);
const networkSelected = ref(null);
const toggleType = ref(0);
const searchInput = ref('');
const networkLoading = ref(false);

// computed
const shouldFilter = computed(() => {
  return route.name === 'Swap' || route.name === 'NFTManager';
});

const typeNames = computed(() => {
  if (props.hasNetworks) {
    const unsorted =
      props.filterTypes.length > 0
        ? [...props.filterTypes]
        : Object.keys(types);
    unsorted.splice(unsorted.indexOf('ETH'), 1);
    unsorted.sort();
    const test = unsorted.filter(item => {
      return types[item].isTestNetwork;
    });
    const main = unsorted.filter(item => {
      return !types[item].isTestNetwork;
    });
    const sorted = main.concat(test);
    sorted.unshift('ETH');
    return sorted;
  }
  return [];
});

const networks = computed(() => {
  let allNetworks = [];
  typeNames.value.forEach(item => {
    allNetworks.push(types[item]);
  });
  if (shouldFilter.value || identifier.value === WALLET_TYPES.MEW_WALLET) {
    allNetworks = allNetworks.filter(
      item =>
        item.name === types.ETH.name ||
        item.name === types.BSC.name ||
        item.name === types.MATIC.name
    );
  }
  if (searchInput.value && searchInput.value !== '') {
    return allNetworks.filter(item => hasString(item.name, item.name_long));
  }
  if (toggleType.value === 0) {
    return allNetworks.filter(item => !item.isTestNetwork);
  }
  if (toggleType.value === 1) {
    return allNetworks.filter(item => item.isTestNetwork);
  }
  return allNetworks;
});

/**
 * Property shows invalid search if user included input and networks length is 0
 * @returns {boolean}
 */
const showEmptySearch = computed(() => {
  return (
    searchInput.value && searchInput.value !== '' && networks.value.length === 0
  );
});

/**
 * Property shows search input string
 * @returns {object}
 */
const emptySearchMes = computed(() => {
  const msgTitle = route.name === 'Swap' ? 'Swap' : 'NFT Manager';
  if (shouldFilter.value && typeNames.value.length === 0) {
    return {
      title: `${msgTitle} is not supported on your device`,
      subtitle: ''
    };
  }
  if (typeNames.value.length === 0) {
    return {
      title: 'Changing a network is not supported on your device',
      subtitle: ''
    };
  }
  return {
    title: shouldFilter.value
      ? `${msgTitle} is only available on these networks`
      : '',
    subtitle: shouldFilter.value
      ? 'Select different feature to see all networks.'
      : 'We do not have a network with this name.'
  };
});

// watch
watch(
  () => network.value,
  (newVal, oldVal) => {
    if (newVal.type.name !== oldVal.type.name) {
      networkSelected.value = newVal.type.name;
    }
  },
  { deep: true }
);

watch(
  () => networkSelected.value,
  value => {
    if (!!value && (value !== network.value.type.name || !validNetwork)) {
      networkLoading.value = true;
      setNetworkDebounced(value);
    }
  }
);

watch(
  () => searchInput.value,
  (newVal, oldVal) => {
    if (networks.value.length > 0) {
      networkSelected.value = networkSelectedBefore.value;
    }

    if (newVal !== oldVal && (!oldVal || oldVal === '')) {
      toggleType.value = 2;
    }
  }
);

watch(
  () => validNetwork.value,
  val => {
    networkSelected.value = val ? network.value.type.name : null;
  }
);

watch(
  () => toggleType.value,
  () => {
    /**
     * Set networkSelected on toggle change, if network is in the list
     */
    if (!networkSelected.value) {
      if (
        networks.value.filter(item => item.name === network.value.type.name)
          .length > 0
      ) {
        networkSelected.value = validNetwork ? network.value.type.name : '';
      }
    }
  }
);

// mounted
onMounted(() => {
  networkSelected.value = validNetwork ? network.value.type.name : '';
  networkSelectedBefore.value = networkSelected.value;
});

// methods
/**
 * Method checks whether symbol or name has searchInput substring
 * @returns {boolean}
 */
const hasString = (symbol, name) => {
  return (
    symbol.toLowerCase().includes(searchInput.value.toLowerCase()) ||
    name.toLowerCase().includes(searchInput.value.toLowerCase())
  );
};

/**
 * Method sets SearchInout on mew-search input event
 * @returns {boolean}
 */
const setSearch = newVal => {
  searchInput.value = newVal;
};
/**
 * Debounce network switch from user input
 * @return {void}
 */
const setNetworkDebounced = debounce(function (value) {
  savePreviousNetwork();

  const found = Object.values(nodes).filter(item => {
    if (item.type.name === value) {
      return item;
    }
  });
  setValidNetwork(true);
  setNetwork({
    network: found[0],
    walletType: instance?.identifier || ''
  });
  networkLoading.value = false;
  if (props.isWallet) {
    networkSelected.value = validNetwork ? network.value.type.name : '';
    if (identifier === WALLET_TYPES.WEB3_WALLET) {
      setWeb3Instance(selectedEIP6963Provider);
    } else {
      setWeb3Instance();
    }
    Toast(`Switched network to: ${found[0].type.name}`, {}, SUCCESS);
    setTokenAndEthBalance();
    emit('newNetwork');
  }
}, 1000);
/**
 * Backup current network value
 */
const savePreviousNetwork = () => {
  if (networkSelected.value) {
    networkSelectedBefore.value = networkSelected;
  }
};
</script>

<style lang="scss" scoped>
$borderNetwork: 1px solid #ececec;

.network-container {
  max-height: 500px;
  overflow-y: scroll;
  overflow-x: hidden;
}

.network-border {
  border-bottom: $borderNetwork;
  border-right: $borderNetwork;
  border-left: $borderNetwork;
}

.network-border-first {
  border-top: $borderNetwork;
  border-radius: 4px 4px 0px 0px;
}

.network-border-last {
  border-radius: 0px 0px 4px 4px;
}

.mint-me-color {
  filter: brightness(0) saturate(100%) invert(90%) sepia(3%) saturate(5171%)
    hue-rotate(348deg) brightness(92%) contrast(63%);
}
</style>
