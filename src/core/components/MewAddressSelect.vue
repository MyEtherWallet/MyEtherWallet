<template>
  <!-- ===================================================================================== -->
  <!-- Mew Address Select -->
  <!-- ===================================================================================== -->
  <v-combobox
    ref="mewAddressSelect"
    v-model="addressValue"
    class="address-select pa-0 rounded-lg"
    color="primary"
    :items="items"
    :label="label"
    item-value="address"
    item-text="address"
    :placeholder="placeholder"
    :disabled="disabled"
    :error-messages="errorMessages"
    :hint="hint || resolvedAddr || ''"
    :persistent-hint="resolvedAddr.length > 0 || hint.length > 0"
    :rules="rules"
    :no-data-text="noDataText"
    :menu-props="{ value: dropdown, closeOnClick: true }"
    outlined
    @update:search-input="onChange"
    @input.native="onInputChange"
    @blur="dropdown = false"
  >
    <!-- ===================================================================================== -->
    <!-- Blockie: displays placeholder if invalid address, otherwise displays -->
    <!-- the correct blockie. The blockie is always displayed at the beginning -->
    <!-- of the input. -->
    <!-- ===================================================================================== -->
    <template #prepend-inner>
      <div
        v-if="!isValidAddress || !blockieHash"
        class="blockie-placeholder mr-1 selectHover"
      />
      <mew-blockie
        v-if="isValidAddress"
        class="mr-1"
        :address="blockieHash"
        width="25px"
        height="25px"
      />
    </template>

    <!-- ===================================================================================== -->
    <!-- Copy and save address button. Always displayed at the end of the input -->
    <!-- before the dropdown arrow.  -->
    <!-- ===================================================================================== -->
    <template #append>
      <div class="icon-container d-flex align-center">
        <mew-copy
          v-show="showCopy"
          class="mr-3"
          :tooltip="copyTooltip"
          :copy-value="addressValue.address || addressValue"
        />
        <v-tooltip
          v-if="showSave"
          content-class="tooltip-inner"
          color="textMediumWhite"
          top
        >
          <template #activator="{ on }">
            <v-icon
              :class="[
                'save-icon',
                enableSaveAddress
                  ? 'basic--text'
                  : 'disabled--text, no-pointer-events'
              ]"
              v-on="on"
              @click="saveAddress"
            >
              mdi-bookmark-outline
            </v-icon>
          </template>
          <span>{{ saveTooltip }}</span>
        </v-tooltip>
      </div>

      <!-- ===================================================================================== -->
      <!-- Dropdown arrow. Toggles the dropdown. -->
      <!-- ===================================================================================== -->
      <div
        class="dropdown-icon-container d-flex align-center justify-center cursor-pointer full-height"
        @click="toggle"
      >
        <v-icon class="mew-heading-1 mx-5"> mdi-chevron-down </v-icon>
      </div>
    </template>

    <!-- ===================================================================================== -->
    <!-- Displays each item in the dropdown. -->
    <!-- ===================================================================================== -->
    <template #item="{ item }">
      <div
        :class="[
          'py-4 px-0 full-width d-flex align-center justify-space-between',
          $vuetify.breakpoint.smAndDown ? 'column-reverse align-baseline' : ''
        ]"
        @click="selectAddress(item)"
      >
        <div class="d-flex align-center justify-space-between full-max-width">
          <mew-blockie
            class="mr-2"
            :address="item.resolvedAddr ? item.resolvedAddr : item.address"
            width="25px"
            height="25px"
          />
          <mew-transform-hash
            v-if="!item.resolvedAddr || item.resolvedAddr === ''"
            class="pr-6"
            :hash="item.address"
          />
          <span v-else class="mew-address">{{ item.address }}</span>
        </div>
        <div class="overline primary--text font-weight-medium ml-3">
          {{ item.nickname }}
        </div>
      </div>
    </template>
  </v-combobox>
</template>

<script>
const USER_INPUT_TYPES = {
  typed: 'TYPED',
  selected: 'SELECTED'
};
</script>
<script setup>
import { ref, defineProps, watch, computed, defineEmits } from 'vue';

import MewBlockie from './MewBlockie.vue';
import MewCopy from './MewCopy.vue';
import MewTransformHash from './MewTransformHash.vue';

// emits
const emit = defineEmits(['input', 'saveAddress']);

// props
const props = defineProps({
  hint: {
    type: String,
    default: ''
  },
  rules: {
    type: Array,
    default: () => {
      return [];
    }
  },
  noDataText: {
    type: String,
    default: ''
  },
  resolvedAddr: {
    type: String,
    default: ''
  },
  disabled: {
    type: Boolean,
    default: false
  },
  enableSaveAddress: {
    type: Boolean,
    default: false
  },
  isValidAddress: {
    type: Boolean,
    default: false
  },
  label: {
    type: String,
    default: 'To Address'
  },
  items: {
    type: Array,
    default: () => {
      return [];
    }
  },
  placeholder: {
    type: String,
    default: 'Please enter an address'
  },
  copyTooltip: {
    type: String,
    default: ''
  },
  showCopy: {
    type: Boolean,
    default: true
  },
  showSave: {
    type: Boolean,
    default: true
  },
  saveTooltip: {
    type: String,
    default: ''
  },
  errorMessages: {
    type: [String, Array],
    default: ''
  },
  clearAddress: {
    type: Boolean,
    default: false
  }
});

// data
const isTyped = ref(USER_INPUT_TYPES.typed);
const addressValue = ref('');
const dropdown = ref(false);

// computed
const blockieHash = computed(() => {
  return props.resolvedAddr.length > 0
    ? props.resolvedAddr
    : addressValue.value.address || addressValue.value;
});

// watch
watch(() => addressValue.value, clear);
watch(() => props.clearAddress, clear);

// methods
const clear = () => {
  addressValue.value = '';
};

const saveAddress = () => {
  emit('saveAddress');
};

const toggle = () => {
  dropdown.value = !dropdown.value;
};

const selectAddress = data => {
  dropdown.value = false;
  isTyped.value = USER_INPUT_TYPES.selected;
  addressValue.value = data.address;
};

const onChange = value => {
  emit('input', value, isTyped.value);
};

const onInputChange = e => {
  isTyped.value = USER_INPUT_TYPES.typed;
  addressValue.value = e.srcElement.value;
};
</script>

<style lang="scss">
.v-application {
  /**
    * Address select input.
    */
  .address-select {
    min-height: 62px;
    &.v-text-field {
      input {
        font-family: 'PT Mono';
      }
    }
    /**
    * Right icons
    */
    .v-input__append-inner {
      height: 100%;
      margin-top: 0;
    }

    .icon-container {
      .copy-icon {
        font-size: 20px;
      }
      .save-icon {
        font-size: 22px;
        margin-top: 3px;
      }
      .v-icon {
        &:hover {
          color: var(--v-primary-base) !important;
        }
      }
    }

    &.v-select.v-input--is-focused {
      .mdi-chevron-down {
        color: var(--v-titlePrimary-base);
      }
    }

    .dropdown-icon-container {
      border-left: 1px solid var(--v-inputDividerBorder-base);
      margin-left: 15px;
      margin-right: -15px;
    }
  }
}
</style>
