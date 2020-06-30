<template>
  <div>
    <v-combobox
      class="address-select pa-0"
      v-model="addressValue"
      color="titlePrimary"
      :items="items"
      :label="label"
      item-value="address"
      item-text="address"
      :placeholder="placeholder"
      :disabled="disabled"
      :error-messages="errMsg"
      :menu-props="{ value: autoSelectMenu, closeOnClick: true }"
      ref="addressInput"
      outlined
    >
      <template v-slot:prepend-inner>
        <div
          v-if="!isValidAddress"
          class="blockie-placeholder mr-1 selectHover"
        />
        <div
          v-if="isValidAddress"
          class="blockie-container mr-1"
        >
          <blockie
            :address="addressValue.address ? addressValue.address : addressValue"
            width="25px"
            height="25px"
          />
        </div>
      </template>

      <template v-slot:append>
        <div class="icon-container d-flex align-center">
          <v-tooltip
            content-class="tooltip-inner"
            color="titlePrimary--text"
            top
          >
            <template v-slot:activator="{ on }">
              <v-icon
                class="copy-icon mr-3 basic--text"
                v-on="on"
                @click="copyToClipboard"
              >
                mdi-content-copy
              </v-icon> 
            </template>
            <span>{{ copyTooltip }}</span>
          </v-tooltip>
          <v-tooltip
            content-class="tooltip-inner"
            color="titlePrimary--text"
            top
          >
            <template v-slot:activator="{ on }">
              <v-icon
                :class="['save-icon', enableSaveAddress ? 'basic--text' : 'disabled--text, no-pointer-events']"
                v-on="on"
                @click="saveAddress"
              >
                mdi-bookmark-outline
              </v-icon>
            </template>
            <span>{{ saveTooltip }}</span>
          </v-tooltip>
        </div>
        <div
          class="dropdown-icon-container d-flex align-center justify-center cursor-pointer full-height"
          @click="toggle"
        >
          <v-icon class="mew-heading-1 mx-5">
            mdi-chevron-down
          </v-icon>
        </div>
      </template>

      <template v-slot:item="{ item }">
        <div
          class="py-4 px-0 full-width d-flex align-center justify-space-between"
          @click="selectAddress(item)"
        >
          <div class="d-flex align-center justify-space-between">
            <blockie
              class="mr-2"
              :address="item.address"
              width="25px"
              height="25px"
            />
            <div class="mew-address">
              {{ item.address }}
            </div>
          </div>
          <div class="overline primary--text font-weight-medium">
            {{ item.nickname }}
          </div>
        </div>
      </template>
    </v-combobox>
    <toast
      ref="toast"
      :duration="2000"
      toast-type="success"
      :text="successToast"
    />
  </div>
</template>

<script>
import Blockie from '@/components/Blockie/Blockie.vue';
import Toast from '@/components/Toast/Toast.vue';

export default {
  name: 'AddressSelect',
  props: {
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
     * The saved addresses in address book.
     */
    items: {
      type: Array,
      default: function() {
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
     * Tooltip for copy.
     */
    copyTooltip: {
      type: String,
      default: ''
    },
    /**
     * Tooltip for save address.
     */
    saveTooltip: {
      type: String,
      default: ''
    },
    /**
     * Text for toast success.
     */
    successToast: {
      type: String,
      default: ''
    },
    /**
     * Text for toast success.
     */
    errMsg: {
      type: String,
      default: ''
    }
  },
  components: {
    blockie: Blockie,
    toast: Toast
  },
  data() {
    return {
      addressValue: '',
      autoSelectMenu: false
    };
  },
  watch: {
    addressValue(newValue) {
      // eslint-disable-next-line no-console
      console.log('address value:', newValue);
    }
  },
  methods: {
    saveAddress() {
      this.$emit('saveAddress');
    },
    toggle() {
      this.autoSelectMenu = !this.autoSelectMenu;
    },
    copyToClipboard() {
      this.$refs.addressInput.$el.querySelector('input').select();
      document.execCommand('copy');
      this.$refs.toast.showToast();
    },
    selectAddress(data) {
      this.autoSelectMenu = false;
      this.addressValue = data.address;
      this.$emit('emitSelectedValue', data);
    }
  }
};
</script>

<style lang="scss">
.v-application  {
  // address select input
  .address-select {
    &.v-text-field {
      input {
        font-family: 'PT Mono';
      }
    }

    &.v-input--is-focused  {
      .dropdown-icon-container {
        border-left: 1px solid var(--v-titlePrimary-base) !important;
      }
    }

    // blockie
    .blockie-placeholder {
      height: 25px;
      width: 25px;
      border-radius: 50%;
    }

    .blockie-container {
      max-height: 25px;
    }

    // right icons
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
