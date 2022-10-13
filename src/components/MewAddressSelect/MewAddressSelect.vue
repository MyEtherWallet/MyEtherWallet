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
          color="titlePrimary--text"
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
import MewBlockie from '@/components/MewBlockie/MewBlockie.vue';
import MewCopy from '@/components/MewCopy/MewCopy.vue';
import MewTransformHash from '../MewTransformHash/MewTransformHash.vue';
const USER_INPUT_TYPES = {
  typed: 'TYPED',
  selected: 'SELECTED'
};
export default {
  name: 'MewAddressSelect',
  components: {
    MewBlockie,
    MewCopy,
    MewTransformHash
  },
  props: {
    /**
     * Text displayed under the input container.
     */
    hint: {
      type: String,
      default: ''
    },
    /**
     * For validating your input - accepts an array of functions that take
     * an input value as an argument and return either true / false or a
     * string with an error message.
     */
    rules: {
      type: Array,
      default: () => {
        return [];
      }
    },
    /**
     * The text to display if there is no data.
     */
    noDataText: {
      type: String,
      default: ''
    },
    /**
     * Resolved address for name.
     */
    resolvedAddr: {
      type: String,
      default: ''
    },
    /**
     * Disables the input.
     */
    disabled: {
      type: Boolean,
      default: false
    },
    /**
     * Enables save address button.
     */
    enableSaveAddress: {
      type: Boolean,
      default: false
    },
    /**
     * Returns if the address is valid or not.
     */
    isValidAddress: {
      type: Boolean,
      default: false
    },
    /**
     * The input label.
     */
    label: {
      type: String,
      default: 'To Address'
    },
    /**
     * The items that are displayed in the dropdown.
     * Currently takes an array of objects, i.e { address: '', nickname: ''}
     */
    items: {
      type: Array,
      default: () => {
        return [];
      }
    },
    /**
     * The input placeholder.
     */
    placeholder: {
      type: String,
      default: 'Please enter an address'
    },
    /**
     * Tooltip text for copy icon.
     */
    copyTooltip: {
      type: String,
      default: ''
    },
    /**
     * Displays copy button.
     */
    showCopy: {
      type: Boolean,
      default: true
    },
    /**
     * Displays save button.
     */
    showSave: {
      type: Boolean,
      default: true
    },
    /**
     * Tooltip text for save address icon.
     */
    saveTooltip: {
      type: String,
      default: ''
    },
    /**
     * Error messages to display when its an invalid value.
     */
    errorMessages: {
      type: [String, Array],
      default: ''
    },
    /**
     * Clear address
     */
    clearAddress: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      /**
       * The v-model value for the combobox.
       */
      addressValue: '',
      /**
       * Controls the dropdown expansion.
       */
      dropdown: false,
      /**
       * Indicates whether the user selected from dropdown or typed in the address
       */
      isTyped: USER_INPUT_TYPES.typed
    };
  },
  computed: {
    /**
     * If the input item is a name (i.e, ens) and has a valid resolved address,
     * display the blockie for the resolved address otherwise display
     * the blockie for the regular address value.
     */
    blockieHash() {
      // return this.addressValue.address || this.addressValue;

      return this.resolvedAddr.length > 0
        ? this.resolvedAddr
        : this.addressValue.address || this.addressValue;
    }
  },
  watch: {
    clearAddress() {
      this.clear();
    }
  },
  methods: {
    /**
     * Clears the v-model value.
     */
    clear() {
      this.addressValue = '';
    },
    /**
     * Emits 'saveAddress' when triggered by save address button.
     */
    saveAddress() {
      this.$emit('saveAddress');
    },
    /**
     * Toggles the dropdown.
     */
    toggle() {
      this.dropdown = !this.dropdown;
    },
    /**
     * Sets the dropdown item to be the v-model value.
     */
    selectAddress(data) {
      this.dropdown = false;
      this.isTyped = USER_INPUT_TYPES.selected;
      this.addressValue = data.address;
    },
    /**
     * Emits 'input' when there is a v-model value change.
     */
    onChange(value) {
      this.$emit('input', value, this.isTyped);
    },
    /**
     * Sets the value for what the user types int
     */
    onInputChange(e) {
      this.isTyped = USER_INPUT_TYPES.typed;
      this.addressValue = e.srcElement.value;
    }
  }
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
      border-left: 1px solid var(--v-disabled-base);
      margin-left: 15px;
      margin-right: -15px;
    }
  }
}
</style>
