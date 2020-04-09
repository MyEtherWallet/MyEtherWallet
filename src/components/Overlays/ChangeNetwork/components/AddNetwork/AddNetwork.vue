<template>
  <div>
    add

    <StdButton size="x-large" fullwidth>
      Save
    </StdButton>
  </div>
</template>

<script>
import StdButton from '@/web/components/StdButton';

export default {
  components: { StdButton },
  data() {
    return {};
  }
};
</script>

<style lang="scss" scoped>
@import '@/assets/styles/GlobalVariables.scss';
</style>
