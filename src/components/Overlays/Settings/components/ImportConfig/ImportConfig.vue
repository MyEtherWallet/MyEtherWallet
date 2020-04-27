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
      <StdButton buttonclass="button--green-border" class="ml-3" height="57px">
        Import
      </StdButton>
    </div>
  </div>
</template>

<script>
import StdButton from '@/web/components/StdButton';

export default {
  components: { StdButton },
  props: {},
  data() {
    return {};
  }
};
</script>

<style lang="scss" scoped>
@import '@/assets/styles/GlobalVariables.scss';

.descriptions {
  max-width: 450px;
}
</style>
