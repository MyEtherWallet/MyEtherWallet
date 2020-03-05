<template>
  <div class="component-container">
    <div class="py-10" />
    <v-container class="pb-0">
      <v-sheet max-width="600px" color="transparent" class="mx-auto">
        <BlockTitle :data="titleData" />
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
import BlockTitle from '../../../../components/BlockTitle';

export default {
  components: { BlockTitle },
  data: () => ({
    titleData: {
      textProps: '',
      toptitle: '',
      title: 'Our story',
      description:
        'At dolor et sit erat lorem at, dolor magna sed eirmod eos magna takimata ipsum. Eos rebum nonumy ea sit, nonumy sed duo no gubergren sea rebum, stet ut aliquyam amet gubergren erat. Voluptua lorem diam et ea ut, et sanctus justo ea aliquyam vero ipsum est amet sed. Sanctus sanctus sadipscing ipsum invidunt dolor consetetur gubergren. Labore dolor diam diam ea et sit rebum. Invidunt lorem diam magna ipsum,.',
      centered: true
    }
  })
};
</script>

<style lang="scss" scoped>
.component-container {
  background-color: #f2fafa;
}
</style>
