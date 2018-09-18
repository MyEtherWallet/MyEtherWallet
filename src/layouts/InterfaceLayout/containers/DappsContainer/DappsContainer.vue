<template>
  <div class="dapps-container">
    <div v-show="selectedDapp === ''">
      <interface-container-title :title="$t('common.dapps')"/>
      <div class="buttons-container">
        <dapp-buttons
          v-for="dapp in dapps"
          :key="dapp.title"
          :title="dapp.title"
          :icon="dapp.icon"
          :desc="dapp.desc"
          @click="switchView(dapp.param)"/>
      </div>
    </div>
    <register-domain-container
      v-show="selectedDapp === 'register-domain'"
      :reset-view="switchView"/>
    <domain-sale-container
      v-show="selectedDapp === 'domain-sale'"
      :reset-view="switchView"/>
  </div>
</template>

<script>
import InterfaceContainerTitle from '../../components/InterfaceContainerTitle';
import DappButtons from '../../components/DappButtons';
import DomainSaleContainer from '@/dapps/DomainSaleContainer';
import RegisterDomainContainer from '@/dapps/RegisterDomainContainer';

import domainSale from '@/assets/images/icons/domain-sale.svg';
import registerDomain from '@/assets/images/icons/domain.svg';
export default {
  components: {
    'interface-container-title': InterfaceContainerTitle,
    'dapp-buttons': DappButtons,
    'domain-sale-container': DomainSaleContainer,
    'register-domain-container': RegisterDomainContainer
  },
  data() {
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
    };
  },
  methods: {
    switchView(param) {
      this.selectedDapp = param;
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'DappsContainer.scss';
</style>
