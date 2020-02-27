<template>
  <WhiteSheet sideinfo class="px-7 py-5 d-flex justify-space-between">
    <div>
      <BlockTitle :text="$t('common.network')">
        <template v-slot:object-next-to-title>
          <SoloButton>
            <v-icon>mdi-chevron-right</v-icon>
          </SoloButton>
        </template>
      </BlockTitle>
      <div class="mt-3">
        <!-- placeholders -->
        <div class="mb-1">ETH - myetherwallet.com</div>
        <div>Last Block: #5699679</div>
      </div>
    </div>
    <img
      width="60"
      height="60"
      src="@/assets/images/currencies/eth/eth.png"
      alt="ethereum"
    />
  </WhiteSheet>
</template>

<script>
import WhiteSheet from '@/components/Common/WhiteSheet';
import BlockTitle from '@/components/BlockTitles/BlockTitle2';
import SoloButton from '@/components/Buttons/SoloButton1';

export default {
  components: { WhiteSheet, BlockTitle, SoloButton }
};
</script>

<style lang="scss" scoped>
//@import '@/assets/styles/GlobalVariables.scss';
</style>
