<template>
  <WhiteSheet sideinfo class="pa-7">
    <div class="left-container">
      <h4 class="text-color--dark-space bold">
        {{ $t('common.network') }}
        <v-icon class="chevon-right-icon">mdi-chevron-right</v-icon>
      </h4>
      <div class="mt-3">
        <!-- placeholders -->
        <p>ETH - myetherwallet.com</p>
        <p>Last Block: #5699679</p>
      </div>
    </div>
    <div class="right-container">
      <img src="@/assets/images/icons/eth.png" alt="ethereum" />
    </div>
  </WhiteSheet>
</template>

<script>
import WhiteSheet from '@/components/Common/WhiteSheet';

export default {
  components: { WhiteSheet }
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
  color: $white;
  border-radius: 6px;
  height: 25px;
  width: 25px;
}
</style>
