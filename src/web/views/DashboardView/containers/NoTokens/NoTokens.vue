<template>
  <WhiteSheet class="content-container">
    <div class="pa-12 content-width">
      <div class="block-title display-1 font-weight-bold mb-6">
        My token list is empty
      </div>
      <v-btn
        class="text-transform--initial ml-n3"
        text
        small
        depressed
        :color="$vuetify.theme.themes.light.emerald"
      >
        <v-icon small class="top-button-icon">mdi-plus</v-icon>
        Custom Token
      </v-btn>
    </div>
    <div class="py-12" />
    <div class="py-5" />
  </WhiteSheet>
</template>

<script>
import WhiteSheet from '@/web/components/Common/WhiteSheet';

export default {
  components: { WhiteSheet },
  data() {
    return {};
  }
};
</script>

<style lang="scss" scoped>
.content-width {
  max-width: 360px;
}

.content-container {
  background-image: url(~@/assets/images/backgrounds/bg-half-circle.png),
    url(~@/assets/images/backgrounds/bg-small-half-circle.png);
  background-position: right -16px bottom -26px, left -18px bottom -29px;
  background-size: 357px, 150px;
}

.block-title {
  line-height: 36px !important;
}

.top-button-icon {
  border-radius: 100%;
  background-color: #b4ece4;
  margin-right: 5px;
}
</style>
