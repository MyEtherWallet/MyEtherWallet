<template>
  <div class="main-content">
    <div v-show="selectedDapp === ''">
      <div class="content-title">
        <h2>Dapps</h2>
      </div>
      <div class="buttons-container">
        <div @click.prevent="switchView('register-domain')">
          <div class="dapps-button">
            <img class="icon" src="~@/assets/images/icons/domain.svg">
            <h4>Register Domain</h4>
            <p>This is a function for register domain</p>
          </div>
        </div>
        <div @click.prevent="switchView('domain-sale')">
          <div class="dapps-button">
            <img class="icon" src="~@/assets/images/icons/domain-sale.svg">
            <h4>Domain Sale</h4>
            <p>This is a function for register domain</p>
          </div>
        </div>
      </div>
    </div>
    <register-domain-container v-show="selectedDapp === 'register-domain'" :resetView="switchView"></register-domain-container>
    <domain-sale-container v-show="selectedDapp === 'domain-sale'" :resetView="switchView"></domain-sale-container>
  </div>
</template>

<script>
export default {
  data () {
    return {
      selectedDapp: ''
    }
  },
  methods: {
    switchView: function (param) {
      const self = this
      self.selectedDapp = param
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "DappsContainer.scss";
</style>
