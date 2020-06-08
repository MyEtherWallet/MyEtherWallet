<template>
  <div>
    <div class="descriptions mb-7">
      Please click the button on the left top to download your configuration
      file into your local computer.
    </div>
    <div class="d-flex justify-center mt-5">
      <mew6-std-btn buttonclass="button--green" size="x-large">
        Export
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
