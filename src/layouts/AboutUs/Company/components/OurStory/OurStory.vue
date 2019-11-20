<template>
  <div class="component-container">
    <div class="py-10" />
    <v-container class="pb-0">
      <v-sheet max-width="600px" color="transparent" class="mx-auto">
        <BlockTitle title="Our story" :description="descriptionText" centered />
      </v-sheet>
      <div class="my-11" />
      <div class="line-height--0">
        <v-img
          src="@/assets/images/Etc/AboutUs/mountains.png"
          max-width="100%"
        />
      </div>
    </v-container>
  </div>
</template>

<script>
import BlockTitle from '@/layouts/components/BlockTitle';

export default {
  components: { BlockTitle },
  data: () => ({
    descriptionText:
      'Dolor aliquyam sadipscing duo at nonumy consetetur. Ut clita et at et, ea at sadipscing accusam diam, lorem et at dolor clita lorem ipsum voluptua. Duo amet ipsum ut eirmod takimata dolor sadipscing dolore et, diam dolor est lorem et. Dolor aliquyam sadipscing duo at nonumy consetetur. Ut clita et at et, ea at sadipscing accusam diam, lorem et at dolor clita lorem ipsum voluptua. Duo amet ipsum ut eirmod takimata dolor sadipscing dolore et, diam dolor est lorem et. Duo amet ipsum ut eirmod takimata dolor sadipscing dolore et, diam dolor est lorem et.'
  })
};
</script>

<style lang="scss" scoped>
//@import '@/assets/styles/GlobalVariables';
.component-container {
  background-color: #f2fafa;
}
</style>
