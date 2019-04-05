<template>
  <div>
    <b-modal
      ref="ledgerApp"
      title="Choose Opened App"
      hide-footer
      class="bootstrap-modal modal-software"
      centered
      @hidden="reset"
    >
      <div>
        <div class="ledger-app-container">
          <div
            v-for="app in apps"
            :key="app.name"
            :class="[selected === app.name ? 'selected' : '', 'ledger-app']"
            @click="setType(app)"
          >
            <div class="app-image-container">
              <img :src="app.icon" />
            </div>
            <span> {{ app.name }} </span>
          </div>
        </div>
        <div class="path-dropdown-container">
          <b-dropdown
            v-show="
              selectedApp.hasOwnProperty('paths') &&
                selectedApp.paths.length > 1
            "
            id="hd-derivation-path"
            :text="selectedPathText"
            left
            class="dropdown-button-2"
          >
            <b-dropdown-item
              v-for="path in selectedApp.paths"
              :key="path.path"
              @click="setSelectedPath(path)"
            >
              {{ path.label }} - {{ path.path }}
            </b-dropdown-item>
          </b-dropdown>
        </div>
        <div class="button-container">
          <div
            :class="[
              fieldsFilled ? 'disabled' : '',
              'large-round-button-green-filled'
            ]"
            @click="next"
          >
            Next
          </div>
        </div>
      </div>
    </b-modal>
  </div>
</template>

<script>
import apps from './apps.js';
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
      selected: '',
      apps: apps,
      selectedPathText: 'Select Path',
      selectedPath: '',
      selectedApp: {}
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
