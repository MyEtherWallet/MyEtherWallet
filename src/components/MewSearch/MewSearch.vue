<template>
  <!--
=====================================================================================
  Mew Search
=====================================================================================
-->
  <v-text-field
    v-model="inputValue"
    :class="mewSearchClasses"
    :disabled="disabled"
    :background-color="isSearchBlock && isFilled ? 'backgroundWallet' : ''"
    :label="''"
    :placeholder="placeholder"
    color="primary"
    :error-messages="errorMessages"
    :prepend-inner-icon="isSearchBlock ? '' : 'mdi-magnify'"
    clearable
    :height="searchHeight"
    :solo="isSearchBlock"
    :outlined="isSearchBlock"
    :flat="isSearchBlock"
    validate-on-blur
    :type="type"
    @keyup.enter="onSearch"
  >
    <template #append>
      <!--
=====================================================================================
  Menu Select
=====================================================================================
-->
      <v-select
        v-if="menuSelect && menuSelect.label"
        v-model="menuSelectModel"
        hide-details
        :height="searchHeight"
        single-line
        :items="menuSelect.items"
        item-text="name"
        item-value="value"
        :menu-props="{ bottom: true, offsetY: true, maxHeight: '200px' }"
        return-object
        append-icon="mdi-chevron-down"
        :label="menuSelect.label"
        class="mew-search-menu-select ma-0 pt-0"
        @click="onMenuSelect"
      />
      <!--
  =====================================================================================
    Click to search Button
  =====================================================================================
  -->
      <v-btn
        v-if="isSearchBlock && !canSearchDate"
        :disabled="errorMessages.length > 0"
        :height="searchHeight"
        width="64"
        depressed
        :class="[
          isCompact ? 'margin-offset' : '',
          $vuetify.breakpoint.smAndDown ? 'ml-2' : 'ml-4',
          'search-btn'
        ]"
        color="primary"
        @click="onSearch"
      >
        <v-icon color="white"> mdi-magnify </v-icon>
      </v-btn>
      <v-divider v-if="isSearchBlock && canSearchDate" vertical light />
      <div v-if="isSearchBlock && canSearchDate" class="pl-3 pr-4">
        <mew-icon-button
          btn-style="transparent"
          mdi-icon-size="medium"
          mdi-icon="calendar"
          class="mr-1"
          @click.native="onDateSearch"
        />
        <mew-icon-button
          btn-style="transparent"
          mdi-icon-size="medium"
          mdi-icon="magnify"
          @click.native="onSearch"
        />
      </div>
    </template>
    <template #append-outer />
  </v-text-field>
</template>

<script>
import MewIconButton from '@/components/MewIconButton/MewIconButton.vue';
export default {
  name: 'MewSearch',
  components: {
    MewIconButton
  },
  props: {
    /**
     * Click to search method for search button
     * displays on isSearchBlock
     */
    onSearch: {
      type: Function,
      default: () => {}
    },
    /**
     * click function for calendar icon
     * displays on isSearchBlock
     */
    onDateSearch: {
      type: Function,
      default: () => {}
    },
    /**
     * Disables the input.
     */
    disabled: {
      type: Boolean,
      default: false
    },
    /**
     * The input placeholder.
     */
    placeholder: {
      type: String,
      default: ''
    },
    /**
     * The input value.
     */
    value: {
      type: String,
      default: ''
    },
    /**
     * Displays an outline around input
     * default is with a white background,
     * if want to be filled then isFilled prop needs to be passed
     */
    isSearchBlock: {
      type: Boolean,
      default: false
    },
    /**
     * Displays a calendar icon.
     * Removes search button in favor of search icon.
     */
    canSearchDate: {
      type: Boolean,
      default: false
    },
    /**
     * Adds a grey background color to the search block.
     * In order to use this, isSearchBlock must be passed as true.
     */
    isFilled: {
      type: Boolean,
      default: false
    },
    /**
     * Adds a menu select dropdown
     * Expects attributes label, and items, i.e {label: '', items: [{ name: '', value: ''}]}
     */
    menuSelect: {
      type: Object,
      default: () => {}
    },
    /**
     * Adds a 36px height
     * if not passed then 62px height will be used
     */
    isCompact: {
      type: Boolean,
      default: false
    },
    /**
     * Error messages to display
     */
    errorMessages: {
      type: [String, Array],
      default: ''
    },
    /**
     * Input types
     * default search
     */
    type: {
      type: String,
      default: 'search'
    }
  },
  data() {
    return {
      inputValue: '',
      menuSelectModel: {}
    };
  },
  computed: {
    /**
     * @returns height for mew search input
     */
    searchHeight() {
      if (this.isCompact && !this.isSearchBlock) {
        return '36px';
      }
      if (this.isCompact && this.isSearchBlock) {
        return '46px';
      }
      return '62px';
    },
    /**
     * @returns classes for mew search - needed for styling
     */
    mewSearchClasses() {
      const classes = ['mew-search'];
      this.isSearchBlock
        ? classes.push('search-block')
        : classes.push('search-standard');
      if (!this.isCompact) {
        classes.push('search-large');
      }
      if (this.isFilled) {
        classes.push('search-filled');
      }
      return classes;
    }
  },
  watch: {
    /**
     * @watches the search value and emits it when it changes
     */
    inputValue(newVal, oldVal) {
      if (newVal !== oldVal) {
        this.$emit('input', newVal);
      }
    },
    /**
     * @watches the prop value and sets it to v-model value when it changes
     */
    value(newVal, oldVal) {
      if (newVal !== oldVal) {
        this.inputValue = newVal;
      }
    }
  },
  /**
   * sets prop value to inputValue on mount
   */
  mounted() {
    this.inputValue = this.value;
  },
  methods: {
    /**
     * gets triggered from selecting an item from menu select
     * will @emit menu-select with value to parent container
     */
    onMenuSelect() {
      this.$emit('menu-select', this.menuSelectModel);
    }
  }
};
</script>
<style lang="scss">
/**
  * Mew Search
  * using global styles to override vuetify
  * TODO: probably not everything has to be global so move the correct styles under scoped
  */
.mew-search {
  /**
    * SEARCH BLOCK
    */
  &.search-block {
    .v-input__slot {
      border-radius: 10px;
      min-height: 46px;
      padding-right: 0 !important;
    }
    &.v-text-field {
      &.v-text-field--outlined fieldset {
        box-shadow: 0px 2px 8px rgba(90, 103, 138, 0.48);
      }
      // for search filled borders
      &.search-filled {
        &.v-text-field--outlined fieldset {
          border: 1px solid var(--v-backgroundWallet-base);
          box-shadow: none;
        }
        &.v-input--is-focused fieldset {
          border: 2px solid var(--v-greenPrimary-base);
        }
        &.error--text fieldset {
          border: 2px solid var(--v-redPrimary-base);
        }
      }
      // for error border colors
      &.error--text {
        // fieldset {
        //   border-right: none;
        // }
        .v-input__append-outer {
          .search-btn {
            border: 2px solid var(--v-redPrimary-base) !important;
            // border-left: none !important;
          }
        }
      }
      .v-input__append-inner {
        .mew-search-menu-select {
          &.v-text-field > .v-input__control > .v-input__slot:before {
            border-color: transparent;
            transition: none;
          }
        }
      }
    }
    // Menu select
    .mew-search-menu-select.v-text-field {
      &.v-input--is-focused > .v-input__control > .v-input__slot:after {
        border: transparent;
      }
      .v-input__control > .v-input__slot:after {
        transition: none;
      }
    }
  }
  /**
    * SEARCH FIELD BORDER COLORS
    */
  &.v-text-field > .v-input__control > .v-input__slot:before {
    // changing the border bottom color when in regular state
    border-color: var(--v-greyMedium-base);
    transition: none;
  }
  &.v-text-field:not(.v-input--has-state):hover
    > .v-input__control
    > .v-input__slot:before {
    // changing the border bottom color when in hover state
    border-color: var(--v-greyMedium-base);
    transition: none;
  }
  &.v-text-field.error--text > .v-input__control > .v-input__slot:before {
    // changing the border bottom color when in error state
    border-color: var(--v-errorMedium-base);
    transition: none;
  }
  /**
    * SEARCH ICON
    */
  &.search-standard {
    .v-input__prepend-inner {
      .mdi-magnify {
        margin-top: 5px;
      }
    }
    // icon height changes when not compact so have to adjust accordingly
    &.search-large {
      .v-input__prepend-inner {
        .mdi-magnify {
          margin-top: 30px;
        }
      }
    }
  }
  .v-input__prepend-inner {
    // search colors
    .mdi-magnify {
      color: var(--v-textMedium-base) !important;
      &.primary--text,
      &.error--text {
        color: var(--v-textMedium-base) !important;
      }
    }
  }
  /**
    * CLOSE ICON
    */
  &.search-standard {
    .mdi-close {
      margin-top: 12px;
    }
    // icon height changes when not compact so have to adjust accordingly
    &.search-large {
      .mdi-close {
        margin-top: 39px;
      }
    }
  }
  .mdi-close {
    color: var(--v-textMedium-base) !important;
    margin-right: 16px; //this might be changed - ask russ
    &.primary--text,
    &.error--text {
      color: var(--v-textMedium-base) !important;
    }
    margin-left: 16px;
  }
  /**
    * MENU SELECT DROPDOWN STYLES
    * for all search input types
    */
  .mew-search-menu-select {
    max-width: 150px; //TODO: ask russ to confirm this width
  }

  /**
    * MENU SELECT DROPDOWN STYLES
    * for search standard only
    */
  &.search-standard {
    &.v-text-field.error--text {
      .v-input__append-inner {
        .mew-search-menu-select {
          &.v-text-field > .v-input__control > .v-input__slot:before {
            // changing the border bottom color when in error state
            border-color: var(--v-redPrimary-base);
            transition: none;
          }
        }
      }
    }
    .v-input__append-inner {
      margin-top: 0;
      margin-left: 0;
      .mew-search-menu-select {
        &.v-text-field > .v-input__control > .v-input__slot:before {
          // changing the border bottom color when in regular state
          border-color: var(--v-greyMedium-base);
          transition: none;
        }
        .mdi-chevron-down {
          margin-top: 8px;
        }
      }
    }
    // menu select dropdown icon
    .v-input__icon--append {
      .mdi-chevron-down {
        color: var(--v-textMedium-base);
      }
    }
  }
  /**
    * CLICK TO SEARCH BTN STYLE
    */
  .v-input__append-inner {
    border-radius: 0px 10px 10px 0px;
    margin: 0 !important;
    .search-btn {
      border-radius: 0px 10px 10px 0px;
      &.v-btn--disabled {
        background-color: var(--v-disabledPrimary-base) !important;
        .v-icon {
          color: var(--v-white-base) !important;
        }
      }
    }
  }
  // removes box shadow for search btn
  &.search-filled {
    .search-btn {
    }
  }
}
// fixes the weird offset when is compact is true
.margin-offset {
  margin-top: 1px;
}
</style>
