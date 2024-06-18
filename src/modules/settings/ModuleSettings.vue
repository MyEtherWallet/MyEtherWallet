<template>
  <mew-overlay
    :footer="footerTitle"
    :title="computedTitle"
    :show-overlay="onSettings"
    :back="editMode || addMode ? back : null"
    content-size="xlarge"
    :close="close"
    class="py-10"
  >
    <mew-expand-panel
      v-if="!editMode && !addMode"
      :panel-items="panelItems"
      :idx-to-expand="idxToExpand"
      class="mt-6"
    >
      <template v-if="!hasGasPriceOption" #panelBody1>
        <div class="px-5">
          <settings-gas-price
            :buttons="gasButtons"
            :selected="gasPriceType"
            :set-selected="setSelected"
            :global="true"
            :from-settings="true"
          />
        </div>
      </template>
      <template #[importPanel]>
        <settings-import-config :import-config="settingsHandler" />
      </template>
      <template #[exportPanel]>
        <settings-export-config :export-config="exportStore" />
      </template>
      <template #[addressBookPanel]>
        <div class="pa-6">
          <div class="mb-4">
            {{ t('interface.address-book.add-up-to') }}
          </div>

          <settings-address-table :table-data="tableData" @onClick="onEdit" />

          <div class="d-flex justify-center mt-5">
            <mew-button
              :disabled="addressBookStore.length >= 10"
              title="+ Add"
              btn-size="xlarge"
              @click.native="toggleAddMode"
            />
          </div>
        </div>
      </template>
      <template #[localPanel]>
        <settings-locale-config />
      </template>
      <!-- <template #panelBody5>
        <notifications />
      </template> -->
    </mew-expand-panel>
    <!--
    =====================================================================================
      Consent to Data Sharing slider
    =====================================================================================
    -->
    <div v-if="online && !addMode && !editMode" class="mt-3 px-8">
      <div class="matomo-tracking-switch">
        <v-switch
          :label="`Data tracking ${consentToTrack ? 'On' : 'Off'}`"
          :input-value="consentToTrack"
          inset
          color="greenPrimary"
          off-icon="mdi-alert-circle"
          @change="setConsent"
        />
      </div>
    </div>
    <!--
    =====================================================================================
      Add / Edit Address Book overlay
    =====================================================================================
    -->
    <address-book-add-edit
      v-if="addMode || editMode"
      class="mt-4 mt-lg-0"
      :item="itemToEdit"
      :mode="onMode"
      @back="back"
    />
  </mew-overlay>
</template>
<script setup>
import { ref, computed, watch, onMounted, onBeforeMount } from 'vue';
import { useI18n } from 'vue-i18n-composable';
import { onBeforeRouteLeave } from 'vue-router';

import { ROUTES_HOME, ROUTES_WALLET } from '@/core/configs/configRoutes';
import handlerSettings from './handler/handlerSettings';
import { useGasPrice } from '@/core/composables/gasPrice';
import { useGlobalStore } from '@/core/store/global';
import { useWalletStore } from '@/core/store/wallet';
import { useAmplitude } from '@/core/composables/amplitude';
import { useAddressBookStore } from '@/core/store/addressBook';
import { usePopupStore } from '@/core/store/popups';

import SettingsAddressTable from './components/SettingsAddressTable';
import SettingsImportConfig from './components/SettingsImportConfig';
import SettingsExportConfig from './components/SettingsExportConfig';
import SettingsGasPrice from './components/SettingsGasPrice';
import AddressBookAddEdit from '@/modules/address-book/components/AddressBookAddEdit';
import SettingsLocaleConfig from './components/SettingsLocaleConfig.vue';

import { MODES } from '@/core/configs/commons';
// emit
const emit = defineEmits(['closeSettings']);

// props
defineProps({ onSettings: { default: false, type: Boolean } });

// injections/use
const { setConsent } = useAmplitude();
const { gasButtons, setSelected } = useGasPrice();
const { online, gasPriceType } = useGlobalStore();
const { consentToTrack } = usePopupStore();
const { hasGasPriceOption } = useWalletStore();
const { addressBookStore } = useAddressBookStore();
const { t } = useI18n();

// data
const settingsHandler = ref(null);
const idxToExpand = ref(null);
const editMode = ref(false);
const addMode = ref(false);
const itemToEdit = ref({});
const tableData = ref([]);

// computed
const footerTitle = computed(() => {
  return {
    text: 'Need help?',
    linkTitle: 'Contact support',
    link: 'mailto:support@myetherwallet.com'
  };
});
const importPanel = computed(() => {
  return `panelBody${!hasGasPriceOption.value ? 2 : 1}`;
});
const exportPanel = computed(() => {
  return `panelBody${!hasGasPriceOption.value ? 3 : 2}`;
});
const addressBookPanel = computed(() => {
  return `panelBody${!hasGasPriceOption.value ? 4 : 3}`;
});
const localPanel = computed(() => {
  return `panelBody${!hasGasPriceOption.value ? 5 : 4}`;
});
const panelItems = computed(() => {
  const txPriority = [
    {
      name: 'Transaction priority',
      toggleTitle: setPriority(gasPriceType.value)
    }
  ];
  const panels = [
    {
      name: 'Import configurations'
    },
    {
      name: 'Export configurations'
    },
    {
      name: 'Contact addresses'
    },
    {
      name: 'Currency settings'
    }
  ];
  return hasGasPriceOption.value ? panels : txPriority.concat(panels);
});
const onMode = computed(() => {
  return addMode.value ? MODES[0] : MODES[1];
});
const computedTitle = computed(() => {
  if (addMode.value) {
    return t('interface.address-book.add-addr');
  }
  if (editMode.value) {
    return t('interface.address-book.edit');
  }
  return t('common.settings');
});

// watch
watch(
  () => addressBookStore,
  () => {
    getAddressBookTableData();
  },
  { deep: true }
);

// created
onBeforeMount(() => {
  settingsHandler.value = new handlerSettings();
});

onBeforeRouteLeave((to, from, next) => {
  if (to.name == ROUTES_HOME.ACCESS_WALLET.NAME) {
    next({ name: ROUTES_WALLET.DASHBOARD.NAME });
  } else {
    next();
  }
});

// mounted
onMounted(() => {
  getAddressBookTableData();
});

// methods
const getAddressBookTableData = () => {
  tableData.value = [];
  addressBookStore.value.forEach((item, idx) => {
    tableData.value.push({
      number: idx + 1,
      address: item.address,
      nickname: item.nickname,
      resolvedAddr: item.address.includes('.') ? item.resolvedAddr : null,
      callToAction: [
        {
          title: 'Edit',
          btnStyle: 'transparent',
          colorTheme: 'greenPrimary',
          method: onEdit
        }
      ]
    });
  });
};

const toggleAddMode = () => {
  addMode.value = !addMode.value;
};

const back = idx => {
  if (!isNaN(idx)) {
    idxToExpand.value = idx ? idx : null;
  }
  if (idx instanceof PointerEvent) {
    idxToExpand.value = [3];
  }
  addMode.value = false;
  editMode.value = false;
};
const onEdit = item => {
  editMode.value = !editMode.value;
  itemToEdit.value = item;
};
const close = () => {
  emit('closeSettings');
  idxToExpand.value = null;
  addMode.value = false;
  editMode.value = false;
};
const exportStore = () => {
  settingsHandler.value.exportStore();
};
const setPriority = priority => {
  const priorities = {
    economy: 'Normal',
    regular: 'Higher',
    fast: 'Highest'
  };
  return priorities[priority];
};
</script>

<style lang="scss">
.matomo-tracking-switch {
  .v-label {
    color: rgba(255, 255, 255, 0.6);
  }
}
</style>
