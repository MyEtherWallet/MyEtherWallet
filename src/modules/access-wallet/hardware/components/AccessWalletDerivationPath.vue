<template>
  <!--
=====================================================================================
 Derivation Path Component - Access Wallet 
=====================================================================================
-->
  <mew-dropdown ref="mewDropdown" popup-title="Select a derivation path">
    <template #activatorBtnText>
      <span class="titlePrimary--text mew-body capitalize">
        {{ selectedPath.name }}
      </span>
      <span class="path mew-body capitalize">{{ selectedPath.value }}</span>
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
          is-search-block
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
          class="mb-6 d-flex align-center justify-space-between cursor-pointer"
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
                  ? 'primary--text'
                  : 'titlePrimary--text'
              ]"
              >{{ filteredCustomPath.name }}</span
            >
          </div>
          <span
            :class="
              filteredCustomPath.value === selectedPath.value
                ? 'primary--text'
                : 'path'
            "
          >
            {{ filteredCustomPath.value }}
          </span>
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
                  ? 'primary--text'
                  : 'titlePrimary--text'
              ]"
              >{{ filteredPath.name }}</span
            >
          </div>
          <span
            :class="
              filteredPath.value === selectedPath.value
                ? 'primary--text'
                : 'path'
            "
          >
            {{ filteredPath.value }}
          </span>
        </div>
        <!--
        =====================================================================================
        Custom Path Fields
        =====================================================================================
        -->
        <div
          class="text-right primary--text cursor-pointer"
          @click="showCustomField = !showCustomField"
        >
          + Add Path
        </div>
        <div v-if="showCustomField" class="mt-4">
          <mew-input
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
                @click.native="showCustomField = !showCustomField"
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
    paths: {
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
      customPath: ''
    };
  },
  computed: {
    ...mapGetters('global', ['network']),
    ...mapState('global', ['customPaths']),
    /**
     * Custom filtered paths based on search
     */
    filteredCustomPaths() {
      return this.customPaths.filter(path => {
        if (this.searchValue) {
          return (
            path.name.toLowerCase().includes(this.searchValue.toLowerCase()) ||
            path.value.toLowerCase().includes(this.searchValue.toLowerCase())
          );
        }
        return path;
      });
    },
    /**
     * Filtered paths based on search
     */
    filteredPaths() {
      return this.paths.filter(path => {
        if (this.searchValue) {
          return (
            path.name.toLowerCase().includes(this.searchValue.toLowerCase()) ||
            path.value.toLowerCase().includes(this.searchValue.toLowerCase())
          );
        }
        return path;
      });
    }
  },
  methods: {
    ...mapActions('global', ['addCustomPath']),
    /**
     * Emits the path value and name back to parent
     * then closes dropdown
     */
    setPath(path) {
      this.$emit('setPath', path);
      this.$refs.mewDropdown.close();
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
          if (this.filteredPaths.some(e => e.value === this.customPath)) {
            const error = `Custom path already exists: ${
              this.filteredPaths.find(e => e.value === this.customPath).name
            }`;
            Toast(error, {}, ERROR);
          } else {
            const newPath = {
              name: this.customAlias,
              value: this.customPath
            };
            this.addCustomPath(newPath).then(() => {
              Toast('You have added custom path successfully.', {}, SUCCESS);
            });
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
</style>
