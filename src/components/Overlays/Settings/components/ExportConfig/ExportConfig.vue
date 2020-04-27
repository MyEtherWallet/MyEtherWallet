<template>
  <div>
    <div class="descriptions mb-7">
      Please click the button on the left top to download your configuration
      file into your local computer.
    </div>
    <div class="d-flex justify-center mt-5">
      <StdButton buttonclass="button--green" size="x-large">
        Export
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
