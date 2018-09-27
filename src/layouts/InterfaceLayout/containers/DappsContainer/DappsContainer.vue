<template>
  <div class="dapps-container">
    <div>
      <interface-container-title :title="$t('common.dapps')"/>
      <div class="buttons-container">
        <dapp-buttons
          v-for="dapp in dapps"
          :key="dapp.title"
          :title="dapp.title"
          :icon="dapp.icon"
          :desc="dapp.desc"
          :active="dapp.active"
          :param="dapp.param"/>
      </div>
    </div>
  </div>
</template>

<script>
import InterfaceContainerTitle from '../../components/InterfaceContainerTitle';
import DappButtons from '../../components/DappButtons';
import DomainSaleContainer from '@/dapps/DomainSaleContainer';
import RegisterDomain from '@/dapps/RegisterDomain';

import domainSale from '@/assets/images/icons/domain-sale.svg';
import registerDomain from '@/assets/images/icons/domain.svg';
export default {
  components: {
    'interface-container-title': InterfaceContainerTitle,
    'dapp-buttons': DappButtons,
    'domain-sale-container': DomainSaleContainer,
    'register-domain': RegisterDomain
  },
  data() {
    return {
      selectedDapp: '',
      dapps: [
        {
          param: '/interface/dapps/register-domain',
          icon: registerDomain,
          title: this.$t('interface.registerDom'),
          desc: this.$t('interface.registerDomDesc'),
          active: this.$store.state.network.type.chainID === 1
        },
        {
          param: '/interface/dapps/domain-sale',
          icon: domainSale,
          title: this.$t('interface.domSale'),
          desc: this.$t('interface.domSaleDesc'),
          active: true
        }
      ]
    };
  }
};
</script>

<style lang="scss" scoped>
@import 'DappsContainer.scss';
</style>
