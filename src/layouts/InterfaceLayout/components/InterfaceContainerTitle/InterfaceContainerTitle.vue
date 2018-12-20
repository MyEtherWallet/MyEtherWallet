<template lang="html">
  <div class="wrap">
    <div v-if="!isbackbutton" class="content-title content-title-standard">
      <h2>{{ title }}</h2>
      <div class="side-menu-button">
        <round-button title="Change" @click.native="toggleSideMenu" />
      </div>
    </div>
    <div v-if="isbackbutton" class="content-title content-title-backbutton">
      <div class="backbutton-block">
        <img src="@/assets/images/icons/back.png" />
        <h2>{{ backbuttonTitle }}</h2>
      </div>
    </div>
  </div>
</template>

<script>
import RoundButton from '@/components/Buttons/RoundButton';

export default {
  components: {
    'round-button': RoundButton
  },
  props: {
    title: {
      type: String,
      default: ''
    },
    isbackbutton: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      backbuttonTitle: 'Back'
    };
  },
  methods: {
    toggleSideMenu() {
      this.$store.commit('TOGGLE_SIDEMENU');
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'InterfaceContainerTitle.scss';
</style>
