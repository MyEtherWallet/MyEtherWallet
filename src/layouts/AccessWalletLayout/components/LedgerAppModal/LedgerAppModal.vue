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
            <img :src="selectedApp.network.icon" />
          </div>
          <div class="toggle-apps" @click="toggled = !toggled">
            <div>
              <h2>{{ selectedApp.network.name_long }}</h2>
            </div>
            <div class="toggle-indicator-container">
              <i
                :class="[toggled ? 'fa-chevron-up' : 'fa-chevron-down', 'fa']"
              />
            </div>
          </div>
          <div
            :class="[toggled ? 'shown' : 'hide-box', 'app-selection-container']"
          >
            <div
              v-for="app in apps"
              :key="app.network.name"
              :class="[
                selectedApp.network.name_long === app.network.name_long
                  ? 'selected'
                  : '',
                'item'
              ]"
              @click="selectDapp(app)"
            >
              <i class="fa fa-check-circle"></i>
              <span> {{ app.network.name_long }} </span>
            </div>
          </div>
          <b-dropdown :no-caret="true" class="dropdown-button-3">
            <template slot="button-content">
              <span> {{ dropDownDefaultText }} </span>
              <i :class="[flipButton ? 'fa-chevron-up' : 'fa-chevron-down','fa']"></i>
            </template>
            <b-dropdown-item
              v-for="path in selectedApp.paths"
              :key="path.label"
              :active="path.path === selectedPath.path"
              @click="setPath(path)"
            >
              {{ path.label }} - {{ path.path }}
            </b-dropdown-item>
          </b-dropdown>
          <button
            class="mid-round-button-green-filled-green-border next-button"
            @click="next"
          >
            Next
          </button>
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
        network: {
          name_long: apps[0].network.name_long,
          icon: apps[0].network.icon
        },
        paths: apps[0].paths
      },
      toggled: false,
      selectedPath: apps[0].paths[0],
      flipButton: false
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
    },
    dropDownDefaultText() {
      return `${this.selectedPath.label} - ${this.selectedPath.path}`;
    }
  },
  watch: {
    selectedApp(newVal) {
      this.selectedPath = newVal.paths[0];
    }
  },
  mounted() {
    this.$root.$on('bv::dropdown::show', () => {
      this.flipButton = true;
    });
    this.$root.$on('bv::dropdown::hide', () => {
      this.flipButton = false;
    });

  },
  methods: {
    selectDapp(app) {
      this.selectedApp = app;
    },
    setPath(path) {
      this.selectedPath = path;
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
      this.selectedApp = this.apps[0];
      this.selectedPath = this.apps[0].paths[0];
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'LedgerAppModal.scss';
</style>
