<template>
  <mew-overlay
    :title="title"
    :show-overlay="onSettings"
    :close="close"
    :back="back"
    :left-btn-text="addMode || editMode ? $t('common.back') : ''"
    :right-btn-text="$t('common.close')"
  >
    <template #mewOverlayBody>
      <v-sheet
        v-if="!editMode && !addMode"
        class="mt-5"
        max-width="700"
        color="transparent"
      >
        <mew-expand-panel
          :panel-items="panelItems"
          :idx-to-expand="idxToExpand"
        >
          <template #panelBody1>
            <gas-price />
          </template>
          <template #panelBody2>
            <import-config :import-config="settingsHandler" />
          </template>
          <template #panelBody3>
            <export-config :export-config="settingsHandler.exportStore" />
          </template>
          <template #panelBody4>
            <address-book @add="addMode = !addMode" @edit="onEdit" />
          </template>
          <!-- <template #panelBody5>
            <notifications />
          </template> -->
        </mew-expand-panel>
      </v-sheet>
      <!-- add and edit the address book -->
      <add-edit-address
        v-if="addMode || editMode"
        :item="itemToEdit"
        :mode="getMode"
        @back="back"
      />
    </template>
  </mew-overlay>
</template>

<script>
import ImportConfig from './components/SettingsImportConfig';
import ExportConfig from './components/SettingsExportConfig';
// import Notifications from './components/SettingsNotification';
import GasPrice from './components/SettingsGasPrice';
import AddressBook from '@/modules/address-book/ModuleAddressBook';
import AddEditAddress from '@/modules/address-book/components/AddressBookAddEdit';
import SettingsHandler from './handler/handlerSettings';
const modes = ['add', 'edit'];

export default {
  name: 'Settings',
  components: {
    ImportConfig,
    ExportConfig,
    // Notifications,
    GasPrice,
    AddressBook,
    AddEditAddress
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
      panelItems: [
        {
          name: 'Gas price',
          subtext: '1 Gwei (Economic)'
        },
        {
          name: 'Import configurations'
        },
        {
          name: 'Export configurations'
        },
        {
          name: 'Contact Address'
        },
        {
          name: 'Notifications'
        }
      ]
    };
  },
  computed: {
    getMode() {
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
  created() {
    this.settingsHandler = new SettingsHandler();
  },
  methods: {
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
    }
  }
};
</script>
