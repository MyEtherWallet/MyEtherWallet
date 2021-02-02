<template>
  <v-navigation-drawer :src="background" permanent width="400">
    <template #prepend>
      <div class="pa-5">
        <div class="my-4">
          <router-link :to="{ name: 'Dashboard' }">
            <img width="120" src="@/assets/images/icons/logo-mew.png" />
          </router-link>
        </div>
        <wallet-card />
        <mew-super-button
          font-class="mew-body"
          class="mt-4"
          title="Buy ETH here"
          color-theme="outline"
          style="height: 46px"
        >
          <!-- going to change slot name -->
          <template #contentSlot>
            <img
              src="@/assets/images/icons/icon-mastercard-mew.png"
              alt="Master card"
              height="16"
              class="ml-3"
            />
            <img
              src="@/assets/images/icons/icon-visa-white.png"
              alt="Master card"
              height="11"
              class="mx-3"
            />
          </template>
        </mew-super-button>
      </div>
    </template>

    <v-divider></v-divider>
    <!-- 
    <v-list dense>
      <v-list-item v-for="item in items" :key="item.title">
        <v-list-item-icon>
          <v-icon>{{ item.icon }}</v-icon>
        </v-list-item-icon>

        <v-list-item-content>
          <v-list-item-title>{{ item.title }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list> -->
  </v-navigation-drawer>
</template>

<script>
import background from '@/assets/images/backgrounds/bg-light.png';
import dashboard from '@/assets/images/icons/icon-dashboard-enable.png';
import send from '@/assets/images/icons/icon-send-enable.png';
import swap from '@/assets/images/icons/icon-swap-enable.png';
import dapp from '@/assets/images/icons/icon-dapp-center-enable.png';
import tools from '@/assets/images/icons/icon-contract-enable.png';
import WalletCard from '@/modules/balance/ModuleBalance';

export default {
  components: {
    WalletCard: WalletCard
  },
  data() {
    return {
      background: background,
      items: [
        {
          title: this.$t('interface.menu.dashboard'),
          routeName: 'Dashboard',
          icon: dashboard
        },
        {
          title: this.$t('interface.menu.send'),
          icon: send,
          children: [
            { title: this.$t('sendTx.send-tx'), routeName: 'SendTX' },
            { title: this.$t('interface.menu.nft'), routeName: 'NFTManager' }
          ]
        },
        {
          title: this.$t('common.swap'),
          routeName: 'Swap',
          icon: swap
        },
        {
          title: this.$t('interface.menu.dapps-center'),
          routeName: 'DappsCenter',
          icon: dapp,
          children: [
            {
              title: this.$t('ens.ens-manager.title'),
              routeName: 'ENSManager'
            },
            { title: this.$t('mcdMaker.maker_title'), routeName: 'MakerDAO' },
            { title: this.$t('aave.title'), routeName: 'Aave' },
            { title: this.$t('ambrpay.title'), routeName: 'Ambrpay' },
            {
              title: this.$t('unstoppableDomains.title'),
              routeName: 'UnstoppableDomain'
            }
          ]
        },
        {
          title: this.$t('interface.menu.tools'),
          icon: tools,
          children: [
            {
              title: this.$t('interface.menu.interfact-contract'),
              routeName: 'InteractContract'
            },
            {
              title: this.$t('interface.menu.deploy'),
              routeName: 'DeployContract'
            },
            {
              title: this.$t('interface.menu.sign-message'),
              routeName: 'SignMessage'
            }
          ]
        }
      ]
    };
  }
};
</script>
