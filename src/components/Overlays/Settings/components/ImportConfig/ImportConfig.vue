<template>
  <div>
    <div class="descriptions mb-7">
      Please upload the file, and click the button on the left top to open and
      import you configuration file from your local computer.
    </div>
    <div class="d-flex align-start">
      <v-file-input color="emerald" label="Upload file..." filled />
      <mew-button class="ml-3" title="Confirm & Import" button-size="xlarge" />
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
