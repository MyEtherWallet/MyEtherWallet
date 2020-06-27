<template>
  <v-text-field
    v-model="password"
    :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
    :type="show ? 'text' : 'password'"
    name="input-10-1"
    label="Enter your password"
    hint="At least 8 characters including 2 special charactors."
    counter
    outlined
    :placeholder="placeholder"
    @click:append="show = !show"
    @input="emitValue"
  ></v-text-field>
</template>

<script>
export default {
  props: {
    label: { default: '', type: String },
    placeholder: { default: ' ', type: String },
    value: { default: '', type: String }
  },
  data() {
    return {
      password: '',
      show: false
    };
  },
  methods: {
    emitValue(e) {
      this.$emit('input', e);
    }
  }
};
</script>
