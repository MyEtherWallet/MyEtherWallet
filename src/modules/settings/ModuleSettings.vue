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
            <import-config />
          </template>
          <template #panelBody3>
            <export-config />
          </template>
          <template #panelBody4>
            <div class="pb-4">
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
          <template #panelBody5>
            <notifications />
          </template>
        </mew-expand-panel>
      </v-sheet>
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
    </template>
  </mew-overlay>
</template>

<script>
import ImportConfig from './components/SettingsImportConfig';
import ExportConfig from './components/SettingsExportConfig';
import Notifications from './components/SettingsNotification';
import GasPrice from './components/SettingsGasPrice';
import AddressBookAddEdit from '@/modules/address-book/components/AddressBookAddEdit';
import { mapState } from 'vuex';

const modes = ['add', 'edit'];

export default {
  name: 'Settings',
  components: {
    ImportConfig,
    ExportConfig,
    Notifications,
    GasPrice,
    AddressBookAddEdit
  },
  props: {
    onSettings: { default: false, type: Boolean }
  },
  data() {
    return {
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
      ],
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
  methods: {
    getAddressBookTableData() {
      this.tableData = [];
      this.addressBook.forEach((item, idx) => {
        this.tableData.push({
          number: idx + 1,
          address: item.address,
          nickname: item.nickname,
          resolvedAddr: item.resolvedAddr,
          callToAction: 'Edit'
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
    }
  }
};
</script>
