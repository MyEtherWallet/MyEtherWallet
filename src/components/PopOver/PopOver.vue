<template lang="html">
  <div class="popover-container">
    <b-col>
      <b-btn v-if="!popovertype" :id="popOverId" class="popover-button">
        <img class="nohover-icon" src="@/assets/images/icons/explanation.svg" />
        <img class="hover-icon" src="@/assets/images/icons/explanation2.svg" />
      </b-btn>
      <b-btn v-if="popovertype === 'A'" :id="popOverId" class="popover-button">
        <img
          class="nohover-icon"
          src="@/assets/images/icons/question-mark.svg"
        />
        <img class="hover-icon" src="@/assets/images/icons/question-mark.svg" />
      </b-btn>
      <b-popover :target="popOverId" triggers="hover focus" placement="top">
        <template v-if="poptitle" slot="title">{{ poptitle }}</template>
        <p class="popover-content">{{ popcontent }}</p>
      </b-popover>
    </b-col>
  </div>
</template>

<script>
export default {
  props: {
    poptitle: {
      type: String,
      default: ''
    },
    popcontent: {
      type: String,
      default: ''
    },
    popovertype: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      // Create a random string for each popover instance
      popOverId: 'popoverid' + String(Math.floor(Math.random() * 100000000))
    };
  }
};
</script>

<style lang="scss" scoped>
@import './PopOver-desktop.scss';
@import './PopOver-tablet.scss';
@import './PopOver-mobile.scss';
</style>
