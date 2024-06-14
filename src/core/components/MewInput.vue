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
            : 'textDarkWhite--text',
          'rounded-lg mt-n2 mew-caption font-weight-medium'
        ]"
        min-width="40"
        min-height="40"
        height="40"
        width="40"
        depressed
        :loading="maxBtnObj.loading"
        color="maxButton"
        @click="maxBtnObj.method"
      >
        {{ maxBtnObj.title }}
      </v-btn>
    </template>
  </v-text-field>
</template>

<script setup>
import { ref, watch, computed, onMounted } from 'vue';
import MewBlockie from './MewBlockie.vue';
import MewTokenContainer from './MewTokenContainer.vue';

const emits = defineEmits(['input', 'buyMore']);

const types = ['password', 'text'];

// props
const props = defineProps({
  errorMessages: {
    type: [String, Array],
    default: ''
  },
  isReadOnly: {
    type: Boolean,
    default: false
  },
  showBlockie: {
    type: Boolean,
    default: false
  },
  hasNoBorder: {
    type: Boolean,
    default: false
  },
  disabled: {
    type: Boolean,
    default: false
  },
  label: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: ''
  },
  value: {
    type: String,
    default: ''
  },
  id: {
    type: Number,
    default: null
  },
  rightLabel: {
    type: String,
    default: ''
  },
  hideClearBtn: {
    type: Boolean,
    default: false
  },
  rules: {
    type: Array,
    default: () => {
      return [];
    }
  },
  resolvedAddr: {
    type: String,
    default: ''
  },
  persistentHint: {
    type: Boolean,
    default: false
  },
  hint: {
    type: String,
    default: ''
  },
  type: {
    type: String,
    default: 'text'
  },
  image: {
    type: String,
    default: ''
  },
  buyMoreStr: {
    type: String,
    default: ''
  },
  maxBtnObj: {
    type: Object,
    default: () => {
      return {};
    }
  },
  autofocus: {
    type: Boolean,
    default: false
  },
  hidePasswordIcon: {
    type: Boolean,
    default: false
  }
});

// data
const inputValue = ref('');
const showPassword = ref(false);

// computed
const isPasswordType = computed(() => {
  return props.type === types[0];
});

const showPasswordIcon = computed(() => {
  if (isPasswordType.value && !props.hidePasswordIcon) {
    return !showPassword.value ? 'mdi-eye' : 'mdi-eye-off';
  }
  return '';
});

const inputType = computed(() => {
  if (isPasswordType.value && showPassword.value) {
    return types[1];
  }
  return props.type;
});

// watch
watch(
  () => inputValue.value,
  newVal => {
    if (newVal !== props.value) {
      emits('input', newVal, props.id);
    }
  }
);

watch(
  () => props.value,
  newVal => {
    if (newVal !== inputValue.value) {
      inputValue.value = newVal;
    }
  }
);

// mounted
onMounted(() => {
  inputValue.value = props.value;
});

// methods
const emitBuyMore = () => {
  emits('buyMore');
};

const onPasswordIconClick = () => {
  if (isPasswordType.value) {
    showPassword.value = !showPassword.value;
  }
};
/* eslint-disable */
const clear = val => {
  inputValue.value = val ? val : '';
};

/* eslint-enable */
const preventCharE = e => {
  if (props.type === 'number' && e.key === 'e') e.preventDefault();
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
