<template>
  <ComponentContainer side>
    <div class="d-flex align-center mb-4">
      <h4 class="link-box-title font-weight-bold mr-3">
        MEWwallet
      </h4>
      <img
        class="mr-2"
        src="@/assets/images/icons/icon-appstore-apple-dark.svg"
      />
      <img src="@/assets/images/icons/icon-appstore-android-dark.svg" />
    </div>

    <p>
      MEW brings a hardware wallet style security to your iOS or Android smart
      phone, helping you to secure your funds as never before.
    </p>
    <div class="action-block mt-0 ml-n4">
      <v-btn
        color="teal lighten-3"
        class="font-weight-bold text-transform--initial"
        text
      >
        Get the app<v-icon class="ml-1 title">mdi-arrow-right</v-icon>
      </v-btn>
    </div>
    <v-spacer />
    <div class="line-height--0 text-center bottom-image">
      <img src="@/assets/images/snippets/mobile/mobile-mew-connect.png" />
    </div>
  </ComponentContainer>
</template>

<script>
import ComponentContainer from '../ComponentContainer';
export default {
  components: { ComponentContainer }
};
</script>

<style lang="scss" scoped>
.bottom-image {
  margin-bottom: -32px;
}
</style>
