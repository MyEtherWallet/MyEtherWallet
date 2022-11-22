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
        <div v-if="!disableCustomPaths">
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
        </div>
        <v-divider
          v-if="
            !disableCustomPaths &&
            filteredCustomPaths.length > 0 &&
            filteredPaths.length > 0
          "
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
          v-if="!disableCustomPaths"
          class="d-flex align-center justify-space-between bottom-buttons pt-4"
        >
          <mew-button
            btn-style="transparent"
            btn-size="small"
            color-theme="textDark"
            @click.native="toggleCustomField(true)"
          >
            Add path
            <v-icon>mdi-menu-down</v-icon>
          </mew-button>

          <mew-button
            v-if="filteredCustomPaths.length > 0"
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
            ref="aliasInput"
            class="mt-4"
            label="Alias"
            placeholder="my custom path"
            @input="setCustomAlias"
          />
          <mew-input
            ref="pathInput"
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
                title="Add path"
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
import { ethereum as ethereumPath } from '@/modules/access-wallet/hardware/handlers/configs/configPaths.js';
import { isEmpty } from 'lodash';
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
          name: ethereumPath.label,
          value: ethereumPath.path
        };
      }
    },
    /**
     * disables custom derivation path
     */
    disableCustomPaths: {
      type: Boolean,
      default: false
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
      if (this.disableCustomPaths) return [];
      return this.paths.filter(path => {
        if (this.searchValue) {
          const pathName = path.name.toLowerCase();
          const pathVal = path.value.toLowerCase();
          const searchVal = this.searchValue.trim().toLowerCase();
          return pathName.includes(searchVal) || pathVal.includes(searchVal);
        }
        return path;
      });
    },
    /**
     * Filtered paths based on search
     */
    filteredPaths() {
      return this.passedPaths.filter(path => {
        if (!this.paths.find(e => e.value === path.value)) {
          if (this.searchValue) {
            const pathName = path.name.toLowerCase();
            const pathVal = path.value.toLowerCase();
            const searchVal = this.searchValue.trim().toLowerCase();
            return pathName.includes(searchVal) || pathVal.includes(searchVal);
          }
          return path;
        }
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
      if (!this.showCustomField) {
        this.customPath = '';
        this.customAlias = '';
        this.$refs.aliasInput.clear();
        this.$refs.pathInput.clear();
      }
      if (scroll === true)
        setTimeout(() => {
          document.getElementById('bottomList').scrollIntoView();
          this.$refs.aliasInput.$children[0].focus();
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
      this.customAlias = val.trim();
    },
    /**
     * Sets the custom path value
     */
    setCustomPath(val) {
      this.customPath = val.trim();
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
        if (!customPath) {
          Toast('Invalid Derivation path', {}, ERROR);
          return;
        }
        if (isEmpty(this.customAlias)) {
          Toast('Custom alias cannot be empty', {}, ERROR);
          return;
        }
        const foundPath =
          this.filteredPaths.find(e => e.value === this.customPath) ||
          this.filteredCustomPaths.find(e => e.value === this.customPath);
        if (foundPath) {
          const error = `Path already exists: ${foundPath.name}`;
          Toast(error, {}, ERROR);
          return;
        }
        const foundName =
          this.filteredPaths.find(e => e.name === this.customAlias) ||
          this.filteredCustomPaths.find(e => e.name === this.customAlias);
        if (foundName) {
          const error = `Path name already exists: ${foundName.name}`;
          Toast(error, {}, ERROR);
          return;
        }
        const newPath = {
          name: this.customAlias,
          value: this.customPath
        };
        this.addCustomPath(newPath).then(() => {
          this.customPath = '';
          this.customAlias = '';
          this.$refs.aliasInput.clear();
          this.$refs.pathInput.clear();
          Toast('Custom derivation path added!', {}, SUCCESS);
        });
        this.showCustomField = false;
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
