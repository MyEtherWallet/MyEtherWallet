<template>
  <div class="standard-input">
    <div v-if="options.title" class="input-title-container">
      <div class="input-title-and-helper">
        <div class="title-and-subtitle">
          <p class="input-title">{{ options.title }}</p>
          <p v-if="options.titleText" class="input-title-text">
            {{ options.titleText }}
          </p>
        </div>
        <popover v-if="options.popover" :popcontent="options.popover" />
      </div>

      <div class="the-button-container">
        <div v-if="options.buttonRandom == true" class="the-button random">
          <i class="fa fa-refresh" aria-hidden="true" />{{
            $t('common.random')
          }}
        </div>

        <div v-if="options.buttonClear == true" class="the-button clean">
          {{ $t('common.clear') }}
        </div>

        <div
          v-if="options.buttonCopy == true"
          class="the-button copy"
          @click="copyToClipboard"
        >
          {{ $t('common.copy') }}
        </div>

        <div v-if="options.buttonCustom" class="the-button clean">
          {{ options.buttonCustom }}
        </div>

        <div v-if="options.topTextInfo" class="the-text info">
          {{ options.topTextInfo }}
        </div>
      </div>
    </div>

    <div
      :class="[borderClass, options.borderGrey ? 'border-grey' : '']"
      class="input-container"
    >
      <input
        v-if="!options.isTextarea"
        ref="inputdata"
        v-model="inputValue"
        :readonly="options.readOnly"
        :value="options.value"
        :class="[
          options.rightInputText ? 'right-padding' : '',
          options.inputDisabled ? 'disabled' : ''
        ]"
        :placeholder="options.placeHolder"
        :type="options.type"
        :disabled="options.inputDisabled"
        name
        @blur="emitValue"
      />

      <textarea
        v-if="options.isTextarea"
        ref="textareadata"
        v-model="inputValue"
        :readonly="options.readOnly"
        :placeholder="options.placeHolder"
        :disabled="options.inputDisabled"
        @blur="emitValue"
      />

      <p v-if="options.rightInputText" class="right-input-text">
        {{ options.rightInputText }}
      </p>
      <p v-if="options.validCheck" class="right-input-text">
        <i
          :class="[
            validInput ? '' : 'not-good',
            'fa fa-check-circle good-button'
          ]"
          aria-hidden="true"
        />
      </p>
    </div>

    <div class="password-strength-indicator">
      <div v-if="options.passwordStrength === '1'">
        <p class="strength weak">{{ $t('common.password.weak') }}</p>
        <p class="note">
          {{ $t('common.password.weak-note') }}
        </p>
      </div>
      <div v-if="options.passwordStrength === '2'">
        <p class="strength medium">{{ $t('common.password.medium') }}</p>
        <p class="note">{{ $t('common.password.medium-note') }}</p>
      </div>
      <div v-if="options.passwordStrength === '3'">
        <p class="strength strong">{{ $t('common.password.strong') }}</p>
        <p class="note">{{ $t('common.password.strong-note') }}</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    options: {
      type: Object,
      default: function () {
        return {};
      }
    },
    inputvalue: {
      type: String,
      default: ''
    },
    clearInput: {
      type: Boolean,
      default: false
    },
    validInput: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      inputValue: this.options.value
    };
  },
  computed: {
    borderClass() {
      switch (this.options.passwordStrength) {
        case '1':
          return 'border-red';
        case '2':
          return 'border-blue';
        case '3':
          return 'border-green';
        default:
          return '';
      }
    }
  },
  watch: {
    clearInput() {
      this.inputValue = null;
    }
  },
  methods: {
    copyToClipboard() {
      if (this.options.isTextarea) {
        this.$refs['textareadata'].select();
      } else {
        this.$refs['inputdata'].select();
      }
      document.execCommand('copy');
    },
    emitValue(evt) {
      this.$emit('changedValue', evt.srcElement.value);
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'StandardInput.scss';
</style>
