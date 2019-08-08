<template>
  <div class="input-container">
    <label :for="inputName">
      {{ inputLabel }}
    </label>
    <input v-model="localSecretPhrase" :type="inputType" :name="inputName" />
  </div>
</template>

<script>
export default {
  props: {
    inputLabel: {
      type: String,
      default: ''
    },
    inputType: {
      type: String,
      default: ''
    },
    inputName: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      form: {
        email: ''
      }
    };
  }
};
</script>

<style lang="scss" scoped>
@import 'InputComponent.scss';
</style>
