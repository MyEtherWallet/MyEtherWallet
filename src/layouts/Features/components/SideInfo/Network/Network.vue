<template>
  <WhiteSheet sideinfo class="pa-7">
    <div class="left-container">
      <BlockTitle :text="$t('common.network')">
        <template v-slot:object-next-to-title>
          <SoloButton>
            <v-icon>mdi-chevron-right</v-icon>
          </SoloButton>
        </template>
      </BlockTitle>
      <div class="mt-3">
        <!-- placeholders -->
        <p>ETH - myetherwallet.com</p>
        <p>Last Block: #5699679</p>
      </div>
    </div>
    <div class="right-container">
      <img src="@/assets/images/Icons/eth.png" alt="ethereum" />
    </div>
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
@import '@/assets/styles/GlobalVariables.scss';

.white-sheet {
  display: flex;
  justify-content: space-between;
}
.right-container {
  img {
    width: 50px;
  }
}

.chevon-right-icon {
  background-color: $royal-blue;
  color: white;
  border-radius: 6px;
  height: 25px;
  width: 25px;
}
</style>
