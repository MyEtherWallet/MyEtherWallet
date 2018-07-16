<template>
  <div :class="[!disabled ? 'disabled': '','button-block']" v-on:click="func">
    <div class="button-image">
      <img class="icon" :src="img">
    </div>
    <h3>{{title}}</h3>
    <p>{{desc}}</p>
    <p class="small-note" :v-if="recommend !== ''">{{recommend}}</p>
    <div class="tooltip-box">
      <span>
        <b-btn v-b-tooltip.hover :title="tooltip">
          <i class="fa fa-question-circle-o" aria-hidden="true"></i>
        </b-btn>
      </span>
    </div>
  </div>
</template>

<script>
export default {
  props: ['func', 'img', 'title', 'desc', 'recommend', 'tooltip', 'disabled'],
  data () {
    return {
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "AccessWalletButton.scss";
</style>
