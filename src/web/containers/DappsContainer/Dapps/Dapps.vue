<template>
  <WhiteSheet>
    <div class="pa-8">
      <div class="mew-heading-1 px-4">MEW Dapps</div>
      <v-row>
        <v-col v-for="(dapp, key) in mewDapps" :key="key" cols="4" sm="4">
          <mew-super-button
            :title="dapp.title"
            :subtitle="dapp.subtitle"
            :tag="dapp.tag"
            :is-new="dapp.isNew"
            :right-icon="dapp.icon"
            :title-icon="dapp.thumbsup"
          />
        </v-col>
      </v-row>
    </div>
  </WhiteSheet>
</template>

<script>
import WhiteSheet from '@/web/components/Common/WhiteSheet';
import IconMakerDAO from '@/assets/images/icons/icon-dapp-makerdao.png';
import IconLock from '@/assets/images/icons/icon-dapp-lock.png';
import IconBrowser from '@/assets/images/icons/icon-dapp-browser.png';
import IconThumbsUp from '@/assets/images/icons/icon-thumbs-up.svg';

export default {
  components: { WhiteSheet },
  data: () => {
    return {
      dapps: {
        MakerDAO: {
          title: 'MakerDAO',
          subtitle: 'Collateralize & Generate DAI',
          tag: '#Exchanges',
          isNew: true,
          icon: IconMakerDAO,
          thumbsup: IconThumbsUp
        },
        ENSManager: {
          title: 'ENS manager',
          subtitle: 'Migrate or register ENS domain / subdomain',
          tag: '#Property',
          icon: IconBrowser
        },
        SafeSendTX: {
          title: 'SafeSend transaction',
          subtitle: 'Migrate or register ENS domain / subdomain',
          tag: '#Security',
          icon: IconLock
        },
        ScheduleTX: {
          title: 'Schedule a transaction',
          subtitle: 'Using the decentralized ETH alarm clock prototype',
          tag: '#Exchange',
          icon: IconBrowser
        }
      },
      mewDapps: [
        {
          title: 'MakerDAO',
          subtitle: 'Collateralize & Generate DAI',
          tag: '#Exchanges',
          isNew: true,
          icon: IconMakerDAO,
          thumbsup: IconThumbsUp
        }
      ]
    };
  }
};
</script>
