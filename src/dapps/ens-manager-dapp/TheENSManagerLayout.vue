<template>
  <!--
    =====================================================================================
      ENS Manager Dapp Layout
    =====================================================================================
    -->
  <div>
    <the-wrapper-dapp
      :is-new-header="true"
      :dapp-img="headerImg"
      :banner-text="header"
      :tab-items="tabs"
      :active-tab="activeTab"
      external-contents
      :on-tab="tabChanged"
      :valid-networks="validNetworks"
    >
      <!--
    =====================================================================================
      Register Domain - Tab 1
    =====================================================================================
    -->
      <template #tabContent1>
        <v-sheet
          max-width="700px"
          color="transparent"
          class="px-3 py-8 py-md-13 mx-auto"
        >
          <div class="mb-5">
            <div class="mew-heading-2 mb-8 ml-2">
              {{ t('ens.search-domain') }}
            </div>
            <form @submit.prevent="findDomain">
              <v-row class="mx-0">
                <v-col class="pr-0" cols="8">
                  <mew-input
                    :value="name"
                    :has-clear-btn="true"
                    :rules="rules"
                    :label="t('ens.register.domain-name')"
                    :placeholder="t('ens.ph.three-char')"
                    class="mr-3 flex-grow-1"
                    :error-messages="errorMessages"
                    @input="setName"
                  />
                </v-col>
                <v-col class="pl-0" cols="4">
                  <mew-button
                    :loading="loading"
                    :disabled="
                      !name ||
                      (name && name.length < 3) ||
                      loading ||
                      (name && name.split('.').length > 2)
                    "
                    :has-full-width="true"
                    btn-size="xlarge"
                    :title="t('ens.register.name')"
                    @click.native="findDomain"
                  />
                </v-col>
              </v-row>
            </form>
          </div>
        </v-sheet>
      </template>
      <!--
    =====================================================================================
      Manage Domain - Tab 2
    =====================================================================================
    -->
      <template #tabContent2>
        <v-sheet
          max-width="700px"
          class="px-3 py-8 py-md-13 mx-auto"
          color="transparent"
        >
          <div class="d-flex align-center justify-space-between mb-7">
            <span class="mew-heading-2 font-weight-bold">
              {{ t('ens.my-domains') }}
              <span class="font-weight-regular">({{ totalDomains }})</span>
            </span>
          </div>
          <mew-expand-panel
            :idx-to-expand="null"
            class="my-domains-panel"
            :panel-items="myDomains"
            :right-action-text="t('ens.buy-domain')"
            @onActionClick="buyDomain"
          >
            <template
              v-for="(domain, idx) in myDomains"
              :slot="'panelBody' + (idx + 1)"
            >
              <div
                :key="idx"
                :class="[
                  domain.expired ? 'expired' : 'available',
                  'ma-3 px-2 px-sm-5'
                ]"
              >
                <v-row class="subheader-container">
                  <v-col cols="12" md="6" class="d-flex align-center">
                    <div>{{ t('ens.manage-domains.registrant') }}</div>
                    <mew-blockie
                      :address="domain.registrarAddress"
                      width="25px"
                      height="25px"
                      class="mx-2"
                    />
                    <mew-transform-hash :hash="domain.registrarAddress" />
                    <mew-copy
                      class="ml-2 mew-body"
                      :copy-value="domain.registrarAddress"
                      :is-small="true"
                    />
                    <a
                      class="address-link"
                      :href="
                        network.type.blockExplorerAddr.replace(
                          '[[address]]',
                          domain.registrarAddress
                        )
                      "
                      target="_blank"
                    >
                      <v-icon small class="call-made"> mdi-call-made </v-icon>
                    </a>
                  </v-col>

                  <v-spacer></v-spacer>

                  <v-col cols="12" md="6" class="d-flex align-center">
                    <div>{{ t('ens.manage-domains.controller') }}</div>
                    <mew-blockie
                      :address="domain.controllerAddress"
                      width="25px"
                      height="25px"
                      class="mx-2"
                    />
                    <mew-transform-hash :hash="domain.controllerAddress" />
                    <mew-copy
                      class="ml-2 mew-body"
                      :copy-value="domain.controllerAddress"
                      :is-small="true"
                    />
                    <a
                      class="address-link"
                      :href="
                        network.type.blockExplorerAddr.replace(
                          '[[address]]',
                          domain.controllerAddress
                        )
                      "
                      target="_blank"
                    >
                      <v-icon small class="call-made"> mdi-call-made </v-icon>
                    </a>
                  </v-col>
                </v-row>

                <div
                  class="d-flex align-center justify-space-between pb-5 pt-8 px-sm-7"
                >
                  <span class="mew-heading-3">
                    {{ t('ens.manage-domains.what-to-do') }}
                  </span>
                </div>
                <v-divider class="mx-7"></v-divider>
                <v-row class="pa-2 pa-sm-7">
                  <v-col
                    v-for="(option, key) in manageDomainOptions"
                    v-show="!domain.expired || key === 1"
                    :key="key"
                    cols="6"
                    sm="6"
                    md="4"
                    lg="2"
                  >
                    <div
                      class="text-center cursor-pointer"
                      @click="manage(option.type, idx)"
                    >
                      <v-icon color="greenPrimary" x-large>{{
                        option.icon
                      }}</v-icon>
                      <div>{{ option.label }}</div>
                      <div
                        v-if="domain.expiration && key === 1"
                        class="orange--text"
                      >
                        <div>
                          {{
                            t('ens.manage-domains.expire-on', {
                              date: domain.expiration
                            })
                          }}
                        </div>
                      </div>
                    </div>
                  </v-col>
                </v-row>
              </div>
            </template>
          </mew-expand-panel>
        </v-sheet>
      </template>
      <!--
    =====================================================================================
      Reverse Lookup - Tab 4
    =====================================================================================
    -->
      <template #tabContent3>
        <v-sheet
          max-width="500px"
          color="transparent"
          class="px-3 py-8 py-md-13 mx-auto"
        >
          <div>
            <ens-reverse-lookup
              :address="address"
              :ens-manager="ensManager"
              :name="name"
              :duration-pick="durationPick"
            />
          </div>
        </v-sheet>
      </template>
    </the-wrapper-dapp>
    <!--
    =====================================================================================
      Register Domain Overlay
    =====================================================================================
    -->
    <module-register-domain
      v-if="onRegister"
      ref="registerDomain"
      :on-register="onRegister"
      :close="closeRegister"
      :register="register"
      :not-enough-funds="notEnoughFunds"
      :loading-commit="loadingCommit"
      :loading-reg="loadingReg"
      :commited="committed"
      :minimum-age="minimumAge"
      :commit="commit"
      :no-funds-for-reg-fees="noFundsForRegFees"
      :commit-fee-in-eth="commitFeeInEth"
      :commit-fee-in-wei="commitFeeInWei"
      :commit-fee-usd="commitFeeUsd"
      :total-cost-usd="totalCostUsd"
      :total-cost="totalCost"
      :name="nameHandler.name"
      :parsed-host-name="nameHandler.parsedHostName"
      :checking-domain-avail="loading"
      :generate-key-phrase="generateKeyPhrase"
      :get-rent-price="getRentPrice"
      :waiting-for-reg="waitingForReg"
      @getCommitFeeOnly="getCommitFeeOnly"
    />
    <!--
    =====================================================================================
      Manage Domain Overlay
    =====================================================================================
    -->
    <module-manage-domain
      ref="manageDomain"
      :setting-ipfs="settingIpfs"
      :on-manage="onManage"
      :close="closeManage"
      :type="manageType"
      :transfer="transfer"
      :renew="renew"
      :no-funds-for-renewal-fees="noFundsForRenewalFees"
      :loading-renew="loadingRenew"
      :upload-file="uploadFile"
      :uploaded-hash="manageDomainHandler.contentHash"
      :set-text-records="setTextRecords"
      :set-multicoin="setMulticoin"
      :multicoin="manageDomainHandler.multiCoin"
      :text-records="manageDomainHandler.txtRecords"
      :set-ipfs="setIpfs"
      :host-name="manageDomainHandler.parsedHostName"
      :get-rent-price="getRentPrice"
      :get-total-renew-fee-only="getTotalRenewFeeOnly"
      :manage-domain-handler="manageDomainHandler"
    />
  </div>
</template>

<script setup>
import {
  defineAsyncComponent,
  ref,
  computed,
  watch,
  onMounted,
  onBeforeMount
} from 'vue';
import { fromWei, toBN, toWei } from 'web3-utils';
import { clone } from 'lodash';
import BigNumber from 'bignumber.js';
import ENS from '@ensdomains/ensjs';

import handlerEnsManager from './handlers/handlerEnsManager';
import normalise from '@/core/helpers/normalise';
import stripQuery from '@/core/helpers/stripQuery.js';
import { SUPPORTED_NETWORKS } from './handlers/helpers/supportedNetworks';
import { Toast, ERROR, SUCCESS } from '@/modules/toast/handler/handlerToast';
import { formatIntegerToString } from '@/core/helpers/numberFormatHelper';
import { ENS_MANAGER_ROUTE } from './configsRoutes';
import { useAmplitude } from '@/core/composables/amplitude';
import { useI18n } from 'vue-i18n-composable';
import { useGlobalStore } from '@/core/store/global';
import { useWalletStore } from '@/core/store/wallet';
import { useExternalStore } from '@/core/store/external';
import { useRoute, useRouter } from 'vue-router/composables';

const ModuleRegisterDomain = defineAsyncComponent(() =>
  import('./modules/ModuleRegisterDomain')
);
const ModuleManageDomain = defineAsyncComponent(() =>
  import('./modules/ModuleManageDomain')
);
const TheWrapperDapp = defineAsyncComponent(() =>
  import('@/dapps/TheWrapperDapp.vue')
);
const EnsReverseLookup = defineAsyncComponent(() =>
  import('./components/reverse/EnsReverseLookup')
);

// injections/use
const route = useRoute();
const { trackDapp } = useAmplitude();
const { t } = useI18n();
const { gasPrice, getFiatValue, network } = useGlobalStore();
const { balance, web3, instance, address } = useWalletStore();
const { fiatValue } = useExternalStore();
const router = useRouter();

// data
const validNetworks = SUPPORTED_NETWORKS;
const headerImg = require('@/assets/images/icons/dapps/icon-dapp-ensmanager.svg');
const header = {
  title: t('ens.title'),
  subtext: t('ens.dapp-desc')
};
const manageDomainOptions = [
  {
    label: t('ens.transfer-domain'),
    type: 'transfer',
    icon: 'mdi-account-arrow-right'
  },
  {
    label: t('ens.manage-domains.renew-domain'),
    type: 'renew',
    icon: 'mdi-autorenew'
  },
  {
    label: t('ens.manage-domains.manage-multi'),
    type: 'manageMulticoin',
    icon: 'mdi-link'
  },
  {
    label: t('ens.manage-domains.manage-txt'),
    type: 'manageTxtRecord',
    icon: 'mdi-book-open'
  },
  {
    label: t('ens.manage-domains.upload-site'),
    type: 'manageUpload',
    icon: 'mdi-cloud-upload'
  }
];
const tabs = [
  {
    name: t('ens.register-domain'),
    route: { name: ENS_MANAGER_ROUTE.CORE.NAME },
    id: 0
  },
  {
    name: t('ens.manage-domain'),
    route: {
      name: ENS_MANAGER_ROUTE.MANAGE.NAME,
      path: ENS_MANAGER_ROUTE.MANAGE.PATH
    },
    id: 1
  },
  {
    name: t('ENS Reverse Lookup'),
    route: {
      name: ENS_MANAGER_ROUTE.REVERSE.NAME,
      path: ENS_MANAGER_ROUTE.REVERSE.PATH
    },
    id: 2
  }
];
// reactive
const activeTab = ref(0);
const loadingCommit = ref(false);
const loadingReg = ref(false);
const loadingRenew = ref(false);
const minimumAge = ref('');
const committed = ref(false);
const settingIpfs = ref(false);
const manageDomainHandler = ref({});
const manageType = ref('');
const onManage = ref(false);
const name = ref('');
const nameHandler = ref({});
const ensManager = ref({});
const onRegister = ref(false);
const searchError = ref('');
const notEnoughFunds = ref(false);
const noFundsForRegFees = ref(false);
const noFundsForRenewalFees = ref(false);
const durationPick = ref('');
const commitFeeInEth = ref('');
const commitFeeInWei = ref('0');
const commitFeeUsd = ref('0');
const renewalInEth = ref('');
const renewalInWei = ref('');
const renewalInUsd = ref('0');
const regFee = ref('0');
const totalCost = ref('0');
const totalCostUsd = ref('0');
const waitingForReg = ref(true);
const myDomains = ref([]);
const oldTxtRecords = ref({});

// computed
const errorMessages = computed(() => {
  if (domainTaken.value) return t('ens.domain-taken');
  return searchError.value;
});
const rules = computed(() => {
  return [
    searchError.value === '' || searchError,
    (name.value && name.value.length > 2) || t('ens.warning.not-enough-char'),
    !hasInvalidChars.value || t('ens.warning.invalid-symbol'),
    (name.value && name.value.split('.').length <= 2) ||
      t('ens.warning.invalid-symbol')
  ];
});
const hasInvalidChars = computed(() => {
  const letters = /^[0-9a-zA-Z_.-]+$/;
  if (!letters.test(name.value)) {
    return true;
  }
  return false;
});
const balanceToWei = computed(() => {
  return toWei(BigNumber(balance.value).toString(), 'ether');
});
const loading = computed(() => {
  return nameHandler.value?.checkingDomainAvail;
});
const ensDomainAvailable = computed(() => {
  return nameHandler.value?.isAvailable;
});
const isNameEmpty = computed(() => {
  return name.value === null || name.value === '';
});
const domainTaken = computed(() => {
  return (
    !isNameEmpty.value &&
    !loading.value &&
    !ensDomainAvailable.value &&
    Object.keys(nameHandler.value).length !== 0
  );
});
const totalDomains = computed(() => {
  return formatIntegerToString(myDomains.value.length);
});

// watch
watch(
  () => ensDomainAvailable,
  newVal => {
    if (newVal === true) {
      onRegister.value = true;
    }
  }
);
/*
    - watches for address state change
    - updates ensManager with new address
    - if user is onRegister it will reset and take them back
    - if user is onManage it will run getDomain to refresh domains
    */
watch(
  () => address.value,
  newVal => {
    if (newVal) {
      ensManager.value.address = newVal;
      if (onRegister.value) {
        closeRegister();
      }
      getDomains();
    }
  }
);
/*
    - watches for network change
    - updates ensManager with new network
    - if user is onRegister it will reset and take them back
    - if user is onManage it will run getDomain to refresh domains
    */
watch(
  () => network.value,
  () => {
    if (checkNetwork()) {
      setup();
      getDomains();
    }
    if (onRegister.value) {
      closeRegister();
    }
  }
);
watch(
  () => route,
  () => {
    detactUrlChangeTab();
  }
);

// beforeMount
onBeforeMount(() => {
  setTokenFromURL();
});

// mount
onMounted(() => {
  /**
   * Check url and change tab on load
   */
  detactUrlChangeTab();
  if (checkNetwork()) {
    setup();
    getDomains();
  }
});

// methods
const checkNetwork = () => {
  return validNetworks.find(
    item => item.chainID === network.value.type.chainID
  );
};
const setup = () => {
  const ens = network.value.type.ens
    ? new ENS({
        provider: web3.value.eth.currentProvider,
        ensAddress: network.value.type.ens.registry
      })
    : null;
  ensManager.value = new handlerEnsManager(
    network.value,
    address.value,
    web3.value,
    ens,
    gasPrice.value
  );
};
const detactUrlChangeTab = () => {
  const currentRoute = route.name;
  if (currentRoute === ENS_MANAGER_ROUTE.MANAGE.NAME) {
    activeTab.value = tabs[1].id;
  } else if (currentRoute === ENS_MANAGER_ROUTE.REVERSE.NAME) {
    activeTab.value = tabs[2].id;
  } else {
    activeTab.value = tabs[0].id;
  }
};
const tabChanged = tab => {
  activeTab.value = tab;
};
const setTokenFromURL = () => {
  if (Object.keys(route.query).length > 0) {
    const { active } = stripQuery(route.query);
    activeTab.value = BigNumber(active).toNumber();
  }
};
const buyDomain = () => {
  activeTab.value = 0;
  trackDapp('ensBuyDomainTab');
};
/**
 * Manage Domain
 */
const manage = (type, idx) => {
  onManage.value = true;
  manageType.value = type;
  manageDomainHandler.value = myDomains.value[idx];
  oldTxtRecords.value = clone(myDomains.value[idx].txtRecords);
};
const getDomains = () => {
  ensManager.value
    .getAllNamesForAddress()
    .then(res => {
      res.forEach(domain => {
        domain.hasActiveBorder = !domain.expired;
        domain.disabled = domain.expired;
        domain.colorTheme = domain.expired ? 'redMedium' : 'greyLight';
        domain.warningBadge = domain.expired
          ? {
              color: 'redPrimary',
              text: t('ens.expired')
            }
          : '';
      });
      myDomains.value = res;
    })
    .catch(err => {
      Toast(err, {}, ERROR);
    });
};
const closeManage = () => {
  onManage.value = false;
  settingIpfs.value = false;
  trackDapp('ensCloseManageTab');
};
const transfer = addr => {
  trackDapp('ensDomainTransferEvent');
  manageDomainHandler.value
    .transfer(addr)
    .then(() => {
      setTimeout(() => {
        getDomains();
      }, 15000);
      trackDapp('ensTransferred');
    })
    .catch(err => {
      instance.errorHandler(err.message ? err.message : err);
    });
  closeManage();
};

const getTotalRenewFeeOnly = async duration => {
  loadingRenew.value = true;
  const renewFeeOnly = await manageDomainHandler.value.totalRenewCost(duration); // ETH
  if (!renewFeeOnly) {
    noFundsForRenewalFees.value = true;
  } else {
    renewalInEth.value = renewFeeOnly;
    renewalInWei.value = toWei(renewFeeOnly);
    renewalInUsd.value = new BigNumber(renewalInEth.value)
      .times(fiatValue.value)
      .toFixed(2);
    if (toBN(renewalInWei).gte(balance.value)) {
      // commit fee vs current user balance.value in wei
      noFundsForRenewalFees.value = true;
    } else {
      noFundsForRenewalFees.value = false;
    }
  }
  loadingRenew.value = false;
};

const renew = duration => {
  manageDomainHandler.value
    .renew(duration, balanceToWei.value)
    .then(() => {
      getDomains();
      trackDapp('ensDomainRenew');
    })
    .catch(err => {
      instance.errorHandler(err.message ? err.message : err);
    });
  closeManage();
};
const setMulticoin = coin => {
  manageDomainHandler.value
    .setMulticoin(coin)
    .then(getDomains)
    .catch(err => {
      instance.errorHandler(err.message ? err.message : err);
    });
  closeManage();
};
const setTextRecords = records => {
  manageDomainHandler.value
    .setTxtRecord(records)
    .then(getDomains)
    .catch(err => {
      manageDomainHandler.value.txtRecords = oldTxtRecords;
      instance.errorHandler(err.message ? err.message : err);
    });
  closeManage();
};
const uploadFile = file => {
  settingIpfs.value = true;
  manageDomainHandler.value
    .uploadFile(file)
    .then(res => {
      manageDomainHandler.value.setIPFSHash(res);
      trackDapp('ensFileUpload');
    })
    .then(() => {
      settingIpfs.value = false;
      closeManage();
    })
    .catch(err => {
      instance.errorHandler(err.message ? err.message : err);
    });
};
const setIpfs = hash => {
  settingIpfs.value = true;
  manageDomainHandler.value
    .setIPFSHash(hash)
    .then(() => {
      settingIpfs.value = false;
      trackDapp('ensSetIpfs');
    })
    .catch(err => {
      instance.errorHandler(err.message ? err.message : err);
    });
  closeManage();
};
const findDomain = async () => {
  try {
    nameHandler.value = await ensManager.value.searchName(name);
    trackDapp('ensFindDomain');
  } catch (e) {
    Toast(e, {}, ERROR);
  }
};
const closeRegister = () => {
  onRegister.value = false;
  committed.value = false;
  loadingCommit.value = false;
  loadingReg.value = false;
  name.value = '';
  minimumAge.value = '';
  nameHandler.value = {};
  router.push({ name: ENS_MANAGER_ROUTE.ENS_MANAGER.NAME });
  trackDapp('ensCloseRegister');
};
const setName = passedName => {
  searchError.value = '';
  if (passedName === null || passedName === '') {
    nameHandler.value = {};
  }
  try {
    name.value = normalise(passedName);
  } catch (e) {
    searchError.value = e.message.includes('Failed to validate')
      ? 'Invalid name!'
      : e.message;
    name.value = passedName;
  }
};
const register = duration => {
  trackDapp('ensDomainRegisterEvent');
  return nameHandler.value
    .register(duration, balanceToWei)
    .on('transactionHash', () => {
      Toast(`Registering ENS name: ${name.value}`, {}, SUCCESS);
      loadingReg.value = true;
    })
    .once('receipt', () => {
      setTimeout(() => {
        getDomains();
      }, 15000);
      trackDapp('ensDomainRegisterSuccess');
      Toast(`Registration successful!`, {}, SUCCESS);
    })
    .on('error', () => {
      loadingReg.value = false;
      trackDapp('ensDomainRegisterFail');
      Toast(`Registering ENS name: ${name.value} failed`, {}, ERROR);
    });
};
const commit = () => {
  let waitingTime;
  trackDapp('ensDomainCommitEvent');
  nameHandler.value
    .createCommitment(durationPick)
    .on('transactionHash', () => {
      nameHandler.value.getMinimumAge().then(resp => {
        minimumAge.value = resp;
        waitingTime = parseInt(resp);
      });
    })
    .on('receipt', () => {
      loadingCommit.value = true;
      committed.value = false;
      waitingForReg.value = true;
      trackDapp('ensDomainCommittReceipt');
      setTimeout(() => {
        committed.value = true;
        waitingForReg.value = false;
        getTotalCost(); //calling total cost for regfees
      }, waitingTime * 1000);
    })
    .on('error', err => {
      loadingCommit.value = false;
      committed.value = false;
      waitingForReg.value = false;
      notEnoughFunds.value = false;
      trackDapp('ensDomainRegisterFail');
      Toast(err, {}, ERROR);
    });
};

const getCommitFeeOnly = async () => {
  trackDapp('ensDomainInitializeRegister');
  const commitFeeOnly = await nameHandler.value.getCommitmentFees(
    durationPick.value
  ); // ETH
  commitFeeInEth.value = commitFeeOnly.toString();
  commitFeeInWei.value = toWei(commitFeeOnly);
  commitFeeUsd.value = getFiatValue(
    new BigNumber(commitFeeInEth.value).times(fiatValue.value).toFixed(2)
  );
  if (toBN(commitFeeInWei.value).gte(balance.value)) {
    // commit fee vs current user balance.value in wei
    notEnoughFunds.value = true;
  } else {
    notEnoughFunds.value = false;
  }
};

const getTotalCost = async () => {
  const registerFeesOnly = await nameHandler.value.getRegFees(
    durationPick.value,
    balance.value
  );
  if (!registerFeesOnly) {
    noFundsForRegFees.value = true;
  } else {
    regFee.value = registerFeesOnly;
    const feesAdded = new BigNumber(regFee.value).plus(commitFeeInEth.value);
    totalCost.value = feesAdded.toString();
    totalCostUsd.value = getFiatValue(
      new BigNumber(totalCost.value).times(fiatValue.value).toFixed(2)
    );
    if (totalCost.value >= balance.value) {
      noFundsForRegFees.value = true;
    } else {
      noFundsForRegFees.value = false;
    }
  }
  loadingCommit.value = false;
};

const generateKeyPhrase = () => {
  if (nameHandler.value.generateKeyPhrase) {
    nameHandler.value.generateKeyPhrase();
  }
};

const getRentPrice = duration => {
  durationPick.value = duration;
  const handler = onManage.value
    ? manageDomainHandler.value
    : nameHandler.value;
  return handler.getRentPrice(durationPick.value).then(resp => {
    if (resp) {
      const ethValue = fromWei(resp);
      return {
        wei: resp,
        eth: ethValue,
        usd: new BigNumber(ethValue).times(fiatValue.value).toFixed(2)
      };
    }
  });
};
</script>

<style lang="scss" scoped>
.my-domains-panel {
  .active-border {
    .subheader-container {
      background-color: var(--v-greyLight-base);
      div {
        max-width: 400px;
      }
    }
  }
}
</style>
