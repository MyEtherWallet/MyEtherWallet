<template>
  <!--
    =====================================================================================
      Dapp Center Module
    =====================================================================================
    -->
  <the-wrapper-dapp
    :banner-img="bannerImage"
    :banner-text="bannerText"
    no-back-btn
  >
    <template #content>
      <div class="mew-heading-1 px-4 mb-4">MEW Dapps</div>
      <v-row>
        <v-col v-for="(dapp, key) in dapps" :key="key" cols="12" md="6" lg="4">
          <mew-super-button
            :cols-num="8"
            :title="dapp.title"
            :subtitle="dapp.subtitle"
            :tag="dapp.tag"
            :is-new="dapp.isNew"
            :title-icon-type="dapp.titleIconType"
            :title-icon="dapp.titleIcon"
            :right-icon-type="dapp.rightIconType"
            :right-icon="dapp.rightIcon"
            @click.native="routeTo(dapp.path)"
          />
        </v-col>
      </v-row>
    </template>
  </the-wrapper-dapp>
</template>

<script>
import TheWrapperDapp from '@/core/components/TheWrapperDapp';
import bannerImage from '@/assets/images/backgrounds/bg-dapps-center.png';

export default {
  components: { TheWrapperDapp },
  data() {
    return {
      bannerImage: bannerImage,
      bannerText: {
        title: 'Explore MEW Dapps'
      },
      dapps: [
        {
          title: 'ENS manager',
          subtitle: 'Migrate or register ENS domain / subdomain',
          tag: '#Property',
          rightIconType: 'mew',
          rightIcon: 'ensManager',
          path: 'ENSManager'
        },
        {
          title: 'Aave V1',
          subtitle: 'Earn passive income on your deposits and borrow assets',
          tag: '#DeFi',
          rightIconType: 'mew',
          rightIcon: 'aave',
          path: 'Aave'
        },
        {
          title: 'Stake on Eth2',
          subtitle:
            'Stake your ETH on Ethereum 2.0 and watch your rewards grow',
          tag: '#DeFi',
          rightIconType: 'mew',
          rightIcon: 'stake',
          path: 'Staked'
        }
      ]
    };
  },
  methods: {
    routeTo(path) {
      this.$router.push({ name: path });
    }
  }
};
</script>
