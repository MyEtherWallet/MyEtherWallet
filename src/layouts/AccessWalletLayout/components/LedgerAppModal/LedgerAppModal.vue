<template>
  <div>
    <b-modal
      ref="ledgerApp"
      title="Choose the App"
      hide-footer
      class="bootstrap-modal"
      centered
      @hidden="reset"
    >
      <div class="ledger-app-selection-container">
        <h4>Please choose the App you have opened in Ledger</h4>
        <div class="ledger-app-info">
          <div class="selected-app-icon">
            <img :src="selectedApp.icon" />
          </div>
          <h3>{{ selectedApp.name }}</h3>
        </div>
      </div>
    </b-modal>
  </div>
</template>

<script>
import apps from '@/wallets/hardware/ledger/appPaths.js';
import { LedgerWallet } from '@/wallets';
export default {
  props: {
    networks: {
      type: Object,
      default: () => {
        return {};
      }
    }
  },
  data() {
    return {
      apps: apps,
      selectedApp: {
        name: apps[0].network.name_long,
        paths: apps[0].paths,
        icon: apps[0].network.icon
      }
    };
  },
  computed: {
    fieldsFilled() {
      const emptyApp = Object.keys(this.selectedApp).length;
      return (
        this.selected === '' &&
        emptyApp === 0 &&
        this.selectedPathText === 'Select Path' &&
        this.selectedPath === ''
      );
    }
  },
  methods: {
    setType(app) {
      this.selectedApp = app;
      this.selected === app.name
        ? (this.selected = '')
        : (this.selected = app.name);
      if (app.paths.length > 0) {
        this.setSelectedPath(app.paths[0]);
      }
    },
    setSelectedPath(path) {
      this.selectedPath = path;
      this.selectedPathText = `${path.label} - ${path.path}`;
    },
    next() {
      this.$refs.ledgerApp.hide();
      LedgerWallet(this.selectedPath.path)
        .then(_newWallet => {
          this.$emit('hardwareWalletOpen', _newWallet);
        })
        .catch(e => {
          LedgerWallet.errorHandler(e);
        });
    },
    reset() {
      this.selected = '';
      this.selectedPathText = 'Select Path';
      this.selectedPath = '';
      this.selectedApp = {};
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'LedgerAppModal.scss';
</style>
