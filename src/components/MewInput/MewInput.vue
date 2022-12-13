<template>
  <!--
=====================================================================================
  Mew Input
=====================================================================================
-->
  <v-text-field
    v-model="inputValue"
    class="mew-input rounded-lg"
    :disabled="disabled"
    :label="label"
    :placeholder="placeholder"
    :error-messages="errorMessages"
    :outlined="!hasNoBorder"
    :solo="hasNoBorder"
    color="primary"
    :autofocus="autofocus"
    :hint="resolvedAddr ? resolvedAddr : hint"
    :persistent-hint="persistentHint || resolvedAddr.length > 0"
    :suffix="rightLabel"
    :clearable="!hideClearBtn"
    :rules="rules"
    :type="inputType"
    :append-icon="showPasswordIcon"
    :readonly="isReadOnly"
    validate-on-blur
    height="62"
    @click:append="onPasswordIconClick"
    @keydown.native="preventCharE($event)"
  >
    <!--
=====================================================================================
  Mew Input: Error Messages 
=====================================================================================
-->
    <template #message="item">
      <span class="mew-label"
        >{{ item.message }}
        <a
          v-if="buyMoreStr"
          rel="noopener noreferrer"
          class="mew-label"
          @click="emitBuyMore"
          >{{ buyMoreStr }}</a
        ></span
      >
    </template>
    <template #prepend-inner>
      <!--
=====================================================================================
  Mew Input: Blockie (displays at the beginning of the input)
=====================================================================================
-->
      <div
        v-if="showBlockie && !value"
        class="blockie-placeholder mr-1 selectHover"
      />
      <mew-blockie
        v-if="showBlockie && value"
        :address="resolvedAddr ? resolvedAddr : value"
        width="25px"
        height="25px"
      />
      <div class="d-flex align-center justify-center">
        <!--
=====================================================================================
  slot: prependInnerIcon
  prepends content to the beginning of the input.
=====================================================================================
-->
        <slot name="prependInnerIcon" />
        <!--
=====================================================================================
  Mew Input: Token Image  (displays at the beginning of the input)
=====================================================================================
-->
        <mew-token-container
          v-if="image"
          class="mx-1 mt-1"
          :img="image"
          alt="image"
          size="small"
        />
      </div>
    </template>
    <!--
=====================================================================================
  Max Button (displays at the end of the input)
=====================================================================================
-->
    <template #append>
      <v-btn
        v-if="maxBtnObj.method"
        :class="[
          maxBtnObj.disabled
            ? 'disabled--text no-pointer-events'
            : 'greyPrimary--text',
          'rounded-lg mt-n2 mew-caption font-weight-medium'
        ]"
        min-width="40"
        min-height="40"
        height="40"
        width="40"
        depressed
        color="greyLight"
        @click="maxBtnObj.method"
      >
        {{ maxBtnObj.title }}
      </v-btn>
    </template>
  </v-text-field>
</template>

<script>
import MewBlockie from '@/components/MewBlockie/MewBlockie.vue';
import MewTokenContainer from '@/components/MewTokenContainer/MewTokenContainer.vue';

const types = ['password', 'text'];

export default {
  name: 'MewInput',
  components: {
    MewBlockie,
    MewTokenContainer
  },
  props: {
    /**
     * Error messages to display at the bottom of the input.
     */
    errorMessages: {
      type: [String, Array],
      default: ''
    },
    /**
     * Input becomes read only.
     */
    isReadOnly: {
      type: Boolean,
      default: false
    },
    /**
     * Prepends the blockie to the beginning of the input.
     */
    showBlockie: {
      type: Boolean,
      default: false
    },
    /**
     * Removes the input border and adds a box shadow.
     */
    hasNoBorder: {
      type: Boolean,
      default: false
    },
    /**
     * Disables the input.
     */
    disabled: {
      type: Boolean,
      default: false
    },
    /**
     * The input label.
     */
    label: {
      type: String,
      default: ''
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
     * The input id.
     */
    id: {
      type: Number,
      default: null
    },
    /**
     * Displays text on the right inner side of the input.
     */
    rightLabel: {
      type: String,
      default: ''
    },
    /**
     * Hides input clear functionality. Clear symbol will be displayed on the right side.
     */
    hideClearBtn: {
      type: Boolean,
      default: false
    },
    /**
     * For validating your input - accepts an array of functions that take an input value as an argument and returns either true / false
     * or a string containing an error message. The input field will enter an error state if a function returns (or any value in the array contains) false or is a string.
     */
    rules: {
      type: Array,
      default: () => {
        return [];
      }
    },
    /**
     * The resolved address.
     */
    resolvedAddr: {
      type: String,
      default: ''
    },
    /**
     * Enables persistent hint.
     */
    persistentHint: {
      type: Boolean,
      default: false
    },
    /**
     * Hint text (will be displayed at the bottom of the input).
     */
    hint: {
      type: String,
      default: ''
    },
    /**
     * Sets input type.
     */
    type: {
      type: String,
      default: 'text'
    },
    /**
     * Prepends an image to the beginning of the input.
     */
    image: {
      type: String,
      default: ''
    },
    /**
     * Adds a "Buy more" string to the end of the first index of the errorMessages prop.
     */
    buyMoreStr: {
      type: String,
      default: ''
    },
    /**
     * Displays a button to the right inner side of the input.
     * Takes an object.
     * i.e. {title: 'Max', disabled: false, method: () => {}}.
     */
    maxBtnObj: {
      type: Object,
      default: () => {
        return {};
      }
    },
    /**
     * Autofocuses the input.
     */
    autofocus: {
      type: Boolean,
      default: false
    },
    /**
     * Hides the toggle show password icon on the right
     * when input type is password.
     */
    hidePasswordIcon: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      inputValue: '',
      showPassword: false
    };
  },
  computed: {
    isPasswordType() {
      return this.type === types[0];
    },
    showPasswordIcon() {
      if (this.isPasswordType && !this.hidePasswordIcon) {
        return !this.showPassword ? 'mdi-eye' : 'mdi-eye-off';
      }
      return '';
    },
    inputType() {
      if (this.isPasswordType && this.showPassword) {
        return types[1];
      }
      return this.type;
    }
  },
  watch: {
    inputValue(newVal, oldVal) {
      if (newVal !== oldVal) {
        this.$emit('input', newVal, this.id);
      }
    },
    value(newVal, oldVal) {
      if (newVal !== oldVal) {
        this.inputValue = newVal;
      }
    }
  },
  mounted() {
    this.inputValue = this.value;
  },
  methods: {
    emitBuyMore() {
      this.$emit('buyMore');
    },
    onPasswordIconClick() {
      if (this.isPasswordType) {
        this.showPassword = !this.showPassword;
      }
    },
    clear(val) {
      this.inputValue = val ? val : '';
    },
    preventCharE(e) {
      if (this.type === 'number' && e.key === 'e') e.preventDefault();
    }
  }
};
</script>
<style lang="scss">
/**
  * Mew Input styles
  */
.mew-input {
  .mdi-close {
    font-size: 20px !important;
  }
  &.v-input--is-focused {
    .mdi-close {
      color: var(--v-titlePrimary-base) !important;
    }
  }
  .v-text-field__slot {
    .v-label {
      margin-top: 5px;
    }
    .v-label--active {
      margin-top: 0;
    }
  }
  .v-input__icon--append {
    .mdi {
      color: var(--v-disabled-base);
    }
  }
}
</style>
