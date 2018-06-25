<template>
  <b-modal ref="success" centered hide-footer hide-header class="bootstrap-modal">
    <div class="d-block text-center">
      <i class="check-icon fa fa-check" aria-hidden="true"></i>
      <h2 class="title">Succeess</h2>
      <p>{{ message }}</p>
    </div>
    <div class="button-container">
      <router-link :to="linkTo">
        <b-btn class="mid-round-button-green-filled close-button" @click="showModal = false">
          {{ linkMessage }}
        </b-btn>
      </router-link>
    </div>
  </b-modal>
</template>

<style lang="scss" scoped>
  @import "SuccessModal.scss";
</style>
<script>
export default {
  props: ['message', 'linkTo', 'linkMessage']
}
</script>
