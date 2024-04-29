<template>
  <!--
    =====================================================================================
      Module Nft Manager
    =====================================================================================
    -->
  <div class="module-nft-manager">
    <mew-module
      class="text-center d-flex justify-end flex-grow-1 pt-6 mr-3"
      :has-elevation="true"
      :has-indicator="true"
      title="NFT Manager"
    >
      <template #moduleBody>
        <!--
    =====================================================================================
      Loading
    =====================================================================================
    -->
        <div class="loader bgWalletBlockDark">
          <v-skeleton-loader
            v-if="loadingContracts && !hasNoTokens"
            type="table-heading,list-item-avatar-three-line, list-item-avatar-three-line, list-item-avatar-three-line"
          />
        </div>
        <!--
    =====================================================================================
    Display if no nfts owned
    =====================================================================================
    -->
        <v-card
          v-if="
            (!loadingContracts &&
              contracts.length === 0 &&
              tabs.length === 0) ||
            hasNoTokens
          "
          flat
          color="bgWalletBlockDark"
          class="d-flex align-center px-5 py-4"
          min-height="94px"
        >
          <v-card-text class="text-center"
            >{{ $t('nftManager.none-owned') }}
          </v-card-text>
        </v-card>
        <!--
    =====================================================================================
      Display owned nft tokens
    =====================================================================================
    -->
        <mew-tabs
          v-if="
            !loadingContracts && !onNftSend && tabs.length > 0 && !hasNoTokens
          "
          :items="tabs"
          :is-vertical="$vuetify.breakpoint.mdAndUp"
          :has-underline="$vuetify.breakpoint.smAndDown"
          :active-tab="activeTab"
          @onTab="onTab"
        >
          <template
            v-for="(contract, idx) in contracts"
            :slot="'tabItemContent' + (idx + 1)"
          >
            <div :key="idx" class="ml-5">
              <!--
    =====================================================================================
      Display all owned tokens by nft
    =====================================================================================
    -->
              <div class="d-flex justify-space-between mt-3 mb-5">
                <h5 class="font-weight-bold">
                  {{ selectedContract.name }}
                </h5>
                <div>Total: {{ selectedContract.total }}</div>
              </div>
              <div v-if="displayedTokens && displayedTokens.length === 0">
                Loading ...
              </div>
              <div v-if="displayedTokens && displayedTokens.length !== 0">
                <div
                  v-for="(token, tokenIdx) in displayedTokens"
                  :key="tokenIdx"
                  class="mb-3"
                >
                  <!--
    =====================================================================================
      Nft Token Card Details
    =====================================================================================
    -->
                  <nft-manager-details
                    :loading="loadingTokens"
                    :on-click="openNftSend"
                    :token="token"
                  />
                </div>
                <!--
    =====================================================================================
      Displays pagination if there are more than > 9 tokens
    =====================================================================================
    -->
                <div
                  v-if="hasPages"
                  class="px-4 mt-3 d-flex align-center justify-end"
                >
                  <v-pagination
                    v-model="currentPage"
                    class="nft-pagination"
                    color="expandHeader"
                    :length="totalPages"
                    prev-icon="mdi-menu-left"
                    next-icon="mdi-menu-right"
                    @input="setPage"
                  />
                </div>
              </div>
            </div>
          </template>
        </mew-tabs>
        <!--
    =====================================================================================
      Display send token page
    =====================================================================================
    -->
        <nft-manager-send
          v-if="onNftSend"
          :close="closeNftSend"
          :nft="selectedNft"
          :nft-category="selectedContract.name"
          :send="sendTx"
          :disabled="!isValid"
          :enough-funds="enoughFunds"
          :show-balance-error="showBalanceError"
          :set-address="setAddress"
          @hasMinEth="hasMinEth"
        />
      </template>
    </mew-module>
  </div>
</template>

<script setup>
import { defineAsyncComponent, ref, onMounted, watch, computed } from 'vue';
import { toBN, isAddress } from 'web3-utils';
import {
  Toast,
  SUCCESS,
  WARNING,
  ERROR
} from '@/modules/toast/handler/handlerToast';
import getService from '@/core/helpers/getService';

import {
  global as useGlobalStore,
  wallet as useWalletStore
} from '@/core/store/index.js';

import { ROUTES_WALLET } from '@/core/configs/configRoutes';
import { ETH, BSC, MATIC } from '@/utils/networks/types';
import { toBNSafe } from '@/core/helpers/numberFormatHelper';
import NFT from './handlers/handlerNftManager';
import handleError from '@/modules/confirmation/handlers/errorHandler.js';
import { useRouter } from 'vue-router/composables';

const MIN_GAS_LIMIT = 21000;

const NftManagerDetails = defineAsyncComponent(() =>
  import('./components/NftManagerDetails')
);
const NftManagerSend = defineAsyncComponent(() =>
  import('./components/NftManagerSend')
);

// injections/use
const { gasPriceType, network, gasPriceByType } = useGlobalStore();
const { web3, address, balanceInWei } = useWalletStore();
const router = useRouter();

// data
const nft = ref({});
const activeTab = ref(0);
const onNftSend = ref(false);
const hasNoTokens = ref(false);
const selectedNft = ref({});
const toAddress = ref('');
const selectedContract = ref({});
const gasFees = ref('0');
const enoughFunds = ref(false);
const showBalanceError = ref(false);
const localGasPrice = ref('0');
const loadingContracts = ref(true);
const loadingTokens = ref(true);
const nftApiResponse = ref([]);

// computed
const tabs = computed(() => {
  return contracts.value.map(item => {
    let tabName = `${item.name} (${item.count})`;
    if (tabName.length > 25) {
      tabName = item.name.substring(0, 20);
      tabName += `... (${item.count})`;
    }
    return { name: tabName };
  });
});

const tokens = computed(() => {
  if (nftApiResponse.value.length > 0) {
    const contract = nftApiResponse.value.filter(item => {
      return (
        item.contract_address.toLowerCase() ===
        selectedContract.value.contract.toLowerCase()
      );
    });
    if (contract) {
      return contract.map(item => {
        const url = item.image_url ? item.image_url : '';
        return {
          image: `https://img.mewapi.io/?image=${url}`,
          name: item.name || item.token_id,
          token_id: item.token_id,
          contract: item.contract_address,
          erc721: item.contract.type === 'ERC721'
        };
      });
    }
  }
  return [];
});

const contracts = computed(() => {
  if (nftApiResponse.value.length > 0) {
    // Organize contracts by address
    return nftApiResponse.value.reduce((arr, item) => {
      const nftAmount = item.queried_wallet_balances[0].quantity;
      const inList = arr.find(i => i.contract === item.contract_address);
      if (inList) {
        inList.count++;
        inList.total += nftAmount;
      } else {
        arr.push({
          contract: item.contract_address,
          count: 1,
          total: nftAmount,
          name: item.contract.name || item.collection.name
        });
      }
      return arr;
    }, []);
  }
  return [];
});

const totalPages = computed(() => {
  return nft.value.totalPages(selectedContract.value.count);
});
const hasPages = computed(() => {
  return nft.value.hasPages(selectedContract.value.count);
});
const startIndex = computed(() => {
  return nft.value.startIndex();
});
const endIndex = computed(() => {
  return nft.value.endIndex(selectedContract.value.count);
});

const currentPage = computed({
  get() {
    return nft.value.currentPage;
  },
  set(newValue) {
    return newValue;
  }
});
/**
 * Display tokens according to page
 */
const displayedTokens = () => {
  return tokens.value.slice(startIndex.value, endIndex.value);
};
/**
 * Check if address is valid
 */
const isValid = () => {
  return nft.value.isValidAddress(toAddress.value) && enoughFunds.value;
};
/**
 * Check if network is supported
 */
const supportedNetwork = () => {
  return supportedNetworks.values.includes(network.type.name);
};
/**
 * List of supported networks
 */
const supportedNetworks = () => {
  return [ETH.name, MATIC.name, BSC.name];
};

// watch
watch(balanceInWei, () => {
  hasMinEth();
});

watch(web3, () => {
  loadingContracts.value = true;
  loadingTokens.value = true;
  onNftSend.value = false;
  if (address) router.push({ name: ROUTES_WALLET.NFT_MANAGER.NAME });
  if (supportedNetwork) {
    setUpNFT();
  } else {
    setTimeout(() => {
      Toast(
        `NFT Manager not supported in network: ${network.type.name}`,
        {},
        WARNING
      );
      nftApiResponse.value = [];
    }, 1000);
  }
});

watch(address, () => {
  loadingContracts.value = true;
  loadingTokens.value = true;
  onNftSend.value = false;
  if (address) router.push({ name: ROUTES_WALLET.NFT_MANAGER.NAME });
  setUpNFT();
});

watch(contracts, newVal => {
  if (newVal.length > 0) {
    onTab(0);
  }
});

watch(toAddress, async newVal => {
  if (isAddress(newVal) && enoughFunds) {
    try {
      const gasTypeFee = gasPriceByType(gasPriceType);
      localGasPrice.value = gasTypeFee;
      const locGasFees = await nft.value.getGasFees(newVal, selectedNft);
      const gasFeesToBN = toBNSafe(locGasFees).mul(toBNSafe(gasTypeFee));
      gasFees.value = gasFeesToBN.toString();
      if (gasFeesToBN.gte(toBN(balanceInWei))) {
        //gasFeesToBN vs current balance
        enoughFunds.value = false;
        showBalanceError.value = true;
      } else {
        enoughFunds.value = true;
        showBalanceError.value = false;
      }
    } catch (e) {
      enoughFunds.value = false;
      showBalanceError.value = false;
      Toast(
        `Can't send NFT! Please double check if everything is correct`,
        {},
        ERROR
      );
    }
  }
});

// mounted
onMounted(() => {
  setUpNFT();
});

// methods
const setUpNFT = () => {
  if (!supportedNetwork.value) return;
  /**
   * Init NFT Handler
   */
  nft.value = new NFT({
    network: network,
    address: address,
    web3: web3
  });

  getNfts();
  localGasPrice.value = gasPriceByType(gasPriceType);
  this.hasMinEth();
};

const getNfts = () => {
  nft.value.getNfts().then(res => {
    nftApiResponse.value = res;
    loadingContracts.value = false;
    setTimeout(() => {
      loadingTokens.value = false;
    }, 500);
  });
};

const hasMinEth = () => {
  const currentGasPrice = localGasPrice.value;
  if (toBN(balanceInWei).gt(toBN(currentGasPrice).muln(MIN_GAS_LIMIT))) {
    enoughFunds.value = true;
    showBalanceError.value = false;
  } else {
    enoughFunds.value = false;
    showBalanceError.value = true;
  }
};

const onTab = val => {
  activeTab.value = val;
  selectedContract.value = contracts.value[val];
  nft.value.goToFirstPage();
};

const openNftSend = selectedNft => {
  if (selectedNft) {
    selectedNft.value = selectedNft;
  }
  onNftSend.value = true;
  router.push({ name: ROUTES_WALLET.NFT_MANAGER_SEND.NAME });
};

const closeNftSend = () => {
  onNftSend.value = false;
  toAddress.value = '';
  router.push({ name: ROUTES_WALLET.NFT_MANAGER.NAME });
};

const sendTx = async () => {
  if (isValid.value) {
    try {
      let gasPrice = undefined;
      if (network.type.name === 'MATIC')
        gasPrice = `0x${toBN(localGasPrice.value).toString('hex')}`;
      nft.value
        .send(toAddress.value, selectedNft.value, gasPrice.value)
        .then(response => {
          updateValues();
          enoughFunds.value = true;
          toAddress.value = '';
          closeNftSend();
          Toast(
            'Cheers! Your transaction was mined. Check it in ',
            {
              title: `${getService(network.type.blockExplorerTX)}`,
              url: network.type.blockExplorerTX.replace(
                '[[txHash]]',
                response.blockHash
              )
            },
            SUCCESS,
            5000
          );
        })
        .catch(e => {
          const error = handleError(e.message);
          if (error) Toast(error, {}, ERROR);
        });
    } catch (e) {
      Toast(e.message, {}, WARNING);
    }
  }
};

const updateValues = () => {
  const idx = tokens.value.findIndex(
    item => item.token_id === selectedNft.value.token_id
  );
  tokens.value.splice(idx, 1);
  if (tokens.value.length === 0 && contracts.value.length === 1) {
    hasNoTokens.value = true;
  }
  getNfts();
};

const setAddress = address => {
  if (typeof address === 'object' && !!address) {
    toAddress.value = address.address;
  } else {
    toAddress.value = address;
  }
};

const setPage = number => {
  nft.value.setCurrentPage(number);
};
</script>

<style lang="scss" scoped></style>

<style lang="scss">
.module-nft-manager .loader .v-skeleton-loader__bone {
  background: transparent !important;
}
.nft-pagination {
  .v-pagination__navigation,
  .v-pagination__item {
    box-shadow: none;
  }
}
</style>
