<template>
  <v-sheet class="d-flex align-start" width="100%">
    <v-text-field
      color="teal lighten-1"
      :append-icon="showPasswd ? 'mdi-eye' : 'mdi-eye-off'"
      :type="showPasswd ? 'text' : 'password'"
      :label="fldlabel"
      :hint="hint"
      outlined
      class="mr-3 flex-grow-1"
      :value="passwdValue"
      @click:append="showPasswd = !showPasswd"
    ></v-text-field>
    <mew6-std-btn height="56px" size="x-large" button-class="button--green">{{
      btnlabel
    }}</mew6-std-btn>
  </v-sheet>
</template>

<script>
export default {
  components: {},
  props: {
    btnlabel: { default: '', type: String },
    fldlabel: { default: '', type: String },
    hint: {
      default: 'Passwords require at least 8 alphanumeric characters',
      type: String
    }
  },
  data: () => ({
    showPasswd: false,
    passwdValue: ''
  })
};
</script>
