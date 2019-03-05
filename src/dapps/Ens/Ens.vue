<template>
  <div class="ens-container">
    <back-button />
    <div class="option-container">
      <dapp-buttons
        v-for="dapp in dapps"
        :key="dapp.title"
        :title="$t(dapp.title)"
        :icon="dapp.icon"
        :icon-disabled="dapp.iconDisabled"
        :desc="$t(dapp.desc)"
        :param="dapp.route"
        :supported-networks="dapp.supportedNetworks"
        custom-class="option-item"
      />
    </div>
  </div>
</template>

<script>
import BackButton from '@/layouts/InterfaceLayout/components/BackButton';
import DappButtons from '@/layouts/InterfaceLayout/components/DappButtons';
import registerDomain from '@/assets/images/icons/domain.svg';
import registerDomainHov from '@/assets/images/icons/domain-hov.svg';
import { ETH, GOERLI, ROP, RIN } from '@/networks/types';
export default {
  components: {
    'back-button': BackButton,
    'dapp-buttons': DappButtons
  },
  data() {
    return {
      dapps: {
        registerEns: {
          route: '/interface/dapps/register-domain',
          icon: registerDomain,
          iconDisabled: registerDomainHov,
          title: 'interface.registerEns',
          desc: 'interface.registerENSDescShort',
          supportedNetworks: [ETH.name, GOERLI.name, ROP.name, RIN.name]
        },
        manageEns: {
          route: '/interface/dapps/buy-subdomain',
          icon: registerDomain,
          iconDisabled: registerDomainHov,
          title: 'Manage ENS',
          desc: 'Update owned ENS info',
          supportedNetworks: [ETH.name]
        }
      }
    };
  }
};
</script>

<style lang="scss" scoped>
@import 'Ens.scss';
</style>
