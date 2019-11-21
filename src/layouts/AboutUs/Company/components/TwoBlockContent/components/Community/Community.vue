<template>
  <v-sheet max-width="400px">
    <v-img
      src="@/assets/images/Common/Icons/Community.svg"
      max-width="60px"
      max-height="60px"
      aspect-ratio="1"
      class="mb-5"
    />
    <BlockTitle title="Community" :description="descriptionText" />
    <div class="d-flex align-center mt-5">
      <v-btn
        text
        icon
        :color="iconColor"
        :class="buttonClass"
        href="https://github.com/myetherwallet"
        target="_blank"
      >
        <v-icon :class="iconClass">mdi-telegram</v-icon>
      </v-btn>
      <v-btn
        text
        icon
        :color="iconColor"
        :class="buttonClass"
        href="https://github.com/myetherwallet"
        target="_blank"
      >
        <v-icon :class="iconClass">mdi-slack</v-icon>
      </v-btn>
      <v-btn
        text
        icon
        :color="iconColor"
        :class="buttonClass"
        href="https://github.com/myetherwallet"
        target="_blank"
      >
        <v-icon :class="iconClass">mdi-reddit</v-icon>
      </v-btn>
      <v-btn
        text
        icon
        :color="iconColor"
        :class="buttonClass"
        href="https://github.com/myetherwallet"
        target="_blank"
      >
        <v-icon :class="iconClass">mdi-github-face</v-icon>
      </v-btn>
    </div>
  </v-sheet>
</template>

<script>
import BlockTitle from '@/layouts/components/BlockTitle';

export default {
  components: { BlockTitle },
  data: () => ({
    descriptionText:
      'Et voluptua takimata sit clita amet, takimata dolor stet sit accusam tempor at est labore.',
    buttonClass: 'mr-4',
    iconClass: 'display-1',
    iconColor: '#003945'
  })
};
</script>

<style lang="scss" scoped>
//@import '@/assets/styles/GlobalVariables';
</style>
