<template>
  <mew-overlay
    :show-overlay="onSettings"
    :close="close"
    :back="back"
    :left-btn-text="addMode || editMode ? $t('common.back') : ''"
    :right-btn-text="$t('common.close')"
  >
    <template #mewOverlayBody>
      <mew6-white-sheet
        v-if="!editMode && !addMode"
        class="pa-15 pt-4 modules--settings"
        style="max-width: 744px"
      >
        <div class="mew-subtitle text-center mb-10">{{ title }}</div>
        <mew-expand-panel
          has-dividers
          :panel-items="panelItems"
          :idx-to-expand="idxToExpand"
        >
          <template #panelBody1>
            <settings-gas-price
              class="pa-6"
              :buttons="gasButtons"
              :selected="gasPriceType"
              :set-selected="setSelected"
              :gas-price="gasPrice"
              :set-custom-gas-price="setCustomGasPrice"
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
      </mew6-white-sheet>
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
      <div class="mt-12">
        Need help?
        <a href="mailto:support@myetherwallet.com" target="_blank">
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
    ...mapState('global', ['addressBook']),
    panelItems() {
      return [
        {
          name: 'Gas price',
          subtext: `✔
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
          resolvedAddr: item.resolvedAddr,
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
      this.idxToExpand = idx ? idx : null;
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
.modules--settings {
  .mew-expand-panel .v-expansion-panel {
    margin-bottom: -1px !important;
    margin-top: 0px !important;
  }
}
</style>
