<template>
  <div class="development elements">
    <div class="wrap">

      <div class="el">
        <p class="el-title">.input--validated</p>
        <p class="el-subtitle">
          Text input with validation marker
        </p>
        <div class="el-container">
          <div class="standard-input">
            <input type="text" placeholder="Placeholder">
            <i class="fa fa-check-circle status bad" aria-hidden="true"></i>
            <i class="fa fa-check-circle status good" aria-hidden="true"></i>
          </div>
        </div><!-- .el-container -->
      </div>

    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
    }
  },
  mounted () {
  }
}
</script>

<style lang="scss" scoped>
  @import "Elements.scss";
</style>
