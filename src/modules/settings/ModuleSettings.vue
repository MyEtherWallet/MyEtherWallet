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
            <settings-gas-price
              :buttons="gasButtons"
              :selected="gasPriceType"
              :set-selected="setSelected"
              :gas-price="gasPrice"
              :set-custom-gas-price="setCustomGasPrice"
            />
          </template>
          <template #panelBody2>
            <settings-import-config :import-config="settingsHandler" />
          </template>
          <template #panelBody3>
            <settings-export-config
              :export-config="settingsHandler.exportStore"
            />
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
import SettingsImportConfig from './components/SettingsImportConfig';
import SettingsExportConfig from './components/SettingsExportConfig';
import SettingsGasPrice from './components/SettingsGasPrice';
import AddressBookAddEdit from '@/modules/address-book/components/AddressBookAddEdit';
import handlerSettings from './handler/handlerSettings';
import { mapGetters, mapState, mapActions } from 'vuex';
import { SENTRY, Toast } from '../toast/handler/handlerToast';
import {
  getGasBasedOnType,
  gasPriceTypes
} from '@/core/helpers/gasPriceHelper';
const modes = ['add', 'edit'];

export default {
  name: 'Settings',
  components: {
    SettingsImportConfig,
    SettingsExportConfig,
    SettingsGasPrice,
    AddressBookAddEdit
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
      localGas: null,
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
    ...mapState('global', ['gasPriceType', 'addressBook']),
    ...mapState('wallet', ['web3']),
    ...mapGetters('global', ['gasPrice']),
    gasButtons() {
      const utils = this.web3.utils;
      const economy = this.localGas
        ? utils.fromWei(
            getGasBasedOnType(this.localGas, gasPriceTypes.ECONOMY),
            'gwei'
          )
        : 0;
      const regular = this.localGas
        ? utils.fromWei(
            getGasBasedOnType(this.localGas, gasPriceTypes.REGULAR),
            'gwei'
          )
        : 0;
      const fast = this.localGas
        ? utils.fromWei(
            getGasBasedOnType(this.localGas, gasPriceTypes.FAST),
            'gwei'
          )
        : 0;
      return [
        {
          icon: 'bicycle',
          title: gasPriceTypes.ECONOMY,
          gas: `${economy}`
          // usd: '$0.004',
          // time: '< 30 min'
        },
        {
          icon: 'car',
          title: gasPriceTypes.REGULAR,
          gas: `${regular}`
          // usd: '$0.008',
          // time: '< 10 min'
        },
        {
          icon: 'rocket',
          title: gasPriceTypes.FAST,
          gas: `${fast}`
          // usd: '$0.012',
          // time: '< 5 min'
        }
      ];
    },
    panelItems() {
      return [
        {
          name: 'Gas price',
          subtext: `${this.web3.utils.fromWei(this.gasPrice, 'gwei')} Gwei (${
            this.gasPriceType
          })`
        },
        {
          name: 'Import configurations'
        },
        {
          name: 'Export configurations'
        },
        {
          name: 'Contact Addresses'
        }
        // {
        //   name: 'Notifications'
        // }
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
    },
    onSettings(newVal) {
      if (newVal) {
        this.fetchGasPrice();
      }
    }
  },
  mounted() {
    this.getAddressBookTableData();
  },
  created() {
    this.settingsHandler = new handlerSettings();
    this.fetchGasPrice();
  },
  methods: {
    ...mapActions('global', ['setGasPrice', 'setGasPriceType']),
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
    setSelected(selected) {
      try {
        this.setGasPrice(this.localGas).then(() => {
          this.setGasPriceType(selected);
        });
      } catch (e) {
        console.log(e); // todo remove dev item
        Toast(e, {}, SENTRY);
      }
    },
    setCustomGasPrice(customGasPrice) {
      this.setGasPriceType(gasPriceTypes.STORED).then(() => {
        this.setGasPrice(
          getGasBasedOnType(
            this.web3.utils.toWei(customGasPrice, 'gwei'),
            gasPriceTypes.STORED
          )
        );
      });
    },
    async fetchGasPrice() {
      try {
        this.localGas = await this.web3.eth.getGasPrice();
      } catch (e) {
        console.log(e); // todo remove dev item
        Toast(e, {}, SENTRY);
      }
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
