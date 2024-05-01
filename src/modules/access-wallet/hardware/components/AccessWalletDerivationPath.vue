<template>
  <!-- ===================================================================================== -->
  <!-- Derivation Path Component - Access Wallet -->
  <!-- ===================================================================================== -->

  <mew-menu-popup
    v-model="showDerivationPath"
    :right="!isMobile"
    :left="isMobile"
  >
    <template #activator>
      <v-btn depressed>
        <div class="d-flex align-center">
          <div class="textDark--text mew-body capitalize mr-2">
            {{ selectedPath.name }}
          </div>
          <div class="path mew-body capitalize">
            {{ selectedPath.value }}
          </div>
        </div>
      </v-btn>
    </template>

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

    <div style="width: 350px" class="pa-6 text-left">
      <div class="mew-heading-2 mb-4">Select a derivation path</div>

      <!-- ===================================================================================== -->
      <!-- Search Component to search paths -->
      <!-- ===================================================================================== -->
      <mew-search
        :value="searchValue"
        class="mb-8"
        placeholder="find a path"
        is-compact
        is-filled
        @input="setSearch"
      />

      <!-- ===================================================================================== -->
      <!-- Displays the filtered customs paths -->
      <!-- ===================================================================================== -->
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

      <!-- ===================================================================================== -->
      <!-- Displays the filtered paths -->
      <!-- ===================================================================================== -->
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
  </mew-menu-popup>
</template>

<script setup>
import { defineProps, ref, computed, defineEmits } from 'vue';
import { isEmpty } from 'lodash';

import { checkCustomPath } from '@/modules/access-wallet/software/handlers/pathHelper';
import { Toast, ERROR, SUCCESS } from '@/modules/toast/handler/handlerToast';
import { ethereum as ethereumPath } from '@/modules/access-wallet/hardware/handlers/configs/configPaths.js';
import { custom as useCustomStore } from '@/core/store/index.js';

// emits
const emit = defineEmits(['setPath']);

// injections/use
const { paths, addCustomPath, deleteCustomPath, deleteAllCustomPaths } =
  useCustomStore();

// props
const props = defineProps({
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
  },
  isMobile: {
    type: Boolean,
    default: false
  }
});

// data
const showDerivationPath = ref(false);
const showCustomField = ref(false);
const searchValue = ref('');
const customAlias = ref('');
const customPath = ref('');
const showRemove = ref(false);
const showRemoveAll = ref(false);
const selectedRemovePath = ref('');
const aliasInput = ref(null);
const pathInput = ref(null);

// computed
/**
 * Custom filtered paths based on search
 */
const filteredCustomPaths = computed(() => {
  if (props.disableCustomPaths) return [];
  return paths.filter(path => {
    if (searchValue.value) {
      const pathName = path.name.toLowerCase();
      const pathVal = path.value.toLowerCase();
      const searchVal = searchValue.value.trim().toLowerCase();
      return pathName.includes(searchVal) || pathVal.includes(searchVal);
    }
    return path;
  });
});
/**
 * Filtered paths based on search
 */
const filteredPaths = computed(() => {
  return props.passedPaths.filter(path => {
    if (!paths.find(e => e.value === path.value)) {
      if (searchValue.value) {
        const pathName = path.name.toLowerCase();
        const pathVal = path.value.toLowerCase();
        const searchVal = searchValue.value.trim().toLowerCase();
        return pathName.includes(searchVal) || pathVal.includes(searchVal);
      }
      return path;
    }
  });
});

// methods
/**
 * Emits the path value and name back to parent
 * then closes dropdown
 */
const setPath = path => {
  emit('setPath', path);
  showDerivationPath.value = false;
};
const hideRemove = () => {
  showRemove.value = false;
  showRemoveAll.value = false;
};
const handleRemove = path => {
  showRemove.value = true;
  selectedRemovePath.value = path;
};
const toggleCustomField = (scroll = false) => {
  showCustomField.value = !showCustomField.value;
  if (!showCustomField.value) {
    customPath.value = '';
    customAlias.value = '';
    aliasInput.value.clear();
    pathInput.value.clear();
  }
  if (scroll === true)
    setTimeout(() => {
      document.getElementById('bottomList').scrollIntoView();
      aliasInput.value.$children[0].focus();
    }, 150);
};
const deletePath = path => {
  deleteCustomPath(path);
  showRemove.value = false;
};
const deleteAllPaths = () => {
  deleteAllCustomPaths();
  showRemoveAll.value = false;
};
/**
 * Sets the custom alias value
 */
const setCustomAlias = val => {
  if (val) customAlias.value = val.trim();
  else customAlias.value = '';
};
/**
 * Sets the custom path value
 */
const setCustomPath = val => {
  if (val) customPath.value = val.trim();
  else customPath.value = '';
};
/**
 * Method sets searchValue on mew-search input event
 */
const setSearch = newVal => {
  searchValue.value = newVal;
};
/**
 * Method to add custom path.
 * Checks if path is valid and already exists in the filtered paths.
 */
const saveCustomPath = () => {
  try {
    const locCustomPath = checkCustomPath(customPath.value);
    if (!locCustomPath) {
      Toast('Invalid Derivation path', {}, ERROR);
      return;
    }
    if (isEmpty(customAlias.value)) {
      Toast('Custom alias cannot be empty', {}, ERROR);
      return;
    }
    const foundPath =
      filteredPaths.value.find(e => e.value === locCustomPath) ||
      filteredCustomPaths.value.find(e => e.value === locCustomPath);
    if (foundPath) {
      Toast(`Path already exists: ${foundPath.name}`, {}, ERROR);
      return;
    }
    const foundName =
      filteredPaths.value.find(e => e.name === customAlias.value) ||
      filteredCustomPaths.value.find(e => e.name === customAlias.value);
    if (foundName) {
      Toast(`Path name already exists: ${foundName.name}`, {}, ERROR);
      return;
    }
    const newPath = {
      name: customAlias.value,
      value: locCustomPath
    };
    addCustomPath(newPath).then(() => {
      customPath.value = '';
      customAlias.value = '';
      aliasInput.value.clear();
      pathInput.value.clear();
      Toast('Custom derivation path added!', {}, SUCCESS);
    });
    showCustomField.value = false;
  } catch (error) {
    Toast(error, {}, ERROR);
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
