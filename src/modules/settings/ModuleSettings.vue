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
            <gas-price
              :buttons="gasButtons"
              :selected="gasPriceType"
              :set-selected="setSelected"
              :current-gas-price="currentGasPrice"
              :set-custom-gas-price="setCustomGasPrice"
            />
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
      localGas: null
    };
  },
  computed: {
    ...mapState('global', ['gasPriceType']),
    ...mapState('wallet', ['web3']),
    ...mapGetters('global', ['currentGasPrice']),
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
          subtext: `${this.currentGasPrice} Gwei (${this.gasPriceType})`
        },
        {
          name: 'Import configurations'
        },
        {
          name: 'Export configurations'
        },
        {
          name: 'Contact Address'
        }
        // {
        //   name: 'Notifications'
        // }
      ];
    },
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
  watch: {
    onSettings(newVal) {
      if (newVal) {
        this.fetchGasPrice();
      }
    }
  },
  created() {
    this.settingsHandler = new SettingsHandler();
    this.fetchGasPrice();
  },
  methods: {
    ...mapActions('global', ['setGasPrice', 'setGasPriceType']),
    setSelected(selected) {
      try {
        this.setGasPriceType(selected).then(() => {
          this.setGasPrice(getGasBasedOnType(this.localGas, selected));
        });
      } catch (e) {
        Toast(e, {}, SENTRY);
      }
    },
    setCustomGasPrice(customGasPrice) {
      this.setGasPriceType(gasPriceTypes.STORED).then(() => {
        this.setGasPrice(
          getGasBasedOnType(customGasPrice, gasPriceTypes.STORED)
        );
      });
    },
    async fetchGasPrice() {
      try {
        this.localGas = await this.web3.eth.getGasPrice();
      } catch (e) {
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
