<template>
  <!--
=====================================================================================
 Derivation Path Component - Access Wallet 
=====================================================================================
-->
  <mew-dropdown ref="mewDropdown" popup-title="Select a derivation path">
    <template #activatorBtnText>
      <span class="textDark--text mew-body capitalize">
        {{ selectedPath.name }}
      </span>
      <span class="path mew-body capitalize">{{ selectedPath.value }}</span>
      <mew-popup
        :title="showRemove ? 'Remove path?' : 'Remove all custom paths?'"
        max-width="336"
        :show="showRemove || showRemoveAll"
        :left-btn="{
          text: 'Cancel',
          color: 'grey',
          method: hideRemove
        }"
        :right-btn="{
          text: 'Remove',
          color: 'error',
          enabled: true,
          method: () =>
            showRemove ? deletePath(selectedRemovePath) : deleteAllPaths()
        }"
        hide-close-btn
      >
      </mew-popup>
    </template>
    <template #cardContent>
      <div>
        <!--
        =====================================================================================
        Search Component to search paths
        =====================================================================================
        -->
        <mew-search
          :value="searchValue"
          class="mb-8"
          placeholder="find a path"
          is-compact
          is-filled
          @input="setSearch"
        />
        <!--
        =====================================================================================
        Displays the filtered customs paths
        =====================================================================================
        -->
        <div
          v-for="(filteredCustomPath, idx) in filteredCustomPaths"
          :key="filteredCustomPath.name + idx"
          class="d-flex"
        >
          <div
            class="mb-6 d-flex align-center justify-space-between cursor-pointer flex-grow-1"
            @click="setPath(filteredCustomPath)"
          >
            <div class="d-flex align-center">
              <v-img
                :src="require('@/assets/images/currencies/eth.png')"
                contain
                class="mr-2"
                max-height="24px"
                max-width="24px"
              />
              <span
                :class="[
                  filteredCustomPath.name === selectedPath.name
                    ? 'greenPrimary--text'
                    : 'textDark--text'
                ]"
                >{{ filteredCustomPath.name }}</span
              >
            </div>
            <span
              :class="
                filteredCustomPath.value === selectedPath.value
                  ? 'greenPrimary--text'
                  : 'path'
              "
            >
              {{ filteredCustomPath.value }}
            </span>
          </div>
          <v-btn
            icon
            small
            class="pa-3 mb-7 ml-2"
            @click="handleRemove(filteredCustomPath)"
          >
            <v-icon color="textDark">mdi-close</v-icon>
          </v-btn>
        </div>
        <v-divider
          v-if="filteredCustomPaths.length > 0 && filteredPaths.length > 0"
          class="mb-6"
        />
        <!--
        =====================================================================================
        Displays the filtered paths
        =====================================================================================
        -->
        <div
          v-for="(filteredPath, idx) in filteredPaths"
          :key="filteredPath.name + idx"
          class="mb-7 d-flex align-center justify-space-between cursor-pointer"
          @click="setPath(filteredPath)"
        >
          <div class="d-flex align-center">
            <v-img
              :src="require('@/assets/images/currencies/eth.png')"
              contain
              class="mr-2"
              max-height="24px"
              max-width="24px"
            />
            <span
              :class="[
                filteredPath.name === selectedPath.name
                  ? 'greenPrimary--text'
                  : 'textDark--text'
              ]"
              >{{ filteredPath.name }}</span
            >
          </div>
          <span
            :class="
              filteredPath.value === selectedPath.value
                ? 'greenPrimary--text'
                : 'path'
            "
          >
            {{ filteredPath.value }}
          </span>
        </div>

        <div
          class="d-flex align-center justify-space-between bottom-buttons pt-4"
        >
          <mew-button
            btn-style="transparent"
            btn-size="small"
            color-theme="textDark"
            @click.native="toggleCustomField(true)"
          >
            Add Path
            <v-icon>mdi-menu-down</v-icon>
          </mew-button>

          <mew-button
            v-if="!filteredCustomPaths.length"
            btn-style="transparent"
            btn-size="small"
            color-theme="redPrimary"
            @click.native="showRemoveAll = true"
          >
            Remove all custom
          </mew-button>
        </div>

        <div :class="showCustomField ? 'open' : ''" class="custom-field">
          <mew-input
            class="mt-4 aliasInput"
            label="Alias"
            placeholder="my custom path"
            @input="setCustomAlias"
          />
          <mew-input
            label="Path"
            placeholder="m/44’/1’/0’/0"
            @input="setCustomPath"
          />
          <v-row no-gutters class="d-flex align-center">
            <v-col class="pr-1" cols="6">
              <mew-button
                has-full-width
                btn-style="outline"
                title="Cancel"
                @click.native="toggleCustomField"
              />
            </v-col>
            <v-col class="pl-1" cols="6">
              <mew-button
                has-full-width
                title="Add Path"
                @click.native="saveCustomPath"
              />
            </v-col>
          </v-row>
        </div>
        <div id="bottomList"></div>
      </div>
    </template>
  </mew-dropdown>
</template>

<script>
import { mapGetters, mapState, mapActions } from 'vuex';
import { checkCustomPath } from '@/modules/access-wallet/software/handlers/pathHelper';
import { Toast, ERROR, SUCCESS } from '@/modules/toast/handler/handlerToast';
export default {
  props: {
    passedPaths: {
      type: Array,
      default: () => []
    },
    selectedPath: {
      type: Object,
      default: () => {
        return {
          name: 'Ethereum',
          value: "m/44'/60'/0'/0"
        };
      }
    }
  },
  data() {
    return {
      showCustomField: false,
      searchValue: '',
      customAlias: '',
      customPath: '',
      showRemove: false,
      showRemoveAll: false,
      selectedRemovePath: ''
    };
  },
  computed: {
    ...mapGetters('global', ['network']),
    ...mapState('custom', ['paths']),
    /**
     * Custom filtered paths based on search
     */
    filteredCustomPaths() {
      return this.paths.filter(path => {
        if (this.searchValue) {
          return (
            path.name
              ?.toLowerCase()
              .includes(this.searchValue?.toLowerCase()) ||
            path.value?.toLowerCase().includes(this.searchValue?.toLowerCase())
          );
        }
        return path;
      });
    },
    /**
     * Filtered paths based on search
     */
    filteredPaths() {
      return this.passedPaths.filter(path => {
        if (this.searchValue) {
          return (
            path.name
              ?.toLowerCase()
              .includes(this.searchValue?.toLowerCase()) ||
            path.value?.toLowerCase().includes(this.searchValue?.toLowerCase())
          );
        }
        return path;
      });
    }
  },
  methods: {
    ...mapActions('custom', [
      'addCustomPath',
      'deleteCustomPath',
      'deleteAllCustomPaths'
    ]),
    /**
     * Emits the path value and name back to parent
     * then closes dropdown
     */
    setPath(path) {
      this.$emit('setPath', path);
      this.$refs.mewDropdown.close();
    },
    hideRemove() {
      this.showRemove = false;
      this.showRemoveAll = false;
    },
    handleRemove(path) {
      this.showRemove = true;
      this.selectedRemovePath = path;
    },
    toggleCustomField(scroll = false) {
      this.showCustomField = !this.showCustomField;
      if (scroll === true)
        setTimeout(() => {
          document.getElementById('bottomList').scrollIntoView();
          const aliasTxt = document
            .getElementsByClassName('aliasInput')[0]
            .getElementsByTagName('input')[0];
          aliasTxt.focus();
        }, 150);
    },
    deletePath(path) {
      this.deleteCustomPath(path);
      this.showRemove = false;
    },
    deleteAllPaths() {
      this.deleteAllCustomPaths();
      this.showRemoveAll = false;
    },
    /**
     * Sets the custom alias value
     */
    setCustomAlias(val) {
      this.customAlias = val;
    },
    /**
     * Sets the custom path value
     */
    setCustomPath(val) {
      this.customPath = val;
    },
    /**
     * Method sets searchValue on mew-search input event
     */
    setSearch(newVal) {
      this.searchValue = newVal;
    },
    /**
     * Method to add custom path.
     * Checks if path is valid and already exists in the filtered paths.
     */
    saveCustomPath() {
      try {
        const customPath = checkCustomPath(this.customPath);
        if (customPath) {
          if (
            this.filteredPaths.some(e => e.value === this.customPath) ||
            this.filteredCustomPaths.some(e => e.value === this.customPath)
          ) {
            const error = 'Custom path already exists';
            Toast(error, {}, ERROR);
          } else {
            if (this.customAlias === '') {
              const error = 'Custom alias cannot be empty';
              Toast(error, {}, ERROR);
            } else {
              const newPath = {
                name: this.customAlias,
                value: this.customPath
              };
              this.addCustomPath(newPath).then(() => {
                this.customPath = '';
                Toast('You have added custom path successfully.', {}, SUCCESS);
              });
            }
            this.showCustomField = false;
          }
        } else {
          Toast('Custom path is not valid', {}, ERROR);
        }
      } catch (error) {
        Toast(error, {}, ERROR);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.path {
  color: rgba(11, 40, 64, 0.5);
}
.custom-field {
  max-height: 0px;
  transition: max-height 0.3s ease;
  overflow: hidden;

  &.open {
    max-height: 400px;
  }
}
.bottom-buttons {
  border-top: 1px solid var(--v-greyMedium-base) !important;
}
</style>
