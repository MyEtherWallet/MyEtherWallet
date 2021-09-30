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
  >
    <template #mewOverlayBody>
      <mew6-white-sheet
        style="max-width: 744px"
        class="pt-1 pb-12 px-12 module--settings-module-settings"
      >
        <div class="mew-subtitle text-center mb-7">{{ title }}</div>

        <div v-if="!editMode && !addMode">
          <mew-expand-panel
            :panel-items="panelItems"
            :idx-to-expand="idxToExpand"
            has-dividers
          >
            <template #panelBody1>
              <settings-gas-price
                class="px-6 mb-10"
                :buttons="gasButtons"
                :selected="gasPriceType"
                :set-selected="setSelected"
                :gas-price="gasPrice"
                :global="true"
              />
            </template>
            <template #panelBody2>
              <settings-import-config :import-config="settingsHandler" />
            </template>
            <template #panelBody3>
              <settings-export-config :export-config="exportStore" />
            </template>
            <template #panelBody4>
              <div class="pa-6">
                <div class="mb-4">
                  {{ $t('interface.address-book.add-up-to') }}
                </div>
                <mew-table
                  :table-headers="tableHeaders"
                  :table-data="tableData"
                  has-color
                  :success-toast="$t('common.copied')"
                  @onClick="onEdit"
                />

                <div class="d-flex justify-center mt-5">
                  <mew-button
                    :disabled="addressBook.length > 10"
                    title="+ Add"
                    btn-size="xlarge"
                    @click.native="addMode = !addMode"
                  />
                </div>
              </div>
            </template>
            <!-- <template #panelBody5>
            <notifications />
          </template> -->
          </mew-expand-panel>
        </div>
        <!--
        =====================================================================================
        Add / Edit Address Book overlay
        =====================================================================================
        -->
        <address-book-add-edit
          v-if="addMode || editMode"
          :item="itemToEdit"
          :mode="onMode"
          @back="back"
        />
      </mew6-white-sheet>

      <div class="mt-10">
        Need help?
        <a
          href="mailto:support@myetherwallet.com"
          target="_blank"
          class="font-weight-medium"
        >
          Contact support
        </a>
      </div>
    </template>
  </mew-overlay>
</template>

<script>
import { gasPriceTypes } from '@/core/helpers/gasPriceHelper';
import SettingsImportConfig from './components/SettingsImportConfig';
import SettingsExportConfig from './components/SettingsExportConfig';
import SettingsGasPrice from './components/SettingsGasPrice';
import AddressBookAddEdit from '@/modules/address-book/components/AddressBookAddEdit';
import handlerSettings from './handler/handlerSettings';
import { mapState } from 'vuex';
import gasPriceMixin from './handler/gasPriceMixin';
import { ROUTES_HOME, ROUTES_WALLET } from '@/core/configs/configRoutes';
const modes = ['add', 'edit'];

export default {
  name: 'Settings',
  components: {
    SettingsImportConfig,
    SettingsExportConfig,
    SettingsGasPrice,
    AddressBookAddEdit
  },
  mixins: [gasPriceMixin],
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
      tableHeaders: [
        {
          text: '#',
          value: 'number',
          sortable: false,
          filterable: false,
          width: '5%'
        },
        {
          text: 'Address',
          value: 'address',
          sortable: false,
          filterable: false,
          width: '50%'
        },
        {
          text: 'Nickname',
          value: 'nickname',
          sortable: false,
          filterable: false,
          containsLink: true,
          width: '20%'
        },
        {
          text: '',
          value: 'callToAction',
          sortable: false,
          filterable: false,
          width: '20%'
        }
      ],
      tableData: []
    };
  },
  computed: {
    ...mapState('custom', ['addressBook']),
    panelItems() {
      return [
        {
          name: 'Default transaction priority',
          subtext: `
          ${
            this.gasPriceType === gasPriceTypes.ECONOMY ? 'Normal priority' : ''
          }
          ${
            this.gasPriceType === gasPriceTypes.REGULAR ? 'Higher priority' : ''
          }
          ${this.gasPriceType === gasPriceTypes.FAST ? 'Highest priority' : ''}`
        },
        {
          name: 'Import configurations'
        },
        {
          name: 'Export configurations'
        },
        {
          name: 'Contact addresses'
        }
      ];
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
    addressBook: {
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
      this.addressBook.forEach((item, idx) => {
        this.tableData.push({
          number: idx + 1,
          address: item.address,
          nickname: item.nickname,
          resolvedAddr: item.address.includes('.') ? item.resolvedAddr : null,
          callToAction: [
            {
              title: 'Edit',
              btnStyle: 'transparent',
              colorTheme: 'primary',
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
    }
  }
};
</script>

<style lang="scss">
.module--settings-module-settings {
  .v-expansion-panel {
    margin-top: 0px !important;
    margin-bottom: -1px !important;
  }
}
</style>
