<template>
  <div class="bgWalletBlock moon-pay-token-select" :class="open ? 'open' : ''">
    <div class="py-8">
      <div class="px-5 d-flex align-center">
        <v-btn icon @click.native="close">
          <v-icon color="textDark">mdi-arrow-left</v-icon>
        </v-btn>
        <div class="ml-4 mew-heading-2 textDark--text">Select Token</div>
      </div>
      <div class="px-8 mt-8">
        <mew-select
          v-model="selectedNetwork"
          :items="fetchedNetworks"
          filter-placeholder="Select Network"
          label="Network"
          class="mt-1"
          has-filter
          is-custom
        />
        <v-text-field
          v-model="searchValue"
          class="mt-2"
          outlined
          label="Search"
          prepend-inner-icon="mdi-magnify"
          hide-details
        ></v-text-field>

        <div v-if="searchedCurrencyItems.length > 0" class="mt-5">
          <div v-for="(token, idx) in searchedCurrencyItems" :key="idx">
            <v-btn
              v-if="token.name"
              color="buttonGrayLight"
              :class="
                token.name == selectedCurrency.name ? 'selected-button' : ''
              "
              width="100%"
              text
              dpressed
              class="d-flex align-center py-6"
              @click.native="tokenSelected(token)"
            >
              <mew-token-container size="30px" :img="token.img" />
              <div class="mew-heading-3 textDark--text ml-4">
                {{ token.name }}
              </div>
              <div class="textDark--text ml-1">- {{ token.subtext }}</div>
              <div class="textDark--text ml-auto">{{ token.price }}</div>
            </v-btn>
          </div>
        </div>
        <div v-else class="mt-5 mew-heading-4 ml-4">No tokens found</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, ref, computed, watch, onMounted, defineEmits } from 'vue';
import { isEmpty } from 'lodash';

import { ERROR, SUCCESS, Toast } from '@/modules/toast/handler/handlerToast';
import WALLET_TYPES from '@/modules/access-wallet/common/walletTypes';
import * as nodes from '@/utils/networks/nodes';
import { ETH, BSC, MATIC } from '@/utils/networks/types';
import { useGlobalStore } from '@/core/store/global';
import { useWalletStore } from '@/core/store/wallet';
import { useExternalStore } from '@/core/store/external';

// props
const props = defineProps({
  currencyItems: {
    type: Array,
    default: () => []
  },
  selectedCurrency: {
    type: Object,
    default: () => {}
  },
  setCurrency: {
    type: Function,
    default: () => {}
  },
  open: {
    type: Boolean,
    default: false
  },
  inWallet: {
    type: Boolean,
    default: false
  },
  isSell: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['newNetwork', 'close']);

// injections/use
const { Networks, setNetwork } = useGlobalStore();
const { instance, identifier, setWeb3Instance, isOfflineApp } =
  useWalletStore();
const { selectedEIP6963Provider, setTokenAndEthBalance } = useExternalStore();

// data
const searchValue = ref('');
const fetchedNetworks = ref([]);
const selectedNetwork = ref({});

// computed
const searchedCurrencyItems = computed(() => {
  if (searchValue.value) {
    const found = props.currencyItems.filter(element => {
      return (
        element.name.toLowerCase().includes(searchValue.value.toLowerCase()) ||
        element.subtext.toLowerCase().includes(searchValue.value.toLowerCase())
      );
    });
    return found;
  }
  return props.currencyItems;
});

// watch
watch(selectedNetwork, (newVal, oldVal) => {
  // actual check whether the value was changed or just initially set
  if (newVal && !isEmpty(newVal) && oldVal && !isEmpty(oldVal)) {
    setNewNetwork(newVal);
  }
});
watch(open, () => {
  searchValue.value = '';
});

onMounted(() => {
  fetchNetworks();
});

const fetchNetworks = () => {
  const networkList = Object.values(Networks).filter(network => {
    if (props.isSell) {
      if (network[0].type.name === ETH.name) {
        return network;
      }
    } else {
      if (
        network[0].type.name === ETH.name ||
        network[0].type.name === MATIC.name ||
        network[0].type.name === BSC.name
      ) {
        return network;
      }
    }
  });
  fetchedNetworks.value = networkList.map(network => {
    return {
      img: network[0].type?.icon,
      name: network[0].type?.name_long,
      value: network[0].type?.name,
      subtext: network[0].type?.currencyName
    };
  });
};
const setNewNetwork = network => {
  const found = Object.values(nodes).filter(item => {
    if (item.type.name === network.value) {
      return item;
    }
  });
  setNetwork({
    network: found[0],
    walletType: instance?.identifier || ''
  })
    .then(() => {
      if (props.inWallet) {
        const provider =
          identifier === WALLET_TYPES.WEB3_WALLET
            ? setWeb3Instance(selectedEIP6963Provider)
            : setWeb3Instance();
        if (!isOfflineApp) {
          provider.then(() => {
            setTokenAndEthBalance();
          });
        }
      } else {
        setWeb3Instance();
      }
      Toast(`Switched network to: ${network.name}`, {}, SUCCESS);
      emit('newNetwork');
    })
    .catch(e => {
      Toast(e, {}, ERROR);
    });
};
const tokenSelected = token => {
  props.setCurrency(token);
  close();
};
const close = () => {
  emit('close');
};
</script>

<style lang="scss" scoped>
.moon-pay-token-select {
  position: absolute;
  bottom: 0;
  left: 0;
  height: 0%;
  width: 100%;
  overflow: hidden;
  transition: height 0.25s ease;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.2);

  &.open {
    height: 100%;
  }
}
.selected-button {
  background-color: var(--v-buttonGrayLightSelected-base);
}
</style>
