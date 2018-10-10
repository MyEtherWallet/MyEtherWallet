<template>
  <div class="standard-input">
    
    <div 
      v-if="options.title" 
      class="input-title-container">
      <div class="input-title-and-helper">
        <p class="input-title">{{ options.title }}</p>
        <popover 
          v-if="options.popover" 
          :popcontent="options.popover"/>
      </div>

      <div class="the-button-container">
        <div 
          v-if="options.buttonClear == true" 
          class="the-button clean">Clear</div>

        <div 
          v-if="options.buttonCopy == true" 
          class="the-button copy">Copy</div>
        
        <div 
          v-if="options.buttonCustom" 
          class="the-button clean">{{ options.buttonCustom }}</div>

        <div 
          v-if="options.topTextInfo" 
          class="the-text info">{{ options.topTextInfo }}</div>
      </div>
    </div>

    <div 
      :class="borderClass" 
      class="input-container">
      <input 
        v-if="!options.isTextarea"
        :value="options.value"
        :class="options.rightInputText ? 'right-padding' : ''"
        :placeholder="options.placeHolder" 
        :type="options.type"
        :disabled="options.inputDisabled"
        name="">

      <textarea 
        v-if="options.isTextarea" 
        v-model="inputValue"
        :placeholder="options.placeHolder" 
        :disabled="options.inputDisabled"
      />

      <p 
        v-if="options.rightInputText" 
        class="right-input-text">{{ options.rightInputText }}</p>
    </div>

    <div class="password-strength-indicator">
      <p 
        v-if="options.passwordStrength === '1'" 
        class="weak">Weak strength password</p>
      <p 
        v-if="options.passwordStrength === '2'" 
        class="medium">Medium strength password</p>
      <p 
        v-if="options.passwordStrength === '3'" 
        class="strong">Strong strength password</p>
    </div>

  </div>
</template>

<script>
export default {
  props: {
    options: {
      type: Object,
      default: function() {
        return {};
      }
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
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'StandardInput.scss';
</style>
