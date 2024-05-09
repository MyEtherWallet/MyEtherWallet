<template>
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
              {{ t('rns.search-domain') }}
            </div>
            <form @submit.prevent="findDomain">
              <v-row class="mx-0">
                <v-col class="pr-0" cols="8">
                  <mew-input
                    :value="name"
                    :has-clear-btn="true"
                    :rules="rules"
                    :label="t('rns.register.domain-name')"
                    :placeholder="t('rns.ph.three-char')"
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
                    :title="t('rns.register.name')"
                    @click.native="findDomain"
                  />
                </v-col>
              </v-row>
            </form>
          </div>
        </v-sheet>
      </template>

      =====================================================================================
      Reverse Lookup - Tab 2
      =====================================================================================
      -->
      <template #tabContent2>
        <v-sheet
          max-width="500px"
          color="transparent"
          class="px-3 py-8 py-md-13 mx-auto"
        >
          <div>
            <rns-reverse-lookup :address="address" :rns-manager="nameHandler" />
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
      :committed="committed"
      :minimum-age="minimumAge"
      :commit="commit"
      :no-funds-for-reg-fees="noFundsForRegFees"
      :commit-fee-in-eth="commitFeeInEth"
      :commit-fee-in-wei="commitFeeInWei"
      :commit-fee-usd="commitFeeUsd"
      :name="name"
      :checking-domain-avail="loading"
      :get-rent-price="getRentPrice"
      :waiting-for-reg="waitingForReg"
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
  defineEmits
} from 'vue';
import { ethers, BigNumber } from 'ethers';
import { setInterval } from 'timers';
import { useI18n } from 'vue-i18n-composable';
import { useRoute, useRouter } from 'vue-router/composables';

import { Toast, ERROR, SUCCESS } from '@/modules/toast/handler/handlerToast';
import { SUPPORTED_NETWORKS } from './handlers/helpers/supportedNetworks';
import { RNS_MANAGER_ROUTE } from './routes';
import normalise from '@/core/helpers/normalise';
import RNSManager from './handlers/handlerRNSManager';
import ReverseRegister from './handlers/helpers/reverseRegistrar';
import { useAmplitude } from '@/core/composables/amplitude';
import { useWalletStore } from '@/core/store/wallet';
import { useCustomStore } from '@/core/store/custom';

const TheWrapperDapp = defineAsyncComponent(() =>
  import('@/dapps/TheWrapperDapp.vue')
);
const ModuleRegisterDomain = defineAsyncComponent(() =>
  import('./modules/ModuleRegisterDomain')
);
const RnsReverseLookup = defineAsyncComponent(() =>
  import('./components/reverse/RnsReverseLookup')
);

// emits
const emit = defineEmits(['onRequest']);
// injections/use
const { trackDapp } = useAmplitude();
const route = useRoute();
const router = useRouter();
const { t } = useI18n();
const { address, web3, instance } = useWalletStore();
const { customTokens } = useCustomStore();

// data
const validNetworks = SUPPORTED_NETWORKS;
const headerImg = require('@/assets/images/icons/dapps/icon-dapp-rns.svg');
const header = {
  title: t('rns.title'),
  subtext: t('rns.dapp-desc')
};
const tabs = [
  {
    name: t('rns.register-domain'),
    route: { name: RNS_MANAGER_ROUTE.CORE.NAME },
    id: 0
  },
  {
    name: t('rns.my-domains'),
    route: {
      name: RNS_MANAGER_ROUTE.MANAGE.NAME,
      path: RNS_MANAGER_ROUTE.MANAGE.PATH
    },
    id: 1
  }
];
const name = ref('');
const regSecret = ref('');
const searchError = ref('');
const notEnoughFunds = ref(false);
const onRegister = ref(false);
const activeTab = ref(0);
const loadingCommit = ref(false);
const loadingReg = ref(false);
const committed = ref(false);
const minimumAge = ref('');
const noFundsForRegFees = ref(false);
const commitFeeInEth = ref('');
const domainPrice = ref('');
const commitFeeInWei = ref('0');
const commitFeeUsd = ref('0');
const waitingForReg = ref(true);
const nameHandler = ref({});
const reverseHandler = ref({});

// computed
const errorMessages = computed(() => {
  // if (domainTaken) return t('rns.domain-taken');
  return searchError;
});
const loading = computed(() => {
  return false;
});
const rules = computed(() => {
  return [
    searchError.value === '' || searchError.value,
    (name.value && name.value.length > 2) || t('rns.warning.not-enough-char'),
    !hasInvalidChars.value || t('rns.warning.invalid-symbol'),
    (name.value && name.value.split('.').length <= 2) ||
      t('rns.warning.invalid-symbol')
  ];
});
const hasInvalidChars = computed(() => {
  const letters = /^[0-9a-zA-Z_.-]+$/;
  if (!letters.test(name)) {
    return true;
  }
  return false;
});

// watch
watch(
  () => route,
  () => {
    detactUrlChangeTab();
  }
);

//
onMounted(() => {
  setup();
});

// methods
const setup = () => {
  const ethersProvider = new ethers.providers.Web3Provider(
    web3.currentProvider
  );
  const ethersSigner = ethersProvider.getSigner();
  nameHandler.value = new RNSManager(ethersSigner);
  reverseHandler.value = new ReverseRegister(ethersSigner);
};
const findDomain = async () => {
  try {
    const [name, domain] = name.split('.');

    if (domain !== 'rsk') {
      searchError.value =
        'Only .rsk names are supported. Please make sure to include ".rsk".';
      return;
    }

    if (name.length < 5) {
      searchError.value =
        'Domains with less than 5 characters are blocked. stay tuned, we are going to release them soon';
      return;
    }

    const available = await nameHandler.value.searchName(name);

    if (available) {
      onRegister.value = true;
    } else {
      searchError.value = 'Name not available';
    }
  } catch (e) {
    Toast(e, {}, ERROR);
  }
};
const detactUrlChangeTab = () => {
  const currentRoute = route.name;

  if (currentRoute === RNS_MANAGER_ROUTE.MANAGE.NAME) {
    activeTab.value = tabs[1].id;
  } else {
    activeTab.value = tabs[0].id;
  }
};
const tabChanged = tab => {
  activeTab.value = tab;
};
const closeRegister = () => {
  onRegister.value = false;
  committed.value = false;
  loadingCommit.value = false;
  loadingReg.value = false;
  name.value = '';
  router.push({ name: RNS_MANAGER_ROUTE.MANAGE.NAME });
  trackDapp('rnsCloseRegister');
};
const setName = locName => {
  searchError.value = '';
  try {
    name.value = normalise(locName);
  } catch (e) {
    searchError.value = e.message.includes('Failed to validate')
      ? 'Invalid name!'
      : e.message;
    name.value = locName;
  }
};
const register = async duration => {
  try {
    loadingReg.value = true;
    minimumAge.value = '90';
    // trigger loader
    loadingCommit.value = true;
    waitingForReg.value = true;

    const [label] = name.value.split('.');
    const address = instance.getAddressString();
    const registerTx = await nameHandler.value.rskRegistrar.register(
      label,
      address,
      regSecret.value,
      BigNumber.from(duration),
      domainPrice.value
    );
    await registerTx.wait();
    await reverseHandler.value.setReverseRecord(name, address);
    loadingReg.value = false;
    waitingForReg.value = false;

    closeRegister();
    trackDapp('rnsDomainsRegisterSuccess');
    Toast(`Registration successful!`, {}, SUCCESS);
  } catch (e) {
    trackDapp('rnsDomainRegisterFailed');
    Toast(e, {}, ERROR);
  }
};
const commit = async duration => {
  loadingCommit.value = true;
  minimumAge.value = '120';
  committed.value = false;
  waitingForReg.value = true;
  try {
    const address = instance.getAddressString();
    const [label] = name.value.split('.');

    const { makeCommitmentTransaction, secret, canReveal } =
      await nameHandler.value.rskRegistrar.commitToRegister(label, address);
    await makeCommitmentTransaction.wait();
    regSecret.value = secret;
    // Ref: https://github.com/rsksmart/rns-sdk
    // you need to wait at least for one minute, you can build
    // your own polling strategy checking canReveal to ensure
    // it is the correct time to submit the register tx
    let commitmentReady = await canReveal();
    const intervalId = setInterval(async () => {
      commitmentReady = await canReveal();
      if (commitmentReady) {
        if (intervalId && intervalId._id) {
          clearInterval(intervalId._id);
        } else {
          clearInterval(intervalId);
        }
        loadingCommit.value = false;
        committed.value = true;
        waitingForReg.value = false;
        emit('onRequest', duration);
      }
    }, 1000);
    setTimeout(() => {
      if (!commitmentReady) {
        throw 'failed to commit name registration';
      }
    }, 1000 * 10 * 60);
  } catch (e) {
    trackDapp('rnsDomainRegisterFailed');
    Toast(e, {}, ERROR);
  }
};
const getRentPrice = duration => {
  const token = customTokens.find(token => token.name === 'RIF');
  const [label] = name.value.split('.');
  trackDapp('rnsDomainInitializeRegister');
  return nameHandler.value.fetchPrice(label, duration).then(resp => {
    commitFeeInEth.value = resp.eth;
    domainPrice.value = resp.bn;

    if (token) {
      if (parseFloat(token.balancef) < parseFloat(resp.eth)) {
        notEnoughFunds.value = true;
      }
      commitFeeUsd.value = ((token.price || 0) * parseFloat(resp.eth)).toFixed(
        2
      );
    }

    return { usd: commitFeeUsd, rif: resp.eth };
  });
};
</script>
