<template>
  <b-modal ref="success" centered hide-footer hide-header class="bootstrap-modal">
    <div class="d-block text-center">
      <i class="check-icon fa fa-check" aria-hidden="true"></i>
      <h2 class="title">Succeed</h2>
    </div>
    <div class="button-container">
      <router-link to="/interact-with-contract">
        <b-btn class="mid-round-button-green-filled close-button" @click="showModal = false">
          Ok
        </b-btn>
      </router-link>
    </div>
  </b-modal>
</template>

<style lang="scss" scoped>
  @import "DeployContractModal.scss";
</style>
