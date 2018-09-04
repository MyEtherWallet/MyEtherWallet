<template>
  <div class="detail-information">
    <div class="wrap">

      <div class="content-container">
        <div class="toggle-button">
          <h4>Detail Information</h4>
          <div class="sliding-switch sliding-switch-white">
            <label class="switch">
              <input type="checkbox" v-on:click="isExpended = !isExpended" />
              <span class="slider round"></span>
            </label>
          </div>
        </div>
        <div class="expending-block" v-if="isExpended">
          <ul>
            <li v-for="d in details" v-bind:key="d.key">
              <p class="name">{{d.name}}</p>
              <p class="value">{{d.value}}</p>
            </li>
          </ul>
        </div>
      </div>

    </div>
  </div>
</template>

<script>

export default {
  props: ['details'],
  data () {
    return {
      isExpended: false
    }
  },
  mounted () {
  }
}
</script>

<style lang="scss" scoped>
  @import "DetailInformation.scss";
</style>
