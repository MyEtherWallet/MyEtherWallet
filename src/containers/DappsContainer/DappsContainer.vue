<template>
  <div class="dapps-container">
    <div v-show="selectedDapp === ''">
      <div class="content-title">
        <h2>{{ $t('reused.dapps') }}</h2>
      </div>
      <div class="buttons-container">
        <dapp-buttons v-for="dapp in dapps" :key="dapp.title" v-on:click="switchView(dapp.param)" :title="dapp.title" :icon="dapp.icon" :desc="dapp.desc"></dapp-buttons>
      </div>
    </div>
    <register-domain-container v-show="selectedDapp === 'register-domain'" :resetView="switchView"></register-domain-container>
    <domain-sale-container v-show="selectedDapp === 'domain-sale'" :resetView="switchView"></domain-sale-container>
  </div>
</template>

<script>
import domainSale from '@/assets/images/icons/domain-sale.svg'
import registerDomain from '@/assets/images/icons/domain.svg'
export default {
  data () {
    return {
      selectedDapp: '',
      dapps: [
        {
          param: 'register-domain',
          icon: registerDomain,
          title: this.$t('interface.registerDom'),
          desc: this.$t('interface.registerDomDesc')
        },
        {
          param: 'domain-sale',
          icon: domainSale,
          title: this.$t('interface.domSale'),
          desc: this.$t('interface.domSaleDesc')
        }
      ]
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
