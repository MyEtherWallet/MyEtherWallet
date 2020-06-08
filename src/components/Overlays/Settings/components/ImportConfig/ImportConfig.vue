<template>
  <div>
    <div class="descriptions mb-7">
      Please upload the file, and click the button on the left top to open and
      import you configuration file from your local computer.
    </div>
    <div class="d-flex align-start">
      <v-file-input
        color="emerald"
        label="Upload file..."
        filled
      ></v-file-input>
      <mew6-std-btn
        buttonclass="button--green-border"
        class="ml-3"
        height="57px"
      >
        Import
      </mew6-std-btn>
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  props: {},
  data() {
    return {};
  }
};
</script>

<style lang="scss" scoped>
.descriptions {
  max-width: 450px;
}
</style>
