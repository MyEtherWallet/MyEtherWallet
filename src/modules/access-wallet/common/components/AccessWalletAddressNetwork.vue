<template>
  <div style="width: 100%">
    <div v-if="paths.length > 0 && !hidePathSelection" class="text-right mb-3">
      <access-wallet-derivation-path
        :selected-path="selectedPath"
        :passed-paths="paths"
        :disable-custom-paths="disableCustomPaths"
        @setPath="setPath"
      />
    </div>
    <mew-expand-panel :interactive-content="true" :panel-items="panelItems">
      <!--
          =====================================================================================
            Panel: Select Address
          =====================================================================================
          -->
      <template #panelBody1>
        <v-radio-group v-model="selectedAddress">
          <mew-light-table
            :loader-count="5"
            background
            full-width
            flat
            :loading="isLoading"
            :no-table-padding="isMobile"
          >
            <table>
              <thead>
                <tr>
                  <td style="width: 55px; padding-right: 0"></td>
                  <td v-if="!isMobile" style="padding: 0"></td>
                  <td>ADDRESS</td>
                  <td v-if="!isOfflineApp" class="text-right">
                    <span v-if="!isMobile">{{ network.type.name }}</span>
                    BALANCE
                  </td>
                </tr>
              </thead>

              <tbody>
                <tr v-for="acc in accounts" :key="acc.address">
                  <td style="padding-right: 0">
                    <v-radio label="" :value="acc.address" class="mb-0" />
                  </td>
                  <td v-if="!isMobile" style="padding: 0">{{ acc.idx }}</td>
                  <td>
                    <div class="d-flex align-center flex-shrink-1">
                      <mew-blockie
                        width="21px"
                        height="21px"
                        :address="acc.address"
                        class="mr-2"
                      />
                      <div>
                        <div class="d-flex align-center">
                          <mew-transform-hash
                            style="
                              width: 34vw;
                              max-width: 220px;
                              min-width: 100px;
                            "
                            :hash="acc.address"
                          />
                          <app-copy-btn
                            v-if="!isMobile"
                            class="ml-2"
                            :copy-value="acc.address"
                          >
                            <v-btn x-small icon color="greenPrimary">
                              <img
                                src="@/assets/images/icons/icon-copy-green.svg"
                                alt="copy"
                                height="13"
                              />
                            </v-btn>
                          </app-copy-btn>
                          <a
                            v-if="!isMobile"
                            :href="getExplorerLink(acc.address)"
                            rel="noopener noreferrer"
                            target="_blank"
                          >
                            <v-btn x-small icon color="greenPrimary">
                              <img
                                src="@/assets/images/icons/icon-arrow-top-right-green.svg"
                                alt="copy"
                                height="13"
                              />
                            </v-btn>
                          </a>
                        </div>

                        <div v-if="acc.ensName" class="mew-label">
                          {{ acc.ensName }}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td class="d-flex justify-end align-center">
                    <div
                      v-if="!isOfflineApp"
                      class="balance-overflow text-right mew-label"
                      style="width: 18vw; max-width: 81px"
                    >
                      {{ acc.balance }}
                      <span v-if="!isMobile">{{ network.type.name }}</span>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </mew-light-table>
        </v-radio-group>

        <div>
          <!--
              =====================================================================================
               Previous / Next Buttons
              =====================================================================================
              -->
          <v-row class="pb-6" align="center" justify="center">
            <div>
              <mew-button
                title="Previous"
                color-theme="basic"
                icon="mdi-chevron-left"
                icon-type="mdi"
                btn-size="small"
                icon-align="left"
                btn-style="transparent"
                :disabled="currentIdx === 0 || addressPage === 1"
                @click.native="previousAddressSet"
              />
              <mew-button
                title="Next"
                color-theme="basic"
                icon="mdi-chevron-right"
                icon-type="mdi"
                btn-size="small"
                icon-align="right"
                btn-style="transparent"
                @click.native="nextAddressSet"
              />
            </div>
          </v-row>
        </div>
      </template>
      <!--
          =====================================================================================
            Panel: Network
          =====================================================================================
          -->
      <template #panelBody2>
        <div class="px-5">
          <network-switch :is-wallet="false" @newNetwork="setNetworkPanel" />
        </div>
      </template>
    </mew-expand-panel>
    <!--
        =====================================================================================
         Terms
        =====================================================================================
        -->
    <div class="d-flex align-center flex-column py-6">
      <mew-checkbox
        v-model="acceptTerms"
        :label="label"
        :link="link"
        class="justify-center"
      />
    </div>
    <!--
        =====================================================================================
          Back / Access Wallet Buttons
        =====================================================================================
        -->
    <app-btn-row
      class="my-2"
      next-btn-text="Access my wallet"
      :next-btn-method="accessWallet"
      :back-btn-method="null"
      :next-disable="buttonDisabled"
    />
  </div>
</template>
<script>
const MAX_ADDRESSES = 5;
</script>
<script setup>
import { defineProps, ref, computed, watch, onMounted, defineEmits } from 'vue';
import { useQuery } from '@vue/apollo-composable';
import { fromWei, toChecksumAddress } from 'web3-utils';
import { isEmpty, isEqual } from 'underscore';
import ENS from '@ensdomains/ensjs';
import Web3 from 'web3';
import { isValidAddress } from 'ethereumjs-util';

import NetworkSwitch from '@/modules/network/components/NetworkSwitch.vue';
import AccessWalletDerivationPath from '@/modules/access-wallet/hardware/components/AccessWalletDerivationPath.vue';
import { Toast, ERROR } from '@/modules/toast/handler/handlerToast';
import { getEthBalance } from '@/apollo/queries/wallets/wallets.graphql';
import { formatFloatingPointValue } from '@/core/helpers/numberFormatHelper';
import { useWalletStore } from '@/core/store/wallet';
import { useGlobalStore } from '@/core/store/global';
import { useAddressBookStore } from '@/core/store/addressBook';
import { useVuetify } from '@/core/composables/vuetify';

// emits
const emits = defineEmits(['setPath', 'unlock']);

// injections/use
const { isOfflineApp } = useWalletStore();
const { addressBookStore } = useAddressBookStore();
const { network } = useGlobalStore();
const vuetify = useVuetify();

// data
const currentIdx = ref(0);
const acceptTerms = ref(false);
const label = ref('To access my wallet, I accept ');
const link = ref({
  title: 'Terms',
  url: 'https://www.myetherwallet.com/terms-of-service'
});
const selectedAddress = ref('');
const accountAddress = ref('');
const panelNetworkSubstring = ref('');
const addressPage = ref(0);
const accounts = ref([]);

// props
const props = defineProps({
  handlerWallet: {
    type: Object,
    default: function () {
      return {};
    }
  },
  paths: {
    type: Array,
    default: () => []
  },
  selectedPath: {
    type: Object,
    default: () => {}
  },
  /**
   * hides access wallet derivation path component
   */
  hidePathSelection: {
    type: Boolean,
    default: false
  },
  /**
   * disables custom derivation path
   */
  disableCustomPaths: {
    type: Boolean,
    default: false
  },
  hideNetworks: {
    type: Boolean,
    default: false
  }
});

// computed
const buttonDisabled = computed(() => {
  return !acceptTerms.value || selectedAddress.value === '';
});
const web3 = computed(() => {
  return new Web3(network.value.url);
});
const isLoading = computed(() => {
  return accounts.value.length !== MAX_ADDRESSES;
});
/**
 * Property returns the index of the account of the accountAddress
 */
const onAccountIndex = computed(() => {
  return accounts.value.findIndex(acc => acc.address === accountAddress.value);
});
/**
 * Property returns boolean and validates whether or not to skip Apollo GetEthBalance query.
 */
const skipApollo = computed(() => {
  return (
    (accountAddress.value && accountAddress.value !== '') ||
    (accounts.value[onAccountIndex.value] &&
      accounts.value[onAccountIndex.value].balance === 'Loading..')
  );
});
/**
 * Property returns edited version of the selected address. ie: 0x3453...3a3b
 */
const panelAddressSubstring = computed(() => {
  return selectedAddress.value && selectedAddress.value !== ''
    ? `${selectedAddress.value.substring(
        0,
        6
      )} ... ${selectedAddress.value.substring(
        selectedAddress.value.length - 4,
        selectedAddress.value.length
      )}`
    : '';
});
/**
 * Property returns expand panel items for the Address and Network
 */
const panelItems = computed(() => {
  const panelItems = [
    {
      name: 'Address',
      subtext: panelAddressSubstring.value,
      colorTheme: 'greyLight',
      hasActiveBorder: true
    }
  ];
  if (!props.hideNetworks) {
    panelItems.push({
      name: 'Network',
      subtext: panelNetworkSubstring.value,
      colorTheme: 'greyLight',
      hasActiveBorder: true
    });
  }
  return panelItems;
});
/**
 * Property returns default network and nodes items
 * Property Interface:
 * {  name = string -> Name of the Path,
 *    subtext = string --> Derivation Path,
 *    value = tring --> Derivation Path
 * }
 */
const walletAccount = computed(() => {
  const wallet = accounts.value.find(item => {
    return item.address === selectedAddress.value;
  });
  if (wallet) {
    return wallet.account;
  }
  return null;
});
const isMobile = computed(() => {
  return vuetify.breakpoint.smAndDown;
});
const blockExplorer = computed(() => {
  return network.value.type.blockExplorerAddr;
});

// apollo
const { onResult: getEthBalanceResult } = useQuery(
  getEthBalance,
  () => ({ hash: accountAddress.value }),
  {
    enabled: isOfflineApp.value
      ? false
      : skipApollo.value || accountAddress.value !== null
  }
);
getEthBalanceResult(({ data }) => {
  if (data && data.getEthBalance) {
    if (accounts.value[onAccountIndex.value]) {
      /**
       * Sets the balance of the account of accountAddress
       */
      accounts.value[onAccountIndex.value].balance = formatFloatingPointValue(
        fromWei(data.getEthBalance.balance)
      ).value;
      /**
       * Find the next index and set the address of it to accountAddress
       */
      const nextIdx = onAccountIndex.value + 1;
      if (
        nextIdx < accounts.value.length &&
        accounts.value[nextIdx].balance === 'Loading..'
      ) {
        accountAddress.value = accounts.value[nextIdx].address;
      }
    }
  }
});

// watch
watch(
  () => accounts.value,
  newVal => {
    accounts.value = newVal;
  },
  { deep: true }
);
watch(
  () => network.value,
  () => {
    changeHandler();
  },
  { deep: true }
);
watch(
  () => props.selectedPath,
  (newVal, oldVal) => {
    if (!isEqual(newVal, oldVal)) {
      changeHandler();
    }
  },
  { deep: true }
);
watch(
  () => props.handlerWallet,
  (newVal, oldVal) => {
    if (!isEqual(newVal, oldVal)) {
      changeHandler();
    }
  }
);

// mounted
onMounted(() => {
  if (isOfflineApp.value) {
    link.value = {};
    label.value = 'To access my wallet, I accept Terms';
  }
  setNetworkPanel();
  setAccounts();
});

const setPath = path => {
  emits('setPath', path);
};
const changeHandler = () => {
  accounts.value.splice(0);
  addressPage.value = 0;
  selectedAddress.value = '';
  accountAddress.value = '';
  currentIdx.value = 0;
  setAccounts();
};
/**
 * Async method that gets accounts according to the pagination
 */
const setAccounts = async () => {
  /**
   * prevents error when handlerWallet
   * is empty due to selectedPatch changing
   */
  if (!isEmpty(props.handlerWallet)) {
    const accountsArray = [];
    try {
      // resets the array to empty
      accounts.value.splice(0);
      const ens =
        network.value.type.hasOwnProperty('ens') && !isOfflineApp.value
          ? new ENS({
              provider: web3.value.eth.currentProvider,
              ensAddress: network.value.type.ens.registry
            })
          : null;
      for (
        let i = currentIdx.value;
        i < currentIdx.value + MAX_ADDRESSES;
        i++
      ) {
        const account = await props.handlerWallet.getAccount(i);
        const address = account.getAddressString();
        const ensName = ens
          ? await ens.getName(address)
          : {
              name: ''
            };
        const balance = isOfflineApp.value
          ? '0'
          : network.value.type.isEthVMSupported.supported
          ? 'Loading..'
          : await web3.value.eth.getBalance(address);
        const nickname = getNickname(address);
        accountsArray.push({
          address: address,
          account: account,
          idx: i,
          balance: balance !== 'Loading..' ? fromWei(balance) : balance,
          ensName: ensName.name ? ensName.name : '',
          nickname: nickname
        });
      }
      currentIdx.value += MAX_ADDRESSES;
      addressPage.value += 1;
      selectedAddress.value = accountsArray[0].address;
      accountAddress.value = accountsArray[0].address;
      accounts.value = accountsArray;
    } catch (e) {
      Toast(e, {}, ERROR);
    }
  }
};
const getNickname = address => {
  const checksummedAddress = toChecksumAddress(address);
  const isStored = addressBookStore.value.find(item => {
    const addressStored = item.resolvedAddr ? item.resolvedAddr : item.address;
    if (!isValidAddress(addressStored)) return;
    const storedAddr = toChecksumAddress(addressStored);
    if (storedAddr === checksummedAddress) {
      return item;
    }
  });
  return isStored
    ? isStored.resolvedAddr
      ? isStored.resolvedAddr
      : isStored.nickname
    : '';
};
/**
 * Methods generates previous derived addresses
 */
const nextAddressSet = () => {
  setAccounts();
};
/**
 * Methods generates previous derived addresses
 */
const previousAddressSet = () => {
  const pageDeductor = currentIdx.value / MAX_ADDRESSES;
  const idxDeductor = addressPage.value * MAX_ADDRESSES;
  addressPage.value -= currentIdx.value <= 10 ? pageDeductor : pageDeductor - 1;
  currentIdx.value -=
    currentIdx.value <= 10 ? idxDeductor : idxDeductor - MAX_ADDRESSES;
  setAccounts();
};
/**
 * Methods sets panelNetworkSubstring  based on the
 * @return {void}
 */
const setNetworkPanel = () => {
  panelNetworkSubstring.value = `${network.value.type.name} - ${network.value.type.name_long}`;
};
/**
 * Methods emits parent to unlock wallet
 * and passes selected wallet account
 * walletAccount should always be defined,
 * check in place if logic was compromised.
 */
const accessWallet = () => {
  if (walletAccount.value) {
    emits('unlock', walletAccount.value);
  }
};
const getExplorerLink = addr => {
  return blockExplorer.value.replace('[[address]]', addr);
};
</script>
<style lang="scss" scoped>
table {
  border-spacing: 0;
}

.table-header {
  text-align: start;
  background-color: #f0f0f0;
  p {
    color: #96a8b6;
    font-weight: bold;
    text-transform: uppercase;
    margin-bottom: 0px;
  }
}
.table-row-class {
  p {
    margin-bottom: 0px;
  }
}
.table-row-class:nth-child(odd) {
  background-color: #f9f9f9;
}
.balance-overflow {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>

<style lang="scss">
.custom-skeleton-loader {
  .v-skeleton-loader__avatar {
    height: 25px !important;
    width: 25px !important;
  }

  .v-skeleton-loader__list-item-avatar,
  .v-skeleton-loader__list-item {
    background-color: transparent !important;
    height: 25px !important;
  }
}
</style>
