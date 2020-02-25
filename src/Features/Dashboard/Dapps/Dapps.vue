<template>
  <WhiteSheet>
    <div class="d-flex align-center px-8 py-7">
      <BlockTitle text="Dapps">
        <template v-slot:right-button>
          <TextButton>View All</TextButton>
        </template>
      </BlockTitle>
    </div>
  </WhiteSheet>
</template>

<script>
import WhiteSheet from '@/components/Common/WhiteSheet';
import BlockTitle from '@/components/BlockTitles/BlockTitle2';
import TextButton from '@/components/Buttons/TextButton1';

export default {
  components: { WhiteSheet, BlockTitle, TextButton },
  data() {
    return {};
  }
};
</script>

<style lang="scss" scoped>
//@import '@/assets/styles/GlobalVariables.scss';
</style>
