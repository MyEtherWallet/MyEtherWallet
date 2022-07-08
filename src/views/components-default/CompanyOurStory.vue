<template>
  <div class="component-container">
    <div class="py-10" />
    <v-container class="pb-0">
      <v-sheet max-width="600px" color="transparent" class="mx-auto">
        <app-block-title no-page-title :data="titleData" />
      </v-sheet>
      <div class="my-11" />
      <div class="line-height--0">
        <v-img
          src="@/assets/images/backgrounds/bg-mountains.png"
          max-width="100%"
        />
      </div>
    </v-container>
  </div>
</template>

<script>
import AppBlockTitle from '@/core/components/AppBlockTitle';

export default {
  components: { AppBlockTitle },
  data: vm => ({
    titleData: {
      textProps: '',
      toptitle: '',
      title: vm.$t('aboutUs.about-us.title'),
      description: vm.$t('aboutUs.about-us.description'),
      centered: true
    }
  })
};
</script>

<style lang="scss" scoped>
.component-container {
  background-color: #f2fafa;
}
.line-height--0 {
  line-height: 0 !important;
}
</style>
