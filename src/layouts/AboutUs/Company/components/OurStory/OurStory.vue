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
    titleData: {
      textProps: '',
      toptitle: '',
      title: 'Our story',
      description:
        'Sea lorem ea justo amet dolor eirmod stet justo, tempor eos lorem tempor dolor elitr at amet voluptua stet. Et sea gubergren et ipsum, diam lorem tempor tempor labore, consetetur dolor sit no kasd dolore et takimata, sit clita consetetur justo tempor, stet sit ut consetetur ea diam sanctus dolores.',
      centered: true
    }
  })
};
</script>

<style lang="scss" scoped>
//@import '@/assets/styles/GlobalVariables';
.component-container {
  background-color: #f2fafa;
}
</style>
