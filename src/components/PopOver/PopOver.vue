<template lang="html">
  <div class="popover-container">
    <b-col>
      <b-btn :id="popOverId" class="popover-button">
        <img src="@/assets/images/icons/exclamation.png">
      </b-btn>
      <b-popover :target="popOverId" triggers="hover focus" placement="top">
        <template slot="title">{{poptitle}}</template>
        <p class="popover-content">{{popcontent}}</p>
      </b-popover>
    </b-col>
  </div>
</template>

<script>
export default {
  props: ['poptitle', 'popcontent'],
  data () {
    return {
      // Create a random string for each popover instance
      popOverId: 'popoverid' + String(Math.floor(Math.random() * 100000000))
    }
  }
}
</script>

<style lang="scss" scoped>
@import "./PopOver.scss";
</style>
