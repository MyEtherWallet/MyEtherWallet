<template>
  <mew-overlay
    :footer="{
      text: 'Need help?',
      linkTitle: 'Contact support',
      link: 'mailto:support@myetherwallet.com'
    }"
    :title="title"
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
            {{ $t('interface.address-book.add-up-to') }}
          </div>

          <settings-address-table :table-data="tableData" @onClick="onEdit" />

          <div class="d-flex justify-center mt-5">
            <mew-button
              :disabled="addressBookStore.length >= 10"
              title="+ Add"
              btn-size="xlarge"
              @click.native="addMode = !addMode"
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

<script>
import { mapState, mapGetters } from 'vuex';
import { ROUTES_HOME, ROUTES_WALLET } from '@/core/configs/configRoutes';
import handlerSettings from './handler/handlerSettings';
import gasPriceMixin from './handler/gasPriceMixin';
import handlerAnalytics from '@/modules/analytics-opt-in/handlers/handlerAnalytics.mixin';
const modes = ['add', 'edit'];

export default {
  name: 'ModuleSettings',
  components: {
    SettingsAddressTable: () => import('./components/SettingsAddressTable'),
    SettingsImportConfig: () => import('./components/SettingsImportConfig'),
    SettingsExportConfig: () => import('./components/SettingsExportConfig'),
    SettingsGasPrice: () => import('./components/SettingsGasPrice'),
    AddressBookAddEdit: () =>
      import('@/modules/address-book/components/AddressBookAddEdit'),
    SettingsLocaleConfig: () => import('./components/SettingsLocaleConfig.vue')
  },
  mixins: [gasPriceMixin, handlerAnalytics],
  beforeRouteLeave(to, from, next) {
    if (to.name == ROUTES_HOME.ACCESS_WALLET.NAME) {
      next({ name: ROUTES_WALLET.DASHBOARD.NAME });
    } else {
      next();
    }
  },
  props: {
    onSettings: { default: false, type: Boolean }
  },
  data() {
    return {
      settingsHandler: null,
      idxToExpand: null,
      editMode: false,
      addMode: false,
      itemToEdit: {},
      tableData: []
    };
  },
  computed: {
    ...mapState('addressBook', ['addressBookStore']),
    ...mapState('global', ['online']),
    ...mapState('popups', ['consentToTrack']),
    ...mapGetters('wallet', ['hasGasPriceOption']),
    importPanel() {
      return `panelBody${!this.hasGasPriceOption ? 2 : 1}`;
    },
    exportPanel() {
      return `panelBody${!this.hasGasPriceOption ? 3 : 2}`;
    },
    addressBookPanel() {
      return `panelBody${!this.hasGasPriceOption ? 4 : 3}`;
    },
    localPanel() {
      return `panelBody${!this.hasGasPriceOption ? 5 : 4}`;
    },
    panelItems() {
      const txPriority = [
        {
          name: 'Transaction priority',
          toggleTitle: this.setPriority(this.gasPriceType)
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
      return this.hasGasPriceOption ? panels : txPriority.concat(panels);
    },
    onMode() {
      return this.addMode ? modes[0] : modes[1];
    },
    title() {
      if (this.addMode) {
        return this.$t('interface.address-book.add-addr');
      }
      if (this.editMode) {
        return this.$t('interface.address-book.edit');
      }
      return this.$t('common.settings');
    }
  },
  watch: {
    addressBookStore: {
      deep: true,
      handler: function () {
        this.getAddressBookTableData();
      }
    }
  },
  mounted() {
    this.getAddressBookTableData();
  },
  created() {
    this.settingsHandler = new handlerSettings();
  },
  methods: {
    getAddressBookTableData() {
      this.tableData = [];
      this.addressBookStore.forEach((item, idx) => {
        this.tableData.push({
          number: idx + 1,
          address: item.address,
          nickname: item.nickname,
          resolvedAddr: item.address.includes('.') ? item.resolvedAddr : null,
          callToAction: [
            {
              title: 'Edit',
              btnStyle: 'transparent',
              colorTheme: 'greenPrimary',
              method: this.onEdit
            }
          ]
        });
      });
    },
    back(idx) {
      if (!isNaN(idx)) {
        this.idxToExpand = idx ? idx : null;
      }
      if (idx instanceof PointerEvent) {
        this.idxToExpand = [3];
      }
      this.addMode = false;
      this.editMode = false;
    },
    onEdit(item) {
      this.editMode = !this.editMode;
      this.itemToEdit = item;
    },
    close() {
      this.$emit('closeSettings');
      this.idxToExpand = null;
      this.addMode = false;
      this.editMode = false;
    },
    exportStore() {
      this.settingsHandler.exportStore();
    },
    setPriority(priority) {
      const priorities = {
        economy: 'Normal',
        regular: 'Higher',
        fast: 'Highest'
      };
      return priorities[priority];
    }
  }
};
</script>

<style lang="scss">
.matomo-tracking-switch {
  .v-label {
    color: rgba(255, 255, 255, 0.6);
  }
}
</style>
