<template>
  <div>
    <b-modal
      ref="ledgerApp"
      title="Choose the App"
      hide-footer
      class="bootstrap-modal"
      centered
      static="true"
      lazy="true"
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
          <div
            v-show="selectedPath.path === 'custom'"
            class="custom-path-inputs"
          >
            <div class="path-input">
              <label for="custom-label"> Alias </label>
              <input
                v-model="customLabel"
                name="custom-label"
                placeholder="my custom path"
              />
            </div>
            <div class="path-input">
              <label for="custom-path"> Path </label>
              <input
                v-model="customPath"
                name="custom-path"
                placeholder="m/44'/1'/0'/0"
              />
            </div>
            <div class="custom-path-actions">
              <div class="cancel" @click="cancel">
                Cancel
              </div>
              <div class="proceed" @click="addCustomPath">
                Add Custom Path
              </div>
            </div>
          </div>
          <b-dropdown :no-caret="true" class="dropdown-button-3">
            <template slot="button-content">
              <span> {{ dropDownDefaultText }} </span>
              <i
                :class="[
                  flipButton ? 'fa-chevron-up' : 'fa-chevron-down',
                  'fa'
                ]"
              ></i>
            </template>
            <b-dropdown-item
              v-for="(path, idx) in selectedApp.paths"
              ref="pathDropdown"
              :key="path.label"
              :active="path.path === selectedPath.path"
              @click="setPath(path, idx)"
            >
              {{ path.label }} - {{ path.path }}
              <i
                v-show="
                  selectedApp.network.name_long === 'Custom Paths' &&
                    !path.hasOwnProperty('default')
                "
                class="fa fa-times remove-custom"
                @click.stop="remove(path, idx)"
              />
            </b-dropdown-item>
          </b-dropdown>
          <button
            :class="[
              selectedPath.path === 'custom' ? 'disabled' : '',
              'mid-round-button-green-filled next-button'
            ]"
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
import cust from '@/assets/images/icons/network.svg';
import { Toast, pathHelpers } from '@/helpers';
import { LedgerWallet } from '@/wallets';
import { mapState } from 'vuex';
import { ethereum } from '@/wallets/bip44/paths';
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
      flipButton: false,
      customLabel: '',
      customPath: ''
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
    },
    ...mapState(['customPaths'])
  },
  watch: {
    selectedApp: {
      handler: function(newVal) {
        this.selectedPath = newVal.paths[0];
      },
      deep: true
    },
    customPaths() {
      this.setupCustomPaths();
    }
  },
  mounted() {
    this.setupCustomPaths();
    this.$root.$on('bv::dropdown::show', () => {
      this.flipButton = true;
    });
    this.$root.$on('bv::dropdown::hide', () => {
      this.flipButton = false;
    });
  },
  methods: {
    remove(path, idx) {
      const mappedPaths = this.selectedApp.paths.filter((item, itemIdx) => {
        if (itemIdx !== idx) return item;
      });
      this.$store.dispatch('removeCustomPath', path);
      this.setupCustomPaths();
      this.selectedApp.paths = mappedPaths;
      this.selectedPath =
        this.selectedApp.paths.length > 1
          ? this.selectedApp.paths[0]
          : apps[0].paths[0];
      this.$refs.pathDropdown[0].closeDropdown();
    },
    setupCustomPaths() {
      const loc = apps.map(item => {
        return item;
      });
      const customPathArr = Object.keys(this.customPaths);
      const customApp = {
        paths: [
          {
            label: 'Ethereum (Trezor)',
            path: ethereum.path,
            default: true
          },
          {
            label: 'Add Custom Paths',
            path: 'custom',
            default: true
          }
        ],
        network: {
          icon: cust,
          name_long: 'Custom Paths',
          name: 'Custom'
        }
      };

      customPathArr.forEach(item => {
        customApp.paths.unshift(this.customPaths[item]);
      });

      loc.push(customApp);

      this.apps = loc;
    },
    addCustomPath() {
      const customPath = pathHelpers.checkCustomPath(this.customPath);
      if (customPath) {
        this.selectedPath = {
          path: customPath,
          label: this.customLabel
        };
        this.$store
          .dispatch('addCustomPath', {
            label: this.customLabel,
            path: customPath
          })
          .then(() => {
            this.setupCustomPaths();
            this.selectedApp.paths.unshift(this.selectedPath);
          });
      } else {
        Toast.responseHandler('Invalid Custom Path', Toast.ERROR);
      }
    },
    cancel() {
      this.customLabel = '';
      this.customPath = '';
      this.selectedPath =
        this.selectedApp.paths.length > 1
          ? this.selectedApp.paths[0]
          : apps[0].paths[0];
    },
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
