<template>
  <div>
    <v-container
      >aaa

      <StdButton />
    </v-container>
  </div>
</template>

<script>
import StdButton from '@/components/StdButton';

export default {
  name: 'HomeAd2',
  components: {
    StdButton
  }
};
</script>

<style lang="scss" scoped>
//@import '@/assets/styles/GlobalVariables';

.card-content {
  background: linear-gradient(130deg, #0b2840 0%, #3d9e91 80%, #00c4ff 100%);
  padding: 70px 90px;
}
</style>
