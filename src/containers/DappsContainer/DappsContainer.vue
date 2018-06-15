<template>
  <div class="main-content">
    <div v-show="selectedDapp === ''">
      <div class="content-title">
        <h2>{{ $t('reused.dapps') }}</h2>
      </div>
      <div class="buttons-container">
        <div @click.prevent="switchView('register-domain')">
          <div class="dapps-button">
            <img class="icon" src="~@/assets/images/icons/domain.svg">
            <h4>{{ $t('interface.registerDom') }}</h4>
            <p>{{ $t('interface.registerDomDesc') }}</p>
          </div>
        </div>
        <div @click.prevent="switchView('domain-sale')">
          <div class="dapps-button">
            <img class="icon" src="~@/assets/images/icons/domain-sale.svg">
            <h4>{{ $t('interface.domSale') }}</h4>
            <p>{{ $t('interface.domSaleDesc') }}</p>
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
