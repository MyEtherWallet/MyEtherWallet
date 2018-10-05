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

    <div class="input-container">
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
    buttonClass() {
      switch (this.buttonstyle) {
        case 'green':
          return 'standard-button__green';
        case 'green-border':
          return 'standard-button__green-border';
        case 'blue':
          return 'standard-button__blue';
        case 'blue-border':
          return 'standard-button__blue-border';
        default:
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'StandardInput.scss';
</style>
