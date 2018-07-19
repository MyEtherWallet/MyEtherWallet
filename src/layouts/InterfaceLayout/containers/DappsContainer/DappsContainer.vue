<template>
  <div class="dapps-container">
    <div v-show="selectedDapp === ''">
      <interface-container-title :title="$t('reused.dapps')"></interface-container-title>
      <div class="buttons-container">
        <dapp-buttons v-for="dapp in dapps" :key="dapp.title" v-on:click="switchView(dapp.param)" :title="dapp.title" :icon="dapp.icon" :desc="dapp.desc"></dapp-buttons>
      </div>
    </div>
    <register-domain-container v-show="selectedDapp === 'register-domain'" :resetView="switchView"></register-domain-container>
    <domain-sale-container v-show="selectedDapp === 'domain-sale'" :resetView="switchView"></domain-sale-container>
  </div>
</template>

<script>
import InterfaceContainerTitle from '../../components/InterfaceContainerTitle'
import DappButtons from '../../components/DappButtons'
import DomainSaleContainer from '../DomainSaleContainer'
import RegisterDomainContainer from '../RegisterDomainContainer'

import domainSale from '@/assets/images/icons/domain-sale.svg'
import registerDomain from '@/assets/images/icons/domain.svg'
export default {
  components: {
    'interface-container-title': InterfaceContainerTitle,
    'dapp-buttons': DappButtons,
    'domain-sale-container': DomainSaleContainer,
    'register-domain-container': RegisterDomainContainer
  },
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
    switchView (param) {
      this.selectedDapp = param
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "DappsContainer.scss";
</style>
