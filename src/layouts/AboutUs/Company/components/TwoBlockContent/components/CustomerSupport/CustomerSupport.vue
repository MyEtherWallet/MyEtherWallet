<template>
  <v-sheet max-width="400px">
    <v-img
      src="@/assets/images/Common/Icons/CustomerSupport.svg"
      max-width="60px"
      max-height="60px"
      aspect-ratio="1"
      class="mb-5"
    />
    <BlockTitle title="Customer support" :description="descriptionText" />
    <StdButton buttonclass="button--green-border" class="mt-5">
      Contact Support
    </StdButton>
  </v-sheet>
</template>

<script>
import BlockTitle from '@/layouts/components/BlockTitle';
import StdButton from '@/components/StdButton';

export default {
  components: { BlockTitle, StdButton },
  data: () => ({
    descriptionText:
      'Et voluptua takimata sit clita amet, takimata dolor stet sit accusam tempor at est labore.'
  })
};
</script>

<style lang="scss" scoped>
//@import '@/assets/styles/GlobalVariables';
</style>
